import { companySelectedSignal } from "../../utils/signal/signalUtil";
import apiClient from "../apiClient";

export const createReceiptService = async (receipt) => {
  const { value } = companySelectedSignal.value;
  const company = value;

  const requestData = {
    ...receipt,
    company, // Add companyId to the request data
  };

  const response = await apiClient.post(`/receipt/new`, requestData);
  return response.data;
};

export const getAllReceiptsService = async ({ queryKey }) => {
  const [_, pageIndex, pageSize, dateRange, debouncedGlobalFilter] = queryKey; // Extract pagination details from queryKey

  // Construct the URL with parameters
  const fetchURL = new URL("/api/v1/receipts", apiClient.defaults.baseURL);

  // Set query parameters for pagination
  fetchURL.searchParams.set("page", `${pageIndex + 1}`); // Page index is 0-based in frontend
  fetchURL.searchParams.set("limit", `${pageSize}`);

  // Stringify the dateRange object and set it as a query parameter
  if (dateRange) {
    fetchURL.searchParams.set("dateRange", JSON.stringify(dateRange));
  }

  if (debouncedGlobalFilter) {
    fetchURL.searchParams.set("debouncedGlobalFilter", debouncedGlobalFilter);
  }

  // Make the API request
  const response = await apiClient.get(fetchURL.toString());

  // Return the paginated result
  return {
    getAllReceiptsResult: response.data.getAllReceiptsResult,
    totalReceipts: response.data.totalReceipts,
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
    vouchersTotalSum: response.data.vouchersTotalSum,
  };
};

export const getSingleReceiptService = async (id) => {
  const response = await apiClient.get(`/receipt/${id}`);
  return response.data;
};

export const updateReceiptService = async (id, receipt) => {
  const response = await apiClient.put(`/receipt/${id}`, receipt);
  return response.data;
};

export const deleteReceiptService = async (id) => {
  await apiClient.delete(`/receipt/${id}/delete`); // Updated to match route for soft delete
};

export const restoreReceiptService = async (id) => {
  const response = await apiClient.put(`/receipt/${id}/restore`);
  return response.data;
};

export const permanentDeleteReceiptService = async (id) => {
  await apiClient.delete(`/receipt/${id}/permanent-delete`);
};
