// src/data/seed.jsx
export const ROLES = { ADMIN: "Admin", CAJERO: "Cajero", AUDITOR: "Auditor" };

export const MOCK_USERS = [
  { id: 1, nombre: "Carlos Administrador", email: "admin@caja.com", password: "admin123", rol: ROLES.ADMIN, activo: true },
  { id: 2, nombre: "María Cajero", email: "cajero@caja.com", password: "cajero123", rol: ROLES.CAJERO, activo: true },
  { id: 3, nombre: "Pedro Auditor", email: "auditor@caja.com", password: "auditor123", rol: ROLES.AUDITOR, activo: true },
];

export const MOCK_SOCIOS = [
  { id: 1, cedula: "1712345678", nombre: "Ana García", apellido: "López", telefono: "0991234567", email: "ana@email.com", fechaIngreso: "2023-01-15", activo: true, direccion: "Av. Amazonas 123" },
  { id: 2, cedula: "1756789012", nombre: "Juan Pérez", apellido: "Mora", telefono: "0987654321", email: "juan@email.com", fechaIngreso: "2023-03-20", activo: true, direccion: "Calle Sucre 456" },
  { id: 3, cedula: "1734567890", nombre: "Rosa Quiñones", apellido: "Torres", telefono: "0912345678", email: "rosa@email.com", fechaIngreso: "2022-11-08", activo: true, direccion: "Av. 6 de Diciembre 789" },
];

export const MOCK_CUENTAS = [
  { id: 1, socioId: 1, numero: "AH-001-2023", tipo: "ahorro", saldo: 1250.75, fechaApertura: "2023-01-15", activa: true },
  { id: 2, socioId: 2, numero: "AH-002-2023", tipo: "ahorro", saldo: 3400.0, fechaApertura: "2023-03-20", activa: true },
  { id: 3, socioId: 3, numero: "AP-001-2023", tipo: "aportacion", saldo: 5000.0, fechaApertura: "2022-11-08", activa: true },
  { id: 4, socioId: 1, numero: "AP-001-2023B", tipo: "aportacion", saldo: 800.0, fechaApertura: "2023-01-15", activa: true },
];

export const MOCK_PLAN_CUENTAS = [
  { id: 1, codigo: "1.1.01", nombre: "Caja General", tipo: "Activo", nivel: 3 },
  { id: 2, codigo: "1.1.02", nombre: "Banco Pichincha", tipo: "Activo", nivel: 3 },
  { id: 3, codigo: "2.1.01", nombre: "Depósitos de Ahorro", tipo: "Pasivo", nivel: 3 },
  { id: 4, codigo: "2.1.02", nombre: "Aportaciones Socios", tipo: "Pasivo", nivel: 3 },
  { id: 5, codigo: "4.1.01", nombre: "Intereses Cartera", tipo: "Ingreso", nivel: 3 },
  { id: 6, codigo: "5.1.01", nombre: "Gastos Operativos", tipo: "Egreso", nivel: 3 },
  { id: 7, codigo: "1.2.01", nombre: "Cartera de Crédito", tipo: "Activo", nivel: 3 },
];

export const MOCK_MOVIMIENTOS = [
  { id: 1, cuentaId: 1, tipo: "deposito", monto: 500.0, fecha: "2024-01-15", descripcion: "Depósito ahorro", saldoDespues: 1250.75 },
  { id: 2, cuentaId: 1, tipo: "retiro", monto: 200.0, fecha: "2024-01-10", descripcion: "Retiro ahorro", saldoDespues: 750.75 },
  { id: 3, cuentaId: 1, tipo: "deposito", monto: 700.0, fecha: "2024-01-05", descripcion: "Depósito inicial", saldoDespues: 950.75 },
  { id: 4, cuentaId: 2, tipo: "deposito", monto: 1000.0, fecha: "2024-01-20", descripcion: "Depósito ahorro", saldoDespues: 3400.0 },
  { id: 5, cuentaId: 2, tipo: "deposito", monto: 1200.0, fecha: "2024-01-08", descripcion: "Depósito ahorro", saldoDespues: 2400.0 },
  { id: 6, cuentaId: 2, tipo: "retiro", monto: 800.0, fecha: "2024-01-03", descripcion: "Retiro", saldoDespues: 1200.0 },
];

export const MOCK_CREDITOS = [
  { id: 1, socioId: 1, monto: 5000.0, plazo: 12, tasa: 15, estado: "aprobado", fecha: "2024-01-10", cuotaMensual: 451.28, saldoPendiente: 3500.0 },
  { id: 2, socioId: 2, monto: 2000.0, plazo: 6, tasa: 15, estado: "pendiente", fecha: "2024-01-22", cuotaMensual: 347.82, saldoPendiente: 2000.0 },
  { id: 3, socioId: 3, monto: 8000.0, plazo: 24, tasa: 15, estado: "aprobado", fecha: "2023-11-01", cuotaMensual: 388.76, saldoPendiente: 6800.0 },
];

export const MOCK_DIARIO = [
  { id: 1, fecha: "2024-01-20", descripcion: "Depósito de ahorro - Ana García", debe: 500.0, haber: 500.0, cuentaDebe: "1.1.01", cuentaHaber: "2.1.01" },
  { id: 2, fecha: "2024-01-19", descripcion: "Pago cuota crédito - Juan Pérez", debe: 451.28, haber: 451.28, cuentaDebe: "1.1.01", cuentaHaber: "1.2.01" },
  { id: 3, fecha: "2024-01-18", descripcion: "Egreso servicios básicos", debe: 150.0, haber: 150.0, cuentaDebe: "5.1.01", cuentaHaber: "1.1.01" },
];

export const MOCK_TIPOS_APORTACION = [
  { id: 1, nombre: "Aportación Mensual Obligatoria", monto: 50.0, periodicidad: "mensual", activo: true },
  { id: 2, nombre: "Aportación Voluntaria", monto: 0, periodicidad: "variable", activo: true },
  { id: 3, nombre: "Fondo de Reserva", monto: 25.0, periodicidad: "mensual", activo: true },
];