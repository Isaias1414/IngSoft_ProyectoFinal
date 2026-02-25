// src/components/ui/input.jsx
export default function Input({ value, onChange, placeholder, type = "text", style: s }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        background: "#0f1624",
        border: "1px solid #2d3748",
        borderRadius: 8,
        padding: "10px 14px",
        color: "#f1f5f9",
        fontSize: 14,
        outline: "none",
        boxSizing: "border-box",
        ...s,
      }}
    />
  );
}