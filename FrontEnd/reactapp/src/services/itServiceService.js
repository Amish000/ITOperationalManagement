import axios from "axios";
import { API_URL } from "../config";

const IT_SERVICE_URL = `${API_URL}/Admin/ItService`;

export const getServices = async (params = {}) => {
  const {
    search = "",
    sortColumn = "ServiceID",
    sortOrder = "ASC",
    page = 1,
    pageSize = 5,
  } = params;

  try {
    const response = await axios.get(`${IT_SERVICE_URL}/Index`, {
      params: {
        search,
        sortColumn,
        sortOrder,
        page,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch services" };
  }
};

export const getActiveServices = async (params = {}) => {
  const {
    search = "",
    sortColumn = "ServiceID",
    sortOrder = "ASC",
    page = 1,
    pageSize = 5,
  } = params;

  try {
    const response = await axios.get(`${IT_SERVICE_URL}/GetActiveServices`, {
      params: {
        search,
        sortColumn,
        sortOrder,
        page,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch services" };
  }
};

export const getExpiredServices = async (params = {}) => {
  const {
    search = "",
    sortColumn = "ServiceID",
    sortOrder = "ASC",
    page = 1,
    pageSize = 5,
  } = params;

  try {
    const response = await axios.get(`${IT_SERVICE_URL}/GetExpiredServices`, {
      params: {
        search,
        sortColumn,
        sortOrder,
        page,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch services" };
  }
};

export const deleteServices = async (id) => {
  try {
    const response = await axios.delete(`${IT_SERVICE_URL}/${id}`);
    console.log("Id in itserviceSErvice", id);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to delete service" };
  }
};

export const addService = async (FormData, token) => {
  console.log(FormData);
  try {
    const response = await axios.post(`${IT_SERVICE_URL}/Create`, FormData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding service:", error);
    throw (
      error.response?.data?.message ||
      "Failed to submit Service. Please try again."
    );
  }
};

export const editService = async (id, FormData, token) => {
  try {
    const response = await axios.post(
      `${IT_SERVICE_URL}/Update/${id}`,
      FormData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error editing service:", error);
    throw (
      error.response?.data?.message ||
      "Failed to Edit Service. Please try again."
    );
  }
};

export const getServicebyId = async (id) => {
  try {
    const response = await axios.get(`${IT_SERVICE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting service by id:", error);
    throw error.response?.data?.message || "failed to get service by id";
  }
};

export const UpdateExpiryDate = async (id, FormData, Token) => {
  try {
    const response = await axios.post(
      `${IT_SERVICE_URL}/UpdateExpiryDate/${id}`,
      FormData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating expiry date:", error);
    throw (
      error.response?.data?.message ||
      "Failed to update expiry date. Please try again."
    );
  }
};
