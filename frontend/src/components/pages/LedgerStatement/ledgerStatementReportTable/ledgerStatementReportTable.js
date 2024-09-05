import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo, useState } from "react";
import { useTheme } from "@emotion/react";
import { useDateFilteredData } from "../../../utils/date/useDateFilteredData";
import { useQueryClient } from "@tanstack/react-query";
import {
  handleCreateEntity,
  handleUpdateEntity,
  handleDeleteEntity,
} from "./entityActions";
import { bankData } from "../../../utils/data/bankData/bankData";

const GenericReportTable = ({
  columns,
  fetchDataHook,
  createMutationHook,
  updateMutationHook,
  deleteMutationHook,
  detailPanelComponent: DetailPanel,
  rowActionsComponent: RowActions,
  createRowDialogContent: CreateRowDialogContent,
  editRowDialogContent: EditRowDialogContent,
  TableHeaderComponent, // Custom TableHeader component for each entity
  renderToolbarInternalActions,
  renderBottomToolbarCustom,
  validationErrors,
  setValidationErrors,
  entityName = "Record", // Default to "Record" if no entity name is provided
}) => {
  const theme = useTheme();
  const queryClient = useQueryClient(); // Ensure queryClient is accessible
  // const [validationErrors, setValidationErrors] = useState({});
  const [dateRange, setDateRange] = useState([null, null]);

  // Call API hooks dynamically based on the passed hooks
  const {
    data: fetchedData = [],
    isError,
    isFetching,
    isLoading,
  } = fetchDataHook();
  const { mutateAsync: createEntityAsync, isPending: isCreatingEntity } =
    createMutationHook();
  const { mutateAsync: updateEntityAsync, isPending: isUpdatingEntity } =
    updateMutationHook();
  const { mutateAsync: deleteEntityAsync, isPending: isDeletingEntity } =
    deleteMutationHook();

  const handleRowDoubleClick = (row) => {
    // to be implemented as needed
  };

  const filteredData = useDateFilteredData(fetchedData, dateRange, "date");

  const table = useMaterialReactTable({
    initialState: {
      showColumnFilters: false,
      showGlobalFilter: true,
      columnPinning: {
        left: ["mrt-row-expand", "mrt-row-select"],
        right: ["mrt-row-actions"],
      },
      sorting: [
        {
          id: "date",
          desc: false,
        },
      ],
      density: "compact",
      pagination: {
        pageSize: 100,
      },
    },

    displayColumnDefOptions: {
      "mrt-row-expand": {
        size: 45,
        grow: true,
        align: "center",
      },
      "mrt-row-select": {
        size: 45,
        grow: true,
        align: "center",
      },
    },

    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [100, 200, 500],
      shape: "circular",
      variant: "outlined",
      showFirstButton: false,
      showLastButton: false,
    },

    muiTablePaperProps: {
      elevation: 4,
      sx: {
        width: "100%",
        height: "87vh",
        overflow: "auto",
      },
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: "calc(100vh - 250px)",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        fontSize: "1rem",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontSize: "1rem",
      },
    },
    enableStickyHeader: true,
    enableStickyFooter: true,
    enableGlobalFilter: false,
    enableColumnFilterModes: true,
    enableColumnPinning: true,
    enableRowActions: true,
    enableRowSelection: true,
    enableRowNumbers: true,
    enableDensityToggle: false,
    visibleInShowHideMenu: false,
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    data: filteredData,
    columns,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableEditing: true,
    getRowId: (row) => row.id,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: (props) =>
      handleCreateEntity({
        ...props,
        createEntityAsync,
        setValidationErrors,
        queryClient,
      }),
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (props) =>
      handleUpdateEntity({
        ...props,
        updateEntityAsync,
        setValidationErrors,
        queryClient,
      }),
    renderCreateRowDialogContent: (props) =>
      CreateRowDialogContent ? <CreateRowDialogContent {...props} /> : null,
    renderEditRowDialogContent: (props) =>
      EditRowDialogContent ? <EditRowDialogContent {...props} /> : null,
    renderRowActions: (props) =>
      RowActions ? (
        <RowActions
          {...props}
          handleDeleteEntity={handleDeleteEntity} // Correct function name
          deleteEntityAsync={deleteMutationHook().mutateAsync}
          queryClient={queryClient}
        />
      ) : null,
    renderTopToolbarCustomActions: ({ table }) =>
      TableHeaderComponent ? (
        <TableHeaderComponent
          table={table}
          dateRange={dateRange}
          setDateRange={setDateRange}
          entityName={entityName} // Optionally pass entity name if needed
        />
      ) : null,
    muiToolbarAlertBannerProps: isLoading
      ? {
          color: "error",
          children: `Error loading ${entityName} data`,
        }
      : undefined,
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => handleRowDoubleClick(row),
      sx: {
        cursor: "pointer",
      },
    }),
    renderDetailPanel: ({ row }) =>
      DetailPanel ? <DetailPanel row={row} /> : null,
    renderToolbarInternalActions: (props) =>
      renderToolbarInternalActions
        ? renderToolbarInternalActions({ ...props })
        : null,
    renderBottomToolbar: (props) =>
      renderBottomToolbarCustom
        ? renderBottomToolbarCustom({
            ...props,
            numberOfRows: filteredData.length,
          })
        : null,
    state: {
      isLoading,
      isSaving: isCreatingEntity || isUpdatingEntity || isDeletingEntity,
      showAlertBanner: isError,
      showProgressBars: isFetching,
    },
  });

  return <MaterialReactTable table={table} />;
};

export default GenericReportTable;
