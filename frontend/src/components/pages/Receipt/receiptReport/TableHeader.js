import React from "react";
// Material UI Imports
import { Box, Button } from "@mui/material";
import { lighten } from "@mui/material/styles";
import DateRangeFilter from "../../../../utils/date/DateRangeFilter";

const TableHeader = ({ table, dateRange, setDateRange }) => {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: lighten(theme.palette.background.default, 0.05),
        display: "flex",
        justifyContent: "space-between",
      })}
    ></Box>
  );
};

export default React.memo(TableHeader);
