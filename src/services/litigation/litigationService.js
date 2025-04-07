/* 
    Purpose: This template is used for the Litigation Controllers.
    Created Date: 2025-04-04
    Created By: sasindu srinayaka (sasindusrinayaka@gmail.com)
    Version: Node.js v20.11.1
    Dependencies: axios , mongoose
    Related Files: Litigation_List.jsx
    Notes:  
*/


import axios from "axios";

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/litigation`;


export const listAllLitigationCases = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/List_All_Litigation_Cases`,
      payload
    );
    console.log("Litigation cases fetched successfully:", response.data);
    return response.data;

  } catch (error) {
    console.error(
      "Error withdrawing Litigation cases :",
      error.response?.data || error.message
    );
    throw error;
  }
}

export const createLitigationDocument = async (payload) => {
  try {
    const response = await axios.patch(
      `${URL}/Create_Litigation_Document`,
      payload
    );
    console.log("Litigation document created successfully:", response.data);
    return response.data;

  } catch (error) {
    console.error(
      "Error creating Litigation document:",
      error.response?.data || error.message
    );
    throw error;
  }
}