// src/components/ui/table.jsx
import { useMemo, useState } from "react";
import Input from "./input";
import Btn from "./btn";

export default function Table({ columns, data, onEdit, onDelete, emptyMsg = "Sin registros" }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const filtered = useMemo(() => {
    if (!search) return data;
    return data.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase()));
  }, [data, search]);

  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Input
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="🔍  Buscar..."
          style={{ maxWidth: 320 }}
        />
      </div>

      <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid #2d3748" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#0f1624" }}>
              {columns.map((c) => (
                <th
                  key={c.key}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    color: "#64748b",
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th style={{ padding: "12px 16px", color: "#64748b", fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>
                  Acciones
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: 40, textAlign: "center", color: "#4b5563" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                  {emptyMsg}
                </td>
              </tr>
            ) : (
              paged.map((row, i) => (
                <tr
                  key={row.id || i}
                  style={{ borderTop: "1px solid #1e293b", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#1e293b")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {columns.map((c) => (
                    <td key={c.key} style={{ padding: "12px 16px", color: "#cbd5e1", fontSize: 14 }}>
                      {c.render ? c.render(row[c.key], row) : row[c.key] ?? "-"}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td style={{ padding: "12px 16px", display: "flex", gap: 8 }}>
                      {onEdit && (
                        <Btn size="sm" variant="ghost" onClick={() => onEdit(row)}>
                          ✏️
                        </Btn>
                      )}
                      {onDelete && (
                        <Btn size="sm" variant="danger" onClick={() => onDelete(row)}>
                          🗑️
                        </Btn>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
          <Btn size="sm" variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            ‹ Ant
          </Btn>
          <span style={{ color: "#64748b", fontSize: 13, alignSelf: "center" }}>
            Pág {page} / {pages}
          </span>
          <Btn size="sm" variant="ghost" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>
            Sig ›
          </Btn>
        </div>
      )}
    </div>
  );
}