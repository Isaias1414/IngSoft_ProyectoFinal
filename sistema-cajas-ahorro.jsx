
import { useState, useEffect, useContext, createContext, useCallback, useMemo } from "react";

// ─────────────────────────────────────────────
// TYPES / MOCK DATA / SEED
// ─────────────────────────────────────────────
const ROLES = { ADMIN: "Admin", CAJERO: "Cajero", AUDITOR: "Auditor" };

const MOCK_USERS = [
  { id: 1, nombre: "Carlos Administrador", email: "admin@caja.com", password: "admin123", rol: ROLES.ADMIN, activo: true },
  { id: 2, nombre: "María Cajero", email: "cajero@caja.com", password: "cajero123", rol: ROLES.CAJERO, activo: true },
  { id: 3, nombre: "Pedro Auditor", email: "auditor@caja.com", password: "auditor123", rol: ROLES.AUDITOR, activo: true },
];

const MOCK_SOCIOS = [
  { id: 1, cedula: "1712345678", nombre: "Ana García", apellido: "López", telefono: "0991234567", email: "ana@email.com", fechaIngreso: "2023-01-15", activo: true, direccion: "Av. Amazonas 123" },
  { id: 2, cedula: "1756789012", nombre: "Juan Pérez", apellido: "Mora", telefono: "0987654321", email: "juan@email.com", fechaIngreso: "2023-03-20", activo: true, direccion: "Calle Sucre 456" },
  { id: 3, cedula: "1734567890", nombre: "Rosa Quiñones", apellido: "Torres", telefono: "0912345678", email: "rosa@email.com", fechaIngreso: "2022-11-08", activo: true, direccion: "Av. 6 de Diciembre 789" },
];

const MOCK_CUENTAS = [
  { id: 1, socioId: 1, numero: "AH-001-2023", tipo: "ahorro", saldo: 1250.75, fechaApertura: "2023-01-15", activa: true },
  { id: 2, socioId: 2, numero: "AH-002-2023", tipo: "ahorro", saldo: 3400.00, fechaApertura: "2023-03-20", activa: true },
  { id: 3, socioId: 3, numero: "AP-001-2023", tipo: "aportacion", saldo: 5000.00, fechaApertura: "2022-11-08", activa: true },
  { id: 4, socioId: 1, numero: "AP-001-2023B", tipo: "aportacion", saldo: 800.00, fechaApertura: "2023-01-15", activa: true },
];

const MOCK_PLAN_CUENTAS = [
  { id: 1, codigo: "1.1.01", nombre: "Caja General", tipo: "Activo", nivel: 3 },
  { id: 2, codigo: "1.1.02", nombre: "Banco Pichincha", tipo: "Activo", nivel: 3 },
  { id: 3, codigo: "2.1.01", nombre: "Depósitos de Ahorro", tipo: "Pasivo", nivel: 3 },
  { id: 4, codigo: "2.1.02", nombre: "Aportaciones Socios", tipo: "Pasivo", nivel: 3 },
  { id: 5, codigo: "4.1.01", nombre: "Intereses Cartera", tipo: "Ingreso", nivel: 3 },
  { id: 6, codigo: "5.1.01", nombre: "Gastos Operativos", tipo: "Egreso", nivel: 3 },
  { id: 7, codigo: "1.2.01", nombre: "Cartera de Crédito", tipo: "Activo", nivel: 3 },
];

const MOCK_MOVIMIENTOS = [
  { id: 1, cuentaId: 1, tipo: "deposito", monto: 500.00, fecha: "2024-01-15", descripcion: "Depósito ahorro", saldoDespues: 1250.75 },
  { id: 2, cuentaId: 1, tipo: "retiro", monto: 200.00, fecha: "2024-01-10", descripcion: "Retiro ahorro", saldoDespues: 750.75 },
  { id: 3, cuentaId: 1, tipo: "deposito", monto: 700.00, fecha: "2024-01-05", descripcion: "Depósito inicial", saldoDespues: 950.75 },
  { id: 4, cuentaId: 2, tipo: "deposito", monto: 1000.00, fecha: "2024-01-20", descripcion: "Depósito ahorro", saldoDespues: 3400.00 },
  { id: 5, cuentaId: 2, tipo: "deposito", monto: 1200.00, fecha: "2024-01-08", descripcion: "Depósito ahorro", saldoDespues: 2400.00 },
  { id: 6, cuentaId: 2, tipo: "retiro", monto: 800.00, fecha: "2024-01-03", descripcion: "Retiro", saldoDespues: 1200.00 },
];

const MOCK_CREDITOS = [
  { id: 1, socioId: 1, monto: 5000.00, plazo: 12, tasa: 15, estado: "aprobado", fecha: "2024-01-10", cuotaMensual: 451.28, saldoPendiente: 3500.00 },
  { id: 2, socioId: 2, monto: 2000.00, plazo: 6, tasa: 15, estado: "pendiente", fecha: "2024-01-22", cuotaMensual: 347.82, saldoPendiente: 2000.00 },
  { id: 3, socioId: 3, monto: 8000.00, plazo: 24, tasa: 15, estado: "aprobado", fecha: "2023-11-01", cuotaMensual: 388.76, saldoPendiente: 6800.00 },
];

const MOCK_DIARIO = [
  { id: 1, fecha: "2024-01-20", descripcion: "Depósito de ahorro - Ana García", debe: 500.00, haber: 500.00, cuentaDebe: "1.1.01", cuentaHaber: "2.1.01" },
  { id: 2, fecha: "2024-01-19", descripcion: "Pago cuota crédito - Juan Pérez", debe: 451.28, haber: 451.28, cuentaDebe: "1.1.01", cuentaHaber: "1.2.01" },
  { id: 3, fecha: "2024-01-18", descripcion: "Egreso servicios básicos", debe: 150.00, haber: 150.00, cuentaDebe: "5.1.01", cuentaHaber: "1.1.01" },
];

const MOCK_TIPOS_APORTACION = [
  { id: 1, nombre: "Aportación Mensual Obligatoria", monto: 50.00, periodicidad: "mensual", activo: true },
  { id: 2, nombre: "Aportación Voluntaria", monto: 0, periodicidad: "variable", activo: true },
  { id: 3, nombre: "Fondo de Reserva", monto: 25.00, periodicidad: "mensual", activo: true },
];

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(n || 0);
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("es-EC") : "-";
const validarCedula = (c) => {
  if (!c || c.length !== 10 || isNaN(c)) return false;
  const digits = c.split("").map(Number);
  const prov = parseInt(c.substring(0, 2));
  if (prov < 1 || prov > 24) return false;
  const coefs = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let val = digits[i] * coefs[i];
    if (val >= 10) val -= 9;
    sum += val;
  }
  const verif = sum % 10 === 0 ? 0 : 10 - (sum % 10);
  return verif === digits[9];
};
const calcAmortizacion = (monto, plazo, tasa) => {
  const r = tasa / 100 / 12;
  const cuota = (monto * r * Math.pow(1 + r, plazo)) / (Math.pow(1 + r, plazo) - 1);
  const tabla = [];
  let saldo = monto;
  for (let i = 1; i <= plazo; i++) {
    const interes = saldo * r;
    const capital = cuota - interes;
    saldo -= capital;
    tabla.push({ cuota: i, pago: cuota, capital, interes, saldo: Math.max(0, saldo) });
  }
  return { cuota, tabla };
};

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────
const AppCtx = createContext(null);

const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("login");
  const [toast, setToast] = useState(null);
  const [usuarios, setUsuarios] = useState(MOCK_USERS);
  const [socios, setSocios] = useState(MOCK_SOCIOS);
  const [cuentas, setCuentas] = useState(MOCK_CUENTAS);
  const [movimientos, setMovimientos] = useState(MOCK_MOVIMIENTOS);
  const [creditos, setCreditos] = useState(MOCK_CREDITOS);
  const [diario, setDiario] = useState(MOCK_DIARIO);
  const [planCuentas, setPlanCuentas] = useState(MOCK_PLAN_CUENTAS);
  const [tiposAportacion, setTiposAportacion] = useState(MOCK_TIPOS_APORTACION);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const login = (email, password) => {
    const u = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (u) { setCurrentUser(u); setCurrentPage("dashboard"); return true; }
    return false;
  };
  const logout = () => { setCurrentUser(null); setCurrentPage("login"); };

  const navigate = (page) => setCurrentPage(page);

  const addAsientoContable = (desc, debe, haber, ctaDebe, ctaHaber) => {
    const entry = { id: Date.now(), fecha: new Date().toISOString().split("T")[0], descripcion: desc, debe, haber, cuentaDebe: ctaDebe, cuentaHaber: ctaHaber };
    setDiario(d => [entry, ...d]);
  };

  return (
    <AppCtx.Provider value={{
      currentUser, currentPage, navigate, login, logout,
      toast, showToast,
      usuarios, setUsuarios,
      socios, setSocios,
      cuentas, setCuentas,
      movimientos, setMovimientos,
      creditos, setCreditos,
      diario, setDiario,
      planCuentas, setPlanCuentas,
      tiposAportacion, setTiposAportacion,
      addAsientoContable,
    }}>
      {children}
    </AppCtx.Provider>
  );
};

