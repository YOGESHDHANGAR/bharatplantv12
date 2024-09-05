import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const ExportPDF = ({ table, columns }) => {
  const handleExportRows = (rows) => {
    const doc = new jsPDF();
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columns.map((c) => c.header);

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
    });

    doc.save("mrt-pdf-example.pdf");
  };
  return (
    <Box
      sx={{
        display: "flex",
        gap: "16px",
        padding: "8px",
        flexWrap: "wrap",
      }}
    >
      <Button
        disabled={table.getRowModel().rows.length === 0}
        onClick={() => handleExportRows(table.getRowModel().rows)}
        startIcon={<FileDownloadIcon />}
      >
        Export as PDF
      </Button>
    </Box>
  );
};

export default ExportPDF;
