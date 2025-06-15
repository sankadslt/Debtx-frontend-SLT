import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const USER_URL = `${BASE_URL}/user`;

export const getUserDetailsById = async (user_id) => {
  try {
    const response = await axios.post(`${USER_URL}/List_All_User_Details_By_ID`, {
      user_id,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw (
      error?.response?.data || {
        status: "error",
        message: "Unable to fetch user details by ID",
      }
    );
  }
};

export const getAllUserDetails = async (requestData = {}) => {
  try {
    const response = await axios.post(`${USER_URL}/List_All_User_Details`, requestData);
    return response.data;
  } catch (error) {
    console.error("Error fetching all user details:", error);
    throw (
      error?.response?.data || {
        status: "error",
        message: "Unable to fetch all user details",
      }
    );
  }
};

export const updateUserDetails = async (requestData = {}) => {
  try {
    const response = await axios.patch(`${USER_URL}/Update_User_Details`, requestData);
    return response.data;
  } catch (error) {
    console.error("Error fetching all user details:", error);
    throw (
      error?.response?.data || {
        status: "error",
        message: "Unable to fetch all user details",
      }
    );
  }
};
