import moment from "moment";
import { useMemo } from "react";

export const useSalaryColumns = (validationErrors, setValidationErrors) => {
  return useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        enableEditing: false,
        size: 80,
        Cell: ({ cell }) => moment(cell.getValue()).format("DD-MM-YYYY"),
      },
      {
        accessorKey: "paidAmount",
        header: "Paid Amount",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.salaryUnit,
          helperText: validationErrors?.salaryUnit,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              salaryUnit: undefined,
            }),
        },
      },
    ],
    [validationErrors, setValidationErrors]
  );
};
