import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCreateExpense,
  useDeleteExpense,
  useUpdateExpense,
} from "../../../../api/mutations/expenseMutations";
import {
  handleCreateExpense,
  handleDeleteExpense,
  handleUpdateExpense,
} from "../../../../api/actions/expenseActions";
import { useGetAllExpenses } from "../../../../api/queries/expenseQueries";
import { useExpenseColumns } from "../../../../utils/columns/expenseColumns";
import CustomCreateExpenseModal from "./CustomCreateExpenseModal";
import RenderEditRowDialogContent from "./RenderEditRowDialogContent";
import { RowActions } from "./RowActions";
import TableHeader from "./TableHeader";
import DetailPanel from "./DetailPanel";
import RenderToolbarInternalActions from "./RenderToolbarInternalActions";
import RenderBottomToolbarCustom from "./RenderBottomToolbarCustom";
import { commonProps } from "../../../../utils/tableProps/commonProps";
import { useDebounce } from "use-debounce";

const ExpenseReportTable = () => {
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState(() => {
    const storedRange = localStorage.getItem("dateRange");
    return storedRange ? JSON.parse(storedRange) : [null, null];
  });

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 800);

  const [validationErrors, setValidationErrors] = useState({});
  const columns = useExpenseColumns(validationErrors, setValidationErrors);

  // Use external data if provided, otherwise use useGetAllExpenses
  const {
    data: {
      getAllExpensesResult: fetchedData = [], // Access the expenses data array directly
      totalExpenses,
      currentPage,
      totalPages,
    } = {},
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAllExpenses({
    queryKey: [
      "expense",
      pagination.pageIndex,
      pagination.pageSize,
      debouncedGlobalFilter,
    ],
  });

  const { mutateAsync: createExpenseAsync, isPending: isCreatingExpense } =
    useCreateExpense();
  const { mutateAsync: updateExpenseAsync, isPending: isUpdatingExpense } =
    useUpdateExpense();
  const { mutateAsync: deleteExpenseAsync, isPending: isDeletingExpense } =
    useDeleteExpense();

  const table = useMaterialReactTable({
    ...commonProps,
    data: fetchedData,
    columns,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableEditing: true,
    getRowId: (row) => row.id,

    manualPagination: true,
    onPaginationChange: setPagination,
    rowCount: totalExpenses ?? 0,

    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: (props) =>
      handleCreateExpense({
        ...props,
        createExpenseAsync,
        setValidationErrors,
        queryClient,
      }),
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (props) =>
      handleUpdateExpense({
        ...props,
        updateExpenseAsync,
        setValidationErrors,
        queryClient,
      }),

    renderEditRowDialogContent: (props) => (
      <RenderEditRowDialogContent {...props} />
    ),
    renderRowActions: (props) => (
      <RowActions
        {...props}
        handleDeleteExpense={handleDeleteExpense}
        deleteExpenseAsync={deleteExpenseAsync}
        queryClient={queryClient}
      />
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <TableHeader
        TableHeader={TableHeader}
        table={table}
        dateRange={dateRange}
        setDateRange={setDateRange}
        refetch={refetch}
        setCreateModalOpen={setCreateModalOpen}
      />
    ),
    muiToolbarAlertBannerProps: isLoading
      ? {
          color: "error",
          children: `Error loading expense data`,
        }
      : undefined,
    renderDetailPanel: ({ row }) => <DetailPanel row={row} />,
    renderToolbarInternalActions: (props) =>
      RenderToolbarInternalActions({ ...props }),
    renderBottomToolbar: (props) =>
      RenderBottomToolbarCustom({
        ...props,
        totalRecords: totalExpenses,
      }),
    state: {
      isLoading,
      isSaving: isCreatingExpense || isUpdatingExpense || isDeletingExpense,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      globalFilter,
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
      {isCreateModalOpen && (
        <CustomCreateExpenseModal
          open={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSave={handleCreateExpense}
        />
      )}
    </>
  );
};

export default ExpenseReportTable;
