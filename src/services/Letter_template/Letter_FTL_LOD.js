import axios from "axios";

// Base URL for API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/letter`;

export const Fetch_Letter = async (payload) => {
  try {
    const response = await axios.post(`${URL}/Fetch_Letter`, payload);
    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }
    return response.data; // Return the full response data as-is
  } catch (error) {
    console.error(
      "Error fetching letter template:",
      error.response?.data || error.message
    );
    throw error.response?.data?.message || "Failed to fetch letter template";
  }
};