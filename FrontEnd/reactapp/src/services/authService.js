import axios from "axios";
import { API_URL } from "../config";

const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_URL}/Admin/Account/Login`,
      credentials
    );
    if (response.data.success && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

const register = async (userData) => {
  try {
    console.log("User Data:", userData);
    const response = await axios.post(
      `${API_URL}/Admin/Account/Register`,
      userData
    );
    if (response.data.success && response.data.data.token) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

const refreshToken = async () => {
  try {
    const currentRefreshToken = localStorage.getItem("refreshToken");
    if (!currentRefreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${API_URL}/Admin/Account/RefreshToken`,
      JSON.stringify(currentRefreshToken),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
      return response.data.data.token;
    }
    throw new Error("Failed to refresh token");
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    throw error.response?.data || error.message;
  }
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

// Add token to all requests and handle token refresh
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const newToken = await refreshToken();

        // Update the failed request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Retry the original request
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh token fails, redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const authService = {
  login,
  register,
  logout,
  refreshToken,
};

export default authService;
