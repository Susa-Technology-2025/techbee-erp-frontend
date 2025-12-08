"use client";

import { generatePdf } from "./export/puppeter-pdf";
import * as XLSX from "xlsx";
import { MRT_TableInstance } from "material-react-table";

interface ReportParams {
  companyName: string;
  reportTitle: string;
  preparedBy: string;
  reportDate: string;
  reportVersion: string;
  confidentiality: string;
  reportPeriod: string;
  approvalStatus: string;
  recipient: string;
  projectCode: string;
  department: string;
  referenceNumber: string;
  keywords: string;
  disclaimer: string;
  dataSource: string;
  customNote: string;
  pageOrientation: "portrait" | "landscape";
  exportFormat: "pdf" | "xlsx" | "csv" | "json" | "template";
  content: string;
  selectedColumns: string[];
  companyLogo: string;
}

// ⚠️ CHANGE 1: Accept the columnHeaderMap argument
export const exportTable = async (
  params: ReportParams,
  table: MRT_TableInstance<any>,
  columnHeaderMap: Record<string, string> // New argument for ID -> Header mapping
): Promise<Blob | string> => {
  console.log(params.exportFormat);

  // Get all data from the table (before client-side pagination)
  const allData = table
    .getPrePaginationRowModel()
    .rows.map((row) => row.original);

  const selectedColumnIds = Object.keys(columnHeaderMap); // Use keys from the map

  // Filter MRT columns based on the IDs provided by the component
  const selectedColumns = table
    .getAllColumns()
    .filter((col) => selectedColumnIds.includes(col.id));

  // ⚠️ CHANGE 2: Get headers directly from the columnHeaderMap values
  const selectedHeaders = Object.values(columnHeaderMap);

  const selectedData = allData.map((row) => {
    const newRow: Record<string, any> = {};
    selectedColumns.forEach((column) => {
      // ⚠️ CHANGE 3: Use the header from the map, falling back to column.id if not found (shouldn't happen)
      const header = columnHeaderMap[column.id] || column.id;

      const value = column.accessorKey
        ? row[column.accessorKey as keyof typeof row]
        : column.accessorFn
        ? column.accessorFn(row)
        : row[column.id as keyof typeof row];

      // Store the value using the user-friendly header name
      newRow[header] = value;
    });
    return newRow;
  });

  const tableDataWithRowNumbers = selectedData.map((row, index) => ({
    Row: index + 1,
    ...row,
  }));

  const headersWithRowNumber = ["Row", ...selectedHeaders];

  if (params.exportFormat === "pdf") {
    try {
      // Note: The generatePdf function might need to be updated to handle the new selectedData structure
      const pdfBuffer = await generatePdf(selectedData, params);

      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${params.reportTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      console.log("PDF generated and downloaded successfully!");
      return "PDF download initiated.";
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      throw new Error("Failed to generate PDF.");
    }
  } else if (params.exportFormat === "xlsx") {
    // XLSX export uses the headersWithRowNumber and tableDataWithRowNumbers (which use the correct headers)
    const wsData = [
      ["Report Title", params.reportTitle],
      ["Company", params.companyName],
      ["Prepared By", params.preparedBy],
      ["Date", params.reportDate],
      ["Version", params.reportVersion],
      ["Confidentiality", params.confidentiality],
      ["Period", params.reportPeriod],
      ["Approval Status", params.approvalStatus],
      ["Recipient", params.recipient],
      ["Project Code", params.projectCode],
      ["Department", params.department],
      ["Reference Number", params.referenceNumber],
      ["Keywords", params.keywords],
      ["Disclaimer", params.disclaimer],
      ["Data Source", params.dataSource],
      ...(params.customNote ? [["Custom Note", params.customNote]] : []),
      [],
      headersWithRowNumber,
      // Pass the keys in the correct order based on headersWithRowNumber for Object.values to work
      ...tableDataWithRowNumbers.map((row) =>
        headersWithRowNumber.map((header) => row[header])
      ),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    return new Blob([wbout], { type: "application/octet-stream" });
  } else if (params.exportFormat === "template") {
    // Template export uses the correct headers
    const wsData = [headersWithRowNumber];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    return new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  } else if (params.exportFormat === "csv") {
    // CSV export uses the headersWithRowNumber and row data, which now have the correct headers
    const rows = tableDataWithRowNumbers.map((row) =>
      headersWithRowNumber.map((header) => `"${row[header]}"`)
    );

    const csvContent = [
      ["Report Title", `"${params.reportTitle}"`],
      ["Company", `"${params.companyName}"`],
      ["Prepared By", `"${params.preparedBy}"`],
      ["Date", `"${params.reportDate}"`],
      ["Version", `"${params.reportVersion}"`],
      ["Confidentiality", `"${params.confidentiality}"`],
      ["Period", `"${params.reportPeriod}"`],
      ["Approval Status", `"${params.approvalStatus}"`],
      ["Recipient", `"${params.recipient}"`],
      ["Project Code", `"${params.projectCode}"`],
      ["Department", `"${params.department}"`],
      ["Reference Number", `"${params.referenceNumber}"`],
      ["Keywords", `"${params.keywords}"`],
      ["Disclaimer", `"${params.disclaimer}"`],
      ["Data Source", `"${params.dataSource}"`],
      ...(params.customNote ? [["Custom Note", `"${params.customNote}"`]] : []),
      [],
      headersWithRowNumber,
      ...rows,
    ]
      .map((row) => row.join(","))
      .join("\n");

    return new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  } else if (params.exportFormat === "json") {
    const jsonContent = {
      metadata: {
        reportTitle: params.reportTitle,
        companyName: params.companyName,
        preparedBy: params.preparedBy,
        reportDate: params.reportDate,
        reportVersion: params.reportVersion,
        confidentiality: params.confidentiality,
        reportPeriod: params.reportPeriod,
        approvalStatus: params.approvalStatus,
        recipient: params.recipient,
        projectCode: params.projectCode,
        department: params.department,
        referenceNumber: params.referenceNumber,
        keywords: params.keywords,
        disclaimer: params.disclaimer,
        dataSource: params.dataSource,
        customNote: params.customNote,
      },
      // JSON now contains the correct headers as keys
      data: tableDataWithRowNumbers,
    };

    return new Blob([JSON.stringify(jsonContent, null, 2)], {
      type: "application/json",
    });
  }

  throw new Error("Unsupported export format");
};
