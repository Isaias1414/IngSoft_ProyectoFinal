// src/pages/loginpage.jsx
import { useState } from "react";
import { useApp } from "../context/appcontext";
import Field from "../components/ui/field";
import Input from "../components/ui/input";
import Btn from "../components/ui/btn";

export default function LoginPage() {
  const { login, showToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setErr("");
    await new Promise((r) => setTimeout(r, 800));

    if (!login(email, password)) {
      setErr("Credenciales incorrectas");
      showToast("Acceso denegado", "error");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <div style={{ background: "#0d1526", border: "1px solid #1e3a5f", borderRadius: 16, padding: 48, width: 380, boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>
            🏦
          </div>
          <h1 style={{ margin: 0, color: "#f1f5f9", fontSize: 22, fontWeight: 700 }}>CajaAhorro</h1>
          <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>Sistema de Cajas de Ahorro</p>
        </div>

        <Field label="Correo Electrónico">
          <Input value={email} onChange={setEmail} placeholder="usuario@caja.com" />
        </Field>

        <Field label="Contraseña">
          <Input value={password} onChange={setPassword} type="password" placeholder="••••••••" />
        </Field>

        {err && <p style={{ color: "#ef4444", fontSize: 13, margin: "0 0 12px" }}>{err}</p>}

        <Btn variant="primary" onClick={handleLogin} disabled={loading} style={{ width: "100%", justifyContent: "center", display: "flex", marginTop: 8 }}>
          {loading ? "Verificando..." : "Ingresar al Sistema"}
        </Btn>

        <div style={{ marginTop: 24, padding: 16, background: "#0a0f1e", borderRadius: 8, fontSize: 12, color: "#475569" }}>
          <p style={{ margin: "0 0 6px", fontWeight: 600, color: "#64748b" }}>Credenciales de prueba:</p>
          <p style={{ margin: "2px 0" }}>Admin: admin@caja.com / admin123</p>
          <p style={{ margin: "2px 0" }}>Cajero: cajero@caja.com / cajero123</p>
          <p style={{ margin: "2px 0" }}>Auditor: auditor@caja.com / auditor123</p>
        </div>
      </div>
    </div>
  );
}