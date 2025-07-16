// Purpose: This template is used for the DRC Case List page (1.A.17).
// Created Date: 2024-01-07
// Created By: H.P.R Chandrasekara (hprchandrasekara@gmail.com)
// Last Modified Date: 2024-01-07
// Modified Date: 2024-01-07
// Modified By: H.P.R Chandrasekara (hprchandrasekara@gmail.com)
// Modified Date: 2024-01-07
// Modified By: Janani Kumarasiri (jkktg001@gmail.com)
// Version: node 11
// ui number :1.17
// Dependencies: tailwind css
// Related Files:  router.js.js (routes)
// Notes:.
// import DatePicker from "react-datepicker";
// import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Import GlobalStyle

// export default function AssignDRCsLOG() {
//   const navigate = useNavigate();

//   // Table data
//   const tableData = [
//     {
//       status: "Pending",
//       caseId: "87234",
//       accountNo: "12345",
//       amount: "15,000",
//       assignedDate: "2024-11-01",
//       endDate: "2024-11-10",
//     },
//     {
//       status: "Pending",
//       caseId: "87235",
//       accountNo: "54321",
//       amount: "20,000",
//       assignedDate: "2024-11-05",
//       endDate: "2024-11-15",
//     },
//     {
//       status: "Closed",
//       caseId: "87236",
//       accountNo: "67890",
//       amount: "50,000",
//       assignedDate: "2024-11-07",
//       endDate: "2024-11-20",
//     },
//     {
//       status: "Closed",
//       caseId: "87236",
//       accountNo: "67890",
//       amount: "50,000",
//       assignedDate: "2024-11-07",
//       endDate: "2024-11-20",
//     },
//     {
//       status: "Closed",
//       caseId: "87236",
//       accountNo: "67890",
//       amount: "50,000",
//       assignedDate: "2024-11-07",
//       endDate: "2024-11-20",
//     },
//     {
//       status: "Closed",
//       caseId: "87236",
//       accountNo: "67890",
//       amount: "50,000",
//       assignedDate: "2024-11-07",
//       endDate: "2024-11-20",
//     },
//     {
//       status: "Closed",
//       caseId: "87236",
//       accountNo: "67890",
//       amount: "50,000",
//       assignedDate: "2024-11-07",
//       endDate: "2024-11-20",
//     },
//   ];

//   // Filter state
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [filteredData, setFilteredData] = useState(tableData);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filterType, setFilterType] = useState("");
//   const [filterValue, setFilterValue] = useState("");

//   //search fuction 1
//   const filteredSearchData = filteredData.filter((row) =>
//     Object.values(row)
//       .join(" ")
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );

//   // Pagination state
//   const itemsPerPage = 4;
//   const totalPages = Math.ceil(filteredSearchData.length / itemsPerPage);

//   // Filter handler
//   const handleFilter = () => {
//     if (startDate && endDate) {
//       const filtered = tableData.filter((row) => {
//         const assignedDate = new Date(row.assignedDate);
//         const endDate1 = new Date(row.endDate);
//         return assignedDate >= startDate && endDate1 <= endDate;
//       });
//       handleFilterByType;
//       setFilteredData(filtered);
//     } else {
//       setFilteredData(tableData); // Reset if dates are not selected
//     }

//     if (filterType && filterValue) {
//       const filtered = tableData.filter((row) => {
//         const valueToCheck =
//           filterType === "Account No" ? row.accountNo : row.caseId;
//         return valueToCheck.toLowerCase().includes(filterValue.toLowerCase());
//       });
//       setFilteredData(filtered);
//     } else {
//       setFilteredData(tableData); // Reset to original data if no filter applied
//     }
//   };

//   // Pagination handler
//   const handlePrevNext = (direction) => {
//     if (direction === "prev" && currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//     if (direction === "next" && currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   // Paginated data
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedData = filteredSearchData.slice(startIndex, endIndex);

//   return (
//     <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
//       <h1 className={`${GlobalStyle.headingLarge}`}>DRC Case List</h1>
//       <h1 className={`${GlobalStyle.headingMedium} mb-5`}>DRC : TCM</h1>

