import axios from "axios";

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/case`;

export const ListRequestLogFromRecoveryOfficers = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/ListRequestLogFromRecoveryOfficers`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating task for case distribution:",
      error.response?.data || error.message
    );
    throw error;
  }
};
