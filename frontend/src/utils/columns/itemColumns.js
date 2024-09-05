import moment from "moment";
import { useMemo } from "react";

export const useItemColumns = (validationErrors, setValidationErrors) => {
  return useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "ID",
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: "itemName",
        header: "Item Name",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.itemName,
          helperText: validationErrors?.itemName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              itemName: undefined,
            }),
        },
      },
      {
        accessorKey: "itemUnit",
        header: "Item Unit",
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.itemUnit,
          helperText: validationErrors?.itemUnit,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              itemUnit: undefined,
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
