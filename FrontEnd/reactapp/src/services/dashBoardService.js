import axios from "axios";
import { API_URL } from "../config";

const TicketService_URL = `${API_URL}/admin/DashBoard`;

export const GetUserCount = async () => {
  try {
    const response = await axios.get(`${TicketService_URL}/GetUserCount`);
    return response.data;
  } catch (error) {
    console.error("Error fetching UserCount: ", error);
    throw error;
  }
};

export const GetTicketCount = async () => {
  try {
    const response = await axios.get(`${TicketService_URL}/GetTicketsCount`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Ticket count: ", error);
    throw error;
  }
};

export const GetUserName = async () => {
  try {
    const response = await axios.get(
      `${TicketService_URL}/GetLoggedInUserName`
    );
    return response.data;
  } catch (error) {
    console.error("Error Fetching User Name: ", error);
    throw error;
  }
};

export const GetExpiredServices = async () => {
  try {
    const response = await axios.get(`${TicketService_URL}/GetExpiredServices`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Expired Services: ", error);
    throw error;
  }
};
