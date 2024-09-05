import moment from "moment";
import { useMemo } from "react";

export const useCompanyColumns = (validationErrors, setValidationErrors) => {
  return useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "ID",
        enableEditing: false,
        size: 80,
        visible: false, // This hides the column from the user
      },
      {
        accessorKey: "companyName",
        header: "Company Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.companyName,
          helperText: validationErrors?.companyName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              companyName: undefined,
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
