import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useState } from "react";
import { useTheme } from "@emotion/react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCreateItem,
  useDeleteItem,
  useUpdateItem,
} from "../../../../api/mutations/itemMutations";
import { useDateFilteredData } from "../../../../utils/date/useDateFilteredData";
import {
  handleCreateItem,
  handleDeleteItem,
  handleUpdateItem,
} from "../../../../api/actions/itemActions";
import { useGetAllItems } from "../../../../api/queries/itemQueries";
import { useItemColumns } from "../../../../utils/columns/itemColumns";
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

const ItemReportTable = () => {
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
  const columns = useItemColumns(validationErrors, setValidationErrors);

  // Use external data if provided, otherwise use useGetAllItems
  const {
    data: {
      getAllItemsResult: fetchedData = [], // Access the items data array directly
      totalItems,
      currentPage,
      totalPages,
    } = {},
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAllItems({
    queryKey: [
      "item",
      pagination.pageIndex,
      pagination.pageSize,
      debouncedGlobalFilter,
    ],
  });

  const { mutateAsync: createItemAsync, isPending: isCreatingItem } =
    useCreateItem();
  const { mutateAsync: updateItemAsync, isPending: isUpdatingItem } =
    useUpdateItem();
  const { mutateAsync: deleteItemAsync, isPending: isDeletingItem } =
    useDeleteItem();

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
    rowCount: totalItems ?? 0,

    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: (props) =>
      handleCreateItem({
        ...props,
        createItemAsync,
        setValidationErrors,
        queryClient,
      }),
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (props) =>
      handleUpdateItem({
        ...props,
        updateItemAsync,
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
        handleDeleteItem={handleDeleteItem}
        deleteItemAsync={deleteItemAsync}
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
          children: `Error loading item data`,
        }
      : undefined,
    renderDetailPanel: ({ row }) => <DetailPanel row={row} />,
    renderToolbarInternalActions: (props) =>
      RenderToolbarInternalActions({ ...props }),
    renderBottomToolbar: (props) =>
      RenderBottomToolbarCustom({
        ...props,
        totalRecords: totalItems,
      }),
    state: {
      isLoading,
      isSaving: isCreatingItem || isUpdatingItem || isDeletingItem,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      globalFilter,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default ItemReportTable;
