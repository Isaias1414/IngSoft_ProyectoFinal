// src/pages/reportes/reporteaportaciones.jsx
import { useApp } from "../../context/appcontext";
import Card from "../../components/ui/card";
import ReporteBase from "./reportebase";
import Badge from "../../components/ui/badge";
import { fmt, fmtDate } from "../../utils/format";

export default function ReporteAportaciones() {
  const { cuentas, socios } = useApp();

  const data = cuentas
    .filter((c) => c.tipo === "aportacion")
    .map((c) => {
      const s = socios.find((x) => x.id === c.socioId);
      return { ...c, socio: `${s?.nombre || ""} ${s?.apellido || ""}`, cedula: s?.cedula || "" };
    });

  const cols = [
    { key: "cedula", label: "Cédula" },
    { key: "socio", label: "Socio" },
    { key: "numero", label: "N° Cuenta" },
    { key: "saldo", label: "Saldo Aportaciones", render: (v) => <span style={{ color: "#22c55e", fontWeight: 600 }}>{fmt(v)}</span> },
    { key: "fechaApertura", label: "Apertura", render: fmtDate },
    { key: "activa", label: "Estado", render: (v) => <Badge label={v ? "Activa" : "Inactiva"} color={v ? "success" : "gray"} /> },
  ];

  const total = data.reduce((s, c) => s + c.saldo, 0);

  return (
    <div>
      <ReporteBase titulo="Resumen de Aportaciones" data={data} columns={cols} exportName="aportaciones" />
      <Card style={{ marginTop: 16 }}>
        <p style={{ margin: "0 0 4px", color: "#64748b" }}>Total Aportaciones</p>
        <p style={{ margin: 0, color: "#22c55e", fontSize: 26, fontWeight: 700 }}>{fmt(total)}</p>
      </Card>
    </div>
  );
}