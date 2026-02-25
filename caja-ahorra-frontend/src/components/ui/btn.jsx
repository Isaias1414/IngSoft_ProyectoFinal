// src/components/ui/btn.jsx
export default function Btn({ children, onClick, variant = "primary", size = "md", disabled, style: s }) {
  const variants = {
    primary: { background: "#3b82f6", color: "#fff", border: "none" },
    success: { background: "#22c55e", color: "#fff", border: "none" },
    danger: { background: "#ef4444", color: "#fff", border: "none" },
    ghost: { background: "transparent", color: "#94a3b8", border: "1px solid #2d3748" },
    warning: { background: "#f59e0b", color: "#fff", border: "none" },
  };

  const sizes = {
    sm: { padding: "6px 12px", fontSize: 12 },
    md: { padding: "9px 18px", fontSize: 14 },
    lg: { padding: "12px 24px", fontSize: 15 },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: 8,
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 600,
        transition: "opacity 0.2s",
        opacity: disabled ? 0.5 : 1,
        ...s,
      }}
    >
      {children}
    </button>
  );
}