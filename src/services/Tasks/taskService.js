import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL; // Ensure the base URL is correctly set
const TASK_URL = `${BASE_URL}/task`;

export const Task_for_Download_Incidents = async (incidentData) => {
    try {
        const response = await axios.post(`${TASK_URL}/Task_for_Download_Incidents`, incidentData);
        return response.data;
    } catch (error) {
        console.error("Error creating incident:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
  };