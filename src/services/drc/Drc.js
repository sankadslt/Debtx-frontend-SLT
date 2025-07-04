import axios from "axios";

//Base URL for for case-related API
const BASE_URL = import.meta.env.VITE_BASE_URL;
const URL = `${BASE_URL}/DRC`;
const URL2 = `${BASE_URL}/recovery_officer`;
const URL3 = `${BASE_URL}/DRC_service`;

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

// export const listAllDRCDetails = async (status, page = 1) => {
//   try {
//     const response = await axios.post(`${URL}/List_All_DRC_Details`, {
//       status,
//       page,
//     });

//     console.log("Full DRC API response:", response.data);

//     const drcArray = response.data;

//     if (!Array.isArray(drcArray)) {
//       throw new Error("Invalid DRC data format received");
//     }

//     const formattedDRCs = drcArray.map((drc) => ({
//       key: drc.drc_id,
//       value: drc.drc_name,
//       id: drc.drc_id,
//       email: drc.drc_email,
//       tel: drc.drc_contact_no,
//       status: drc.drc_status,
//       roCount: drc.ro_count,
//       rtomCount: drc.rtom_count,
//       business_registration_number: drc.drc_business_registration_number,
//       service_count: drc.service_count,
//     }));

//     return formattedDRCs;
//   } catch (error) {
//     console.error(
//       "Error fetching DRCs by status:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

