import axios from "axios";
import { API_URL } from "../config";

const Notification_SERVICE_URL = `${API_URL}/Admin/Notification`;

export const GetUnreadNotifications = async (params = {}) => {
  const {
    sortColumn = "CreatedAt",
    sortOrder = "DESC",
    page = 1,
    pageSize = 5,
  } = params;
  try {
    const response = await axios.get(
      `${Notification_SERVICE_URL}/GetUnreadNotifications`
    );
    // console.log(response.data);
    console.log(response.data.data.length);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed To get unread notification" }
    );
  }
};

export const GetReadNotifications = async () => {
  try {
    const response = await axios.get(
      `${Notification_SERVICE_URL}/GetReadNotifications`
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { message: "Failed to get read notifications" }
    );
  }
};

export const GetAllNotifications = async () => {
  try {
    const response = await axios.get(
      `${Notification_SERVICE_URL}/GetAllNotifications`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const MarkAsReadNotifications = async (id) => {
  try {
    const response = await axios.post(
      `${Notification_SERVICE_URL}/MarkAsRead/${id}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to mark notification" };
  }
};
