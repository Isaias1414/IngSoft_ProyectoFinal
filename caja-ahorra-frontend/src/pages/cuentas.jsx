// src/pages/cuentas.jsx
import { useState } from "react";
import { useApp } from "../context/appcontext";

import Card from "../components/ui/card";
import Table from "../components/ui/table";
import Modal from "../components/ui/modal";
import Field from "../components/ui/field";
import Input from "../components/ui/input";
import Select from "../components/ui/select";
import Btn from "../components/ui/btn";
import Badge from "../components/ui/badge";
import PageHeader from "../components/ui/pageheader";
import { fmt, fmtDate } from "../utils/format";

export default function Cuentas() {
  const { cuentas, setCuentas, socios, showToast } = useApp();

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    socioId: "",
    numero: "",
    tipo: "ahorro",
    saldo: 0,
    fechaApertura: new Date().toISOString().split("T")[0],
    activa: true,
  });

  const save = () => {
    if (!form.socioId || !form.numero) {
      showToast("Campos requeridos", "error");
      return;
    }

    if (editing) {
      setCuentas((c) =>
        c.map((x) => (x.id === editing.id ? { ...x, ...form, socioId: +form.socioId, saldo: +form.saldo } : x))
      );
    } else {
      setCuentas((c) => [...c, { ...form, id: Date.now(), socioId: +form.socioId, saldo: +form.saldo }]);
    }

    showToast("Cuenta guardada");
    setModal(false);
  };

  const cols = [
    { key: "numero", label: "N° Cuenta" },
    {
      key: "socioId",
      label: "Socio",
      render: (v) => {
        const s = socios.find((x) => x.id === v);
        return s ? `${s.nombre} ${s.apellido}` : "-";
      },
    },
    { key: "tipo", label: "Tipo", render: (v) => <Badge label={v} color={v === "ahorro" ? "info" : "warning"} /> },
    { key: "saldo", label: "Saldo", render: (v) => <span style={{ color: "#22c55e", fontWeight: 600 }}>{fmt(v)}</span> },
    { key: "fechaApertura", label: "Apertura", render: fmtDate },
    { key: "activa", label: "Estado", render: (v) => <Badge label={v ? "Activa" : "Inactiva"} color={v ? "success" : "gray"} /> },
  ];

  const open = (c = null) => {
    setEditing(c);
    setForm(
      c
        ? { ...c }
        : {
            socioId: socios[0]?.id || "",
            numero: `AH-${Date.now().toString().slice(-4)}-2024`,
            tipo: "ahorro",
            saldo: 0,
            fechaApertura: new Date().toISOString().split("T")[0],
            activa: true,
          }
    );
    setModal(true);
  };

  return (
    <div>
      <PageHeader title="Cuentas" subtitle="Gestión de cuentas de socios" action={<Btn onClick={() => open()}>+ Nueva Cuenta</Btn>} />

      <Card>
        <Table columns={cols} data={cuentas} onEdit={open} />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Editar Cuenta" : "Nueva Cuenta"}>
        <Field label="Socio" required>
          <Select value={form.socioId} onChange={(v) => setForm((f) => ({ ...f, socioId: v }))}>
            <option value="">Seleccionar...</option>
            {socios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre} {s.apellido} - {s.cedula}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Número de Cuenta" required>
          <Input value={form.numero} onChange={(v) => setForm((f) => ({ ...f, numero: v }))} />
        </Field>

        <Field label="Tipo">
          <Select value={form.tipo} onChange={(v) => setForm((f) => ({ ...f, tipo: v }))}>
            <option value="ahorro">Ahorro</option>
            <option value="aportacion">Aportación</option>
          </Select>
        </Field>

        <Field label="Saldo inicial">
          <Input value={form.saldo} onChange={(v) => setForm((f) => ({ ...f, saldo: v }))} type="number" />
        </Field>

        <Field label="Fecha apertura">
          <Input value={form.fechaApertura} onChange={(v) => setForm((f) => ({ ...f, fechaApertura: v }))} type="date" />
        </Field>

        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>
            Cancelar
          </Btn>
          <Btn onClick={save}>Guardar</Btn>
        </div>
      </Modal>
    </div>
  );
}