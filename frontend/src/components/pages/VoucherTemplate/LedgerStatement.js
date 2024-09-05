import React, { forwardRef } from "react";
import {
  Box,
  Container,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from "@mui/material";

const LedgerStatement = forwardRef((props, ref) => {
  const ledgerData = {
    companyName: "Bharat Mawa Point Chakeri",
    companyAddress: {
      line1: "Village Chaker, Tehsil Anjad, District Badwani,",
      line2: "Madhya Pradesh, 451556",
    },
    logo: "https://logowik.com/content/uploads/images/zoho.jpg", // Placeholder logo URL
    partyName: "Nitin Gupta Indore",
    ledgerRecords: [
      { date: "2024-08-01", particular: "Opening Balance", amount: 200 },
      { date: "2024-08-05", particular: "Payment Received", amount: -100 },
      { date: "2024-08-10", particular: "Purchase Mawa A1", amount: 50 },
      { date: "2024-08-15", particular: "Payment Received", amount: -50 },
      { date: "2024-08-20", particular: "Sale Milk Cake", amount: 150 },
    ],
    previousBalance: 200,
  };

  const calculateTotal = () => {
    return ledgerData.ledgerRecords.reduce(
      (total, record) => total + record.amount,
      0
    );
  };

  const total = calculateTotal();
  const finalBalance = ledgerData.previousBalance + total;

  return (
    <Container maxWidth="md" ref={ref} sx={{ height: "800px", width: "800px" }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Box>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Box display="flex" alignItems="center">
                <img
                  src={ledgerData.logo}
                  alt="Company Logo"
                  style={{ height: 50, marginRight: 16 }}
                />
                <Box>
                  <Typography variant="h6">{ledgerData.companyName}</Typography>
                  <Typography variant="body2">
                    {ledgerData.companyAddress.line1}
                  </Typography>
                  <Typography variant="body2">
                    {ledgerData.companyAddress.line2}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Typography variant="h3" align="right">
                Ledger Statement
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ marginY: 2 }} />
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={6}>
              <Typography variant="h6">Party Name</Typography>
              <Typography variant="body1">{ledgerData.partyName}</Typography>
            </Grid>
          </Grid>
          <TableContainer sx={{ marginTop: 3, minHeight: "600px" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Particular</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ledgerData.ledgerRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.particular}</TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: record.amount > 0 ? "green" : "red" }}
                    >
                      {record.amount > 0
                        ? `+₹${record.amount.toFixed(2)}`
                        : `-₹${Math.abs(record.amount).toFixed(2)}`}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell sx={{ p: 1 }} colSpan={2} align="right">
                    <Typography variant="h6">Total:</Typography>
                  </TableCell>
                  <TableCell sx={{ p: 1 }} align="right">
                    <Typography variant="h6">₹{total.toFixed(2)}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ p: 1 }} colSpan={2} align="right">
                    <Typography variant="body1">Previous Balance:</Typography>
                  </TableCell>
                  <TableCell sx={{ p: 1 }} align="right">
                    <Typography variant="body1">
                      ₹{ledgerData.previousBalance.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ p: 1 }} colSpan={2} align="right">
                    <Typography variant="body1">Final Balance:</Typography>
                  </TableCell>
                  <TableCell sx={{ p: 1 }} align="right">
                    <Typography variant="body1">
                      ₹{finalBalance.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Divider sx={{ marginTop: 3 }} />
          <Typography variant="body1" align="center" sx={{ marginTop: 2 }}>
            Thank you for your business!
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
});

export default LedgerStatement;
