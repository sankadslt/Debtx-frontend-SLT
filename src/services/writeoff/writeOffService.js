

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/write_off`;

export const List_All_Write_off_Cases = async (payload) => {
    try {
      const response = await axios.post(
        `${URL}/List_All_Write_off_Cases`, 
        payload
    );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching write off cases:", 
        error.response?.data || error.message
      );
      throw error;
    }
};
  

