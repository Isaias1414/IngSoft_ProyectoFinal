// src/components/ui/modal.jsx
export default function Modal({ open, onClose, title, children, size = "md" }) {
  if (!open) return null;
  const widths = { sm: 400, md: 560, lg: 720, xl: 900 };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#1a2035",
          border: "1px solid #2d3748",
          borderRadius: 12,
          width: "100%",
          maxWidth: widths[size],
          maxHeight: "90vh",
          overflow: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 24px",
            borderBottom: "1px solid #2d3748",
          }}
        >
          <h3 style={{ margin: 0, color: "#f1f5f9", fontSize: 16, fontWeight: 600 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 20, lineHeight: 1 }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}