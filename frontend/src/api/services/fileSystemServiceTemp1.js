import apiClient from "../apiClient";

// Service to upload files
export const uploadFilesService = async (formData) => {
  const response = await apiClient.post(`/fileSystem/new`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Ensure the correct header is set for file uploads
    },
  });
  return response.data;
};

// Service to get all files
export const getAllFilesService = async () => {
  const response = await apiClient.get(`/fileSystem/all`);
  return response.data.items; // Adjusted to match the response structure
};

// Service to delete a file by ID
export const deleteFilesService = async (fileId) => {
  await apiClient.delete(`/fileSystem/${fileId}`);
};

// Optional: Service to get a single file by ID
export const getSingleFileService = async (fileId) => {
  const response = await apiClient.get(`/fileSystem/${fileId}`);
  return response.data;
};
