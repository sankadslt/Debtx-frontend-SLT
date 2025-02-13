import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL; 
const TASK_URL = `${BASE_URL}/task`;


export const Create_Task = async (filteredParams) => {
  try {
    const taskData = {
      Template_Task_Id: 24,
      task_type: "Create Collect Only CPE List for Download",
      Created_By: "FrontendUser", 
      task_status: "open",
      ...filteredParams,
    };

    const response = await axios.post(`${TASK_URL}/Create_Task`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error.response?.data || error;
  }
};

export const Task_for_Download_Incidents = async (incidentData) => {
    try {
        const response = await axios.post(`${TASK_URL}/Task_for_Download_Incidents`, incidentData);
        return response.data;
    } catch (error) {
        console.error("Error creating incident:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
  };

  export const Create_Task_for_OpenNoAgent = async (filteredParams) => {
    try {
      const taskData = {
        Template_Task_Id: 21,
        task_type: "Create incident open for distribution download",
        Created_By: "FrontendUser", 
        task_status: "open",
        Incident_Status: "Open No Agent",
        ...filteredParams,
      };
  
      const response = await axios.post(`${TASK_URL}/Create_Task`, taskData);
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error.response?.data || error;
    }
  };