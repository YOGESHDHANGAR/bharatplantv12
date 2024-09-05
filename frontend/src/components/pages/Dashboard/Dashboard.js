import React from "react";
import { Box } from "@mui/material";
import DonutUpdateChart from "./Charts/DonutUpdateChart";
import ZoombleTimeseriesChart from "./Charts/ZoombleTimeseriesChart";

const Dashboard = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "90vh" }}
    >
      <DonutUpdateChart />
    </Box>
  );
};

export default Dashboard;
