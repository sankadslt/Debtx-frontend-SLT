/* 
Purpose: This template is used for the 17.4 - User Registration Form.
Created Date: 2025-07-31 
Last Updated: 2025-08-07
Created By: Tharindu Darshana (tharindu.drubasinge@gmail.com)
Version: React v18 
UI Number: 17.4 / 17.4.1 / 17.4.2 
Dependencies: Tailwind CSS, React Icons, SweetAlert2
Related Files: GlobalStyle.js 
Notes: The following page contains the code for the User Registration Form for SLT and DRC officers, with multiple role selection and login method from the provided code, redirect logic and Swal alerts matching SignUp.jsx, and preserved table-based UI.
*/

import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { getAzureUserData, getLoggedUserId } from "../../services/auth/authService";
import { createUser } from "../../services/user/user_services";
import { Active_DRC_Details } from "../../services/drc/Drc";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AddUser = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [loggedUserData, setLoggedUserData] = useState("");
  const [drcList, setDrcList] = useState([]);
  const [formData, setFormData] = useState({
    serviceNo: "",
    name: "",
    nic: "",
    email: "",
    contactNo: "",
    designation: "",
    role: [],
    drcId: "",
    // loginMethod: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // User roles for dropdown
  const userRoles = [
    { value: "GM", label: "GM" },
    { value: "DGM", label: "DGM" },
    { value: "legal_officer", label: "Legal Officer" },
    { value: "manager", label: "Manager" },
    { value: "slt_coordinator", label: "SLT Coordinator" },
    { value: "DRC_user", label: "DRC User" },
    { value: "recovery_staff", label: "Recovery Staff" },
    { value: "superadmin", label: "Super Admin" },
  ];

  // Get logged-in user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getLoggedUserId();
        setLoggedUserData(user);
      } catch (error) {
        console.error("Failed to fetch logged user:", error);
      }
    };
    loadUser();
  }, []);

  // Fetch active DRC list
  useEffect(() => {
    const fetchActiveDrcList = async () => {
      try {
        const fetchedDrcList = await Active_DRC_Details();
        setDrcList(fetchedDrcList);
      } catch (error) {
        console.error("Failed to fetch DRC list:", error);
      }
    };
    fetchActiveDrcList();
  }, []);

  // Reset form data on user type change
  useEffect(() => {
    clearFormData();
  }, [userType]);

  // Clear form data
  const clearFormData = () => {
    setFormData({
      serviceNo: "",
      name: "",
      nic: "",
      email: "",
      contactNo: "",
      designation: "",
      role: [],
      drcId: "",
      // loginMethod: "",
    });
    setError("");
  };

  // Form Input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      if (!formData.role.includes(value)) {
        setFormData((prev) => ({
          ...prev,
          role: [...prev.role, value],
        }));
      }
      e.target.value = ""; // Reset select after choosing
      return;
    }
    if (name === "serviceNo") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/@intranet\.slt\.com\.lk$/, "") }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Remove role handler
  const handleRemoveRole = (roleToRemove) => {
    setFormData((prev) => ({
      ...prev,
      role: prev.role.filter((role) => role !== roleToRemove),
    }));
  };

  // Handle search for SLT user data
  const handleSearch = async () => {
    setError("");
    setLoading(true);
    try {
      const fullServiceNo = formData.serviceNo + "@intranet.slt.com.lk";
      const data = await getAzureUserData(fullServiceNo);
      setFormData((prev) => ({
        ...prev,
        name: data.name,
        email: data.email,
        contactNo: data.contactNo,
        designation: data.designation,
      }));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch user data");
    }
    setLoading(false);
  };

  // Go back to previous page
  const goBack = () => {
    navigate(-1);
  };

  // Register User
  const handleRegister = async () => {
    try {
      setLoading(true);

      if (!userType) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Please select a user type.",
        });
        return;
      }

      const basePayload = {
        user_type: userType,
        user_login: userType === "slt" ? [formData.serviceNo] : [formData.nic],
        User_profile: {
          username: formData.name,
          email: formData.email,
          user_designation: formData.designation,
          user_nic: userType === "slt" ? formData.serviceNo : formData.nic,
        },
        user_contact_num: [formData.contactNo],
        role: formData.role,
        Remark: {
          remark_description: "Manual test insert",
        },
        create_by: loggedUserData,
      };

      const payload =
        userType === "slt"
          ? { ...basePayload }
          : userType === "drc_officer"
          ? { ...basePayload, drc_id: formData.drcId }
          : null;

      if (!payload) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Invalid user type.",
        });
        return;
      }

      const result = await createUser(payload);

      if (result.status === "success") {
        goBack();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User registered successfully",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.message || "Failed to register user",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        icon: "error",
        title: "Unexpected Error",
        text: error.message || "Something went wrong during registration. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center">
      <div className={`${GlobalStyle.fontPoppins} w-full max-w-5xl`}>
        <h1 className={GlobalStyle.headingLarge}>Register User</h1>
        <div className={`${GlobalStyle.cardContainer} mx-auto w-full md:w-[750px] lg:w-[750px]`}>
          <table className="w-full">
            <tbody className="block md:table-row-group">
              <tr className="block md:table-row mb-2">
                <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                  <span className="inline-block min-w-[180px] text-left">
                    User Type<span className="text-red-500">*</span>
                  </span>{" "}
                  :
                </td>
                <td className="block md:table-cell md:w-2/3 pb-2">
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className={`${GlobalStyle.inputText} w-3/4`}
                  >
                    <option value="" disabled hidden>
                      Select
                    </option>
                    <option value="slt">SLT</option>
                    <option value="drc_officer">DRC Officer</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>

          {/* SLT Form */}
          {userType === "slt" && (
            <>
              <h2 className={`${GlobalStyle.headingMedium} mb-4 mt-8 ml-10 text-left font-bold`}>
                <span className="underline">User Details</span>
              </h2>
              <table className="w-full">
                <tbody className="block md:table-row-group">
                  <tr className="block md:table-row mb-2">
                    <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                      <span className="inline-block min-w-[180px] text-left">
                        Service No<span className="text-red-500">*</span>
                      </span>{" "}
                      :
                    </td>
                    <td className="block md:table-cell md:w-2/3 pb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          name="serviceNo"
                          value={formData.serviceNo}
                          onChange={handleInputChange}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                          }}
                          className={`${GlobalStyle.inputText} w-3/4`}
                        />
                        <button
                          type="button"
                          onClick={handleSearch}
                          className={`${GlobalStyle.buttonCircle}`}
                          disabled={loading}
                        >
                          <FaSearch className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="block md:table-row mb-2">
                    <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                      <span className="inline-block min-w-[180px] text-left">
                        Name<span className="text-red-500">*</span>
                      </span>{" "}
                      :
                    </td>
                    <td className="block md:table-cell md:w-2/3 pb-2">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`${GlobalStyle.inputText} w-3/4`}
                      />
                    </td>
                  </tr>
                  <tr className="block md:table-row mb-2">
                    <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                      <span className="inline-block min-w-[180px] text-left">
                        Email<span className="text-red-500">*</span>
                      </span>{" "}
                      :
                    </td>
                    <td className="block md:table-cell md:w-2/3 pb-2">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`${GlobalStyle.inputText} w-3/4`}
                      />
                    </td>
                  </tr>
                  <tr className="block md:table-row mb-2">
                    <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                      <span className="inline-block min-w-[180px] text-left">
                        Contact No<span className="text-red-500">*</span>
                      </span>{" "}
                      :
                    </td>
                    <td className="block md:table-cell md:w-2/3 pb-2">
                      <input
                        type="text"
                        name="contactNo"
                        value={formData.contactNo}
                        onChange={handleInputChange}
                        className={`${GlobalStyle.inputText} w-3/4`}
                      />
                    </td>
                  </tr>
                  <tr className="block md:table-row mb-2">
                    <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                      <span className="inline-block min-w-[180px] text-left">
                        Designation<span className="text-red-500">*</span>
                      </span>{" "}
                      :
                    </td>
                    <td className="block md:table-cell md:w-2/3 pb-2">
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        className={`${GlobalStyle.inputText} w-3/4`}
                      />
                    </td>
                  </tr>
                  {/* <tr className="block md:table-row mb-2">
                    <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                      <span className="inline-block min-w-[180px] text-left">
                        Login Method<span className="text-red-500">*</span>
                      </span>{" "}
                      :
                    </td>
                    <td className="block md:table-cell md:w-2/3 pb-2">
                      <select
                        name="loginMethod"
                        value={formData.loginMethod}
                        onChange={handleInputChange}
                        className={`${GlobalStyle.inputText} w-3/4`}
                      >
                        <option value="" disabled hidden>
                          Select Login Method
                        </option>
                        <option value="gmail">Gmail</option>
                        <option value="mobile">Mobile</option>
                        <option value="slt">SLT</option>
                      </select>
                    </td>
                  </tr> */}
                  <tr className="block md:table-row mb-2">
                    <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                      <span className="inline-block min-w-[180px] text-left">
                        Role<span className="text-red-500">*</span>
                      </span>{" "}
                      :
                    </td>
                    <td className="block md:table-cell md:w-2/3 pb-2">
                      <select
                        name="role"
                        value=""
                        onChange={handleInputChange}
                        className={`${GlobalStyle.inputText} w-3/4`}
                      >
                        <option value="" disabled hidden>
                          Select Role
                        </option>
                        {userRoles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {formData.role.length > 0 && (
                    <tr className="block md:table-row mb-2">
                      <td className="block md:table-cell md:w-1/3"></td>
                      <td className="block md:table-cell md:w-2/3 pb-2">
                        <div className={`${GlobalStyle.inputText} w-3/4 flex flex-wrap items-center gap-2`}>
                          {formData.role.map((role, index) => (
                            <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                              <span className="text-blue-900 mr-2">{role}</span>
                              <button
                                onClick={() => handleRemoveRole(role)}
                                className="text-blue-900 hover:text-red-600 font-bold"
                                title="Remove role"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {/* DRC Form */}
          {userType === "drc_officer" && (
            <>
              <h2 className={`${GlobalStyle.headingMedium} mb-4 mt-8 ml-10 text-left font-bold`}>
                <span className="underline">DRC Officer Details</span>
              </h2>
              <table className="w-full">
                <tbody className="block md:table-row-group">
                  <tr className="block md:table-row mb-2">
                    <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                      <span className="inline-block min-w-[180px] text-left">
                        Select DRC<span className="text-red-500">*</span>
                      </span>{" "}
                      :
                    </td>
                    <td className="block md:table-cell md:w-2/3 pb-2">
                      <select
                        name="drcId"
                        value={formData.drcId}
                        onChange={handleInputChange}
                        className={`${GlobalStyle.inputText} w-3/4`}
                      >
                        <option value="" disabled hidden>
                          Select DRC
                        </option>
                        {drcList.map((drc) => (
                          <option key={drc.key} value={drc.id}>
                            {drc.value}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr className="block md:table-row mb-2">
                    <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                      <span className="inline-block min-w-[180px] text-left">
                        Name<span className="text-red-500">*</span>
                      </span>{" "}
                      :
                    </td>
                    <td className="block md:table-cell md:w-2/3 pb-2">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`${GlobalStyle.inputText} w-3/4`}
                      />
                    </td>
                  </tr>
                  <tr className="block md:table-row mb-2">
                    <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                      <span className="inline-block min-w-[180px] text-left">
                        NIC<span className="text-red-500">*</span>
                      </span>{" "}
                      :
                    </td>
                    <td className="block md:table-cell md:w-2/3 pb-2">
                      <input
                        type="text"
                        name="nic"
                        value={formData.nic}
                        onChange={handleInputChange}
                        className={`${GlobalStyle.inputText} w-3/4`}
                      />
                    </td>
                  </tr>
                  <tr className="block md:table-row mb-2">
                    <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                      <span className="inline-block min-w-[180px] text-left">
                        Email<span className="text-red-500">*</span>
                      </span>{" "}
                      :
                    </td>
                    <td className="block md:table-cell md:w-2/3 pb-2">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`${GlobalStyle.inputText} w-3/4`}
                      />
                    </td>
                  </tr>
                  <tr className="block md:table-row mb-2">
                    <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                      <span className="inline-block min-w-[180px] text-left">
                        Contact No<span className="text-red-500">*</span>
                      </span>{" "}
                      :
                    </td>
                    <td className="block md:table-cell md:w-2/3 pb-2">
                      <input
                        type="text"
                        name="contactNo"
                        value={formData.contactNo}
                        onChange={handleInputChange}
                        className={`${GlobalStyle.inputText} w-3/4`}
                      />
                    </td>
                  </tr>
                  {/* <tr className="block md:table-row mb-2">
                    <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                      <span className="inline-block min-w-[180px] text-left">
                        Login Method<span className="text-red-500">*</span>
                      </span>{" "}
                      :
                    </td>
                    <td className="block md:table-cell md:w-2/3 pb-2">
                      <select
                        name="loginMethod"
                        value={formData.loginMethod}
                        onChange={handleInputChange}
                        className={`${GlobalStyle.inputText} w-3/4`}
                      >
                        <option value="" disabled hidden>
                          Select Login Method
                        </option>
                        <option value="gmail">Gmail</option>
                        <option value="mobile">Mobile</option>
                        <option value="slt">SLT</option>
                      </select>
                    </td>
                  </tr> */}
                  <tr className="block md:table-row mb-2">
                    <td className="block md:table-cell md:w-1/3 text-right pr-2 mt-5 whitespace-nowrap">
                      <span className="inline-block min-w-[180px] text-left">
                        Role<span className="text-red-500">*</span>
                      </span>{" "}
                      :
                    </td>
                    <td className="block md:table-cell md:w-2/3 pb-2">
                      <select
                        name="role"
                        value=""
                        onChange={handleInputChange}
                        className={`${GlobalStyle.inputText} w-3/4`}
                      >
                        <option value="" disabled hidden>
                          Select Role
                        </option>
                        {userRoles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {formData.role.length > 0 && (
                    <tr className="block md:table-row mb-2">
                      <td className="block md:table-cell md:w-1/3"></td>
                      <td className="block md:table-cell md:w-2/3 pb-2">
                        <div className={`${GlobalStyle.inputText} w-3/4 flex flex-wrap items-center gap-2`}>
                          {formData.role.map((role, index) => (
                            <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                              <span className="text-blue-900 mr-2">{role}</span>
                              <button
                                onClick={() => handleRemoveRole(role)}
                                className="text-blue-900 hover:text-red-600 font-bold"
                                title="Remove role"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}

          {error && (
            <div className="mt-4">
              <p className={`${GlobalStyle.errorText} text-center`}>{error}</p>
            </div>
          )}

          <div className="flex justify-center mt-6 w-full px-4 md:px-0">
            <button
              onClick={handleRegister}
              className={`${GlobalStyle.buttonPrimary} w-full md:w-auto`}
              disabled={loading}
            >
              {loading ? "Registering user..." : "Register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;