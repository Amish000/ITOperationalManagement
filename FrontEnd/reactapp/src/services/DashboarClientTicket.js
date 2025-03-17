import axios from "axios";
import { API_URL } from "../config";

const ClientTicketService_URL = `${API_URL}/Client/Dashboard`;

export const GetClientTotalTicketCount = async () => {
  try {
    const response = await axios.get(
      `${ClientTicketService_URL}/GetTotalTicketCount`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Client total ticket");
    throw error;
  }
};

export const GetClientActiveTicketCount = async () => {
  try {
    const response = await axios.get(
      `${ClientTicketService_URL}/GetActiveTicketCount`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Client total ticket");
    throw error;
  }
};

export const GetClientSettledTicketCount = async () => {
  try {
    const response = await axios.get(
      `${ClientTicketService_URL}/GetSettledTicketCount`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Client total ticket");
    throw error;
  }
};
