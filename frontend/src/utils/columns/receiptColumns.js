import { Box } from "@mui/material";
import moment from "moment";
import { useMemo } from "react";

export const useReceiptColumns = (validationErrors, setValidationErrors) => {
  return useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.receiptName,
          helperText: validationErrors?.receiptName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              receiptName: undefined,
            }),
        },
        Cell: ({ cell }) => moment(cell.getValue()).format("DD-MM-YYYY"),
      },
      {
        accessorKey: "partyName",
        header: "Party Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.receiptType,
          helperText: validationErrors?.receiptType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              receiptType: undefined,
            }),
        },
      },
      {
        accessorKey: "narration",
        header: "Narration",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.receiptType,
          helperText: validationErrors?.receiptType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              receiptType: undefined,
            }),
        },
      },
      {
        accessorKey: "voucherTotal",
        header: "Voucher Total",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.receiptType,
          helperText: validationErrors?.receiptType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              receiptType: undefined,
            }),
        },
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              color: "green",
              p: "0.25rem",
            })}
          >
            {cell.getValue()?.toLocaleString?.("en-US", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </Box>
        ),
      },
    ],
    [validationErrors, setValidationErrors]
  );
};
