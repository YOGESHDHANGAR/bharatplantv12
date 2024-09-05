import React, { useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  MRT_GlobalFilterTextField,
  MRT_ToggleFullScreenButton,
} from "material-react-table";

// Generate PDF
const generatePDF = (data) => {
  if (!data || data.length === 0) {
    return;
  }

  const doc = new jsPDF();
  const tableData = data.map((row) => Object.values(row));
  const tableHeaders = ["ID", "Date", "Amount"]; // Adjust headers to your table

  autoTable(doc, {
    head: [tableHeaders],
    body: tableData,
  });

  doc.save("sales-report.pdf");
};

// Generate Excel
const generateExcel = (data) => {
  if (!data || data.length === 0) {
    return;
  }

  const ws = XLSX.utils.json_to_sheet(data); // Convert JSON data to sheet
  const wb = XLSX.utils.book_new(); // Create a new workbook
  XLSX.utils.book_append_sheet(wb, ws, "Sales Report"); // Append the sheet
  XLSX.writeFile(wb, "sales-report.xlsx"); // Write to file
};

const RenderToolbarInternalActions = ({ table }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading spinner
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDownload = async (format) => {
    setLoading(true); // Start loading
    const data = table.getRowModel().rows.map((row) => row.original); // Extract data

    switch (format) {
      case "PDF":
        generatePDF(data);
        break;
      case "Excel":
        generateExcel(data);
        break;
      case "CSV":
        // Handle CSV download
        const headers = [
          { label: "ID", key: "id" },
          { label: "Date", key: "date" },
          { label: "Amount", key: "amount" },
        ];

        // Manually trigger the CSV download
        const csvData = [
          headers.map((header) => header.label),
          ...data.map((item) => headers.map((header) => item[header.key])),
        ];

        const csvContent = `data:text/csv;charset=utf-8,${csvData
          .map((e) => e.join(","))
          .join("\n")}`;
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", "sales-report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      default:
        break;
    }

    setLoading(false); // Stop loading after download is complete
    handleMenuClose();
  };

  return (
    <Box display="flex">
      <MRT_GlobalFilterTextField table={table} />
      <Box display="flex" sx={{ ml: 2 }}>
        <Box>
          <IconButton onClick={handleMenuOpen} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : <DownloadIcon />}
          </IconButton>
          <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleDownload("PDF")}>As PDF</MenuItem>
            <MenuItem onClick={() => handleDownload("Excel")}>
              As Excel
            </MenuItem>
            <MenuItem onClick={() => handleDownload("CSV")}>As CSV</MenuItem>
          </Menu>
        </Box>
        <MRT_ToggleFullScreenButton table={table} />
      </Box>
    </Box>
  );
};

export default RenderToolbarInternalActions;
