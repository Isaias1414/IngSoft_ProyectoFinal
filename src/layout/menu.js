// src/layout/menu.js
export const MENU = [
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