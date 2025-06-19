import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const RTOM_URL = `${BASE_URL}/RTOM`;

export const fetchRTOMs = async (filters = {}) => {
  try {
    const response = await axios.post(`${RTOM_URL}/List_All_RTOM_Details`, {
      rtom_status: filters.rtom_status,
      pages: filters.pages || 1,
    });

    if (response.data.status === "success") {
      return response.data.data.map((rtom) => ({
        rtom_id: rtom.rtom_id,
        rtom_status: rtom.rtom_status,
        billing_center_code: rtom.billing_center_code,
        rtom_name: rtom.rtom_name,
        rtom_mobile_no: rtom.rtom_mobile_no,
        rtom_email: rtom.rtom_email,
        rtom_telephone_no: rtom.rtom_telephone_no,
        area_code: rtom.area_code,
      }));
    } else {
      throw new Error(response.data.message || "Failed to fetch RTOMs");
    }
  } catch (error) {
    console.error("Error fetching RTOMs:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    if (error.response?.status === 404) {
      return [];
    }

    throw (
      error.response?.data?.message || "An error occurred while fetching RTOMs"
    );
  }
};

export const fetchRTOMDetails = async (rtomId) => {
  try {
    const response = await axios.post(
      `${RTOM_URL}/List_RTOM_Details_By_RTOM_ID`,
      {
        rtom_id: rtomId,
      }
    );

    if (response.data.status === "success") {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch RTOM details");
    }
  } catch (error) {
    console.error("Error fetching RTOM details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw (
      error.response?.data?.message ||
      "An error occurred while fetching RTOM details"
    );
  }
};

export const createRTOM = async (rtomData) => {
  try {
    const response = await axios.post(`${RTOM_URL}/Create_Active_RTOM`, {
      billing_center_code: rtomData.billingCenterCode,
      rtom_name: rtomData.name,
      area_code: rtomData.areaCode,
      rtom_email: rtomData.email,
      rtom_mobile_no: rtomData.mobile,
      rtom_telephone_no: rtomData.telephone,
      created_by: rtomData.createdBy,
    });

    if (response.data.status === "success") {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to create RTOM");
    }
  } catch (error) {
    console.error("Error creating RTOM:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw (
      error.response?.data?.message || "An error occurred while creating RTOM"
    );
  }
};

export const updateRTOMDetails = async (rtomData) => {
  try {
    const response = await axios.post(
      `${RTOM_URL}/Update_RTOM_Details`,
      rtomData
    );

    if (response.data.status === "success") {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to update RTOM details");
    }
  } catch (error) {
    console.error("Error updating RTOM details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw (
      error.response?.data?.message ||
      "An error occurred while updating RTOM details"
    );
  }
};
