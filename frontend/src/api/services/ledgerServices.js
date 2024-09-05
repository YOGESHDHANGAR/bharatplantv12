import { companySelectedSignal } from "../../utils/signal/signalUtil";
import apiClient from "../apiClient";

export const createLedgerService = async (ledger) => {
  const { value } = companySelectedSignal.value;
  const company = value;

  const requestData = {
    ...ledger,
    company, // Add companyId to the request data
  };
  const response = await apiClient.post(`/ledger/new`, requestData);
  return response.data;
};

export const getAllLedgersService = async ({ queryKey }) => {
  const [_, pageIndex, pageSize, debouncedGlobalFilter] = queryKey; // Extract pagination details from queryKey

  // Construct the URL with parameters
  const fetchURL = new URL("/api/v1/ledgers", apiClient.defaults.baseURL);

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
    getAllLedgersResult: response.data.getAllLedgersResult,
    totalLedgers: response.data.totalLedgers,
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
  };
};

export const getSingleLedgerService = async (id) => {
  const response = await apiClient.get(`/ledger/${id}`);
  return response.data;
};

export const updateLedgerService = async (id, ledger) => {
  const response = await apiClient.put(`/ledger/${id}`, ledger);
  return response.data;
};

export const deleteLedgerService = async (id) => {
  await apiClient.delete(`/ledger/${id}/delete`); // Updated for soft-delete
};

export const restoreLedgerService = async (id) => {
  const response = await apiClient.put(`/ledger/${id}/restore`);
  return response.data;
};

export const permanentDeleteLedgerService = async (id) => {
  await apiClient.delete(`/ledger/${id}/permanent-delete`);
};
