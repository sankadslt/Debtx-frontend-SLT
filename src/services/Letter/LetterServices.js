import axios from "axios";

const URL = "http://localhost:5000/api/letter"; // ✅ Backend base URL

//Base URL for for case-related API
//const BASE_URL = import.meta.env.VITE_BASE_URL;
//const URL = `${BASE_URL}/letter`;


export const Fetch_Letter = async ({ case_id, language, letter_template_type_id }) => {
  try {
    const response = await axios.post(`${URL}/Fetch_Letter`, {
      case_id,
      language,
      letter_template_type_id,
    });

    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    return response; // return full response so component can use response.data
  } catch (error) {
    console.error("Error fetching letter:", error.response?.data || error.message);
    throw error;
  }
};


