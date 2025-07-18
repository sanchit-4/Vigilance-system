import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ReportFilters } from './ReportingEngine';

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
  filters: ReportFilters
) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add title
    doc.setFontSize(18);
    doc.text(title, pageWidth / 2, 15, { align: 'center' });
    
    // Add report metadata
    doc.setFontSize(10);
    doc.text(`Report Period: ${filters.startDate} to ${filters.endDate}`, pageWidth / 2, 22, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 27, { align: 'center' });
    
    // Format data for autoTable
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      const rows = data.map(item => headers.map(header => item[header]));
      
      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 35,
        styles: {
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [66, 133, 244],
          textColor: 255,
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
      });
    } else {
      doc.text('No data available for this report', pageWidth / 2, 40, { align: 'center' });
    }
    
    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Page ${i} of ${pageCount} - Vigilance System Report`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }
    
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    alert('Failed to export to PDF. Please try again later.');
  }
};

export const exportToExcel = (
  data: Record<string, any>[],
  filename: string,
  sheetName: string
) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Set column widths
    const columnWidths = Object.keys(data[0] || {}).map(() => ({ wch: 20 }));
    worksheet['!cols'] = columnWidths;
    
    // Export the file
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Failed to export to Excel. Please try again later.');
  }
};