const useApp = () => useContext(AppCtx);

// ─────────────────────────────────────────────
// REUSABLE COMPONENTS
// ─────────────────────────────────────────────

const Toast = () => {
  const { toast } = useApp();
  if (!toast) return null;
  const colors = { success: "#22c55e", error: "#ef4444", warning: "#f59e0b", info: "#3b82f6" };
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: "#1e2533", border: `1px solid ${colors[toast.type] || colors.success}`,
      color: "#f1f5f9", padding: "14px 20px", borderRadius: 10,
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", gap: 10,
      animation: "slideIn 0.3s ease", maxWidth: 360,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors[toast.type], flexShrink: 0, boxShadow: `0 0 8px ${colors[toast.type]}` }} />
      {toast.msg}
    </div>
  );
};

const Modal = ({ open, onClose, title, children, size = "md" }) => {
  if (!open) return null;
  const widths = { sm: 400, md: 560, lg: 720, xl: 900 };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#1a2035", border: "1px solid #2d3748", borderRadius: 12, width: "100%", maxWidth: widths[size], maxHeight: "90vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #2d3748" }}>
          <h3 style={{ margin: 0, color: "#f1f5f9", fontSize: 16, fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
};

const Field = ({ label, error, children, required }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 6, fontWeight: 500 }}>
      {label}{required && <span style={{ color: "#ef4444" }}> *</span>}
    </label>
    {children}
    {error && <p style={{ margin: "4px 0 0", color: "#ef4444", fontSize: 12 }}>{error}</p>}
  </div>
);

const Input = ({ value, onChange, placeholder, type = "text", style: s }) => (
  <input
    type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ width: "100%", background: "#0f1624", border: "1px solid #2d3748", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box", ...s }}
  />
);

const Select = ({ value, onChange, children }) => (
  <select value={value} onChange={e => onChange(e.target.value)}
    style={{ width: "100%", background: "#0f1624", border: "1px solid #2d3748", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 14, outline: "none" }}>
    {children}
  </select>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", disabled, style: s }) => {
  const variants = {
    primary: { background: "#3b82f6", color: "#fff", border: "none" },
    success: { background: "#22c55e", color: "#fff", border: "none" },
    danger: { background: "#ef4444", color: "#fff", border: "none" },
    ghost: { background: "transparent", color: "#94a3b8", border: "1px solid #2d3748" },
    warning: { background: "#f59e0b", color: "#fff", border: "none" },
  };
  const sizes = { sm: { padding: "6px 12px", fontSize: 12 }, md: { padding: "9px 18px", fontSize: 14 }, lg: { padding: "12px 24px", fontSize: 15 } };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...variants[variant], ...sizes[size], borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer",
      fontWeight: 600, transition: "opacity 0.2s", opacity: disabled ? 0.5 : 1, ...s
    }}>{children}</button>
  );
};

