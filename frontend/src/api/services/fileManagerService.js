import apiClient from "../apiClient";

export const uploadFilesService = async (formData) => {
  const response = await apiClient.post(`/fileSystem/new`, formData);
  return response.data;
};

export const getAllFilesService = async () => {
  const response = await apiClient.get(`/fileSystem/all`);
  return response.data.items;
};

export const deleteFilesService = async (fileId) => {
  await apiClient.delete(`/fileSystem/${fileId}`);
};
