import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePayslipPdf = async (
  elementId: string,
  fileName: string
) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}.pdf`);

    return pdf;
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

export const sharePayslip = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], "payslip.png", { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title: "My Payslip",
            files: [file],
          });
        } catch (err) {
          console.error("Error sharing:", err);
        }
      } else {
        // Fallback for browsers that don't support sharing files
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
      }
    }, "image/png");
  } catch (error) {
    console.error("Error sharing payslip:", error);
  }
};
