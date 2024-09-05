import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCreateSalary,
  useDeleteSalary,
  useUpdateSalary,
} from "../../../../api/mutations/salaryMutations";
import {
  handleCreateSalary,
  handleDeleteSalary,
  handleUpdateSalary,
} from "../../../../api/actions/salaryActions";
import { useGetAllSalarys } from "../../../../api/queries/salaryQueries";
import { useSalaryColumns } from "../../../../utils/columns/salaryColumns";
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

const SalaryReportTable = () => {
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
  const columns = useSalaryColumns(validationErrors, setValidationErrors);

  // Use external data if provided, otherwise use useGetAllSalarys
  const {
    data: {
      getAllSalarysResult, // Access the salarys data array directly
      totalSalarys,
      currentPage,
      totalPages,
    } = {},
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAllSalarys({
    queryKey: ["salary"],
  });

  const { mutateAsync: createSalaryAsync, isPending: isCreatingSalary } =
    useCreateSalary();
  const { mutateAsync: updateSalaryAsync, isPending: isUpdatingSalary } =
    useUpdateSalary();
  const { mutateAsync: deleteSalaryAsync, isPending: isDeletingSalary } =
    useDeleteSalary();

  const table = useMaterialReactTable({
    ...commonProps,
    data: getAllSalarysResult?.paidRecords,
    columns,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableEditing: true,
    getRowId: (row) => row.id,

    manualPagination: true,
    onPaginationChange: setPagination,
    rowCount: totalSalarys ?? 0,

    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: (props) =>
      handleCreateSalary({
        ...props,
        createSalaryAsync,
        setValidationErrors,
        queryClient,
      }),
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (props) =>
      handleUpdateSalary({
        ...props,
        updateSalaryAsync,
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
        handleDeleteSalary={handleDeleteSalary}
        deleteSalaryAsync={deleteSalaryAsync}
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
          children: `Error loading salary data`,
        }
      : undefined,
    renderDetailPanel: ({ row }) => <DetailPanel row={row} />,
    renderToolbarInternalActions: (props) =>
      RenderToolbarInternalActions({ ...props }),
    renderBottomToolbar: (props) =>
      RenderBottomToolbarCustom({
        ...props,
        totalRecords: totalSalarys,
      }),
    state: {
      isLoading,
      isSaving: isCreatingSalary || isUpdatingSalary || isDeletingSalary,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      globalFilter,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default SalaryReportTable;
