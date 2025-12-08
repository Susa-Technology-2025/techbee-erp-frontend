// @ts-nocheck

import { ZodSchema, ZodObject, ZodOptional, ZodNullable } from "zod";
import { MRT_ColumnDef } from "material-react-table";

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export function parseExcelData<T>(
  data: any[],
  headers: string[],
  schema: ZodSchema<T>,
  expectedColumns: MRT_ColumnDef<z.infer<T>>[]
): ValidationResult {
  const errors: Record<string, string[]> = {};

  // Map accessorKey -> header (for error messages)
  const accessorToHeaderMap: Record<string, string> = {};
  // Map header -> accessorKey (for data mapping)
  const headerToAccessorMap: Record<string, string> = {};
  expectedColumns.forEach((col) => {
    if (col.accessorKey && col.header) {
      const headerString = col.header as string;
      accessorToHeaderMap[col.accessorKey] = headerString;
      headerToAccessorMap[headerString] = col.accessorKey as string;
    }
  });

  const requiredAccessorKeys: string[] = [];
  if (schema instanceof ZodObject) {
    for (const key in schema.shape) {
      const zodType = schema.shape[key];
      // Check if the type is not optional and not nullable
      if (zodType instanceof ZodOptional && zodType instanceof ZodNullable) {
        requiredAccessorKeys.push(key);
      }
    }
  }

  const requiredHeaders: string[] = [];
  requiredAccessorKeys.forEach((accessorKey) => {
    const headerName = accessorToHeaderMap[accessorKey];
    if (headerName) {
      requiredHeaders.push(headerName);
    }
  });

  const headerErrors = validateHeaders(headers, requiredHeaders);
  if (headerErrors.length > 0) {
    // Still return header errors immediately
    return {
      isValid: false,
      errors: { "-1": headerErrors },
    };
  }

  let allValid = true;
  data.forEach((row, rowIndex) => {
    const rowErrors: string[] = [];
    const rowData: Record<string, any> = {};

    // Map data by header name, not by column index
    headers.forEach((header, colIndex) => {
      const accessorKey = headerToAccessorMap[header];
      if (accessorKey) {
        // Use the original row data which is an object like { col0: 'value', col1: 'value' }
        const cellValue = row[`col${colIndex}`];
        rowData[accessorKey] = cellValue === "" ? null : cellValue;
      }
    });

    // Also ensure all expected keys are present, even if null
    Object.values(headerToAccessorMap).forEach((key) => {
      if (!(key in rowData)) {
        rowData[key] = null;
      }
    });

    try {
      const result = schema.safeParse(rowData);
      if (!result.success) {
        allValid = false;
        result.error.errors.forEach((err) => {
          const accessorKey = err.path.join(".");
          // Use the map to get the user-friendly header name for the error message
          const headerName = accessorToHeaderMap[accessorKey] || accessorKey;
          const errorMessage = formatErrorMessage(
            headerName,
            err.message,
            err.code
          );
          rowErrors.push(errorMessage);
        });
      }
    } catch (error) {
      allValid = false;
      rowErrors.push("Validation failed for this row");
    }

    if (rowErrors.length > 0) {
      errors[rowIndex.toString()] = rowErrors;
    }
  });

  return {
    isValid: allValid && Object.keys(errors).length === 0,
    errors,
  };
}

function formatErrorMessage(
  field: string,
  message: string,
  code?: string
): string {
  let formattedMessage = "";
  switch (code) {
    case "invalid_type":
      formattedMessage = `${field}: Invalid data type. ${message}`;
      break;
    case "too_small":
      formattedMessage = `${field}: ${message}`;
      break;
    case "too_big":
      formattedMessage = `${field}: ${message}`;
      break;
    case "invalid_string":
      if (message.includes("email"))
        formattedMessage = `${field}: Must be a valid email address`;
      else if (message.includes("url"))
        formattedMessage = `${field}: Must be a valid URL`;
      else formattedMessage = `${field}: Invalid format`;
      break;
    default:
      if (message === "Required")
        formattedMessage = `${field}: This field is required.`;
      else formattedMessage = `${field}: ${message}`;
      break;
  }
  // Ensure a message is always returned, even if it's a generic one
  return formattedMessage || `${field}: An unknown validation error occurred.`;
}

function validateHeaders(
  actualHeaders: string[],
  requiredHeaders: string[]
): string[] {
  const errors: string[] = [];
  const actualSet = new Set(actualHeaders.map((h) => (h ? h.trim() : "")));
  const requiredSet = new Set(requiredHeaders.map((h) => (h ? h.trim() : "")));

  requiredHeaders.forEach((header) => {
    if (!header) return;
    if (!actualSet.has(header.trim())) {
      errors.push(`Missing required column: "${header}"`);
    }
  });

  // Check for case mismatches or extra whitespace, which can cause issues.
  const lowerCaseActual = actualHeaders.map((h) =>
    h ? h.trim().toLowerCase() : ""
  );
  requiredHeaders.forEach((header) => {
    if (!header) return;
    const trimmedHeader = header.trim();
    if (actualSet.has(trimmedHeader)) return; // Already matches exactly

    const lowerHeader = trimmedHeader.toLowerCase();
    const actualHeaderIndex = lowerCaseActual.indexOf(lowerHeader);
    if (actualHeaderIndex !== -1) {
      errors.push(
        `Column name mismatch: Found "${actualHeaders[actualHeaderIndex]}" but expected "${trimmedHeader}". Please ensure names and casing match exactly.`
      );
    }
  });

  return errors;
}
