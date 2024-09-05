import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5894/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token or other custom logic here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default apiClient;
