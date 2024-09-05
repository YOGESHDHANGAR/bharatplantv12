import { companySelectedSignal } from "../../utils/signal/signalUtil";
import apiClient from "../apiClient";

// Service to upload a new bank statement file
export const uploadBankStatementFileService = async (file) => {
  const formData = new FormData();
  formData.append("file", file); // Ensure the key "file" matches your backend route

  const response = await apiClient.post(`/bankStatement/uploadFile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("response", response.data.uploadBankStatementFileResult);

  return response.data;
};

// Service to create a new bank statement
export const createBankStatementService = async (bankStatementRecord) => {
  // Assuming companySelectedSignal.value holds the selected company ID
  const { value } = companySelectedSignal.value;
  const company = value;

  // Include companyId in the bankStatementRecord
  const requestData = {
    ...bankStatementRecord,
    company, // Add companyId to the request data
  };

  // Send the request with the updated data
  const response = await apiClient.post(
    `/bankStatement/newRecord`,
    requestData
  );
  return response.data;
};

export const getAllBankStatementsService = async ({ queryKey }) => {
  const [_, pageIndex, pageSize, dateRange, debouncedGlobalFilter] = queryKey; // Extract pagination details from queryKey

  // Construct the URL with parameters
  const fetchURL = new URL(
    "/api/v1/bankStatement/allRecords",
    apiClient.defaults.baseURL
  );

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
    getAllBankStatementsResult: response.data.getAllBankStatementsResult,
    totalBankStatements: response.data.totalBankStatements,
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
  };
};

// Service to update an bankStatement by ID
export const updateBankStatementService = async (id, bankStatement) => {
  const response = await apiClient.put(
    `/bankStatement/${id}/update`,
    bankStatement
  );
  return response.data;
};

// Service to soft delete an bankStatement by ID
export const deleteBankStatementService = async (id) => {
  await apiClient.delete(`/bankStatement/${id}/delete`); // Updated for soft-delete if needed
};

// Service to restore a soft-deleted bankStatement by ID
export const restoreBankStatementService = async (id) => {
  const response = await apiClient.put(`/bankStatement/${id}/restore`);
  return response.data;
};

// Service to permanently delete an bankStatement by ID
export const permanentDeleteBankStatementService = async (id) => {
  await apiClient.delete(`/bankStatement/${id}/permanentDelete`);
};
