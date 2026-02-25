// src/pages/plancuentas.jsx
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

export default function PlanCuentas() {
  const { planCuentas, setPlanCuentas, showToast } = useApp();

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ codigo: "", nombre: "", tipo: "Activo", nivel: 3 });

  const save = () => {
    if (!form.codigo || !form.nombre) {
      showToast("Campos requeridos", "error");
      return;
    }

    if (editing) {
      setPlanCuentas((p) => p.map((x) => (x.id === editing.id ? { ...x, ...form, nivel: +form.nivel } : x)));
    } else {
      setPlanCuentas((p) => [...p, { ...form, id: Date.now(), nivel: +form.nivel }]);
    }

    showToast("Cuenta guardada");
    setModal(false);
  };

  const open = (item = null) => {
    setEditing(item);
    setForm(item ? { codigo: item.codigo, nombre: item.nombre, tipo: item.tipo, nivel: item.nivel } : { codigo: "", nombre: "", tipo: "Activo", nivel: 3 });
    setModal(true);
  };

  const cols = [
    { key: "codigo", label: "Código" },
    { key: "nombre", label: "Nombre" },
    { key: "tipo", label: "Tipo", render: (v) => <Badge label={v} color={v === "Activo" ? "info" : v === "Pasivo" ? "warning" : v === "Ingreso" ? "success" : "error"} /> },
    { key: "nivel", label: "Nivel" },
  ];

  return (
    <div>
      <PageHeader title="Plan de Cuentas" action={<Btn onClick={() => open()}>+ Nueva Cuenta</Btn>} />

      <Card>
        <Table
          columns={cols}
          data={planCuentas}
          onEdit={open}
          onDelete={(c) => {
            setPlanCuentas((p) => p.filter((x) => x.id !== c.id));
            showToast("Cuenta eliminada", "warning");
          }}
        />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Editar Cuenta" : "Nueva Cuenta"}>
        <Field label="Código" required>
          <Input value={form.codigo} onChange={(v) => setForm((f) => ({ ...f, codigo: v }))} placeholder="1.1.01" />
        </Field>

        <Field label="Nombre" required>
          <Input value={form.nombre} onChange={(v) => setForm((f) => ({ ...f, nombre: v }))} />
        </Field>

        <Field label="Tipo">
          <Select value={form.tipo} onChange={(v) => setForm((f) => ({ ...f, tipo: v }))}>
            {["Activo", "Pasivo", "Ingreso", "Egreso", "Patrimonio"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </Field>

        <Field label="Nivel">
          <Input value={form.nivel} onChange={(v) => setForm((f) => ({ ...f, nivel: v }))} type="number" />
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