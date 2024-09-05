import React from "react";
import { Box, Button } from "@mui/material";
import { lighten } from "@mui/material/styles";

const TableHeader = ({
  table,
  dateRange,
  setDateRange,
  entityName = "User",
}) => {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: lighten(theme.palette.background.default, 0.05),
        display: "flex",
        gap: "0.5rem",
        p: "8px",
        justifyContent: "space-between",
      })}
    >
      <Box>
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          {/* Uncomment and use DateRangeFilter when needed */}
          {/* <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange} /> */}
          <Button
            variant="contained"
            onClick={() => {
              if (table.setCreatingRow) {
                table.setCreatingRow(true);
              } else {
                console.warn("setCreatingRow is not available on table");
              }
            }}
          >
            Create New {entityName}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(TableHeader);
