import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo, useState } from "react";
import { useTheme } from "@emotion/react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCreateReceipt,
  useDeleteReceipt,
  useUpdateReceipt,
} from "../../../../api/mutations/receiptMutations";
import { useDateFilteredData } from "../../../../utils/date/useDateFilteredData";
import {
  handleCreateReceipt,
  handleDeleteReceipt,
  handleUpdateReceipt,
} from "../../../../api/actions/receiptActions";
import { useGetAllReceipts } from "../../../../api/queries/receiptQueries";
import { useReceiptColumns } from "../../../../utils/columns/receiptColumns";
import RenderCreateRowDialogContent from "./RenderCreateRowDialogContent";
import RenderEditRowDialogContent from "./CustomRenderEditRowDialogContent";
import { RowActions } from "./RowActions";
import TableHeader from "./TableHeader";
import DetailPanel from "./DetailPanel";
import RenderToolbarInternalActions from "./RenderToolbarInternalActions";
import RenderBottomToolbarCustome from "./RenderBottomToolbarCustom";
import { commonProps } from "../../../../utils/tableProps/commonProps";
import CommonTableHeader from "../../../common/table/CommonTableHeader";
import { useDebounce } from "use-debounce";
import CustomRenderEditRowDialogContent from "./CustomRenderEditRowDialogContent";

const ReceiptReportTable = () => {
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState(() => {
    const storedRange = localStorage.getItem("dateRange");
    return storedRange ? JSON.parse(storedRange) : [null, null];
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [debouncedGlobalFilter] = useDebounce(globalFilter, 800);

  const [validationErrors, setValidationErrors] = useState({});
  const columns = useReceiptColumns(validationErrors, setValidationErrors);

  // Use external data if provided, otherwise use useGetAllReceipts
  const {
    data: {
      getAllReceiptsResult: filteredData = [], // Access the receipts data array directly
      totalReceipts,
      currentPage,
      totalPages,
      vouchersTotalSum,
    } = {},
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAllReceipts({
    queryKey: [
      "receipt",
      pagination.pageIndex,
      pagination.pageSize,
      dateRange,
      debouncedGlobalFilter,
    ],
  });

  const { mutateAsync: createReceiptAsync, isPending: isCreatingReceipt } =
    useCreateReceipt();
  const { mutateAsync: updateReceiptAsync, isPending: isUpdatingReceipt } =
    useUpdateReceipt();
  const { mutateAsync: deleteReceiptAsync, isPending: isDeletingReceipt } =
    useDeleteReceipt();

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedRow(null); // Clear selected row after closing
  };

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
    rowCount: totalReceipts ?? 0,

    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: (props) =>
      handleCreateReceipt({
        ...props,
        createReceiptAsync,
        setValidationErrors,
        queryClient,
      }),

    renderCreateRowDialogContent: (props) => (
      <RenderCreateRowDialogContent {...props} />
    ),

    renderRowActions: (props) => (
      <RowActions
        {...props}
        handleDeleteReceipt={handleDeleteReceipt}
        deleteReceiptAsync={deleteReceiptAsync}
        queryClient={queryClient}
        handleEditClick={handleEditClick}
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
          children: `Error loading receipt data`,
        }
      : undefined,

    renderDetailPanel: ({ row }) => <DetailPanel row={row} />,
    renderToolbarInternalActions: (props) =>
      RenderToolbarInternalActions({ ...props }),
    renderBottomToolbar: (props) =>
      RenderBottomToolbarCustome({
        ...props,
        totalRecords: totalReceipts,
        vouchersTotal: vouchersTotalSum,
      }),
    state: {
      isLoading,
      isSaving: isCreatingReceipt || isUpdatingReceipt || isDeletingReceipt,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      globalFilter,
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
      {isEditModalOpen && (
        <CustomRenderEditRowDialogContent
          open={isEditModalOpen}
          onClose={handleCloseModal}
          row={selectedRow}
        />
      )}
    </>
  );
};

export default ReceiptReportTable;
