export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title ?? "Modal"}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "grid",
        placeItems: "center",
        zIndex: 50,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(720px, 100%)",
          borderRadius: 18,
          border: "1px solid rgba(255,255,255,0.14)",
          background: "rgba(10, 10, 30, 0.92)",
          boxShadow: "0 30px 120px rgba(0,0,0,0.7)",
          padding: 18,
        }}
      >
        {title ? (
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <h3 style={{ margin: 0 }}>{title}</h3>
            <button className="btn2 btn2Ghost" type="button" onClick={onClose}>
              Close
            </button>
          </div>
        ) : null}
        <div style={{ marginTop: 12 }}>{children}</div>
      </div>
    </div>
  );
}
