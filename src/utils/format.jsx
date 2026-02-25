// src/utils/format.jsx
export const fmt = (n) =>
  new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(n || 0);

export const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("es-EC") : "-");