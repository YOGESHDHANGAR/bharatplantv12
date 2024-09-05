import moment from "moment";
import { useMemo } from "react";

export const useExpenseColumns = (validationErrors, setValidationErrors) => {
  return useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "ID",
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: "expenseName",
        header: "Expense Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.expenseName,
          helperText: validationErrors?.expenseName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              expenseName: undefined,
            }),
        },
      },
      {
        accessorKey: "expenseUnit",
        header: "Expense Unit",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.expenseUnit,
          helperText: validationErrors?.expenseUnit,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              expenseUnit: undefined,
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
