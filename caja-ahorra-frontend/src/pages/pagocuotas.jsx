// src/pages/pagocuotas.jsx
import { useState } from "react";
import { useApp } from "../context/appcontext";

import Card from "../components/ui/card";
import Field from "../components/ui/field";
import Input from "../components/ui/input";
import Select from "../components/ui/select";
import Btn from "../components/ui/btn";
import PageHeader from "../components/ui/pageheader";

import { fmt } from "../utils/format";

export default function PagoCuotas() {
  const { creditos, setCreditos, socios, showToast, addAsientoContable } = useApp();

  const [creditoId, setCreditoId] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);

  const cred = creditos.find((c) => c.id === +creditoId);
  const socio = cred ? socios.find((s) => s.id === cred.socioId) : null;

  const registrar = () => {
    if (!cred || !monto || +monto <= 0) {
      showToast("Complete los datos", "error");
      return;
    }

    const nuevoPendiente = Math.max(0, cred.saldoPendiente - +monto);

    setCreditos((c) =>
      c.map((x) =>
        x.id === cred.id
          ? { ...x, saldoPendiente: nuevoPendiente, estado: nuevoPendiente <= 0 ? "cancelado" : "aprobado" }
          : x
      )
    );

    addAsientoContable(`Pago cuota - ${socio?.nombre} ${socio?.apellido}`, +monto, +monto, "1.1.01", "1.2.01");
    showToast("Pago registrado");
    setMonto("");
    setCreditoId("");
  };

  const activosCreditos = creditos.filter((c) => c.estado === "aprobado");

  return (
    <div>
      <PageHeader title="Registro de Pago de Cuotas" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card>
          <Field label="Crédito">
            <Select value={creditoId} onChange={setCreditoId}>
              <option value="">Seleccionar crédito...</option>
              {activosCreditos.map((c) => {
                const s = socios.find((x) => x.id === c.socioId);
                return (
                  <option key={c.id} value={c.id}>
                    {s?.nombre} {s?.apellido} - Saldo: {fmt(c.saldoPendiente)}
                  </option>
                );
              })}
            </Select>
          </Field>

          {cred && (
            <div style={{ background: "#0a0f1e", borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#64748b", fontSize: 12 }}>Cuota sugerida</span>
                <span style={{ color: "#3b82f6", fontWeight: 600 }}>{fmt(cred.cuotaMensual)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b", fontSize: 12 }}>Saldo pendiente</span>
                <span style={{ color: "#f59e0b", fontWeight: 600 }}>{fmt(cred.saldoPendiente)}</span>
              </div>
            </div>
          )}

          <Field label="Monto a pagar">
            <Input value={monto} onChange={setMonto} type="number" placeholder="0.00" />
          </Field>

          <Field label="Fecha">
            <Input value={fecha} onChange={setFecha} type="date" />
          </Field>

          <Btn variant="success" onClick={registrar} style={{ width: "100%", justifyContent: "center", display: "flex" }}>
            💰 Registrar Pago
          </Btn>
        </Card>

        <Card>
          <h3 style={{ margin: "0 0 16px", color: "#f1f5f9", fontSize: 15 }}>Créditos Activos</h3>

          {activosCreditos.map((c) => {
            const s = socios.find((x) => x.id === c.socioId);
            const pct = Math.round(((c.monto - c.saldoPendiente) / c.monto) * 100);

            return (
              <div key={c.id} style={{ marginBottom: 16, padding: 14, background: "#0a0f1e", borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <p style={{ margin: 0, color: "#cbd5e1", fontSize: 13, fontWeight: 600 }}>
                    {s?.nombre} {s?.apellido}
                  </p>
                  <span style={{ color: "#22c55e", fontSize: 12 }}>{pct}% pagado</span>
                </div>

                <div style={{ background: "#1e293b", borderRadius: 4, height: 6, overflow: "hidden" }}>
                  <div style={{ background: "#22c55e", height: "100%", width: `${pct}%`, borderRadius: 4 }} />
                </div>

                <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 11 }}>
                  Saldo: {fmt(c.saldoPendiente)} / Cuota: {fmt(c.cuotaMensual)}
                </p>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}