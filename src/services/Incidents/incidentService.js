import axios from "axios";

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
        caseID: incident.Incident_Id,
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

export const List_Incidents_CPE_Collect = async () => {
  try {
    const response = await axios.post(`${INCIDENT_URL}/List_Incidents_CPE_Collect`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching CPE Collect incidents:", error.response?.data || error.message);
    throw error.response?.data || error; 
  }
};