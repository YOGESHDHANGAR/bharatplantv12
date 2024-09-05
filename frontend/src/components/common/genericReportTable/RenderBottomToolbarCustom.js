import React, { useState } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { MRT_TablePagination } from "material-react-table";

const RenderBottomToolbarCustome = ({ table, numberOfRows }) => {
  return (
    <Box>
      <Divider />
      <Box
        display="flex"
        sx={{
          px: 2,
          width: "100%",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: "1.2rem",
            textAlign: "center",
            width: "100%",
          }}
        >
          Sale Total: ₹484515
        </Typography>
      </Box>
      <Divider />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ height: "50px", px: 2 }}
      >
        <Box>
          <Typography variant="caption" sx={{ fontSize: "inherit" }}>
            Total Records: {numberOfRows}
          </Typography>
        </Box>

        <MRT_TablePagination table={table} />
      </Box>
    </Box>
  );
};

export default RenderBottomToolbarCustome;
