import html2pdf from 'html2pdf.js';

export const exportToPdf = (elementId, filename = 'report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const opt = {
    margin: [10, 10],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0f172a' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(element).set(opt).save();
};
