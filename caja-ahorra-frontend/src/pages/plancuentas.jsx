// src/pages/usuarios.jsx
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

export default function Usuarios() {
  const { usuarios, setUsuarios, showToast } = useApp();

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: "", email: "", password: "", rol: "Cajero", activo: true });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.email.includes("@")) e.email = "Email inválido";
    if (!editing && !form.password) e.password = "Requerido";
    return e;
  };

  const save = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    if (editing) {
      setUsuarios((u) => u.map((x) => (x.id === editing.id ? { ...x, ...form } : x)));
      showToast("Usuario actualizado");
    } else {
      setUsuarios((u) => [...u, { ...form, id: Date.now() }]);
      showToast("Usuario creado");
    }

    setModal(false);
  };

  const open = (u = null) => {
    setEditing(u);
    setForm(
      u
        ? { nombre: u.nombre, email: u.email, password: "", rol: u.rol, activo: u.activo }
        : { nombre: "", email: "", password: "", rol: "Cajero", activo: true }
    );
    setErrors({});
    setModal(true);
  };

  const cols = [
    { key: "nombre", label: "Nombre" },
    { key: "email", label: "Email" },
    { key: "rol", label: "Rol", render: (v) => <Badge label={v} color={v === "Admin" ? "error" : v === "Cajero" ? "info" : "warning"} /> },
    { key: "activo", label: "Estado", render: (v) => <Badge label={v ? "Activo" : "Inactivo"} color={v ? "success" : "gray"} /> },
  ];

  return (
    <div>
      <PageHeader title="Usuarios" subtitle="Gestión de usuarios del sistema" action={<Btn onClick={() => open()}>+ Nuevo Usuario</Btn>} />

      <Card>
        <Table
          columns={cols}
          data={usuarios}
          onEdit={open}
          onDelete={(u) => {
            setUsuarios((x) => x.filter((i) => i.id !== u.id));
            showToast("Usuario eliminado", "warning");
          }}
        />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Editar Usuario" : "Nuevo Usuario"}>
        <Field label="Nombre completo" error={errors.nombre} required>
          <Input value={form.nombre} onChange={(v) => setForm((f) => ({ ...f, nombre: v }))} />
        </Field>

        <Field label="Email" error={errors.email} required>
          <Input value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} />
        </Field>

        <Field label={editing ? "Nueva contraseña (dejar vacío para no cambiar)" : "Contraseña"} error={errors.password} required={!editing}>
          <Input value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} type="password" />
        </Field>

        <Field label="Rol">
          <Select value={form.rol} onChange={(v) => setForm((f) => ({ ...f, rol: v }))}>
            <option>Admin</option>
            <option>Cajero</option>
            <option>Auditor</option>
          </Select>
        </Field>

        <Field label="Estado">
          <Select value={form.activo ? "1" : "0"} onChange={(v) => setForm((f) => ({ ...f, activo: v === "1" }))}>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </Select>
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