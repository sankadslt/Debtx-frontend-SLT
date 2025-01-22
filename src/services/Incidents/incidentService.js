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
