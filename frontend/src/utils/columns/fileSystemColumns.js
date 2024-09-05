import { useMemo } from "react";
import moment from "moment"; // Import moment

export const useFileSystemColumns = () => {
  return useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "ID",
        enableEditing: false,
        size: 80,
        Cell: ({ cell }) => (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "40px", // Adjust width as needed
            }}
          >
            {cell.getValue()}
          </div>
        ),
      },
      {
        accessorKey: "fileName",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "File Name",
        size: 100,
        Cell: ({ cell }) => (
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "250px", // Adjust width as needed
            }}
          >
            {cell.getValue()}
          </div>
        ),
      },
      {
        accessorKey: "dateCreation",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Date Created",
        filterFn: "between", // Custom filter logic for date range filtering
        size: 130,
        Cell: ({ cell }) => moment(cell.getValue()).format("D MMM YYYY"), // Format the date
      },
      {
        accessorKey: "dateModified",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Date Modified",
        filterFn: "between", // Custom filter logic for date range filtering
        size: 130,
        Cell: ({ cell }) => moment(cell.getValue()).format("D MMM YYYY"), // Format the date
      },
      {
        accessorKey: "type",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Type",
        size: 200,
      },
      {
        accessorKey: "size",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Size",
        size: 100,
        Cell: ({ cell }) => {
          const size = cell.getValue();
          return size ? `${size} bytes` : "Unknown size"; // Display size with unit
        },
      },
    ],
    []
  );
};
