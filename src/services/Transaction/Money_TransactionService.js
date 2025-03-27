import axios from "axios";

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/money`;



export const List_All_Payment_Cases = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/List_All_Payment_Cases`, 
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching payment cases:", 
      error.response?.data || error.message
    );
    throw error;
  }
};