// src/pages/solicitudescredito.jsx
import { useMemo, useState } from "react";
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
import { calcAmortizacion } from "../utils/finance";

export default function SolicitudesCredito() {
  const { creditos, setCreditos, socios, showToast, addAsientoContable } = useApp();

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const emptyForm = useMemo(
    () => ({
      socioId: socios[0]?.id || "",
      monto: "",
      plazo: 12,
      tasa: 15,
      fecha: new Date().toISOString().split("T")[0],
      estado: "pendiente",
    }),
    [socios]
  );

  const [form, setForm] = useState(emptyForm);

  const { cuota } = form.monto && form.plazo ? calcAmortizacion(+form.monto, +form.plazo, +form.tasa) : { cuota: 0 };

  const save = () => {
    if (!form.socioId || !form.monto || +form.monto <= 0) {
      showToast("Complete los campos requeridos", "error");
      return;
    }

    if (editing) {
      setCreditos((c) =>
        c.map((x) =>
          x.id === editing.id
            ? { ...x, ...form, monto: +form.monto, plazo: +form.plazo, tasa: +form.tasa, cuotaMensual: cuota, saldoPendiente: +form.monto }
            : x
        )
      );
    } else {
      setCreditos((c) => [
        ...c,
        { ...form, id: Date.now(), socioId: +form.socioId, monto: +form.monto, plazo: +form.plazo, tasa: +form.tasa, cuotaMensual: cuota, saldoPendiente: +form.monto },
      ]);
    }

    showToast("Crédito guardado");
    setModal(false);
  };

  const aprobar = (cred) => {
    setCreditos((c) => c.map((x) => (x.id === cred.id ? { ...x, estado: "aprobado" } : x)));

    const s = socios.find((x) => x.id === cred.socioId);
    addAsientoContable(`Entrega crédito - ${s?.nombre} ${s?.apellido}`, cred.monto, cred.monto, "1.2.01", "1.1.01");
    showToast("Crédito aprobado y entregado");
  };

  const cols = [
    { key: "socioId", label: "Socio", render: (v) => {
        const s = socios.find((x) => x.id === v);
        return s ? `${s.nombre} ${s.apellido}` : "-";
      }
    },
    { key: "monto", label: "Monto", render: (v) => fmt(v) },
    { key: "plazo", label: "Plazo", render: (v) => `${v} meses` },
    { key: "tasa", label: "Tasa", render: (v) => `${v}%` },
    { key: "cuotaMensual", label: "Cuota", render: (v) => fmt(v) },
    { key: "saldoPendiente", label: "Saldo Pend.", render: (v) => <span style={{ color: "#f59e0b" }}>{fmt(v)}</span> },
    { key: "estado", label: "Estado", render: (v) => <Badge label={v} color={v === "aprobado" ? "success" : v === "pendiente" ? "warning" : "error"} /> },
    { key: "fecha", label: "Fecha", render: fmtDate },
  ];

  return (
    <div>
      <PageHeader
        title="Solicitudes de Crédito"
        action={
          <Btn
            onClick={() => {
              setEditing(null);
              setForm(emptyForm);
              setModal(true);
            }}
          >
            + Nueva Solicitud
          </Btn>
        }
      />

      <Card>
        <Table
          columns={cols}
          data={creditos}
          onEdit={(c) => {
            setEditing(c);
            setForm({ ...c });
            setModal(true);
          }}
          onDelete={(c) => {
            setCreditos((x) => x.filter((i) => i.id !== c.id));
            showToast("Eliminado", "warning");
          }}
        />

        <div style={{ marginTop: 12 }}>
          {creditos
            .filter((c) => c.estado === "pendiente")
            .map((c) => {
              const s = socios.find((x) => x.id === c.socioId);
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: "1px solid #1e2d45" }}>
                  <span style={{ color: "#f59e0b", fontSize: 13 }}>⏳ Pendiente: {s?.nombre} - {fmt(c.monto)}</span>
                  <Btn size="sm" variant="success" onClick={() => aprobar(c)}>
                    Aprobar y Entregar
                  </Btn>
                </div>
              );
            })}
        </div>
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Editar Crédito" : "Nueva Solicitud"}>
        <Field label="Socio" required>
          <Select value={form.socioId} onChange={(v) => setForm((f) => ({ ...f, socioId: v }))}>
            {socios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre} {s.apellido}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Monto solicitado (USD)" required>
          <Input value={form.monto} onChange={(v) => setForm((f) => ({ ...f, monto: v }))} type="number" placeholder="0.00" />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Plazo (meses)">
            <Select value={form.plazo} onChange={(v) => setForm((f) => ({ ...f, plazo: v }))}>
              {[3, 6, 12, 18, 24, 36, 48, 60].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
          </Field>

          <Field label="Tasa anual (%)">
            <Input value={form.tasa} onChange={(v) => setForm((f) => ({ ...f, tasa: v }))} type="number" />
          </Field>
        </div>

        {cuota > 0 && (
          <div style={{ background: "#0f2447", borderRadius: 8, padding: 14, marginBottom: 16 }}>
            <p style={{ margin: 0, color: "#64748b", fontSize: 12 }}>Cuota mensual estimada</p>
            <p style={{ margin: 0, color: "#3b82f6", fontSize: 20, fontWeight: 700 }}>{fmt(cuota)}</p>
          </div>
        )}

        <Field label="Fecha">
          <Input value={form.fecha} onChange={(v) => setForm((f) => ({ ...f, fecha: v }))} type="date" />
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