export const listAllDRCDetails = async (filter) => {
  try {
    const response = await axios.post(`${URL}/List_All_DRC_Details`, {
      status: filter.status || "",
      page: filter.page || 1,
    });

    if (response.data.status === "error") {
      throw new Error(response.data.message || "Failed to fetch DRC data");
    }

    return response.data;
  } catch (error) {
    console.error("Error in listAllDRCDetails:", {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    
    // More specific error messages
    if (error.response?.status === 500) {
      throw new Error("Server error while fetching DRC data. Please try again later.");
    } else if (error.response?.status === 404) {
      throw new Error("No DRC records found matching your criteria.");
    } else {
      throw new Error("Failed to fetch DRC data. Please check your connection and try again.");
    }
  }
};

export const List_RO_Details_Owen_By_DRC_ID = async (drc_id) => {
  try {
    if (!drc_id) throw new Error("drc_id is required");
    const response = await axios.post(
      `${URL2}/List_RO_Details_Owen_By_DRC_ID`,
      { drc_id }
    );

    const data = response.data;

    const formattedROs = data.map((ro, index) => ({
      key: index,
      ro_name: ro.ro_name,
      status: ro.status,
      ro_end_date: ro.ro_end_dtm,
      ro_contact_no: ro.ro_contact_no,
    }));

    return formattedROs;
  } catch (error) {
    console.error(
      "Error fetching RO list by DRC ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const List_RTOM_Details_Owen_By_DRC_ID = async (drc_id) => {
  try {
    if (!drc_id) throw new Error("drc_id is required");
    const response = await axios.post(
      `${URL}/List_RTOM_Details_Owen_By_DRC_ID`,
      { drc_id }
    );

    const data = response.data;

    const formattedRtomData = data.map((rtom, index) => ({
      key: index,
      area_name: rtom.rtom_name,
      rtom_contact_number: rtom.rtom_mobile_no,
      rtom_abbreviation: rtom.billing_center_Code,
      created_dtm: rtom.rtom_end_date,
      ro_count: rtom.ro_count,
    }));

    return formattedRtomData;
  } catch (error) {
    console.error(
      "Error fetching RTOMs by DRC ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const List_Service_Details_Owen_By_DRC_ID = async (drc_id) => {
  try {
    if (!drc_id) throw new Error("drc_id is required");
    const response = await axios.post(
      `${URL}/List_Service_Details_Owen_By_DRC_ID`,
      { drc_id }
    );

    const data = response.data;

    const formattedServices = data.map((service, index) => ({
      key: index,
      service_type: service.service_type,
      enable_date: service.enable_date,
      status: service.status,
    }));

    return formattedServices;
  } catch (error) {
    console.error(
      "Error fetching services by DRC ID:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getDebtCompanyByDRCID = async (drcId) => {
  try {
    const response = await axios.post(`${URL}/List_DRC_Details_By_DRC_ID`, {
      drc_id: drcId,
    });
    const data = response.data.data;
    return data;
  } catch (error) {
    console.error(
      "Error fetching debt company details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// terminateCompanyByDRCID
export const terminateCompanyByDRCID = async (
  drcId,
  remark,
  remarkBy,
  terminatedDate
) => {
  try {
    const response = await axios.patch(`${URL}/Terminate_Company_By_DRC_ID`, {
      drc_id: drcId,
      remark: remark,
      remark_by: remarkBy,
      remark_dtm: terminatedDate.toISOString(), // Ensure proper date format
    });

    if (response.data.status === "error") {
      throw new Error(response.data.message || "Failed to terminate DRC");
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error terminating company:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to terminate DRC"
    );
  }
};

// Update DRC information with services and SLT coordinator
export const updateDRCInfo = async (
  drcId,
  coordinator,
  services,
  rtom,
  remark,
  updated_by,
  remark_dtm,
  drc_contact_no,
  drc_email,
  drc_status 
) => {
  try {
    const response = await axios.patch(
      `${URL}/Update_DRC_With_Services_and_SLT_Cordinator`,
      {
        drc_id: drcId,
        coordinator,
        services,
       rtom: rtom.map(rtomItem => ({
          ...rtomItem,
          handling_type:  rtomItem.handling_type
        })),
        remark,
        updated_by,
        remark_dtm,
        drc_contact_no,
        drc_email,
        drc_status, // Include status in the request
      }
    );

    if (response.data && response.data.data) {
      return {
        ...response.data.data,
        status: response.data.status || "success",
      };
    }

    return response.data;
  } catch (error) {
    console.error(
      "Error updating DRC information:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to update DRC");
  }
};

export const getActiveRTOMDetails = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/RTOM/List_All_Active_RTOMs`);
    return response.data;
  } catch (error) {
    // Handle API errors
    if (error.response) {
      console.error("API Error:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch active RTOMs"
      );
    } else if (error.request) {
      console.error("Network Error:", error.request);
      throw new Error("Network error. No response received from server.");
    } else {
      console.error("Request Error:", error.message);
      throw new Error("Error setting up request: " + error.message);
    }
  }
};
// getActiveServiceDetails
export const getActiveServiceDetails = async () => {
  try {
      const response = await axios.get(`${BASE_URL}/service/Active_Service_Details`);
      return response.data.data; // Make sure this returns an array of {id, value} objects
  } catch (error) {
    console.error(
      "Error fetching active services:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getSLTCoordinators = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/Obtain_User_List_Owned_By_User_Roles`,
      {
        role: "slt_coordinator",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(
        error.response.data.message || "Failed to fetch SLT Coordinators."
      );
    }
    throw new Error("Network error. Failed to fetch SLT Coordinators.");
  }
};

// export const registerDRC = async (drcData) => {
//   try {
//     const response = await axios.post(`${URL}/Register_DRC`, drcData, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
    
//     console.log("DRC registration response:", response.data);
    
//     if (response.data.status === "error") {
//       throw new Error(response.data.message || "Failed to register DRC");
//     }
    
//     return response.data;
//   } catch (error) {
//     console.error("Error registering DRC:", error);
    
//     let errorMessage = "Failed to register DRC";
//     if (error.response) {
//       console.error("Server error details:", error.response.data);
//       errorMessage = error.response.data.message || errorMessage;
      
//       if (error.response.data.errors) {
//         errorMessage += ": " + JSON.stringify(error.response.data.errors);
//       }
//     } else if (error.request) {
//       console.error("No response received:", error.request);
//       errorMessage = "No response received from server";
//     } else {
//       console.error("Request setup error:", error.message);
//     }
    
//     throw new Error(errorMessage);
//   }
// };


export const Create_DRC_With_Services_and_SLT_Coordinator = async (drcData) => {
  try {
    const response = await axios.post(
      `${URL}/Create_DRC_With_Services_and_SLT_Coordinator`,
      drcData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log("DRC registration response:", response.data);

    if (response.data.status === "error") {
      throw new Error(response.data.message || "Failed to register DRC");
    }

    return response.data;
  } catch (error) {
    console.error("Error registering DRC:", error);

    let errorMessage = "Failed to register DRC";
    if (error.response) {
      console.error("Server error details:", error.response.data);
      errorMessage = error.response.data.message || errorMessage;

      if (error.response.data.errors) {

        const fieldErrors = Object.entries(error.response.data.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(', ');
        errorMessage += ` (${fieldErrors})`;
      }
      
    } else if (error.request) {
      console.error("No response received:", error.request);
      errorMessage = "No response received from server";
    } else {
      console.error("Request setup error:", error.message);
    }

    throw new Error(errorMessage);
  }
};

export const Service_detais_of_the_DRC  = async (drc_id, pages, service_status) => {
  try {
    const response = await axios.post(
      `${URL3}/Service_detais_of_the_DRC`,
      { drc_id, pages, service_status }
    );

    if (response.data.status === "error") {
      throw new Error(response.data.message || "Failed to fetch service details");
    }

    

    return response.data; // Assuming the data is in response.data
  } catch (error) {
    console.error("Error fetching service details:", error.response?.data || error.message);
    throw error;
  }
}

export const Rtom_detais_of_the_DRC = async (drc_id, pages, handling_type) => {
  try {
    const response = await axios.post(
      `${URL3}/Rtom_detais_of_the_DRC`,
      { drc_id, pages, handling_type }
    );

    if (response.data.status === "error") {
      throw new Error(response.data.message || "Failed to fetch RTOM details");
    }

    return response.data; // Assuming the data is in response.data
  } catch (error) {
    console.error("Error fetching RTOM details:", error.response?.data || error.message);
    throw error;
  }
}

export const Ro_detais_of_the_DRC = async (drc_id, pages, drcUser_status) => {
  try {
    const response = await axios.post(
      `${URL3}/Ro_detais_of_the_DRC`,
      { drc_id, pages, drcUser_status }
    );

    if (response.data.status === "error") {
      throw new Error(response.data.message || "Failed to fetch RO details");
    }

    return response.data; // Assuming the data is in response.data
  } catch (error) {
    console.error("Error fetching RO details:", error.response?.data || error.message);
    throw error;
  }
}


