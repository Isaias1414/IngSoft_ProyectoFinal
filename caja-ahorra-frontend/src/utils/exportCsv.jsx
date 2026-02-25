// src/utils/exportCsv.jsx
export const exportCSV = (data, filename, cols) => {
  const headers = cols.map((c) => c.label).join(",");
  const rows = data
    .map((row) => cols.map((c) => `"${row[c.key] ?? ""}"`).join(","))
    .join("\n");

  const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};