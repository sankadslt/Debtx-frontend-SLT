/*
Purpose: 
Created Date: 2025.01.24
Created By: Nadali Linara
Last Modified Date: 2025.01.26
Modified By:buthmi mithara
Version: node 11
ui number : 1.7.4
Dependencies: tailwind css
Related Files: 
Notes: 

*/

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaArrowLeft, FaArrowRight, FaSearch , FaDownload } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import "react-datepicker/dist/react-datepicker.css";
import Incident_Reject from "../../assets/images/incidents/Incident_Reject.png";
import { Create_Rejected_List_for_Download, List_Reject_Incident } from "../../services/distribution/distributionService.js";
import Swal from "sweetalert2";
import  { Tooltip } from "react-tooltip";

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

export default function RejectIncidentlog() {
  const navigate = useNavigate();
 
  // Table data exactly matching the image
  // const tableData = [
  //   {
  //     id: "RC001",
  //     status: "Incident Reject",
  //     account_no: "0115678",
  //     filtered_reason: "credit class",
  //     reject_owned: "9/10/2024",
  //     reject_by: "7634",
  //   },
  //   {
  //     id: "RC002",
  //     status: "Incident Reject",
  //     account_no: "0115678",
  //     filtered_reason: "customer type",
  //     reject_owned: "9/10/2024",
  //     reject_by: "3476",
  //   },
  //   {
  //     id: "RC003",
  //     status: "Incident Reject",
  //     account_no: "0115678",
  //     filtered_reason: "credit class",
  //     reject_owned: "9/10/2024",
  //     reject_by: "7634",
  //   },
  // ];

  // Filter state
  const [fromDate, setFromDate] = useState(null); // usestate for the date
  const [toDate, setToDate] = useState(null); // usestate for the to date
  const [error, setError] = useState(""); // usestate for error message
  const [tableData, setTableData] = useState([]); // usestate for the table data
  const [selectAllData, setSelectAllData] = useState(false); // usestate for the selected rows
  const [selectedRows, setSelectedRows] = useState([]);  // usestate for the selected rows
  const [searchQuery, setSearchQuery] = useState(""); // useestate for the search query
  const [currentPage, setCurrentPage] = useState(0); // Changed to 0-based indexing
  const [selectedAction, setSelectedAction] = useState(""); // usestate for the selected action
  const [isLoading, setIsLoading] = useState(true); // useestate for loading state
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons

  const rowsPerPage = 7; // Number of rows per page


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
  }, []);

   // Function to fetch incident counts 
  const fetchData = async () => {
      try {
          const filters= {
            Action_Type:selectedAction,
            FromDate:fromDate,
            ToDate:toDate
          }
          const response = await List_Reject_Incident(filters);
          const formattedData = response?.data.map((item) => {
            
            const createdDateStr = typeof item.Created_Dtm === "string" ? item.Created_Dtm.replace(" ", "T") : item.Created_Dtm;
            const rejectedDateStr = typeof item.Rejected_Dtm === "string" ? item.Rejected_Dtm.replace(" ", "T") : item.Rejected_Dtm;
            const createdDate = createdDateStr ? new Date(createdDateStr) : null;
            const rejectedDate = rejectedDateStr ? new Date(rejectedDateStr) : null;
            return {
              id: item.Incident_Id || "N/A",
              status: "Incident Reject",
              account_no: item.Account_Num || "N/A",
              filtered_reason: item.Filtered_Reason || "N/A",
              source_type: item?.Source_Type || "N/A",
              reject_by: item.Rejected_By ||"N/A",
              reject_dtm: isNaN(rejectedDate) ? "N/A" : rejectedDate.toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric", // Ensures two-digit year (YY)
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true, // Keeps AM/PM format

              }),
              created_dtm: isNaN(createdDate) ? "N/A" : createdDate.toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric", // Ensures two-digit year (YY)
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true, // Keeps AM/PM format
              }),
            };
          });
          setTableData(formattedData);
          setIsLoading(false);
      } catch {
          setError("Failed to fetch DRC details. Please try again later.");
          setIsLoading(false);
      }
    };
      
  // UseEffect to load   
  useEffect(() => {
    fetchData();
  }, []);

  
  const handleFilterClick = () => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
        
      if (!selectedAction && !from && !to) {
          Swal.fire({
            title: "Missing Filters",
            text: "Please select a Source Type or provide both From Date and To Date.",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#f1c40f"
          });
          return;
      }
      
      if ((from && !to) || (!from && to)) {
          Swal.fire({
            title: "Incomplete Date Range",
            text: "Both From Date and To Date must be selected together.",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#f1c40f"
          });
          return;
      }
      
      if (selectedAction || (from && to)) {
        if (from && to) {
          const monthDiff = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
      
            if (monthDiff > 1 || (monthDiff === 1 && to.getDate() > from.getDate())) {
              Swal.fire({
                title: "Long Date Range",
                text: "The selected date range exceeds one month. Consider creating a task instead.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Create Task",
                confirmButtonColor: "#28a745",
                cancelButtonColor: "#d33",
                cancelButtonText: "Cancel",
              }).then((result) => {
                if (result.isConfirmed) {
                  handleCreateTaskForDownload({
                    action_type: selectedAction, 
                    fromDate: fromDate, 
                    toDate: toDate
                  })
                } 
              });
              return;
            }
          }
          fetchData(); 
        }
  };

  const handleclearFilter = () => {
    setFromDate(null);
    setToDate(null);
    setSelectedAction("");
    setSearchQuery("");
    setSelectAllData(false); // Reset select all checkbox
     // Fetch data again to reset the table
  };

  useEffect(() => {
    if (fromDate === null && toDate === null && selectedAction === "") {
        fetchData();
    }
}, [fromDate, toDate, selectedAction]);

  
  const handleCreateTaskForDownload = async({action_type, fromDate, toDate}) => {
    
      if(!action_type && !fromDate && !toDate){
            Swal.fire({
              title: 'Warning',
              text: 'Please select a Action Type or provide both From Date and To Date.',
              icon: 'warning',
              confirmButtonText: 'OK',
              confirmButtonColor: "#f1c40f"
            });
          } else if (!fromDate && !toDate) {
            Swal.fire({
              title: "warning",
              text: "Please select both From Date and To Date.",
              icon: "warning",
              confirmButtonText: "OK",
              confirmButtonColor: "#f1c40f"
            });
          }
          else if ((fromDate && !toDate) || (!fromDate && toDate)) {
            Swal.fire({
              title: "Incomplete Date Range",
              text: "Both From Date and To Date must be selected together.",
              icon: "warning",
              confirmButtonText: "OK",
              confirmButtonColor: "#f1c40f"
            });
            return;
          } else{
          try{
            const filteredParams = {
              Action_Type:action_type,
              FromDate:fromDate,
              ToDate:toDate
            }
            const response = await Create_Rejected_List_for_Download(filteredParams);
            if(response.status===201){
              Swal.fire({ 
                title: 'Success',
                text: 'Task successfully created',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: "#28a745"
              });
            }
          }catch(error){
            Swal.fire({
              title: 'Error',
              text: 'Error creating task',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: "#d33"

            });
          }
          }
    };
  // validation for date
  const handleFromDateChange = (date) => {
    if (toDate && date > toDate) {
     
      Swal.fire({
                                        title: "Error",
                                        text: "The 'From' date cannot be later than the 'To' date.",
                                        icon: "error",
                                        confirmButtonColor: "#f1c40f", 
                                    });;
    }  else if (toDate){
      // Calculate month gap
            const diffInMs = toDate - date;
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
            
            if (diffInDays > 31) {
                Swal.fire({
                    title: "Warning",
                    text: "The selected range is more than 1 month.",
                    icon: "warning",
                    confirmButtonColor: "#f1c40f",
                });
              
                return;
          }
          setFromDate(date);
        } else {
      setError("");
      setFromDate(date);
    }
  };

  // validation for date
  const handleToDateChange = (date) => {
    if (fromDate && date < fromDate) {
      Swal.fire({
                                        title: "Error",
                                        text: "The 'To' date cannot be earlier than the 'From' date.",
                                        icon: "error",
                                        confirmButtonColor: "#f1c40f",
                                    });
    } else if (fromDate) {
      // Calculate month gap
            const diffInMs = date - fromDate;
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
            
            if (diffInDays > 31) {
                Swal.fire({
                    title: "Warning",
                    text: "The selected range is more than 1 month.",
                    icon: "warning",
                    confirmButtonColor: "#f1c40f",
                });
              
                return;
          }
          setToDate(date);
        }else {
      setError("");
      setToDate(date);
    }
  };

  //search fuction
  const filteredData = tableData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Calculate total pages
  const pages = Math.ceil(filteredData.length / rowsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleRowCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAllDataChange = () => {
    if (selectAllData) {
      setSelectedRows([]); // Clear all selections
    } else {
      setSelectedRows(filteredData.map((row) => row.id)); // Select all visible rows
    }
    setSelectAllData(!selectAllData);
  };

  return (
    <div>
    {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
    <div className={GlobalStyle.fontPoppins}>
      <div className="flex justify-between items-center w-full">
        <h1 className={`${GlobalStyle.headingLarge} m-0`}>
          Rejected Incident Log
        </h1>
      </div>

      {/* Filter Section */}
      <div  className="flex justify-end">
          <div className={`${GlobalStyle.cardContainer}  items-center w-[70vw] mb-8 mt-8`}>
            <div className="flex items-center gap-4 justify-end">
                {/* Source Dropdown */}
                <div className="flex items-center gap-4">
                  <select
                    className={GlobalStyle.inputText}
                    value={selectedAction}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    style={{ color: selectedAction === "" ? "gray" : "black" }}
                  >
                    <option value="" hidden>Action Type</option>
                    <option value="collect arrears" style={{ color: "black" }}>Collect Arrears</option>
                    <option value="collect arrears and CPE" style={{ color: "black" }}>Collect Arrears and CPE</option>
                    <option value="collect CPE" style={{ color: "black" }}>Collect CPE</option>
                  </select>
                </div>

                {/* Date Picker Section */}
                <div className="flex items-center gap-4">
                  <label>Date:</label>
                  <DatePicker
                    selected={fromDate}
                    onChange={handleFromDateChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="From"
                    className={GlobalStyle.inputText}
                  />
                  <DatePicker
                    selected={toDate}
                    onChange={handleToDateChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="To"
                    className={GlobalStyle.inputText}
                  />
                  {error && <span className={GlobalStyle.errorText}>{error}</span>}
                </div>

                {/* Filter Button */}
                {/* <button
                  className={`${GlobalStyle.buttonPrimary} h-[35px]`}
                  onClick={handleFilterClick}
                >
                  Filter
                </button> */}
                <div>
                        {["admin", "superadmin", "slt"].includes(userRole) && (
                          <button
                          className={`${GlobalStyle.buttonPrimary} h-[35px]`}
                          onClick={handleFilterClick}
                        >
                          Filter
                        </button>
                        )}
                      </div>
                {/* Clear Button */}
                {/* <button className={GlobalStyle.buttonRemove} onClick={handleclearFilter}>
                                        Clear
                            </button> */}
                            <div>
                        {["admin", "superadmin", "slt"].includes(userRole) && (
                          <button className={GlobalStyle.buttonRemove} onClick={handleclearFilter}>
                          Clear
                           </button>
                        )}
                      </div>
            </div>
          </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col">
        {/* Search Bar Section */}
        <div className="mb-4 flex justify-start">
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
        </div>
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                {/* <th scope="col" className={GlobalStyle.tableHeader}></th> */}
                <th scope="col" className={GlobalStyle.tableHeader}>
                  ID
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Status
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Account No
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Filtered Reason
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Rejected By
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Rejected Dtm
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Created Dtm
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white bg-opacity-75"
                      : "bg-gray-50 bg-opacity-50"
                  } border-b`}
                >
                  {/* <td className={GlobalStyle.tableData} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      className={"rounded-lg"}
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowCheckboxChange(row.id)}
                    />
                  </td> */}
                  <td className={GlobalStyle.tableData}>
                    <a href={`#${row.id}`} className="hover:underline">
                      {row.id}
                    </a>
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <div className="flex justify-center items-center h-full">
                      {row.status.toLowerCase() === "incident reject" && (
                        <div
                          data-tooltip-id="tooltip-incident-reject"
                        >
                          <img
                            src={Incident_Reject}
                            alt="Incident Reject"
                            className="w-5 h-5"
                          />
                          
                          <Tooltip
                            id="tooltip-incident-reject"
                            place="bottom"
                            content="Incident Reject"></Tooltip>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className={GlobalStyle.tableData}>{row.account_no}</td>
                  <td className={GlobalStyle.tableData}>
                    {row.filtered_reason}
                  </td>
                  <td className={GlobalStyle.tableData}>{row.reject_by}</td>
                  <td className={GlobalStyle.tableData}>{row.reject_dtm}</td>
                  <td className={GlobalStyle.tableData}>{row.created_dtm}</td>
                  
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Buttons */}
      {filteredData.length > rowsPerPage && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            className={GlobalStyle.navButton}
            onClick={handlePrevPage}
            disabled={currentPage === 0}
          >
            <FaArrowLeft />
          </button>
          <span>
            Page {currentPage + 1} of {pages}
          </span>
          <button
            className={GlobalStyle.navButton}
            onClick={handleNextPage}
            disabled={currentPage === pages - 1}
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      <div className="flex justify-end items-center w-full mt-6">
        {/* Select All Data Checkbox */}
        {/* <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded-lg"
            checked={
              selectAllData ||
              filteredData.every((row) => selectedRows.includes(row.id))
            } // Reflect selection state
            onChange={handleSelectAllDataChange}
          />
          Select All Data
        </label> */}
                  { paginatedData.length > 0 && (
                    <div>
                        {["admin", "superadmin", "slt"].includes(userRole) && (
                          <button
                          className={`${GlobalStyle.buttonPrimary} ml-4 flex items-center`}
                          onClick={()=>{handleCreateTaskForDownload({
                            action_type: selectedAction, 
                            fromDate: fromDate, 
                            toDate: toDate
                          })}}
                        >
                           <FaDownload className="mr-2" />
                          Create Task Let Me Know
                        </button>
                        )}
                      </div>
                  )}
        {/* <button
          className={`${GlobalStyle.buttonPrimary} ml-4 flex items-center`}
          onClick={()=>{handleCreateTaskForDownload({
            action_type: selectedAction, 
            fromDate: fromDate, 
            toDate: toDate
          })}}
        >
           <FaDownload className="mr-2" />
          Create Task Let Me Know
        </button> */}
      </div>
    </div>
      )}
    </div>
  );
}
