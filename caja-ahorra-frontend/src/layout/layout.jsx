// src/layout/layout.jsx
import { useState } from "react";
import { useApp } from "../context/appcontext";
import Btn from "../components/ui/btn";
import { MENU } from "./menu";

export default function Layout({ children }) {
  const { currentUser, currentPage, navigate, logout } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const current = MENU.find((m) => m.key === currentPage);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0a0f1e", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", overflow: "hidden" }}>
      {/* Sidebar */}
      <div
        style={{
          width: collapsed ? 60 : 240,
          background: "#0d1526",
          borderRight: "1px solid #1e2d45",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.25s ease",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: collapsed ? "20px 8px" : "20px 20px",
            borderBottom: "1px solid #1e2d45",
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#3b82f6,#1d4ed8)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
            🏦
          </div>
          {!collapsed && (
            <div>
              <p style={{ margin: 0, color: "#f1f5f9", fontWeight: 700, fontSize: 14 }}>CajaAhorro</p>
              <p style={{ margin: 0, color: "#3b82f6", fontSize: 11 }}>Sistema Financiero</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {MENU.filter((m) => m.roles?.includes(currentUser?.rol) || m.type).map((item, i) => {
            if (item.type === "section") {
              if (collapsed) return null;

              const idx = MENU.indexOf(item);
              const nextSection = MENU.slice(idx + 1).find((m) => m.type === "section");

              const sectionItems = MENU.filter((m) => !m.type).filter((m) => {
                const pos = MENU.indexOf(m);
                return m.roles?.includes(currentUser?.rol) && pos > idx && (!nextSection || pos < MENU.indexOf(nextSection));
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
              <div
                key={item.key}
                onClick={() => navigate(item.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: collapsed ? "10px 0" : "10px 20px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  cursor: "pointer",
                  background: active ? "#1e3a5f" : "transparent",
                  borderLeft: active ? "3px solid #3b82f6" : "3px solid transparent",
                  color: active ? "#93c5fd" : "#64748b",
                  fontSize: 13,
                  fontWeight: active ? 600 : 400,
                  transition: "all 0.15s",
                }}
              >
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
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#1e3a5f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#93c5fd",
                  fontWeight: 700,
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                {currentUser?.nombre?.[0]}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, color: "#f1f5f9", fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser?.nombre}</p>
                <p style={{ margin: 0, color: "#3b82f6", fontSize: 11 }}>{currentUser?.rol}</p>
              </div>
            </div>

            <Btn size="sm" variant="ghost" onClick={logout} style={{ width: "100%", marginTop: 10, justifyContent: "center", display: "flex" }}>
              Cerrar Sesión
            </Btn>
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Topbar */}
        <div style={{ height: 56, background: "#0d1526", borderBottom: "1px solid #1e2d45", display: "flex", alignItems: "center", padding: "0 24px", gap: 16, flexShrink: 0 }}>
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 18 }}>
            ☰
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 13 }}>
            <span>Inicio</span>
            <span>/</span>
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
}