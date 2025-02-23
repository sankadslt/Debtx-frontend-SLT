import axios from "axios";
import { jwtDecode } from "jwt-decode";
 
const BASE_URL = import.meta.env.VITE_BASE_URL ; // Base URL from environment variables
const AUTH_URL = `${BASE_URL}/auth`; // Auth endpoint

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Login a user
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${AUTH_URL}/login`, userData, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Refresh access token
export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${AUTH_URL}/refresh-token`, {}, { withCredentials: true });
    const { accessToken } = response.data;

    // console.log("New Access Token:", accessToken);
    localStorage.setItem("accessToken", accessToken);

    return accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Logout a user
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${AUTH_URL}/logout`, {}, { withCredentials: true });
    // console.log(response.data.message);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    return response.data;
  } catch (error) {
    console.error("Error logging out:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Get logged-in user ID from token
export const getLoggedUserId = async () => {
  let token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    let decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      token = await refreshAccessToken();
      if (!token) return null;
      decoded = jwtDecode(token);
    }

    return decoded.user_id; // Return user ID from token
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

// Fetch user data using stored access token
export const getUserData = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No access token found");

    const response = await axios.get(`${AUTH_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

