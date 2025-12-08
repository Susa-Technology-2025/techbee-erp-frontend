import * as XLSX from "xlsx";

export async function processExcelFile(
  file: File
): Promise<{ headers: string[]; data: any[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, {
          type: "array",
          cellDates: true,
          cellText: false,
          raw: true,
        });

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
          header: 1,
          defval: null,
        });

        if (!jsonData.length) {
          throw new Error("Empty file");
        }

        const headers = (jsonData[0] as string[]).map(
          (h) => h?.toString()?.trim() || ""
        );
        const rows = jsonData.slice(1).map((row: any) => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[`col${index}`] = safeConvertValue(row[index]);
          });
          return obj;
        });

        resolve({ headers, data: rows });
      } catch (error) {
        reject(
          new Error(
            `File processing failed: ${
              error instanceof Error ? error.message : String(error)
            }`
          )
        );
      }
    };

    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsArrayBuffer(file);
  });
}

function safeConvertValue(value: any): any {
  if (value == null || value === "") return null;

  // if (typeof value === "boolean") return value;
  // if (typeof value === "string") {
  //   const lowerVal = value.toLowerCase().trim();
  //   if (lowerVal === "true") return true;
  //   if (lowerVal === "false") return false;
  // }

  // if (typeof value === "number") return value;
  // if (!isNaN(value) && value !== "") {
  //   const num = Number(value);
  //   if (!isNaN(num)) return num;
  // }

  // if (value instanceof Date) {
  //   return value.toISOString();
  // }

  // if (typeof value === "number" && value > 0) {
  //   try {
  //     const date = XLSX.SSF.parse_date_code(value);
  //     if (date) {
  //       const jsDate = new Date(date.y, date.m - 1, date.d);
  //       return jsDate.toISOString();
  //     }
  //   } catch {}
  // }

  return String(value).trim();
}
