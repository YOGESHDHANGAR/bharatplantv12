import { companySelectedSignal } from "../../utils/signal/signalUtil";
import apiClient from "../apiClient";

export const createPurchaseService = async (purchase) => {
  const { value } = companySelectedSignal.value;
  const company = value;

  const requestData = {
    ...purchase,
    company, // Add companyId to the request data
  };
  const response = await apiClient.post(`/purchase/new`, requestData);
  return response.data;
};

export const getAllPurchaseService = async ({ queryKey }) => {
  const [_, pageIndex, pageSize, dateRange, debouncedGlobalFilter] = queryKey; // Extract pagination details from queryKey

  // Construct the URL with parameters
  const fetchURL = new URL("/api/v1/purchases", apiClient.defaults.baseURL);

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
    getAllPurchaseResult: response.data.getAllPurchaseResult,
    totalPurchase: response.data.totalPurchase,
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
    vouchersTotalSum: response.data.vouchersTotalSum,
  };
};

export const getSinglePurchaseService = async (id) => {
  const response = await apiClient.get(`/purchase/${id}`);
  return response.data;
};

export const updatePurchaseService = async (id, purchase) => {
  const response = await apiClient.put(`/purchase/${id}`, purchase);
  return response.data;
};

export const deletePurchaseService = async (id) => {
  await apiClient.delete(`/purchase/${id}/delete`); // Updated to match route for soft delete
};

export const restorePurchaseService = async (id) => {
  const response = await apiClient.put(`/purchase/${id}/restore`);
  return response.data;
};

export const permanentDeletePurchaseService = async (id) => {
  await apiClient.delete(`/purchase/${id}/permanent-delete`);
};
