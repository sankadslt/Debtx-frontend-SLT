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