import { Box } from "@mui/material";
import moment from "moment";
import { useMemo } from "react";

export const usePurchaseColumns = (validationErrors, setValidationErrors) => {
  return useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.purchaseName,
          helperText: validationErrors?.purchaseName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              purchaseName: undefined,
            }),
        },
        Cell: ({ cell }) => moment(cell.getValue()).format("DD-MM-YYYY"),
      },
      {
        accessorKey: "partyName",
        header: "Party Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.purchaseType,
          helperText: validationErrors?.purchaseType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              purchaseType: undefined,
            }),
        },
      },
      {
        accessorKey: "narration",
        header: "Narration",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.purchaseType,
          helperText: validationErrors?.purchaseType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              purchaseType: undefined,
            }),
        },
      },
      {
        accessorKey: "voucherTotal",
        header: "Voucher Total",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.purchaseType,
          helperText: validationErrors?.purchaseType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              purchaseType: undefined,
            }),
        },
        Cell: ({ cell }) => (
          <Box
            component="span"
            sx={(theme) => ({
              color: "red",
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
