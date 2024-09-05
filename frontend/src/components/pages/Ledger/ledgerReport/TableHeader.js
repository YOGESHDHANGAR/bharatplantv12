import React from "react";
// Material UI Imports
import { Box, Button } from "@mui/material";
import { lighten } from "@mui/material/styles";

const TableHeader = ({ table }) => {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: lighten(theme.palette.background.default, 0.05),
        display: "flex",
        justifyContent: "space-between",
      })}
    >
      <Box sx={{ display: "flex", gap: "0.5rem" }}>
        <Button
          variant="contained"
          onClick={() => {
            table.setCreatingRow(true);
          }}
        >
          Create New Ledger
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(TableHeader);
