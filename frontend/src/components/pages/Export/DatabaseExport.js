import React from "react";
import { useGetDatabaseExport } from "../../../api/queries/exportQueries";
import { IconButton } from "@mui/material";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

const DatabaseExport = () => {
  const { refetch, isError, isFetching, isLoading } = useGetDatabaseExport();

  return (
    <IconButton onClick={() => refetch()} disabled={isFetching || isLoading}>
      <SystemUpdateAltIcon />
    </IconButton>
  );
};

export default DatabaseExport;
