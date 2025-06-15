/* Purpose: This template is used for the 17.2 - User Info .
Created Date: 2025-06-07
Created By: sakumini (sakuminic@gmail.com)
Version: node 20
ui number :17.2
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the User Info Screen */

import { useEffect, useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import edit from "../../assets/images/edit-info.svg";
import add from "../../assets/images/user-add.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserDetailsById, updateUserDetails } from "../../services/user/user_services";
import completeIcon from "../../assets/images/complete.png";
import remove from "../../assets/images/remove.svg";

const UserInfo = () => {
  const location = useLocation();
  const user_id = location.state?.user_id;

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  const [selectedRole, setSelectedRole] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [remark, setRemark] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [emailError, setEmailError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({
    username: "",
    user_type: "",
    email: "",
    login_method: "",
    role: "",
    Created_ON: "",
    Created_BY: "",
    Approved_On: "",
    Approved_By: "",
    Remark: [],
    user_roles: [] // Added to store multiple roles
  });

  const [formData, setFormData] = useState({
    userType: "",
    userMail: "",
    loginMethod: "",
    userRoles: [],
    createdOn: "",
    createdBy: "",
    approvedOn: "",
    approvedBy: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showEndSection, setShowEndSection] = useState(false);
  const [showLogHistory, setShowLogHistory] = useState(false);

  // User roles data for editing
  const [userRolesData, setUserRolesData] = useState([]);
  
  // Available roles dropdown
  const availableRoles = [
    { role_name: "GM" },
    { role_name: "DGM" },
    { role_name: "legal_officer" },
    { role_name: "manager" },
    { role_name: "slt_coordinator" },
    { role_name: "DRC_user" },
    { role_name: "recovery_staff" },
    { role_name: "rtom" },
  ];

  useEffect(() => {
    const fetchUserInfoById = async () => {
      try {
        setLoading(true);
        const fetchedData = await getUserDetailsById(user_id);

        if (fetchedData) {
          setUserInfo(fetchedData.data);
          setIsActive(fetchedData.data.user_status === "true");
          // Set formData for editing
          setFormData({
            userType: fetchedData.data.user_type || "",
            userMail: fetchedData.data.email || "",
            loginMethod: fetchedData.data.login_method || "",
            userRoles: fetchedData.data.user_roles || [],
            createdOn: fetchedData.data.Created_ON || "",
            createdBy: fetchedData.data.Created_BY || "",
            approvedOn: fetchedData.data.Approved_On || "",
            approvedBy: fetchedData.data.Approved_By || "",
          });
          // Set userRolesData for editing - use user_roles if available, otherwise fallback to single role
          if (fetchedData.data.user_roles && fetchedData.data.user_roles.length > 0) {
            setUserRolesData(fetchedData.data.user_roles.map(role => ({
              roleName: role.role_name || role,
              active: role.active || false
            })));
          } else if (fetchedData.data.role) {
            setUserRolesData([{ roleName: fetchedData.data.role, active: true }]);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching User info:", err);
        setError("Failed to load user information. Please try again later.")
        setLoading(false);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load User information",
        });
      }
    };

    fetchUserInfoById();
  }, [user_id]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setEmailError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "userMail") {
      setEmailError("");
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    if (!remark.trim()) {
      Swal.fire({
        title: "Warning",
        text: "Remark is required",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      return;
    }

    try {
      setLoading(true);
      
      // Get the current active role from userRolesData
      const activeRole = userRolesData.find(role => role.active);
      
      const updateData = {
        user_id: user_id,
        updated_by: userInfo.email || "current_user", // Use user email for remark_by
        role: activeRole ? activeRole.roleName : null,
        user_roles: userRolesData, // Save all user roles
        user_status: isActive ? "true" : "false",
        remark: remark
      };

      const response = await updateUserDetails(updateData);
      
      if (response.status === "success") {
        // Refresh user data
        const fetchedData = await getUserDetailsById(user_id);
        if (fetchedData) {
          setUserInfo(fetchedData.data);
        }
        
        setRemark("");
        toggleEdit();
        
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User details updated successfully",
        });
      }
    } catch (err) {
      console.error("Error updating user:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to update user details",
      });
    } finally {
      setLoading(false);
    }
  };

  const addUserRole = () => {
    if (selectedRole) {
      // Check if user already has a role
      if (userRolesData.length > 0) {
        Swal.fire({
          title: "Warning",
          text: "User can only have one role at a time. Please remove the existing role first.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        return;
      }
      
      // Add the new role as active
      setUserRolesData([{ roleName: selectedRole, active: true }]);
      setSelectedRole("");
    }
  };

  const toggleUserRole = (index) => {
    // Since there's only one role allowed, this function can remain as is
    // but it will only be called when there's exactly one role
    const updatedData = [...userRolesData];
    updatedData[index].active = !updatedData[index].active;
    setUserRolesData(updatedData);
  };

  const removeUserRole = (index) => {
    const updatedData = [...userRolesData];
    updatedData.splice(index, 1);
    setUserRolesData(updatedData);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleEndUser = async () => {
    if (!endDate) {
      Swal.fire({
        title: "Warning",
        text: "End date is required",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      return;
    }
    if (!remark.trim()) {
      Swal.fire({
        title: "Warning",
        text: "Remark is required",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      return;
    }

    try {
      setLoading(true);
      
      const updateData = {
        user_id: user_id,
        updated_by: userInfo.email || "current_user", // Use user email for remark_by
        user_status: "false", // End user sets status to false
        remark: `User ended on ${endDate.toISOString().split('T')[0]} - ${remark}`
      };

      const response = await updateUserDetails(updateData);
      
      if (response.status === "success") {
        // Refresh user data
        const fetchedData = await getUserDetailsById(user_id);
        if (fetchedData) {
          setUserInfo(fetchedData.data);
        }
        
        setShowEndSection(false);
        setRemark("");
        setEndDate(null);
        
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User ended successfully",
        });
      }
    } catch (err) {
      console.error("Error ending user:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to end user",
      });
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = userRolesData.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 lg:px-8`}>
      <div className={`${GlobalStyle.headingLarge} mb-6 sm:mb-8`}>
        <span>{user_id} - {userInfo.username}</span>
      </div>

      {/* Card box */}
      <div className={GlobalStyle.flexCenter}>
        <div className={`${GlobalStyle.cardContainer} p-4`}>
          {/* Edit Mode UI */}
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex justify-end items-center mb-4">
                <div className="flex items-center">
                  {/* Active or Inactive User */}
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isActive}
                      onChange={() => setIsActive(!isActive)}
                    />
                    <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>

              {/* Edit Table */}
              <div className="overflow-x-auto">
                <table className="mb-6 sm:mb-8 w-full">
                  <tbody>
                    {/* User type */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <label className={`${GlobalStyle.headingMedium} mb-2`}>
                          User Type
                        </label>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {formData.userType || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* User Mail */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <label className={`${GlobalStyle.headingMedium} mb-2`}>
                          User Mail
                        </label>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                       <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {formData.userMail || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* Login Method */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <label className={`${GlobalStyle.headingMedium} mb-2`}>
                          Login Method
                        </label>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {formData.loginMethod || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* User Role Dropdown with Add Button - Only show if no role exists */}
                    {userRolesData.length === 0 && (
                      <tr>
                        <td className="w-1/3 sm:w-auto">
                          <label className={`${GlobalStyle.headingMedium} mb-2`}>
                            User Role
                          </label>
                        </td>
                        <td className="text-center align-middle w-4 sm:w-auto">
                          :
                        </td>
                        <td className="w-2/3 sm:w-auto">
                          <div className="flex items-center space-x-2">
                            <select
                              className={`${GlobalStyle.selectBox} flex-1`}
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(e.target.value)}
                            >
                              <option value="">Select User Role</option>
                              {availableRoles.map((role, index) => (
                                <option key={index} value={role.role_name}>
                                  {role.role_name}
                                </option>
                              ))}
                            </select>
                            <button
                              className="bg-white rounded-full p-1 border border-gray-300 shrink-0"
                              onClick={addUserRole}
                              title="Add User Role"
                              disabled={!selectedRole}
                            >
                              <img src={add} alt="Add" className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* User Roles Table */}
                    <tr>
                      <td colSpan="3">
                        <div className="mb-4">
                          <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                            <table className={GlobalStyle.table}>
                              <thead className={GlobalStyle.thead}>
                                <tr>
                                  <th scope="col" className={GlobalStyle.tableHeader}>
                                    User Roles
                                  </th>
                                  <th scope="col" className={GlobalStyle.tableHeader}>
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {paginatedData.length > 0 ? (
                                  paginatedData.map((row, index) => (
                                    <tr
                                      key={index}
                                      className={`${
                                        index % 2 === 0
                                          ? GlobalStyle.tableRowEven
                                          : GlobalStyle.tableRowOdd
                                      } border-b`}
                                    >
                                      <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>
                                        <span 
                                          className={`cursor-pointer ${row.active ? 'text-green-600 font-semibold' : ''}`}
                                          onClick={() => toggleUserRole(index)}
                                        >
                                          {row.roleName}
                                        </span>
                                      </td>
                                      <td className={GlobalStyle.tableData}>
                                        <div className="flex justify-center items-center">
                                          <button
                                            className="bg-white rounded-full p-1 border border-gray-300"
                                            onClick={() => removeUserRole(index)}
                                            title="Remove User Role"
                                          >
                                            <img src={remove} alt="Remove" className="w-5 h-5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="2" className="text-center py-4">
                                      No results found
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>

                    <tr className="h-4"></tr>

                    {/* Created On */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <label className={`${GlobalStyle.headingMedium} mb-2`}>
                          Created On
                        </label>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {formatDate(formData.createdOn) || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* Created by */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <label className={`${GlobalStyle.headingMedium} mb-2`}>
                          Created By
                        </label>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {formData.createdBy || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* Approved on */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <label className={`${GlobalStyle.headingMedium} mb-2`}>
                          Approved On
                        </label>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {formatDate(formData.approvedOn) || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* Approved by */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <label className={`${GlobalStyle.headingMedium} mb-2`}>
                          Approved By
                        </label>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {formData.approvedBy || "N/A"}
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                <label
                  className={`${GlobalStyle.headingMedium} sm:w-1/4 whitespace-nowrap`}
                >
                  Remark
                </label>
                <span className="hidden sm:inline-block">:</span>
                <textarea
                  className={`${GlobalStyle.inputText} w-full h-40`}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="Enter remark for this update..."
                />
              </div>

              {/* Save button in edit mode */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSave}
                  className={GlobalStyle.buttonPrimary}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* View Mode UI */}
              <div className="flex justify-end">
                <img
                  src={edit}
                  alt="Edit"
                  className="w-6 h-6 sm:w-8 sm:h-8 mb-4 cursor-pointer"
                  onClick={toggleEdit}
                  title="Edit"
                />
              </div>

              {/* View Table */}
              <div className="overflow-x-auto">
                <table className="mb-6 sm:mb-8 w-full">
                  <tbody>
                    {/* User type */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <p className={`${GlobalStyle.paragraph} mb-2`}>
                          User Type
                        </p>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {userInfo.user_type || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* User Mail */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <p className={`${GlobalStyle.paragraph} mb-2`}>
                          User Mail
                        </p>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {userInfo.email || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* Login Method */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <p className={`${GlobalStyle.paragraph} mb-2`}>
                          Login Method
                        </p>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {userInfo.login_method || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* User Roles */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <p className={`${GlobalStyle.paragraph} mb-2`}>
                          User Roles
                        </p>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <div className="mb-4">
                          {/* User Roles Table - Display all roles from userRolesData or fallback to single role */}
                          <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
                            <table className={GlobalStyle.table}>
                              <thead className={GlobalStyle.thead}>
                                <tr>
                                  <th scope="col" className={GlobalStyle.tableHeader}>
                                    User Roles
                                  </th>
                                  <th scope="col" className={GlobalStyle.tableHeader}></th>
                                </tr>
                              </thead>
                              <tbody>
                                {(userRolesData.length > 0 ? userRolesData : 
                                  (userInfo.role ? [{ roleName: userInfo.role, active: true }] : [])
                                ).map((role, index) => (
                                  <tr key={index} className={`${GlobalStyle.tableRowOdd} border-b`}>
                                    <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>
                                      <span>{role.roleName || role}</span>
                                    </td>
                                    <td className={GlobalStyle.tableData}>
                                      <div className="flex justify-center items-center">
                                        <img 
                                          src={completeIcon} 
                                          alt="Active" 
                                          className="h-5 w-5 lg:h-6 lg:w-6"
                                        />
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                                {(userRolesData.length === 0 && !userInfo.role) && (
                                  <tr>
                                    <td colSpan="2" className="text-center py-4">
                                      No results found
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Created On */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <p className={`${GlobalStyle.paragraph} mb-2`}>
                          Created On
                        </p>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {formatDate(userInfo.Created_ON) || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* Created by */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <p className={`${GlobalStyle.paragraph} mb-2`}>
                          Created By
                        </p>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {userInfo.Created_BY || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* Approved on */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <p className={`${GlobalStyle.paragraph} mb-2`}>
                          Approved On
                        </p>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {formatDate(userInfo.Approved_On) || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* Approved by */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <p className={`${GlobalStyle.paragraph} mb-2`}>
                          Approved By
                        </p>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {userInfo.Approved_By || "N/A"}
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      {/* End button */}
      <div className="flex justify-end pr-0 sm:pr-40 mt-4">
        {!isEditing && !showEndSection && (
          <button
            className={GlobalStyle.buttonPrimary}
            onClick={() => setShowEndSection(true)}
          >
            End
          </button>
        )}
      </div>

      {/* End Date and Remark Section */}
      {showEndSection && (
        <div className={GlobalStyle.flexCenter}>
          <div className={`${GlobalStyle.cardContainer} p-4 w-full max-w-2xl`}>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label
                  className={`${GlobalStyle.headingMedium} sm:w-1/4 whitespace-nowrap`}
                >
                  End date
                </label>
                <span className="hidden sm:inline-block">:</span>
                <div className="w-full">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/MM/yyyy"
                    className={`${GlobalStyle.inputText} w-full`}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                <label
                  className={`${GlobalStyle.headingMedium} sm:w-1/4 whitespace-nowrap`}
                >
                  Remark
                </label>
                <span className="hidden sm:inline-block">:</span>
                <textarea
                  className={`${GlobalStyle.inputText} w-full h-40`}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>

              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => {
                    if (!endDate) {
                      Swal.fire({
                        title: "Warning",
                        text: "End date is required",
                        icon: "warning",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                      });
                      return;
                    }
                    if (!remark.trim()) {
                      Swal.fire({
                        title: "Warning",
                        text: "Remark is required",
                        icon: "warning",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                      });
                      return;
                    }

                    setShowEndSection(false);
                  }}
                  className={GlobalStyle.buttonPrimary}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log History button */}
      <div className="flex gap-4 pl-0 sm:pl-20 my-4">
        <button
          className={GlobalStyle.buttonPrimary}
          onClick={() => setShowLogHistory(!showLogHistory)}
        >
          Log History
        </button>
      </div>

      {/* Log History Section */}
      {showLogHistory && (
        <div className={GlobalStyle.flexCenter}>
          <div className={`${GlobalStyle.cardContainer} p-4 w-full max-w-4xl`}>
            <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
              <table className={GlobalStyle.table}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Date
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Action
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Edited By
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {userInfo.Remark?.length > 0 ? (
                    userInfo.Remark?.map((log, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0
                            ? GlobalStyle.tableRowEven
                            : GlobalStyle.tableRowOdd
                        } border-b`}
                      >
                        <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{formatDate(log.remark_dtm) || "N/A"}</td>
                        <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{log.remark  || "N/A"}</td>
                        <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{log.remark_by  || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        No results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo; 



{/* import { useEffect, useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import edit from "../../assets/images/edit-info.svg";
import add from "../../assets/images/user-add.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserDetailsById } from "../../services/user/user_services";
import completeIcon from "../../assets/images/complete.png";
import remove from "../../assets/images/remove.svg";

const UserInfo = () => {
  const location = useLocation();
  const user_id = location.state?.user_id;

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  const [selectedRole, setSelectedRole] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [remark, setRemark] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [emailError, setEmailError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({
    username: "",
    user_type: "",
    email: "",
    login_method: "",
    role: "",
    Created_ON: "",
    Created_BY: "",
    Approved_On: "",
    Approved_By: "",
    Remark: []
  });

  const [formData, setFormData] = useState({
    userType: "",
    userMail: "",
    loginMethod: "",
    userRoles: [],
    createdOn: "",
    createdBy: "",
    approvedOn: "",
    approvedBy: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showEndSection, setShowEndSection] = useState(false);
  const [showLogHistory, setShowLogHistory] = useState(false);

  // User roles data for editing
  const [userRolesData, setUserRolesData] = useState([]);
  
  // Available roles dropdown
  const availableRoles = [
    { role_name: "GM" },
    { role_name: "DGM" },
    { role_name: "Legal Officer" },
    { role_name: "Manager" },
    { role_name: "Assistant Manager" },
    { role_name: "Officer" },
    { role_name: "Executive" },
    { role_name: "Senior Executive" },
  ];

  useEffect(() => {
    const fetchUserInfoById = async () => {
      try {
        setLoading(true);
        const fetchedData = await getUserDetailsById(user_id);

        if (fetchedData) {
          setUserInfo(fetchedData.data);
          // Set formData for editing
          setFormData({
            userType: fetchedData.data.user_type || "",
            userMail: fetchedData.data.email || "",
            loginMethod: fetchedData.data.login_method || "",
            userRoles: fetchedData.data.role ? [{ name: fetchedData.data.role, status: true }] : [],
            createdOn: fetchedData.data.Created_ON || "",
            createdBy: fetchedData.data.Created_BY || "",
            approvedOn: fetchedData.data.Approved_On || "",
            approvedBy: fetchedData.data.Approved_By || "",
          });
          // Set userRolesData for editing
          if (fetchedData.data.role) {
            setUserRolesData([{ roleName: fetchedData.data.role, active: true }]);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching User info:", err);
        setError("Failed to load user information. Please try again later.")
        setLoading(false);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load User information",
        });
      }
    };

    fetchUserInfoById();
  }, [user_id]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setEmailError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "userMail") {
      setEmailError("");
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = () => {
    if (!formData.userMail.trim()) {
      setEmailError("User Mail is required");
      return;
    } else if (!isValidEmail(formData.userMail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    toggleEdit();
  };

  const addUserRole = () => {
    if (
      selectedRole &&
      !userRolesData.some((item) => item.roleName === selectedRole)
    ) {
      setUserRolesData([
        ...userRolesData,
        { roleName: selectedRole, active: false },
      ]);
      setSelectedRole("");
    }
  };

  const toggleUserRole = (index) => {
    const updatedData = [...userRolesData];
    updatedData[index].active = !updatedData[index].active;
    setUserRolesData(updatedData);
  };

  const removeUserRole = (index) => {
    const updatedData = [...userRolesData];
    updatedData.splice(index, 1);
    setUserRolesData(updatedData);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Pagination
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = userRolesData.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 lg:px-8`}>
      <div className={`${GlobalStyle.headingLarge} mb-6 sm:mb-8`}>
        <span>{user_id} - {userInfo.username}</span>
      </div>

      {/* Card box */}
//       <div className={GlobalStyle.flexCenter}>
//         <div className={`${GlobalStyle.cardContainer} p-4`}>
//           {/* Edit Mode UI */}
//           {isEditing ? (
//             <div className="space-y-4">
//               <div className="flex justify-end items-center mb-4">
//                 <div className="flex items-center">
//                   {/* Active or Inactive User */}
//                   <label className="inline-flex relative items-center cursor-pointer">
//                     <input
//                       type="checkbox"
//                       className="sr-only peer"
//                       checked={isActive}
//                       onChange={() => setIsActive(!isActive)}
//                     />
//                     <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
//                   </label>
//                 </div>
//               </div>

//               {/* Edit Table */}
//               <div className="overflow-x-auto">
//                 <table className="mb-6 sm:mb-8 w-full">
//                   <tbody>
//                     {/* User type */}
//                     <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <label className={`${GlobalStyle.headingMedium} mb-2`}>
//                           User Type
//                         </label>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {formData.userType || "N/A"}
//                         </label>
//                       </td>
//                     </tr>

//                     {/* User Mail */}
//                     <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <label className={`${GlobalStyle.headingMedium} mb-2`}>
//                           User Mail
//                         </label>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                        <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {formData.userMail || "N/A"}
//                         </label>
//                       </td>
//                     </tr>

//                     {/* Login Method */}
//                     <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <label className={`${GlobalStyle.headingMedium} mb-2`}>
//                           Login Method
//                         </label>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {formData.loginMethod || "N/A"}
//                         </label>
//                       </td>
//                     </tr>

//                     {/* User Role Dropdown with Add Button */}
//                     <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <label className={`${GlobalStyle.headingMedium} mb-2`}>
//                           User Role
//                         </label>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <div className="flex items-center space-x-2">
//                           <select
//                             className={`${GlobalStyle.selectBox} flex-1`}
//                             value={selectedRole}
//                             onChange={(e) => setSelectedRole(e.target.value)}
//                           >
//                             <option value="">Select User Role</option>
//                             {availableRoles.map((role, index) => (
//                               <option key={index} value={role.role_name}>
//                                 {role.role_name}
//                               </option>
//                             ))}
//                           </select>
//                           <button
//                             className="bg-white rounded-full p-1 border border-gray-300 shrink-0"
//                             onClick={addUserRole}
//                             title="Add User Role"
//                             disabled={!selectedRole}
//                           >
//                             <img src={add} alt="Add" className="w-5 h-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>

//                     {/* User Roles Table */}
//                     <tr>
//                       <td colSpan="3">
//                         <div className="mb-4">
//                           <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
//                             <table className={GlobalStyle.table}>
//                               <thead className={GlobalStyle.thead}>
//                                 <tr>
//                                   <th scope="col" className={GlobalStyle.tableHeader}>
//                                     User Roles
//                                   </th>
//                                   <th scope="col" className={GlobalStyle.tableHeader}>  </th>
                                  
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {paginatedData.length > 0 ? (
//                                   paginatedData.map((row, index) => (
//                                     <tr
//                                       key={index}
//                                       className={`${
//                                         index % 2 === 0
//                                           ? GlobalStyle.tableRowEven
//                                           : GlobalStyle.tableRowOdd
//                                       } border-b`}
//                                     >
//                                       <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>
//                                         <span>{row.roleName}</span>
//                                       </td>
                                    
//                                       <td className={GlobalStyle.tableData}>
//                                         <div className="flex justify-center items-center">
//                                           <button
//                                             className="bg-white rounded-full p-1 border border-gray-300"
//                                             onClick={() => removeUserRole(index)}
//                                             title="Remove User Role"
//                                           >
//                                             <img src={remove} alt="Remove" className="w-5 h-5" />
//                                           </button>
//                                         </div>
//                                       </td>
//                                     </tr>
//                                   ))
//                                 ) : (
//                                   <tr>
//                                     <td colSpan="3" className="text-center py-4">
//                                       No results found
//                                     </td>
//                                   </tr>
//                                 )}
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>

//                     <tr className="h-4"></tr>

//                     {/* Created On */}
//                     <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <label className={`${GlobalStyle.headingMedium} mb-2`}>
//                           Created On
//                         </label>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {formatDate(formData.createdOn) || "N/A"}
//                         </label>
//                       </td>
//                     </tr>

//                     {/* Created by */}
//                     <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <label className={`${GlobalStyle.headingMedium} mb-2`}>
//                           Created By
//                         </label>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {formData.createdBy || "N/A"}
//                         </label>
//                       </td>
//                     </tr>

//                     {/* Approved on */}
//                     <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <label className={`${GlobalStyle.headingMedium} mb-2`}>
//                           Approved On
//                         </label>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {formatDate(formData.approvedOn) || "N/A"}
//                         </label>
//                       </td>
//                     </tr>

//                     {/* Approved by */}
//                     <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <label className={`${GlobalStyle.headingMedium} mb-2`}>
//                           Approved By
//                         </label>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {formData.approvedBy || "N/A"}
//                         </label>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>

//               <div className="flex flex-col sm:flex-row sm:items-start gap-2">
//                 <label
//                   className={`${GlobalStyle.headingMedium} sm:w-1/4 whitespace-nowrap`}
//                 >
//                   Remark
//                 </label>
//                 <span className="hidden sm:inline-block">:</span>
//                 <textarea
//                   className={`${GlobalStyle.inputText} w-full h-40`}
//                   value={remark}
//                   onChange={(e) => setRemark(e.target.value)}
//                 />
//               </div>

//               {/* Save button in edit mode */}
//               <div className="flex justify-end mt-4">
//                 <button
//                   onClick={handleSave}
//                   className={GlobalStyle.buttonPrimary}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <>
//               {/* View Mode UI */}
//               <div className="flex justify-end">
//                 <img
//                   src={edit}
//                   alt="Edit"
//                   className="w-6 h-6 sm:w-8 sm:h-8 mb-4 cursor-pointer"
//                   onClick={toggleEdit}
//                   title="Edit"
//                 />
//               </div>

//               {/* View Table */}
//               <div className="overflow-x-auto">
//                 <table className="mb-6 sm:mb-8 w-full">
//                   <tbody>
//                     {/* User type */}
//                     <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <p className={`${GlobalStyle.paragraph} mb-2`}>
//                           User Type
//                         </p>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {userInfo.user_type || "N/A"}
//                         </label>
//                       </td>
//                     </tr>

//                     {/* User Mail */}
//                     <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <p className={`${GlobalStyle.paragraph} mb-2`}>
//                           User Mail
//                         </p>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {userInfo.email || "N/A"}
//                         </label>
//                       </td>
//                     </tr>

//                     {/* Login Method */}
//                     <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <p className={`${GlobalStyle.paragraph} mb-2`}>
//                           Login Method
//                         </p>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {userInfo.login_method || "N/A"}
//                         </label>
//                       </td>
//                     </tr>

//                     {/* User Roles */}
//                     <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <p className={`${GlobalStyle.paragraph} mb-2`}>
//                           User Roles
//                         </p>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                     </tr>
//                     <tr>
//                       <td colSpan="3">
//                         <div className="mb-4">
//                           {/* User Roles Table */}
//                           <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
//                             <table className={GlobalStyle.table}>
//                               <thead className={GlobalStyle.thead}>
//                                 <tr>
//                                   <th scope="col" className={GlobalStyle.tableHeader}>
//                                     User Roles
//                                   </th>
//                                   <th scope="col" className={GlobalStyle.tableHeader}></th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {userInfo.role ? (
//                                   <tr className={`${GlobalStyle.tableRowOdd} border-b`}>
//                                     <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>
//                                       <span>{userInfo.role}</span>
//                                     </td>
//                                     <td className={GlobalStyle.tableData}>
//                                       <div className="flex justify-center items-center">
//                                         <img 
//                                           src={completeIcon} 
//                                           alt="Active" 
//                                           className="h-5 w-5 lg:h-6 lg:w-6"
//                                         />
//                                       </div>
//                                     </td>
//                                   </tr>
//                                 ) : (
//                                   <tr>
//                                     <td colSpan="2" className="text-center py-4">
//                                       No results found
//                                     </td>
//                                   </tr>
//                                 )}
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>

//                     {/* Created On */}
//                     <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <p className={`${GlobalStyle.paragraph} mb-2`}>
//                           Created On
//                         </p>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {formatDate(userInfo.Created_ON) || "N/A"}
//                         </label>
//                       </td>
//                     </tr>

//                     {/* Created by */}
//                     <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <p className={`${GlobalStyle.paragraph} mb-2`}>
//                           Created By
//                         </p>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {userInfo.Created_BY || "N/A"}
//                         </label>
//                       </td>
//                     </tr>

//                     {/* Approved on */}
//                     <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <p className={`${GlobalStyle.paragraph} mb-2`}>
//                           Approved On
//                         </p>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {formatDate(userInfo.Approved_On) || "N/A"}
//                         </label>
//                       </td>
//                     </tr>

//                     {/* Approved by */}
//                     <tr>
//                       <td className="w-1/3 sm:w-auto">
//                         <p className={`${GlobalStyle.paragraph} mb-2`}>
//                           Approved By
//                         </p>
//                       </td>
//                       <td className="text-center align-middle w-4 sm:w-auto">
//                         :
//                       </td>
//                       <td className="w-2/3 sm:w-auto">
//                         <label className={GlobalStyle.headingSmall}>
//                           {userInfo.Approved_By || "N/A"}
//                         </label>
//                       </td>
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//       {/* End button */}
//       <div className="flex justify-end pr-0 sm:pr-40 mt-4">
//         {!isEditing && !showEndSection && (
//           <button
//             className={GlobalStyle.buttonPrimary}
//             onClick={() => setShowEndSection(true)}
//           >
//             End
//           </button>
//         )}
//       </div>

//       {/* End Date and Remark Section */}
//       {showEndSection && (
//         <div className={GlobalStyle.flexCenter}>
//           <div className={`${GlobalStyle.cardContainer} p-4 w-full max-w-2xl`}>
//             <div className="space-y-4">
//               <div className="flex flex-col sm:flex-row sm:items-center gap-2">
//                 <label
//                   className={`${GlobalStyle.headingMedium} sm:w-1/4 whitespace-nowrap`}
//                 >
//                   End date
//                 </label>
//                 <span className="hidden sm:inline-block">:</span>
//                 <div className="w-full">
//                   <DatePicker
//                     selected={endDate}
//                     onChange={(date) => setEndDate(date)}
//                     dateFormat="dd/MM/yyyy"
//                     placeholderText="dd/MM/yyyy"
//                     className={`${GlobalStyle.inputText} w-full`}
//                   />
//                 </div>
//               </div>

//               <div className="flex flex-col sm:flex-row sm:items-start gap-2">
//                 <label
//                   className={`${GlobalStyle.headingMedium} sm:w-1/4 whitespace-nowrap`}
//                 >
//                   Remark
//                 </label>
//                 <span className="hidden sm:inline-block">:</span>
//                 <textarea
//                   className={`${GlobalStyle.inputText} w-full h-40`}
//                   value={remark}
//                   onChange={(e) => setRemark(e.target.value)}
//                 />
//               </div>

//               <div className="flex justify-end mt-4 space-x-2">
//                 <button
//                   onClick={() => {
//                     if (!endDate) {
//                       Swal.fire({
//                         title: "Warning",
//                         text: "End date is required",
//                         icon: "warning",
//                         allowOutsideClick: false,
//                         allowEscapeKey: false,
//                       });
//                       return;
//                     }
//                     if (!remark.trim()) {
//                       Swal.fire({
//                         title: "Warning",
//                         text: "Remark is required",
//                         icon: "warning",
//                         allowOutsideClick: false,
//                         allowEscapeKey: false,
//                       });
//                       return;
//                     }

//                     setShowEndSection(false);
//                   }}
//                   className={GlobalStyle.buttonPrimary}
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Log History button */}
//       <div className="flex gap-4 pl-0 sm:pl-20 my-4">
//         <button
//           className={GlobalStyle.buttonPrimary}
//           onClick={() => setShowLogHistory(!showLogHistory)}
//         >
//           Log History
//         </button>
//       </div>

//       {/* Log History Section */}
//       {showLogHistory && (
//         <div className={GlobalStyle.flexCenter}>
//           <div className={`${GlobalStyle.cardContainer} p-4 w-full max-w-4xl`}>
//             <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
//               <table className={GlobalStyle.table}>
//                 <thead className={GlobalStyle.thead}>
//                   <tr>
//                     <th scope="col" className={GlobalStyle.tableHeader}>
//                       Date
//                     </th>
//                     <th scope="col" className={GlobalStyle.tableHeader}>
//                       Action
//                     </th>
//                     <th scope="col" className={GlobalStyle.tableHeader}>
//                       Edited By
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {userInfo.Remark?.length > 0 ? (
//                     userInfo.Remark?.map((log, index) => (
//                       <tr
//                         key={index}
//                         className={`${
//                           index % 2 === 0
//                             ? GlobalStyle.tableRowEven
//                             : GlobalStyle.tableRowOdd
//                         } border-b`}
//                       >
//                         <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{formatDate(log.remark_dtm) || "N/A"}</td>
//                         <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{log.remark  || "N/A"}</td>
//                         <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{log.remark_by  || "N/A"}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="3" className="text-center py-4">
//                         No results found
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserInfo; */}
