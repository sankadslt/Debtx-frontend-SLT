import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/commission`;



export const List_All_Commission_Cases = async (filters) => {
    try {
      const response = await axios.post(
        `${URL}/List_All_Commission_Cases`,
        filters
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching All commission cases:",
        error.response?.data || error.message
      );
      throw error.response?.data || error;
    }
  };