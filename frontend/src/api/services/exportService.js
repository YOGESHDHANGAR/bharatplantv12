import apiClient from "../apiClient";

export const getDatabaseExportService = async () => {
  // Construct the URL for the API endpoint
  const fetchURL = new URL(
    "/api/v1/export/database",
    apiClient.defaults.baseURL
  );

  // Make the request with responseType set to 'blob' to handle binary data
  const response = await apiClient.get(fetchURL.toString(), {
    responseType: "blob", // Important for binary data
  });

  // Return the response data
  return response.data;
};
