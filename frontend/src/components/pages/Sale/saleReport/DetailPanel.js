// Material UI Imports
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const DetailPanel = ({ row }) => {
  const { items } = row.original;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end", // Aligns the table to the right side
        maxWidth: "1600px",
        width: "100%",
        margin: "auto",
      }}
    >
      <TableContainer component={Paper} sx={{ marginTop: "16px" }}>
        {/* <h3>Item Cart</h3> */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <b>Item Name</b>
              </TableCell>
              <TableCell align="center">
                <b>Item Quantity</b>
              </TableCell>
              <TableCell align="center">
                <b>Item Rate</b>
              </TableCell>
              <TableCell align="center">
                <b>Item Unit</b>
              </TableCell>
              <TableCell align="center">
                <b>Item Total</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                <TableCell align="center">{item.itemName}</TableCell>
                <TableCell align="center">{item.itemQuantity}</TableCell>
                <TableCell align="center">{item.itemRate}</TableCell>
                <TableCell align="center">{item.itemUnit}</TableCell>
                <TableCell align="center">{item.itemTotal}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DetailPanel;
