/* 
    Purpose: This template is used for the DRC Controllers.
    Created Date: 2025-07-24
    Created By: Sasindu Srinayaka (sasindusrinayaka@gmail.com)
    Last Modified Date: 2025-07-24
    Modified By: Sasindu Srinayaka (sasindusrinayaka@gmail.com)
    Version: Node.js v20.11.1
    Notes:  
*/


import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const USER_URL = `${BASE_URL}/user`;
const USER_URL3 = `${BASE_URL}/DRC_service`;

export const getUserDetailsById = async (user_id) => {
  try {
    const response = await axios.post(`https://debtx.slt.lk:6500/users/details/by-id`, {
      user_id,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw (
      error?.response?.data || {
        status: "error",
        message: "Unable to fetch user details by ID",
      }
    );
  }
};

export const getAllUserDetails = async (requestData = {}) => {
  try {
    const response = await axios.post(`https://debtx.slt.lk:6500/users/list_login_paginated`, requestData);
    console.log("Response from getAllUserDetails:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all user details:", error);
    throw (
      error?.response?.data || {
        status: "error",
        message: "Unable to fetch all user details",
      }
    );
  }
};

export const updateUserDetails = async (requestData = {}) => {
  try {
    const response = await axios.patch(`${USER_URL}/Update_User_Details`, requestData);
    return response.data;
  } catch (error) {
    console.error("Error fetching all user details:", error);
    throw (
      error?.response?.data || {
        status: "error",
        message: "Unable to fetch all user details",
      }
    );
  }
};

export const endUser = async (requestData ={}) => {
  try {
    const response = await axios.patch(`${USER_URL}/End_User`, requestData);
    return response.data;
  } catch (error) {
    console.error('Failed to terminate user:', error);
    const message =error.response?.data?.message || 'Something went wrong.';
    throw (
      error?.response?.data || {
        status: "error",
        message: message,
      }
    );
  }
};

export const getAllUserApprovals = async (requestData) => {
  try {
    const response = await axios.post(`${USER_URL3}/List_User_Approval_Details`, requestData);
    return response.data;
  } catch (error) {
    console.error('Error fetching user approvals:', error.response?.data || error.message);
    throw error.response?.data || { status: 'error', message: 'Something went wrong while fetching user approvals.' };
  }
};

export const Approve_DRC_Agreement_Approval = async (requestData) => {
  try {
    const response = await axios.post(`${USER_URL3}/Approve_DRC_Agreement_Approval`, requestData);
    return response.data;
  } catch (error) {
    console.error('Error approving DRC agreement:', error.response?.data || error.message);
    throw error.response?.data || { status: 'error', message: 'Something went wrong while approving DRC agreement.' };
  }
};

export const Reject_DRC_Agreement_Approval = async (requestData) => {
  try {
    const response = await axios.post(`${USER_URL3}/Reject_DRC_Agreement_Approval`, requestData);
    return response.data;
  } catch (error) {
    console.error('Error rejecting DRC agreement:', error.response?.data || error.message);
    throw error.response?.data || { status: 'error', message: 'Something went wrong while rejecting DRC agreement.' };
  }
}

export const Download_User_Approval_List = async (requestData) => {
  try {
    const response = await axios.post(`${USER_URL3}/Download_User_Approval_List`, 
    requestData);
    return response.data;
  } catch (error) {
    console.error('Error downloading user approval list:', error.response?.data || error.message);
    throw error.response?.data || { status: 'error', message: 'Something went wrong while downloading user approval list.' };
  }
}

export const createUser = async (formData) => {
  try {
    const res = await axios.post(`https://debtx.slt.lk:6500/users/create`, formData);
    return res.data;
  } catch (err) {
    return {
      status: "error",
      message: err?.response?.data?.message || "User register failed.",
      errors: err?.response?.data?.errors || {},
    };
  }
};

export const updateUserStatus = async (requestData = {}) => {
  try {
    const response = await axios.post(
      "https://debtx.slt.lk:6500/users/update/status",
      {
        user_id: Number(requestData.user_id), 
        status_payload: {
          status: requestData.status_payload.status,
          status_on: requestData.status_payload.status_on,
          status_by: requestData.status_payload.status_by
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("Status update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw (
      error?.response?.data || {
        status: "error",
        message: "Unable to update user status",
      }
    );
  }
};


export const updateUserRoles = async (user_id, roles, endDates = {}) => {
  try {
    const role_payload = roles.map(role => {
      const roleObj = { role_name: role };
      
      if (endDates[role]) {
        roleObj.end_dtm = endDates[role];
      }
      
      return roleObj;
    });

    role_payload.push({});

    const response = await axios.post(
      "https://debtx.slt.lk:6500/users/update/roles",
      {
        user_id: Number(user_id),
        role_payload
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating user roles:", error);
    throw (
      error?.response?.data || {
        status: "error",
        message: "Unable to update user roles",
        errors: error?.response?.data?.errors || {}
      }
    );
  }
};
