/* 
    Purpose: This template is used for the Settlement Controllers.
    Created Date: 2025-03-23
    Created By: sasindu srinayaka (sasindusrinayaka@gmail.com)
    Version: Node.js v20.11.1
    Dependencies: axios , mongoose
    Related Files: MonitorSettlement.js
    Notes:  
*/

import axios from "axios";

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/settlement`;

export const listAllSettlementCases = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/List_All_Settlement_Cases`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error withdrawing Settlement cases :",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Case_Details_Settlement_Phase = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Case_Details_Settlement_Phase`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error withdrawing Settlement cases :",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Create task for downloading Settlement list
export const Create_Task_For_Downloard_Settlement_List = async (createdBy) => {
  try {
    const response = await axios.post(`${URL}/Create_Task_For_Downloard_Settlement_List`, {
      Created_By: createdBy,
    });

    // return the response status
    return response.data.status;
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};