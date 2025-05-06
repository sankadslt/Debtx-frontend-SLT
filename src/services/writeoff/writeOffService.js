

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



// Create task for downloading Write Off Case list
export const Create_Task_For_Downloard_Write_Off_List = async (createdBy, Case_Status, from_date, to_date) => {
  try {
    const response = await axios.post(`${URL}/Create_Task_For_Downloard_Write_Off_List`, {
      Created_By: createdBy, 
      Case_Status: Case_Status, 
      from_date: from_date, 
      to_date: to_date,
    });

    // return the response status
    return response.data.status;
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
  

