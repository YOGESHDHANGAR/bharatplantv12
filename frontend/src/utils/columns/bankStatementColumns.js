// Material UI Imports
import { useMemo } from "react";

// Custom Hook for Columns
export const useBankStatementColumns = () => {
  return useMemo(
    () => [
      {
        accessorKey: "date",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Date",
        filterFn: "between", // Custom filter logic for date range filtering
        size: 30,
      },
      {
        accessorKey: "narration",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Narration",
        size: 100,
      },
      {
        accessorKey: "withdrawal",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Withdrawal",
        size: 60,
      },
      {
        accessorKey: "deposit",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Deposit",
        size: 60,
      },
      {
        accessorKey: "balance",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        header: "Balance",
        size: 90,
      },
    ],
    []
  );
};
