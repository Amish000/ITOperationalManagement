import axios from "axios";
import { API_URL } from "../config";

const LOG_TICKET_URL = `${API_URL}/Admin/LogTicket`;

export const getLogTickets = async (id, params) => {
  const {
    search = "", // Renamed from 'search' to match API
    sortColumn = "TicketID",
    sortOrder = "ASC",
    page = 1,
    pageSize = 5,
  } = params;

  try {
    const response = await axios.get(`${LOG_TICKET_URL}/${id}`, {
      params: {
        searchKeyword: search, // Renamed from 'search'
        sortColumn,
        sortOrder,
        page,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch tickets" };
  }
};
