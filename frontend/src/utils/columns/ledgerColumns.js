import moment from "moment";
import { useMemo } from "react";

export const useLedgerColumns = (validationErrors, setValidationErrors) => {
  return useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "ID",
        enableEditing: false,
        size: 80,
        enableHiding: true,
      },
      {
        accessorKey: "ledgerName",
        header: "Ledger Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.ledgerName,
          helperText: validationErrors?.ledgerName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              ledgerName: undefined,
            }),
        },
      },
      {
        accessorKey: "ledgerType",
        header: "Ledger Type",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.ledgerType,
          helperText: validationErrors?.ledgerType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              ledgerType: undefined,
            }),
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        enableEditing: false,
        size: 80,
        Cell: ({ cell }) => moment(cell.getValue()).format("DD-MM-YYYY"),
      },
    ],
    [validationErrors, setValidationErrors]
  );
};
