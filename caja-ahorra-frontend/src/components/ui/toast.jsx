// src/components/ui/toast.jsx
import { useApp } from "../../context/appcontext";

export default function Toast() {
  const { toast } = useApp();
  if (!toast) return null;

  const colors = { success: "#22c55e", error: "#ef4444", warning: "#f59e0b", info: "#3b82f6" };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: "#1e2533",
        border: `1px solid ${colors[toast.type] || colors.success}`,
        color: "#f1f5f9",
        padding: "14px 20px",
        borderRadius: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        animation: "slideIn 0.3s ease",
        maxWidth: 360,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: colors[toast.type],
          flexShrink: 0,
          boxShadow: `0 0 8px ${colors[toast.type]}`,
        }}
      />
      {toast.msg}
    </div>
  );
}