import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo, useState } from "react";
import { useTheme } from "@emotion/react";
import { useQueryClient } from "@tanstack/react-query";
import { useDateFilteredData } from "../../../utils/date/useDateFilteredData";
import {
  handleCreateEntity,
  handleUpdateEntity,
  handleDeleteEntity,
} from "./entityActions";

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
  TableHeaderComponent,
  renderToolbarInternalActions,
  renderBottomToolbarCustom,
  validationErrors,
  setValidationErrors,
  entityName = "Record",
  data: externalData, // New prop for external data
}) => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState([null, null]);

  // Use external data if provided, otherwise use fetchDataHook
  const {
    data: fetchedData = externalData || [],
    isError,
    isFetching,
    isLoading,
  } = externalData ? { data: externalData } : fetchDataHook();

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
      // sorting: [
      //   {
      //     id: "date",
      //     desc: false,
      //   },
      // ],
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
          handleDeleteEntity={handleDeleteEntity}
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
          entityName={entityName}
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
