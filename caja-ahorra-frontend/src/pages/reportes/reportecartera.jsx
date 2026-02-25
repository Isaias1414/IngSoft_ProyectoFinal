// src/pages/reportes/reportecartera.jsx
import { useApp } from "../../context/appcontext";
import Card from "../../components/ui/card";
import ReporteBase from "./reportebase";
import Badge from "../../components/ui/badge";
import { fmt, fmtDate } from "../../utils/format";

export default function ReporteCartera() {
  const { creditos, socios } = useApp();

  const data = creditos.map((c) => {
    const s = socios.find((x) => x.id === c.socioId);
    return { ...c, socio: `${s?.nombre || ""} ${s?.apellido || ""}` };
  });

  const cols = [
    { key: "socio", label: "Socio" },
    { key: "monto", label: "Monto Original", render: (v) => fmt(v) },
    { key: "saldoPendiente", label: "Saldo Pendiente", render: (v) => <span style={{ color: "#f59e0b" }}>{fmt(v)}</span> },
    { key: "cuotaMensual", label: "Cuota", render: (v) => fmt(v) },
    { key: "plazo", label: "Plazo", render: (v) => `${v} m` },
    { key: "tasa", label: "Tasa", render: (v) => `${v}%` },
    { key: "estado", label: "Estado", render: (v) => <Badge label={v} color={v === "aprobado" ? "success" : v === "pendiente" ? "warning" : "gray"} /> },
    { key: "fecha", label: "Fecha", render: fmtDate },
  ];

  const totalCartera = creditos.reduce((s, c) => s + c.saldoPendiente, 0);

  return (
    <div>
      <ReporteBase titulo="Cartera de Créditos" data={data} columns={cols} exportName="cartera-creditos" />
      <Card style={{ marginTop: 16 }}>
        <p style={{ margin: "0 0 4px", color: "#64748b" }}>Total Cartera Activa</p>
        <p style={{ margin: 0, color: "#3b82f6", fontSize: 26, fontWeight: 700 }}>{fmt(totalCartera)}</p>
      </Card>
    </div>
  );
}