//       {/* Filter Section */}
//       <div className="flex justify-end gap-10 my-12">
//         <div className="flex gap-10 mt-2">
//           {/* Filter Dropdown (Account No or Case ID) */}
//           <div className="flex gap-4">
//             <select
//               value={filterType}
//               onChange={(e) => setFilterType(e.target.value)}
//               className={`${GlobalStyle.selectBox} h-[36px]`}
//             >
//               <option value="">Select</option>
//               <option value="Account No">Account No</option>
//               <option value="Case ID">Case ID</option>
//             </select>
//           </div>

//           {/* Input field for filtering based on selected type */}

//           <div>
//             <input
//               type="text"
//               value={filterValue}
//               onChange={(e) => setFilterValue(e.target.value)}
//               placeholder={`Enter ${filterType}`}
//               className={`${GlobalStyle.inputText} `}
//             />
//           </div>
//         </div>
//         <div className="flex flex-col">
//           <div className="flex flex-col mb-4">
//             <div className={GlobalStyle.datePickerContainer}>
//               <label className={GlobalStyle.dataPickerDate}>Date </label>
//               <DatePicker
//                 selected={startDate}
//                 onChange={(date) => setStartDate(date)}
//                 dateFormat="dd/MM/yyyy"
//                 placeholderText="dd/MM/yyyy"
//                 className={GlobalStyle.inputText}
//               />
//               <DatePicker
//                 selected={endDate}
//                 onChange={(date) => setEndDate(date)}
//                 dateFormat="dd/MM/yyyy"
//                 placeholderText="dd/MM/yyyy"
//                 className={GlobalStyle.inputText}
//               />
//             </div>
//           </div>
//         </div>
//         <button
//           className={`${GlobalStyle.buttonPrimary} h-[35px] mt-2`}
//           onClick={handleFilter}
//         >
//           Filter
//         </button>
//       </div>

//       {/* Table Section */}
//       <div className="flex flex-col">
//         <div className="flex justify-start mb-4">
//           <div className={GlobalStyle.searchBarContainer}>
//             <input
//               type="text"
//               placeholder=""
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className={GlobalStyle.inputSearch}
//             />
//             <FaSearch className={GlobalStyle.searchBarIcon} />
//           </div>
//         </div>{" "}
//         <div className={GlobalStyle.tableContainer}>
//           <table className={`${GlobalStyle.table}`}>
//             <thead className={GlobalStyle.thead}>
//               <tr>
//                 <th scope="col" className={GlobalStyle.tableHeader}>
//                   Case ID
//                 </th>
//                 <th scope="col" className={GlobalStyle.tableHeader}>
//                   Status
//                 </th>
//                 <th scope="col" className={GlobalStyle.tableHeader}>
//                   Account No
//                 </th>
//                 <th scope="col" className={GlobalStyle.tableHeader}>
//                   Arrears Amount
//                 </th>
//                 <th scope="col" className={GlobalStyle.tableHeader}>
//                   Assigned Date and Time
//                 </th>
//                 <th scope="col" className={GlobalStyle.tableHeader}>
//                   End Date
//                 </th>
//                 <th scope="col" className={GlobalStyle.tableHeader}></th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedData.map((row, index) => (
//                 <tr
//                   key={index}
//                   className={`${
//                     index % 2 === 0
//                       ? "bg-white bg-opacity-75"
//                       : "bg-gray-50 bg-opacity-50"
//                   } border-b`}
//                 >
//                   <td className={GlobalStyle.tableData}>{row.caseId}</td>
//                   <td className={GlobalStyle.tableData}>{row.status}</td>
//                   <td className={GlobalStyle.tableData}>{row.accountNo}</td>
//                   <td className={GlobalStyle.tableData}>{row.amount}</td>
//                   <td className={GlobalStyle.tableData}>{row.assignedDate}</td>
//                   <td className={GlobalStyle.tableData}>{row.endDate}</td>
//                   <td className={GlobalStyle.tableData}>
//                     <div className="flex justify-center gap-2">
//                       <button
//                         className={GlobalStyle.buttonPrimary} // Prevents text from wrapping
//                         onClick={() =>
//                           navigate(
//                             `/pages/Distribute/ReAssignDRC?caseId=${row.caseId}&accountNo=${row.accountNo}`
//                           )
//                         }
//                       >
//                         Re-Assign
//                       </button>
//                       <button className={GlobalStyle.buttonPrimary}>
//                         {" "}
//                         {/* Increased width */}
//                         Withdraw
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination Section */}
//       <div className={GlobalStyle.navButtonContainer}>
//         <button
//           onClick={() => handlePrevNext("prev")}
//           disabled={currentPage === 1}
//           className={`${GlobalStyle.navButton} ${
//             currentPage === 1 ? "cursor-not-allowed" : ""
//           }`}
//         >
//           <FaArrowLeft />
//         </button>
//         <span>
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={() => handlePrevNext("next")}
//           disabled={currentPage === totalPages}
//           className={`${GlobalStyle.navButton} ${
//             currentPage === totalPages ? "cursor-not-allowed" : ""
//           }`}
//         >
//           <FaArrowRight />
//         </button>
//       </div>
//     </div>
//   );
// }

