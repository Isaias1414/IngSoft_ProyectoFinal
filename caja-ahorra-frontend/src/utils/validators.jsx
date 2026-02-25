// src/utils/validators.jsx
export const validarCedula = (c) => {
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