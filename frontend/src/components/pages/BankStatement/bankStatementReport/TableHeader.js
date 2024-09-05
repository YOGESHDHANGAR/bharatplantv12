import React, { useState } from "react";
import { Button, Typography, Input, Box } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useUploadBankStatementFile } from "../../../../api/mutations/bankStatementMutations";
import DateRangeFilter from "../../../../utils/date/DateRangeFilter";

const TableHeader = ({ setExtractedData, table, dateRange, setDateRange }) => {
  const [error, setError] = useState(""); // To store error messages
  const [loading, setLoading] = useState(false); // To handle loading state
  const [fileName, setFileName] = useState(""); // To display selected file name

  const { mutateAsync: uploadBankStatementFileAsync } =
    useUploadBankStatementFile();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setError(""); // Reset error state

    if (file) {
      setFileName(file.name);

      if (
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        try {
          setLoading(true);
          // Upload the file using the mutation function
          const result = await uploadBankStatementFileAsync(file);
          setLoading(false);

          if (result.success) {
            setExtractedData(result.data); // Set the extracted data if needed
          } else {
            setError("Failed to process the file. Please try again.");
          }
        } catch (err) {
          setLoading(false);
          setError("An error occurred during the file upload.");
        }
      } else {
        setError("Please upload a valid Excel file.");
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
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
      {fileName && (
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          Selected file: {fileName}
        </Typography>
      )}
      {error && (
        <Typography variant="body1" color="error" sx={{ marginTop: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default TableHeader;
