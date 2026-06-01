import { processContactSubmission } from "../server/contact.js";

function parseJsonBody(body) {
  if (!body) return {};
  if (typeof body === "object") return body;

  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({
      ok: false,
      message: "This endpoint does not support that method.",
    });
    return;
  }

  const payload = parseJsonBody(req.body);

  if (payload === null) {
    res.status(400).json({
      ok: false,
      message: "The JSON payload is invalid.",
    });
    return;
  }

  try {
    const result = await processContactSubmission(payload, {
      source: "vercel-function",
    });

    res.status(result.status).json(result.body);
  } catch (error) {
    console.error("[contact] unexpected error:", error);
    res.status(500).json({
      ok: false,
      message: "An internal error occurred while processing the contact form.",
    });
  }
}
