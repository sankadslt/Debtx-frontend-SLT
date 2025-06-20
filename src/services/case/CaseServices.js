import axios from "axios";

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/case`;
import { getLoggedUserId } from "../auth/authService";

// get_count_by_drc_commision_rule
export const List_count_by_drc_commision_rule = async () => {
  try {
    const response = await axios.get(`${URL}/List_count_by_drc_commision_rule`);
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

    const response = await axios.get(`${URL}/List_All_Arrears_Bands`);

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

    //console.log("Full API Response:", response); // Debugging
    //console.log("Response Data:", response.data); // Debugging

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

export const list_distribution_array_of_a_transaction = async (data) => {
  try {
    const response = await axios.post(
      `${URL}/list_distribution_array_of_a_transaction`,
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

// List Cases Owned By DRC // - nimaaa

export const List_CasesOwened_By_DRC = async (requestData) => {
  try {
    const response = await axios.post(
      `${URL}/List_CasesOwened_By_DRC`,
      requestData
    );

    // Validate response structure
    if (response.data && response.data.status === "success") {
      return response.data.Cases; // Return the cases data
    } else {
      console.error(
        "Error in API response:",
        response.data?.message || "Unknown error"
      );
      throw new Error(
        response.data?.message || "Failed to retrieve case details."
      );
    }
  } catch (error) {
    console.error(
      "Error fetching cases owned by DRC:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const List_All_Batch_Details = async (payload) => {
  try {
    const response = await axios.post(`${URL}/List_All_Batch_Details`, payload);
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

export const Approve_Batch = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Approve_Batch`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in approving batch:",
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

export const Approve_DRC_Assign_Manager_Approval = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Approve_DRC_Assign_Manager_Approval`,
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

export const Reject_DRC_Assign_Manager_Approval = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Reject_DRC_Assign_Manager_Approval`,
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

export const Create_task_for_DRC_Assign_Manager_Approval = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Create_task_for_DRC_Assign_Manager_Approval`,
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

export const List_Case_Distribution_Details = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/List_Case_Distribution_Details`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching case distribution details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Create_Task_For_case_distribution_drc_summery = async (
  payload
) => {
  try {
    const response = await axios.post(
      `${URL}/Create_Task_For_case_distribution_drc_summery`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating task for case distribution drc summery:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const List_Case_Distribution_Details_With_Rtoms = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/List_Case_Distribution_Details_With_Rtoms`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching case distribution details with RTOMs:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Create_Task_For_Assigned_drc_case_list_download = async (
  payload
) => {
  try {
    const response = await axios.post(
      `${URL}/Create_Task_For_Assigned_drc_case_list_download`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating task for assigned DRC case list download:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const AssignDRCToCaseDetails = async (payload) => {
  try {
    const response = await axios.post(`${URL}/AssignDRCToCaseDetails`, payload);

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching assign DRC to case details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const List_All_DRCs_Mediation_Board_Cases = async (filters) => {
  try {
    const response = await axios.post(
      `${URL}/List_All_DRCs_Mediation_Board_Cases`,
      filters
    );
    if (response.data.status === "success") {
      return response.data;
    }
  } catch (error) {
    console.error(
      "Error fetching Case details :",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const Case_Details_for_DRC = async (case_id, drc_id) => {
  try {
    const response = await axios.post(
      `${URL}/Case_Details_for_DRC`,
      {
        case_id: case_id,
        drc_id: drc_id,
      }
    );
    if (response.data.status === "success") {
      return response.data.data;
    }
  } catch (error) {
    console.error(
      "Error fetching Case details :",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const Accept_Non_Settlement_Request_from_Mediation_Board = async (case_id, recieved_by) => {
  try {
    if (!case_id) {
      throw new Error("case_id is required");
    }

  
    const user_id = await getLoggedUserId();
    const recieved_by = user_id || "Unknown User"; 

    const response = await axios.put(`${URL}/Accept_Non_Settlement_Request_from_Mediation_Board`, {  
      case_id, 
      recieved_by 
    });

    return response.status;
  } catch (error) {
    console.error("Error updating case status:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const Assign_DRC_To_Case = async (payload) => {
  try {
    const response = await axios.post(`${URL}/Assign_DRC_To_Case`, payload);
    return response.data;
  } catch (error) {
    console.error(
      "Error assigning DRC to case:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const Withdraw_CasesOwened_By_DRC = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/Withdraw_CasesOwened_By_DRC`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error withdrawing cases owned by DRC:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const List_Cases_Owned_By_Mediation_Board = async (payload) => {
  try {
    const response = await axios.post(
      `${URL}/List_Cases_Owned_By_Mediation_Board`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching cases owned by mediation board:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const ListAllRequestLogFromRecoveryOfficersWithoutUserID = async (
  payload
) => {
  try {
    const response = await axios.post(
      `${URL}/ListAllRequestLogFromRecoveryOfficersWithoutUserID`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching request log from recovery officers without user ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const fetchCaseDetails = async (caseId) => {
  try {
    const response = await axios.get(`${URL}/listdownCaseDetailsByCaseId/${caseId}`, {
      },);
  
    return response.data;
  } catch (error) {
    console.error('Error fetching case details:', error);
    throw error;
  }
};

export const GetFilteredCaseLists = async ({
  case_current_status,
  From_DAT,
  TO_DAT,
  RTOM,
  DRC,
  arrears_band:selectedBand,
  service_type,
  pages
}) => {
  try {
    const payload = {
      case_current_status,
      From_DAT,
      TO_DAT,
      RTOM,
      DRC,
      arrears_band: selectedBand,
      service_type,
      pages
    };

    

    const response = await axios.post(`${URL}/List_All_Cases`, payload);

    if (response.data.status === "error") {
      throw new Error(response.data.message);
    }

    return {
      status: "success",
      data: response.data.data.map(item => ({
        caseid: item.case_id,
        casecurrentstatus: item.status,
        accountno: item.account_no,
        amount: item.current_arrears_amount,
        servicetype: item.service_type,
        Agent:item.drc_name,
        drccommisionrule: item.service_type,
        currentarrearsamount: item.current_arrears_amount,
        rtom: item.rtom,
        area: item.area,
        Created_On: item.date,
        Lastpaymentdate: item.last_payment_date  
      }))
    };
  } catch (error) {
    console.error("Case list error:", error);
    if (error.response?.status === 404) {
      return { data: [] };
    }
    throw error;
  }
};

export const getCaseStatusList = async () => {
  try {
    const response = await axios.get(`${URL}/CaseStatus`);  
    
    if (response.data.status === "success") {
      
      return response.data.data.map((status) => ({
        key: status._id,
        value: status.case_status  
      }));
    }
    throw new Error(response.data.message || "Failed to fetch case statuses");
  } catch (error) {
    console.error("Error fetching case statuses:", error.response?.data || error.message);
    throw error;
  }
};

