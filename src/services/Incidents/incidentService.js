import axios from "axios";
import { getLoggedUserId } from "../auth/authService";

const BASE_URL = import.meta.env.VITE_BASE_URL; // Should be http://localhost:5000/api
const INCIDENT_URL = `${BASE_URL}/incident`; // This becomes http://localhost:5000/api/incident
const API_BASE = "https://debtx.slt.lk:6500";

/**
 * Creates a new incident by calling the Create_Incident API.
 *
 * @param {Object} incidentData - The incident details to be sent to the API.
 * @returns {Promise<Object>} - The API response.
 * @throws {Error} - Throws an error if the API call fails.
 */
export const createIncident = async (incidentData) => {
  try {
    const response = await axios.post(
      `${INCIDENT_URL}/Create_Incident`,
      incidentData
    );
    return response.data; // Return the success response
  } catch (error) {
    console.error(
      "Error creating incident:",
      error.response?.data || error.message
    );
    throw error.response?.data || error; // Throw detailed error for handling
  }
};
export const incidentRegisterBulkUpload = async (incidentData) => {
  try {
    const response = await axios.post(
      `${INCIDENT_URL}/Upload_DRS_File`,
      incidentData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating incident:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const fetchIncidents = async (payload) => {
  try {
    //  console.log("Sending filters:", filters);
    const response = await axios.post(
      `${INCIDENT_URL}/List_Incidents`,
      payload
    );
    // console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Detailed error:",

      error.response?.data || error.message
    );
    throw error;
  }
};

export const New_List_Incidents = async (filters) => {
  try {
    const response = await axios.post(
      `${INCIDENT_URL}/New_List_Incidents`,
      filters
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching incidents:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
export const List_Distribution_Ready_Incidents = async () => {
  try {
    const response = await axios.post(
      `${INCIDENT_URL}/List_Distribution_Ready_Incidents`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching incidents:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const distribution_ready_incidents_group_by_arrears_band = async () => {
  try {
    const response = await axios.post(
      `${INCIDENT_URL}/distribution_ready_incidents_group_by_arrears_band`
    );
    return response.data.data.Distribution_ready_incidents_by_AB;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const List_Transaction_Logs_Upload_Files = async (payload) => {
  try {
    const response = await axios.post(
      `${INCIDENT_URL}/List_Transaction_Logs_Upload_Files`,
      payload
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching transaction logs upload files:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const List_Incidents_CPE_Collect = async (filters) => {
  try {
    const response = await axios.post(
      `${INCIDENT_URL}/List_Incidents_CPE_Collect`,
      filters // Pass the filters as the request body
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching CPE Collect incidents:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const getF1FilteredIncidentsCount = async () => {
  const response = await axios.post(
    `${INCIDENT_URL}/total_F1_filtered_Incidents`
  );
  return response.data?.data?.F1_filtered_incident_total;
};

export const getDistributionReadyIncidentsCount = async () => {
  const response = await axios.post(
    `${INCIDENT_URL}/total_distribution_ready_incidents`
  );
  return response.data?.data?.Distribution_ready_total;
};

export const getCPECollectIncidentsCount = async () => {
  const response = await axios.post(
    `${INCIDENT_URL}/total_incidents_CPE_Collect`
  );
  return response.data?.data?.Distribution_ready_total;
};

export const getDirectLODIncidentsCount = async () => {
  const response = await axios.post(
    `${INCIDENT_URL}/total_incidents_Direct_LOD`
  );
  return response.data?.data?.Distribution_ready_total;
};

export const Create_Case_for_incident = async (Incident_Id) => {
  try {
    const user_id = await getLoggedUserId();
    console.log("Request Data being sent:", Incident_Id);

    const response = await axios.post(
      `https://debtx.slt.lk:6500/Create_Cases_From_Incident`,
      {
        Incident_Id,
        // Proceed_By : user_id,
      }
    );

    return response.data; // Returns the created cases
  } catch (error) {
    console.error("Error in Create_Case_for_incident service:", error.message);
    throw error.response?.data || error;
  }
};

export const Forward_CPE_Collect = async (Incident_Id) => {
  try {
    const user_id = await getLoggedUserId();

    // const response = await axios.post(`https://124.43.177.52:7174/Create_Cases_From_Incident`, requestData);
    const response = await axios.post(
      `https://debtx.slt.lk:6500/Create_Cases_From_Incident`,
      {
        Incident_Id,
        // Proceed_By : user_id,
      }
    );

    // const response = await axios.post(`${INCIDENT_URL}/Forward_CPE_Collect`,  {
    //   Incident_Id,
    //   Proceed_By : user_id,
    // });

    return response;

    //     catch (error) {
    //   console.error("Network/Request error:", error);
    //   if (error.response) {
    //     console.log("Response:", error.response.data);
    //   } else if (error.request) {
    //     console.log("Request:", error.request);
    //   } else {
    //     console.log("Error Message:", error.message);
    //   }
    // }
  } catch (error) {
    console.error(
      "Error forwarding CPE Collect incidents:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const getOpenTaskCountforCPECollect = async () => {
  try {
    const response = await axios.get(
      `${INCIDENT_URL}/Open_Task_Count_for_CPE_Collect`
    );
    console.log("Open Task Count Response:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching open task count:",
      error.response?.data || error.message
    );
    return { openTaskCount: 0 }; // Prevent breaking the UI
  }
};

export const Task_for_Download_Incidents = async (
  status1,
  status2,
  fromDate,
  toDate,
  createdBy
) => {
  try {
    const response = await axios.post(
      `${INCIDENT_URL}/Task_for_Download_Incidents`,
      {
        Incident_Status: status2,
        Actions: status1,
        From_Date: fromDate,
        To_Date: toDate,
        // Account_Num: accountNo,
        Created_By: createdBy,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating incident:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
