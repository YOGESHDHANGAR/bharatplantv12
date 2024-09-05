import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo, useState } from "react";
import { useTheme } from "@emotion/react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCreateBankStatement,
  useDeleteBankStatement,
  useUpdateBankStatement,
} from "../../../../api/mutations/bankStatementMutations";
import { useDateFilteredData } from "../../../../utils/date/useDateFilteredData";
import {
  handleCreateBankStatement,
  handleDeleteBankStatement,
  handleUpdateBankStatement,
} from "../../../../api/actions/bankStatementActions";
import { useGetAllBankStatements } from "../../../../api/queries/bankStatementQueries";
import { useBankStatementColumns } from "../../../../utils/columns/bankStatementColumns";
import RenderCreateRowDialogContent from "./RenderCreateRowDialogContent";
import RenderEditRowDialogContent from "./RenderEditRowDialogContent";
import { RowActions } from "./RowActions";
import TableHeader from "./TableHeader";
import DetailPanel from "./DetailPanel";
import RenderToolbarInternalActions from "./RenderToolbarInternalActions";
import RenderBottomToolbarCustome from "./RenderBottomToolbarCustom";
import { commonProps } from "../../../../utils/tableProps/commonProps";
import CommonTableHeader from "../../../common/table/CommonTableHeader";
import { useDebounce } from "use-debounce";

let queryKey = "BankStatement";

const BankStatementReportTable = () => {
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState(() => {
    const storedRange = localStorage.getItem("dateRange");
    return storedRange ? JSON.parse(storedRange) : [null, null];
  });

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 800);

  const [validationErrors, setValidationErrors] = useState({});

  const columns = useBankStatementColumns(
    validationErrors,
    setValidationErrors
  );

  // Use external data if provided, otherwise use useGetAllBankStatements
  const {
    data: {
      getAllBankStatementsResult: fetchedData = [], // Access the bankStatements data array directly
      totalBankStatements,
      currentPage,
      totalPages,
    } = {},
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAllBankStatements({
    queryKey: [
      "bankStatement",
      pagination.pageIndex,
      pagination.pageSize,
      dateRange,
      debouncedGlobalFilter,
    ],
  });

  const {
    mutateAsync: updateBankStatementAsync,
    isPending: isUpdatingBankStatement,
  } = useUpdateBankStatement();
  const {
    mutateAsync: deleteBankStatementAsync,
    isPending: isDeletingBankStatement,
  } = useDeleteBankStatement();

  const handleRowDoubleClick = (row) => {
    // to be implemented as needed
  };

  const filteredData = useDateFilteredData(fetchedData, dateRange, "date");

  const table = useMaterialReactTable({
    ...commonProps,
    data: filteredData,
    columns,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableEditing: true,
    getRowId: (row) => row.id,

    manualPagination: true,
    onPaginationChange: setPagination,
    rowCount: totalBankStatements ?? 0,

    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,

    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (props) =>
      handleUpdateBankStatement({
        ...props,
        updateBankStatementAsync,
        setValidationErrors,
        queryClient,
        queryKey,
      }),
    renderCreateRowDialogContent: (props) => (
      <RenderCreateRowDialogContent {...props} />
    ),
    renderEditRowDialogContent: (props) => (
      <RenderEditRowDialogContent {...props} />
    ),
    renderRowActions: (props) => (
      <RowActions
        {...props}
        handleDeleteBankStatement={handleDeleteBankStatement}
        deleteBankStatementAsync={deleteBankStatementAsync}
        queryClient={queryClient}
      />
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <CommonTableHeader
        TableHeader={TableHeader}
        table={table}
        dateRange={dateRange}
        setDateRange={setDateRange}
        refetch={refetch}
      />
    ),
    muiToolbarAlertBannerProps: isLoading
      ? {
          color: "error",
          children: `Error loading bankStatement data`,
        }
      : undefined,
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => handleRowDoubleClick(row),
      sx: {
        cursor: "pointer",
      },
    }),
    renderDetailPanel: ({ row }) => <DetailPanel row={row} />,
    renderToolbarInternalActions: (props) =>
      RenderToolbarInternalActions({ ...props }),
    renderBottomToolbar: (props) =>
      RenderBottomToolbarCustome({
        ...props,
        totalRecords: totalBankStatements,
      }),
    state: {
      isLoading,
      isSaving: isUpdatingBankStatement || isDeletingBankStatement,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      globalFilter,
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

export default BankStatementReportTable;
