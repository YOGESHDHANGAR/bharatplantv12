import apiClient from "../apiClient";

// Function to get all soft-deleted items from all modules
export const getAllRecycleBinItemsService = async ({ queryKey }) => {
  const [_, pageIndex, pageSize, debouncedGlobalFilter] = queryKey; // Extract pagination details from queryKey

  // Construct the URL with parameters
  const fetchURL = new URL(
    "/api/v1/recycleBin/item/allDeleted",
    apiClient.defaults.baseURL
  );

  // Set query parameters for pagination
  fetchURL.searchParams.set("page", `${pageIndex + 1}`); // Page index is 0-based in frontend
  fetchURL.searchParams.set("limit", `${pageSize}`);

  if (debouncedGlobalFilter) {
    fetchURL.searchParams.set("debouncedGlobalFilter", debouncedGlobalFilter);
  }

  // Make the API request
  const response = await apiClient.get(fetchURL.toString());

  // Return the paginated result
  return {
    getAllRecycleBinItemsResult: response.data.getAllRecycleBinItemsResult,
    totalDeletedItems: response.data.totalDeletedItems,
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
  };
};

// Function to restore a soft-deleted item
export const restoreItemofRecycleBinService = async (type, _id) => {
  console.log("Request to restore:");
  const response = await apiClient.put(
    `/recycleBin/item/restore/${type}/${_id}`
  );
  console.log("Response from restore API:", response.data);
  return response.data;
};

// Function to permanently delete an item
export const permanentDeleteRecycleBinService = async (type, _id) => {
  console.log("permanentDeleteRecycleBinService");
  const response = await apiClient.delete(
    `/recycleBin/item/permanentDelete/${type}/${_id}`
  );
  return response.data;
};
