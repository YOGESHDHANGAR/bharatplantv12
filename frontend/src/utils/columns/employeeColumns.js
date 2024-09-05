import moment from "moment";
import { useMemo } from "react";

export const useEmployeeColumns = (validationErrors, setValidationErrors) => {
  return useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "ID",
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: "employeeName",
        header: "Employee Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.employeeName,
          helperText: validationErrors?.employeeName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              employeeName: undefined,
            }),
        },
      },
      {
        accessorKey: "employeeType",
        header: "Employee Type",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.employeeType,
          helperText: validationErrors?.employeeType,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              employeeType: undefined,
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
