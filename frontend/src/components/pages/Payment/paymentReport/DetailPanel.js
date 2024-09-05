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
  const { modes } = row.original;

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
        {/* <h3>Mode Cart</h3> */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <b>Mode Type</b>
              </TableCell>
              <TableCell align="center">
                <b>Mode Amount</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modes.map((mode) => (
              <TableRow key={mode._id}>
                <TableCell align="center">{mode.modeType}</TableCell>
                <TableCell align="center">{mode.modeAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DetailPanel;
