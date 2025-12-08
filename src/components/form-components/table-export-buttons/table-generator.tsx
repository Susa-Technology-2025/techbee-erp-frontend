"use client";

import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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
  content: string;
}

export const generatePdfReport = async (
  params: ReportParams
): Promise<Blob> => {
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
    keywords,
    disclaimer,
    dataSource,
    customNote,

    pageOrientation,
    content,
  } = params;

  const firstPageContainer = document.createElement("div");
  firstPageContainer.style.position = "absolute";
  firstPageContainer.style.left = "-9999px";
  firstPageContainer.style.width = "210mm";
  firstPageContainer.style.padding = "20mm";
  firstPageContainer.style.boxSizing = "border-box";
  document.body.appendChild(firstPageContainer);

  firstPageContainer.innerHTML = `
    <div style="font-family: 'Inter', sans-serif; padding: 20mm; box-sizing: border-box; background-color: #f0f2f5; min-height: 297mm; display: flex; flex-direction: column; justify-content: space-between;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #1a237e; font-size: 36px; margin-bottom: 10px; font-weight: bold;">${reportTitle}</h1>
        <h2 style="color: #3f51b5; font-size: 24px; margin-bottom: 20px;">${companyName}</h2>
      </div>

      <div style="background-color: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 8px 16px rgba(0,0,0,0.1);">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div style="display: flex; flex-direction: column;">
            <p style="color: #616161; font-size: 14px; margin: 0;"><strong>Prepared By:</strong></p>
            <p style="color: #424242; font-size: 16px; font-weight: 500; margin: 0;">${preparedBy}</p>
          </div>
          <div style="display: flex; flex-direction: column;">
            <p style="color: #616161; font-size: 14px; margin: 0;"><strong>Report Date:</strong></p>
            <p style="color: #424242; font-size: 16px; font-weight: 500; margin: 0;">${reportDate}</p>
          </div>
          <div style="display: flex; flex-direction: column;">
            <p style="color: #616161; font-size: 14px; margin: 0;"><strong>Report Version:</strong></p>
            <p style="color: #424242; font-size: 16px; font-weight: 500; margin: 0;">${reportVersion}</p>
          </div>
          <div style="display: flex; flex-direction: column;">
            <p style="color: #616161; font-size: 14px; margin: 0;"><strong>Confidentiality:</strong></p>
            <p style="color: #424242; font-size: 16px; font-weight: 500; margin: 0;">${confidentiality}</p>
          </div>
          <div style="display: flex; flex-direction: column;">
            <p style="color: #616161; font-size: 14px; margin: 0;"><strong>Report Period:</strong></p>
            <p style="color: #424242; font-size: 16px; font-weight: 500; margin: 0;">${reportPeriod}</p>
          </div>
          <div style="display: flex; flex-direction: column;">
            <p style="color: #616161; font-size: 14px; margin: 0;"><strong>Approval Status:</strong></p>
            <p style="color: #424242; font-size: 16px; font-weight: 500; margin: 0;">${approvalStatus}</p>
          </div>
          <div style="display: flex; flex-direction: column;">
            <p style="color: #616161; font-size: 14px; margin: 0;"><strong>Recipient:</strong></p>
            <p style="color: #424242; font-size: 16px; font-weight: 500; margin: 0;">${recipient}</p>
          </div>
          <div style="display: flex; flex-direction: column;">
            <p style="color: #616161; font-size: 14px; margin: 0;"><strong>Project Code:</strong></p>
            <p style="color: #424242; font-size: 16px; font-weight: 500; margin: 0;">${projectCode}</p>
          </div>
          <div style="display: flex; flex-direction: column;">
            <p style="color: #616161; font-size: 14px; margin: 0;"><strong>Department:</strong></p>
            <p style="color: #424242; font-size: 16px; font-weight: 500; margin: 0;">${department}</p>
          </div>
          <div style="display: flex; flex-direction: column;">
            <p style="color: #616161; font-size: 14px; margin: 0;"><strong>Reference Number:</strong></p>
            <p style="color: #424242; font-size: 16px; font-weight: 500; margin: 0;">${referenceNumber}</p>
          </div>
          <div style="display: flex; flex-direction: column;">
            <p style="color: #616161; font-size: 14px; margin: 0;"><strong>Keywords:</strong></p>
            <p style="color: #424242; font-size: 16px; font-weight: 500; margin: 0;">${keywords}</p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <p style="color: #616161; font-size: 14px; margin: 0;"><strong>Data Source:</strong></p>
          <p style="color: #424242; font-size: 16px; font-weight: 500; margin: 0;">${dataSource}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <p style="color: #616161; font-size: 14px; margin: 0;"><strong>Custom Note:</strong></p>
          <p style="color: #424242; font-size: 16px; font-weight: 500; margin: 0;">${customNote}</p>
        </div>

        <div style="border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 20px;">
          <p style="color: #616161; font-size: 12px; text-align: center; margin: 0;">${disclaimer}</p>
        </div>
      </div>

      <div style="text-align: center; color: #757575; font-size: 12px; margin-top: 40px;">
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  `;

  const firstPageCanvas = await html2canvas(firstPageContainer, {
    scale: 2,
    useCORS: true,
  });

  document.body.removeChild(firstPageContainer);

  const pdf = new jsPDF({
    orientation: pageOrientation,
    unit: "mm",
    format: "a4",
  });

  const imgDataFirstPage = firstPageCanvas.toDataURL("image/png");
  const imgWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgHeightFirstPage =
    (firstPageCanvas.height * imgWidth) / firstPageCanvas.width;

  pdf.addImage(imgDataFirstPage, "PNG", 0, 0, imgWidth, imgHeightFirstPage);

  if (content) {
    const contentContainer = document.createElement("div");
    contentContainer.style.position = "absolute";
    contentContainer.style.left = "-9999px";
    contentContainer.style.width = "210mm";
    contentContainer.style.padding = "20mm";
    contentContainer.style.boxSizing = "border-box";
    contentContainer.innerHTML = content;
    document.body.appendChild(contentContainer);

    const contentCanvas = await html2canvas(contentContainer, {
      scale: 2,
      useCORS: true,
    });

    document.body.removeChild(contentContainer);

    const imgDataContent = contentCanvas.toDataURL("image/png");
    const imgHeightContent =
      (contentCanvas.height * imgWidth) / contentCanvas.width;

    let heightLeft = imgHeightContent;
    let position = 0;

    pdf.addPage();

    while (heightLeft >= 0) {
      position = heightLeft - imgHeightContent;
      pdf.addImage(
        imgDataContent,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeightContent
      );
      heightLeft -= pageHeight;
      if (heightLeft > -1) {
        pdf.addPage();
      }
    }
  }

  return pdf.output("blob");
};
