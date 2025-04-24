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

// export const listLitigationPhaseCaseDetails = async (case_id) => {
//   try {
//     const response = await axios.post(`${URL}//List_Litigation_Phase_Case_Details_By_Case_ID`, { case_id });
//     console.log("Litigation Phase Case Details Retrieved Successfully.");  
//     return response.data;

//   } catch (error) {
//     console.error("Error Retrieveing Litigation Phase Case Details", error.message);
//     return {
//       success: false,
//       error: error.response?.data?.errors || {},
//       message: error.response?.data?.message || error.message,
//     };
//   }
// };

export const listLitigationPhaseCaseDetails = async (case_id) => {
  try {
    const response = await axios.post(`${URL}/List_Litigation_Phase_Case_Details_By_Case_ID`, { case_id });

    if (response.data.status === "success") {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } else {
      return {
        success: false,
        error: response.data.errors || {},
        message: response.data.message || "Unknown error occurred.",
      };
    }
  } catch (error) {
    console.error("Axios error:", error);
    return {
      success: false,
      error: error.response?.data?.errors || {},
      message: error.response?.data?.message || error.message,
    };
  }
};

export const updateLegalSubmission = async (payload) => {
  try {
    const response = await axios.patch(
      `${URL}/Create_Legal_Submission`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;

  } catch (error) {
    console.error("Error updating legal submission:", error);

    const errorMessage = error?.response?.data?.message || "Something went wrong.";
    const errorDetails = error?.response?.data?.errors || {};

    return {
      status: "error",
      message: errorMessage,
      errors: errorDetails,
    };
  }
};
