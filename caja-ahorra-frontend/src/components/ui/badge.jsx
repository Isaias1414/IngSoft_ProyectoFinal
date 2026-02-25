// src/components/ui/badge.jsx
export default function Badge({ label, color }) {
  const colors = { success: "#22c55e", warning: "#f59e0b", error: "#ef4444", info: "#3b82f6", gray: "#6b7280" };
  const c = colors[color] || colors.info;

  return (
    <span
      style={{
        background: `${c}22`,
        color: c,
        border: `1px solid ${c}44`,
        borderRadius: 20,
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      {label}
    </span>
  );
}