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
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { List_CasesOwened_By_DRC , Create_Task_For_Assigned_drc_case_list_download } from "../../services/case/CaseServices";
import { FaUserEdit, FaUndo } from "react-icons/fa"; 
import {getLoggedUserId} from "/src/services/auth/authService.js";
import Swal from "sweetalert2";



export default function AssignDRCsLOG() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [cases, setCases] = useState([]); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const requestData = { drc_id: 7 };
        const data = await List_CasesOwened_By_DRC(requestData);
        setCases(data);
      } catch (err) {
        setError(err.message);
      } 
    };
    fetchCases();
  }, []);

  const handleFilterChanges = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");



  const filteredCases = cases.filter((row) => 
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
      );

  const itemsPerPage = 4;
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);

  const handlestartdatechange = (date) => {
    setStartDate(date);
    if (endDate) checkdatediffrence(date, endDate);
  };

  const handleenddatechange = (date) => {
    if (startDate) {
      checkdatediffrence(startDate, date);
    }
    setEndDate(date);

  }

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
          console.log("Dates cleared");
        }
      }
      );

    }
  };

  const handleApicall = async (startDate, endDate) => {
    const userId =  await getLoggedUserId();
    const payload = {}
    payload.drc_id = 7; // Hardcoded DRC ID for testing
    payload.from_date = startDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    payload.to_date = endDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD

    if (filterType === "Account No" && filterValue.trim() !== "") {
      payload.account_no = filterValue.trim();
    }
    else if (filterType === "Case ID" && filterValue.trim() !== "") {
      payload.case_id = filterValue.trim();
    }
    payload.Created_By = userId;
    console.log("Filtered Request Payload:", payload);

    // Call API with payload
    const createtask = async () => {
      try {
        const data = await Create_Task_For_Assigned_drc_case_list_download(payload);
        console.log("Response",data);
          Swal.fire({
                 icon: "success",
                 title: "Success",
                 text: "Data sent successfully.",
                 confirmButtonColor: "#28a745",
          });
        
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
  const handleFilter = () => {
    const payload = {}
    payload.drc_id = 7; // Hardcoded DRC ID for testing
    if (startDate) {
      payload.from_date = startDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    }
    if (endDate) {
      payload.to_date = endDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    }
    // Assign either "account_no" or "case_id" based on selected filterType

    if (filterType === "Account No" && filterValue.trim() !== "") {
      payload.account_no = filterValue.trim();
    } else if (filterType === "Case ID" && filterValue.trim() !== "") {
      payload.case_id = filterValue.trim();
    }


    console.log("Filtered Request Payload:", payload);

    // Call API with payload
    const fetchCases = async () => {
      try {
        const data = await List_CasesOwened_By_DRC(payload);
        setCases(data);
      } catch (err) {
        setError(err.message);
        setCases([]);
      }
    }
    fetchCases();

  };

  const handlewithdrawbutton = () => {
    alert ("Withdraw button clicked");
  }

  // Pagination handler
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredCases.slice(startIndex, endIndex);

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
    <h1 className={`${GlobalStyle.headingLarge}`}>DRC Case List</h1>
    <h1 className={`${GlobalStyle.headingMedium} mb-5`}>DRC : TCM</h1>

       {/* Filter Section */}
       <div className="flex justify-end gap-10 my-12">
        <div className="flex gap-10 mt-2">
            
           {/* Filter Dropdown (Account No or Case ID) */}
          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className={`${GlobalStyle.selectBox} h-[36px]`}
            >
              <option value="" hidden>Select</option>
              <option value="Account No">Account No</option>
              <option value="Case ID">Case ID</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              placeholder={`Enter ${filterType}`}
              className={`${GlobalStyle.inputText} `}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex flex-col mb-4">
            <div className={GlobalStyle.datePickerContainer}>
              <label className={GlobalStyle.dataPickerDate}>Date </label>
              <DatePicker
                selected={startDate}
                onChange={handlestartdatechange}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/MM/yyyy"
                className={GlobalStyle.inputText}
              />
              <DatePicker
                selected={endDate}
                onChange={handleenddatechange}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/MM/yyyy"
                className={GlobalStyle.inputText}
              />
            </div>
          </div>
        </div>

        <button
          className={`${GlobalStyle.buttonPrimary} h-[35px] mt-2`}
          onClick={handleFilter}
        >
          Filter
        </button>
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
        <div className={GlobalStyle.tableContainer}>
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
                  Arrears Amount
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
                    <td className={GlobalStyle.tableData}>{caseItem.case_id}</td>
                    <td className={GlobalStyle.tableData}>{caseItem.case_current_status}</td>
                    <td className={GlobalStyle.tableData}>{caseItem.account_no}</td>
                    <td className={GlobalStyle.tableData}>{caseItem.current_arrears_amount}</td>
                    <td className={GlobalStyle.tableData}>
                      {new Date(caseItem.created_dtm).toLocaleString()}
                    </td>
                    <td className={GlobalStyle.tableData}>
                    {caseItem.end_dtm.trim() && !isNaN(new Date(caseItem.end_dtm.trim()).getTime()) 
                      ? new Date(caseItem.end_dtm.trim()).toLocaleDateString() 
                      : ""}
                    </td>
                    <td className={GlobalStyle.tableData}>
                    <button
                    className={GlobalStyle.buttonPrimary}
                    onClick={() =>
                    navigate(
                    `/pages/Distribute/ReAssignDRC?caseId=${caseItem.case_id}&accountNo=${caseItem.account_no}`
                     )
                    }
                     title="Re-Assign" // Shows tooltip on hover
                    >
                    <FaUserEdit /> {/* Icon for Re-Assign */}
                    </button>

                    <button className={GlobalStyle.buttonPrimary} title="Withdraw" onClick={handlewithdrawbutton}>
                    <FaUndo /> {/* Icon for Withdraw */}
                    </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className={GlobalStyle.tableData}>
                    No cases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </div>
        
      

      {/* Pagination */}
      <div className={GlobalStyle.navButtonContainer}>
      <button
          onClick={() => handlePrevNext("prev")}
          disabled={currentPage === 1}
          className={`${GlobalStyle.navButton} ${
            currentPage === 1 ? "cursor-not-allowed" : ""
          }`}
        >
          <FaArrowLeft />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePrevNext("next")}
          disabled={currentPage === totalPages}
          className={`${GlobalStyle.navButton} ${
            currentPage === totalPages ? "cursor-not-allowed" : ""
          }`}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
