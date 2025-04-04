import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL; // Ensure the base URL is correctly set
const LOD_URL = `${BASE_URL}/lod`;

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
          throw new Error("Failed to fetch incidents");
        }
    } catch (error) {
        console.error("Error fetching F2 selection cases:", error);
        throw error.response?.data?.message || "Failed to fetch cases";
    }
};

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