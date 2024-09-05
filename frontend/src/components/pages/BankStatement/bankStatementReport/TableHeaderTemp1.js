import React, { useState } from "react";
import {
  Button,
  Typography,
  Input,
  Box,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import StopIcon from "@mui/icons-material/Stop";
import * as XLSX from "xlsx";
import { useCreateBankStatement } from "../../../../api/mutations/bankStatementMutations";

const TableHeader = ({ setExtractedData }) => {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(""); // To store error messages
  const [loading, setLoading] = useState(false); // To handle loading state
  const [successCount, setSuccessCount] = useState(0); // To count successful inserts
  const [failedCount, setFailedCount] = useState(0); // To count failed inserts
  const [duplicateCount, setDuplicateCount] = useState(0); // To count duplicate records
  const [failedRecords, setFailedRecords] = useState([]); // To store failed records
  const [isStopped, setIsStopped] = useState(false); // To handle stopping
  const [abortController, setAbortController] = useState(null); // To handle aborting fetch requests

  const { mutateAsync: createBankStatementAsync } = useCreateBankStatement();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      if (
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        parseExcel(file);
      } else {
        setError("Please upload a valid Excel file.");
      }
    }
  };

  const handleStop = () => {
    setIsStopped(true);
    if (abortController) {
      abortController.abort(); // Abort ongoing requests
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Bank Statement Processing Report", 14, 16);

    // Add summary
    doc.setFontSize(14);
    doc.text(`Successfully inserted ${successCount} records.`, 14, 30);
    doc.text(`Failed records: ${failedCount}`, 14, 40);
    doc.text(`Duplicate records: ${duplicateCount}`, 14, 50);

    // Add failed records
    if (failedRecords.length > 0) {
      doc.setFontSize(14);
      doc.text("Failed records:", 14, 60);

      failedRecords.forEach((item, index) => {
        doc.setFontSize(12);
        doc.text(
          `Record ${index + 1}: ${JSON.stringify(item.record)}`,
          14,
          70 + index * 20
        );
        doc.text(`Error: ${item.error}`, 14, 75 + index * 20);
      });
    } else {
      doc.text("No records failed.", 14, 60);
    }

    // Save the PDF
    doc.save("bank_statement_processing_report.pdf");
  };

  return (
    <Box
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Input
        type="file"
        accept=".xls,.xlsx" // Restrict file types to Excel
        onChange={handleFileChange}
        sx={{ display: "none" }}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={loading} // Disable button while loading
        >
          {loading ? "Uploading..." : "Upload File"}
        </Button>
      </label>
      <Button
        variant="contained"
        color="error"
        startIcon={<StopIcon />}
        onClick={handleStop}
        disabled={!loading || isStopped} // Disable button if not loading or already stopped
      >
        Stop
      </Button>
      {loading && (
        <CircularProgress sx={{ marginLeft: 2 }} /> // Spinner while loading
      )}
      {fileName && (
        <Typography variant="body1">Selected file: {fileName}</Typography>
      )}
      <Typography variant="body1" color="success" sx={{ marginTop: 2 }}>
        Successfully inserted: {successCount}
      </Typography>
      <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>
        Failed records: {failedCount}
      </Typography>
      <Typography variant="body1" color="warning" sx={{ marginTop: 2 }}>
        Duplicate records: {duplicateCount}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={generatePDF}
        disabled={failedRecords.length === 0} // Enable button only if there are failed records
        sx={{ marginTop: 2 }}
      >
        Download Report
      </Button>
      {error && (
        <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default TableHeader;
