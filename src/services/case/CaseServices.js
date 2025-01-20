import axios from "axios";

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/case`;

// get_count_by_drc_commision_rule  
export const get_count_by_drc_commision_rule = async () => {
    try {
      const response = await axios.get(`${URL}/get_count_by_drc_commision_rule`);
      return response.data;
    } catch (error) {
      console.error("Error fetching case count by DRC commission rule:", error.response?.data || error.message);
      throw error;
    }
  };

