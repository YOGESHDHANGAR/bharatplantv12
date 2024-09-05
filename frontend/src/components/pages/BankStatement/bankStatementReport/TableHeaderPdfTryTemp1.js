import React, { useState } from "react";
import { Button, Typography, Input, Box } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

// Configure PDF.js worker
import "pdfjs-dist/build/pdf.worker.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const TableHeader = ({ onDataExtracted }) => {
  const [fileName, setFileName] = useState("");
  const [jsonData, setJsonData] = useState(""); // To store JSON data
  const [error, setError] = useState(""); // To store error messages

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      await handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
        ignoreEncryption: true,
      }).promise;

      const numPages = pdf.numPages;
      let extractedText = "";

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(" ");
        extractedText += pageText + "\n";
      }

      // Parse the extracted text
      const transactions = parseTransactions(extractedText);
      const jsonData = JSON.stringify(transactions, null, 2); // Set JSON data for use
      setJsonData(jsonData);
      onDataExtracted(jsonData);
    } catch (error) {
      console.error("Error loading PDF:", error);
      setError("Failed to process the PDF. Please try again.");
    }
  };

  const parseTransactions = (text) => {
    const transactions = [];
    const pattern =
      /(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+(?:CHQ\. NO\.\s*(\d+)\s+)?(?:([\d,]+\.\d{2})\s+)?(?:([\d,]+\.\d{2})\s+)?([\d,]+(?:\s*(?:DR|CR))?)/g;

    let match;
    while ((match = pattern.exec(text)) !== null) {
      const date = match[1];
      const narration = match[2].trim();
      const chqNo = match[3] || ""; // CHQ. NO. might be missing
      const withdrawal = match[4] ? parseFloat(match[4].replace(/,/g, "")) : 0;
      const deposit = match[5] ? parseFloat(match[5].replace(/,/g, "")) : 0;
      const balanceMatch = match[6];
      const balance = balanceMatch
        ? parseFloat(balanceMatch.replace(/,/g, "").replace(/DR|CR/, ""))
        : 0;

      // Construct transaction object
      const transaction = {
        date,
        narration,
        chqNo,
        withdrawal,
        deposit,
        balance,
      };

      // Avoid including duplicate transactions
      if (
        !transactions.some(
          (t) =>
            t.date === transaction.date &&
            t.narration === transaction.narration &&
            t.chqNo === transaction.chqNo &&
            t.withdrawal === transaction.withdrawal &&
            t.deposit === transaction.deposit &&
            t.balance === transaction.balance
        )
      ) {
        transactions.push(transaction);
      }
    }

    return transactions;
  };

  return (
    <Box
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        sx={{ display: "none" }}
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Upload File
        </Button>
      </label>
      {fileName && (
        <Typography variant="body1">Selected file: {fileName}</Typography>
      )}
      {error && (
        <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
      {jsonData && (
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-wrap", textAlign: "center", marginTop: 2 }}
        >
          {/* <pre>{jsonData}</pre> */}
        </Typography>
      )}
    </Box>
  );
};

export default TableHeader;
