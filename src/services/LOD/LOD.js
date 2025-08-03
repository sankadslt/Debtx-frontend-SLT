/*Purpose:
Created Date: 2025-04-03
Created By: Janani Kumarasiri (jkktg001@gmail.com)
Last Modified Date: 
Modified By: 
Last Modified Date: 
Modified By: 
Version: React v18
ui number : 3.3
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL; // Ensure the base URL is correctly set
const LOD_URL = `${BASE_URL}/lod`;

// Function to fetch the LOD, Final Reminder and total count
export const F2_selection_cases_count = async () => {
  try {
    const response = await axios.get(`${LOD_URL}/F2_selection_cases_count`);

    // Assign the relevant values
    const lodCount =
      response.data?.data?.cases?.find((item) => item.document_type === "LOD")
        ?.count || 0;
    const finalReminderCount =
      response.data?.data?.cases?.find(
        (item) => item.document_type === "Final Reminder"
      )?.count || 0;
    const totalCount = lodCount + finalReminderCount;

    // Return the assigned values
    return {
      totalCount,
      lodCount,
      finalReminderCount,
    };
  } catch (error) {
    console.error(
      "Error fetching case counts:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

// Function to fetch the list of F2 selection cases
export const List_F2_Selection_Cases = async (
  current_document_type,
  pages = 1
) => {
  try {
    const response = await axios.post(`${LOD_URL}/List_F2_Selection_Cases`, {
      current_document_type: current_document_type,
      pages: pages,
    });

    // return the response data if the status is success
    if (response.data.status === "success") {
      return response.data.data.map((LOD) => ({
        LODID: LOD.case_id,
        Status: LOD.lod_final_reminder?.current_document_type,
        Amount: LOD.current_arrears_amount,
        CustomerTypeName: LOD.customer_type_name || null,
        AccountManagerCode: LOD.account_manager_code || null,
        SourceType: LOD.lod_final_reminder.source_type || null,
      }));
    } else {
      throw new Error("Failed to fetch cases");
    }
  } catch (error) {
    console.error("Error fetching F2 selection cases:", error);
    throw error.response?.data?.message || "Failed to fetch cases";
  }
};

// Create task for downloading all digital signatures LOD cases
export const Create_Task_For_Downloard_All_Digital_Signature_LOD_Cases = async (
  createdBy
) => {
  try {
    const response = await axios.post(
      `${LOD_URL}/Create_Task_For_Downloard_All_Digital_Signature_LOD_Cases`,
      {
        Created_By: createdBy,
      }
    );

    // return the response status
    return response;
  } catch (error) {
    console.error(
      "Error creating task:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

// Create task for downloading each digital signature LOD cases
export const Create_Task_For_Downloard_Each_Digital_Signature_LOD_Cases =
  async (createdBy, LODType) => {
    try {
      const response = await axios.post(
        `${LOD_URL}/Create_Task_For_Downloard_Each_Digital_Signature_LOD_Cases`,
        {
          Created_By: createdBy,
          current_document_type: LODType,
        }
      );

      // return the response status
      return response;
    } catch (error) {
      console.error(
        "Error creating task:",
        error.response?.data || error.message
      );
      throw error.response?.data || error;
    }
  };

// Change the document type
export const Change_Document_Type = async (
  case_id,
  current_document_type,
  Created_By,
  changed_type_remark
) => {
  try {
    const response = await axios.post(`${LOD_URL}/Change_Document_Type`, {
      Created_By: Created_By,
      current_document_type: current_document_type,
      case_id: case_id,
      changed_type_remark: changed_type_remark,
    });

    // return the response status
    return response.data.status;
  } catch (error) {
    console.error(
      "Error creating task:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

// Create task for proceeding with LOD or final reminder list
export const Create_Task_for_Proceed_LOD_OR_Final_Reminder_List = async (
  Created_By,
  Case_count,
  current_document_type
) => {
  try {
    const response = await axios.post(
      `${LOD_URL}/Create_Task_for_Proceed_LOD_OR_Final_Reminder_List`,
      {
        Created_By: Created_By,
        current_document_type: current_document_type,
        Case_count: Case_count,
      }
    );

    // return the response status
    return response;
  } catch (error) {
    console.error(
      "Error creating task:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

// Function to fetch the list of LOD cases for final reminder
export const List_Final_Reminder_Lod_Cases = async (
  case_status,
  date_type,
  date_from,
  date_to,
  current_document_type,
  pages = 1
) => {
  try {
    const response = await axios.post(
      `${LOD_URL}/List_Final_Reminder_Lod_Cases`,
      {
        case_status: case_status,
        date_type: date_type,
        date_from: date_from,
        date_to: date_to,
        current_document_type: current_document_type,
        pages: pages,
      }
    );

    // return the response data if the status is success;
    if (response.data.status === "success") {
      return response.data.data.map((LOD) => ({
        LODID: LOD.case_id,
        Status: LOD.case_current_status,
        LODBatchNo: LOD.lod_final_reminder?.lod_distribution_id,
        NotificationCount:
          LOD.lod_final_reminder?.lod_notification?.length || null,
        CreatedDTM: LOD.lod_final_reminder?.lod_submission?.created_on || null,
        ExpireDTM: LOD.lod_final_reminder?.lod_expire_on || null,
        LastResponse:
          LOD.lod_final_reminder?.lod_response?.length > 0
            ? LOD.lod_final_reminder.lod_response[
                LOD.lod_final_reminder.lod_response.length - 1
              ]?.created_on // returning the last response data
            : null,
      }));
    } else {
      throw new Error("Failed to fetch cases");
    }
  } catch (error) {
    console.error("Error fetching cases:", error);
    throw error.response?.data?.message || "Failed to fetch cases";
  }
};

// Create a customer response
export const Creat_Customer_Responce = async (
  case_id,
  customer_responce,
  remark,
  created_by
) => {
  try {
    const response = await axios.post(`${LOD_URL}/Create_Customer_Responce`, {
      case_id: case_id,
      customer_responce: customer_responce,
      remark: remark,
      created_by: created_by,
    });

    // return the response status
    return response.data.status;
  } catch (error) {
    console.error(
      "Error creating customer response",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

// fetching case details for customer response page
export const case_details_for_lod_final_reminder = async (case_id) => {
  try {
    const response = await axios.post(
      `${LOD_URL}/case_details_for_lod_final_reminder`,
      {
        case_id: case_id,
      }
    );

    // return relevant values if the status is success
    if (response.data.status === "success") {
      return {
        case_id: response.data.data.case_id || null,
        customer_ref: response.data.data.customer_ref || null,
        account_no: response.data.data.account_no || null,
        arrears_amount: response.data.data.current_arrears_amount || null,
        last_payment_date: response.data.data.last_payment_date || null,
        lod_response:
          response.data.data.lod_final_reminder?.lod_response || null,
        current_document_type:
          response.data.data.lod_final_reminder?.current_document_type || null,
      };
    } else {
      throw new Error("Failed to fetch case details");
    }
  } catch (error) {
    console.error("Error fetching case details:", error);
    throw error.response?.data?.message || "Failed to fetch case details";
  }
};

// Fetching case details for customer responce review page
export const Case_Details_Settlement_LOD_FTL_LOD = async (case_id) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/settlement/Case_Details_Settlement_LOD_FTL_LOD`,
      {
        case_id: case_id,
      }
    );

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
      current_document_type:
        response.data.lod_response?.current_document_type || null,
    };
  } catch (error) {
    console.error("Error fetching case details:", error);
    throw error.response?.data?.message || "Failed to fetch case details";
  }
};

export const List_All_LOD_Holdlist = async (payload) => {
  try {
    const response = await axios.post(
      `${LOD_URL}/List_All_LOD_Holdlist`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error withdrawing LD Hold list Details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Proceed_LD_Hold_List = async (payload) => {
  try {
    const response = await axios.post(
      `${LOD_URL}/Proceed_LD_Hold_List`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error processing proceed button:",
      error.response?.data || error.message
    );
    throw error;
  }
};
