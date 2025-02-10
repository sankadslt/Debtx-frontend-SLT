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
