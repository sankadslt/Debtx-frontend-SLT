import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL; 
const URL = `${BASE_URL}/incident`;

export const List_incidents_Direct_LOD = async () => {
    try {
      const response = await axios.post(`${URL}/List_incidents_Direct_LOD`);
      return response.data; 
    } catch (error) {
      console.error("Error fetching Direct LOD incidents:", error.response?.data || error.message);
      throw error.response?.data || error; 
    }
 };