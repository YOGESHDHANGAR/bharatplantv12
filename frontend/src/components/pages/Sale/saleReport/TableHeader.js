import React from "react";
// Material UI Imports
import { Box } from "@mui/material";
import { lighten } from "@mui/material/styles";

const TableHeader = () => {
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
