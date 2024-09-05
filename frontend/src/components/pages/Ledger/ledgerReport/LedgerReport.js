import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo, useState } from "react";
import { useTheme } from "@emotion/react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCreateLedger,
  useDeleteLedger,
  useUpdateLedger,
} from "../../../../api/mutations/ledgerMutations";
import {
  handleCreateLedger,
  handleDeleteLedger,
  handleUpdateLedger,
} from "../../../../api/actions/ledgerActions";
import { useGetAllLedgers } from "../../../../api/queries/ledgerQueries";
import { useLedgerColumns } from "../../../../utils/columns/ledgerColumns";
import RenderCreateRowDialogContent from "./RenderCreateRowDialogContent";
import RenderEditRowDialogContent from "./RenderEditRowDialogContent";
import { RowActions } from "./RowActions";
import TableHeader from "./TableHeader";
import DetailPanel from "./DetailPanel";
import RenderToolbarInternalActions from "./RenderToolbarInternalActions";
import RenderBottomToolbarCustom from "./RenderBottomToolbarCustom";
import { commonProps } from "../../../../utils/tableProps/commonProps";
import CommonTableHeader from "../../../common/table/CommonTableHeader";
import { useDebounce } from "use-debounce";

const LedgerReportTable = () => {
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
  const columns = useLedgerColumns(validationErrors, setValidationErrors);

  // Use external data if provided, otherwise use useGetAllLedgers
  const {
    data: {
      getAllLedgersResult: fetchedData = [], // Access the sales data array directly
      totalLedgers,
      currentPage,
      totalPages,
    } = {},
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAllLedgers({
    queryKey: [
      "ledger",
      pagination.pageIndex,
      pagination.pageSize,
      debouncedGlobalFilter,
    ],
  });

  const { mutateAsync: createLedgerAsync, isPending: isCreatingLedger } =
    useCreateLedger();
  const { mutateAsync: updateLedgerAsync, isPending: isUpdatingLedger } =
    useUpdateLedger();
  const { mutateAsync: deleteLedgerAsync, isPending: isDeletingLedger } =
    useDeleteLedger();

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
    rowCount: totalLedgers ?? 0,

    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: (props) =>
      handleCreateLedger({
        ...props,
        createLedgerAsync,
        setValidationErrors,
        queryClient,
      }),
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (props) =>
      handleUpdateLedger({
        ...props,
        updateLedgerAsync,
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
        handleDeleteLedger={handleDeleteLedger}
        deleteLedgerAsync={deleteLedgerAsync}
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
          children: `Error loading ledger data`,
        }
      : undefined,
    renderDetailPanel: ({ row }) => <DetailPanel row={row} />,
    renderToolbarInternalActions: (props) =>
      RenderToolbarInternalActions({ ...props }),
    renderBottomToolbar: (props) =>
      RenderBottomToolbarCustom({
        ...props,
        totalRecords: totalLedgers,
      }),
    state: {
      isLoading,
      isSaving: isCreatingLedger || isUpdatingLedger || isDeletingLedger,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      globalFilter,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default LedgerReportTable;
