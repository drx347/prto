import { useState } from "react";

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 6h16v12H4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="m4 7 8 6 8-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const EMPTY_ERRORS = {};

export default function ContactForm({
  discordHandle = "@exotickic",
}) {
  const [submitState, setSubmitState] = useState({
    status: "idle",
    message: "",
    errors: EMPTY_ERRORS,
  });

  const isSubmitting = submitState.status === "submitting";

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    setSubmitState({
      status: "submitting",
      message: "Mengirim pesan...",
      errors: EMPTY_ERRORS,
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);
      const errors = data?.errors && typeof data.errors === "object" ? data.errors : EMPTY_ERRORS;

      if (!response.ok || !data?.ok) {
        setSubmitState({
          status: "error",
          message: data?.message || "Pesan gagal dikirim. Coba lagi sebentar.",
          errors,
        });
        return;
      }

      form.reset();
      setSubmitState({
        status: "success",
        message: data.message || "Pesan berhasil dikirim.",
        errors: EMPTY_ERRORS,
      });
    } catch {
      setSubmitState({
        status: "error",
        message: "Form pesan sedang tidak bisa diproses sekarang. Coba lagi beberapa saat.",
        errors: EMPTY_ERRORS,
      });
    }
  }

  return (
    <form className="formV2" onSubmit={handleSubmit}>
      <label className="fieldV2">
        <span className="labelV2">Nama</span>
        <input
          className="inputV2"
          name="name"
          autoComplete="name"
          minLength={2}
          maxLength={100}
          required
          aria-invalid={submitState.errors.name ? "true" : "false"}
        />
        {submitState.errors.name ? (
          <p className="contactFormNote contactFormNote--error">{submitState.errors.name}</p>
        ) : null}
      </label>

      <label className="fieldV2">
        <span className="labelV2">Email</span>
        <input
          className="inputV2"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={160}
          required
          aria-invalid={submitState.errors.email ? "true" : "false"}
        />
        {submitState.errors.email ? (
          <p className="contactFormNote contactFormNote--error">{submitState.errors.email}</p>
        ) : null}
      </label>

      <label className="fieldV2">
        <span className="labelV2">Pesan</span>
        <textarea
          className="inputV2 textareaV2"
          name="message"
          rows={5}
          minLength={10}
          maxLength={2000}
          required
          aria-invalid={submitState.errors.message ? "true" : "false"}
        />
        {submitState.errors.message ? (
          <p className="contactFormNote contactFormNote--error">{submitState.errors.message}</p>
        ) : null}
      </label>

      <button className="btn2" type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
        <span className="btnIcon" aria-hidden="true">
          <MailIcon />
        </span>
      </button>

      <p
        className={[
          "fine",
          "contactFormStatus",
          submitState.status === "success" ? "contactFormStatus--success" : "",
          submitState.status === "error" ? "contactFormStatus--error" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        role="status"
        aria-live="polite"
      >
        {submitState.message || "Isi form di bawah untuk kirim pesan langsung ke saya."}
      </p>

      <p className="fine muted">
        Pesan dari form ini akan langsung masuk ke Discord <b>{discordHandle}</b>.
      </p>
    </form>
  );
}
