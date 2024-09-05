import { Box } from "@mui/material";
import React from "react";
import LedgerStatementReport from "./ledgerStatementReportTable/LedgerStatementReport";

const LedgerStatement = () => {
  return (
    <Box sx={{ p: 2 }}>
      <LedgerStatementReport />
    </Box>
  );
};

export default LedgerStatement;
