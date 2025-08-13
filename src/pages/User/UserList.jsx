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
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import more_info from "../../assets/images/more.svg";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";
import { getAllUserDetails } from "../../services/user/user_services"; 

const UserList = () => {
  const navigate =useNavigate();

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
  
  const [allFetchedData, setAllFetchedData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(null);

  // Pagination state
  const rowsPerPage = 10;
  const fetchFirstPageSize = 10;
  const fetchSubsequentPageSize = 30;
  const [currentPage, setCurrentPage] = useState(1);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const fetchedPages = useRef(new Set());
  
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = displayData.slice(startIndex, endIndex);
  
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

  const getApiPageFromDisplayPage = (displayPage) => {
    if (displayPage <= 1) return 1;
    return Math.floor((displayPage - 1) / 3) + 2;
  };

  // Fetch users
  const fetchUsers = async (page, filters) => {
    setIsLoading(true);
    setError(null);

    try {
      const requestData = {
        page,
        user_role: filters.userRole,
        user_type: filters.userType,
        user_status: filters.status
      };

      const response = await getAllUserDetails(requestData);

      if (response?.status === "success" && Array.isArray(response.data)) {
        const newUsers = response.data.map((user) => ({
          user_id: user.user_id,
          status: user.user_status,
          user_type: user.user_type?.toUpperCase() || "",
          user_role: user.role,
          user_name: user.username,
          user_email: user.email,
          contact_num:
            Array.isArray(user.contact_num) && user.contact_num.length > 0
              ? user.contact_num[0].contact_number
              : "N/A",
          created_on: new Date(user.Created_DTM).toLocaleDateString("en-CA")
        }));

        setAllFetchedData((prev) =>
          page === 1 ? newUsers : [...prev, ...newUsers]
        );

        const expectedSize = page === 1 ? fetchFirstPageSize : fetchSubsequentPageSize;
        setIsMoreDataAvailable(newUsers.length === expectedSize);

        fetchedPages.current.add(page);

        if (newUsers.length === 0 && page === 1) showNoResultsAlert();
      } else {
        throw new Error("No valid user data found");
      }
    } catch (error) {
      setError(error.message || "Failed to fetch users");
      if (page === 1) setAllFetchedData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial + filter change
  useEffect(() => {
    fetchedPages.current.clear();
    setAllFetchedData([]);
    setCurrentPage(1);
    setIsMoreDataAvailable(true);

    fetchUsers(1, appliedFilters);
  }, [appliedFilters]);

  // Search
  useEffect(() => {
    if (searchQuery) {
      const filtered = allFetchedData.filter((user) =>
        Object.values(user).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setDisplayData(filtered);
    } else {
      setDisplayData(allFetchedData);
    }
  }, [searchQuery, allFetchedData]);

  // Ensure displayData stays in sync
  useEffect(() => {
    if (!searchQuery) setDisplayData(allFetchedData);
  }, [allFetchedData, searchQuery]);

  // Pagination lazy load
  useEffect(() => {
    const pagesAvailable = Math.ceil(allFetchedData.length / rowsPerPage);

    if (currentPage > pagesAvailable && isMoreDataAvailable) {
      const pageToFetch = getApiPageFromDisplayPage(currentPage);
      if (!fetchedPages.current.has(pageToFetch)) {
        fetchUsers(pageToFetch, appliedFilters);
      }
    }
  }, [currentPage]);


  // Handle Pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next") {
      const pagesAvailable = Math.ceil(displayData.length / rowsPerPage);
      if (currentPage < pagesAvailable || isMoreDataAvailable) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  };

  const isNextDisabled = () => {
    const lastDisplayPage = Math.ceil(displayData.length / rowsPerPage);
    return currentPage >= lastDisplayPage && !isMoreDataAvailable;
  };

  const showNoResultsAlert = () => {
    Swal.fire({
      title: "No Results",
      text: "No matching users found for the selected filters.",
      icon: "warning",
      confirmButtonColor: "#f1c40f"
    });
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
    if (!userRole && !userType && !status) {
      Swal.fire({
        title: "Warning",
        text: "No filter is selected. Please, select a filter.",
        icon: "warning",
        confirmButtonColor: "#f1c40f"
      });
      return;
    }

    setAppliedFilters({ userRole, userType, status });
  };

  const handleClear = () => {
    setStatus("");
    setUserRole("");
    setUserType("");
    setSearchQuery("");
    setAppliedFilters({ status: "", userRole: "", userType: "" });
    setCurrentPage(1);
    setIsMoreDataAvailable(true);
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

  const formatRoleLabel = (value) => {
    if (!value) return "N/A";

    return value
      .split("_")
      .map(word => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleUserRegister = () => navigate("/pages/user/signup");

  // Function to render status icon with tooltip
  const renderStatusIcon = (user) => {
    if (user.status === "Active") {
      return (
        <div className="relative">
          <img 
            src={activeIcon} 
            alt="Active" 
            className="h-5 w-5 lg:h-6 lg:w-6"
            onMouseEnter={() => showTooltip(`status-${user.user_id}`)}
            onMouseLeave={hideTooltip}
          />
          {tooltipVisible === `status-${user.user_id}` && (
            <div className="absolute left-1/2 bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap transform -translate-x-1/2 z-10">
              Active 
            </div>
          )}
        </div>
      );
    } else if (user.status === "Inactive") {
      return (
        <div className="relative">
          <img 
            src={deactiveIcon} 
            alt="Inactive" 
            className="h-5 w-5 lg:h-6 lg:w-6"
            onMouseEnter={() => showTooltip(`status-${user.user_id}`)}
            onMouseLeave={hideTooltip}
          />
          {tooltipVisible === `status-${user.user_id}` && (
            <div className="absolute left-1/2 bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap transform -translate-x-1/2 z-10">
              Inactive 
            </div>
          )}
        </div>
      );
    } else if (user.status === "terminate") {
      return (
        <div className="relative">
          <img 
            src={terminateIcon} 
            alt="Terminate" 
            className="h-5 w-5 lg:h-6 lg:w-6"
            onMouseEnter={() => showTooltip(`status-${user.user_id}`)}
            onMouseLeave={hideTooltip}
          />
          {tooltipVisible === `status-${user.user_id}` && (
            <div className="absolute left-1/2 bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap transform -translate-x-1/2 z-10">
              Terminate 
            </div>
          )}
        </div>
      );
    }
    return null;
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
                <option value="Active" style={{ color: "black" }}>Active</option>
                <option value="Inactive" style={{ color: "black" }}>Inactive</option>
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
              {filteredDataBySearch.map((user, index) => (
                <tr key={user.user_id} 
                  className={`${
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }`}
                >
                  <td
                    className={`${GlobalStyle.tableData} w-[100px] max-w-[100px] truncate`}
                    title={user.user_id}
                  >
                    {user.user_id}
                  </td>
                  <td className={`${GlobalStyle.tableData}`}>
                    <div className=" flex items-center justify-center">
                      {/* <div className="relative"> */}
                        <img 
                          src={
                            user.status === "Active"
                              ? activeIcon
                              : user.status === "Inactive"
                              ? deactiveIcon
                              : terminateIcon
                          }
                          alt={
                            user.status === "Active"
                              ? "Active"
                              : user.status === "Inactive"
                              ? "Inactive"
                              : "Terminated"
                          }
                          data-tooltip-id={`status-${user.user_id}`}
                          data-tooltip-content={
                            user.status === "Active"
                              ? "Active"
                              : user.status === "Inactive"
                              ? "Inactive"
                              : "Terminated"
                          }

                          className="h-5 w-5 lg:h-6 lg:w-6"
                          //onMouseEnter={() => showTooltip(`status-${user.user_id}`)}
                          //onMouseLeave={hideTooltip}
                        />
                        {/* {tooltipVisible === `status-${user.user_id}` && (
                          <div className="absolute left-1/2 bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap transform -translate-x-1/2 z-10">
                            {user.status === "Active"
                              ? "Active"
                              : user.status === "Inactive"
                              ? "Inactive"
                              : "Terminated"}
                          </div>
                        )} */}
                      {/* </div> */}
                    </div>
                    <Tooltip id={`status-${user.user_id}`} place="bottom" content={
                      user.status === "Active"
                        ? "Active"
                        : user.status === "Inactive"
                        ? "Inactive"
                        : "Terminated"
                    } />
                  </td>
                  <td className={`${GlobalStyle.tableData}`}>{user.user_type || "N/A"}</td>
                  <td className={`${GlobalStyle.tableData}`}>{formatRoleLabel(user.user_role)}</td>
                  <td className={`${GlobalStyle.tableData}`}>{user.user_name || "N/A"}</td>
                  <td className={`${GlobalStyle.tableData}`}>{user.user_email || "N/A"}</td>
                  <td className={`${GlobalStyle.tableData}`}>{user.contact_num || "N/A"}</td>
                  <td className={`${GlobalStyle.tableData}`}>{user.created_on  || "N/A"}</td>
                  <td className={`${GlobalStyle.tableData}`}>
                    <div className="flex justify-center">
                      <Link to="/pages/User/UserInfo" state={{ user_id: user.user_id }}>
                        <img src={more_info} alt="More Info" className="h-5 w-5 lg:h-6 lg:w-6"  data-tooltip-id={`more-info-tooltip-${user.user_id}`} />

          
                      </Link>
                      <Tooltip id={`more-info-tooltip-${user.user_id}`} place="bottom" content="More Info" />
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

          {/* Mobile Card View
          <div className="md:hidden space-y-4">
            {paginatedData.map((user) => (
              <div key={user.user_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900">#{user.user_id}</span> 
                    <div className="flex items-center">
                      {user.status === "Active" && (
                        <>
                          <img src={activeIcon} alt="Active" className="h-5 w-5" />
                          <span className="ml-1 text-xs text-gray-600">Active</span>
                        </>
                      )}
                      {user.status === "Inactive" && (
                        <>
                          <img src={deactiveIcon} alt="Inactive" className="h-5 w-5" />
                          <span className="ml-1 text-xs text-gray-600">Inactive</span>
                        </>
                      )}
                      {user.status === "Terminate" && (
                        <>
                          <img src={terminateIcon} alt="Terminated" className="h-5 w-5" />
                          <span className="ml-1 text-xs text-gray-600">Terminate</span>
                        </>
                      )}
                    </div>
                  </div>
                   <Link to="/pages/User/UserInfo" state={{ user_id: user.user_id }}>
                    <img src={more_info} alt="More Info" className="h-5 w-5" />
                  </Link>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Name:</span>
                    <span className="text-sm font-medium text-gray-900">{user.user_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Email:</span>
                    <span className="text-sm text-gray-700 break-all">{user.user_email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Type:</span>
                    <span className="text-sm text-gray-700">{user.user_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Role:</span>
                    <span className="text-sm text-gray-700">{user.user_role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Created:</span>
                    <span className="text-sm text-gray-700">{user.created_on}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {paginatedData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No results found
              </div>
            )}
          </div> */}
        </div>
      </div> 

      {/* Pagination Section */}
      {filteredDataBySearch.length > 0 && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            onClick={() => handlePrevNext("prev")}
            disabled={currentPage === 1}
            className={`${GlobalStyle.navButton} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <FaArrowLeft />
          </button>
          <span className={`${GlobalStyle.pageIndicator} mx-4 my-auto`}>
            Page {currentPage}
          </span>
          <button
            onClick={() => handlePrevNext("next")}
            disabled={isNextDisabled()}
            className={`${GlobalStyle.navButton} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <FaArrowRight />
          </button>
        </div>
      )}

    </div>
  );
};

export default UserList;
