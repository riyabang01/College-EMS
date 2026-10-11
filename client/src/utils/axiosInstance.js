import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || window.location.origin,
  withCredentials: true, 
});

const getAccessToken = () => {
  return localStorage.getItem("accessToken") || null;
};

API.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshBaseURL = process.env.REACT_APP_API_URL || window.location.origin;
        const { data } = await axios.post(
          `${refreshBaseURL}/api/auth/refresh`, 
          {},
          { withCredentials: true }
        );

        localStorage.setItem("accessToken", data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return axios(originalRequest); 
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default API;
