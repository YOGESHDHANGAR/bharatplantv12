import { Box } from "@mui/material";
import { useMemo } from "react";
import moment from "moment";

export const useSaleColumns = (validationErrors, setValidationErrors) => {
  return useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.saleName,
          helperText: validationErrors?.saleName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              saleName: undefined,
            }),
        },
        Cell: ({ cell }) => moment(cell.getValue()).format("DD-MM-YYYY"),
        size: 80,
      },
      {
        accessorKey: "partyName",
        header: "Party Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.saleType,
          helperText: validationErrors?.saleType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              saleType: undefined,
            }),
        },
        size: 180,
      },
      {
        accessorKey: "narration",
        header: "Narration",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.saleType,
          helperText: validationErrors?.saleType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              saleType: undefined,
            }),
        },
        size: 180,
      },
      {
        accessorKey: "voucherTotal",
        header: "Voucher Total",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.saleType,
          helperText: validationErrors?.saleType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              saleType: undefined,
            }),
        },
        Cell: ({ cell }) => (
          <Box component="span" sx={{ color: "green", p: "0.25rem" }}>
            {cell.getValue()?.toLocaleString?.("en-US", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </Box>
        ),
        size: 80,
      },
    ],
    [validationErrors, setValidationErrors]
  );
};
