"use server";
import puppeteer, { PDFOptions } from "puppeteer-core";
import QRCode from "qrcode";
import chromium from "@sparticuz/chromium";
import crypto from "crypto";
import { ExportData, generateHtmlContent } from "./pupetter-utils";

function generateContentHash(content: string): string | null {
  if (!content) return null;
  return crypto.createHash("sha256").update(content).digest("hex");
}

async function signData(data: string): Promise<string> {
  console.log("[signData] Starting data signing process");
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("[signData] PRIVATE_KEY not found in environment variables");
    throw new Error("PRIVATE_KEY not found in environment variables");
  }
  const signer = crypto.createSign("SHA256");
  signer.update(data);
  const signature = signer.sign(privateKey, "base64");
  console.log("[signData] Data signed successfully");
  return signature;
}

async function generateQrCodeSvg(data: string): Promise<string> {
  console.log(
    "[generateQrCodeSvg] Generating QR code for:",
    data.substring(0, 20) + "..."
  );
  try {
    const svg = await QRCode.toString(data, {
      type: "svg",
      color: { dark: "#000000", light: "#FFFFFF" },
      margin: 1,
      width: 120,
    });
    console.log("[generateQrCodeSvg] QR code generated successfully");
    return svg;
  } catch (err) {
    console.error("[generateQrCodeSvg] Error generating QR code:", err);
    return "";
  }
}

export async function generatePdf(data: ExportData): Promise<Buffer | null> {
  console.log("[generatePdf] Starting PDF generation with data:", {
    reportTitle: data.reportTitle,
    companyName: data.companyName,
    pageOrientation: data.pageOrientation,
    tableHeaders: data.tableHeaders?.length,
    tableData: data.tableData?.length,
  });

  let browser = null;
  try {
    console.log("[generatePdf] Preparing Chromium launch arguments");
    const launchArgs = chromium.args.concat(
      "--hide-scrollbars",
      "--disable-web-security",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-zygote",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process"
    );

    console.log("[generatePdf] Launch arguments:", launchArgs);
    console.log("[generatePdf] Getting Chromium executable path");
    const execPath = await chromium.executablePath();
    console.log("[generatePdf] Chromium executable path:", execPath);

    console.log("[generatePdf] Launching browser...");
    browser = await puppeteer.launch({
      args: launchArgs,
      executablePath: execPath,
      headless: true,
    });
    console.log("[generatePdf] Browser launched successfully");

    const page = await browser.newPage();
    console.log("[generatePdf] New page created");

    const documentPayload = {
      reportTitle: data.reportTitle || "Untitled Document",
      companyName: data.companyName || "Unknown Company",
      reportDate: data.reportDate || new Date().toISOString(),
      referenceNumber: data.referenceNumber || "N/A",
      contentHash: data.content ? generateContentHash(data.content) : null,
      timestamp: Date.now(),
    };
    console.log("[generatePdf] Document payload prepared:", documentPayload);

    console.log("[generatePdf] Signing document payload...");
    const signature = await signData(JSON.stringify(documentPayload));
    console.log("[generatePdf] Payload signed successfully");

    const baseUrl = process.env.BASE_URL || "https://erp.susa.et";
    const verificationUrl = `${baseUrl}/verify-document?payload=${encodeURIComponent(
      JSON.stringify(documentPayload)
    )}&signature=${encodeURIComponent(signature)}`;
    console.log(
      "[generatePdf] Verification URL:",
      verificationUrl.substring(0, 50) + "..."
    );

    console.log("[generatePdf] Generating QR code...");
    const qrCodeSvg = await generateQrCodeSvg(verificationUrl);
    console.log("[generatePdf] QR code generated, length:", qrCodeSvg.length);

    console.log("[generatePdf] Generating HTML content...");
    const htmlContent = generateHtmlContent(data, qrCodeSvg);
    console.log(
      "[generatePdf] HTML content generated, length:",
      htmlContent.length
    );

    console.log("[generatePdf] Setting page content...");
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
    console.log("[generatePdf] Page content set successfully");

    console.log("[generatePdf] Updating page numbers...");
    await page.evaluate(() => {
      const pages = Array.from(document.querySelectorAll(".page"));
      const totalContentPages = pages.length > 1 ? pages.length - 1 : 1;

      for (let i = 1; i < pages.length; i++) {
        const pageElement = pages[i];
        const pageInfoSpan = pageElement.querySelector(".page-info");
        if (pageInfoSpan) {
          pageInfoSpan.innerHTML = pageInfoSpan.innerHTML.replace(
            /Page <span class="page-number">\d+<\/span> of <span class="total-pages">\d+<\/span>/,
            `Page <span class="page-number">${i}</span> of <span class="total-pages">${totalContentPages}`
          );
        }
      }
    });
    console.log("[generatePdf] Page numbers updated");

    const pdfOptions: PDFOptions = {
      format: "A4",
      landscape: data.pageOrientation === "landscape",
      printBackground: true,
      margin: {
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    };
    console.log("[generatePdf] PDF options:", pdfOptions);

    console.log("[generatePdf] Generating PDF...");
    const pdfBufferUint8Array = await page.pdf(pdfOptions);
    const pdfBuffer = Buffer.from(pdfBufferUint8Array);
    console.log(
      "[generatePdf] PDF generated, buffer length:",
      pdfBuffer.length
    );

    if (pdfBuffer.length === 0) {
      console.error("[generatePdf] Generated PDF buffer is empty");
      throw new Error("Generated PDF buffer is empty");
    }

    console.log("[generatePdf] PDF generation completed successfully");
    return pdfBuffer;
  } catch (error: any) {
    console.error("[generatePdf] Error in PDF generation:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    return null;
  } finally {
    if (browser) {
      console.log("[generatePdf] Closing browser...");
      await browser.close();
      console.log("[generatePdf] Browser closed");
    }
  }
}

export async function verifyDocument(signature: string, payload: string) {
  "use server";
  console.log("[verifyDocument] Starting verification with:", {
    signature: signature.substring(0, 10) + "...",
    payload: payload.substring(0, 50) + "...",
  });

  try {
    if (!signature || !payload) {
      console.error("[verifyDocument] Missing verification parameters");
      return { valid: false, error: "Missing verification parameters" };
    }

    const publicKey = process.env.PUBLIC_KEY;
    if (!publicKey) {
      console.error(
        "[verifyDocument] PUBLIC_KEY not found in environment variables"
      );
      return { valid: false, error: "Server configuration error" };
    }

    const verifier = crypto.createVerify("SHA256");
    verifier.update(payload);
    const isValid = verifier.verify(publicKey, signature, "base64");

    if (!isValid) {
      console.error("[verifyDocument] Invalid digital signature");
      return { valid: false, error: "Invalid digital signature" };
    }

    const documentData = JSON.parse(payload);
    const expiryTime = 30 * 24 * 60 * 60 * 1000;
    const isExpired = Date.now() - documentData.timestamp > expiryTime;

    console.log("[verifyDocument] Verification result:", {
      valid: !isExpired,
      isExpired,
      documentData: {
        reportTitle: documentData.reportTitle,
        timestamp: documentData.timestamp,
      },
    });

    return {
      valid: !isExpired,
      data: documentData,
      verifiedAt: new Date().toISOString(),
      ...(isExpired && { warning: "This document has expired" }),
    };
  } catch (error: any) {
    console.error("[verifyDocument] Verification error:", {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Verification failed",
    };
  }
}
