import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Fetch chart data
export const fetchChartData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/chart-data`);
    return response.data;
  } catch (error) {
    console.error("Error fetching chart data:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
