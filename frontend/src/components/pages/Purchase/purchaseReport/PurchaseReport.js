import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCreatePurchase,
  useDeletePurchase,
  useUpdatePurchase,
} from "../../../../api/mutations/purchaseMutations";
import {
  handleCreatePurchase,
  handleDeletePurchase,
  handleUpdatePurchase,
} from "../../../../api/actions/purchaseActions";
import { useGetAllPurchases } from "../../../../api/queries/purchaseQueries";
import { usePurchaseColumns } from "../../../../utils/columns/purchaseColumns";
import RenderCreateRowDialogContent from "./RenderCreateRowDialogContent";
import { RowActions } from "./RowActions";
import TableHeader from "./TableHeader";
import DetailPanel from "./DetailPanel";
import RenderToolbarInternalActions from "./RenderToolbarInternalActions";
import RenderBottomToolbarCustom from "./RenderBottomToolbarCustom";
import { commonProps } from "../../../../utils/tableProps/commonProps";
import CommonTableHeader from "../../../common/table/CommonTableHeader";
import { useDebounce } from "use-debounce";
import CustomRenderEditRowDialogContent from "./CustomRenderEditRowDialogContent";

const PurchaseReportTable = () => {
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
  const columns = usePurchaseColumns(validationErrors, setValidationErrors);

  // Use external data if provided, otherwise use useGetAllPurchases
  const {
    data: {
      getAllPurchaseResult: fetchedData = [], // Access the purchase data array directly
      totalPurchase,
      currentPage,
      totalPages,
      vouchersTotalSum,
    } = {},
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAllPurchases({
    queryKey: [
      "purchase",
      pagination.pageIndex,
      pagination.pageSize,
      dateRange,
      debouncedGlobalFilter,
    ],
  });

  const { mutateAsync: createPurchaseAsync, isPending: isCreatingPurchase } =
    useCreatePurchase();
  const { mutateAsync: updatePurchaseAsync, isPending: isUpdatingPurchase } =
    useUpdatePurchase();
  const { mutateAsync: deletePurchaseAsync, isPending: isDeletingPurchase } =
    useDeletePurchase();

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
    data: fetchedData,
    columns,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableEditing: true,
    getRowId: (row) => row.id,

    manualPagination: true,
    onPaginationChange: setPagination,
    rowCount: totalPurchase ?? 0,

    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: (props) =>
      handleCreatePurchase({
        ...props,
        createPurchaseAsync,
        setValidationErrors,
        queryClient,
      }),

    renderCreateRowDialogContent: (props) => (
      <RenderCreateRowDialogContent {...props} />
    ),

    renderRowActions: (props) => (
      <RowActions
        {...props}
        handleDeletePurchase={handleDeletePurchase}
        deletePurchaseAsync={deletePurchaseAsync}
        queryClient={queryClient}
        handleEditClick={handleEditClick}
      />
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <CommonTableHeader
        TableHeader={TableHeader}
        table={table}
        dateRange={dateRange}
        refetch={refetch}
      />
    ),
    muiToolbarAlertBannerProps: isLoading
      ? {
          color: "error",
          children: `Error loading purchase data`,
        }
      : undefined,
    renderDetailPanel: ({ row }) => <DetailPanel row={row} />,
    renderToolbarInternalActions: (props) =>
      RenderToolbarInternalActions({ ...props }),
    renderBottomToolbar: (props) =>
      RenderBottomToolbarCustom({
        ...props,
        totalRecords: totalPurchase,
        vouchersTotal: vouchersTotalSum,
      }),
    state: {
      isLoading,
      isSaving: isCreatingPurchase || isUpdatingPurchase || isDeletingPurchase,
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

export default PurchaseReportTable;
