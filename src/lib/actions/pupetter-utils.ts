export interface ExportData {
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
  pdfPassword?: string;
  tableHeaders: { text: string; style?: string }[];

  tableData: (string | number | boolean)[][];
  pageOrientation: "portrait" | "landscape";
  content?: string;
}

export const PDF_COLORS = {
  PRIMARY: "#2c3e50",
  SECONDARY: "#3498db",
  ACCENT: "#e74c3c",
  LIGHT_BG: "#f8f9fa",
  WHITE: "#ffffff",
  TEXT: "#333333",
  TEXT_LIGHT: "#7f8c8d",
  BORDER: "#dddddd",
};

export function generateHtmlContent(
  data: ExportData,
  qrCodeSvg: string
): string {
  const {
    companyName,
    reportTitle,
    preparedBy,
    reportDate,
    reportVersion,
    confidentiality,
    reportPeriod,
    approvalStatus,
    recipient,
    projectCode,
    department,
    referenceNumber,
    disclaimer,
    dataSource,
    customNote,
    tableHeaders,
    tableData,
  } = data;

  const tableRowsHtml = tableData
    .map((row, rowIndex) => {
      const rowBgColor =
        rowIndex % 2 === 0 ? PDF_COLORS.WHITE : PDF_COLORS.LIGHT_BG;
      return `
        <tr style="background-color: ${rowBgColor};">
          ${row
            .map(
              (cell) =>
                `<td style="padding: 10px 12px; border-bottom: 1px solid ${PDF_COLORS.BORDER}; color: ${PDF_COLORS.TEXT}; font-size: 13px;">${cell}</td>`
            )
            .join("")}
        </tr>
      `;
    })
    .join("");

  const tableHeadersHtml = tableHeaders
    .map(
      (header) =>
        `<th style="padding: 12px 12px; background-color: ${PDF_COLORS.PRIMARY}; color: ${PDF_COLORS.WHITE}; text-align: left; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;">${header.text}</th>`
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${reportTitle}</title>
        
        <style>
            :root {
                --color-primary: ${PDF_COLORS.PRIMARY};
                --color-secondary: ${PDF_COLORS.SECONDARY};
                --color-accent: ${PDF_COLORS.ACCENT};
                --color-light-bg: ${PDF_COLORS.LIGHT_BG};
                --color-white: ${PDF_COLORS.WHITE};
                --color-text: ${PDF_COLORS.TEXT};
                --color-text-light: ${PDF_COLORS.TEXT_LIGHT};
                --color-border: ${PDF_COLORS.BORDER};
            }

            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                color: var(--color-text);
                -webkit-print-color-adjust: exact;
                background-color: var(--color-light-bg);
            }

            .page {
                width: 100vw;
                height: 297mm;
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                page-break-after: always;
                background-color: var(--color-white);
            }
            
            .cover-page {
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding-top: 40px; 
            }

            .cover-content {
                padding: 40px;
                flex: 1;
                display: flex;
                flex-direction: column;
            }

            .report-title {
                font-size: 48px;
                font-weight: 800;
                color: var(--color-primary);
                margin-bottom: 24px;
                line-height: 1.2;
                padding-bottom: 16px;
                border-bottom: 4px solid var(--color-secondary);
                text-transform: uppercase;
            }

            .company-name {
                font-size: 30px;
                font-weight: 600;
                color: var(--color-primary);
                margin-bottom: 32px;
            }

            .metadata-container {
                display: flex;
                flex-wrap: wrap;
                gap: 32px;
                margin-bottom: 32px;
            }

            .metadata-column {
                flex: 1;
                min-width: 280px;
            }

            .metadata-item {
                margin-bottom: 16px;
            }

            .metadata-label {
                font-size: 12px;
                font-weight: 600;
                color: var(--color-text-light);
                text-transform: uppercase;
                letter-spacing: 0.8px;
                margin-bottom: 4px;
            }

            .metadata-value {
                font-size: 16px;
                font-weight: 400;
                color: var(--color-text);
                padding-left: 16px;
                border-left: 4px solid var(--color-secondary);
            }

            .footer-section {
                margin-top: auto;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                padding: 40px;
                padding-top: 32px;
                border-top: 1px dashed var(--color-border);
                background-color: var(--color-white);
            }

            .qr-container {
                text-align: center;
                background-color: var(--color-white);
                padding: 0;
                border: none;
                box-shadow: none;
                outline: none;
                filter: none;
                border-radius: 0;
                overflow: hidden;
                line-height: 0;
            }

            .qr-container svg {
                display: block;
                margin: 0 auto;
                width: 240px;
                height: 240px;
                background-color: var(--color-white);
                padding: 0;
                border: none;
                box-shadow: none;
                outline: none;
                filter: none;
            }

            .disclaimer {
                font-size: 12px;
                color: var(--color-text-light);
                line-height: 1.6;
                max-width: 60%;
            }

           
            .content-page {
                padding: 40px;
            }

            .page-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 1px solid var(--color-border);
            }

            .page-title {
                font-size: 16px;
                font-weight: 700;
                color: var(--color-primary);
            }

            .page-info {
                font-size: 11px;
                color: var(--color-text-light);
            }

            .table-container {
                margin-top: 32px;
                width: 100%;
                border: 1px solid var(--color-border); 
            }

            table {
                width: 100%;
                border-collapse: collapse;
                font-family: Arial, sans-serif;
            }

            th, td {
                text-align: left;
                border: none;
            }

            th {
                background-color: var(--color-primary);
                color: var(--color-white);
                font-weight: 600;
                padding: 12px 12px;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.8px;
            }

            td {
                padding: 10px 12px;
                border-bottom: 1px solid var(--color-border);
                color: var(--color-text);
                font-size: 13px;
            }

            tr:nth-child(even) {
                background-color: var(--color-light-bg);
            }

            tr:last-child td {
                border-bottom: none;
            }

            .custom-note {
                margin-top: 32px;
                padding: 16px;
                background-color: var(--color-light-bg);
                border-left: 4px solid var(--color-secondary);
                font-size: 14px;
                color: var(--color-text);
                border-radius: 4px;
                line-height: 1.5;
            }

            .page-footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 1px solid var(--color-border);
                font-size: 12px;
                color: var(--color-text-light);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        </style>
    </head>
    <body>
        <div class="page cover-page">
            <div class="cover-content">
                <h1 class="report-title">${reportTitle}</h1>
                
                <div class="metadata-container">
                    <div class="metadata-column">
                        <div class="metadata-item">
                            <div class="metadata-label">Prepared By</div>
                            <div class="metadata-value">${preparedBy}</div>
                        </div>
                        <div class="metadata-item">
                            <div class="metadata-label">Report Date</div>
                            <div class="metadata-value">${reportDate}</div>
                        </div>
                        <div class="metadata-item">
                            <div class="metadata-label">Report Period</div>
                            <div class="metadata-value">${reportPeriod}</div>
                        </div>
                        <div class="metadata-item">
                            <div class="metadata-label">Version</div>
                            <div class="metadata-value">${reportVersion}</div>
                        </div>
                    </div>
                    
                    <div class="metadata-column">
                        <div class="metadata-item">
                            <div class="metadata-label">Confidentiality</div>
                            <div class="metadata-value">${confidentiality}</div>
                        </div>
                        <div class="metadata-item">
                            <div class="metadata-label">Approval Status</div>
                            <div class="metadata-value">${approvalStatus}</div>
                        </div>
                        <div class="metadata-item">
                            <div class="metadata-label">Recipient</div>
                            <div class="metadata-value">${recipient}</div>
                        </div>
                        <div class="metadata-item">
                            <div class="metadata-label">Reference Number</div>
                            <div class="metadata-value">${referenceNumber}</div>
                        </div>
                    </div>
                </div>
                
            </div>
            
            <div class="footer-section">
                <div>
                    <div class="company-name" style="margin-bottom: 8px;">${companyName}</div>
                    <div class="disclaimer">${disclaimer}</div>
                </div>
                
                <div class="qr-container">
                    ${qrCodeSvg}
                </div>
            </div>
        </div>

        <div class="page content-page">
            <div class="page-header">
                <h2 class="page-title">${reportTitle}</h2>
                <div class="page-info">
                    ${companyName} | ${reportDate} | Page <span class="page-number">1</span> of <span class="total-pages">1</span>
                </div>
            </div>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            ${tableHeadersHtml}
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsHtml}
                    </tbody>
                </table>
            </div>
            ${
              customNote
                ? `<div class="custom-note"><strong>Note:</strong> ${customNote}</div>`
                : ""
            }
            <div class="page-footer">
                <div>${department} | Project: ${projectCode}</div>
                <div>Data Source: ${dataSource}</div>
            </div>
        </div>
    </body>
    </html>
  `;
}
