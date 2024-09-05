import React from "react";
import ExpenseReport from "./ExpenseReport/ExpenseReport";
import { Box } from "@mui/material";

const Expense = () => {
  return (
    <Box sx={{ p: 2 }}>
      <ExpenseReport />
    </Box>
  );
};

export default Expense;
