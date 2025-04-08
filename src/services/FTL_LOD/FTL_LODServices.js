import axios from "axios";

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/ftl_lod`;

// List Handling Cases By DRC
export const List_FTL_LOD_Cases = async (payload) => {
  try {
    const response = await axios.post(`${URL}/List_FTL_LOD_Cases`, payload);

    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    return response.data; // Return the full response data as-is
  } catch (error) {
    console.error("Error retrieving List FTL LOD Cases:", error.response?.data || error.message);
    throw error;
  }
};
