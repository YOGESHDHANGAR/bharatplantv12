import { companySelectedSignal } from "../../utils/signal/signalUtil";
import apiClient from "../apiClient";

// Service to create a new sale
export const createSaleService = async (sale) => {
  // Assuming companySelectedSignal.value holds the selected company ID
  const { value } = companySelectedSignal.value;
  const company = value;

  // Include companyId in the sale object
  const requestData = {
    ...sale,
    company, // Add companyId to the request data
  };

  // Send the request with the updated data
  const response = await apiClient.post(`/sale/new`, requestData);
  return response.data;
};

export const getAllSalesService = async ({ queryKey }) => {
  const [_, pageIndex, pageSize, dateRange, debouncedGlobalFilter] = queryKey; // Include debouncedGlobalFilter from queryKey

  // Construct the URL with parameters
  const fetchURL = new URL("/api/v1/sales", apiClient.defaults.baseURL);

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
    getAllSalesResult: response.data.getAllSalesResult,
    totalSales: response.data.totalSales,
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
    vouchersTotalSum: response.data.vouchersTotalSum,
  };
};

export const getSingleSaleService = async (id) => {
  const response = await apiClient.get(`/sale/${id}`);
  return response.data;
};

export const updateSaleService = async (id, sale) => {
  const response = await apiClient.put(`/sale/${id}`, sale);
  return response.data;
};

export const deleteSaleService = async (id) => {
  await apiClient.delete(`/sale/${id}/delete`); // Updated to match route for soft delete
};

export const restoreSaleService = async (id) => {
  const response = await apiClient.put(`/sale/${id}/restore`);
  return response.data;
};

export const permanentDeleteSaleService = async (id) => {
  await apiClient.delete(`/sale/${id}/permanent-delete`);
};
