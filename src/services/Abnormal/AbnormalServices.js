
import axios from "axios";

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/abnormal`;
 
export const fetchWithdrawalCases = async (payload) => {
  try {
 

    const response = await axios.post(`${URL}/List_All_Withdrawal_Case_Logs`, {   
      ...payload,
       
    });

    console.log("API Response:", response);  

    if (!response.data || response.data.status === "error") {
      throw new Error(response.data?.message || "Failed to fetch withdrawal cases.");
    }
 
    return response.data;
  } catch (error) {
    console.error("Error fetching withdrawal cases:", error);
    throw new Error(error.response?.data?.message || error.message || "Unknown error occurred");
  }
};
  
  export const Task_for_Download_Withdrawals = async (
  status,
  accountNumber,
  fromDate,
  toDate,
  Created_by
) => {
  try {
    const payload = {
      status,
      accountNumber,
      fromDate,
      toDate,
      Created_by:Created_by
    };

 console.log("Payload for download task:", payload);  
    const response = await axios.post(
      `${URL}/Task_for_Download_Withdrawals`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating download task:", error);
    throw error;
  }
};




export const updateWithdrawCaseRemark = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Create_Withdraw_case`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error withdrawing cases ",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const fetchAbondonedCases = async (payload) => {
  try {
 

    const response = await axios.post(`${URL}/List_All_Abondoned_Case_Logs`, {   
      ...payload,
       
    });

    console.log("API Response:", response);  

    if (!response.data || response.data.status === "error") {
      throw new Error(response.data?.message || "Failed to fetch Abondoned cases.");
    }
 
    return response.data;
  } catch (error) {
    console.error("Error fetching Abondoned cases:", error);
    throw new Error(error.response?.data?.message || error.message || "Unknown error occurred");
  }
};
  
  export const Task_for_Download_Abondoned = async (
  status,
  accountNumber,
  fromDate,
  toDate,
  Created_by
) => {
  try {
    const payload = {
      status,
      accountNumber,
      fromDate,
      toDate,
      Created_by:Created_by
    };

 console.log("Payload for download task:", payload);  
    const response = await axios.post(
      `${URL}/Task_for_Download_Abondoned`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating download task:", error);
    throw error;
  }
};


 


export const updateAbondonedCaseRemark = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Create_Abondoned_case`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error submitting Abondoned cases ",
      error.response?.data || error.message
    );
    throw error;
  }
};
