/* Purpose: This template is used for the 17.1 - User List .
Created Date: 2025-06-06
Created By: sakumini (sakuminic@gmail.com)
Version: node 20
ui number :17.1
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the User list Screen */

import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import activeIcon from "../../assets/images/User/User_Active.png";
import deactiveIcon from "../../assets/images/User/User_Inactive.png";
import terminateIcon from "../../assets/images/User/User_Terminate.png";
import User_Pending_Approval from "../../assets/images/status/RO_DRC_Status_Icons/RO_Pending_Approval.png";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import more_info from "../../assets/images/more.svg";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";
import { getAllUserDetails } from "../../services/user/user_services"; 

const UserList = () => {
  const navigate = useNavigate();

  // State Variables
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userType, setUserType] = useState("");
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const rowsPerPage = 10;

  // Variables for table
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const hasMounted = useRef(false);
  const [committedFilters, setCommittedFilters] = useState({
    status: "",
    userRole: "",
    userType: ""
  });

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

  const callAPI = useCallback(async (filters) => {
    try {
      setIsLoading(true);
      const requestData = {
        page: filters.page || 1,
        user_role: filters.userRole || "",
        user_type: filters.userType || "",
        user_status: filters.status || ""
      };

      const response = await getAllUserDetails(requestData);
      console.log("API Response:", response);

      // Handle Python backend response
      const userData = response?.data || response;
      
      if (Array.isArray(userData)) {
        const newUsers = userData.map((user) => ({
          user_id: user.user_id,
          status: 
            Array.isArray(user.user_status) && user.user_status.length > 0
              ? user.user_status[0].status
              : "N/A",
          user_type: user.user_type?.toUpperCase() || "",
          user_role: 
            Array.isArray(user.role) && user.role.length > 0
              ? user.role[0].role_name
              : "N/A",
          user_name: user.User_profile.username,
          user_email: user.User_profile.email,
          contact_num:
            Array.isArray(user.user_contact_num) && user.user_contact_num.length > 0
              ? user.user_contact_num[0].contact_number
              : "N/A",
          created_on: new Date(user.create_on.$date).toLocaleDateString("en-CA")
        }));

        // Update state
        if (filters.page === 1) {
          setAllData(newUsers);
          setFilteredData(newUsers);
          
          // Show message if no data found
          if (newUsers.length === 0) {
            showNoDataMessage(filters.status, filters.userRole, filters.userType);
          }
        } else {
          setFilteredData(prev => [...prev, ...newUsers]);
        }

        setHasMoreData(newUsers.length === (filters.page === 1 ? 10 : 30));
        
      } else {
        throw new Error("No valid user data found");
      }
    } catch (error) {
      console.error("Error fetching user list:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to fetch users",
        icon: "error",
        confirmButtonColor: "#d33"
      });
      setFilteredData([]);
      setHasMoreData(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update the showNoDataMessage function
  const showNoDataMessage = (status = "", userRole = "", userType = "") => {
    let message = "No users available";
    
    if (status || userRole || userType) {
      const filters = [];
      if (status) filters.push(status);
      if (userRole) filters.push(userRole);
      if (userType) filters.push(userType);
      message = `No users found with ${filters.join(', ')} filters`;
    }

    Swal.fire({
      title: "No Records Found",
      text: message,
      icon: "info",
      iconColor: "#ff9999",
      confirmButtonColor: "#ff9999",
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  };

  // Handle pagination
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMoreData || currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle filter button 
  const handleFilterButton = () => {
    if (!status && !userRole && !userType) {
      Swal.fire({
        title: "Warning",
        text: "No filter is selected. Please, select a filter.",
        icon: "warning",
        confirmButtonColor: "#f1c40f"
      });
      return;
    }

    setHasMoreData(true);
    setMaxCurrentPage(0);
    setCommittedFilters({ status, userRole, userType });
    setFilteredData([]);
    
    if (currentPage === 1) {
      callAPI({ 
        status, 
        userRole, 
        userType, 
        page: 1 
      });
    } else {
      setCurrentPage(1);
    }
  };

  // Handle clear 
  const handleClear = () => {
    setStatus("");
    setUserRole("");
    setUserType("");
    setSearchQuery("");
    setMaxCurrentPage(0);
    setCommittedFilters({ status: "", userRole: "", userType: "" });
    
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      callAPI({ status: "", userRole: "", userType: "", page: 1 });
    }
  };

  const handleUserRegister = () => navigate("/pages/user/signup");

  // Effect for API calls
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      callAPI({ status: "", userRole: "", userType: "", page: 1 });
      return;
    }

    if (hasMoreData && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage);
      callAPI({
        ...committedFilters,
        page: currentPage
      });
    }
  }, [currentPage, committedFilters, callAPI, hasMoreData, maxCurrentPage]);

  // Filter data (search query) 
  const filteredDataBySearch = paginatedData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const formatRoleLabel = (value) => {
    // Check if value exists and is a string
    if (!value || typeof value !== 'string') {
      return "N/A";
    }

    return value
      .split("_")
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 lg:px-8`}>
      <h2 className={GlobalStyle.headingLarge}>User List</h2>

      <div className="flex justify-end mt-2 sm:mt-0">
        <button 
          className={GlobalStyle.buttonPrimary} 
          onClick={handleUserRegister}
        >
          User Register
        </button>
      </div>

      {/* Search and Filters - Responsive */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 mt-4 gap-4 lg:gap-0">
        {/* Search Bar */}
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            placeholder=" "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${GlobalStyle.inputSearch} w-full`}
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>

        {/* Filters */}
        <div className={`${GlobalStyle.cardContainer} w-full lg:w-auto`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 items-center">
            {/* User Role Filter */}
            <div className="w-full">
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className={`${GlobalStyle.selectBox} w-full`}
                style={{ color: userRole === "" ? "gray" : "black" }}
              >
                {userRoles.map((role) => (
                  <option
                    key={role.value}
                    value={role.value}
                    hidden={role.hidden}
                    style={{ color: "black" }}
                  >
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* User Type Filter */}
            <div className="w-full">
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className={`${GlobalStyle.selectBox} w-full`}
                style={{ color: userType === "" ? "gray" : "black" }}
              >
                <option value="" hidden>User Type</option>
                <option value="Slt" style={{ color: "black" }}>SLT</option>
                <option value="Drcuser" style={{ color: "black" }}>DRC User</option>
                <option value="ro" style={{ color: "black" }}>RO</option>
              </select>
            </div>
            
            {/* Status Filter */}
            <div className="w-full">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`${GlobalStyle.selectBox} w-full`}
                style={{ color: status === "" ? "gray" : "black" }}
              >
                <option value="" hidden>Status</option>
                <option value="Active" style={{ color: "black" }}>Active</option>
                <option value="Inactive" style={{ color: "black" }}>Inactive</option>
                <option value="Pending-approval" style={{ color: "black" }}>Pending Approval</option>
                <option value="Terminate" style={{ color: "black" }}>Terminated</option>
              </select>
            </div>
            
            {/* Filter Button */}
            <button
              onClick={handleFilterButton}
              className={`${GlobalStyle.buttonPrimary} w-full`}
            >
              Filter
            </button>

            {/* Clear Button */}
            <button
              onClick={handleClear}
              className={`${GlobalStyle.buttonRemove} w-full`}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Table Container - Responsive */}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
          {/* Desktop Table View */}
          <table className={`${GlobalStyle.table} md:table min-w-full`}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th scope="col" className={`${GlobalStyle.tableHeader}`}>USER ID</th>
                <th scope="col" className={`${GlobalStyle.tableHeader}`}>STATUS</th>
                <th scope="col" className={`${GlobalStyle.tableHeader}`}>USER TYPE</th>
                <th scope="col" className={`${GlobalStyle.tableHeader}`}>USER ROLE</th>
                <th scope="col" className={`${GlobalStyle.tableHeader}`}>USER NAME</th>
                <th scope="col" className={`${GlobalStyle.tableHeader}`}>USER EMAIL</th>
                <th scope="col" className={`${GlobalStyle.tableHeader}`}>CONTACT NO.</th>
                <th scope="col" className={`${GlobalStyle.tableHeader}`}>CREATED ON</th>
                <th scope="col" className={`${GlobalStyle.tableHeader}`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredDataBySearch.length > 0 ? (
                filteredDataBySearch.map((user, index) => (
                  <tr key={user.user_id} 
                    className={`${
                      index % 2 === 0
                        ? "bg-white bg-opacity-75"
                        : "bg-gray-50 bg-opacity-50"
                    } border-b`}
                  >
                    <td
                      className={`${GlobalStyle.tableData} w-[100px] max-w-[100px] truncate`}
                      title={user.user_id}
                    >
                      {user.user_id}
                    </td>
                    <td className={`${GlobalStyle.tableData}`}>
                      <div className="flex items-center justify-center">
                        <img 
                          src={
                            user.status === "Active"
                              ? activeIcon
                              : user.status === "Inactive"
                              ? deactiveIcon
                              : user.status === "Terminate"
                              ? terminateIcon
                              : User_Pending_Approval
                          }
                          alt={
                            user.status === "Active"
                              ? "Active"
                              : user.status === "Inactive"
                              ? "Inactive"
                              : user.status === "Terminate"
                              ? "Terminated"
                              : "Pending Approval"
                          }
                          data-tooltip-id={`status-${user.user_id}`}
                          data-tooltip-content={
                            user.status === "Active"
                              ? "Active"
                              : user.status === "Inactive"
                              ? "Inactive"
                              : user.status === "Terminate"
                              ? "Terminated"
                              : "Pending Approval"
                          }
                          className="h-5 w-5 lg:h-6 lg:w-6"
                        />
                      </div>
                      <Tooltip id={`status-${user.user_id}`} place="bottom" content={
                        user.status === "Active"
                          ? "Active"
                          : user.status === "Inactive"
                          ? "Inactive"
                          : user.status === "Terminate"
                          ? "Terminated"
                          : "Pending Approval"
                      } />
                    </td>
                    <td className={`${GlobalStyle.tableData}`}>{user.user_type || "N/A"}</td>
                    <td className={`${GlobalStyle.tableData}`}>{formatRoleLabel(user.user_role)}</td>
                    <td className={`${GlobalStyle.tableData}`}>{user.user_name || "N/A"}</td>
                    <td className={`${GlobalStyle.tableData}`}>{user.user_email || "N/A"}</td>
                    <td className={`${GlobalStyle.tableData}`}>{user.contact_num || "N/A"}</td>
                    <td className={`${GlobalStyle.tableData}`}>{user.created_on || "N/A"}</td>
                    <td className={`${GlobalStyle.tableData}`}>
                      <div className="flex justify-center">
                        <Link to="/pages/User/UserInfo" state={{ user_id: user.user_id }}>
                          <img src={more_info} alt="More Info" className="h-5 w-5 lg:h-6 lg:w-6" data-tooltip-id={`more-info-tooltip-${user.user_id}`} />
                        </Link>
                        <Tooltip id={`more-info-tooltip-${user.user_id}`} place="bottom" content="More Info" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    {status || userRole || userType || searchQuery 
                      ? "No matching users found" 
                      : "No users available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div> 

      {/* Pagination Section */}
      {filteredDataBySearch.length > 0 && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            className={`${GlobalStyle.navButton} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <FaArrowLeft />
          </button>

          <span>Page {currentPage}</span>

          <button
            className={`${GlobalStyle.navButton} ${
              !hasMoreData && currentPage >= Math.ceil(filteredData.length / rowsPerPage) 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
            onClick={handleNextPage}
            disabled={!hasMoreData && currentPage >= Math.ceil(filteredData.length / rowsPerPage)}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;