import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

// Custom Hooks and Components
import { useColumns } from "./column";
import TableHeader from "./TableHeader";
import DetailPanel from "./DetailPanel";
import { RowActions } from "./RowActions";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { openDeleteConfirmModal } from "../../../miuiRedux/actions/saleActions";

// Modal component for editing
import SaleEditModel from "../../Sale/SaleEditModel";
import moment from "moment";

import RenderBottomToolbarCustome from "./RenderBottomToolbarCustom";
import RenderToolbarInternalActions from "./RenderToolbarInternalActions";
import { useDropzone } from "react-dropzone";
import { Box, Typography } from "@mui/material";
import { useGetAllFiles } from "../../../../api/queries/fileSystemQueries";
import {
  useGetDeleteFiles,
  useGetUploadFiles,
} from "../../../../api/mutations/fileSystemMutations";

const FileSystemReport = () => {
  const columns = useColumns();
  const queryClient = useQueryClient();
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [data, setData] = useState([]);

  const {
    data: fetchedFiles = [],
    isError,
    isFetching,
    isLoading,
  } = useGetAllFiles();

  const { mutateAsync: uploadFilesAsync } = useGetUploadFiles();
  const { mutateAsync: deleteFilesAsync } = useGetDeleteFiles();

  const handleEditClick = (row) => {
    setSelectedSale(row.original);
    setIsEditModalOpen(true);
  };

  const handleRowDoubleClick = (row) => {
    handleViewClick(row);
  };

  let fetchedSales;

  const filteredData = useMemo(() => {
    if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
      return fetchedSales;
    }
    const startDate = moment(dateRange.startDate).startOf("day");
    const endDate = moment(dateRange.endDate).endOf("day");

    return fetchedSales.filter((sale) => {
      const saleDate = moment(sale.date, "YYYY-MM-DD");
      return (
        (!startDate || saleDate.isSameOrAfter(startDate, "day")) &&
        (!endDate || saleDate.isSameOrBefore(endDate, "day"))
      );
    });
  }, [fetchedSales, dateRange]);

  const handleDataExtracted = (newRows) => {
    setData((prevData) => [...prevData, ...newRows]);
  };

  const handleViewClick = (row) => {
    const fileName = row.original.fileName;
    const fileUrl = `http://localhost:5894/uploads/${encodeURIComponent(
      fileName
    )}`;
    window.open(fileUrl);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      try {
        const formData = new FormData();
        acceptedFiles.forEach((file) => {
          formData.append("files", file);
          setData((prevData) => [
            ...prevData,
            { fileName: file.name, fileSize: file.size },
          ]);
        });

        await uploadFilesAsync(formData);

        queryClient.invalidateQueries(["files"]);
      } catch (error) {
        console.error("File upload error:", error);
      }
    },
    noClick: true, // Disable click-to-upload
  });

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
    enableStickyHeader: true,
    enableStickyFooter: true,
    columns,
    data: fetchedFiles,
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
    muiTableBodyRowProps: ({ row }) => ({
      onDoubleClick: () => handleRowDoubleClick(row),
      sx: {
        cursor: "pointer",
      },
    }),

    renderDetailPanel: ({ row }) => <DetailPanel row={row} />,
    onEditingRowCancel: () => setValidationErrors({}),
    renderRowActions: (props) =>
      RowActions ? (
        <RowActions
          {...props}
          onViewClick={handleViewClick}
          openDeleteConfirmModal={(row) =>
            openDeleteConfirmModal({ row, deleteFilesAsync })
          }
        />
      ) : null,
    renderTopToolbarCustomActions: ({ table }) => (
      <TableHeader onDataExtracted={handleDataExtracted} />
    ),
    renderToolbarInternalActions: ({ table }) => (
      <RenderToolbarInternalActions table={table} />
    ),
    renderBottomToolbar: ({ table }) => (
      <RenderBottomToolbarCustome table={table} numberOfRows={45} />
    ),
  });

  return (
    <>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed grey",
          m: 2,
          width: "85vw",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive && (
          <Typography
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "5rem",
              color: "grey",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            Drop here
          </Typography>
        )}
        <MaterialReactTable table={table} />
      </Box>
      {isEditModalOpen && (
        <SaleEditModel
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          selectedSale={selectedSale}
        />
      )}
    </>
  );
};

export default FileSystemReport;
