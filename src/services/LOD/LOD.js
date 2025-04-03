import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL; // Ensure the base URL is correctly set
const LOD_URL = `${BASE_URL}/lod`;

export const fetchCaseCounts = async () => {
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

export const fetchF2SelectionCases = async (current_document_type, pages = 1) => {
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
            CustomerTypeName: LOD.CustomerTypeName || null,
            AccountManagerCode: LOD.AccountManagerCode || null,
            SourceType: LOD.drc && LOD.drc.length > 0 ? "DRC Fail" : "Direct LOD",
          }));
        } else {
          throw new Error("Failed to fetch incidents");
        }
    } catch (error) {
        console.error("Error fetching F2 selection cases:", error);
        throw error.response?.data?.message || "Failed to fetch cases";
    }
};