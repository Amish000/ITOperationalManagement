import { API_URL } from "../config";
import axios from "axios";

const ManageUserService_URL = `${API_URL}/Admin/Account`;

export const GetAllUsers = async (pagination, search) => {
  console.log(pagination, search);
  try {
    const response = await axios.get(`${ManageUserService_URL}/GetUsers`, {
      params: {
        search: search.length > 0 ? search : " ",
        page: pagination.page,
        pageSize: pagination.pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error("ManageUserService: ", error);
    throw error;
  }
};

export const ChangeUserStatus = async (id, changeAction) => {
  try {
    const response = await axios.post(
      `${ManageUserService_URL}/UserEnableDisable`,
      {
        userId: id,
        action: changeAction,
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("ChangeUser: ", error);
    throw error;
  }
};

export const UpdateUserData = async (userData) => {
  try {
    const response = await axios.put(
      `${ManageUserService_URL}/UpdateUser`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const DeleteUserByID = async (id) => {
  try {
    console.log(id);
    const response = await axios.delete(
      `${ManageUserService_URL}/DeleteUserByID`,
      {
        data: `"${id}"`,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("DeleteUserByID: ", error);
    throw error;
  }
};

export const ChangeUserPassword = async (id, password) => {
  console.log(id, password);
  try {
    const response = await axios.post(
      `${ManageUserService_URL}/ChangeUSerPassword`,
      {
        userId: id,
        newPassword: password,
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("ChangePassword: ", error);
    throw error;
  }
};
