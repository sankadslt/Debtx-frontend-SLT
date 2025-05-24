import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/commission`;



export const List_All_Commission_Cases = async (filters) => {
  try {
    const response = await axios.post(
      `${URL}/List_All_Commission_Cases`,
      filters
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching All commission cases:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const commission_type_cases_count = async () => {
  try {
    const response = await axios.get(`${URL}/commission_type_cases_count`);

    // Assign the relevant values
    if (response.data.status === "success") {
      const pendingCount = response.data?.data?.commissions?.find(item => item.commission_type === "Pending Commission")?.count || 0;
      const unresolvedCount = response.data?.data?.commissions?.find(item => item.commission_type === "Unresolved Commission")?.count || 0;
      const totalCount = pendingCount + unresolvedCount;

      // Return the assigned values
      return {
        totalCount,
        pendingCount,
        unresolvedCount
      };
    }
  } catch (error) {
    console.error("Error fetching case counts:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const Create_task_for_Download_Commision_Case_List = async (Created_By, DRC_ID, Commission_Type, from_date, to_date, Case_ID, Account_Number) => {
  try {
    const response = await axios.post(`${URL}/Create_task_for_Download_Commision_Case_List`, {
      Created_By: Created_By,
      DRC_ID: DRC_ID,
      Commission_Type: Commission_Type,
      from_date: from_date,
      to_date: to_date,
      Case_ID: Case_ID,
      Account_Number: Account_Number
    });

    // return the response status
    return response.data.status;
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const Commission_Details_By_Commission_ID = async (commission_id) => {
  try {
    const response = await axios.post(`${URL}/Commission_Details_By_Commission_ID`, {
      commission_id: commission_id,
    });

    // return relevant values 
    if (response.data.status === "success") {
      return response.data.data;
    } else {
      console.error("Error fetching case details:", error);
      throw error.response?.data?.message || "Failed to fetch case details";
    }
  } catch (error) {
    console.error("Error fetching case details:", error);
    throw error.response?.data?.message || "Failed to fetch case details";
  }
};