
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


export const fetchAbandonedCases = async (payload) => {
  try {
 

    const response = await axios.post(`${URL}/List_All_Abandoned_Case_Logs`, {   
      ...payload,
       
    });

    console.log("API Response:", response);  

    if (!response.data || response.data.status === "error") {
      throw new Error(response.data?.message || "Failed to fetch Abandoned cases.");
    }
 
    return response.data;
  } catch (error) {
    console.error("Error fetching Abandoned cases:", error);
    throw new Error(error.response?.data?.message || error.message || "Unknown error occurred");
  }
};
  
  export const Task_for_Download_Abandoned = async (
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
      `${URL}/Task_for_Download_Abandoned`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error creating download task:", error);
    throw error;
  }
};


 


export const updateAbandonedCaseRemark = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Create_Abandoned_case`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error submitting Abandoned cases ",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const listAllCaseClosedLog = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/List_All_Case_Closed_Log`,
      payload
    );
    return response;
  } catch (error) {
    console.error(
      "Error withdrawing Settlement cases :",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const Create_Task_For_Downloard_Case_Closed_List = async (createdBy, Phase, Case_Status, from_date, to_date, Case_ID, Account_Number) => {
  try {
    const response = await axios.post(`${URL}/Create_Task_For_Downloard_Case_Closed_List`, {
      Created_By: createdBy,
      Phase: Phase,
      Case_Status: Case_Status,
      from_date: from_date,
      to_date: to_date,
      Case_ID: Case_ID,
      Account_Number: Account_Number
    });

   
    return response;
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
