import axios from "axios";

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/DRC`;

export const Active_DRC_Details = async () => {
  try {
    const response = await axios.get(`${URL}/Active_DRC_Details`);
    const data = response.data.data.mongoData;

    // Extract and return the drc_name for all active DRCs

    const drcNames = data.map((drc) => ({
      key: drc.drc_id, // Use _id as key
      value: drc.drc_name, // Use drc_name as the display value
      id: drc.drc_id,
      
    }));

    return drcNames;
  } catch (error) {
    console.error(
      "Error fetching active DRC details:",
      error.response?.data || error.message
    );
    throw error;
  }
};
