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
    console.error(
      "Error fetching case count by DRC commission rule:",
      error.response?.data || error.message
    );
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
    console.error(
      "Error fetching arrears bands:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const count_cases_rulebase_and_arrears_band = async (
  drcCommissionRule
) => {
  try {
    const response = await axios.post(
      `${URL}/count_cases_rulebase_and_arrears_band`,
      {
        drc_commision_rule: drcCommissionRule,
      }
    );

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

export const Case_Distribution_Among_Agents = async (requestData) => {
  try {
    // Validate the requestData
    if (
      !requestData ||
      typeof requestData !== "object" ||
      Object.keys(requestData).length === 0
    ) {
      throw new Error("Invalid request data provided.");
    }

    // Make the API request
    const response = await axios.post(
      `${URL}/Case_Distribution_Among_Agents`,
      requestData
    );

    // Validate the response structure
    if (response.data && response.data.status === "success") {
      return response.data.data; // Return the required data
    } else {
      console.error(
        "Error in API response:",
        response.data?.message || "Unknown error"
      );
      throw new Error(
        response.data?.message || "Failed to fetch case distribution."
      );
    }
  } catch (error) {
    console.error(
      "Error fetching case distribution among agents:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const List_Case_Distribution_DRC_Summary = async (requestdata) => {
  try {
    const response = await axios.post(
      `${URL}/List_Case_Distribution_DRC_Summary`,
      requestdata
    );

    console.log("Full API Response:", response); // Debugging
    console.log("Response Data:", response.data); // Debugging

    return response.data; // Return response.data directly, since it's already an array
  } catch (error) {
    console.error(
      "Error fetching case distribution DRC summary:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Create_Task_For_case_distribution = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Create_Task_For_case_distribution`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating task for case distribution:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const List_all_transaction_seq_of_batch_id = async (data) => {
  try {
    const response = await axios.post(
      `${URL}/List_all_transaction_seq_of_batch_id`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all transaction sequence of batch ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Create_Task_For_case_distribution_transaction = async (
  payload
) => {
  try {
    const response = await axios.post(
      `${URL}/Create_Task_For_case_distribution_transaction`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating task for case distribution transaction:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const get_distribution_array_of_a_transaction = async (data) => {
  try {
    const response = await axios.post(
      `${URL}/get_distribution_array_of_a_transaction`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching distribution array of a transaction:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Create_Task_For_case_distribution_transaction_array = async (
  payload
) => {
  try {
    const response = await axios.post(
      `${URL}/Create_Task_For_case_distribution_transaction_array`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating task for case distribution transaction array:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Case_Distribution_Details_With_Drc_Rtom_ByBatchId = async (
  data
) => {
  try {
    const response = await axios.post(
      `${URL}/Case_Distribution_Details_With_Drc_Rtom_ByBatchId`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching case distribution details with DRC RTOM by batch ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Exchange_DRC_RTOM_Cases = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Exchange_DRC_RTOM_Cases`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching case distribution details with DRC RTOM by transaction:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Batch_Forward_for_Proceed = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Batch_Forward_for_Proceed`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching case distribution details with DRC RTOM by transaction:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const List_All_Batch_Details = async () => {
  try {
    const response = await axios.get(`${URL}/List_All_Batch_Details`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching all batch details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Approve_Batch_or_Batches = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Approve_Batch_or_Batches`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error approving batch or batches:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Create_task_for_batch_approval = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Create_task_for_batch_approval`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating task for batch approval:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const List_DRC_Assign_Manager_Approval = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/List_DRC_Assign_Manager_Approval`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating task for batch approval:",
      error.response?.data || error.message
    );
    throw error;
  }
};
