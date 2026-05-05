import { profile } from "../src/content/profile.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_LIMITS = {
  name: 100,
  email: 160,
  message: 2000,
};

function cleanField(value, maxLength) {
  return String(value ?? "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function truncate(value, maxLength) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 3))}...`;
}

function getDefaultRecipientEmail() {
  const mailto = profile.socials.find((item) => item.href.startsWith("mailto:"))?.href ?? "";
  return mailto.replace(/^mailto:/, "").trim();
}

function normalizePayload(payload = {}) {
  return {
    name: cleanField(payload.name, FIELD_LIMITS.name),
    email: cleanField(payload.email, FIELD_LIMITS.email).toLowerCase(),
    message: cleanField(payload.message, FIELD_LIMITS.message),
  };
}

function validatePayload(payload) {
  const errors = {};

  if (!payload.name) {
    errors.name = "Nama wajib diisi.";
  } else if (payload.name.length < 2) {
    errors.name = "Nama minimal 2 karakter.";
  }

  if (!payload.email) {
    errors.email = "Email wajib diisi.";
  } else if (!EMAIL_PATTERN.test(payload.email)) {
    errors.email = "Format email belum valid.";
  }

  if (!payload.message) {
    errors.message = "Pesan wajib diisi.";
  } else if (payload.message.length < 10) {
    errors.message = "Pesan minimal 10 karakter.";
  }

  return errors;
}

function getRequestSource(meta = {}) {
  return meta.source || "portfolio-contact-form";
}

function buildPlainTextMessage(payload, meta = {}) {
  return [
    "New portfolio contact submission",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Source: ${getRequestSource(meta)}`,
    `Sent at: ${new Date().toISOString()}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");
}

function buildHtmlMessage(payload, meta = {}) {
  return [
    "<div style=\"font-family:Arial,sans-serif;line-height:1.6;color:#111827\">",
    "<h2 style=\"margin:0 0 16px\">New portfolio contact submission</h2>",
    `<p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>`,
    `<p><strong>Source:</strong> ${escapeHtml(getRequestSource(meta))}</p>`,
    `<p><strong>Sent at:</strong> ${escapeHtml(new Date().toISOString())}</p>`,
    "<hr style=\"border:none;border-top:1px solid #e5e7eb;margin:20px 0\" />",
    `<p style="white-space:pre-wrap;margin:0">${escapeHtml(payload.message)}</p>`,
    "</div>",
  ].join("");
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const to = (process.env.CONTACT_TO_EMAIL?.trim() || getDefaultRecipientEmail()).trim();

  if (!apiKey || !from || !to) return null;

  return { apiKey, from, to };
}

function getDiscordWebhookUrl() {
  return process.env.CONTACT_DISCORD_WEBHOOK_URL?.trim() || "";
}

async function sendViaResend(payload, meta = {}) {
  const config = getResendConfig();
  if (!config) return null;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      subject: `[Portfolio Contact] ${payload.name}`,
      reply_to: payload.email,
      text: buildPlainTextMessage(payload, meta),
      html: buildHtmlMessage(payload, meta),
      tags: [
        { name: "source", value: "portfolio_contact" },
        { name: "channel", value: "website_form" },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend delivery failed (${response.status}): ${truncate(errorText, 300)}`);
  }

  return { provider: "resend" };
}

async function sendViaDiscord(payload, meta = {}) {
  const webhookUrl = getDiscordWebhookUrl();
  if (!webhookUrl) return null;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "Portfolio Contact",
      allowed_mentions: { parse: [] },
      embeds: [
        {
          title: "New Contact Form Message",
          color: 5793266,
          description: truncate(payload.message, 4000),
          fields: [
            { name: "Name", value: payload.name, inline: true },
            { name: "Email", value: payload.email, inline: true },
            { name: "Source", value: getRequestSource(meta), inline: true },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Discord delivery failed (${response.status}): ${truncate(errorText, 300)}`);
  }

  return { provider: "discord" };
}

export async function processContactSubmission(rawPayload, meta = {}) {
  const payload = normalizePayload(rawPayload);
  const errors = validatePayload(payload);

  if (Object.keys(errors).length > 0) {
    return {
      status: 400,
      body: {
        ok: false,
        message: "Tolong cek lagi data contact yang kamu isi.",
        errors,
      },
    };
  }

  const deliveries = [];

  if (getResendConfig()) {
    deliveries.push(sendViaResend(payload, meta));
  }

  if (getDiscordWebhookUrl()) {
    deliveries.push(sendViaDiscord(payload, meta));
  }

  if (!deliveries.length) {
    return {
      status: 500,
      body: {
        ok: false,
        message:
          "Penerima pesan belum dikonfigurasi. Tambahkan CONTACT_DISCORD_WEBHOOK_URL pada environment agar form bisa mengirim ke Discord.",
      },
    };
  }

  const results = await Promise.allSettled(deliveries);
  const successful = results.filter((result) => result.status === "fulfilled");
  const failed = results.filter((result) => result.status === "rejected");

  failed.forEach((result) => {
    console.error("[contact] delivery error:", result.reason);
  });

  if (!successful.length) {
    return {
      status: 502,
      body: {
        ok: false,
        message: "Pesan belum berhasil dikirim ke inbox. Coba lagi beberapa saat.",
      },
    };
  }

  return {
    status: 200,
    body: {
      ok: true,
      message: "Pesan berhasil dikirim. Terima kasih, saya akan membalas secepatnya.",
    },
  };
}
