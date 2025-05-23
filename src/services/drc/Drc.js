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


export const List_All_DRC_Details = async (status) => {
  try {
    const response = await axios.post(`${URL}/List_All_DRC_Details`, { status });

    const data = response.data;

    const formattedDRCs = data.map((drc) => ({
      key: drc.drc_id,
      value: drc.drc_name,
      id: drc.drc_id,
      email: drc.drc_email,
      tel: drc.teli_no,
      status: drc.drc_status,
      roCount: drc.ro_count,
      rtomCount: drc.rtom_count,
      business_registration_number: drc.drc_business_registration_number ,
      service_count: drc.service_count ,
    }));

    return formattedDRCs;
  } catch (error) {
    console.error("Error fetching DRCs by status:", error.response?.data || error.message);
    throw error;
  }
};






