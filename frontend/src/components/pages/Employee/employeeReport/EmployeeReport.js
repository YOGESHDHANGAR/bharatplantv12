import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo, useState } from "react";
import { useTheme } from "@emotion/react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useCreateEmployee,
  useDeleteEmployee,
  useUpdateEmployee,
} from "../../../../api/mutations/employeeMutations";
import { useDateFilteredData } from "../../../../utils/date/useDateFilteredData";
import {
  handleCreateEmployee,
  handleDeleteEmployee,
  handleUpdateEmployee,
} from "../../../../api/actions/employeeActions";
import { useGetAllEmployees } from "../../../../api/queries/employeeQueries";
import { useEmployeeColumns } from "../../../../utils/columns/employeeColumns";
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

const EmployeeReportTable = () => {
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
  const columns = useEmployeeColumns(validationErrors, setValidationErrors);

  // Use external data if provided, otherwise use useGetAllEmployees
  const {
    data: {
      getAllEmployeesResult: fetchedData = [], // Access the employees data array directly
      totalEmployees,
      currentPage,
      totalPages,
    } = {},
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAllEmployees({
    queryKey: [
      "employee",
      pagination.pageIndex,
      pagination.pageSize,
      debouncedGlobalFilter,
    ],
  });

  const { mutateAsync: createEmployeeAsync, isPending: isCreatingEmployee } =
    useCreateEmployee();
  const { mutateAsync: updateEmployeeAsync, isPending: isUpdatingEmployee } =
    useUpdateEmployee();
  const { mutateAsync: deleteEmployeeAsync, isPending: isDeletingEmployee } =
    useDeleteEmployee();

  const filteredData = useDateFilteredData(fetchedData, dateRange, "date");

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
    rowCount: totalEmployees ?? 0,

    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: (props) =>
      handleCreateEmployee({
        ...props,
        createEmployeeAsync,
        setValidationErrors,
        queryClient,
      }),
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (props) =>
      handleUpdateEmployee({
        ...props,
        updateEmployeeAsync,
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
        handleDeleteEmployee={handleDeleteEmployee}
        deleteEmployeeAsync={deleteEmployeeAsync}
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
          children: `Error loading employee data`,
        }
      : undefined,
    renderDetailPanel: ({ row }) => <DetailPanel row={row} />,
    renderToolbarInternalActions: (props) =>
      RenderToolbarInternalActions({ ...props }),
    renderBottomToolbar: (props) =>
      RenderBottomToolbarCustom({
        ...props,
        totalRecords: totalEmployees,
      }),
    state: {
      isLoading,
      isSaving: isCreatingEmployee || isUpdatingEmployee || isDeletingEmployee,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      globalFilter,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default EmployeeReportTable;
