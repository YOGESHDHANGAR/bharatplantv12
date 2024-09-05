import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useDeleteFile,
  useUploadFiles,
} from "../../../../api/mutations/fileSystemMutations";
import {
  handleUploadFiles,
  handlePermanentlyDeleteFiles,
} from "../../../../api/actions/fileSystemActions";
import { useGetAllFiles } from "../../../../api/queries/fileSystemQueries";
import { useFileSystemColumns } from "../../../../utils/columns/fileSystemColumns";
import RenderCreateRowDialogContent from "./RenderCreateRowDialogContent";
import RenderEditRowDialogContent from "./RenderEditRowDialogContent";
import { RowActions } from "./RowActions";
import TableHeader from "./TableHeader";
import DetailPanel from "./DetailPanel";
import RenderToolbarInternalActions from "./RenderToolbarInternalActions";
import RenderBottomToolbarCustom from "./RenderBottomToolbarCustom";
import { Box, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { commonProps } from "../../../../utils/tableProps/commonProps";
import CommonTableHeader from "../../../common/table/CommonTableHeader";
import { useDebounce } from "use-debounce";

const FileSystemReportTable = () => {
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

  const columns = useFileSystemColumns();

  // Use external data if provided, otherwise use useGetAllFiles
  const {
    data: {
      getAllFilesResult: fetchedData = [], // Access the sales data array directly
      totalFiles,
      currentPage,
      totalPages,
    } = {},
    isError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAllFiles({
    queryKey: [
      "fileSystem",
      pagination.pageIndex,
      pagination.pageSize,
      debouncedGlobalFilter,
    ],
  });

  const { mutateAsync: uploadFilesAsync, isPending: isCreatingFileSystem } =
    useUploadFiles();
  const { mutateAsync: deleteFileAsync, isPending: isDeletingFileSystem } =
    useDeleteFile();

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
        console.log("Accepted Files:", acceptedFiles);

        // Upload files to the backend
        await uploadFilesAsync(acceptedFiles);

        // Refetch the data from the backend to update the table
        queryClient.invalidateQueries("fileSystem");
      } catch (error) {
        console.error("File upload error:", error);
      }
    },
    noClick: true, // Disable click-to-upload
  });

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
    rowCount: totalFiles ?? 0,

    manualFiltering: true,
    onGlobalFilterChange: setGlobalFilter,

    renderCreateRowDialogContent: (props) => (
      <RenderCreateRowDialogContent {...props} />
    ),
    renderEditRowDialogContent: (props) => (
      <RenderEditRowDialogContent {...props} />
    ),
    renderRowActions: (props) => (
      <RowActions
        {...props}
        onViewClick={handleViewClick}
        handlePermanentlyDeleteFiles={handlePermanentlyDeleteFiles}
        deleteFileSystemAsync={deleteFileAsync}
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
          children: `Error loading fileSystem data`,
        }
      : undefined,
    renderDetailPanel: ({ row }) => <DetailPanel row={row} />,
    renderToolbarInternalActions: (props) =>
      RenderToolbarInternalActions({ ...props }),
    renderBottomToolbar: (props) =>
      RenderBottomToolbarCustom({
        ...props,
        totalRecords: table.getRowModel().rows.length,
      }),
    state: {
      isLoading,
      isSaving: isCreatingFileSystem || isDeletingFileSystem,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      pagination,
      globalFilter,
    },
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed grey",
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
  );
};

export default FileSystemReportTable;
