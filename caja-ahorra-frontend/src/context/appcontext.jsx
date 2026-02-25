// src/context/appcontext.jsx
import { createContext, useCallback, useContext, useState } from "react";
import {
  MOCK_USERS,
  MOCK_SOCIOS,
  MOCK_CUENTAS,
  MOCK_MOVIMIENTOS,
  MOCK_CREDITOS,
  MOCK_DIARIO,
  MOCK_PLAN_CUENTAS,
  MOCK_TIPOS_APORTACION,
} from "../data/seed";

const AppCtx = createContext(null);

export const AppProvider = ({ children }) => {
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
    const u = MOCK_USERS.find((u) => u.email === email && u.password === password);
    if (u) {
      setCurrentUser(u);
      setCurrentPage("dashboard");
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage("login");
  };

  const navigate = (page) => setCurrentPage(page);

  const addAsientoContable = (desc, debe, haber, ctaDebe, ctaHaber) => {
    const entry = {
      id: Date.now(),
      fecha: new Date().toISOString().split("T")[0],
      descripcion: desc,
      debe,
      haber,
      cuentaDebe: ctaDebe,
      cuentaHaber: ctaHaber,
    };
    setDiario((d) => [entry, ...d]);
  };

  return (
    <AppCtx.Provider
      value={{
        currentUser,
        currentPage,
        navigate,
        login,
        logout,

        toast,
        showToast,

        usuarios,
        setUsuarios,
        socios,
        setSocios,
        cuentas,
        setCuentas,
        movimientos,
        setMovimientos,
        creditos,
        setCreditos,
        diario,
        setDiario,
        planCuentas,
        setPlanCuentas,
        tiposAportacion,
        setTiposAportacion,

        addAsientoContable,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
};

export const useApp = () => useContext(AppCtx);