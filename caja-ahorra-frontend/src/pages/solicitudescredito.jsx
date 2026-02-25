// src/pages/consultamovimientos.jsx
import { useState } from "react";
import { useApp } from "../context/appcontext";

import Card from "../components/ui/card";
import Field from "../components/ui/field";
import Input from "../components/ui/input";
import Btn from "../components/ui/btn";
import PageHeader from "../components/ui/pageheader";

import { fmt, fmtDate } from "../utils/format";

export default function ConsultaMovimientos() {
  const { socios, cuentas, movimientos } = useApp();

  const [cedula, setCedula] = useState("");
  const [numCuenta, setNumCuenta] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const consultar = () => {
    setError("");
    setResultado(null);

    if (!cedula || !numCuenta) {
      setError("Complete todos los campos");
      return;
    }

    const socio = socios.find((s) => s.cedula === cedula);
    if (!socio) {
      setError("No se encontró socio con esa cédula");
      return;
    }

    const cuenta = cuentas.find((c) => c.numero === numCuenta && c.socioId === socio.id);
    if (!cuenta) {
      setError("Cuenta no encontrada para ese socio");
      return;
    }

    const movs = movimientos.filter((m) => m.cuentaId === cuenta.id).slice(0, 3);
    setResultado({ socio, cuenta, movimientos: movs });
  };

  return (
    <div>
      <PageHeader title="Consulta de Movimientos" subtitle="Consulte saldo y últimos 3 movimientos" />

      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <Field label="Cédula del Socio" required>
              <Input value={cedula} onChange={setCedula} placeholder="1712345678" />
            </Field>
            <Field label="Número de Cuenta" required>
              <Input value={numCuenta} onChange={setNumCuenta} placeholder="AH-001-2023" />
            </Field>
          </div>

          {error && <p style={{ color: "#ef4444", margin: "0 0 16px" }}>{error}</p>}

          <Btn onClick={consultar} style={{ width: "100%", justifyContent: "center", display: "flex" }}>
            🔍 Consultar
          </Btn>
        </Card>

        {resultado && (
          <div>
            <Card style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: 12 }}>Titular</p>
                  <p style={{ margin: 0, color: "#f1f5f9", fontWeight: 700, fontSize: 18 }}>
                    {resultado.socio.nombre} {resultado.socio.apellido}
                  </p>
                  <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>
                    Cédula: {resultado.socio.cedula} | Cuenta: {resultado.cuenta.numero}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: 12 }}>Saldo Actual</p>
                  <p style={{ margin: 0, color: "#22c55e", fontSize: 28, fontWeight: 800 }}>{fmt(resultado.cuenta.saldo)}</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 style={{ margin: "0 0 16px", color: "#f1f5f9", fontSize: 15 }}>Últimos 3 movimientos</h3>

              {resultado.movimientos.length === 0 ? (
                <p style={{ color: "#64748b", textAlign: "center", padding: 24 }}>Sin movimientos registrados</p>
              ) : (
                resultado.movimientos.map((m) => (
                  <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #1e2d45" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: m.tipo === "deposito" ? "#22c55e22" : "#f59e0b22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                        {m.tipo === "deposito" ? "⬆️" : "⬇️"}
                      </div>
                      <div>
                        <p style={{ margin: 0, color: "#cbd5e1", fontSize: 14, fontWeight: 500 }}>{m.descripcion}</p>
                        <p style={{ margin: 0, color: "#64748b", fontSize: 12 }}>{fmtDate(m.fecha)}</p>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <p style={{ margin: 0, color: m.tipo === "deposito" ? "#22c55e" : "#f59e0b", fontWeight: 700, fontSize: 15 }}>
                        {m.tipo === "deposito" ? "+" : "-"}
                        {fmt(m.monto)}
                      </p>
                      <p style={{ margin: 0, color: "#64748b", fontSize: 11 }}>Saldo: {fmt(m.saldoDespues)}</p>
                    </div>
                  </div>
                ))
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}