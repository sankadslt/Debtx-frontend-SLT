import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL; // Ensure the base URL is correctly set
const LOD_URL = `${BASE_URL}/lod`;

// Function to fetch the LOD, Final Reminder and total count
export const F2_selection_cases_count = async () => {
  try {
    const response = await axios.get(`${LOD_URL}/F2_selection_cases_count`);
    const data = response.data?.data || { total_count: 0, cases: [] };

    // Assign the relevant values
    const lodCount = data.cases.find(item => item.document_type === "LOD")?.count || 0;
    const finalReminderCount = data.cases.find(item => item.document_type === "Final Reminder")?.count || 0;
    const totalCount = lodCount + finalReminderCount;

    return {
      totalCount,
      lodCount,
      finalReminderCount
    };
  } catch (error) {
    console.error("Error fetching case counts:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Function to fetch the list of F2 selection cases
export const List_F2_Selection_Cases = async (current_document_type, pages = 1) => {
  try {
    const response = await axios.post(`${LOD_URL}/List_F2_Selection_Cases`, {
      current_document_type: current_document_type,
      pages: pages,
    });

    // return response.data.data;
    if (response.data.status === "success") {
      return response.data.data.map((LOD) => ({
        LODID: LOD.case_id,
        Status: LOD.lod_final_reminder.current_document_type,
        Amount: LOD.current_arrears_amount,
        CustomerTypeName: LOD.customer_name || null,
        AccountManagerCode: LOD.rtom || null,
        SourceType: LOD.lod_final_reminder.source_type || null,
      }));
    } else {
      throw new Error("Failed to fetch cases");
    }
  } catch (error) {
    console.error("Error fetching F2 selection cases:", error);
    throw error.response?.data?.message || "Failed to fetch cases";
  }
};

// Create task for downloading all digital signatures LOD cases
export const Create_Task_For_Downloard_All_Digital_Signature_LOD_Cases = async (createdBy) => {
  try {
    const response = await axios.post(`${LOD_URL}/Create_Task_For_Downloard_All_Digital_Signature_LOD_Cases`, {
      Created_By: createdBy,
    });

    const data = response.data || {};
    const taskData = {
      ResponceStatus: response.status,
      Template_Task_Id: data.Template_Task_Id || 39,
      task_type: data.task_type || "Create Task For Download All Digital Signature LOD Cases",
      case_current_status: data.case_current_status || "LIT Prescribed",
      task_status: data.task_status || "open",
      Created_By: data.Created_By || createdBy,
    };

    return taskData;
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Create task for downloading each digital signature LOD cases
export const Create_Task_For_Downloard_Each_Digital_Signature_LOD_Cases = async (createdBy, LODType) => {
  try {
    const response = await axios.post(`${LOD_URL}/Create_Task_For_Downloard_Each_Digital_Signature_LOD_Cases`, {
      Created_By: createdBy,
      current_document_type: LODType,
    });

    const data = response.data || {};
    const taskData = {
      ResponceStatus: response.status,
      Template_Task_Id: data.Template_Task_Id || 39,
      task_type: data.task_type || "Create Task For Download All Digital Signature LOD Cases",
      case_current_status: data.case_current_status || "LIT Prescribed",
      task_status: data.task_status || "open",
      Created_By: data.Created_By || createdBy,
    };

    return taskData;
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Change the document type
export const Change_Document_Type = async (case_id, current_document_type, Created_By, changed_type_remark) => {
  try {
    const response = await axios.post(`${LOD_URL}/Change_Document_Type`, {
      Created_By: Created_By,
      current_document_type: current_document_type,
      case_id: case_id,
      changed_type_remark: changed_type_remark,
    });

    return response;
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Create task for proceeding with LOD or final reminder list
export const Create_Task_for_Proceed_LOD_OR_Final_Reminder_List = async (Created_By, Case_count, current_document_type) => {
  try {
    const response = await axios.post(`${LOD_URL}/Create_Task_for_Proceed_LOD_OR_Final_Reminder_List`, {
      Created_By: Created_By,
      current_document_type: current_document_type,
      Case_count: Case_count,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const List_Final_Reminder_Lod_Cases = async (case_status, date_type, date_from, date_to, current_document_type, pages = 1) => {
  try {
    const response = await axios.post(`${LOD_URL}/List_Final_Reminder_Lod_Cases`, {
      case_status: case_status,
      date_type: date_type,
      date_from: date_from,
      date_to: date_to,
      current_document_type: current_document_type,
      pages: pages,
    });

    // return response.data.data;
    if (response.data.status === "success") {
      return response.data.data.map((LOD) => ({
        LODID: LOD.case_id,
        Status: LOD.case_current_status,
        LODBatchNo: LOD.lod_final_reminder?.lod_distribution_id,
        NotificationCount: LOD.lod_final_reminder?.lod_notification?.length || null,
        CreatedDTM: LOD.lod_final_reminder?.lod_submission?.created_on || null,
        ExpireDTM: LOD.lod_final_reminder?.lod_expire_on || null,
        LastResponse: LOD.lod_final_reminder.lod_response?.length > 0
          ? LOD.lod_final_reminder.lod_response[LOD.lod_final_reminder.lod_response.length - 1]?.created_on
          : null,
      }));
    } else {
      throw new Error("Failed to fetch cases");
    }
  } catch (error) {
    console.error("Error fetching cases:", error);
    throw error.response?.data?.message || "Failed to fetch cases";
  }
};

// Enter a customer response
export const Creat_Customer_Responce = async (case_id, customer_responce, remark, created_by) => {
  try {
    const response = await axios.post(`${LOD_URL}/Creat_Customer_Responce`, {
      case_id: case_id,
      customer_responce: customer_responce,
      remark: remark,
      created_by: created_by,
    });

    return response.status;
  } catch (error) {
    console.error("Error creating customer response", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// Getting case details
export const case_details_for_lod_final_reminder = async (case_id) => {
  try {
    const response = await axios.post(`${LOD_URL}/case_details_for_lod_final_reminder`, {
      case_id: case_id,
    });

    const Case = response.data.data;

    if (response.data.status === "success") {
      return {
        case_id: Case.case_id,
        customer_ref: Case.customer_ref,
        account_no: Case.account_no,
        arrears_amount: Case.current_arrears_amount || null,
        last_payment_date: Case.last_payment_date || null,
        lod_response: Case.lod_final_reminder?.lod_response || null,
        current_document_type: Case.lod_final_reminder?.current_document_type || null,
      };
    } else {
      throw new Error("Failed to fetch case details");
    }
  } catch (error) {
    console.error("Error fetching case details:", error);
    throw error.response?.data?.message || "Failed to fetch case details";
  }
};

export const Case_Details_Settlement_LOD_FTL_LOD = async (case_id) => {
  try {
    const response = await axios.post(`${BASE_URL}/settlement/Case_Details_Settlement_LOD_FTL_LOD`, {
      case_id: case_id,
    });
    
    const Case = response.data;

    // Flatten the settlement plans
    const flattenedSettlementPlans = Case.settlement_plans?.reduce((acc, settlement) => {
      const flattenedPlans = settlement.settlement_plan.map(plan => ({
        settlement_id: settlement.settlement_id,
        last_monitoring_dtm: settlement.last_monitoring_dtm,
        ...plan
      }));
      return acc.concat(flattenedPlans);
    }, []) || [];

    return {
      case_id: Case.case_id,
      customer_ref: Case.customer_ref,
      account_no: Case.account_no,
      arrears_amount: Case.current_arrears_amount || null,
      last_payment_date: Case.last_payment_date || null,
      lod_response: Case.lod_response?.lod_response || null,
      settlement_plans: flattenedSettlementPlans || null,
      payment_details: Case.payment_details || null,
      current_document_type: Case.lod_response?.current_document_type || null,
    };
  } catch (error) {
    console.error("Error fetching case details:", error);
    throw error.response?.data?.message || "Failed to fetch case details";
  }
};