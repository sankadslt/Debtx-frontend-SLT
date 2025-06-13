import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/recovery_officer`;

export const List_All_RO_and_DRCuser_Details_to_SLT  = async (payload) => {
  try {
    const response = await axios.post(`${URL}/List_All_RO_and_DRCuser_Details_to_SLT`, payload);

    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    return response.data; 
  } catch (error) {
    console.error("Error retrieving /List_All_RO_and_DRCuser_Details_to_SLT:", error.response?.data || error.message);
    throw error;
  }
};