const Badge = ({ label, color }) => {
  const colors = { success: "#22c55e", warning: "#f59e0b", error: "#ef4444", info: "#3b82f6", gray: "#6b7280" };
  const c = colors[color] || colors.info;
  return (
    <span style={{ background: `${c}22`, color: c, border: `1px solid ${c}44`, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>{label}</span>
  );
};

const Card = ({ children, style: s }) => (
  <div style={{ background: "#1a2035", border: "1px solid #2d3748", borderRadius: 12, padding: 24, ...s }}>{children}</div>
);

const Table = ({ columns, data, onEdit, onDelete, emptyMsg = "Sin registros" }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const filtered = useMemo(() => {
    if (!search) return data;
    return data.filter(row => JSON.stringify(row).toLowerCase().includes(search.toLowerCase()));
  }, [data, search]);

  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Input value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="🔍  Buscar..." style={{ maxWidth: 320 }} />
      </div>
      <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid #2d3748" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0f1624" }}>
              {columns.map(c => (
                <th key={c.key} style={{ padding: "12px 16px", textAlign: "left", color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                  {c.label}
                </th>
              ))}
              {(onEdit || onDelete) && <th style={{ padding: "12px 16px", color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={columns.length + 1} style={{ padding: 40, textAlign: "center", color: "#4b5563" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                {emptyMsg}
              </td></tr>
            ) : paged.map((row, i) => (
              <tr key={row.id || i} style={{ borderTop: "1px solid #1e293b", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#1e293b"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                {columns.map(c => (
                  <td key={c.key} style={{ padding: "12px 16px", color: "#cbd5e1", fontSize: 14 }}>
                    {c.render ? c.render(row[c.key], row) : (row[c.key] ?? "-")}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td style={{ padding: "12px 16px", display: "flex", gap: 8 }}>
                    {onEdit && <Btn size="sm" variant="ghost" onClick={() => onEdit(row)}>✏️</Btn>}
                    {onDelete && <Btn size="sm" variant="danger" onClick={() => onDelete(row)}>🗑️</Btn>}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
          <Btn size="sm" variant="ghost" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹ Ant</Btn>
          <span style={{ color: "#64748b", fontSize: 13, alignSelf: "center" }}>Pág {page} / {pages}</span>
          <Btn size="sm" variant="ghost" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>Sig ›</Btn>
        </div>
      )}
    </div>
  );
};

const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
    <div>
      <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: 22, fontWeight: 700 }}>{title}</h2>
      {subtitle && <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 14 }}>{subtitle}</p>}
    </div>
    {action}
  </div>
);

const exportCSV = (data, filename, cols) => {
  const headers = cols.map(c => c.label).join(",");
  const rows = data.map(row => cols.map(c => `"${row[c.key] ?? ""}"`).join(",")).join("\n");
  const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
};

// ─────────────────────────────────────────────
// LAYOUT
// ─────────────────────────────────────────────
const MENU = [
  { key: "dashboard", label: "Dashboard", icon: "📊", roles: ["Admin", "Cajero", "Auditor"] },
  { label: "CONFIGURACIÓN", type: "section", roles: ["Admin"] },
  { key: "usuarios", label: "Usuarios", icon: "👥", roles: ["Admin"] },
  { key: "plan-cuentas", label: "Plan de Cuentas", icon: "📋", roles: ["Admin"] },
  { key: "tipos-aportacion", label: "Tipos Aportación", icon: "🏷️", roles: ["Admin"] },
  { label: "SOCIOS", type: "section", roles: ["Admin", "Cajero"] },
  { key: "socios", label: "Socios", icon: "🤝", roles: ["Admin", "Cajero"] },
  { key: "cuentas", label: "Cuentas", icon: "💳", roles: ["Admin", "Cajero"] },
  { label: "APORTACIONES", type: "section", roles: ["Admin", "Cajero"] },
  { key: "depositos-ahorro", label: "Dep. de Ahorros", icon: "⬆️", roles: ["Admin", "Cajero"] },
  { key: "retiros-ahorro", label: "Ret. de Ahorros", icon: "⬇️", roles: ["Admin", "Cajero"] },
  { key: "depositos-aportacion", label: "Dep. Aportaciones", icon: "➕", roles: ["Admin", "Cajero"] },
  { key: "retiros-aportacion", label: "Ret. Aportaciones", icon: "➖", roles: ["Admin", "Cajero"] },
  { key: "consulta-movimientos", label: "Consulta Movimientos", icon: "🔍", roles: ["Admin", "Cajero", "Auditor"] },
  { label: "CRÉDITOS", type: "section", roles: ["Admin", "Cajero"] },
  { key: "solicitudes-credito", label: "Solicitudes", icon: "📝", roles: ["Admin", "Cajero"] },
  { key: "amortizacion", label: "Amortización", icon: "📐", roles: ["Admin", "Cajero", "Auditor"] },
  { key: "pago-cuotas", label: "Pago de Cuotas", icon: "💸", roles: ["Admin", "Cajero"] },
  { label: "INGRESOS / EGRESOS", type: "section", roles: ["Admin", "Cajero"] },
  { key: "diario-caja", label: "Diario de Caja", icon: "📒", roles: ["Admin", "Cajero", "Auditor"] },
  { label: "REPORTES", type: "section", roles: ["Admin", "Auditor"] },
  { key: "reporte-libro-diario", label: "Libro Diario", icon: "📗", roles: ["Admin", "Auditor"] },
  { key: "reporte-historial-ahorros", label: "Historial Ahorros", icon: "💰", roles: ["Admin", "Auditor"] },
  { key: "reporte-cartera", label: "Cartera Créditos", icon: "🏦", roles: ["Admin", "Auditor"] },
  { key: "reporte-aportaciones", label: "Resumen Aportaciones", icon: "📈", roles: ["Admin", "Auditor"] },
];

const Layout = ({ children }) => {
  const { currentUser, currentPage, navigate, logout } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const allowed = MENU.filter(m => !m.type && m.roles?.includes(currentUser?.rol));
  const current = MENU.find(m => m.key === currentPage);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0a0f1e", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", overflow: "hidden" }}>
      {/* Sidebar */}
      <div style={{
        width: collapsed ? 60 : 240, background: "#0d1526", borderRight: "1px solid #1e2d45",
        display: "flex", flexDirection: "column", transition: "width 0.25s ease", overflow: "hidden", flexShrink: 0
      }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? "20px 8px" : "20px 20px", borderBottom: "1px solid #1e2d45", display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🏦</div>
          {!collapsed && <div><p style={{ margin: 0, color: "#f1f5f9", fontWeight: 700, fontSize: 14 }}>CajaAhorro</p><p style={{ margin: 0, color: "#3b82f6", fontSize: 11 }}>Sistema Financiero</p></div>}
        </div>
        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {MENU.filter(m => m.roles?.includes(currentUser?.rol) || m.type).map((item, i) => {
            if (item.type === "section") {
              if (collapsed) return null;
              const sectionItems = MENU.filter(m => !m.type).filter(m => {
                const idx = MENU.indexOf(item);
                const nextSection = MENU.slice(idx + 1).find(m => m.type === "section");
                return m.roles?.includes(currentUser?.rol) && MENU.indexOf(m) > idx && (!nextSection || MENU.indexOf(m) < MENU.indexOf(nextSection));
              });
              if (sectionItems.length === 0) return null;
              return (
                <div key={i} style={{ padding: "12px 20px 4px", color: "#334155", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>
                  {item.label}
                </div>
              );
            }
            if (!item.roles?.includes(currentUser?.rol)) return null;
            const active = currentPage === item.key;
            return (
              <div key={item.key} onClick={() => navigate(item.key)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: collapsed ? "10px 0" : "10px 20px",
                justifyContent: collapsed ? "center" : "flex-start",
                cursor: "pointer", background: active ? "#1e3a5f" : "transparent",
                borderLeft: active ? "3px solid #3b82f6" : "3px solid transparent",
                color: active ? "#93c5fd" : "#64748b", fontSize: 13, fontWeight: active ? 600 : 400,
                transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </div>
            );
          })}
        </nav>
        {/* User */}
        {!collapsed && (
          <div style={{ padding: 16, borderTop: "1px solid #1e2d45" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", color: "#93c5fd", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                {currentUser?.nombre[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, color: "#f1f5f9", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser?.nombre}</p>
                <p style={{ margin: 0, color: "#3b82f6", fontSize: 11 }}>{currentUser?.rol}</p>
              </div>
            </div>
            <Btn size="sm" variant="ghost" onClick={logout} style={{ width: "100%", marginTop: 10, justifyContent: "center", display: "flex" }}>Cerrar Sesión</Btn>
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <div style={{ height: 56, background: "#0d1526", borderBottom: "1px solid #1e2d45", display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0 }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 18 }}>☰</button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 13 }}>
            <span>Inicio</span><span>/</span>
            <span style={{ color: "#93c5fd" }}>{current?.label || "Dashboard"}</span>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "#1e3a5f22", border: "1px solid #1e3a5f", borderRadius: 20, padding: "4px 12px", color: "#93c5fd", fontSize: 12, fontWeight: 600 }}>
              {currentUser?.rol}
            </div>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>{children}</div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────
const LoginPage = () => {
  const { login, showToast } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleLogin = async () => {
    setLoading(true); setErr("");
    await new Promise(r => setTimeout(r, 800));
    if (!login(email, password)) {
      setErr("Credenciales incorrectas"); showToast("Acceso denegado", "error");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <div style={{ background: "#0d1526", border: "1px solid #1e3a5f", borderRadius: 16, padding: 48, width: 380, boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>🏦</div>
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
};

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
const Dashboard = () => {
  const { socios, cuentas, creditos, diario } = useApp();
  const totalAhorros = cuentas.filter(c => c.tipo === "ahorro").reduce((s, c) => s + c.saldo, 0);
  const totalAportaciones = cuentas.filter(c => c.tipo === "aportacion").reduce((s, c) => s + c.saldo, 0);
  const creditosActivos = creditos.filter(c => c.estado === "aprobado").length;
  const hoy = new Date().toISOString().split("T")[0];
  const egresosHoy = diario.filter(d => d.fecha === hoy).reduce((s, d) => s + d.haber, 0);

  const kpis = [
    { label: "Total Ahorros", value: fmt(totalAhorros), icon: "💰", color: "#3b82f6" },
    { label: "Aportaciones Totales", value: fmt(totalAportaciones), icon: "📈", color: "#22c55e" },
    { label: "Créditos Activos", value: creditosActivos, icon: "🏦", color: "#f59e0b" },
    { label: "Movimientos Hoy", value: diario.length, icon: "📒", color: "#8b5cf6" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Resumen del sistema" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 28 }}>
        {kpis.map((k, i) => (
          <Card key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ margin: "0 0 8px", color: "#64748b", fontSize: 13 }}>{k.label}</p>
                <p style={{ margin: 0, color: "#f1f5f9", fontSize: 24, fontWeight: 700 }}>{k.value}</p>
              </div>
              <div style={{ width: 44, height: 44, background: `${k.color}22`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{k.icon}</div>
            </div>
          </Card>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <h3 style={{ margin: "0 0 16px", color: "#f1f5f9", fontSize: 15 }}>Últimos Movimientos</h3>
          {diario.slice(0, 5).map(d => (
            <div key={d.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #1e2d45" }}>
              <div>
                <p style={{ margin: 0, color: "#cbd5e1", fontSize: 13 }}>{d.descripcion}</p>
                <p style={{ margin: 0, color: "#64748b", fontSize: 11 }}>{fmtDate(d.fecha)}</p>
              </div>
              <span style={{ color: "#22c55e", fontWeight: 600 }}>{fmt(d.debe)}</span>
            </div>
          ))}
        </Card>
        <Card>
          <h3 style={{ margin: "0 0 16px", color: "#f1f5f9", fontSize: 15 }}>Socios Recientes</h3>
          {socios.slice(0, 5).map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #1e2d45" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#1e3a5f", display: "flex", alignItems: "center", justifyContent: "center", color: "#93c5fd", fontWeight: 700, fontSize: 14 }}>
                {s.nombre[0]}
              </div>
              <div>
                <p style={{ margin: 0, color: "#cbd5e1", fontSize: 13 }}>{s.nombre} {s.apellido}</p>
                <p style={{ margin: 0, color: "#64748b", fontSize: 11 }}>Cédula: {s.cedula}</p>
              </div>
              <Badge label="Activo" color="success" />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// USUARIOS
// ─────────────────────────────────────────────
const Usuarios = () => {
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
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editing) {
      setUsuarios(u => u.map(x => x.id === editing.id ? { ...x, ...form } : x));
      showToast("Usuario actualizado");
    } else {
      setUsuarios(u => [...u, { ...form, id: Date.now() }]);
      showToast("Usuario creado");
    }
    setModal(false);
  };

  const open = (u = null) => {
    setEditing(u);
    setForm(u ? { nombre: u.nombre, email: u.email, password: "", rol: u.rol, activo: u.activo } : { nombre: "", email: "", password: "", rol: "Cajero", activo: true });
    setErrors({});
    setModal(true);
  };

  const cols = [
    { key: "nombre", label: "Nombre" },
    { key: "email", label: "Email" },
    { key: "rol", label: "Rol", render: v => <Badge label={v} color={v === "Admin" ? "error" : v === "Cajero" ? "info" : "warning"} /> },
    { key: "activo", label: "Estado", render: v => <Badge label={v ? "Activo" : "Inactivo"} color={v ? "success" : "gray"} /> },
  ];

  return (
    <div>
      <PageHeader title="Usuarios" subtitle="Gestión de usuarios del sistema" action={<Btn onClick={() => open()}>+ Nuevo Usuario</Btn>} />
      <Card>
        <Table columns={cols} data={usuarios} onEdit={open} onDelete={u => { setUsuarios(x => x.filter(i => i.id !== u.id)); showToast("Usuario eliminado", "warning"); }} />
      </Card>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Editar Usuario" : "Nuevo Usuario"}>
        <Field label="Nombre completo" error={errors.nombre} required>
          <Input value={form.nombre} onChange={v => setForm(f => ({ ...f, nombre: v }))} />
        </Field>
        <Field label="Email" error={errors.email} required>
          <Input value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
        </Field>
        <Field label={editing ? "Nueva contraseña (dejar vacío para no cambiar)" : "Contraseña"} error={errors.password} required={!editing}>
          <Input value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} type="password" />
        </Field>
        <Field label="Rol">
          <Select value={form.rol} onChange={v => setForm(f => ({ ...f, rol: v }))}>
            <option>Admin</option><option>Cajero</option><option>Auditor</option>
          </Select>
        </Field>
        <Field label="Estado">
          <Select value={form.activo ? "1" : "0"} onChange={v => setForm(f => ({ ...f, activo: v === "1" }))}>
            <option value="1">Activo</option><option value="0">Inactivo</option>
          </Select>
        </Field>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn onClick={save}>Guardar</Btn>
        </div>
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────
// PLAN DE CUENTAS
// ─────────────────────────────────────────────
const PlanCuentas = () => {
  const { planCuentas, setPlanCuentas, showToast } = useApp();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ codigo: "", nombre: "", tipo: "Activo", nivel: 3 });

  const save = () => {
    if (!form.codigo || !form.nombre) { showToast("Campos requeridos", "error"); return; }
    if (editing) {
      setPlanCuentas(p => p.map(x => x.id === editing.id ? { ...x, ...form } : x));
    } else {
      setPlanCuentas(p => [...p, { ...form, id: Date.now(), nivel: +form.nivel }]);
    }
    showToast("Cuenta guardada"); setModal(false);
  };

  const open = (item = null) => {
    setEditing(item);
    setForm(item ? { codigo: item.codigo, nombre: item.nombre, tipo: item.tipo, nivel: item.nivel } : { codigo: "", nombre: "", tipo: "Activo", nivel: 3 });
    setModal(true);
  };

  const cols = [
    { key: "codigo", label: "Código" },
    { key: "nombre", label: "Nombre" },
    { key: "tipo", label: "Tipo", render: v => <Badge label={v} color={v === "Activo" ? "info" : v === "Pasivo" ? "warning" : v === "Ingreso" ? "success" : "error"} /> },
    { key: "nivel", label: "Nivel" },
  ];

  return (
    <div>
      <PageHeader title="Plan de Cuentas" action={<Btn onClick={() => open()}>+ Nueva Cuenta</Btn>} />
      <Card><Table columns={cols} data={planCuentas} onEdit={open} onDelete={c => { setPlanCuentas(p => p.filter(x => x.id !== c.id)); showToast("Cuenta eliminada", "warning"); }} /></Card>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Editar Cuenta" : "Nueva Cuenta"}>
        <Field label="Código" required><Input value={form.codigo} onChange={v => setForm(f => ({ ...f, codigo: v }))} placeholder="1.1.01" /></Field>
        <Field label="Nombre" required><Input value={form.nombre} onChange={v => setForm(f => ({ ...f, nombre: v }))} /></Field>
        <Field label="Tipo">
          <Select value={form.tipo} onChange={v => setForm(f => ({ ...f, tipo: v }))}>
            {["Activo","Pasivo","Ingreso","Egreso","Patrimonio"].map(t => <option key={t}>{t}</option>)}
          </Select>
        </Field>
        <Field label="Nivel"><Input value={form.nivel} onChange={v => setForm(f => ({ ...f, nivel: v }))} type="number" /></Field>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn onClick={save}>Guardar</Btn>
        </div>
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────
// TIPOS APORTACIÓN
// ─────────────────────────────────────────────
const TiposAportacion = () => {
  const { tiposAportacion, setTiposAportacion, showToast } = useApp();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ nombre: "", monto: 0, periodicidad: "mensual", activo: true });

  const save = () => {
    if (!form.nombre) { showToast("Nombre requerido", "error"); return; }
    if (editing) {
      setTiposAportacion(t => t.map(x => x.id === editing.id ? { ...x, ...form, monto: +form.monto } : x));
    } else {
      setTiposAportacion(t => [...t, { ...form, id: Date.now(), monto: +form.monto }]);
    }
    showToast("Tipo guardado"); setModal(false);
  };

  const cols = [
    { key: "nombre", label: "Nombre" },
    { key: "monto", label: "Monto", render: v => v ? fmt(v) : "Variable" },
    { key: "periodicidad", label: "Periodicidad" },
    { key: "activo", label: "Estado", render: v => <Badge label={v ? "Activo" : "Inactivo"} color={v ? "success" : "gray"} /> },
  ];

  return (
    <div>
      <PageHeader title="Tipos de Aportación" action={<Btn onClick={() => { setEditing(null); setForm({ nombre: "", monto: 0, periodicidad: "mensual", activo: true }); setModal(true); }}>+ Nuevo Tipo</Btn>} />
      <Card><Table columns={cols} data={tiposAportacion} onEdit={t => { setEditing(t); setForm({ nombre: t.nombre, monto: t.monto, periodicidad: t.periodicidad, activo: t.activo }); setModal(true); }} onDelete={t => { setTiposAportacion(x => x.filter(i => i.id !== t.id)); showToast("Eliminado", "warning"); }} /></Card>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Editar Tipo" : "Nuevo Tipo"}>
        <Field label="Nombre" required><Input value={form.nombre} onChange={v => setForm(f => ({ ...f, nombre: v }))} /></Field>
        <Field label="Monto (0 = variable)"><Input value={form.monto} onChange={v => setForm(f => ({ ...f, monto: v }))} type="number" /></Field>
        <Field label="Periodicidad">
          <Select value={form.periodicidad} onChange={v => setForm(f => ({ ...f, periodicidad: v }))}>
            {["mensual","trimestral","semestral","anual","variable"].map(p => <option key={p}>{p}</option>)}
          </Select>
        </Field>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn onClick={save}>Guardar</Btn>
        </div>
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────
// SOCIOS
// ─────────────────────────────────────────────
const Socios = () => {
  const { socios, setSocios, showToast } = useApp();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [errors, setErrors] = useState({});
  const emptyForm = { cedula: "", nombre: "", apellido: "", telefono: "", email: "", fechaIngreso: new Date().toISOString().split("T")[0], activo: true, direccion: "" };
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
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editing) {
      setSocios(s => s.map(x => x.id === editing.id ? { ...x, ...form } : x));
      showToast("Socio actualizado");
    } else {
      setSocios(s => [...s, { ...form, id: Date.now() }]);
      showToast("Socio registrado");
    }
    setModal(false);
  };

  const open = (s = null) => {
    setEditing(s); setErrors({});
    setForm(s ? { ...s } : emptyForm);
    setModal(true);
  };

  const cols = [
    { key: "cedula", label: "Cédula" },
    { key: "nombre", label: "Nombre", render: (v, r) => `${v} ${r.apellido}` },
    { key: "telefono", label: "Teléfono" },
    { key: "email", label: "Email" },
    { key: "fechaIngreso", label: "Ingreso", render: fmtDate },
    { key: "activo", label: "Estado", render: v => <Badge label={v ? "Activo" : "Inactivo"} color={v ? "success" : "gray"} /> },
  ];

  return (
    <div>
      <PageHeader title="Socios" subtitle="Gestión de socios de la caja" action={<Btn onClick={() => open()}>+ Nuevo Socio</Btn>} />
      <Card><Table columns={cols} data={socios} onEdit={open} onDelete={s => { setSocios(x => x.filter(i => i.id !== s.id)); showToast("Socio eliminado", "warning"); }} /></Card>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Editar Socio" : "Nuevo Socio"} size="lg">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          <Field label="Cédula" error={errors.cedula} required>
            <Input value={form.cedula} onChange={v => setForm(f => ({ ...f, cedula: v }))} placeholder="1712345678" />
          </Field>
          <Field label="Fecha de Ingreso" required>
            <Input value={form.fechaIngreso} onChange={v => setForm(f => ({ ...f, fechaIngreso: v }))} type="date" />
          </Field>
          <Field label="Nombres" error={errors.nombre} required>
            <Input value={form.nombre} onChange={v => setForm(f => ({ ...f, nombre: v }))} />
          </Field>
          <Field label="Apellidos" error={errors.apellido} required>
            <Input value={form.apellido} onChange={v => setForm(f => ({ ...f, apellido: v }))} />
          </Field>
          <Field label="Teléfono" error={errors.telefono} required>
            <Input value={form.telefono} onChange={v => setForm(f => ({ ...f, telefono: v }))} placeholder="0991234567" />
          </Field>
          <Field label="Email">
            <Input value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
          </Field>
        </div>
        <Field label="Dirección">
          <Input value={form.direccion} onChange={v => setForm(f => ({ ...f, direccion: v }))} />
        </Field>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn onClick={save}>Guardar</Btn>
        </div>
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────
// CUENTAS
// ─────────────────────────────────────────────
const Cuentas = () => {
  const { cuentas, setCuentas, socios, showToast } = useApp();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ socioId: "", numero: "", tipo: "ahorro", saldo: 0, fechaApertura: new Date().toISOString().split("T")[0], activa: true });

  const save = () => {
    if (!form.socioId || !form.numero) { showToast("Campos requeridos", "error"); return; }
    if (editing) {
      setCuentas(c => c.map(x => x.id === editing.id ? { ...x, ...form, socioId: +form.socioId, saldo: +form.saldo } : x));
    } else {
      setCuentas(c => [...c, { ...form, id: Date.now(), socioId: +form.socioId, saldo: +form.saldo }]);
    }
    showToast("Cuenta guardada"); setModal(false);
  };

  const cols = [
    { key: "numero", label: "N° Cuenta" },
    { key: "socioId", label: "Socio", render: v => { const s = socios.find(x => x.id === v); return s ? `${s.nombre} ${s.apellido}` : "-"; } },
    { key: "tipo", label: "Tipo", render: v => <Badge label={v} color={v === "ahorro" ? "info" : "warning"} /> },
    { key: "saldo", label: "Saldo", render: v => <span style={{ color: "#22c55e", fontWeight: 600 }}>{fmt(v)}</span> },
    { key: "fechaApertura", label: "Apertura", render: fmtDate },
    { key: "activa", label: "Estado", render: v => <Badge label={v ? "Activa" : "Inactiva"} color={v ? "success" : "gray"} /> },
  ];

  const open = (c = null) => {
    setEditing(c);
    setForm(c ? { ...c } : { socioId: socios[0]?.id || "", numero: `AH-${Date.now().toString().slice(-4)}-2024`, tipo: "ahorro", saldo: 0, fechaApertura: new Date().toISOString().split("T")[0], activa: true });
    setModal(true);
  };

  return (
    <div>
      <PageHeader title="Cuentas" subtitle="Gestión de cuentas de socios" action={<Btn onClick={() => open()}>+ Nueva Cuenta</Btn>} />
      <Card><Table columns={cols} data={cuentas} onEdit={open} /></Card>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Editar Cuenta" : "Nueva Cuenta"}>
        <Field label="Socio" required>
          <Select value={form.socioId} onChange={v => setForm(f => ({ ...f, socioId: v }))}>
            <option value="">Seleccionar...</option>
            {socios.map(s => <option key={s.id} value={s.id}>{s.nombre} {s.apellido} - {s.cedula}</option>)}
          </Select>
        </Field>
        <Field label="Número de Cuenta" required><Input value={form.numero} onChange={v => setForm(f => ({ ...f, numero: v }))} /></Field>
        <Field label="Tipo">
          <Select value={form.tipo} onChange={v => setForm(f => ({ ...f, tipo: v }))}>
            <option value="ahorro">Ahorro</option>
            <option value="aportacion">Aportación</option>
          </Select>
        </Field>
        <Field label="Saldo inicial"><Input value={form.saldo} onChange={v => setForm(f => ({ ...f, saldo: v }))} type="number" /></Field>
        <Field label="Fecha apertura"><Input value={form.fechaApertura} onChange={v => setForm(f => ({ ...f, fechaApertura: v }))} type="date" /></Field>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn onClick={save}>Guardar</Btn>
        </div>
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────
// TRANSACCIÓN HELPER (Depósitos / Retiros)
// ─────────────────────────────────────────────
const TransaccionPage = ({ titulo, tipoTx, tipoCuenta, ctaDebe, ctaHaber }) => {
  const { cuentas, setCuentas, movimientos, setMovimientos, socios, showToast, addAsientoContable } = useApp();
  const [form, setForm] = useState({ cuentaId: "", monto: "", descripcion: "", fecha: new Date().toISOString().split("T")[0] });
  const [errors, setErrors] = useState({});

  const cuentasFiltradas = cuentas.filter(c => c.tipo === tipoCuenta && c.activa);
  const cuentaSeleccionada = cuentas.find(c => c.id === +form.cuentaId);
  const socio = socios.find(s => s.id === cuentaSeleccionada?.socioId);

  const validate = () => {
    const e = {};
    if (!form.cuentaId) e.cuentaId = "Seleccione cuenta";
    if (!form.monto || +form.monto <= 0) e.monto = "Monto inválido";
    if (tipoTx === "retiro" && cuentaSeleccionada && +form.monto > cuentaSeleccionada.saldo) e.monto = "Saldo insuficiente";
    return e;
  };

  const registrar = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const nuevoSaldo = tipoTx === "deposito" ? cuentaSeleccionada.saldo + +form.monto : cuentaSeleccionada.saldo - +form.monto;
    setCuentas(c => c.map(x => x.id === +form.cuentaId ? { ...x, saldo: nuevoSaldo } : x));
    const mov = { id: Date.now(), cuentaId: +form.cuentaId, tipo: tipoTx, monto: +form.monto, fecha: form.fecha, descripcion: form.descripcion || titulo, saldoDespues: nuevoSaldo };
    setMovimientos(m => [mov, ...m]);
    const desc = `${titulo} - ${socio?.nombre} ${socio?.apellido} - Cta: ${cuentaSeleccionada?.numero}`;
    addAsientoContable(desc, +form.monto, +form.monto, tipoTx === "deposito" ? ctaDebe : ctaHaber, tipoTx === "deposito" ? ctaHaber : ctaDebe);
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
            <Select value={form.cuentaId} onChange={v => setForm(f => ({ ...f, cuentaId: v }))}>
              <option value="">Seleccionar cuenta...</option>
              {cuentasFiltradas.map(c => {
                const s = socios.find(x => x.id === c.socioId);
                return <option key={c.id} value={c.id}>{c.numero} - {s?.nombre} {s?.apellido}</option>;
              })}
            </Select>
          </Field>
          <Field label="Monto (USD)" error={errors.monto} required>
            <Input value={form.monto} onChange={v => setForm(f => ({ ...f, monto: v }))} type="number" placeholder="0.00" />
          </Field>
          <Field label="Fecha">
            <Input value={form.fecha} onChange={v => setForm(f => ({ ...f, fecha: v }))} type="date" />
          </Field>
          <Field label="Descripción">
            <Input value={form.descripcion} onChange={v => setForm(f => ({ ...f, descripcion: v }))} placeholder="Descripción opcional..." />
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
                <p style={{ margin: 0, color: "#f1f5f9", fontWeight: 600 }}>{socio?.nombre} {socio?.apellido}</p>
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
};

// ─────────────────────────────────────────────
// CONSULTA MOVIMIENTOS
// ─────────────────────────────────────────────
const ConsultaMovimientos = () => {
  const { socios, cuentas, movimientos } = useApp();
  const [cedula, setCedula] = useState("");
  const [numCuenta, setNumCuenta] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const consultar = () => {
    setError(""); setResultado(null);
    if (!cedula || !numCuenta) { setError("Complete todos los campos"); return; }
    const socio = socios.find(s => s.cedula === cedula);
    if (!socio) { setError("No se encontró socio con esa cédula"); return; }
    const cuenta = cuentas.find(c => c.numero === numCuenta && c.socioId === socio.id);
    if (!cuenta) { setError("Cuenta no encontrada para ese socio"); return; }
    const movs = movimientos.filter(m => m.cuentaId === cuenta.id).slice(0, 3);
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
          <Btn onClick={consultar} style={{ width: "100%", justifyContent: "center", display: "flex" }}>🔍 Consultar</Btn>
        </Card>
        {resultado && (
          <div>
            <Card style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: 12 }}>Titular</p>
                  <p style={{ margin: 0, color: "#f1f5f9", fontWeight: 700, fontSize: 18 }}>{resultado.socio.nombre} {resultado.socio.apellido}</p>
                  <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: 13 }}>Cédula: {resultado.socio.cedula} | Cuenta: {resultado.cuenta.numero}</p>
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
              ) : resultado.movimientos.map(m => (
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
                      {m.tipo === "deposito" ? "+" : "-"}{fmt(m.monto)}
                    </p>
                    <p style={{ margin: 0, color: "#64748b", fontSize: 11 }}>Saldo: {fmt(m.saldoDespues)}</p>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// CRÉDITOS - SOLICITUDES
// ─────────────────────────────────────────────
const SolicitudesCredito = () => {
  const { creditos, setCreditos, socios, showToast, addAsientoContable } = useApp();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const emptyForm = { socioId: socios[0]?.id || "", monto: "", plazo: 12, tasa: 15, fecha: new Date().toISOString().split("T")[0], estado: "pendiente" };
  const [form, setForm] = useState(emptyForm);

  const { cuota } = form.monto && form.plazo ? calcAmortizacion(+form.monto, +form.plazo, +form.tasa) : { cuota: 0 };

  const save = () => {
    if (!form.socioId || !form.monto || +form.monto <= 0) { showToast("Complete los campos requeridos", "error"); return; }
    if (editing) {
      setCreditos(c => c.map(x => x.id === editing.id ? { ...x, ...form, monto: +form.monto, plazo: +form.plazo, tasa: +form.tasa, cuotaMensual: cuota, saldoPendiente: +form.monto } : x));
    } else {
      setCreditos(c => [...c, { ...form, id: Date.now(), socioId: +form.socioId, monto: +form.monto, plazo: +form.plazo, tasa: +form.tasa, cuotaMensual: cuota, saldoPendiente: +form.monto }]);
    }
    showToast("Crédito guardado"); setModal(false);
  };

  const aprobar = (cred) => {
    setCreditos(c => c.map(x => x.id === cred.id ? { ...x, estado: "aprobado" } : x));
    const s = socios.find(x => x.id === cred.socioId);
    addAsientoContable(`Entrega crédito - ${s?.nombre} ${s?.apellido}`, cred.monto, cred.monto, "1.2.01", "1.1.01");
    showToast("Crédito aprobado y entregado");
  };

  const cols = [
    { key: "socioId", label: "Socio", render: v => { const s = socios.find(x => x.id === v); return s ? `${s.nombre} ${s.apellido}` : "-"; } },
    { key: "monto", label: "Monto", render: v => fmt(v) },
    { key: "plazo", label: "Plazo", render: v => `${v} meses` },
    { key: "tasa", label: "Tasa", render: v => `${v}%` },
    { key: "cuotaMensual", label: "Cuota", render: v => fmt(v) },
    { key: "saldoPendiente", label: "Saldo Pend.", render: v => <span style={{ color: "#f59e0b" }}>{fmt(v)}</span> },
    { key: "estado", label: "Estado", render: v => <Badge label={v} color={v === "aprobado" ? "success" : v === "pendiente" ? "warning" : "error"} /> },
    { key: "fecha", label: "Fecha", render: fmtDate },
  ];

  return (
    <div>
      <PageHeader title="Solicitudes de Crédito" action={<Btn onClick={() => { setEditing(null); setForm(emptyForm); setModal(true); }}>+ Nueva Solicitud</Btn>} />
      <Card>
        <Table columns={cols} data={creditos} onEdit={c => { setEditing(c); setForm({ ...c }); setModal(true); }}
          onDelete={c => { setCreditos(x => x.filter(i => i.id !== c.id)); showToast("Eliminado", "warning"); }} />
        <div style={{ marginTop: 12 }}>
          {creditos.filter(c => c.estado === "pendiente").map(c => {
            const s = socios.find(x => x.id === c.socioId);
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: "1px solid #1e2d45" }}>
                <span style={{ color: "#f59e0b", fontSize: 13 }}>⏳ Pendiente: {s?.nombre} - {fmt(c.monto)}</span>
                <Btn size="sm" variant="success" onClick={() => aprobar(c)}>Aprobar y Entregar</Btn>
              </div>
            );
          })}
        </div>
      </Card>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Editar Crédito" : "Nueva Solicitud"}>
        <Field label="Socio" required>
          <Select value={form.socioId} onChange={v => setForm(f => ({ ...f, socioId: v }))}>
            {socios.map(s => <option key={s.id} value={s.id}>{s.nombre} {s.apellido}</option>)}
          </Select>
        </Field>
        <Field label="Monto solicitado (USD)" required>
          <Input value={form.monto} onChange={v => setForm(f => ({ ...f, monto: v }))} type="number" placeholder="0.00" />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Plazo (meses)">
            <Select value={form.plazo} onChange={v => setForm(f => ({ ...f, plazo: v }))}>
              {[3, 6, 12, 18, 24, 36, 48, 60].map(p => <option key={p}>{p}</option>)}
            </Select>
          </Field>
          <Field label="Tasa anual (%)">
            <Input value={form.tasa} onChange={v => setForm(f => ({ ...f, tasa: v }))} type="number" />
          </Field>
        </div>
        {cuota > 0 && (
          <div style={{ background: "#0f2447", borderRadius: 8, padding: 14, marginBottom: 16 }}>
            <p style={{ margin: 0, color: "#64748b", fontSize: 12 }}>Cuota mensual estimada</p>
            <p style={{ margin: 0, color: "#3b82f6", fontSize: 20, fontWeight: 700 }}>{fmt(cuota)}</p>
          </div>
        )}
        <Field label="Fecha"><Input value={form.fecha} onChange={v => setForm(f => ({ ...f, fecha: v }))} type="date" /></Field>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn onClick={save}>Guardar</Btn>
        </div>
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────
// AMORTIZACIÓN
// ─────────────────────────────────────────────
const TablaAmortizacion = () => {
  const { creditos, socios } = useApp();
  const [creditoId, setCreditoId] = useState("");
  const cred = creditos.find(c => c.id === +creditoId);
  const tabla = cred ? calcAmortizacion(cred.monto, cred.plazo, cred.tasa).tabla : [];
  const socio = cred ? socios.find(s => s.id === cred.socioId) : null;

  return (
    <div>
      <PageHeader title="Tabla de Amortización" />
      <Card style={{ marginBottom: 20 }}>
        <Field label="Seleccionar Crédito">
          <Select value={creditoId} onChange={setCreditoId}>
            <option value="">Seleccionar...</option>
            {creditos.filter(c => c.estado === "aprobado").map(c => {
              const s = socios.find(x => x.id === c.socioId);
              return <option key={c.id} value={c.id}>{s?.nombre} {s?.apellido} - {fmt(c.monto)} - {c.plazo} meses</option>;
            })}
          </Select>
        </Field>
        {cred && (
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { l: "Socio", v: `${socio?.nombre} ${socio?.apellido}` },
              { l: "Monto", v: fmt(cred.monto) },
              { l: "Plazo", v: `${cred.plazo} meses` },
              { l: "Tasa", v: `${cred.tasa}% anual` },
              { l: "Cuota Mensual", v: fmt(cred.cuotaMensual) },
            ].map(item => (
              <div key={item.l} style={{ background: "#0a0f1e", borderRadius: 8, padding: "10px 16px" }}>
                <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: 11 }}>{item.l}</p>
                <p style={{ margin: 0, color: "#f1f5f9", fontWeight: 600 }}>{item.v}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
      {tabla.length > 0 && (
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: "#f1f5f9", fontSize: 15 }}>Detalle de cuotas</h3>
            <Btn size="sm" variant="ghost" onClick={() => exportCSV(tabla, `amortizacion-${creditoId}.csv`, [
              { key: "cuota", label: "Cuota" }, { key: "pago", label: "Pago" }, { key: "capital", label: "Capital" }, { key: "interes", label: "Interés" }, { key: "saldo", label: "Saldo" }
            ])}>⬇ Exportar CSV</Btn>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0f1624" }}>
                  {["#", "Pago Total", "Capital", "Interés", "Saldo"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "#64748b", fontSize: 12, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tabla.map(r => (
                  <tr key={r.cuota} style={{ borderTop: "1px solid #1e293b" }}>
                    <td style={{ padding: "10px 14px", color: "#64748b" }}>{r.cuota}</td>
                    <td style={{ padding: "10px 14px", color: "#f1f5f9" }}>{fmt(r.pago)}</td>
                    <td style={{ padding: "10px 14px", color: "#3b82f6" }}>{fmt(r.capital)}</td>
                    <td style={{ padding: "10px 14px", color: "#f59e0b" }}>{fmt(r.interes)}</td>
                    <td style={{ padding: "10px 14px", color: "#22c55e" }}>{fmt(r.saldo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGO DE CUOTAS
// ─────────────────────────────────────────────
const PagoCuotas = () => {
  const { creditos, setCreditos, socios, showToast, addAsientoContable } = useApp();
  const [creditoId, setCreditoId] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const cred = creditos.find(c => c.id === +creditoId);
  const socio = cred ? socios.find(s => s.id === cred.socioId) : null;

  const registrar = () => {
    if (!cred || !monto || +monto <= 0) { showToast("Complete los datos", "error"); return; }
    const nuevoPendiente = Math.max(0, cred.saldoPendiente - +monto);
    setCreditos(c => c.map(x => x.id === cred.id ? { ...x, saldoPendiente: nuevoPendiente, estado: nuevoPendiente <= 0 ? "cancelado" : "aprobado" } : x));
    addAsientoContable(`Pago cuota - ${socio?.nombre} ${socio?.apellido}`, +monto, +monto, "1.1.01", "1.2.01");
    showToast("Pago registrado");
    setMonto(""); setCreditoId("");
  };

  const activosCreditos = creditos.filter(c => c.estado === "aprobado");

  return (
    <div>
      <PageHeader title="Registro de Pago de Cuotas" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <Card>
          <Field label="Crédito">
            <Select value={creditoId} onChange={setCreditoId}>
              <option value="">Seleccionar crédito...</option>
              {activosCreditos.map(c => {
                const s = socios.find(x => x.id === c.socioId);
                return <option key={c.id} value={c.id}>{s?.nombre} {s?.apellido} - Saldo: {fmt(c.saldoPendiente)}</option>;
              })}
            </Select>
          </Field>
          {cred && (
            <div style={{ background: "#0a0f1e", borderRadius: 8, padding: 14, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#64748b", fontSize: 12 }}>Cuota sugerida</span>
                <span style={{ color: "#3b82f6", fontWeight: 600 }}>{fmt(cred.cuotaMensual)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b", fontSize: 12 }}>Saldo pendiente</span>
                <span style={{ color: "#f59e0b", fontWeight: 600 }}>{fmt(cred.saldoPendiente)}</span>
              </div>
            </div>
          )}
          <Field label="Monto a pagar">
            <Input value={monto} onChange={setMonto} type="number" placeholder="0.00" />
          </Field>
          <Field label="Fecha"><Input value={fecha} onChange={setFecha} type="date" /></Field>
          <Btn variant="success" onClick={registrar} style={{ width: "100%", justifyContent: "center", display: "flex" }}>💰 Registrar Pago</Btn>
        </Card>
        <Card>
          <h3 style={{ margin: "0 0 16px", color: "#f1f5f9", fontSize: 15 }}>Créditos Activos</h3>
          {activosCreditos.map(c => {
            const s = socios.find(x => x.id === c.socioId);
            const pct = Math.round(((c.monto - c.saldoPendiente) / c.monto) * 100);
            return (
              <div key={c.id} style={{ marginBottom: 16, padding: 14, background: "#0a0f1e", borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <p style={{ margin: 0, color: "#cbd5e1", fontSize: 13, fontWeight: 600 }}>{s?.nombre} {s?.apellido}</p>
                  <span style={{ color: "#22c55e", fontSize: 12 }}>{pct}% pagado</span>
                </div>
                <div style={{ background: "#1e293b", borderRadius: 4, height: 6, overflow: "hidden" }}>
                  <div style={{ background: "#22c55e", height: "100%", width: `${pct}%`, borderRadius: 4 }} />
                </div>
                <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 11 }}>Saldo: {fmt(c.saldoPendiente)} / Cuota: {fmt(c.cuotaMensual)}</p>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// DIARIO DE CAJA
// ─────────────────────────────────────────────
const DiarioCaja = () => {
  const { diario, setDiario, planCuentas, showToast, addAsientoContable } = useApp();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ descripcion: "", monto: "", tipo: "ingreso", cuentaDebe: "1.1.01", cuentaHaber: "4.1.01", fecha: new Date().toISOString().split("T")[0] });

  const registrar = () => {
    if (!form.descripcion || !form.monto || +form.monto <= 0) { showToast("Complete los campos", "error"); return; }
    addAsientoContable(form.descripcion, +form.monto, +form.monto, form.cuentaDebe, form.cuentaHaber);
    showToast("Asiento registrado en Diario de Caja");
    setModal(false);
    setForm({ descripcion: "", monto: "", tipo: "ingreso", cuentaDebe: "1.1.01", cuentaHaber: "4.1.01", fecha: new Date().toISOString().split("T")[0] });
  };

  const cols = [
    { key: "fecha", label: "Fecha", render: fmtDate },
    { key: "descripcion", label: "Descripción" },
    { key: "cuentaDebe", label: "Cta. Debe" },
    { key: "cuentaHaber", label: "Cta. Haber" },
    { key: "debe", label: "Débito", render: v => <span style={{ color: "#22c55e" }}>{fmt(v)}</span> },
    { key: "haber", label: "Crédito", render: v => <span style={{ color: "#f59e0b" }}>{fmt(v)}</span> },
  ];

  return (
    <div>
      <PageHeader title="Diario de Caja" subtitle="Registro de ingresos y egresos con asientos automáticos"
        action={<Btn onClick={() => setModal(true)}>+ Nuevo Asiento</Btn>} />
      <Card>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <Btn size="sm" variant="ghost" onClick={() => exportCSV(diario, "diario-caja.csv", [
            { key: "fecha", label: "Fecha" }, { key: "descripcion", label: "Descripción" }, { key: "cuentaDebe", label: "Debe" }, { key: "cuentaHaber", label: "Haber" }, { key: "debe", label: "Débito" }, { key: "haber", label: "Crédito" }
          ])}>⬇ Exportar CSV</Btn>
        </div>
        <Table columns={cols} data={diario} />
      </Card>
      <Modal open={modal} onClose={() => setModal(false)} title="Nuevo Asiento - Ingresos/Egresos">
        <Field label="Tipo">
          <Select value={form.tipo} onChange={v => {
            setForm(f => ({ ...f, tipo: v, cuentaDebe: v === "ingreso" ? "1.1.01" : "5.1.01", cuentaHaber: v === "ingreso" ? "4.1.01" : "1.1.01" }));
          }}>
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </Select>
        </Field>
        <Field label="Descripción" required><Input value={form.descripcion} onChange={v => setForm(f => ({ ...f, descripcion: v }))} /></Field>
        <Field label="Monto" required><Input value={form.monto} onChange={v => setForm(f => ({ ...f, monto: v }))} type="number" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Cuenta Débito (Debe)">
            <Select value={form.cuentaDebe} onChange={v => setForm(f => ({ ...f, cuentaDebe: v }))}>
              {planCuentas.map(c => <option key={c.id} value={c.codigo}>{c.codigo} - {c.nombre}</option>)}
            </Select>
          </Field>
          <Field label="Cuenta Crédito (Haber)">
            <Select value={form.cuentaHaber} onChange={v => setForm(f => ({ ...f, cuentaHaber: v }))}>
              {planCuentas.map(c => <option key={c.id} value={c.codigo}>{c.codigo} - {c.nombre}</option>)}
            </Select>
          </Field>
        </div>
        <div style={{ background: "#0f2447", borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <p style={{ margin: "0 0 4px", color: "#64748b", fontSize: 12 }}>Asiento automático generado:</p>
          <p style={{ margin: 0, color: "#93c5fd", fontSize: 13 }}>Debe: {form.cuentaDebe} → Haber: {form.cuentaHaber} por {fmt(form.monto || 0)}</p>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn onClick={registrar}>Registrar Asiento</Btn>
        </div>
      </Modal>
    </div>
  );
};

// ─────────────────────────────────────────────
// REPORTES
// ─────────────────────────────────────────────
const ReporteBase = ({ titulo, data, columns, exportName }) => (
  <div>
    <PageHeader title={titulo}
      action={<Btn variant="success" onClick={() => exportCSV(data, `${exportName}.csv`, columns)}>⬇ Exportar CSV</Btn>} />
    <Card><Table columns={columns} data={data} /></Card>
  </div>
);

const ReporteLibroDiario = () => {
  const { diario } = useApp();
  const cols = [
    { key: "fecha", label: "Fecha", render: fmtDate },
    { key: "descripcion", label: "Descripción" },
    { key: "cuentaDebe", label: "Cuenta Debe" },
    { key: "cuentaHaber", label: "Cuenta Haber" },
    { key: "debe", label: "Débito", render: v => fmt(v) },
    { key: "haber", label: "Crédito", render: v => fmt(v) },
  ];
  const totalDebe = diario.reduce((s, d) => s + d.debe, 0);
  const totalHaber = diario.reduce((s, d) => s + d.haber, 0);
  return (
    <div>
      <ReporteBase titulo="Libro Diario" data={diario} columns={cols} exportName="libro-diario" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <Card><p style={{ margin: "0 0 4px", color: "#64748b" }}>Total Débitos</p><p style={{ margin: 0, color: "#22c55e", fontSize: 22, fontWeight: 700 }}>{fmt(totalDebe)}</p></Card>
        <Card><p style={{ margin: "0 0 4px", color: "#64748b" }}>Total Créditos</p><p style={{ margin: 0, color: "#f59e0b", fontSize: 22, fontWeight: 700 }}>{fmt(totalHaber)}</p></Card>
      </div>
    </div>
  );
};

const ReporteHistorialAhorros = () => {
  const { movimientos, cuentas, socios } = useApp();
  const data = movimientos.map(m => {
    const c = cuentas.find(x => x.id === m.cuentaId);
    const s = socios.find(x => x.id === c?.socioId);
    return { ...m, socio: `${s?.nombre || ""} ${s?.apellido || ""}`, numeroCuenta: c?.numero || "" };
  });
  const cols = [
    { key: "fecha", label: "Fecha", render: fmtDate },
    { key: "socio", label: "Socio" },
    { key: "numeroCuenta", label: "N° Cuenta" },
    { key: "tipo", label: "Tipo", render: v => <Badge label={v} color={v === "deposito" ? "success" : "warning"} /> },
    { key: "monto", label: "Monto", render: v => fmt(v) },
    { key: "saldoDespues", label: "Saldo", render: v => fmt(v) },
  ];
  return <ReporteBase titulo="Historial de Ahorros" data={data} columns={cols} exportName="historial-ahorros" />;
};

const ReporteCartera = () => {
  const { creditos, socios } = useApp();
  const data = creditos.map(c => {
    const s = socios.find(x => x.id === c.socioId);
    return { ...c, socio: `${s?.nombre || ""} ${s?.apellido || ""}` };
  });
  const cols = [
    { key: "socio", label: "Socio" },
    { key: "monto", label: "Monto Original", render: v => fmt(v) },
    { key: "saldoPendiente", label: "Saldo Pendiente", render: v => <span style={{ color: "#f59e0b" }}>{fmt(v)}</span> },
    { key: "cuotaMensual", label: "Cuota", render: v => fmt(v) },
    { key: "plazo", label: "Plazo", render: v => `${v} m` },
    { key: "tasa", label: "Tasa", render: v => `${v}%` },
    { key: "estado", label: "Estado", render: v => <Badge label={v} color={v === "aprobado" ? "success" : v === "pendiente" ? "warning" : "gray"} /> },
    { key: "fecha", label: "Fecha", render: fmtDate },
  ];
  const totalCartera = creditos.reduce((s, c) => s + c.saldoPendiente, 0);
  return (
    <div>
      <ReporteBase titulo="Cartera de Créditos" data={data} columns={cols} exportName="cartera-creditos" />
      <Card style={{ marginTop: 16 }}>
        <p style={{ margin: "0 0 4px", color: "#64748b" }}>Total Cartera Activa</p>
        <p style={{ margin: 0, color: "#3b82f6", fontSize: 26, fontWeight: 700 }}>{fmt(totalCartera)}</p>
      </Card>
    </div>
  );
};

const ReporteAportaciones = () => {
  const { cuentas, socios } = useApp();
  const data = cuentas.filter(c => c.tipo === "aportacion").map(c => {
    const s = socios.find(x => x.id === c.socioId);
    return { ...c, socio: `${s?.nombre || ""} ${s?.apellido || ""}`, cedula: s?.cedula || "" };
  });
  const cols = [
    { key: "cedula", label: "Cédula" },
    { key: "socio", label: "Socio" },
    { key: "numero", label: "N° Cuenta" },
    { key: "saldo", label: "Saldo Aportaciones", render: v => <span style={{ color: "#22c55e", fontWeight: 600 }}>{fmt(v)}</span> },
    { key: "fechaApertura", label: "Apertura", render: fmtDate },
    { key: "activa", label: "Estado", render: v => <Badge label={v ? "Activa" : "Inactiva"} color={v ? "success" : "gray"} /> },
  ];
  const total = data.reduce((s, c) => s + c.saldo, 0);
  return (
    <div>
      <ReporteBase titulo="Resumen de Aportaciones" data={data} columns={cols} exportName="aportaciones" />
      <Card style={{ marginTop: 16 }}>
        <p style={{ margin: "0 0 4px", color: "#64748b" }}>Total Aportaciones</p>
        <p style={{ margin: 0, color: "#22c55e", fontSize: 26, fontWeight: 700 }}>{fmt(total)}</p>
      </Card>
    </div>
  );
};

// ─────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────
const PAGES = {
  dashboard: <Dashboard />,
  usuarios: <Usuarios />,
  "plan-cuentas": <PlanCuentas />,
  "tipos-aportacion": <TiposAportacion />,
  socios: <Socios />,
  cuentas: <Cuentas />,
  "depositos-ahorro": <TransaccionPage titulo="Depósito de Ahorros" tipoTx="deposito" tipoCuenta="ahorro" ctaDebe="1.1.01" ctaHaber="2.1.01" />,
  "retiros-ahorro": <TransaccionPage titulo="Retiro de Ahorros" tipoTx="retiro" tipoCuenta="ahorro" ctaDebe="2.1.01" ctaHaber="1.1.01" />,
  "depositos-aportacion": <TransaccionPage titulo="Depósito de Aportaciones" tipoTx="deposito" tipoCuenta="aportacion" ctaDebe="1.1.01" ctaHaber="2.1.02" />,
  "retiros-aportacion": <TransaccionPage titulo="Retiro de Aportaciones" tipoTx="retiro" tipoCuenta="aportacion" ctaDebe="2.1.02" ctaHaber="1.1.01" />,
  "consulta-movimientos": <ConsultaMovimientos />,
  "solicitudes-credito": <SolicitudesCredito />,
  amortizacion: <TablaAmortizacion />,
  "pago-cuotas": <PagoCuotas />,
  "diario-caja": <DiarioCaja />,
  "reporte-libro-diario": <ReporteLibroDiario />,
  "reporte-historial-ahorros": <ReporteHistorialAhorros />,
  "reporte-cartera": <ReporteCartera />,
  "reporte-aportaciones": <ReporteAportaciones />,
};

const ROLES_PAGES = {
  dashboard: ["Admin", "Cajero", "Auditor"],
  usuarios: ["Admin"],
  "plan-cuentas": ["Admin"],
  "tipos-aportacion": ["Admin"],
  socios: ["Admin", "Cajero"],
  cuentas: ["Admin", "Cajero"],
  "depositos-ahorro": ["Admin", "Cajero"],
  "retiros-ahorro": ["Admin", "Cajero"],
  "depositos-aportacion": ["Admin", "Cajero"],
  "retiros-aportacion": ["Admin", "Cajero"],
  "consulta-movimientos": ["Admin", "Cajero", "Auditor"],
  "solicitudes-credito": ["Admin", "Cajero"],
  amortizacion: ["Admin", "Cajero", "Auditor"],
  "pago-cuotas": ["Admin", "Cajero"],
  "diario-caja": ["Admin", "Cajero", "Auditor"],
  "reporte-libro-diario": ["Admin", "Auditor"],
  "reporte-historial-ahorros": ["Admin", "Auditor"],
  "reporte-cartera": ["Admin", "Auditor"],
  "reporte-aportaciones": ["Admin", "Auditor"],
};

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <AppRouter />
      <Toast />
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        input:focus, select:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 3px; }
        @keyframes slideIn { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
      `}</style>
    </AppProvider>
  );
}

const AppRouter = () => {
  const { currentUser, currentPage } = useApp();
  if (!currentUser) return <LoginPage />;
  const allowedRoles = ROLES_PAGES[currentPage];
  const canAccess = !allowedRoles || allowedRoles.includes(currentUser.rol);
  return (
    <Layout>
      {canAccess ? (PAGES[currentPage] || <Dashboard />) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50vh", color: "#64748b" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ margin: 0, color: "#f1f5f9" }}>Acceso restringido</h2>
          <p>No tienes permisos para ver esta sección.</p>
        </div>
      )}
    </Layout>
  );
};
