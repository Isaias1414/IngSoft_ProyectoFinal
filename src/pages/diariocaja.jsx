// src/pages/diariocaja.jsx
import { useState } from "react";
import { useApp } from "../context/appcontext";

import Card from "../components/ui/card";
import Table from "../components/ui/table";
import Modal from "../components/ui/modal";
import Field from "../components/ui/field";
import Input from "../components/ui/input";
import Select from "../components/ui/select";
import Btn from "../components/ui/btn";
import PageHeader from "../components/ui/pageheader";

import { fmt, fmtDate } from "../utils/format";
import { exportCSV } from "../utils/exportCsv";

export default function DiarioCaja() {
  const { diario, planCuentas, showToast, addAsientoContable } = useApp();

  const [modal, setModal] = useState(false);

  const [form, setForm] = useState({
    descripcion: "",
    monto: "",
    tipo: "ingreso",
    cuentaDebe: "1.1.01",
    cuentaHaber: "4.1.01",
    fecha: new Date().toISOString().split("T")[0],
  });

  const registrar = () => {
    if (!form.descripcion || !form.monto || +form.monto <= 0) {
      showToast("Complete los campos", "error");
      return;
    }

    addAsientoContable(form.descripcion, +form.monto, +form.monto, form.cuentaDebe, form.cuentaHaber);
    showToast("Asiento registrado en Diario de Caja");

    setModal(false);
    setForm({
      descripcion: "",
      monto: "",
      tipo: "ingreso",
      cuentaDebe: "1.1.01",
      cuentaHaber: "4.1.01",
      fecha: new Date().toISOString().split("T")[0],
    });
  };

  const cols = [
    { key: "fecha", label: "Fecha", render: fmtDate },
    { key: "descripcion", label: "Descripción" },
    { key: "cuentaDebe", label: "Cta. Debe" },
    { key: "cuentaHaber", label: "Cta. Haber" },
    { key: "debe", label: "Débito", render: (v) => <span style={{ color: "#22c55e" }}>{fmt(v)}</span> },
    { key: "haber", label: "Crédito", render: (v) => <span style={{ color: "#f59e0b" }}>{fmt(v)}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Diario de Caja"
        subtitle="Registro de ingresos y egresos con asientos automáticos"
        action={<Btn onClick={() => setModal(true)}>+ Nuevo Asiento</Btn>}
      />

      <Card>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <Btn
            size="sm"
            variant="ghost"
            onClick={() =>
              exportCSV(diario, "diario-caja.csv", [
                { key: "fecha", label: "Fecha" },
                { key: "descripcion", label: "Descripción" },
                { key: "cuentaDebe", label: "Debe" },
                { key: "cuentaHaber", label: "Haber" },
                { key: "debe", label: "Débito" },
                { key: "haber", label: "Crédito" },
              ])
            }
          >
            ⬇ Exportar CSV
          </Btn>
        </div>

        <Table columns={cols} data={diario} />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title="Nuevo Asiento - Ingresos/Egresos">
        <Field label="Tipo">
          <Select
            value={form.tipo}
            onChange={(v) => {
              setForm((f) => ({
                ...f,
                tipo: v,
                cuentaDebe: v === "ingreso" ? "1.1.01" : "5.1.01",
                cuentaHaber: v === "ingreso" ? "4.1.01" : "1.1.01",
              }));
            }}
          >
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </Select>
        </Field>

        <Field label="Descripción" required>
          <Input value={form.descripcion} onChange={(v) => setForm((f) => ({ ...f, descripcion: v }))} />
        </Field>

        <Field label="Monto" required>
          <Input value={form.monto} onChange={(v) => setForm((f) => ({ ...f, monto: v }))} type="number" />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Cuenta Débito (Debe)">
            <Select value={form.cuentaDebe} onChange={(v) => setForm((f) => ({ ...f, cuentaDebe: v }))}>
              {planCuentas.map((c) => (
                <option key={c.id} value={c.codigo}>
                  {c.codigo} - {c.nombre}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Cuenta Crédito (Haber)">
            <Select value={form.cuentaHaber} onChange={(v) => setForm((f) => ({ ...f, cuentaHaber: v }))}>
              {planCuentas.map((c) => (
                <option key={c.id} value={c.codigo}>
                  {c.codigo} - {c.nombre}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div style={{ background: "#0f2447", borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: 12 }}>Asiento automático generado:</p>
          <p style={{ margin: 0, color: "#93c5fd", fontSize: 13 }}>
            Debe: {form.cuentaDebe} → Haber: {form.cuentaHaber} por {fmt(form.monto || 0)}
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>
            Cancelar
          </Btn>
          <Btn onClick={registrar}>Registrar Asiento</Btn>
        </div>
      </Modal>
    </div>
  );
}