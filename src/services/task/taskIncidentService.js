import axios from "axios";
import { getLoggedUserId } from "../auth/authService";
import { getUserData } from "../auth/authService";


const BASE_URL = import.meta.env.VITE_BASE_URL;
const TASK_URL = `${BASE_URL}/task`;
const INCIDENT_URL = `${BASE_URL}/incident`;

export const Task_for_Download_Incidents = async (filteredParams) => {
    try{
        const user_id = await getLoggedUserId();
        const taskData = {
            Template_Task_Id: 20,
            task_type: "User Created Incident List for download",
            Created_By: user_id,
            task_status: "open",
            created_dtm: new Date(),
            ...filteredParams,
        };   
        
        const response = await axios.post(`${INCIDENT_URL}/Task_for_Download_Incidents`, taskData);
        if (response.status === 201) {
            return response.data;
        }else{
            throw new Error("Failed to create task");
        }
        } catch (error) {
            console.error("Error creating task:", error.message || error);
            throw error.response?.data || error;
        }
}

export const Task_for_Download_Incidents_Full_List = async (filteredParams) => {
    try{
        const user_id = await getLoggedUserId();
        const taskData = {
            Template_Task_Id: 21,
            task_type: "Incident distribution download",
            Created_By: user_id,
            task_status: "open",
            created_dtm: new Date(),
            ...filteredParams,
        };   
        
        const response = await axios.post(`${INCIDENT_URL}/Task_for_Download_Incidents_Full_List`, taskData);
        if (response.status === 201) {
            return response.data;
        }else{
            throw new Error("Failed to create task");
        }
        } catch (error) {
            console.error("Error creating task:", error.message || error);
            throw error.response?.data || error;
        }
}

export const Create_Task_for_OpenNoAgent = async (filteredParams) => {
  try {
    const user_id = await getLoggedUserId();
    const taskData = {
      Template_Task_Id: 21,
      task_type: "Incident distribution download",
      Created_By: user_id,
      task_status: "open",
      Incident_direction: "Open No Agent",
      ...filteredParams,
    };

    const response = await axios.post(`${TASK_URL}/Create_Task`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error.response?.data || error;
  }
};

 export const Create_Task_Download_Pending_Reject = async (filteredParams) => {
    try {
        const user = await getUserData();
        const taskData = {
            Template_Task_Id: 21,
            task_type: "Incident distribution download",
            Created_By: user.user_id, 
            task_status: "open",
            ...filteredParams,
        };
        const response = await axios.post(`${TASK_URL}/Create_Task`, taskData);
        return response; 
    } catch (error) {
        console.error("Error creating task:", error.response?.data || error.message);
        throw error.response?.data || error; 
      }
}

 export const Create_Task_Download_Direct_LOD_Sending = async (filteredParams) => {
    try {
        const user = await getUserData();
       
        const taskData = {
            Template_Task_Id: 21,
            task_type: "Incident distribution download",
            Created_By: user.user_id, 
            task_status: "open",
            ...filteredParams,
        };
        const response = await axios.post(`${TASK_URL}/Create_Task`, taskData);
        return response; 
    } catch (error) {
        console.error("Error creating task:", error.response?.data || error.message);
        throw error.response?.data || error; 
      }
 }

 export const Create_Task = async (filteredParams) => {
  try {
    const user_id = await getLoggedUserId();

    const taskData = {
      Template_Task_Id: 21,
      task_type: "Incident distribution download",
      Created_By: user_id,
      task_status: "open",
      ...filteredParams,
    };

    const response = await axios.post(`${TASK_URL}/Create_Task`, taskData);
    return response; // Changed to return the full response instead of response.data
  } catch (error) {
    console.error(
      "Error creating task:",
      error.response?.data || error.message
    ); // Updated error handling
    throw error.response?.data || error;
  }
};

export const Create_Rejected_List_for_Download = async (filteredParams) => {
  try {
      const user = await getUserData();
      const taskData = {
          Template_Task_Id: 21,
          task_type: "Incident distribution download",
          Created_By: user.user_id, 
          task_status: "open",
          ...filteredParams,
      };
      const response = await axios.post(`${TASK_URL}/Create_Task`, taskData);
      return response; 
  } catch (error) {
      console.error("Error creating task:", error.response?.data || error.message);
      throw error.response?.data || error; 
    }
}