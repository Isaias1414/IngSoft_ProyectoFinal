// src/components/ui/pageheader.jsx
export default function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
      <div>
        <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: 22, fontWeight: 700 }}>{title}</h2>
        {subtitle && <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}