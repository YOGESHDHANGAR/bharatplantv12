import * as React from "react";
import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";

import "./ReceiptEntry.css"; // Ensure this is the correct path to your CSS file
import { Tooltip } from "@mui/material";

function ModeListTable({ rows, onDelete }) {
  return (
    <TableContainer component={Paper} elevation={2} sx={{ height: "280px" }}>
      <Table
        sx={{
          minWidth: 650,
          "& .MuiTableCell-root": {
            fontSize: "0.9rem", // Apply font size to all table cells
          },
        }}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Mode Type</b>
            </TableCell>
            <TableCell align="left">
              <b>Mode Amount</b>
            </TableCell>
            <TableCell align="left">
              <b>Action</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.modeType}
              </TableCell>
              <TableCell align="left">{row.modeAmount}</TableCell>
              <TableCell align="left">
                <Tooltip title="Remove">
                  <DeleteIcon
                    color="error"
                    sx={{ cursor: "pointer" }}
                    className="delete_button"
                    onClick={() => onDelete(index)}
                  />
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

ModeListTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      modeType: PropTypes.string.isRequired,
      modeAmount: PropTypes.number.isRequired,
    })
  ).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default React.memo(ModeListTable);
