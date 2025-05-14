import axios from "axios";
import { getLoggedUserId, getUserData } from "../auth/authService";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/incident`;
const TASK_URL = `${BASE_URL}/task`;


export const List_incidents_Direct_LOD = async (filters) => {
  try {
    const response = await axios.post(
      `${URL}/List_incidents_Direct_LOD`,
      filters
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching Direct LOD incidents:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

 export const Create_Task_Download_Direct_LOD_Sending = async (filteredParams) => {
    try {
        const user = await getUserData();
       
        const taskData = {
            Template_Task_Id: 23,
            task_type: "Create Direct LOD Incident Sending  List for Download",
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

export const List_F1_filtered_incidents = async (filters) => {
  try {
    const response = await axios.post(
      `${URL}/List_F1_filted_Incidents`,
      filters
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching F1 filtered incidents:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const Forward_Direct_LOD = async (Incident_Id) => {
  try {
    const user= await getLoggedUserId();
    const response = await axios.post(`${URL}/Forward_Direct_LOD`, {
      Incident_Id,
      user
    });
    return response;
  } catch (error) {
    console.error(
      "Error forwarding Direct LOD incidents:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const Create_Task_Forward_Direct_LOD = async (parameters) => {
    try {
        const user = await getUserData();
        const taskData = {
            Template_Task_Id: 16,
            task_type: "Create Case from Incident Open LOD",
            Created_By: user.user_id,  
            task_status: "open",
            ...parameters,
        };
        const response = await axios.post(`${TASK_URL}/Create_Task`, taskData);
        return response; 
    } catch (error) {
        console.error("Error creating task:", error.response?.data || error.message);
        throw error.response?.data || error; 
      }
 }

 export const Create_Task_Download_Pending_Reject = async (filteredParams) => {
    try {
        const user = await getUserData();
        const taskData = {
            Template_Task_Id: 22,
            task_type: "Create Pending Reject List for Downloard",
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

export const Forward_F1_Filtered = async (Incident_Id) => {
  try {
    //const Incident_Forwarded_By= await getLoggedUserId();
    const response = await axios.post(`${URL}/Forward_F1_filtered_incident`, {
      Incident_Id,

    });
    return response;
  } catch (error) {
    console.error(
      "Error forwarding F1 filtered incidents:",
      error.response?.data || error
    );
    throw error.response?.data || error;
  }
};

export const Reject_F1_Filtered = async (Incident_Id) => {
  try {
    const user= await getLoggedUserId();
    const response = await axios.patch(`${URL}/Reject_F1_filtered_Incident`, {
      Incident_Id,
      user
    });
    return response;
  } catch (error) {
    console.error(
      "Error rejecting F1 filtered incidents:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const Create_Task_Forward_F1_Filtered = async (parameters) => {
    try {
        const user = await getUserData();
        const taskData = {
            Template_Task_Id: 19,
            task_type: "Create Case from Incident F1 Move Forward",
            Created_By: user.user_id, 
            task_status: "open",
            ...parameters,
        };
        const response = await axios.post(`${TASK_URL}/Create_Task`, taskData);
        return response; 
    } catch (error) {
        console.error("Error creating task:", error.response?.data || error.message);
        throw error.response?.data || error; 
      }
 }

 export const Create_Task_Reject_F1_Filtered = async (parameters) => {
    try {
        const user = await getUserData();
        const taskData = {
            Template_Task_Id: 18,
            task_type: "Create Case from Incident Reject All",
            Created_By: user.user_id, 
            task_status: "open",
            ...parameters,
        };
        const response = await axios.post(`${TASK_URL}/Create_Task`, taskData);
        return response; 
    } catch (error) {
        console.error("Error creating task:", error.response?.data || error.message);
        throw error.response?.data || error; 
      }
 }

export const List_Incidents_CPE_Collect = async (filters) => {
  try {
    const response = await axios.post(
      `${URL}/List_Incidents_CPE_Collect`,
      filters
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching F1 filtered incidents:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};


export const List_Reject_Incident = async (filters) => {
  try {
    const response = await axios.post(`${URL}/List_Reject_Incident`, filters);
    console.log(response)
    return response.data; 
  } catch (error) {
    console.error("Error fetching rejected incidents:", error.response?.data || error.message);
    throw error.response?.data || error; 
  }
};

export const Create_Rejected_List_for_Download = async (filteredParams) => {
  try {
      const user = await getUserData();
      const taskData = {
          Template_Task_Id: 25,
          task_type: "Create Rejected List for Download",
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

export const Open_Task_Count_Forward_Direct_LOD = async () => {
  try {
      const taskData = {
          Template_Task_Id: 16,
          task_type: "Create Case from Incident Open LOD",
      };
      const response = await axios.post(`${TASK_URL}/Open_Task_Count`, taskData);
      return response.data.openTaskCount; 
  } catch (error) {
      console.error("Error fetching open task count:", error.response?.data || error.message);
      throw error.response?.data || error; 
    }
}

export const Open_Task_Count_Reject_F1_Filtered = async () => {
  try {
      const taskData = {
          Template_Task_Id: 18,
          task_type: "Create Case from Incident Reject All",
      };
      const response = await axios.post(`${TASK_URL}/Open_Task_Count`, taskData);
      console.log(response)
      return response.data.openTaskCount; 
  } catch (error) {
      console.error("Error fetching open task count:", error.response?.data || error.message);
      throw error.response?.data || error; 
    }
}

export const Open_Task_Count_Forward_F1_Filtered = async () => {
  try {
      const taskData = {
          Template_Task_Id: 19,
          task_type: "Create Case from Incident F1 Move Forward",
      };
      const response = await axios.post(`${TASK_URL}/Open_Task_Count`, taskData);
      return response.data.openTaskCount; 
  } catch (error) {
      console.error("Error fetching open task count:", error.response?.data || error.message);
      throw error.response?.data || error; 
    }
}










