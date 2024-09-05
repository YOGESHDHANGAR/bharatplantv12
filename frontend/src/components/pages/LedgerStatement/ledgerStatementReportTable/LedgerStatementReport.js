import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCreateLedgerStatement,
  useDeleteLedgerStatement,
  useUpdateLedgerStatement,
} from "../../../../api/mutations/ledgerStatementMutations";
import { useDateFilteredData } from "../../../../utils/date/useDateFilteredData";
import {
  handleCreateLedgerStatement,
  handleDeleteLedgerStatement,
  handleUpdateLedgerStatement,
} from "../../../../api/actions/ledgerStatementActions";
import { useGetAllLedgerStatements } from "../../../../api/queries/ledgerStatementQueries";
import { useLedgerStatementColumns } from "../../../../utils/columns/ledgerStatementColumns";
import RenderCreateRowDialogContent from "./RenderCreateRowDialogContent";
import RenderEditRowDialogContent from "./RenderEditRowDialogContent";
import { RowActions } from "./RowActions";
import TableHeader from "./TableHeader";
import DetailPanel from "./DetailPanel";
import RenderToolbarInternalActions from "./RenderToolbarInternalActions";
import RenderBottomToolbarCustom from "./RenderBottomToolbarCustom";
import { commonProps } from "../../../../utils/tableProps/commonProps";
import CommonTableHeader from "../../../common/table/CommonTableHeader";
import { useMemo, useState } from "react";
import { selectedLedgerAtLedgerStatementSignal } from "../../../../utils/signal/signalUtil";
import { useDebounce } from "use-debounce";

const LOCAL_STORAGE_KEY = "selectedLedgerForLedgerStatement";

const LedgerStatementReportTable = () => {
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
  const columns = useLedgerStatementColumns(
    validationErrors,
    setValidationErrors
  );

  const selectedLedgerAtLedgerStatement =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) ||
    selectedLedgerAtLedgerStatementSignal?.value ||
    null;

  // Use external data if provided, otherwise use useGetAllLedgerStatements
  const {
    data: {
      getLedgerStatementResult: fetchedData = [], // Access the ledgerStatements data array directly
      totalLedgerStatementRecords,
      currentPage,
      totalPages,
      balance,
    } = {},
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAllLedgerStatements({
    queryKey: [
      "ledgerStatement",
      pagination.pageIndex,
      pagination.pageSize,
      dateRange,
      selectedLedgerAtLedgerStatement,
      debouncedGlobalFilter,
    ],
  });

  const {
    mutateAsync: createLedgerStatementAsync,
    isPending: isCreatingLedgerStatement,
  } = useCreateLedgerStatement();
  const {
    mutateAsync: updateLedgerStatementAsync,
    isPending: isUpdatingLedgerStatement,
  } = useUpdateLedgerStatement();
  const {
    mutateAsync: deleteLedgerStatementAsync,
    isPending: isDeletingLedgerStatement,
  } = useDeleteLedgerStatement();

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
    rowCount: totalLedgerStatementRecords ?? 0,

    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: (props) =>
      handleCreateLedgerStatement({
        ...props,
        createLedgerStatementAsync,
        setValidationErrors,
        queryClient,
      }),
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (props) =>
      handleUpdateLedgerStatement({
        ...props,
        updateLedgerStatementAsync,
        setValidationErrors,
        queryClient,
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
        handleDeleteLedgerStatement={handleDeleteLedgerStatement}
        deleteLedgerStatementAsync={deleteLedgerStatementAsync}
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
        isError={isError}
        isFetching={isFetching}
        isLoading={isLoading}
      />
    ),
    muiToolbarAlertBannerProps: isLoading
      ? {
          color: "error",
          children: `Error loading ledgerStatement data`,
        }
      : undefined,

    renderDetailPanel: ({ row }) => <DetailPanel row={row} />,
    renderToolbarInternalActions: (props) =>
      RenderToolbarInternalActions({ ...props }),
    renderBottomToolbar: (props) =>
      RenderBottomToolbarCustom({
        ...props,
        totalRecords: totalLedgerStatementRecords,
        vouchersTotalSum: balance,
      }),
    state: {
      isLoading,
      isSaving:
        isCreatingLedgerStatement ||
        isUpdatingLedgerStatement ||
        isDeletingLedgerStatement,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      globalFilter,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default LedgerStatementReportTable;
