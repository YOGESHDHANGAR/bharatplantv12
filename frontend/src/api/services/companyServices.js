import { companyResultsSignal } from "../../utils/signal/signalUtil";
import apiClient from "../apiClient";

// Service to create a new company
export const createCompanyService = async (company) => {
  const response = await apiClient.post(`/company/new`, company);
  return response.data;
};

export const getAllCompanysService = async ({ queryKey }) => {
  const [_, pageIndex, pageSize, debouncedGlobalFilter] = queryKey; // Extract pagination details from queryKey

  // Construct the URL with parameters
  const fetchURL = new URL("/api/v1/companys", apiClient.defaults.baseURL);

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
    getAllCompanysResult: response.data.getAllCompanysResult,
    totalCompanys: response.data.totalCompanys,
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
  };
};

// Service to get a single company by ID
export const getSingleCompanyService = async (id) => {
  const response = await apiClient.get(`/company/${id}`);
  return response.data;
};

// Service to update an company by ID
export const updateCompanyService = async (id, company) => {
  const response = await apiClient.put(`/company/${id}`, company);
  return response.data;
};

// Service to soft delete an company by ID
export const deleteCompanyService = async (id) => {
  await apiClient.delete(`/company/${id}/delete`); // Updated for soft-delete if needed
};

// Service to restore a soft-deleted company by ID
export const restoreCompanyService = async (id) => {
  const response = await apiClient.put(`/company/${id}/restore`);
  return response.data;
};

// Service to permanently delete an company by ID
export const permanentDeleteCompanyService = async (id) => {
  await apiClient.delete(`/company/${id}/permanent-delete`);
};
