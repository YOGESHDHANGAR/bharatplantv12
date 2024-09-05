import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCreatePayment,
  useDeletePayment,
  useUpdatePayment,
} from "../../../../api/mutations/paymentMutations";
import {
  handleCreatePayment,
  handleDeletePayment,
  handleUpdatePayment,
} from "../../../../api/actions/paymentActions";
import { useGetAllPayments } from "../../../../api/queries/paymentQueries";
import { usePaymentColumns } from "../../../../utils/columns/paymentColumns";
import RenderCreateRowDialogContent from "./RenderCreateRowDialogContent";
import RenderEditRowDialogContent from "./CustomRenderEditRowDialogContent";
import { RowActions } from "./RowActions";
import TableHeader from "./TableHeader";
import DetailPanel from "./DetailPanel";
import RenderToolbarInternalActions from "./RenderToolbarInternalActions";
import RenderBottomToolbarCustom from "./RenderBottomToolbarCustom";
import { commonProps } from "../../../../utils/tableProps/commonProps";
import CommonTableHeader from "../../../common/table/CommonTableHeader";
import { useDebounce } from "use-debounce";
import CustomRenderEditRowDialogContent from "./CustomRenderEditRowDialogContent";

const PaymentReportTable = () => {
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
  const columns = usePaymentColumns(validationErrors, setValidationErrors);

  // Use external data if provided, otherwise use useGetAllPayments
  const {
    data: {
      getAllPaymentsResult: fetchedData = [], // Access the payments data array directly
      totalPayments,
      currentPage,
      totalPages,
      vouchersTotalSum,
    } = {},
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAllPayments({
    queryKey: [
      "payment",
      pagination.pageIndex,
      pagination.pageSize,
      dateRange,
      debouncedGlobalFilter,
    ],
  });

  const { mutateAsync: createPaymentAsync, isPending: isCreatingPayment } =
    useCreatePayment();
  const { mutateAsync: updatePaymentAsync, isPending: isUpdatingPayment } =
    useUpdatePayment();
  const { mutateAsync: deletePaymentAsync, isPending: isDeletingPayment } =
    useDeletePayment();

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
    rowCount: totalPayments ?? 0,

    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: (props) =>
      handleCreatePayment({
        ...props,
        createPaymentAsync,
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
        handleDeletePayment={handleDeletePayment}
        deletePaymentAsync={deletePaymentAsync}
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
          children: `Error loading payment data`,
        }
      : undefined,
    renderDetailPanel: ({ row }) => <DetailPanel row={row} />,
    renderToolbarInternalActions: (props) =>
      RenderToolbarInternalActions({ ...props }),
    renderBottomToolbar: (props) =>
      RenderBottomToolbarCustom({
        ...props,
        totalRecords: totalPayments,
        vouchersTotal: vouchersTotalSum,
      }),
    state: {
      isLoading,
      isSaving: isCreatingPayment || isUpdatingPayment || isDeletingPayment,
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

export default PaymentReportTable;