//Test 1 Nima

// Purpose: This template is used for the DRC Case List page (1.A.17).
// Created Date: 2024-01-07
// Created By: H.P.R Chandrasekara (hprchandrasekara@gmail.com)
// Last Modified Date: 2024-01-07
// Modified Date: 2024-01-07
// Modified By: H.P.R Chandrasekara (hprchandrasekara@gmail.com)
// Version: node 11
// ui number :1.17
// Dependencies: tailwind css
// Related Files:  router.js.js (routes)
// Notes:.



import DatePicker from "react-datepicker";
import { FaArrowLeft, FaArrowRight, FaSearch, FaCircle } from "react-icons/fa";
import { useNavigate, useLocation, data } from "react-router-dom";
import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { List_CasesOwened_By_DRC, Create_Task_For_Assigned_drc_case_list_download, Withdraw_CasesOwened_By_DRC } from "../../services/case/CaseServices";
import { FaUserEdit, FaUndo } from "react-icons/fa";
import { getLoggedUserId } from "/src/services/auth/authService.js";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";



export default function AssignDRCsLOG() {
  const navigate = useNavigate(); // Initialize navigate for routing
  const [filters, setFilters] = useState({}); // State for filters and table
  const [cases, setCases] = useState([]);  // State for table data
  const [error, setError] = useState(null); // State for error handling
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons
  const location = useLocation();
  const { drc_id } = location.state || {};// Get the case_id from the URL parameters
  const { drcname } = location.state || {}; // Get the drcname from the URL parameters
  const { currentfilters } = location.state || {}; // Get the filters from the URL parameters
  const { CurrentData } = location.state || {}; // Get the filters from the URL parameters
  const { currentCurrentPage } = location.state || {}; // Get the filters from the URL parameters
  const currentCurrentPageFromDRCList = location.state?.currentCurrentPage || 0;
  const currentDataPageFromDRCList = location.state?.currentData || [];


  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const [committedFilters, setCommittedFilters] = useState({
    filterType: "",
    filterValue: "",
    startDate: null,
    endDate: null
  });

  // Role-Based Buttons
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      let decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        refreshAccessToken().then((newToken) => {
          if (!newToken) return;
          const newDecoded = jwtDecode(newToken);
          setUserRole(newDecoded.role);
        });
      } else {
        setUserRole(decoded.role);
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }

    if (CurrentData) {
      setCases(CurrentData);
    }

    if (currentCurrentPage) {
      setCurrentPage(currentCurrentPage);
    };
  }, []);

  // Fetch cases on component mount
  // useEffect(() => {
  //   const fetchCases = async () => {
  //     try {
  //       const requestData = { drc_id: 7 };
  //       const data = await List_CasesOwened_By_DRC(requestData);
  //       setCases(data);
  //     } catch (err) {
  //       setError(err.message);
  //     } 
  //   };
  //   fetchCases();
  // }, []);

  const handleFilterChanges = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const [startDate, setStartDate] = useState(null); // State for start date
  const [endDate, setEndDate] = useState(null); // State for end date
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [filterType, setFilterType] = useState(""); // State for filter type (Account No or Case ID)
  const [filterValue, setFilterValue] = useState(""); // State for filter value (input field)
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  //console.log("Cases:", cases);

  //console.log("Filtered Cases:", cases);
  //console.log("Search Query:", searchQuery);
  // Search function
  const filteredCases = cases.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

