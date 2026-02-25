// src/components/ui/field.jsx
export default function Field({ label, error, children, required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 6, fontWeight: 500 }}>
        {label}
        {required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      {children}
      {error && <p style={{ margin: "4px 0 0", color: "#ef4444", fontSize: 12 }}>{error}</p>}
    </div>
  );
}