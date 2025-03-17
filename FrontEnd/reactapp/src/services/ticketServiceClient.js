import axios from "axios";
import { API_URL } from "../config";

const TicketService_URL = `${API_URL}/Client/Tickets`;

export const addTicketService = {
  addTicket: async (formData, token) => {
    try {
      const response = await axios.post(`${TicketService_URL}/Add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data?.message ||
        "failed to submit ticket. Please try again."
      );
    }
  },
};

export const getClientTicketServiceAll = async (params = {}) => {
  const {
    search = "",
    sortColumn = "ServiceID",
    sortOrder = "ASC",
    page = 1,
    pageSize = 5,
  } = params;

  try {
    const response = await axios.get(`${TicketService_URL}/GetUserTickets`, {
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

export const getClientTicketServiceActive = async (params = {}) => {
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
export const getClientTicketServiceSettled = async (params = {}) => {
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

export const getClientsTicketDetails = async (ticketId) => {
  try {
    const response = await axios.get(`${TicketService_URL}/${ticketId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to Show Details " };
  }
};

export const DeleteClientTicket = async (id) => {
  try {
    const response = await axios.delete(`${TicketService_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to Delete Item" };
  }
};

export const EditClientTicket = async (id, formData) => {
  console.log("EditClientTicket", id, formData);
  try {
    // Validate formData here if necessary
    const response = await axios.post(
      `${TicketService_URL}/update/${id}`,
      formData
    );
    console.log("EditClientTicket", response.data);
    return response.data;
  } catch (error) {
    console.error("Error Editing ticket", error);
    // Provide more context in the error message
    const errorMessage =
      error.response?.data?.message || "Failed to Edit Ticket";
    throw new Error(`Error editing ticket ${id}: ${errorMessage}`);
  }
};
