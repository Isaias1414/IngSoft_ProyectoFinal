// src/pages/transaccionpage.jsx
import { useState } from "react";
import { useApp } from "../context/appcontext";

import Card from "../components/ui/card";
import Field from "../components/ui/field";
import Input from "../components/ui/input";
import Select from "../components/ui/select";
import Btn from "../components/ui/btn";
import PageHeader from "../components/ui/pageheader";

import { fmt } from "../utils/format";

export default function TransaccionPage({ titulo, tipoTx, tipoCuenta, ctaDebe, ctaHaber }) {
  const { cuentas, setCuentas, setMovimientos, socios, showToast, addAsientoContable } = useApp();

  const [form, setForm] = useState({
    cuentaId: "",
    monto: "",
    descripcion: "",
    fecha: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});

  const cuentasFiltradas = cuentas.filter((c) => c.tipo === tipoCuenta && c.activa);
  const cuentaSeleccionada = cuentas.find((c) => c.id === +form.cuentaId);
  const socio = socios.find((s) => s.id === cuentaSeleccionada?.socioId);

  const validate = () => {
    const e = {};
    if (!form.cuentaId) e.cuentaId = "Seleccione cuenta";
    if (!form.monto || +form.monto <= 0) e.monto = "Monto inválido";
    if (tipoTx === "retiro" && cuentaSeleccionada && +form.monto > cuentaSeleccionada.saldo) e.monto = "Saldo insuficiente";
    return e;
  };

  const registrar = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    const nuevoSaldo = tipoTx === "deposito" ? cuentaSeleccionada.saldo + +form.monto : cuentaSeleccionada.saldo - +form.monto;

    setCuentas((c) => c.map((x) => (x.id === +form.cuentaId ? { ...x, saldo: nuevoSaldo } : x)));

    const mov = {
      id: Date.now(),
      cuentaId: +form.cuentaId,
      tipo: tipoTx,
      monto: +form.monto,
      fecha: form.fecha,
      descripcion: form.descripcion || titulo,
      saldoDespues: nuevoSaldo,
    };

    setMovimientos((m) => [mov, ...m]);

    const desc = `${titulo} - ${socio?.nombre} ${socio?.apellido} - Cta: ${cuentaSeleccionada?.numero}`;

    // asiento: invierte debe/haber según depósito o retiro
    addAsientoContable(
      desc,
      +form.monto,
      +form.monto,
      tipoTx === "deposito" ? ctaDebe : ctaHaber,
      tipoTx === "deposito" ? ctaHaber : ctaDebe
    );

    showToast(`${titulo} registrado exitosamente`);
    setForm({ cuentaId: "", monto: "", descripcion: "", fecha: new Date().toISOString().split("T")[0] });
    setErrors({});
  };

  return (
    <div>
      <PageHeader title={titulo} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card>
          <h3 style={{ margin: "0 0 20px", color: "#f1f5f9", fontSize: 15 }}>Nueva Transacción</h3>

          <Field label="Cuenta" error={errors.cuentaId} required>
            <Select value={form.cuentaId} onChange={(v) => setForm((f) => ({ ...f, cuentaId: v }))}>
              <option value="">Seleccionar cuenta...</option>
              {cuentasFiltradas.map((c) => {
                const s = socios.find((x) => x.id === c.socioId);
                return (
                  <option key={c.id} value={c.id}>
                    {c.numero} - {s?.nombre} {s?.apellido}
                  </option>
                );
              })}
            </Select>
          </Field>

          <Field label="Monto (USD)" error={errors.monto} required>
            <Input value={form.monto} onChange={(v) => setForm((f) => ({ ...f, monto: v }))} type="number" placeholder="0.00" />
          </Field>

          <Field label="Fecha">
            <Input value={form.fecha} onChange={(v) => setForm((f) => ({ ...f, fecha: v }))} type="date" />
          </Field>

          <Field label="Descripción">
            <Input value={form.descripcion} onChange={(v) => setForm((f) => ({ ...f, descripcion: v }))} placeholder="Descripción opcional..." />
          </Field>

          <Btn variant={tipoTx === "deposito" ? "success" : "warning"} onClick={registrar} style={{ width: "100%", justifyContent: "center", display: "flex" }}>
            {tipoTx === "deposito" ? "✅ Registrar Depósito" : "⚠️ Registrar Retiro"}
          </Btn>
        </Card>

        {cuentaSeleccionada && (
          <Card>
            <h3 style={{ margin: "0 0 20px", color: "#f1f5f9", fontSize: 15 }}>Información de Cuenta</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "#0a0f1e", borderRadius: 10, padding: 16 }}>
                <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: 12 }}>Socio</p>
                <p style={{ margin: 0, color: "#f1f5f9", fontWeight: 600 }}>
                  {socio?.nombre} {socio?.apellido}
                </p>
              </div>

              <div style={{ background: "#0a0f1e", borderRadius: 10, padding: 16 }}>
                <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: 12 }}>N° Cuenta</p>
                <p style={{ margin: 0, color: "#f1f5f9" }}>{cuentaSeleccionada.numero}</p>
              </div>

              <div style={{ background: "#0f2447", borderRadius: 10, padding: 16 }}>
                <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: 12 }}>Saldo Actual</p>
                <p style={{ margin: 0, color: "#22c55e", fontSize: 22, fontWeight: 700 }}>{fmt(cuentaSeleccionada.saldo)}</p>
              </div>

              {form.monto > 0 && (
                <div style={{ background: "#0f2447", borderRadius: 10, padding: 16, border: "1px solid #3b82f620" }}>
                  <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: 12 }}>Saldo después de operación</p>
                  <p style={{ margin: 0, color: tipoTx === "deposito" ? "#22c55e" : "#f59e0b", fontSize: 18, fontWeight: 700 }}>
                    {fmt(tipoTx === "deposito" ? cuentaSeleccionada.saldo + +form.monto : cuentaSeleccionada.saldo - +form.monto)}
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}