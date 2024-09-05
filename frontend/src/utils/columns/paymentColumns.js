import { useMemo } from "react";
import moment from "moment";
import { Box } from "@mui/material";

export const usePaymentColumns = (validationErrors, setValidationErrors) => {
  return useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.paymentName,
          helperText: validationErrors?.paymentName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              paymentName: undefined,
            }),
        },
        Cell: ({ cell }) => moment(cell.getValue()).format("DD-MM-YYYY"),
      },
      {
        accessorKey: "partyName",
        header: "Party Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.paymentType,
          helperText: validationErrors?.paymentType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              paymentType: undefined,
            }),
        },
      },
      {
        accessorKey: "narration",
        header: "Narration",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.paymentType,
          helperText: validationErrors?.paymentType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              paymentType: undefined,
            }),
        },
      },
      {
        accessorKey: "voucherTotal",
        header: "Voucher Total",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.paymentType,
          helperText: validationErrors?.paymentType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              paymentType: undefined,
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
