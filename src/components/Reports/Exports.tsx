import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Add the missing types to make TypeScript happy with jspdf-autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToPdf = (
  data: Record<string, any>[],
  filename: string,
  title: string,
  filters: { startDate: string; endDate: string }
) => {
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 22);
    
    // Add filters info
    doc.setFontSize(10);
    doc.text(`Date Range: ${filters.startDate} to ${filters.endDate}`, 14, 32);
    
    // Prepare table data
    if (data.length > 0) {
      const columns = Object.keys(data[0]);
      const rows = data.map(item => columns.map(col => item[col] || ''));
      
      doc.autoTable({
        head: [columns],
        body: rows,
        startY: 40,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] }
      });
    }
    
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};

export const exportToExcel = (
  data: Record<string, any>[],
  filename: string,
  sheetName: string = 'Report'
) => {
  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${filename}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
};