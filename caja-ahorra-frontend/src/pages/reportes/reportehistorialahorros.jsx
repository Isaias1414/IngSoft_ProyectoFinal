// src/pages/reportes/reportehistorialahorros.jsx
import { useApp } from "../../context/appcontext";
import ReporteBase from "./reportebase";
import Badge from "../../components/ui/badge";
import { fmt, fmtDate } from "../../utils/format";

export default function ReporteHistorialAhorros() {
  const { movimientos, cuentas, socios } = useApp();

  const data = movimientos.map((m) => {
    const c = cuentas.find((x) => x.id === m.cuentaId);
    const s = socios.find((x) => x.id === c?.socioId);
    return { ...m, socio: `${s?.nombre || ""} ${s?.apellido || ""}`, numeroCuenta: c?.numero || "" };
  });

  const cols = [
    { key: "fecha", label: "Fecha", render: fmtDate },
    { key: "socio", label: "Socio" },
    { key: "numeroCuenta", label: "N° Cuenta" },
    { key: "tipo", label: "Tipo", render: (v) => <Badge label={v} color={v === "deposito" ? "success" : "warning"} /> },
    { key: "monto", label: "Monto", render: (v) => fmt(v) },
    { key: "saldoDespues", label: "Saldo", render: (v) => fmt(v) },
  ];

  return <ReporteBase titulo="Historial de Ahorros" data={data} columns={cols} exportName="historial-ahorros" />;
}