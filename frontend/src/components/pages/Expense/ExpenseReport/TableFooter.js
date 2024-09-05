import React from "react";
import { Box, Typography } from "@mui/material";

const TableFooter = ({ table, totalRowCount }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        padding: 1, // Adjust padding to control space
        height: "40px", // Set an explicit height
        alignExpenses: "center", // Vertically center the content
      }}
    >
      <Typography variant="caption" sx={{ fontSize: "inherit" }}>
        Total Rows: {totalRowCount}
      </Typography>
    </Box>
  );
};

export default TableFooter;
