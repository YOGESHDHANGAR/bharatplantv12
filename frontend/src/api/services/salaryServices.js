import { companySelectedSignal } from "../../utils/signal/signalUtil";
import apiClient from "../apiClient";

export const createSalaryService = async (formData) => {
  const { value } = companySelectedSignal.value;
  const company = value;

  const requestData = {
    ...formData,
    company, // Add companyId to the request data
  };
  const response = await apiClient.post(`/salary/new`, requestData);
  return response.data;
};

export const getAllSalarysService = async ({ queryKey }) => {
  // Construct the URL with parameters
  const fetchURL = new URL("/api/v1/salarys", apiClient.defaults.baseURL);

  // Make the API request
  const response = await apiClient.get(fetchURL.toString());

  // Return the paginated result
  return {
    getAllSalarysResult: response.data.getAllSalarysResult,
    totalSalarys: response.data.totalSalarys,
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
  };
};

export const getSingleSalaryService = async (id) => {
  const response = await apiClient.get(`/salary/${id}`);
  return response.data;
};

export const updateSalaryService = async (id, salary) => {
  const response = await apiClient.put(`/salary/${id}`, salary);
  return response.data;
};

export const deleteSalaryService = async (id) => {
  await apiClient.delete(`/salary/${id}/delete`); // Updated for soft-delete if needed
};

export const restoreSalaryService = async (id) => {
  const response = await apiClient.put(`/salary/${id}/restore`);
  return response.data;
};

export const permanentDeleteSalaryService = async (id) => {
  await apiClient.delete(`/salary/${id}/permanent-delete`);
};
