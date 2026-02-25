// src/pages/dashboard.jsx
import { useApp } from "../context/appcontext";
import Card from "../components/ui/card";
import PageHeader from "../components/ui/pageheader";
import Badge from "../components/ui/badge";
import { fmt, fmtDate } from "../utils/format";

export default function Dashboard() {
  const { socios, cuentas, creditos, diario } = useApp();

  const totalAhorros = cuentas.filter((c) => c.tipo === "ahorro").reduce((s, c) => s + c.saldo, 0);
  const totalAportaciones = cuentas.filter((c) => c.tipo === "aportacion").reduce((s, c) => s + c.saldo, 0);
  const creditosActivos = creditos.filter((c) => c.estado === "aprobado").length;

  const kpis = [
    { label: "Total Ahorros", value: fmt(totalAhorros), icon: "💰", color: "#3b82f6" },
    { label: "Aportaciones Totales", value: fmt(totalAportaciones), icon: "📈", color: "#22c55e" },
    { label: "Créditos Activos", value: creditosActivos, icon: "🏦", color: "#f59e0b" },
    { label: "Movimientos", value: diario.length, icon: "📒", color: "#8b5cf6" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Resumen del sistema" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
        {kpis.map((k, i) => (
          <Card key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: "0 0 8px", color: "#64748b", fontSize: 13 }}>{k.label}</p>
                <p style={{ margin: 0, color: "#f1f5f9", fontSize: 24, fontWeight: 700 }}>{k.value}</p>
              </div>
              <div style={{ width: 44, height: 44, background: `${k.color}22`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                {k.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <h3 style={{ margin: "0 0 16px", color: "#f1f5f9", fontSize: 15 }}>Últimos Movimientos</h3>
          {diario.slice(0, 5).map((d) => (
            <div key={d.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e2d45" }}>
              <div>
                <p style={{ margin: 0, color: "#cbd5e1", fontSize: 13 }}>{d.descripcion}</p>
                <p style={{ margin: 0, color: "#64748b", fontSize: 11 }}>{fmtDate(d.fecha)}</p>
              </div>
              <span style={{ color: "#22c55e", fontWeight: 600 }}>{fmt(d.debe)}</span>
            </div>
          ))}
        </Card>

        <Card>
          <h3 style={{ margin: "0 0 16px", color: "#f1f5f9", fontSize: 15 }}>Socios Recientes</h3>
          {socios.slice(0, 5).map((s) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #1e2d45" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", color: "#93c5fd", fontWeight: 700, fontSize: 14 }}>
                {s.nombre?.[0]}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: "#cbd5e1", fontSize: 13 }}>
                  {s.nombre} {s.apellido}
                </p>
                <p style={{ margin: 0, color: "#64748b", fontSize: 11 }}>Cédula: {s.cedula}</p>
              </div>
              <Badge label={s.activo ? "Activo" : "Inactivo"} color={s.activo ? "success" : "gray"} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}