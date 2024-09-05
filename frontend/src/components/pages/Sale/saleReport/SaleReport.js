import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCreateSale,
  useDeleteSale,
  useUpdateSale,
} from "../../../../api/mutations/saleMutations";
import {
  handleCreateSale,
  handleDeleteSale,
  handleUpdateSale,
} from "../../../../api/actions/saleActions";
import { useGetAllSales } from "../../../../api/queries/saleQueries";
import { useSaleColumns } from "../../../../utils/columns/saleColumns";
import RenderCreateRowDialogContent from "./RenderCreateRowDialogContent";
import CustomRenderEditRowDialogContent from "./CustomRenderEditRowDialogContent";
import { RowActions } from "./RowActions";
import TableHeader from "./TableHeader";
import DetailPanel from "./DetailPanel";
import RenderToolbarInternalActions from "./RenderToolbarInternalActions";
import RenderBottomToolbarCustom from "./RenderBottomToolbarCustom";
import { commonProps } from "../../../../utils/tableProps/commonProps";
import CommonTableHeader from "../../../common/table/CommonTableHeader";
import { dateSignal } from "../../../../utils/solidJs/solid";
import { createEffect } from "solid-js";
import { useDebounce } from "use-debounce";

const SaleReportTable = () => {
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
  const columns = useSaleColumns(validationErrors, setValidationErrors);

  // Use external data if provided, otherwise use useGetAllSales
  const {
    data: {
      getAllSalesResult: fetchedData = [], // Access the sales data array directly
      totalSales,
      currentPage,
      totalPages,
      vouchersTotalSum,
    } = {},
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAllSales({
    queryKey: [
      "sale",
      pagination.pageIndex,
      pagination.pageSize,
      dateSignal(),
      debouncedGlobalFilter,
    ],
  });

  createEffect(() => {});

  const { mutateAsync: createSaleAsync, isPending: isCreatingSale } =
    useCreateSale();
  const { mutateAsync: updateSaleAsync, isPending: isUpdatingSale } =
    useUpdateSale();
  const { mutateAsync: deleteSaleAsync, isPending: isDeletingSale } =
    useDeleteSale();

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
    editDisplayMode: "custom",
    enableEditing: true,
    getRowId: (row) => row.id,

    manualPagination: true,
    onPaginationChange: setPagination,
    rowCount: totalSales ?? 0,

    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: (props) =>
      handleCreateSale({
        ...props,
        createSaleAsync,
        setValidationErrors,
        queryClient,
      }),
    renderCreateRowDialogContent: (props) => (
      <RenderCreateRowDialogContent {...props} />
    ),
    renderRowActions: (props) => (
      <RowActions
        {...props}
        handleDeleteSale={handleDeleteSale}
        deleteSaleAsync={deleteSaleAsync}
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
          children: `Error loading sale data`,
        }
      : undefined,
    renderDetailPanel: ({ row }) => <DetailPanel row={row} />,
    renderToolbarInternalActions: (props) =>
      RenderToolbarInternalActions({ ...props }),
    renderBottomToolbar: (props) =>
      RenderBottomToolbarCustom({
        ...props,
        totalRecords: totalSales,
        vouchersTotal: vouchersTotalSum,
      }),
    state: {
      isLoading,
      isSaving: isCreatingSale || isUpdatingSale || isDeletingSale,
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

export default SaleReportTable;
