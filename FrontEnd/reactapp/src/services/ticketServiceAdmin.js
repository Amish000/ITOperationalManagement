import axios from "axios";
import { API_URL } from "../config";

const TicketService_URL = `${API_URL}/admin/Tickets`;

//api/admin/Tickets/ActiveTicket
export const TicketServicesActive = async (params = {}) => {
  const {
    search = "",
    sortColumn = "ServiceID",
    sortOrder = "ASC",
    page = 1,
    pageSize = 5,
  } = params;

  try {
    const response = await axios.get(`${TicketService_URL}/ActiveTicket`, {
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

//api/admin/Tickets/SettledTickets
export const TicketServicesSettled = async (params = {}) => {
  const {
    search = "",
    sortColumn = "ServiceID",
    sortOrder = "ASC",
    page = 1,
    pageSize = 5,
  } = params;

  try {
    const response = await axios.get(`${TicketService_URL}/SettledTickets`, {
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

//api/admin/Tickets/Index
export const TicketServicesAll = async (params = {}) => {
  const {
    search = "",
    sortColumn = "ServiceID",
    sortOrder = "ASC",
    page = 1,
    pageSize = 5,
  } = params;

  try {
    const response = await axios.get(`${TicketService_URL}/Index`, {
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

//api/admin/Tickets/{id} (DELETE)
export const DeleteTicket = async (id) => {
  try {
    const response = await axios.delete(`${TicketService_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to Delete Item" };
  }
};

//api/admin/Tickets/{id} (DETAIL)
export const GetTicketDetails = async (id) => {
  try {
    const response = await axios.get(`${TicketService_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to Show Details " };
  }
};

export const UpdateTicketStatus = async (id, status) => {
  console.log(id, status);
  if (!id) {
    throw new Error("Ticket ID is required");
  }
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authorization token is required");
    }
    const response = await axios.post(
      `${TicketService_URL}/UpdateTicketStatus/${id}`,
      status,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating ticket status:", error);
    throw error.response?.data || { message: "Failed to post Details" };
  }
};
