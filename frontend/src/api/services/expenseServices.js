import { companySelectedSignal } from "../../utils/signal/signalUtil";
import apiClient from "../apiClient";

export const createExpenseService = async (expense) => {
  const { value } = companySelectedSignal.value;
  const company = value;

  const requestData = {
    ...expense,
    company, // Add companyId to the request data
  };
  const response = await apiClient.post(`/expense/new`, requestData);
  return response.data;
};

export const getAllExpensesService = async ({ queryKey }) => {
  const [_, pageIndex, pageSize, debouncedGlobalFilter] = queryKey; // Extract pagination details from queryKey

  // Construct the URL with parameters
  const fetchURL = new URL("/api/v1/expenses", apiClient.defaults.baseURL);

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
    getAllExpensesResult: response.data.getAllExpensesResult,
    totalExpenses: response.data.totalExpenses,
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
  };
};

export const getSingleExpenseService = async (id) => {
  const response = await apiClient.get(`/expense/${id}`);
  return response.data;
};

export const updateExpenseService = async (id, expense) => {
  const response = await apiClient.put(`/expense/${id}`, expense);
  return response.data;
};

export const deleteExpenseService = async (id) => {
  await apiClient.delete(`/expense/${id}/delete`); // Updated for soft-delete if needed
};

export const restoreExpenseService = async (id) => {
  const response = await apiClient.put(`/expense/${id}/restore`);
  return response.data;
};

export const permanentDeleteExpenseService = async (id) => {
  await apiClient.delete(`/expense/${id}/permanent-delete`);
};