// when the search query changes, reset the current page to 1
  useEffect(() => {
  if (searchQuery) {
    setCurrentPage(1);
  }
}, [searchQuery]);


  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);

  // Date change handlers
  const handlestartdatechange = (date) => {
    if (endDate && date > endDate) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Start date cannot be after end date.",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    setStartDate(date);
    //if (endDate) checkdatediffrence(date, endDate);
  };

  // End date change handler
  const handleenddatechange = (date) => {
    if (startDate && date < startDate) {
      Swal.fire({
        icon: "warning",
        title: "warning",
        text: "End date cannot be before start date.",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    // if (startDate) {
    //   checkdatediffrence(startDate, date);
    // }
    setEndDate(date);

  }

  // Function to check date difference and show alert if more than 1 month
  const checkdatediffrence = (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffInMs = end - start;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const diffInMonths = diffInDays / 30;

    if (diffInMonths > 1) {
      Swal.fire({
        title: "Date Range Exceeded",
        text: "The selected dates have more than a 1-month gap. Do you want to proceed?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#28a745",
        cancelButtonText: "No",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {

          endDate = endDate;
          handleApicall(startDate, endDate);
        } else {
          setEndDate(null);
          // console.log("EndDate cleared");
        }
      }
      );

    }
  };

  // Function to handle API call with selected dates and filter values
  const handleApicall = async (startDate, endDate) => {
    const userId = await getLoggedUserId();
    const payload = {}
    // payload.drc_id = 7; // Hardcoded DRC ID for testing
    payload.drc_id = drc_id;
    payload.from_date = startDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    payload.to_date = endDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    if (filterType === "Account No" && filterValue.trim() !== "") {
      payload.account_no = String(filterValue.trim());
    }
    else if (filterType === "Case ID" && filterValue.trim() !== "") {
      payload.case_id = filterValue.trim();
    }
    payload.Created_By = userId;
    // console.log("Filtered Request Payload:", payload);

    // Call API with payload
    const createtask = async () => {
      try {
        const data = await Create_Task_For_Assigned_drc_case_list_download(payload);
        // console.log("Response",data);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data sent successfully.",
          confirmButtonColor: "#28a745",
        });
        setEndDate(null);
        setStartDate(null);

      } catch (error) {
        console.error("Error in sending the data:", error);

        const errorMessage = error?.response?.data?.message ||
          error?.message ||
          "An error occurred. Please try again.";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
          confirmButtonColor: "#d33",
        });
      }
    }
    createtask();
  };





  // Filter handler
  // const handleFilter = () => {
  //   setCurrentPage(1);
  //   // if ((startDate && !endDate) || (!startDate && endDate)) {
  //   //   Swal.fire({
  //   //     icon: "warning",
  //   //     title: "Warning",
  //   //     text: "Please select both start and end dates.",
  //   //     confirmButtonColor: "#f1c40f",
  //   //   });
  //   //   return;
  //   // }
  //   const payload = {}
  //   // payload.drc_id = 7; // Hardcoded DRC ID for testing
  //   payload.drc_id = drc_id;
  //   if (startDate) {
  //     payload.from_date = startDate; // Format: YYYY-MM-DD
  //   }
  //   if (endDate) {
  //     payload.to_date = endDate; // Format: YYYY-MM-DD
  //   }
  //   // Assign either "account_no" or "case_id" based on selected filterType

  //   if (filterType === "Account No" && filterValue.trim() !== "") {
  //     payload.account_no = String(filterValue.trim());
  //   } else if (filterType === "Case ID" && filterValue.trim() !== "") {
  //     payload.case_id = filterValue.trim();
  //   }

  //    if ((startDate && !endDate) || (!startDate && endDate)) {
  //      Swal.fire({
  //        title: "warning",
  //        text: "Please select both start and end dates.",
  //        icon: "warning",
  //        confirmButtonColor: "#f1c40f",
  //      });
  //      return;
  //    }

  //   console.log("Filtered Request Payload:", payload);

  //   // Call API with payload
  //   const fetchCases = async () => {
  //     try {
  //       const data = await List_CasesOwened_By_DRC(payload);
  //       setCases(data);
  //     } catch (err) {
  //       setError(err.message);
  //       Swal.fire({
  //         title: "Error",
  //         text: "Error fetching data. Please try again.",
  //         icon: "error",
  //         confirmButtonColor: "#d33",
  //       });
  //       setCases([]);
  //     }
  //   }
  //   fetchCases();

  // };


  const handleFilter = () => {




    if ((startDate && !endDate) || (!startDate && endDate)) {
      Swal.fire({
        title: "Warning",
        text: "Please select both start and end dates.",
        icon: "warning",
        confirmButtonColor: "#f1c40f"
      });
      return;
    }

    
    if (!filterType) {
    Swal.fire({
      title: "Warning",
      text: "Please select a filter type (Account No or Case ID).",
      icon: "warning",
      confirmButtonColor: "#f1c40f"
    });
    return;
  }

    if (!filterValue.trim()) {
      Swal.fire({
        title: "Warning",
        text: "Please enter either a Case ID or Account No.",
        icon: "warning",
        confirmButtonColor: "#f1c40f"
      });
      return;
    }

    setCurrentPage(1);
    setCases([]);
    setIsMoreDataAvailable(true);
    setMaxCurrentPage(0);

    setCommittedFilters({
      filterType,
      filterValue: filterValue.trim(),
      startDate,
      endDate
    });

    fetchCasesWithPagination({
      page: 1,
      filterType,
      filterValue: filterValue.trim(),
      startDate,
      endDate
    });
  };


  const fetchCasesWithPagination = async ({ page, filterType, filterValue, startDate, endDate }) => {
  const payload = {
    drc_id: drc_id, // Use actual drc_id from context/state
    pages: page,
  };

  const formatDate = (date) => {
    if (!date) return null;
    const offset = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offset.toISOString().split("T")[0];
  };

  if (startDate && endDate) {
    payload.from_date = formatDate(startDate);
    payload.to_date = formatDate(endDate);
  }

  if (filterType === "Account No") {
    payload.account_no = filterValue;
  } else if (filterType === "Case ID") {
    payload.case_id = filterValue;
  }

  try {
    console.log("Filtered Request Payload:", payload);
    setIsLoading(true); // If using loading indicator

    const response = await List_CasesOwened_By_DRC(payload);
    const data = Array.isArray(response?.data) ? response.data : [];
    console.log("Filtered Response Data:", data);

    const maxData = page === 1 ? 10 : 30;

    if (page === 1) {
      setCases(data);
    } else {
      setCases((prev) => [...prev, ...data]);
    }

    //console.log("Cases after fetching:", cases);
    if (data.length === 0) {
      setIsMoreDataAvailable(false);

      if (page === 1) {
        Swal.fire({
          title: "No Results",
          text: "No matching cases found for the selected filters.",
          icon: "warning",
          confirmButtonColor: "#f1c40f",
        });
      } else {
        // If second page or later yields no results, roll back page
        setCurrentPage((prev) => Math.max(1, prev - 1));
      }
    } else if (data.length < maxData) {
      setIsMoreDataAvailable(false); // No more data available
    } else {
      setIsMoreDataAvailable(true); // More data available
    }

  } catch (err) {
    const errorMessage = err?.response?.data?.message || err?.message || "An unknown error occurred";

    if (errorMessage.includes("No matching cases found")) {
      setCases([]);
      setIsMoreDataAvailable(false);
      Swal.fire({
        title: "No Results",
        text: "No matching cases found for the selected filters.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
    } else {
      setError(errorMessage);
      setCases([]);
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  } finally {
    setIsLoading(false); // Always reset loading state
  }
};



  useEffect(() => {
    if (isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage);
      fetchCasesWithPagination({
        page: currentPage,
        ...committedFilters
      });
    }
  }, [currentPage]);



  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next") {
      setCurrentPage(currentPage + 1);
    }
  };



