import React from "react";
// Material UI Imports
import { Box, Button } from "@mui/material";

const TableHeader = ({ table, dateRange, setDateRange }) => {
  return (
    <Box sx={{ display: "flex", gap: "0.5rem" }}>
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Create New Company
      </Button>
    </Box>
  );
};

export default React.memo(TableHeader);
