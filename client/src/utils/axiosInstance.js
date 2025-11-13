import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // ✅ Backend ka base URL
  withCredentials: true, // ✅ Cookies ko send karne ke liye zaroori hai
});

// 🏷️ Function to get access token from local storage
const getAccessToken = () => {
  const token = localStorage.getItem("accessToken");
  console.log("📢 Access Token:", token);
  return token || null;
};

// ✅ Request Interceptor: Attach Access Token
API.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ Token ko headers me attach karo
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor: Handle Expired Token & Refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ Token Expired (403) -> Refresh Attempt Karo
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log("🔄 Refreshing Token...");
        const { data } = await axios.post(
          "/api/auth/refresh", // ✅ Base URL automatically attach ho jayega
          {},
          { withCredentials: true }
        );

        // ✅ New Token ko local storage me save karo
        localStorage.setItem("accessToken", data.accessToken);

        // ✅ Authorization Header ko update karo
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        console.log("✅ Token refreshed:", data.accessToken);

        return API(originalRequest); // ✅ Original request ko retry karo
      } catch (refreshError) {
        console.error("❌ Refresh Token Failed. Logging out.");
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // ✅ Redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default API;
