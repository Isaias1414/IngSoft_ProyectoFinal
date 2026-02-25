// src/pages/socios.jsx
import { useState } from "react";
import { useApp } from "../context/appcontext";

import Card from "../components/ui/card";
import Table from "../components/ui/table";
import Modal from "../components/ui/modal";
import Field from "../components/ui/field";
import Input from "../components/ui/input";
import Btn from "../components/ui/btn";
import Badge from "../components/ui/badge";
import PageHeader from "../components/ui/pageheader";

import { fmtDate } from "../utils/format";
import { validarCedula } from "../utils/validators";

export default function Socios() {
  const { socios, setSocios, showToast } = useApp();

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [errors, setErrors] = useState({});

  const emptyForm = {
    cedula: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    fechaIngreso: new Date().toISOString().split("T")[0],
    activo: true,
    direccion: "",
  };

  const [form, setForm] = useState(emptyForm);

  const validate = () => {
    const e = {};
    if (!form.cedula) e.cedula = "Requerida";
    else if (!validarCedula(form.cedula)) e.cedula = "Cédula inválida";
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.apellido.trim()) e.apellido = "Requerido";
    if (!form.telefono) e.telefono = "Requerido";
    return e;
  };

  const save = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    if (editing) {
      setSocios((s) => s.map((x) => (x.id === editing.id ? { ...x, ...form } : x)));
      showToast("Socio actualizado");
    } else {
      setSocios((s) => [...s, { ...form, id: Date.now() }]);
      showToast("Socio registrado");
    }

    setModal(false);
  };

  const open = (s = null) => {
    setEditing(s);
    setErrors({});
    setForm(s ? { ...s } : emptyForm);
    setModal(true);
  };

  const cols = [
    { key: "cedula", label: "Cédula" },
    { key: "nombre", label: "Nombre", render: (v, r) => `${v} ${r.apellido}` },
    { key: "telefono", label: "Teléfono" },
    { key: "email", label: "Email" },
    { key: "fechaIngreso", label: "Ingreso", render: fmtDate },
    { key: "activo", label: "Estado", render: (v) => <Badge label={v ? "Activo" : "Inactivo"} color={v ? "success" : "gray"} /> },
  ];

  return (
    <div>
      <PageHeader title="Socios" subtitle="Gestión de socios de la caja" action={<Btn onClick={() => open()}>+ Nuevo Socio</Btn>} />

      <Card>
        <Table
          columns={cols}
          data={socios}
          onEdit={open}
          onDelete={(s) => {
            setSocios((x) => x.filter((i) => i.id !== s.id));
            showToast("Socio eliminado", "warning");
          }}
        />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Editar Socio" : "Nuevo Socio"} size="lg">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          <Field label="Cédula" error={errors.cedula} required>
            <Input value={form.cedula} onChange={(v) => setForm((f) => ({ ...f, cedula: v }))} placeholder="1712345678" />
          </Field>

          <Field label="Fecha de Ingreso" required>
            <Input value={form.fechaIngreso} onChange={(v) => setForm((f) => ({ ...f, fechaIngreso: v }))} type="date" />
          </Field>

          <Field label="Nombres" error={errors.nombre} required>
            <Input value={form.nombre} onChange={(v) => setForm((f) => ({ ...f, nombre: v }))} />
          </Field>

          <Field label="Apellidos" error={errors.apellido} required>
            <Input value={form.apellido} onChange={(v) => setForm((f) => ({ ...f, apellido: v }))} />
          </Field>

          <Field label="Teléfono" error={errors.telefono} required>
            <Input value={form.telefono} onChange={(v) => setForm((f) => ({ ...f, telefono: v }))} placeholder="0991234567" />
          </Field>

          <Field label="Email">
            <Input value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
          </Field>
        </div>

        <Field label="Dirección">
          <Input value={form.direccion} onChange={(v) => setForm((f) => ({ ...f, direccion: v }))} />
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