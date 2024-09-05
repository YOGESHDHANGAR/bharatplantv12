import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useQueryClient } from "@tanstack/react-query";

import {
  handlePermanentlyRecycleBinItem,
  handleRestoreItemOfRecycleBin,
} from "../../../../api/actions/recycleBinActions";
import { useGetAllRecycleBinItems } from "../../../../api/queries/recycleBinQueries";
import { useRecycleBinColumns } from "../../../../utils/columns/recycleBinColumns";
import { RowActions } from "./RowActions";
import TableHeader from "./TableHeader";
import DetailPanel from "./DetailPanel";
import RenderToolbarInternalActions from "./RenderToolbarInternalActions";
import RenderBottomToolbarCustom from "./RenderBottomToolbarCustom";
import { commonProps } from "../../../../utils/tableProps/commonProps";
import CommonTableHeader from "../../../common/table/CommonTableHeader";
import { useDebounce } from "use-debounce";
import {
  usePermanentDeleteRecycleBin,
  useRestoreItemOfRecycleBin,
} from "../../../../api/mutations/recycleBinMutations";
import { useState } from "react";

const RecycleBinReportTable = () => {
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
  const columns = useRecycleBinColumns(validationErrors, setValidationErrors);

  // Use external data if provided, otherwise use useGetAllRecycleBinItems
  const {
    data: {
      getAllRecycleBinItemsResult: fetchedData = [], // Access the recycleBins data array directly
      totalDeletedItems,
      currentPage,
      totalPages,
    } = {},
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAllRecycleBinItems({
    queryKey: [
      "recycleBin",
      pagination.pageIndex,
      pagination.pageSize,
      debouncedGlobalFilter,
    ],
  });

  const {
    mutateAsync: restoreItemOfRecycleBinAsync,
    isPending: isRestoringRecycleBinItem,
  } = useRestoreItemOfRecycleBin();
  const {
    mutateAsync: permanentltyDeleteRecycleBinItemAsync,
    isPending: isPermanentlyDeletingRecycleBinItem,
  } = usePermanentDeleteRecycleBin();

  const handleRowDoubleClick = (row) => {
    table.setEditingRow(row);
  };

  const table = useMaterialReactTable({
    ...commonProps,
    data: fetchedData,
    columns,
    getRowId: (row) => row._id,

    manualPagination: true,
    onPaginationChange: setPagination,
    rowCount: totalDeletedItems ?? 0,

    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,

    renderRowActions: (props) => (
      <RowActions
        {...props}
        handleRestoreItemOfRecycleBin={handleRestoreItemOfRecycleBin}
        restoreItemOfRecycleBinAsync={restoreItemOfRecycleBinAsync}
        handlePermanentlyRecycleBinItem={handlePermanentlyRecycleBinItem}
        permanentltyDeleteRecycleBinItemAsync={
          permanentltyDeleteRecycleBinItemAsync
        }
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
          children: `Error loading recycleBin data`,
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
      RenderBottomToolbarCustom({
        ...props,
        totalRecords: totalDeletedItems,
      }),
    state: {
      isLoading,
      isSaving:
        isRestoringRecycleBinItem || isPermanentlyDeletingRecycleBinItem,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      globalFilter,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default RecycleBinReportTable;
