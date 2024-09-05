import moment from "moment";
import { useMemo } from "react";

export const useRecycleBinColumns = (validationErrors, setValidationErrors) => {
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
        accessorKey: "type",
        header: "Type",
        enableEditing: false,
        size: 200,
      },
      {
        accessorKey: "date",
        header: "Date Deleted",
        enableEditing: false,
        size: 80,
        Cell: ({ cell }) => moment(cell.getValue()).format("DD-MM-YYYY"),
      },
    ],
    [validationErrors, setValidationErrors]
  );
};
