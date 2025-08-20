import axios from "axios";

// const URL = "http://localhost:5000/api/ftl_lod"; // ✅ Backend base URL

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/ftl_lod`;

export const List_FTL_LOD_Cases = async (payload) => {
  try {
    const response = await axios.post(`${URL}/List_FTL_LOD_Cases`, payload);

    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    return response.data; // Return the full response data as-is
  } catch (error) {
    console.error(
      "Error retrieving List FTL LOD Cases:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Case_Details_Settlement_LOD_FTL_LOD = async (case_id) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/settlement/Case_Details_Settlement_LOD_FTL_LOD`,
      {
        case_id: case_id,
      }
    );

    // return relevant values
    return {
      case_id: response.data.case_id,
      customer_ref: response.data.customer_ref,
      account_no: response.data.account_no,
      arrears_amount: response.data.current_arrears_amount || null,
      last_payment_date: response.data.last_payment_date || null,
      lod_response: response.data.lod_response?.lod_response || null,
      settlement_plans: response.data.settlement_plans || null,
      payment_details: response.data.payment_details || null,
      current_document_type:
        response.data.lod_response?.current_document_type || null,
    };
  } catch (error) {
    console.error("Error fetching case details:", error);
    throw error.response?.data?.message || "Failed to fetch case details";
  }
};

export const Create_Customer_Response = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Create_Customer_Response`,
      payload
    );

    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    return response.data; // Return the full response data as-is
  } catch (error) {
    console.error(
      "Error submitting customer response:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Create_FLT_LOD = async (payload) => {
  try {
    const response = await axios.post(`${URL}/Create_FLT_LOD`, payload);

    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    return response.data; // Return the full response data as-is
  } catch (error) {
    console.error(
      "Error creating FTL LOD:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// export const FTL_LOD_Case_Details = async (case_id) => {
//   try {
//     const response = await axios.post(
//       `${URL}/FTL_LOD_Case_Details`,
//       { case_id: case_id }
//     );
//     console.log("Response from FTL_LOD_Case_Details:", case_id);

//     if (response.data.status === "error") {
//       throw new Error(response.data.message);
//     }

//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error fetching FTL LOD case details:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };


export const FLT_LOD_Case_Details = async (case_id) => {
  try {
    const response = await axios.post(`${URL}/FLT_LOD_Case_Details`, { case_id });

    console.log("Sent case_id:", case_id);
    console.log("Received response:", response.data);

    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching FTL LOD case details:", error.response?.data || error.message);
    throw error;
  }
};