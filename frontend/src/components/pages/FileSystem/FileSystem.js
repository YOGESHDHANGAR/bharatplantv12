import React from "react";
import FileSystemReport from "./fileSystemReport/FileSystemReport";
import { Box } from "@mui/material";

const FileSystem = () => {
  return (
    <Box sx={{ p: 2 }}>
      <FileSystemReport />
    </Box>
  );
};

export default FileSystem;
