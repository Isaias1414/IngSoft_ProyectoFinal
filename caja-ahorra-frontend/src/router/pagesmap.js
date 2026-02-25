// src/router/pagesmap.js
import Dashboard from "../pages/dashboard";
import Usuarios from "../pages/usuarios";
import PlanCuentas from "../pages/plancuentas";
import TiposAportacion from "../pages/tiposaportacion";
import Socios from "../pages/socios";
import Cuentas from "../pages/cuentas";
import TransaccionPage from "../pages/transaccionpage";
import ConsultaMovimientos from "../pages/consultamovimientos";
import SolicitudesCredito from "../pages/solicitudescredito";
import TablaAmortizacion from "../pages/tablaamortizacion";
import PagoCuotas from "../pages/pagocuotas";
import DiarioCaja from "../pages/diariocaja";

import ReporteLibroDiario from "../pages/reportes/reportelibrodiario";
import ReporteHistorialAhorros from "../pages/reportes/reportehistorialahorros";
import ReporteCartera from "../pages/reportes/reportecartera";
import ReporteAportaciones from "../pages/reportes/reporteaportaciones";

export const PAGES = {
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