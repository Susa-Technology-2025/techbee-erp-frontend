"use server";
import fs from "fs";
import path from "path";

export async function logErrorToFile(error: unknown) {
  const logPath = path.resolve(
    process.env.HOME || "~",
    "techbee_erp_webapp_error.log"
  );

  const timestamp = new Date().toISOString();
  const msg = `
=====================================
TIME: ${timestamp}
ERROR: ${JSON.stringify(error, null, 2)}
=====================================\n
`;

  try {
    // Ensure the file exists; if not, create it
    if (!fs.existsSync(logPath)) {
      fs.writeFileSync(logPath, msg, "utf8");
      return;
    }

    // If file exists, append
    fs.appendFileSync(logPath, msg, "utf8");
  } catch (err) {
    console.error("Failed to write to log file:", err);
  }
}

export async function logErrorAction(error: any) {
  logErrorToFile(error);
}
