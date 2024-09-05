import apiClient from "../apiClient";

// Service to create a new fileSystem
export const uploadFilesService = async (acceptedFiles) => {
  console.log("acceptedFiles", acceptedFiles);
  const formData = new FormData();

  // Append each file to the FormData object
  acceptedFiles.forEach((file) => {
    formData.append("files", file);
  });

  const response = await apiClient.post(`/files/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Service to get all fileSystems
export const getAllFilesService = async ({ queryKey }) => {
  const [_, pageIndex, pageSize, dateRange, debouncedGlobalFilter] = queryKey; // Include debouncedGlobalFilter from queryKey

  // Construct the URL with parameters
  const fetchURL = new URL("/api/v1/files", apiClient.defaults.baseURL);

  // Set query parameters for pagination
  fetchURL.searchParams.set("page", `${pageIndex + 1}`); // Page index is 0-based in frontend
  fetchURL.searchParams.set("limit", `${pageSize}`);

  if (debouncedGlobalFilter) {
    fetchURL.searchParams.set("debouncedGlobalFilter", debouncedGlobalFilter);
  }

  const response = await apiClient.get(fetchURL.toString());

  return {
    getAllFilesResult: response.data.getAllFilesResult,
    totalFiles: response.data.totalFiles,
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
  };
};

export const deleteFileService = async (id) => {
  await apiClient.delete(`/file/${id}/delete`); // Updated to match route for soft delete
};

// Service to restore a soft-deleted fileSystem by ID
export const restoreFileService = async (id) => {
  const response = await apiClient.put(`/file/${id}/restore`);
  return response.data;
};

// Service to permanently delete an fileSystem by ID
export const permanentDeleteFileService = async (id) => {
  await apiClient.delete(`/file/${id}/permanentDelete`);
};
