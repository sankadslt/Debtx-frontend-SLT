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

  const goBack = () => {
        navigate(-1); 
        };

  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 10;

  const [loggedUserData, setLoggedUserData] =useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [remark, setRemark] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({
    username: "",
    user_type: "",
    email: "",
    login_method: "",
    role: "",
    Created_DTM: "",
    Created_BY: "",
    Approved_DTM: "",
    Approved_By: "",
    Remark: [],
    user_roles: [] // Added to store multiple roles
  });

  const [formData, setFormData] = useState({
    userType: "",
    userMail: "",
    loginMethod: "",
    userRole: "",
    createdOn: "",
    createdBy: "",
    approvedOn: "",
    approvedBy: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showEndSection, setShowEndSection] = useState(false);

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
          // Set formData for editing
          setFormData({
            userType: fetchedData.data.user_type || "",
            userMail: fetchedData.data.email || "",
            loginMethod: fetchedData.data.login_method || "",
            userRole: fetchedData.data.role || "",
            createdOn: fetchedData.data.Created_DTM || "",
            createdBy: fetchedData.data.Created_BY || "",
            approvedOn: fetchedData.data.Approved_DTM || "",
            approvedBy: fetchedData.data.Approved_By || "",
          });

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

  const toggleEdit = () => {
    setIsEditing(!isEditing);
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
        user_id: user_id,
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

      const payload = {
        user_id,
        end_by: loggedUserData,
        end_dtm: endDate.toISOString(),
        remark,
      };

      const response = await endUser(payload);
      // console.log(response);
      
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
        text: "User ended successfully",
      });
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

  // Filter log history based on search query
  const filteredLogHistory = userInfo.Remark?.filter((log) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (log.remark && log.remark.toLowerCase().includes(searchLower)) ||
      (log.remark_by && log.remark_by.toLowerCase().includes(searchLower)) ||
      (log.remark_dtm && formatDate(log.remark_dtm).toLowerCase().includes(searchLower))
    );
  }) || [];

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
      <div className="w-full flex justify-center">
        <div className={`${GlobalStyle.cardContainer} relative  w-full max-w-xl`}>
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
                    <tr className="align-middle">
                      <td className="w-1/3 sm:w-auto align-middle">
                        <p className={`${GlobalStyle.paragraph} mb-2 align-middle`}>
                          User Type
                        </p>
                      </td>
                      <td className="text-center w-4 sm:w-auto align-middle">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto align-middle">
                        <label className={`${GlobalStyle.headingSmall} align-middle`}>
                          {formData.userType || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* User Mail */}
                    <tr className="align-middle">
                      <td className="w-1/3 sm:w-auto align-middle">
                        <p className={`${GlobalStyle.paragraph} mb-2 align-middle`}>
                          User Mail
                        </p>
                      </td>
                      <td className="text-center w-4 sm:w-auto align-middle">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto align-middle">
                        <label className={`${GlobalStyle.headingSmall} align-middle`}>
                          {formData.userMail || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* Login Method */}
                    <tr className="align-middle">
                      <td className="w-1/3 sm:w-auto align-middle">
                        <p className={`${GlobalStyle.paragraph} mb-2 align-middle`}>
                          Login Method
                        </p>
                      </td>
                      <td className="text-center w-4 sm:w-auto align-middle">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto align-middle">
                        <label className={`${GlobalStyle.headingSmall} align-middle`}>
                          {formData.loginMethod || "N/A"}
                        </label>
                      </td>
                    </tr>

                    {/* User Role */}
                    <tr className="align-middle">
                        <td className="w-1/3 sm:w-auto align-middle">
                          <label className={`${GlobalStyle.paragraph} mb-2 align-middle`}>
                            User Role
                          </label>
                        </td>
                        <td className="text-center align-middle w-4 sm:w-auto">
                          :
                        </td>
                        <td className="w-2/3 sm:w-auto">
                          <div className="flex items-center space-x-2 my-2">
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
                          </div>
                        </td>
                    </tr>

                    <tr className="h-2"></tr>

                    {/* Created On */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <label className={`${GlobalStyle.paragraph} mb-2`}>
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

                    <tr className="h-2"></tr>

                    {/* Created by */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <label className={`${GlobalStyle.paragraph} mb-2`}>
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

                    <tr className="h-2"></tr>

                    {/* Approved on */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <label className={`${GlobalStyle.paragraph} mb-2`}>
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
                    
                    <tr className="h-2"></tr>

                    {/* Approved by */}
                    <tr>
                      <td className="w-1/3 sm:w-auto">
                        <label className={`${GlobalStyle.paragraph}`}>
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

                {/* Remark */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                  <label
                    className={`${GlobalStyle.paragraph} sm:w-1/4 whitespace-nowrap`}
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
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => {
                    if (userInfo.user_status !== "Terminate") {
                      toggleEdit();
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
                          User Role
                        </p>
                      </td>
                      <td className="text-center align-middle w-4 sm:w-auto">
                        :
                      </td>
                      <td className="w-2/3 sm:w-auto">
                        <label className={GlobalStyle.headingSmall}>
                          {userInfo.role || "N/A"}
                        </label>
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
                          {formatDate(userInfo.Created_DTM) || "N/A"}
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
                          {formatDate(userInfo.Approved_DTM) || "N/A"}
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

      {/* End Date and Remark Section */}
      {showEndSection && (
      <div className={`${GlobalStyle.flexCenter} px-2 sm:px-4 lg:px-8`}>
        <div className={`${GlobalStyle.cardContainer} p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-full sm:max-w-2xl md:max-w-4xl mx-auto`}>
            <div className="space-y-4">
              {/* End Date Picker */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className={`${GlobalStyle.paragraph} sm:w-1/4 whitespace-nowrap`}>
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

              {/* Remark Textarea */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                <label className={`${GlobalStyle.paragraph} sm:w-1/4 whitespace-nowrap`}>
                  Remark
                </label>
                <span className="hidden sm:inline-block">:</span>
                <textarea
                  className={`${GlobalStyle.inputText} w-full h-40`}
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={handleEndUser}
                  disabled={loading}
                  className={`${GlobalStyle.buttonPrimary} ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

{/* Log History button */}
      <div className="flex gap-4 pl-0 sm:pl-20 my-4">
        <button
          className={`${GlobalStyle.buttonPrimary}`}
          onClick={() => setShowPopup(true)}
        >
          Log History
        </button>
      </div>

      <div style={{ marginTop: '12px' }}>
          <button className={GlobalStyle.buttonPrimary} onClick={goBack}>
          <FaArrowLeft /> 
          </button>
      </div>

      {/* Log History Section - Updated as Popup with Working Search */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-lg w-3/4 max-h-[80vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Log History</h2>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-semibold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
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