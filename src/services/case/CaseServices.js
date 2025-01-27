import axios from "axios";

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/case`;

// get_count_by_drc_commision_rule  
export const get_count_by_drc_commision_rule = async () => {
    try {
      const response = await axios.get(`${URL}/get_count_by_drc_commision_rule`);
      return response.data;
    } catch (error) {
      console.error("Error fetching case count by DRC commission rule:", error.response?.data || error.message);
      throw error;
    }
  };



// Fetch all arrears bands
export const fetchAllArrearsBands = async () => {
  try {
    const response = await axios.get(`${URL}/getAllArrearsBands`);
    const data = response.data.data;

    // Exclude the _id key and return both the key-value pairs
    const arrearsBands = Object.entries(data)
      .filter(([key]) => key !== "_id") // Exclude _id
      .map(([key, value]) => ({ key, value })); // Return both the key and the value as an object

    return arrearsBands; // Return an array of objects with key-value pairs
  } catch (error) {
    console.error("Error fetching arrears bands:", error.response?.data || error.message);
    throw error;
  }
};


export const count_cases_rulebase_and_arrears_band = async (drcCommissionRule) => {
  try {
    const response = await axios.post(`${URL}/count_cases_rulebase_and_arrears_band`, {
      drc_commision_rule: drcCommissionRule,
    });

    const data = response.data.data;

    // Convert bands and counts into key-value pairs
    const bandsAndCounts = data.Arrears_Bands.reduce((acc, band) => {
      acc[band.band] = band.count; // Use band as the key and count as the value
      return acc;
    }, {});

    return {
      total: data.Total,
      bandsAndCounts, // Key-value pairs
    };
  } catch (error) {
    console.error(
      "Error fetching the count_cases_rulebase_and_arrears_band:",
      error.response?.data || error.message
    );
    throw error;
  }
};