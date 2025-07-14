import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { FileText, Printer, Download } from 'lucide-react'; // Import new icons
import './ReportGenerator.css';

const ReportGenerator = () => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection'
    }
  ]);

  // TODO: Data for reports will come from backend API based on date range
  const reportData = []; // Initialize with empty array

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Report");
    XLSX.writeFile(wb, "stock_report.xlsx");
    // toast.success('Report exported to Excel!'); // Add toast notification
  };

  const handleExportCsv = () => {
    const ws = XLSX.utils.json_to_sheet(reportData);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'stock_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // toast.success('Report exported to CSV!'); // Add toast notification
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    let y = 10;
    doc.text("Stock Report", 10, y);
    y += 10;
    if (reportData.length > 0) {
      reportData.forEach(row => {
        doc.text(`${row.date} - ${row.product} (${row.type}): ${row.quantity} @ ${row.price}`, 10, y);
        y += 7;
      });
    } else {
      doc.text("No data available for the selected date range.", 10, y);
    }
    doc.save("stock_report.pdf");
    // toast.success('Report exported to PDF!'); // Add toast notification
  };

  const handlePrintReport = () => {
    window.print();
    // toast.success('Printing report...'); // Add toast notification
  };

  return (
    <div className="report-generator-container">
      <div className="date-range-picker-wrapper">
        <DateRangePicker
          onChange={item => setState([item.selection])}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          ranges={state}
          direction="horizontal"
        />
      </div>
      <div className="report-buttons">
        <button onClick={handleExportExcel} className="report-button excel-button">
          <Download size={20} /> Export Excel
        </button>
        <button onClick={handleExportCsv} className="report-button csv-button">
          <Download size={20} /> Export CSV
        </button>
        <button onClick={handlePrintReport} className="report-button print-button">
          <Printer size={20} /> Print Report
        </button>
        <button onClick={handleExportPdf} className="report-button pdf-button">
          <Download size={20} /> Export PDF
        </button>
      </div>
    </div>
  );
};

export default ReportGenerator;