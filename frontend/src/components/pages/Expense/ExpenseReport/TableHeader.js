import React from "react";
import { lighten } from "@mui/material/styles";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const CommonTableHeader = ({
  setCreateModalOpen,
  table,
  refetch,
  setExtractedData,
  isError,
  isFetching,
  isLoading,
}) => {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: lighten(theme.palette.background.default, 0.05),
        display: "flex",
        justifyContent: "space-between",
      })}
    >
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
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
            onClick={() => setCreateModalOpen(true)} // Correct usage
          >
            Create New Expense
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CommonTableHeader;
