import { Box, IconButton, Tooltip } from "@mui/material";
import { lighten } from "@mui/material/styles";
import React from "react";
import RefreshIcon from "@mui/icons-material/Refresh";

const CommonTableHeader = ({
  TableHeader,
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
      <TableHeader
        isError={isError}
        isFetching={isFetching}
        isLoading={isLoading}
        table={table}
        setExtractedData={setExtractedData}
        refetch={refetch}
      />
    </Box>
  );
};

export default CommonTableHeader;
