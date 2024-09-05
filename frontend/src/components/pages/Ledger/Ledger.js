import React from "react";
import { Box } from "@mui/material";
import LedgerReport from "./ledgerReport/LedgerReport";

const Ledger = () => {
  return (
    <Box>
      <LedgerReport />
    </Box>
  );
};

export default React.memo(Ledger);
