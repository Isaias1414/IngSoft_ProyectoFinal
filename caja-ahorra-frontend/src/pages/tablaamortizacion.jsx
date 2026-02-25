// src/pages/tablaamortizacion.jsx
import { useState } from "react";
import { useApp } from "../context/appcontext";

import Card from "../components/ui/card";
import Field from "../components/ui/field";
import Select from "../components/ui/select";
import Btn from "../components/ui/btn";
import PageHeader from "../components/ui/pageheader";

import { fmt } from "../utils/format";
import { calcAmortizacion } from "../utils/finance";
import { exportCSV } from "../utils/exportCsv";

export default function TablaAmortizacion() {
  const { creditos, socios } = useApp();

  const [creditoId, setCreditoId] = useState("");

  const cred = creditos.find((c) => c.id === +creditoId);
  const tabla = cred ? calcAmortizacion(cred.monto, cred.plazo, cred.tasa).tabla : [];
  const socio = cred ? socios.find((s) => s.id === cred.socioId) : null;

  return (
    <div>
      <PageHeader title="Tabla de Amortización" />

      <Card style={{ marginBottom: 20 }}>
        <Field label="Seleccionar Crédito">
          <Select value={creditoId} onChange={setCreditoId}>
            <option value="">Seleccionar...</option>
            {creditos
              .filter((c) => c.estado === "aprobado")
              .map((c) => {
                const s = socios.find((x) => x.id === c.socioId);
                return (
                  <option key={c.id} value={c.id}>
                    {s?.nombre} {s?.apellido} - {fmt(c.monto)} - {c.plazo} meses
                  </option>
                );
              })}
          </Select>
        </Field>

        {cred && (
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { l: "Socio", v: `${socio?.nombre} ${socio?.apellido}` },
              { l: "Monto", v: fmt(cred.monto) },
              { l: "Plazo", v: `${cred.plazo} meses` },
              { l: "Tasa", v: `${cred.tasa}% anual` },
              { l: "Cuota Mensual", v: fmt(cred.cuotaMensual) },
            ].map((item) => (
              <div key={item.l} style={{ background: "#0a0f1e", borderRadius: 8, padding: "10px 16px" }}>
                <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: 11 }}>{item.l}</p>
                <p style={{ margin: 0, color: "#f1f5f9", fontWeight: 600 }}>{item.v}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {tabla.length > 0 && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: "#f1f5f9", fontSize: 15 }}>Detalle de cuotas</h3>
            <Btn
              size="sm"
              variant="ghost"
              onClick={() =>
                exportCSV(tabla, `amortizacion-${creditoId}.csv`, [
                  { key: "cuota", label: "Cuota" },
                  { key: "pago", label: "Pago" },
                  { key: "capital", label: "Capital" },
                  { key: "interes", label: "Interés" },
                  { key: "saldo", label: "Saldo" },
                ])
              }
            >
              ⬇ Exportar CSV
            </Btn>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0f1624" }}>
                  {["#", "Pago Total", "Capital", "Interés", "Saldo"].map((h) => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "#64748b", fontSize: 12, fontWeight: 700 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {tabla.map((r) => (
                  <tr key={r.cuota} style={{ borderTop: "1px solid #1e293b" }}>
                    <td style={{ padding: "10px 14px", color: "#64748b" }}>{r.cuota}</td>
                    <td style={{ padding: "10px 14px", color: "#f1f5f9" }}>{fmt(r.pago)}</td>
                    <td style={{ padding: "10px 14px", color: "#3b82f6" }}>{fmt(r.capital)}</td>
                    <td style={{ padding: "10px 14px", color: "#f59e0b" }}>{fmt(r.interes)}</td>
                    <td style={{ padding: "10px 14px", color: "#22c55e" }}>{fmt(r.saldo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}