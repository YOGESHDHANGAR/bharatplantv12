import { useMemo } from "react";
import moment from "moment";
import { Box } from "@mui/material";

export const useLedgerStatementColumns = (
  validationErrors,
  setValidationErrors
) => {
  return useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.ledgerStatementName,
          helperText: validationErrors?.ledgerStatementName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              ledgerStatementName: undefined,
            }),
        },
        Cell: ({ cell }) => moment(cell.getValue()).format("DD-MM-YYYY"),
        size: 80,
      },
      {
        accessorKey: "type",
        header: "Particulars",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.ledgerStatementType,
          helperText: validationErrors?.ledgerStatementType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              ledgerStatementType: undefined,
            }),
        },
        size: 400,
      },
      {
        accessorKey: "vchNo",
        header: "Vch No.",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.ledgerStatementType,
          helperText: validationErrors?.ledgerStatementType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              ledgerStatementType: undefined,
            }),
        },
        size: 80,
      },
      {
        accessorKey: "voucherTotal",
        header: "Voucher Total",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.ledgerStatementType,
          helperText: validationErrors?.ledgerStatementType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              ledgerStatementType: undefined,
            }),
        },
        Cell: ({ row }) => {
          const voucherType = row.original.type; // Assuming 'type' is available in row.original
          let color = "red"; // Default color for Purchase and Payment
          let sign = "-"; // Default sign

          if (voucherType === "Sale" || voucherType === "Purchase") {
            color = "green";
            sign = "+";
          }

          return (
            <Box
              component="span"
              sx={{
                color: color,
                p: "0.25rem",
              }}
            >
              {sign}{" "}
              {row.original.voucherTotal?.toLocaleString("en-US", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </Box>
          );
        },
        size: 80,
      },
    ],
    [validationErrors, setValidationErrors]
  );
};
