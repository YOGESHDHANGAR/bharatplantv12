export const commonProps = {
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
  },

  displayColumnDefOptions: {
    "mrt-row-expand": {
      size: 45, // Fixed width for expand column
      grow: false,
      align: "center",
    },
    "mrt-row-select": {
      size: 45, // Fixed width for select column
      grow: false,
      align: "center",
    },
  },

  muiSearchTextFieldProps: {
    size: "small",
    variant: "outlined",
  },
  muiPaginationProps: {
    color: "secondary",
    rowsPerPageOptions: [10, 20, 30],
    shape: "circular",
    variant: "outlined",
    showFirstButton: false,
    showLastButton: false,
  },

  muiTablePaperProps: {
    elevation: 4,
    sx: {
      width: "100%",
      minHeight: "cal(88.6vh)",
    },
  },
  muiTableBodyCellProps: {
    sx: {
      fontSize: "15px",
    },
  },
  muiTableHeadCellProps: {
    sx: {
      fontSize: "15px",
    },
  },
  muiTableBodyRowProps: ({ row, table }) => ({
    onDoubleClick: () => table.setEditingRow(row),
    sx: {
      cursor: "pointer",
    },
  }),
  enableStickyHeader: false,
  enableStickyFooter: false,
  enableColumnFilterModes: false,
  enableColumnPinning: true,
  enableRowActions: true,
  enableRowSelection: true,
  enableRowNumbers: true,
  enableDensityToggle: false,
  visibleInShowHideMenu: false,
  paginationDisplayMode: "pages",
  positionToolbarAlertBanner: "bottom",
};
