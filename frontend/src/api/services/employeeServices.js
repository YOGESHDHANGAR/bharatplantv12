import { companySelectedSignal } from "../../utils/signal/signalUtil";
import apiClient from "../apiClient";

// Service to create a new employee
export const createEmployeeService = async (employee) => {
  const { value } = companySelectedSignal.value;
  const company = value;

  const requestData = {
    ...employee,
    company, // Add companyId to the request data
  };
  const response = await apiClient.post(`/employee/new`, requestData);
  return response.data;
};

export const getAllEmployeesService = async ({ queryKey }) => {
  const [_, pageIndex, pageSize, debouncedGlobalFilter] = queryKey; // Extract pagination details from queryKey

  // Construct the URL with parameters
  const fetchURL = new URL("/api/v1/employees", apiClient.defaults.baseURL);

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
    getAllEmployeesResult: response.data.getAllEmployeesResult,
    totalEmployees: response.data.totalEmployees,
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
  };
};
// Service to get a single employee by ID
export const getSingleEmployeeService = async (id) => {
  const response = await apiClient.get(`/employee/${id}`);
  return response.data;
};

// Service to update an employee by ID
export const updateEmployeeService = async (id, employee) => {
  const response = await apiClient.put(`/employee/${id}`, employee);
  return response.data;
};

// Service to soft delete an employee by ID
export const deleteEmployeeService = async (id) => {
  await apiClient.delete(`/employee/${id}/delete`); // Updated for soft-delete if needed
};

// Service to restore a soft-deleted employee by ID
export const restoreEmployeeService = async (id) => {
  const response = await apiClient.put(`/employee/${id}/restore`);
  return response.data;
};

// Service to permanently delete an employee by ID
export const permanentDeleteEmployeeService = async (id) => {
  await apiClient.delete(`/employee/${id}/permanent-delete`);
};
