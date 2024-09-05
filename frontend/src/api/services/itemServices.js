import { companySelectedSignal } from "../../utils/signal/signalUtil";
import apiClient from "../apiClient";

export const createItemService = async (item) => {
  const { value } = companySelectedSignal.value;
  const company = value;

  const requestData = {
    ...item,
    company, // Add companyId to the request data
  };
  const response = await apiClient.post(`/item/new`, requestData);
  return response.data;
};

export const getAllItemsService = async ({ queryKey }) => {
  const [_, pageIndex, pageSize, debouncedGlobalFilter] = queryKey; // Extract pagination details from queryKey

  // Construct the URL with parameters
  const fetchURL = new URL("/api/v1/items", apiClient.defaults.baseURL);

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
    getAllItemsResult: response.data.getAllItemsResult,
    totalItems: response.data.totalItems,
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
  };
};

export const getSingleItemService = async (id) => {
  const response = await apiClient.get(`/item/${id}`);
  return response.data;
};

export const updateItemService = async (id, item) => {
  const response = await apiClient.put(`/item/${id}`, item);
  return response.data;
};

export const deleteItemService = async (id) => {
  await apiClient.delete(`/item/${id}/delete`); // Updated for soft-delete if needed
};

export const restoreItemService = async (id) => {
  const response = await apiClient.put(`/item/${id}/restore`);
  return response.data;
};

export const permanentDeleteItemService = async (id) => {
  await apiClient.delete(`/item/${id}/permanent-delete`);
};
