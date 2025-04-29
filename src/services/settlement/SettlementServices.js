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
      `${URL}listAllSettlementCases`,
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
export const Create_Task_For_Downloard_Settlement_List = async (createdBy, Phase, Case_Status, from_date, to_date, Case_ID, Account_Number) => {
  try {
    const response = await axios.post(`${URL}/Create_Task_For_Downloard_Settlement_List`, {
      Created_By: createdBy, 
      Phase: Phase, 
      Case_Status: Case_Status, 
      from_date: from_date, 
      to_date: to_date, 
      Case_ID: Case_ID, 
      Account_Number: Account_Number
    });

    // return the response status
    return response.data.status;
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Fetching case details and settlement details for customer responce review page
export const Case_Details_Settlement_LOD_FTL_LOD_Ext_01 = async (case_id) => {
  try {
    const response = await axios.post(`${BASE_URL}/settlement/Case_Details_Settlement_LOD_FTL_LOD_Ext_01`, {
      case_id: case_id,
    });

    // return relevant values 
    return {
      case_id: response.data.case_id,
      customer_ref: response.data.customer_ref,
      account_no: response.data.account_no,
      arrears_amount: response.data.current_arrears_amount || null,
      last_payment_date: response.data.last_payment_date || null,
      lod_response: response.data.lod_response?.lod_response || null,
      settlement_plans: response.data.settlement_plans || null,
      payment_details: response.data.payment_details || null,
      current_document_type: response.data.lod_response?.current_document_type || null,
    };
  } catch (error) {
    console.error("Error fetching case details:", error);
    throw error.response?.data?.message || "Failed to fetch case details";
  }
};