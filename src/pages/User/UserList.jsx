/* Purpose: This template is used for the 17.1 - User List .
Created Date: 2025-06-06
Created By: sakumini (sakuminic@gmail.com)
Version: node 20
ui number :17.1
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the User list Screen */

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import activeIcon from "../../assets/images/User/User_Active.png";
import deactiveIcon from "../../assets/images/User/User_Inactive.png";
import terminateIcon from "../../assets/images/User/User_Terminate.png";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import more_info from "../../assets/images/more.svg";
import Swal from "sweetalert2";
import { getAllUserDetails } from "../../services/user/user_services"; 

const UserList = () => {
  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Filter States
  const [status, setStatus] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userType, setUserType] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ 
    status: "", 
    userRole: "", 
    userType: "" 
  });
  
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true); // State to track if more data is available
  const rowsPerPage = 10;

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

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const hasMounted = useRef(false);

  const fetchUsers = async (filters) => {
    setIsLoading(true);
    setError(null);

    try {
      const requestData = {
        page: filters.page,
        user_role: filters.userRole,
        user_type: filters.userType,
        user_status: filters.status
      }
      
      // console.log("Payload sent to API: ", requestData);

      const response = await getAllUserDetails(requestData);
      // console.log("API Response:", response);

      if (response && response.status === "success" && Array.isArray(response.data)) {
        if (response.data.length === 0) {
          setIsMoreDataAvailable(false); // No more data

          if (currentPage === 1) {
            Swal.fire({
              title: "No Results",
              text: "No matching users found for the selected filters.",
              icon: "warning",
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonColor: "#f1c40f",
            });
          } else if (currentPage === 2) {
            setCurrentPage(1); // Reset to page 1 if no data on page 2
          }
          
          setFilteredData([]); // Clear data on no results
        } else {
          const maxData = currentPage === 1 ? 10 : 30;

          // Append new users to existing data
          setFilteredData((prevData) => [
            ...prevData,
            ...response.data.map(user => ({
              user_id: user.user_id,
              status: user.user_status,
              user_type: user.user_type?.toUpperCase() || "",
              user_role: user.role,
              user_name: user.username,
              user_email: user.email,
              created_on: new Date(user.Created_DTM).toLocaleDateString("en-CA"),
            })),
          ]);

          // If fewer than max data returned, no more data available
          if (response.data.length < maxData) {
            setIsMoreDataAvailable(false);
          }
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "No valid user data found in response.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message || "Failed to fetch users");
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage);
      fetchUsers({
        ...appliedFilters,
        page: currentPage
      });
    }
  }, [currentPage]);

  // Handle Pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next") {
      if (isMoreDataAvailable) {
        setCurrentPage(currentPage + 1);
      } else {
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        setTotalPages(totalPages);
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      }
    }
  };

  // Validate filters before calling the API
  const filterValidations = () => {
    if (!userRole && !userType && !status) {
      Swal.fire({
        title: "Warning",
        text: "No filter is selected. Please, select a filter.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f"
      });
      return false;
    }

    return true;
  };

  const handleFilterButton = () => {
    setIsMoreDataAvailable(true);
    setTotalPages(0);
    setMaxCurrentPage(0);

    const isValid =filterValidations();
    if (!isValid) {
      return;
    } else {
      setAppliedFilters({
        userRole :userRole,
        userType :userType,
        status :status
      });
      setFilteredData([]);
      if (currentPage === 1) {
        fetchUsers({
          page: 1,
          userRole,
          userType,
          status
        });
      }else {
        setCurrentPage(1);
      }
    }

  }

  const handleClear = () => {
    // Clear both the form fields and applied filters
    setStatus("");
    setUserRole("");
    setUserType("");
    
    // Reset Search Query
    setSearchQuery("");

    // Reset Pagination
    setTotalPages(0); // Reset total pages
    setFilteredData([]); // Clear filtered data
    setMaxCurrentPage(0); // Reset max current page
    setIsMoreDataAvailable(true);

    setAppliedFilters({ 
      status: "", 
      userRole: "", 
      userType: "" 
    });

    if (currentPage != 1) {
      setCurrentPage(1); // Reset to page 1
    } else {
      setCurrentPage(0); // Temp set to 0
      setTimeout(() => setCurrentPage(1), 0); // Reset to 1 after
    }
  };

  // Search Section
  const filteredDataBySearch = paginatedData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (e) => {
    setStatus(e.target.value || "");
  };

  const handleUserRoleChange = (e) => {
    setUserRole(e.target.value || "");
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value || "");
  };

  const showTooltip = (id) => {
    setTooltipVisible(id);
  };

  const hideTooltip = () => {
    setTooltipVisible(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) return <div className="flex justify-center items-center h-64 text-red-500">Error: {error}</div>;

  return (
    <div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 lg:px-8`}>
      {/* Header Section - Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
        <h1 className={`${GlobalStyle.headingLarge} text-xl sm:text-2xl lg:text-3xl`}>User List</h1>
        <Link to="/config/add-user">
          <button className={GlobalStyle.buttonPrimary}>
            User Register
          </button>
        </Link>
      </div>

      {/* Search and Filters - Responsive */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4 lg:gap-0">
        {/* Search Bar */}
        <div className={GlobalStyle.searchBarContainer} >
          <input
            type="text"
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
                onChange={handleUserRoleChange}
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
                onChange={handleUserTypeChange}
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
                onChange={handleStatusChange}
                className={`${GlobalStyle.selectBox} w-full`}
                style={{ color: status === "" ? "gray" : "black" }}
              >
                <option value="" hidden>Status</option>
                <option value="true" style={{ color: "black" }}>Active</option>
                <option value="false" style={{ color: "black" }}>Inactive</option>
                <option value="terminate" style={{ color: "black" }}>Terminated</option>
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
                <th scope="col" className={`${GlobalStyle.tableHeader} text-xs lg:text-sm`}>USER ID</th>
                <th scope="col" className={`${GlobalStyle.tableHeader} text-xs lg:text-sm`}>STATUS</th>
                <th scope="col" className={`${GlobalStyle.tableHeader} text-xs lg:text-sm`}>USER TYPE</th>
                <th scope="col" className={`${GlobalStyle.tableHeader} text-xs lg:text-sm`}>USER ROLE</th>
                <th scope="col" className={`${GlobalStyle.tableHeader} text-xs lg:text-sm`}>USER NAME</th>
                <th scope="col" className={`${GlobalStyle.tableHeader} text-xs lg:text-sm`}>USER EMAIL</th>
                <th scope="col" className={`${GlobalStyle.tableHeader} text-xs lg:text-sm`}>CREATED ON</th>
                <th scope="col" className={`${GlobalStyle.tableHeader} text-xs lg:text-sm`}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredDataBySearch.map((user, index) => (
                <tr key={user.user_id} 
                  className={`${
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }`}
                >
                  <td className={`${GlobalStyle.tableData}`}>{user.user_id}</td>
                  <td className={`${GlobalStyle.tableData}`}>
                    <div className="relative flex items-center justify-center">
                      <div className="relative">
                        <img 
                          src={
                            user.status === "true"
                              ? activeIcon
                              : user.status === "false"
                              ? deactiveIcon
                              : terminateIcon
                          }
                          alt={
                            user.status === "true"
                              ? "Active"
                              : user.status === "false"
                              ? "Inactive"
                              : "Terminated"
                          }
                          className="h-5 w-5 lg:h-6 lg:w-6"
                          onMouseEnter={() => showTooltip(`status-${user.user_id}`)}
                          onMouseLeave={hideTooltip}
                        />
                        {tooltipVisible === `status-${user.user_id}` && (
                          <div className="absolute left-1/2 bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap transform -translate-x-1/2 z-10">
                            {user.status === "true"
                              ? "Active"
                              : user.status === "false"
                              ? "Inactive"
                              : "Terminated"}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={`${GlobalStyle.tableData}`}>{user.user_type}</td>
                  <td className={`${GlobalStyle.tableData}`}>{user.user_role}</td>
                  <td className={`${GlobalStyle.tableData}`}>{user.user_name}</td>
                  <td className={`${GlobalStyle.tableData}`}>{user.user_email}</td>
                  <td className={`${GlobalStyle.tableData}`}>{user.created_on}</td>
                  <td className={`${GlobalStyle.tableData}`}>
                    <div className="flex justify-center">
                      <Link to="/pages/User/UserInfo" state={{ user_id: user.user_id }}>
                        <img src={more_info} alt="More Info" className="h-5 w-5 lg:h-6 lg:w-6" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-sm">
                    No results found
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
            onClick={() => handlePrevNext("prev")}
            disabled={currentPage <= 1}
            className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed" : ""}`}
          >
            <FaArrowLeft />
          </button>
          <span className={`${GlobalStyle.pageIndicator} mx-4 my-auto`}>
            Page {currentPage}
          </span>
          <button
            onClick={() => handlePrevNext("next")}
            disabled={currentPage === totalPages}
            className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""}`}
          >
            <FaArrowRight />
          </button>
        </div>
      )}

    </div>
  );
};

export default UserList;