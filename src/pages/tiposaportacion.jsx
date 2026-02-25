// src/pages/tiposaportacion.jsx
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
import { fmt } from "../utils/format";

export default function TiposAportacion() {
  const { tiposAportacion, setTiposAportacion, showToast } = useApp();

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: "", monto: 0, periodicidad: "mensual", activo: true });

  const save = () => {
    if (!form.nombre) {
      showToast("Nombre requerido", "error");
      return;
    }

    if (editing) {
      setTiposAportacion((t) => t.map((x) => (x.id === editing.id ? { ...x, ...form, monto: +form.monto } : x)));
    } else {
      setTiposAportacion((t) => [...t, { ...form, id: Date.now(), monto: +form.monto }]);
    }

    showToast("Tipo guardado");
    setModal(false);
  };

  const cols = [
    { key: "nombre", label: "Nombre" },
    { key: "monto", label: "Monto", render: (v) => (v ? fmt(v) : "Variable") },
    { key: "periodicidad", label: "Periodicidad" },
    { key: "activo", label: "Estado", render: (v) => <Badge label={v ? "Activo" : "Inactivo"} color={v ? "success" : "gray"} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Tipos de Aportación"
        action={
          <Btn
            onClick={() => {
              setEditing(null);
              setForm({ nombre: "", monto: 0, periodicidad: "mensual", activo: true });
              setModal(true);
            }}
          >
            + Nuevo Tipo
          </Btn>
        }
      />

      <Card>
        <Table
          columns={cols}
          data={tiposAportacion}
          onEdit={(t) => {
            setEditing(t);
            setForm({ nombre: t.nombre, monto: t.monto, periodicidad: t.periodicidad, activo: t.activo });
            setModal(true);
          }}
          onDelete={(t) => {
            setTiposAportacion((x) => x.filter((i) => i.id !== t.id));
            showToast("Eliminado", "warning");
          }}
        />
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Editar Tipo" : "Nuevo Tipo"}>
        <Field label="Nombre" required>
          <Input value={form.nombre} onChange={(v) => setForm((f) => ({ ...f, nombre: v }))} />
        </Field>

        <Field label="Monto (0 = variable)">
          <Input value={form.monto} onChange={(v) => setForm((f) => ({ ...f, monto: v }))} type="number" />
        </Field>

        <Field label="Periodicidad">
          <Select value={form.periodicidad} onChange={(v) => setForm((f) => ({ ...f, periodicidad: v }))}>
            {["mensual", "trimestral", "semestral", "anual", "variable"].map((p) => (
              <option key={p}>{p}</option>
            ))}
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