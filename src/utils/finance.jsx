// src/utils/finance.jsx
export const calcAmortizacion = (monto, plazo, tasa) => {
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