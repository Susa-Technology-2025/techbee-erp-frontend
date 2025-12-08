import * as XLSX from "xlsx";

type TableHeader = {
  text: string;
  style: string;
};

type ExportData = {
  tableHeaders: TableHeader[];
  tableData: (string | number | boolean | Date)[][];
  fileName: string;
};

export const exportToXLSX = ({
  tableHeaders,
  tableData,
  fileName,
}: ExportData) => {
  const headers = tableHeaders.map((header) => header.text);
  const data = [headers, ...tableData];

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};
