"use server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { format, formatDistanceToNow, isValid } from "date-fns";

interface TableData {
  [key: string]: any;
}

interface ReportParams {
  reportTitle: string;
  companyName: string;
  preparedBy: string;
  reportDate: string;
  reportPeriod: string;
  exportFormat: string;
  confidentiality: string;
  reportVersion: string;
  companyLogo: string;
}

function formatCellValue(value: any, key: string): string {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "string") {
    const dateValue = new Date(value);
    if (isValid(dateValue)) {
      return format(dateValue, "MMM dd, yyyy");
    }
  }

  return String(value || "");
}

export async function generatePdf(
  data: TableData[],
  params: ReportParams
): Promise<Buffer> {
  const executablePath = await chromium.executablePath();
  const browser = await puppeteer.launch({
    args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
    executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  const headers = Object.keys(data[0] || {});

  const calculateColumnWidths = () => {
    const avgCharWidth = 7;
    const minWidth = 60;
    const padding = 16;

    return headers.map((header) => {
      let headerWidth = header.length * avgCharWidth + padding;

      let contentWidth = 0;
      data.forEach((row) => {
        const cellContent = formatCellValue(row[header], header);
        const cellWidth = cellContent.length * avgCharWidth + padding;
        if (cellWidth > contentWidth) contentWidth = cellWidth;
      });

      return Math.max(headerWidth, contentWidth, minWidth);
    });
  };

  const columnWidths = calculateColumnWidths();
  const totalWidth = columnWidths.reduce((sum, width) => sum + width, 0);

  const tableRows = data
    .map((row) => {
      return `<tr>${headers
        .map(
          (header, index) =>
            `<td class="table-cell" style="width: ${
              columnWidths[index]
            }px;">${formatCellValue(row[header], header)}</td>`
        )
        .join("")}</tr>`;
    })
    .join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${params.reportTitle} Report</title>
       <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    body {
        font-family: 'Inter', sans-serif;
        color: #2D3748;
        line-height: 1.6;
        background-color: #FFFFFF;
    }
    
    .page {
        padding: 60px 50px;
        position: relative;
    }
    
    .watermark {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 80px;
        font-weight: 700;
        color: rgba(237, 242, 247, 0.5);
        z-index: -1;
        text-transform: uppercase;
    }
    
    .header-container {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 40px;
    }
    
    .brand-section {
        flex: 1;
    }
    
    .company-name {
        font-size: 28px;
        font-weight: 700;
        color: #2D3748;
        margin-bottom: 5px;
    }
    
    .report-title {
        font-size: 32px;
        font-weight: 800;
        color: #3182CE;
        margin: 20px 0;
        padding-bottom: 15px;
        border-bottom: 2px solid #E2E8F0;
    }
    
    .metadata-section {
        background: #F7FAFC;
        border-radius: 12px;
        padding: 25px;
        margin: 30px 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    
    .metadata-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }
    
    .metadata-item {
        margin-bottom: 12px;
    }
    
    .metadata-label {
        font-weight: 600;
        color: #4A5568;
        font-size: 14px;
        margin-bottom: 4px;
    }
    
    .metadata-value {
        font-weight: 500;
        color: #2D3748;
        font-size: 16px;
    }
    
    .confidentiality-badge {
        display: inline-block;
        background: #E53E3E;
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        margin-top: 10px;
    }
    
    .version-badge {
        display: inline-block;
        background: #3182CE;
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        margin-left: 10px;
    }
    
    .logo-container {
        width: 120px;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .company-logo {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
    }
    
    .table-container {
        page-break-before: always;
        padding: 50px;
    }
    
    .table-title {
        font-size: 24px;
        font-weight: 700;
        color: #2D3748;
        margin-bottom: 25px;
        padding-bottom: 15px;
        border-bottom: 2px solid #E2E8F0;
    }
    
    .table-wrapper {
        overflow-x: auto;
        border-radius: 12px;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
        max-width: 100%;
        border: 1px solid #E2E8F0;
    }
    
    table {
        width: ${totalWidth}px;
        max-width: 100%;
        border-collapse: separate;
        border-spacing: 0;
    }
    
    th {
        background: linear-gradient(to bottom, #F7FAFC, #EDF2F7);
        color: #2D3748;
        font-weight: 600;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.7px;
        padding: 12px 16px;
        text-align: left;
        border-bottom: 2px solid #CBD5E0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    th:first-child {
        border-top-left-radius: 12px;
    }

    th:last-child {
        border-top-right-radius: 12px;
    }

    .table-cell {
        padding: 10px 16px;
        font-size: 13px;
        border-bottom: 1px solid #EDF2F7;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    tr:last-child td {
        border-bottom: none;
    }
    
    tr:nth-child(even) {
        background-color: #FDFDFD;
    }
    
    tr:hover {
        background-color: #EBF8FF;
        cursor: pointer;
    }
    
    .footer {
        margin-top: 40px;
        text-align: center;
        font-size: 12px;
        color: #A0AEC0;
    }
    
    .page-number:after {
        content: "Page " counter(page);
    }

    @media print {
        .table-wrapper {
            overflow-x: visible;
        }
        
        table {
            width: 100% !important;
        }
        
        .table-cell, th {
            white-space: normal !important;
            overflow: visible !important;
            text-overflow: unset !important;
        }
    }
</style>
    </head>
    <body>
        <div class="page">
            <div class="watermark">${params.confidentiality}</div>
            
            <div class="header-container">
                <div class="brand-section">
                    <div class="company-name">${params.companyName}</div>
                    <h1 class="report-title">${params.reportTitle}</h1>
                </div>
                
                <div class="logo-container">
                  <img src="${
                    params.companyLogo
                  }" alt="Company Logo" class="company-logo" />
                </div>
            </div>
            
            <div class="metadata-section">
                <div class="metadata-grid">
                    <div class="metadata-item">
                        <div class="metadata-label">Prepared By</div>
                        <div class="metadata-value">${params.preparedBy}</div>
                    </div>
                    
                    <div class="metadata-item">
                        <div class="metadata-label">Report Date</div>
                        <div class="metadata-value">${params.reportDate}</div>
                    </div>
                    
                    <div class="metadata-item">
                        <div class="metadata-label">Report Period</div>
                        <div class="metadata-value">${params.reportPeriod}</div>
                    </div>
                    
                   
                </div>
                
                <div class="metadata-item">
                    <div class="metadata-label">Confidentiality & Version</div>
                    <div class="metadata-value">
                        <span class="confidentiality-badge">${
                          params.confidentiality
                        }</span>
                        <span class="version-badge">Version: ${
                          params.reportVersion
                        }</span>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <div>Generated on ${format(new Date(), "MMM dd, yyyy")}</div>
            </div>
        </div>

        <div class="table-container">
            
            <div class="table-wrapper">
                <table>
                    <thead>
                        <tr>${headers
                          .map(
                            (header, index) =>
                              `<th style="width: ${columnWidths[index]}px;">${header}</th>`
                          )
                          .join("")}</tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
            
           
        </div>
    </body>
    </html>
  `;

  await page.setContent(htmlContent, {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    landscape: totalWidth > 800,
  });

  await browser.close();
  return pdfBuffer;
}
