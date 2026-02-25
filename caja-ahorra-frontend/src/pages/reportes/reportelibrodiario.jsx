// src/pages/reportes/reportelibrodiario.jsx
import { useApp } from "../../context/appcontext";
import Card from "../../components/ui/card";
import ReporteBase from "./reportebase";
import { fmt, fmtDate } from "../../utils/format";

export default function ReporteLibroDiario() {
  const { diario } = useApp();

  const cols = [
    { key: "fecha", label: "Fecha", render: fmtDate },
    { key: "descripcion", label: "Descripción" },
    { key: "cuentaDebe", label: "Cuenta Debe" },
    { key: "cuentaHaber", label: "Cuenta Haber" },
    { key: "debe", label: "Débito", render: (v) => fmt(v) },
    { key: "haber", label: "Crédito", render: (v) => fmt(v) },
  ];

  const totalDebe = diario.reduce((s, d) => s + d.debe, 0);
  const totalHaber = diario.reduce((s, d) => s + d.haber, 0);

  return (
    <div>
      <ReporteBase titulo="Libro Diario" data={diario} columns={cols} exportName="libro-diario" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <Card>
          <p style={{ margin: "0 0 4px", color: "#64748b" }}>Total Débitos</p>
          <p style={{ margin: 0, color: "#22c55e", fontSize: 22, fontWeight: 700 }}>{fmt(totalDebe)}</p>
        </Card>
        <Card>
          <p style={{ margin: "0 0 4px", color: "#64748b" }}>Total Créditos</p>
          <p style={{ margin: 0, color: "#f59e0b", fontSize: 22, fontWeight: 700 }}>{fmt(totalHaber)}</p>
        </Card>
      </div>
    </div>
  );
}