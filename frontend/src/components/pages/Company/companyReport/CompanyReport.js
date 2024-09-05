import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useCreateCompany,
  useDeleteCompany,
  useUpdateCompany,
} from "../../../../api/mutations/companyMutations";
import { useDateFilteredData } from "../../../../utils/date/useDateFilteredData";

import { useGetAllCompanys } from "../../../../api/queries/companyQueries";
import { useCompanyColumns } from "../../../../utils/columns/companyColumns";
import RenderCreateRowDialogContent from "./RenderCreateRowDialogContent";
import RenderEditRowDialogContent from "./RenderEditRowDialogContent";
import { RowActions } from "./RowActions";
import TableHeader from "./TableHeader";
import DetailPanel from "./DetailPanel";
import RenderToolbarInternalActions from "./RenderToolbarInternalActions";
import RenderBottomToolbarCustom from "./RenderBottomToolbarCustom";
import {
  handleCreateCompany,
  handleDeleteCompany,
  handleUpdateCompany,
} from "../../../../api/actions/companyActions";
import { commonProps } from "../../../../utils/tableProps/commonProps";
import CommonTableHeader from "../../../common/table/CommonTableHeader";
import { useDebounce } from "use-debounce";

let queryKey = "company";

const CompanyReportTable = () => {
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
  const columns = useCompanyColumns(validationErrors, setValidationErrors);

  // Use external data if provided, otherwise use useGetAllCompanys
  const {
    data: {
      getAllCompanysResult: fetchedData = [], // Access the companys data array directly
      totalCompanys,
      currentPage,
      totalPages,
    } = {},
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAllCompanys({
    queryKey: [
      "company",
      pagination.pageIndex,
      pagination.pageSize,
      debouncedGlobalFilter,
    ],
  });

  const { mutateAsync: createCompanyAsync, isPending: isCreatingCompany } =
    useCreateCompany();
  const { mutateAsync: updateCompanyAsync, isPending: isUpdatingCompany } =
    useUpdateCompany();
  const { mutateAsync: deleteCompanyAsync, isPending: isDeletingCompany } =
    useDeleteCompany();

  const handleRowDoubleClick = (row) => {
    table.setEditingRow(row);
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
    rowCount: totalCompanys ?? 0,

    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: (props) =>
      handleCreateCompany({
        ...props,
        createCompanyAsync,
        setValidationErrors,
        queryClient,
        queryKey,
      }),
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (props) =>
      handleUpdateCompany({
        ...props,
        updateCompanyAsync,
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
        handleDeleteCompany={handleDeleteCompany}
        deleteCompanyAsync={deleteCompanyAsync}
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
          children: `Error loading company data`,
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
        totalRecords: totalCompanys,
      }),
    state: {
      isLoading,
      isSaving: isCreatingCompany || isUpdatingCompany || isDeletingCompany,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      globalFilter,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default CompanyReportTable;