const handleclearfilter = () => {
  setStartDate(null);
  setEndDate(null);
  setFilterType("");
  setFilterValue("");
  setSearchQuery("");
  setCases([]);
  setError(null);
  setCurrentPage(1);
  setMaxCurrentPage(0);
  setIsMoreDataAvailable(true);
  setCommittedFilters({
    filterType: "",
    filterValue: "",
    startDate: null,
    endDate: null
  });
};



  // // Clear filter handler
  // const handleclearfilter = () => {

  //   setStartDate(null);
  //   setEndDate(null);
  //   setFilterType("");
  //   setFilterValue("");

  //   // const fetchCases = async () => {
  //   //   try {
  //   //     const requestData = { drc_id: 7 };
  //   //     const data = await List_CasesOwened_By_DRC(requestData);
  //   //     setCases(data);
  //   //   } catch (err) {
  //   //     setError(err.message);
  //   //   }
  //   // };
  //   // fetchCases();
  //   window.location.reload();
  // };

  // Withdraw button handler
  const handlewithdrawbutton = async (caseID) => {
    const userId = await getLoggedUserId();
    Swal.fire({
      title: "Enter your remark",
      input: "text",
      inputPlaceholder: "Enter remark",
      showCancelButton: true,
      cancelButtonText: "Close",
      confirmButtonText: "Withdraw",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      preConfirm: (remark) => {
        if (!remark) {
          Swal.showValidationMessage("Please enter a remark before withdrawing!");
        }
        return remark;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          approver_reference: caseID,
          remark: result.value,
          remark_edit_by: userId,
          created_by: userId,
        };
        // console.log("Withdraw Payload:", payload);

        // Call API with payload
        const withdrawCase = async () => {
          try {
            const data = await Withdraw_CasesOwened_By_DRC(payload);
            // console.log("Response", data);
            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Case withdrawn successfully.",
              confirmButtonColor: "#28a745",
            });
          } catch (error) {
            console.error("Error in withdrawing the case:", error);

            const errorMessage = error?.response?.data?.message ||
              error?.message ||
              "An error occurred. Please try again.";
            Swal.fire({
              icon: "error",
              title: "Error",
              text: errorMessage,
              confirmButtonColor: "#d33",
            });
          }
        };
        withdrawCase();
      }
    });

  }

  // Pagination handler
  // const handlePrevNext = (direction) => {
  //   if (direction === "prev" && currentPage > 1) {
  //     setCurrentPage(currentPage - 1);
  //   }
  //   if (direction === "next" && currentPage < totalPages) {
  //     setCurrentPage(currentPage + 1);
  //   }
  // };

  // Function to handle row click and navigate to details page
  const onhoverbuttonclick = (caseid) => {
    navigate("/Incident/Case_Details", {
      state: { CaseID: caseid }, // Pass the case ID as a parameter
    });
    // console.log("Navigating to Case Details with ID:", caseid);
  }


  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredCases.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <h1 className={`${GlobalStyle.headingLarge}`}>DRC Case List</h1>
      <h1 className={`${GlobalStyle.headingMedium} mb-5`}>DRC : {drcname}</h1>

      {/* Filter Section */}
      <div className={`${GlobalStyle.cardContainer}  w-full mt-6 flex justify-end gap-5 mb-7 flex-wrap `}>
        <div className="flex flex-nowrap gap-2">

          {/* Filter Dropdown (Account No or Case ID) */}

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`${GlobalStyle.selectBox} h-[36px] w-full sm:w:auto`}
            style={{ color: filterType === "" ? "gray" : "black" }}
          >
            <option value="" hidden>Select</option>
            <option value="Account No" style={{ color: "black" }}>Account No</option>
            <option value="Case ID" style={{ color: "black" }}>Case ID</option>
          </select>

          <div>
            <input
              type="text"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder={`Enter ${filterType}`}
              className={`${GlobalStyle.inputText}  w-full sm:w-auto`}
            />
          </div>
        </div>


        <label className={GlobalStyle.dataPickerDate} style={{ marginTop: '5px', display: 'block' }}>Date: </label>
        <DatePicker
          selected={startDate}
          onChange={handlestartdatechange}
          dateFormat="dd/MM/yyyy"
          placeholderText="From"
          className={`${GlobalStyle.inputText} w-full sm:w-auto`}
        />
        <DatePicker
          selected={endDate}
          onChange={handleenddatechange}
          dateFormat="dd/MM/yyyy"
          placeholderText="To"
          className={`${GlobalStyle.inputText} w-full sm:w-auto`}
        />


        <div>
          {["admin", "superadmin", "slt"].includes(userRole) && (
            <button
              className={`${GlobalStyle.buttonPrimary} h-[35px] w-full sm:w-auto`}
              onClick={handleFilter}
            >
              Filter
            </button>
          )}
        </div>
        {/* <button
                className={`${GlobalStyle.buttonPrimary} h-[35px]`}
                onClick={handleFilter}
              >
                Filter
              </button> */}

        <div>
          {["admin", "superadmin", "slt"].includes(userRole) && (
            <button
              className={`${GlobalStyle.buttonRemove} h-[35px] w-full sm:w-auto`}
              onClick={handleclearfilter} // <-- Corrected here
            >
              Clear
            </button>
          )}
        </div>
        {/* <button
                className={`${GlobalStyle.buttonRemove} h-[35px]`}
                onClick={handleclearfilter} // <-- Corrected here
              >
                Clear
              </button> */}
      </div>

      {/* Table Section */}
      <div className="flex flex-col">
        <div className="flex justify-start mb-4">
          <div className={GlobalStyle.searchBarContainer}>
            <input
              type="text"
              placeholder=""
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={GlobalStyle.inputSearch}
            />
            <FaSearch className={GlobalStyle.searchBarIcon} />
          </div>
        </div>{" "}
        <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
          <table className={`${GlobalStyle.table}`}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Case ID
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Status
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Account No
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Arrears Amount (LKR)
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Assigned Date and Time
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  End Date
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((caseItem) => (
                  <tr key={caseItem.case_id} className={
                    caseItem % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
                  >
                    <td className={GlobalStyle.tableData} >
                      <button
                        onClick={() => onhoverbuttonclick(caseItem.case_id)}
                        onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"}
                        onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"}
                      >
                        {caseItem.case_id}
                      </button>

                    </td>
                    <td className={GlobalStyle.tableData}>{caseItem.case_current_status}</td>
                    <td className={GlobalStyle.tableData}>{caseItem.account_no}</td>
                    <td className={GlobalStyle.tableCurrency}>{caseItem.current_arrears_amount}</td>
                    <td className={GlobalStyle.tableData}>
                      {new Date(caseItem.last_drc?.created_dtm).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric", // Ensures two-digit year (YY)
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true, // Keeps AM/PM format
                      })}
                    </td>
                    <td className={GlobalStyle.tableData}>
                      {caseItem.last_drc?.expire_dtm && typeof caseItem.last_drc?.expire_dtm === 'string' && !isNaN(new Date(caseItem.last_drc?.expire_dtm.trim()).getTime())
                        ? new Date(caseItem.last_drc?.expire_dtm.trim()).toLocaleDateString("en-GB")
                        : ""}
                    </td>
                    <td className={GlobalStyle.tableData} style={{ width: "150px" }}>
                      <button
                        className={GlobalStyle.buttonPrimary}
                        data-tooltip-id="my-tooltip"
                        onClick={() =>
                          navigate('/pages/Distribute/ReAssignDRC', {
                            state: {
                              caseId: caseItem.case_id,
                              accountNo: caseItem.account_no,
                              CurrentData: cases,
                              drc_id: drc_id,
                              currentCurrentPage: currentPage,
                            },
                          })
                        }

                        // Shows tooltip on hover
                        style={{ marginRight: "5px" }}
                      >
                        <FaUserEdit /> {/* Icon for Re-Assign */}
                        <Tooltip id="my-tooltip" place="bottom" content="Re-Assign" />
                      </button>

                      <button className={GlobalStyle.buttonPrimary} onClick={() => handlewithdrawbutton(caseItem.case_id)} data-tooltip-id="my-tooltip2">
                        <FaUndo /> {/* Icon for Withdraw */}
                        <Tooltip id="my-tooltip2" place="bottom" content="Withdraw" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                    No cases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>



      {/* Pagination */}
      {paginatedData.length > 0 && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            onClick={() => handlePrevNext("prev")}
            disabled={currentPage <= 1}
            className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed" : ""}`}
          >
            <FaArrowLeft />
          </button>

          <span className={`${GlobalStyle.pageIndicator} mx-4`}>
            Page {currentPage}
          </span>

          <button
            onClick={() => handlePrevNext("next")}
            disabled={
              searchQuery
                ? currentPage >= Math.ceil(filteredCases.length / itemsPerPage)
                : !isMoreDataAvailable && currentPage >= Math.ceil(cases.length / itemsPerPage)
            }
            className={`${GlobalStyle.navButton} ${(
                searchQuery
                  ? currentPage >= Math.ceil(filteredCases.length / itemsPerPage)
                  : !isMoreDataAvailable && currentPage >= Math.ceil(cases.length / itemsPerPage)
              )
                ? "cursor-not-allowed"
                : ""
              }`}
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      <button
        className={`${GlobalStyle.buttonPrimary} mt-4`}
        onClick={() => navigate("/pages/DRC/DRCList",
          {
            state: {
              currentCurrentPage: currentCurrentPageFromDRCList,
              currentData: currentDataPageFromDRCList,
            },
          }
        )}
      >
        <FaArrowLeft className="mr-2" />
      </button>
    </div>
  );
}
