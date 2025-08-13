import axios from "axios";

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/case`;

export const ListRequestLogFromRecoveryOfficers = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/ListRequestLogFromRecoveryOfficers`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating task for case distribution:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const ListAllRequestLogFromRecoveryOfficersWithoutUserID = async (
  payload
) => {
  try {
    const response = await axios.post(
      `${URL}/ListAllRequestLogFromRecoveryOfficersWithoutUserID`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching request log from recovery officers without user ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const ListAllRequestLogFromRecoveryOfficers = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/ListAllRequestLogFromRecoveryOfficers`,
      payload
    );
    return response;
  } catch (error) {
    console.error(
      "Error fetching all request log from recovery officers: ",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Create_task_for_Request_log_download_when_select_more_than_one_month =
  async (payload) => {
    try {
      const response = await axios.post(
        `${URL}/Create_task_for_Request_log_download_when_select_more_than_one_month`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error creating task for request log download when selecting more than one month:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

export const List_Details_Of_Mediation_Board_Acceptance = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/List_Details_Of_Mediation_Board_Acceptance`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching mediation board acceptance details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Submit_Mediation_Board_Acceptance = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Submit_Mediation_Board_Acceptance`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error submitting mediation board acceptance:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Withdraw_Mediation_Board_Acceptance = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Withdraw_Mediation_Board_Acceptance`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error withdrawing mediation board acceptance:",
      error.response?.data || error.message
    );
    throw error;
  }
}; 

export const List_Request_Response_log = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/List_Request_Response_log`,
      // {
      //   case_current_status: payload.case_current_status,
      //   date_from: payload.date_from,
      //   date_to: payload.date_to
      // }
      payload
    );
    console.log("Payload for List_Request_Response_log:", response);
    console.log("Response from List_Request_Response_log:", response.data);
    return response;
    
  } catch (error) {
    console.error(
      "Error fetching request response log:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const List_Deligated_Request_Response = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/List_Deligated_Request_Response`,
      // {
      //   case_current_status: payload.case_current_status,
      //   date_from: payload.date_from,
      //   date_to: payload.date_to
      // }
      payload
    );
    console.log("Payload for List_Deligated_Request_Response:", response);
    console.log("Response from List_Deligated_Request_Response:", response.data);
    return response;
    
  } catch (error) {
    console.error(
      "Error fetching request response log:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Create_Task_For_Request_Responce_Log_Download = async (
  payload
) => {
  try {
    const response = await axios.post(
      `${URL}/Create_Task_For_Request_Responce_Log_Download`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating task for request response log download:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const Settelment_plan_request_acceptence_type_A = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Settelment_plan_request_acceptence_type_A`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating settlement plan request acceptance type A:",
      error.response?.data || error.message
    );
    throw error;
  }
};
