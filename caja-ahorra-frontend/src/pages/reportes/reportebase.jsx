// src/pages/reportes/reportebase.jsx
import Card from "../../components/ui/card";
import Table from "../../components/ui/table";
import Btn from "../../components/ui/btn";
import PageHeader from "../../components/ui/pageheader";
import { exportCSV } from "../../utils/exportCsv";

export default function ReporteBase({ titulo, data, columns, exportName }) {
  return (
    <div>
      <PageHeader
        title={titulo}
        action={
          <Btn variant="success" onClick={() => exportCSV(data, `${exportName}.csv`, columns)}>
            ⬇ Exportar CSV
          </Btn>
        }
      />
      <Card>
        <Table columns={columns} data={data} />
      </Card>
    </div>
  );
}