// src/router/approuter.jsx
import Layout from "../layout/layout";
import { useApp } from "../context/appcontext";
import LoginPage from "../pages/loginpage";
import Dashboard from "../pages/dashboard";

import { PAGES } from "./pagesmap";
import { ROLES_PAGES } from "./rolespages";

export default function AppRouter() {
  const { currentUser, currentPage } = useApp();

  if (!currentUser) return <LoginPage />;

  const allowedRoles = ROLES_PAGES[currentPage];
  const canAccess = !allowedRoles || allowedRoles.includes(currentUser.rol);

  return (
    <Layout>
      {canAccess ? (
        PAGES[currentPage] || <Dashboard />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50vh", color: "#64748b" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ margin: 0, color: "#f1f5f9" }}>Acceso restringido</h2>
          <p>No tienes permisos para ver esta sección.</p>
        </div>
      )}
    </Layout>
  );
}