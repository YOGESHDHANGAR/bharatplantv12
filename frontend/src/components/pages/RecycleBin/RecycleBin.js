import React from "react";
import RecycleBinReport from "./recycleBinReport/RecycleBinReport";
import { Box } from "@mui/material";

const RecycleBin = () => {
  return (
    <Box sx={{ p: 2 }}>
      <RecycleBinReport />
    </Box>
  );
};

export default RecycleBin;
