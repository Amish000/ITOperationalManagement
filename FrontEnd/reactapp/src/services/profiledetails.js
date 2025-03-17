import axios from "axios";
import { API_URL } from "../config";

const Profile_Detail_URL = `${API_URL}/Client/UsersDetailUpdate`;

export const GetProfileDetail = async () => {
  try {
    const response = await axios.get(`${Profile_Detail_URL}/GetUsersData`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to get user details" };
  }
};

export const UpdatePhoneNumber = async (FormData) => {
  try {
    const response = await axios.put(
      `${Profile_Detail_URL}/UpdatePhoneNumber`,
      FormData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update phone number" };
  }
};

export const UpdateUserName = async (FormData) => {
  try {
    const response = await axios.put(
      `${Profile_Detail_URL}/UpdateUserName`,
      FormData
    );
    return response.data;
  } catch (error) {
    //console.log(error.response.data.message);
    throw (
      error.response.data.message || { message: "Failed updating Username" }
    );
  }
};

export const ChangePassword = async (FormData) => {
  try {
    const response = await axios.post(
      `${Profile_Detail_URL}/ChangePassword`,
      FormData
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to change password" };
  }
};
