// src/components/ui/card.jsx
export default function Card({ children, style: s }) {
  return <div style={{ background: "#1a2035", border: "1px solid #2d3748", borderRadius: 12, padding: 24, ...s }}>{children}</div>;
}