/* Purpose: This template is used for the 17.1 - User List .
Created Date: 2025-06-06
Created By: sakumini (sakuminic@gmail.com)
Version: node 20
ui number :17.1
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the User list Screen */


import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import activeIcon from "../../assets/images/User/User_Active.png";
import deactiveIcon from "../../assets/images/User/User_Inactive.png";
// import terminateIcon from "../../assets/images/User/User_Terminate.png";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import more_info from "../../assets/images/more.svg";
import Swal from "sweetalert2";
import { getAllUserDetails } from "../../services/user/user_services"; 
const UserList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [status, setStatus] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userType, setUserType] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ 
    status: "", 
    userRole: "", 
    userType: "" 
  });
  const [roData, setRoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(null);
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 1
  });

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

  // Fetch users from backend
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const requestData = {
        page: currentPage + 1, // Backend expects 1-based page numbers
        ...(appliedFilters.userRole && { user_roles: appliedFilters.userRole}),
        ...(appliedFilters.userType && { user_type: appliedFilters.userType}),
        ...(appliedFilters.status !== "" && {
        user_status: appliedFilters.status
      }),
      };

      const response = await getAllUserDetails(requestData);
      
      if (response.status === "success") {
        // Transform backend data to match frontend structure
        const transformedData = response.data.map(user => ({
          user_id: user.user_id,
          status: user.user_status,
          user_type: user.user_type?.toUpperCase() || "",
          user_role: user.user_roles?.map(r => r.user_role).join(", ") || "",
          user_name: user.user_name,
          user_email: user.user_mail,
          created_on: new Date(user.created_dtm).toLocaleDateString('en-CA')
        }));
        
        setRoData(transformedData);
        setPaginationInfo(response.pagination || {
          total: transformedData.length,
          page: currentPage + 1,
          perPage: 10,
          totalPages: Math.ceil(transformedData.length / 10)
        });
      } else {
        setRoData([]);
        setPaginationInfo({
          total: 0,
          page: 1,
          perPage: 10,
          totalPages: 1
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      if(appliedFilters){
        Swal.fire({
          title: "Warning",
          text: "No matching users found fo the selected filters.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
      }else {
        setError(error.message || "Failed to fetch users");
      }
      setRoData([]);
      setPaginationInfo({
        total: 0,
        page: 1,
        perPage: 10,
        totalPages: 1
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [appliedFilters, currentPage]);

  // Client-side search for immediate feedback (optional - you can move this to backend too)
  const filteredData = roData.filter((row) => {
    const matchesSearchQuery = Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    return matchesSearchQuery;
  });

  const handleFilter = async () => {
    // Check if at least one filter is selected
    if (!status && !userRole && !userType) {
      Swal.fire({
        title: "Warning",
        text: "No filter is selected. Please, select a filter.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      return;
    }

    // Update appliedFilters and reset to first page
    setAppliedFilters({ 
      status, 
      userRole, 
      userType 
    });
    setCurrentPage(0);
  };

  const handleClear = () => {
    // Clear both the form fields and applied filters
    setStatus("");
    setUserRole("");
    setUserType("");
    setAppliedFilters({ 
      status: "", 
      userRole: "", 
      userType: "" 
    });
    setCurrentPage(0);
  };

  const pages = paginationInfo.totalPages;
  const paginatedData = searchQuery ? filteredData : roData; // Use filtered data if searching, otherwise use backend data

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < pages - 1) setCurrentPage(currentPage + 1);
  };

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
                className={`${GlobalStyle.selectBox} w-full text-sm`}
                style={{ color: userRole === "" ? "gray" : "black" }}
              >
                {/* <option value="" hidden>User Role</option>
                <option value="user" style={{ color: "black" }}>User</option>
                <option value="admin" style={{ color: "black" }}>Admin</option>
                <option value="superadmin" style={{ color: "black" }}>Super Admin</option>
                <option value="drc_admin" style={{ color: "black" }}>DRC Admin</option>
                <option value="drc_user" style={{ color: "black" }}>DRC User</option> */}
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
                className={`${GlobalStyle.selectBox} w-full text-sm`}
                style={{ color: userType === "" ? "gray" : "black" }}
              >
                <option value="" hidden>User Type</option>
                <option value="SLT" style={{ color: "black" }}>SLT</option>
                <option value="DRC" style={{ color: "black" }}>DRC</option>
                <option value="RO" style={{ color: "black" }}>RO</option>
              </select>
            </div>
            
            {/* Status Filter */}
            <div className="w-full">
              <select
                value={status}
                onChange={handleStatusChange}
                className={`${GlobalStyle.selectBox} w-full text-sm`}
                style={{ color: status === "" ? "gray" : "black" }}
              >
                <option value="" hidden>Status</option>
                <option value="true" style={{ color: "black" }}>Active</option>
                <option value="false" style={{ color: "black" }}>Inactive</option>
              </select>
            </div>
            
            {/* Filter Button */}
            <button
              onClick={handleFilter}
              className={`${GlobalStyle.buttonPrimary} w-full text-sm`}
            >
              Filter
            </button>

            {/* Clear Button */}
            <button
              onClick={handleClear}
              className={`${GlobalStyle.buttonRemove} w-full text-sm`}
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
          <table className={`${GlobalStyle.table} hidden md:table min-w-full`}>
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
              {paginatedData.map((user, index) => (
                <tr key={user.user_id} 
                  className={`${
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }`}
                >
                  <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{user.user_id}</td>
                  <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>
                    <div className="relative flex items-center justify-center">
                      {user.status === "true" ? (
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
                              Active Status
                            </div>
                          )}
                        </div>
                      ) : (
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
                              Inactive Status
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{user.user_type}</td>
                  <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{user.user_role}</td>
                  <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{user.user_name}</td>
                  <td className={`${GlobalStyle.tableData} text-xs lg:text-sm break-all`}>{user.user_email}</td>
                  <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{user.created_on}</td>
                  <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>
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

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {paginatedData.map((user) => (
              <div key={user.user_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-900">#{user.user_id}</span> 
                    <div className="flex items-center">
                      {user.status === "Active" ? (
                        <img src={activeIcon} alt="Active" className="h-5 w-5" />
                      ) : (
                        <img src={deactiveIcon} alt="Inactive" className="h-5 w-5" />
                      )}
                      <span className="ml-1 text-xs text-gray-600">{user.status}</span>
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
          </div>
        </div>
      </div>

      {/* Pagination - Responsive */}
      {paginationInfo.total > rowsPerPage && (
        <div className={`${GlobalStyle.navButtonContainer} flex-col sm:flex-row gap-4 sm:gap-0 mt-6`}>
          <button 
            className={`${GlobalStyle.navButton} text-sm px-4 py-2`}
            onClick={handlePrevPage} 
            disabled={currentPage === 0}
          >
           <FaArrowLeft />
            </button>
          <span className="flex items-center justify-center text-sm">
            Page {currentPage + 1} of {pages} 
          </span>
          <button 
            className={`${GlobalStyle.navButton} text-sm px-4 py-2`}
            onClick={handleNextPage} 
            disabled={currentPage === pages - 1}
          >
           <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;









// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import GlobalStyle from "../../assets/prototype/GlobalStyle";
// import activeIcon from "../../assets/images/User/User_Active.png";
// import deactiveIcon from "../../assets/images/User/User_Inactive.png";
// import terminateIcon from "../../assets/images/User/User_Terminate.png";
// import more_info from "../../assets/images/more.svg";
// import Swal from "sweetalert2";
 

// const UserList = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const [status, setStatus] = useState("");
//   const [userRole, setUserRole] = useState(""); // Added missing state
//   const [userType, setUserType] = useState(""); // Added missing state
//   const [appliedFilters, setAppliedFilters] = useState({ 
//     status: "", 
//     userRole: "", 
//     userType: "" 
//   });
//   const [roData, setRoData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [tooltipVisible, setTooltipVisible] = useState(null);

//   const rowsPerPage = 10;

//   useEffect(() => {
//     // Mock data for Users based on the updated structure
//     const mockUserData = [
//       {
//         user_id: "0001",
//         status: "Active",
//         user_type: "SLT",
//         user_role: "Admin",
//         user_name: "W.M. Wimalasiri",
//         user_email: "wimal@example.com",
//         created_on: "2024-01-15"
//       },
//       {
//         user_id: "0002",
//         status: "Inactive",
//         user_type: "DRC",
//         user_role: "User",
//         user_name: "R.A. Siripala",
//         user_email: "siripala@example.com",
//         created_on: "2024-02-10"
//       },
//       {
//         user_id: "0003",
//         status: "Terminate",
//         user_type: "RO",
//         user_role: "Moderator",
//         user_name: "K.S. Fernando",
//         user_email: "fernando@example.com",
//         created_on: "2024-03-05"
//       }
//     ];
    
//     setRoData(mockUserData);
//     setIsLoading(false);
//   }, []);

//   const filteredData = roData.filter((row) => {
//     const matchesSearchQuery = Object.values(row)
//       .join(" ")
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
    
//     const matchesStatus =
//       appliedFilters.status === "" ||
//       row.status.toLowerCase() === appliedFilters.status.toLowerCase();
    
//     const matchesUserRole =
//       appliedFilters.userRole === "" ||
//       row.user_role.toLowerCase() === appliedFilters.userRole.toLowerCase();
    
//     const matchesUserType =
//       appliedFilters.userType === "" ||
//       row.user_type.toLowerCase() === appliedFilters.userType.toLowerCase();

//     return matchesSearchQuery && matchesStatus && matchesUserRole && matchesUserType;
//   });

//   const handleFilter = () => {
//     // Check if at least one filter is selected
//     if (!status && !userRole && !userType) {
//       Swal.fire({
//         title: "Warning",
//         text: "No filter is selected. Please, select a filter.",
//         icon: "warning",
//         allowOutsideClick: false,
//         allowEscapeKey: false
//       });
//       return;
//     }

//     // Update appliedFilters when the Filter button is clicked
//     setAppliedFilters({ 
//       status, 
//       userRole, 
//       userType 
//     });
//     setCurrentPage(0);
//   };

//   const handleClear = () => {
//     // Clear both the form fields and applied filters
//     setStatus("");
//     setUserRole("");
//     setUserType("");
//     setAppliedFilters({ 
//       status: "", 
//       userRole: "", 
//       userType: "" 
//     });
//     setCurrentPage(0);
//   };

//   const pages = Math.ceil(filteredData.length / rowsPerPage);
//   const startIndex = currentPage * rowsPerPage;
//   const endIndex = startIndex + rowsPerPage;
//   const paginatedData = filteredData.slice(startIndex, endIndex);

//   const handlePrevPage = () => {
//     if (currentPage > 0) setCurrentPage(currentPage - 1);
//   };

//   const handleNextPage = () => {
//     if (currentPage < pages - 1) setCurrentPage(currentPage + 1);
//   };

//   const handleStatusChange = (e) => {
//     setStatus(e.target.value || "");
//   };

//   // Added missing handler functions
//   const handleUserRoleChange = (e) => {
//     setUserRole(e.target.value || "");
//   };

//   const handleUserTypeChange = (e) => {
//     setUserType(e.target.value || "");
//   };

//   const showTooltip = (id) => {
//     setTooltipVisible(id);
//   };

//   const hideTooltip = () => {
//     setTooltipVisible(null);
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className={`${GlobalStyle.fontPoppins} px-4 sm:px-6 lg:px-8`}>
//       {/* Header Section - Responsive */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
//         <h1 className={`${GlobalStyle.headingLarge} text-xl sm:text-2xl lg:text-3xl`}>User List</h1>
//         <Link to="/config/add-user">
//           <button className="py-2 px-6 sm:px-8 bg-blue-600 text-white rounded-full w-full sm:w-auto text-sm sm:text-base">
//             User Register
//           </button>
//         </Link>
//       </div>

//       {/* Search and Filters - Responsive */}
//       <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4 lg:gap-0">
//         {/* Search Bar */}
//         <div className={`${GlobalStyle.searchBarContainer} w-full lg:w-auto`}>
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className={`${GlobalStyle.inputSearch} w-full`}
//           />
//         </div>

//         {/* Filters */}
//         <div className={`${GlobalStyle.cardContainer} w-full lg:w-auto`}>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 items-center">
//             {/* User Role Filter */}
//             <div className="w-full">
//               <select
//                 value={userRole}
//                 onChange={handleUserRoleChange}
//                 className={`${GlobalStyle.selectBox} w-full text-sm`}
//                 style={{ color: userRole === "" ? "gray" : "black" }}
//               >
//                 <option value="" hidden>User Role</option>
//                 <option value="GM" style={{ color: "black" }}>GM</option>
//                 <option value="DGM" style={{ color: "black" }}>DGM</option>
//                 <option value="Legal" style={{ color: "black" }}>Legal Officer</option>
//                 <option value="Manager" style={{ color: "black" }}>Manager</option>
//                 <option value="Recovery Staff" style={{ color: "black" }}>Recovery Staff</option>
//               </select>
//             </div>

//             {/* User Type Filter */}
//             <div className="w-full">
//               <select
//                 value={userType}
//                 onChange={handleUserTypeChange}
//                 className={`${GlobalStyle.selectBox} w-full text-sm`}
//                 style={{ color: userType === "" ? "gray" : "black" }}
//               >
//                 <option value="" hidden>User Type</option>
//                 <option value="SLT" style={{ color: "black" }}>SLT</option>
//                 <option value="DRC" style={{ color: "black" }}>DRC</option>
//                 <option value="RO" style={{ color: "black" }}>RO</option>
//               </select>
//             </div>
            
//             {/* Status Filter */}
//             <div className="w-full">
//               <select
//                 value={status}
//                 onChange={handleStatusChange}
//                 className={`${GlobalStyle.selectBox} w-full text-sm`}
//                 style={{ color: status === "" ? "gray" : "black" }}
//               >
//                 <option value="" hidden>Status</option>
//                 <option value="Active" style={{ color: "black" }}>Active</option>
//                 <option value="Inactive" style={{ color: "black" }}>Inactive</option>
//                 <option value="Terminated" style={{ color: "black" }}>Terminated</option>
//               </select>
//             </div>
            
//             {/* Filter Button */}
//             <button
//               onClick={handleFilter}
//               className={`${GlobalStyle.buttonPrimary} w-full text-sm`}
//             >
//               Filter
//             </button>

//             {/* Clear Button */}
//             <button
//               onClick={handleClear}
//               className={`${GlobalStyle.buttonRemove} w-full text-sm`}
//             >
//               Clear
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Table Container - Responsive */}
//       <div className="overflow-x-auto -mx-4 sm:mx-0">
//         <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
//           {/* Desktop Table View */}
//           <table className={`${GlobalStyle.table} hidden md:table min-w-full`}>
//             <thead className={GlobalStyle.thead}>
//               <tr>
//                 <th scope="col" className={`${GlobalStyle.tableHeader} text-xs lg:text-sm`}>USER ID</th>
//                 <th scope="col" className={`${GlobalStyle.tableHeader} text-xs lg:text-sm`}>STATUS</th>
//                 <th scope="col" className={`${GlobalStyle.tableHeader} text-xs lg:text-sm`}>USER TYPE</th>
//                 <th scope="col" className={`${GlobalStyle.tableHeader} text-xs lg:text-sm`}>USER NAME</th>
//                 <th scope="col" className={`${GlobalStyle.tableHeader} text-xs lg:text-sm`}>USER EMAIL</th>
//                 <th scope="col" className={`${GlobalStyle.tableHeader} text-xs lg:text-sm`}>CREATED ON</th>
//                 <th scope="col" className={`${GlobalStyle.tableHeader} text-xs lg:text-sm`}>ACTIONS</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedData.map((user, index) => (
//                 <tr key={user.user_id} 
//                   className={`${
//                     index % 2 === 0
//                       ? GlobalStyle.tableRowEven
//                       : GlobalStyle.tableRowOdd
//                   }`}
//                 >
//                   <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{user.user_id}</td>
//                   <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>
//                     <div className="relative flex items-center justify-center">
//                       {user.status === "Active" ? (
//                         <div className="relative">
//                           <img 
//                             src={activeIcon} 
//                             alt="Active" 
//                             className="h-5 w-5 lg:h-6 lg:w-6"
//                             onMouseEnter={() => showTooltip(`status-${user.user_id}`)}
//                             onMouseLeave={hideTooltip}
//                           />
//                           {tooltipVisible === `status-${user.user_id}` && (
//                             <div className="absolute left-1/2 bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap transform -translate-x-1/2 z-10">
//                               Active Status
//                             </div>
//                           )}
//                         </div>
//                       ) : user.status === "Inactive" ? (
//                         <div className="relative">
//                           <img 
//                             src={deactiveIcon} 
//                             alt="Inactive" 
//                             className="h-5 w-5 lg:h-6 lg:w-6"
//                             onMouseEnter={() => showTooltip(`status-${user.user_id}`)}
//                             onMouseLeave={hideTooltip}
//                           />
//                           {tooltipVisible === `status-${user.user_id}` && (
//                             <div className="absolute left-1/2 bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap transform -translate-x-1/2 z-10">
//                               Inactive Status
//                             </div>
//                           )}
//                         </div>
//                       ) : user.status === "Terminate" ? (
//                         <div className="relative">
//                           <img 
//                             src={terminateIcon} 
//                             alt="Terminate" 
//                             className="h-5 w-5 lg:h-6 lg:w-6"
//                             onMouseEnter={() => showTooltip(`status-${user.user_id}`)}
//                             onMouseLeave={hideTooltip}
//                           />
//                           {tooltipVisible === `status-${user.user_id}` && (
//                             <div className="absolute left-1/2 bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap transform -translate-x-1/2 z-10">
//                               Terminate Status
//                             </div>
//                           )}
//                         </div>
//                       ) : null}
//                     </div>
//                   </td>
//                   <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{user.user_type}</td>
//                   <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{user.user_name}</td>
//                   <td className={`${GlobalStyle.tableData} text-xs lg:text-sm break-all`}>{user.user_email}</td>
//                   <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>{user.created_on}</td>
//                   <td className={`${GlobalStyle.tableData} text-xs lg:text-sm`}>
//                     <div className="flex justify-center">
//                       <Link to={`/config/user-details/${user.user_id}`}>
//                         <img src={more_info} alt="More Info" className="h-5 w-5 lg:h-6 lg:w-6" />
//                       </Link>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//               {paginatedData.length === 0 && (
//                 <tr>
//                   <td colSpan="7" className="text-center py-4 text-sm">
//                     No results found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* Mobile Card View */}
//           <div className="md:hidden space-y-4">
//             {paginatedData.map((user, index) => (
//               <div key={user.user_id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//                 <div className="flex justify-between items-start mb-3">
//                   <div className="flex items-center gap-3">
//                     <span className="text-sm font-semibold text-gray-900">#{user.user_id}</span>
//                     <div className="flex items-center">
//                       {user.status === "Active" ? (
//                         <img src={activeIcon} alt="Active" className="h-5 w-5" />
//                       ) : (
//                         <img src={deactiveIcon} alt="Inactive" className="h-5 w-5" />
//                       )}
//                       <span className="ml-1 text-xs text-gray-600">{user.status}</span>
//                     </div>
//                   </div>
//                   <Link to={`/config/user-details/${user.user_id}`}>
//                     <img src={more_info} alt="More Info" className="h-5 w-5" />
//                   </Link>
//                 </div>
                
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span className="text-xs text-gray-500">Name:</span>
//                     <span className="text-sm font-medium text-gray-900">{user.user_name}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-xs text-gray-500">Email:</span>
//                     <span className="text-sm text-gray-700 break-all">{user.user_email}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-xs text-gray-500">Type:</span>
//                     <span className="text-sm text-gray-700">{user.user_type}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-xs text-gray-500">Created:</span>
//                     <span className="text-sm text-gray-700">{user.created_on}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
            
//             {paginatedData.length === 0 && (
//               <div className="text-center py-8 text-gray-500">
//                 No results found
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Pagination - Responsive */}
//       {filteredData.length > rowsPerPage && (
//         <div className={`${GlobalStyle.navButtonContainer} flex-col sm:flex-row gap-4 sm:gap-0 mt-6`}>
//           <button 
//             className={`${GlobalStyle.navButton} text-sm px-4 py-2`}
//             onClick={handlePrevPage} 
//             disabled={currentPage === 0}
//           >
//             Previous
//           </button>
//           <span className="flex items-center justify-center text-sm">
//             Page {currentPage + 1} of {pages}
//           </span>
//           <button 
//             className={`${GlobalStyle.navButton} text-sm px-4 py-2`}
//             onClick={handleNextPage} 
//             disabled={currentPage === pages - 1}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserList;
