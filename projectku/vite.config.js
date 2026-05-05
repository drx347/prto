import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { processContactSubmission } from "./server/contact.js";

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";

    req.on("data", (chunk) => {
      raw += chunk;

      if (raw.length > 1_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });

    req.on("end", () => {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    req.on("error", reject);
  });
}

function contactApiPlugin() {
  return {
    name: "contact-api-dev",
    configureServer(server) {
      server.middlewares.use("/api/contact", async (req, res, next) => {
        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (req.method !== "POST") {
          sendJson(res, 405, {
            ok: false,
            message: "Method tidak didukung untuk endpoint ini.",
          });
          return;
        }

        try {
          const payload = await readJsonBody(req);
          const result = await processContactSubmission(payload, {
            source: "vite-dev-server",
          });

          sendJson(res, result.status, result.body);
        } catch (error) {
          if (error.message === "Invalid JSON") {
            sendJson(res, 400, {
              ok: false,
              message: "Payload JSON tidak valid.",
            });
            return;
          }

          console.error("[contact] dev middleware error:", error);
          sendJson(res, 500, {
            ok: false,
            message: "Terjadi error internal saat memproses contact form.",
          });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  const buildId = new Date().toISOString();

  return {
    define: {
      __APP_BUILD_ID__: JSON.stringify(buildId),
    },
    plugins: [react(), contactApiPlugin()],
  };
});
