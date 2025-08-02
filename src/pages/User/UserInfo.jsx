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
import Swal from "sweetalert2";
import { endUser, getUserDetailsById, updateUserDetails } from "../../services/user/user_services";
import completeIcon from "../../assets/images/complete.png";
import remove from "../../assets/images/remove.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getLoggedUserId } from "../../services/auth/authService";

const UserInfo = () => {
  const location = useLocation();
  const user_id = location.state?.user_id;
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); 
  };

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;
  const [loggedUserData, setLoggedUserData] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [remark, setRemark] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // User info state
  const [userInfo, setUserInfo] = useState({
    username: "",
    user_type: "",
    email: "",
    contact_num: "",
    login_method: "",
    role: "",
    Created_DTM: "",
    Created_BY: "",
    Approved_DTM: "",
    Approved_By: "",
    Remark: [],
    user_status: "Active"
  });

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [showEndSection, setShowEndSection] = useState(false);

   const [userRolesList, setUserRolesList] = useState([]);

  // Available roles dropdown
  const userRoles = [
    { value: "", label: "User Role", hidden: true },
    { value: "GM", label: "GM" },
    { value: "DGM", label: "DGM" },
    { value: "legal_officer", label: "Legal Officer" },
    { value: "manager", label: "Manager" },
    { value: "slt_coordinator", label: "SLT Coordinator" },
    { value: "DRC_user", label: "DRC User" },
    { value: "recovery_staff", label: "Recovery Staff" },
    { value: "rtom", label: "RTOM" }
  ];

  // get system user
  const loadUser = async () => {
    const user = await getLoggedUserId();
    setLoggedUserData(user);
  };

  useEffect(() => {
    const fetchUserInfoById = async () => {
      try {
        setLoading(true);
        const fetchedData = await getUserDetailsById(user_id);
        console.log(fetchedData);
        
        if (fetchedData) {
          setUserInfo(fetchedData.data);
          setIsActive(fetchedData.data.user_status === "Active");
          setSelectedRole(fetchedData.data.role);
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

    loadUser();
    fetchUserInfoById();
  }, [user_id]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setShowEndSection(false);
    setEmailError("");
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

      const updateData = {
        user_id: String(user_id),
        updated_by: loggedUserData,
        role: selectedRole,
        user_status: isActive ? "Active" : "Inactive",
        remark: remark
      };

      const response = await updateUserDetails(updateData);

      if (response.status === "success") {
        const fetchedData = await getUserDetailsById(user_id);
        if (fetchedData) {
          setUserInfo(fetchedData.data);
        }

        setRemark("");
        toggleEditMode();

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

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
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
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to terminate this user?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, terminate user!",
        cancelButtonText: "Cancel",
      });
  
      if (!confirmResult.isConfirmed) {
        return;
      }
  
      setLoading(true);

      Swal.fire({
        title: "Processing...",
        text: "Please wait while terminating user",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const payload = {
        user_id,
        end_by: loggedUserData,
        end_dtm: endDate.toISOString(),
        remark,
      };

      const response = await endUser(payload);
      console.log(response);
      
      // Refresh user data if termination succeeded
      const fetchedData = await getUserDetailsById(user_id);
      if (fetchedData?.data) {
        setUserInfo(fetchedData.data);
      }

      // Reset UI
      setShowEndSection(false);
      setRemark("");
      setEndDate(null);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User terminated successfully",
      });
    } catch (err) {
      console.error("Error terminating user:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to terminate user",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter log history based on search query
  const filteredLogHistory = userInfo.Remark?.filter((log) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (log.remark && log.remark.toLowerCase().includes(searchLower)) ||
      (log.remark_by && log.remark_by.toLowerCase().includes(searchLower)) ||
      (log.remark_dtm && formatDate(log.remark_dtm).toLowerCase().includes(searchLower))
    );
  }) || [];

  const formatRoleLabel = (value) => {
    if (!value) return "N/A";

    return value
      .split("_")
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  };

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

      <div className="w-full flex justify-center">
        <div className={`${GlobalStyle.cardContainer} relative w-3/4 max-w-4xl`}>
          {editMode ? (
            <div className="space-y-4">
              {/* Status Toggle */}
              <div className="flex justify-end items-center mb-4">
                <div className="flex items-center">
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isActive}
                      onChange={() => setIsActive(!isActive)}
                    />
                    <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    <span className="ml-3 text-sm font-medium">
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </label>
                </div>
              </div>

             <div >
                <h2 className={`${GlobalStyle.headingMedium} mb-4 sm:mb-4 mt-6 ml-8 underline text-left font-semibold`}>
                  User Profile
                </h2>
  
          <table className="mb-6 w-full ml-14">
            <tbody>

              <tr className="block sm:table-row">
                <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                  User Name<span className="sm:hidden  ">:</span>
                </td>
                <td className="w-4 text-left hidden sm:table-cell">:</td>
                <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                  {userInfo.username || "Not specified"}
                </td>
              </tr>


              <tr className="block sm:table-row">
                <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                  User Mail<span className="sm:hidden">:</span>
                </td>
                <td className="w-4 text-left hidden sm:table-cell">:</td>
                <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                  {userInfo.email || "Not specified"}
                </td>
              </tr>

              <tr className="block sm:table-row">
                <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                  NIC<span className="sm:hidden  ">:</span>
                </td>
                <td className="w-4 text-left hidden sm:table-cell">:</td>
                <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                  {userInfo.usernic || "Not specified"}
                </td>
              </tr>

              <tr className="block sm:table-row">
                <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                  Designation<span className="sm:hidden  ">:</span>
                </td>
                <td className="w-4 text-left hidden sm:table-cell">:</td>
                <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                  {userInfo.user_designation || "Not specified"}
                </td>
              </tr>

            </tbody>
          </table>

          <h2 className={`${GlobalStyle.headingMedium} mb-4 sm:mb-4 mt-8 ml-8 underline text-left font-semibold`}>
            Contact Details
          </h2>
          
          <table className="mb-6 w-full ml-14 ">
            <tbody>
              <tr className="block sm:table-row">
                <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                  Contact No 01<span className="sm:hidden">:</span>
                </td>
                <td className="w-4 text-left hidden sm:table-cell">:</td>
                <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                  {Array.isArray(userInfo.contact_num) && userInfo.contact_num.length > 0
                    ? userInfo.contact_num[0].contact_number
                    : "Not specified"}
                </td>
              </tr>

              <tr className="block sm:table-row">
                <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                  Contact No 02<span className="sm:hidden">:</span>
                </td>
                <td className="w-4 text-left hidden sm:table-cell">:</td>
                <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                  {Array.isArray(userInfo.contact_num) && userInfo.contact_num.length > 0
                    ? userInfo.contact_num[0].contact_number
                    : "Not specified"}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="mb-6 w-full ml-8">
            <tbody>

              <tr className="block sm:table-row ">
                <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell `}>
                  User type<span className="sm:hidden ">:</span>
                </td>
                <td className="w-4 text-left hidden sm:table-cell">:</td>
                <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                  {userInfo.user_type || "Not specified"}
                </td>
              </tr>

              <tr className="block sm:table-row">
                <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                  Login Method<span className="sm:hidden">:</span>
                </td>
                <td className="w-4 text-left hidden sm:table-cell">:</td>
                <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                  {userInfo.login_method || "Not specified"}
                </td>
              </tr>

              
              <tr className="block sm:table-row mb-4">
                <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                  User Role<span className="text-red-500">*</span><span className="sm:hidden">:</span>
                </td>
                <td className="w-4 text-left hidden sm:table-cell">:</td>
                <td className={`${GlobalStyle.tableData} text-left block sm:table-cell`}>
                  <div className="flex flex-col gap-2">
                    <select
                      value={selectedRole}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        if (newRole && !userRolesList.includes(newRole)) {
                          setSelectedRole(newRole);
                          setUserRolesList([...userRolesList, newRole]);
                        }
                      }}
                      className={`${GlobalStyle.selectBox} w-full sm:w-3/4`}
                      style={{ color: selectedRole === "" ? "gray" : "black" }}
                    >
                      <option value="" disabled hidden>
                        Select Role
                      </option>
                      {userRoles.map((role) => (
                        <option
                          key={role.value}
                          value={role.value}
                          hidden={role.hidden}
                          style={{ color: "black" }}
                          disabled={userRolesList.includes(role.value)}
                        >
                          {role.label}
                        </option>
                      ))}
                    </select>

                    {userRolesList.length > 0 && (
                      <div className={`${GlobalStyle.inputText} w-full sm:w-3/4 flex flex-wrap items-center gap-2 mt-4 p-2`}>
                        {userRolesList.map((role, index) => (
                          <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                            <span className="text-blue-900 mr-2">
                              {userRoles.find(r => r.value === role)?.label || role}
                            </span>
                            <button
                              onClick={() => {
                                setUserRolesList(userRolesList.filter(r => r !== role));
                                if (selectedRole === role) {
                                  setSelectedRole("");
                                }
                              }}
                              className="text-blue-900 hover:text-red-600 font-bold"
                              title="Remove role"
                              type="button"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
              <br></br>

              <tr className="block sm:table-row">
                <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                  Created On<span className="sm:hidden">:</span>
                </td>
                <td className="w-4 text-left hidden sm:table-cell">:</td>
                <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                  {formatDate(userInfo.Created_DTM) || "Not specified"}
                </td>
              </tr>

              <tr className="block sm:table-row">
                <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                  Created By<span className="sm:hidden">:</span>
                </td>
                <td className="w-4 text-left hidden sm:table-cell">:</td>
                <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                  {userInfo.Created_BY || "Not specified"}
                </td>
              </tr>
            </tbody>
          </table>
      </div>

               
               
             

              {/* Save button in edit mode */}
              <div className="flex justify-end gap-4 mt-8">
               
                <button
                  onClick={handleSave}
                  className={`${GlobalStyle.buttonPrimary} px-4 sm:px-6 py-2`}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save "}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* View Mode UI */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => {
                    if (userInfo.user_status !== "Terminate") {
                      toggleEditMode();
                    }
                  }}
                  className={`${
                    userInfo.user_status === "Terminate" 
                      ? "opacity-50 cursor-not-allowed" 
                      : ""
                  }`}
                  disabled={userInfo.user_status === "Terminate"}
                >
                  <img
                    src={edit}
                    alt="Edit"
                    className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg cursor-pointer w-10 sm:w-14"
                    title="Edit"
                  />
                </button>
              </div>

              {/* View Table */}
              <div className="overflow-x-auto">
                <table className="mb-6 sm:mb-8 w-full">
                  <tbody>
                    {/* User type */}
                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        User type<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.user_type || "Not specified"}
                      </td>
                    </tr>

                    {/* User Mail */}
                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        User Mail<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.email || "Not specified"}
                      </td>
                    </tr>

                    {/* User Contact */}
                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Contact No.<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {Array.isArray(userInfo.contact_num) && userInfo.contact_num.length > 0
                          ? userInfo.contact_num[0].contact_number
                          : "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Login Method<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.login_method || "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        User Role<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {formatRoleLabel(userInfo.role) || "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Created On<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {formatDate(userInfo.Created_DTM) || "Not specified"}
                      </td>
                    </tr>

                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Created By<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.Created_BY || "Not specified"}
                      </td>
                    </tr>

                    
                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Approved On<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {formatDate(userInfo.Approved_DTM) || "Not specified"}
                      </td>
                    </tr>

                  
                    <tr className="block sm:table-row">
                      <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap text-left w-full sm:w-1/3 block sm:table-cell`}>
                        Approved By<span className="sm:hidden">:</span>
                      </td>
                      <td className="w-4 text-left hidden sm:table-cell">:</td>
                      <td className={`${GlobalStyle.tableData} text-gray-500 text-left block sm:table-cell`}>
                        {userInfo.Approved_By || "Not specified"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* End Date and Remark Section */}
      {showEndSection && (
        <div className="w-full flex justify-center mt-6">
          <div className={`${GlobalStyle.cardContainer} relative w-full max-w-4xl px-4 sm:px-6`}>
            <table className={`${GlobalStyle.table} w-full text-left`}>
              <tbody className="space-y-4 sm:space-y-0">
                {/* End Date Row */}
                <tr className="block sm:table-row">
                  <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>
                    End Date <span className="text-red-500">*</span>
                  </td>
                  <td className="w-4 text-left hidden sm:table-cell">:</td>
                  <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
                    <div className="flex justify-start w-full">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                        className={`${GlobalStyle.inputText} w-full text-left`}
                        minDate={new Date()}
                      />
                    </div>
                  </td>
                </tr>
      
                {/* Remark Row */}
                <tr className="block sm:table-row">
                  <td className={`${GlobalStyle.tableData} font-medium whitespace-nowrap hidden sm:table-cell w-1/3 sm:w-1/4`}>
                    Remark <span className="text-red-500">*</span>
                  </td>
                  <td className="w-4 text-left hidden sm:table-cell">:</td>
                  <td className={`${GlobalStyle.tableData} hidden sm:table-cell`}>
                    <textarea
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      rows="4"
                      className={`${GlobalStyle.inputText} w-full text-left`}
                      placeholder="Enter reason for terminating user"
                      required
                    />
                  </td>
                </tr>
              </tbody>
            </table>
      
            <div className="flex justify-end mt-4">
              <button
                onClick={handleEndUser}
                className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`}
              >
                End
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between mx-8 mt-6">
        <div className="flex flex-col items-start">
          {/* Log History button */}
          <button
            className={`${GlobalStyle.buttonPrimary}`}
            onClick={() => setShowPopup(true)}
          >
            Log History
          </button>

          <div style={{ marginTop: '15px' }}>
            <button 
              className={`${GlobalStyle.buttonPrimary}`}
              onClick={goBack}
            >
              <FaArrowLeft />
            </button>
          </div>
        </div>
        
        {/* End button */}
        <div className="flex justify-end h-fit">
          {!editMode && !showEndSection && (
            <button
              onClick={() => {
                if (userInfo.user_status !== "Terminate") {
                  setShowEndSection(true);
                }
              }}
              className={`${GlobalStyle.buttonPrimary} ${
                userInfo.user_status === "Terminate" 
                  ? "opacity-50 cursor-not-allowed" 
                  : ""
              }`}
              disabled={userInfo.user_status === "Terminate"}
            >
              End
            </button>
          )}
        </div>
      </div>

      {/* Log History Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-3/4 max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Log History</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="text-red-500 text-lg font-bold"
                title="Close"
              >
                ×
              </button>
            </div>

            <div className="mb-4 flex justify-start">
              <div className={GlobalStyle.searchBarContainer}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={GlobalStyle.inputSearch}
                />
                <FaSearch className={GlobalStyle.searchBarIcon} />
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-auto max-h-[70vh]">
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
                    {filteredLogHistory.length > 0 ? (
                      filteredLogHistory.map((log, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0
                              ? GlobalStyle.tableRowEven
                              : GlobalStyle.tableRowOdd
                          } border-b`}
                        >
                          <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>
                            {formatDate(log.remark_dtm) || "N/A"}
                          </td>
                          <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>
                            {log.remark || "N/A"}
                          </td>
                          <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>
                            {log.remark_by || "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-4">
                          {searchQuery ? "No matching results found" : "No results found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;