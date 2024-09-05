import { companySelectedSignal } from "../../utils/signal/signalUtil";
import apiClient from "../apiClient";

export const createPaymentService = async (payment) => {
  const { value } = companySelectedSignal.value;
  const company = value;

  const requestData = {
    ...payment,
    company, // Add companyId to the request data
  };
  const response = await apiClient.post(`/payment/new`, requestData);
  return response.data;
};

export const getAllPaymentsService = async ({ queryKey }) => {
  const [_, pageIndex, pageSize, dateRange, debouncedGlobalFilter] = queryKey; // Extract pagination details from queryKey

  // Construct the URL with parameters
  const fetchURL = new URL("/api/v1/payments", apiClient.defaults.baseURL);

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
    getAllPaymentsResult: response.data.getAllPaymentsResult,
    totalPayments: response.data.totalPayments,
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
    vouchersTotalSum: response.data.vouchersTotalSum,
  };
};
export const getSinglePaymentService = async (id) => {
  const response = await apiClient.get(`/payment/${id}`);
  return response.data;
};

export const updatePaymentService = async (id, payment) => {
  const response = await apiClient.put(`/payment/${id}`, payment);
  return response.data;
};

export const deletePaymentService = async (id) => {
  await apiClient.delete(`/payment/${id}/delete`); // Updated to match route for soft delete
};

export const restorePaymentService = async (id) => {
  const response = await apiClient.put(`/payment/${id}/restore`);
  return response.data;
};

export const permanentDeletePaymentService = async (id) => {
  await apiClient.delete(`/payment/${id}/permanent-delete`);
};
