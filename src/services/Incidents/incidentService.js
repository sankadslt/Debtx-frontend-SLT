import axios from "axios";
import { getLoggedUserId } from "../auth/authService";

const BASE_URL = import.meta.env.VITE_BASE_URL; // Ensure the base URL is correctly set
const INCIDENT_URL = `${BASE_URL}/incident`;

/**
 * Creates a new incident by calling the Create_Incident API.
 * 
 * @param {Object} incidentData - The incident details to be sent to the API.
 * @returns {Promise<Object>} - The API response.
 * @throws {Error} - Throws an error if the API call fails.
 */
export const createIncident = async (incidentData) => {
  try {
    const response = await axios.post(`${INCIDENT_URL}/Create_Incident`, incidentData);
    return response.data; // Return the success response
  } catch (error) {
    console.error("Error creating incident:", error.response?.data || error.message);
    throw error.response?.data || error; // Throw detailed error for handling
  }
};
export const incidentRegisterBulkUpload = async (incidentData) => {
  try {
    const response = await axios.post(`${INCIDENT_URL}/Upload_DRS_File`, incidentData);
    return response.data; // Return the success response
  } catch (error) {
    console.error("Error creating incident:", error.response?.data || error.message);
    throw error.response?.data || error; // Throw detailed error for handling
  }
};

export const fetchIncidents = async (filters) => {
  try {
    console.log("Sending filters:", filters);
    const response = await axios.post(`${INCIDENT_URL}/List_Incidents`, filters);
    console.log("Response:", response.data);

    if (response.data.status === "success") {
      return response.data.incidents.map((incident) => ({
        incidentID: incident.Incident_Id,
        status: incident.Incident_Status,
        accountNo: incident.Account_Num,
        action: incident.Actions,
        sourceType: incident.Source_Type,
        createdDTM: new Date(incident.Created_Dtm).toLocaleString(),
      }));
    } else {
      throw new Error("Failed to fetch incidents");
    }
  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error.response?.data?.message || "An error occurred while fetching data";
  }
};

export const List_Distribution_Ready_Incidents = async () => {
  try {
    const response = await axios.post(`${INCIDENT_URL}/List_Distribution_Ready_Incidents`);
    return response.data;
  } catch (error) {
    console.error("Error fetching incidents:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};


export const distribution_ready_incidents_group_by_arrears_band= async () => {
  try {
    const response = await axios.post(`${INCIDENT_URL}/distribution_ready_incidents_group_by_arrears_band`);
    return response.data.data.Distribution_ready_incidents_by_AB;
  } catch (error) {
    
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
  const response = await axios.post(`${INCIDENT_URL}/total_F1_filtered_Incidents`);
  return response.data?.data?.F1_filtered_incident_total;
};

export const getDistributionReadyIncidentsCount = async () => {
  const response = await axios.post(`${INCIDENT_URL}/total_distribution_ready_incidents`);
  return response.data?.data?.Distribution_ready_total;
};

export const getCPECollectIncidentsCount = async () => {
  const response = await axios.post(`${INCIDENT_URL}/total_incidents_CPE_Collect`);
  return response.data?.data?.Distribution_ready_total;
};

export const getDirectLODIncidentsCount = async () => {
  const response = await axios.post(`${INCIDENT_URL}/total_incidents_Direct_LOD`);
  return response.data?.data?.Distribution_ready_total;
};

export const Create_Case_for_incident = async (requestData) => {
  try {
    const response = await axios.post(`${INCIDENT_URL}/Create_Case_for_incident`, requestData);
    return response.data; // Returns the created cases
  } catch (error) {
    console.error("Error in Create_Case_for_incident service:", error.message);
    throw error.response?.data || error;
  }
};


export const Forward_CPE_Collect = async (Incident_Id) => {
  try {
     const user = await getLoggedUserId();

    const response = await axios.post(`${INCIDENT_URL}/Forward_CPE_Collect`,  { 
      Incident_Id, 
      Proceed_By : user.user_id,
    });
    return response; 
  } catch (error) {
    console.error("Error forwarding CPE Collect incidents:", error.response?.data || error.message);
    throw error.response?.data || error; 
  }
};
export const getOpenTaskCountforCPECollect = async () => {
  try {
    const response = await axios.get(`${INCIDENT_URL}/Open_Task_Count_for_CPE_Collect`);
    console.log("Open Task Count Response:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("Error fetching open task count:", error.response?.data || error.message);
    return { openTaskCount: 0 }; // Prevent breaking the UI
  }
};
