@@ .. @@
 import { jsPDF } from 'jspdf';
 import 'jspdf-autotable';
 import * as XLSX from 'xlsx';
-import { ReportFilters } from './ReportingEngine';
 
 // Add the missing types to make TypeScript happy with jspdf-autotable
 declare module 'jspdf' {
@@ .. @@
 }
 
 export const exportToPdf = (
   data: Record<string, any>[],
   filename: string,
   title: string,
-  filters: ReportFilters
+  filters: { startDate: string; endDate: string }
 ) => {
   try {
     const doc = new jsPDF();