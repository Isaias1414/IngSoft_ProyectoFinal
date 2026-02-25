// src/components/ui/select.jsx
export default function Select({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        background: "#0f1624",
        border: "1px solid #2d3748",
        borderRadius: 8,
        padding: "10px 14px",
        color: "#f1f5f9",
        fontSize: 14,
        outline: "none",
      }}
    >
      {children}
    </select>
  );
}