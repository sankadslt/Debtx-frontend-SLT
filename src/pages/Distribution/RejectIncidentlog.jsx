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
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import "react-datepicker/dist/react-datepicker.css";
import Incident_Reject from "../../assets/images/Incident_Reject.png";
import { Create_Rejected_List_for_Download, List_Reject_Incident } from "../../services/distribution/distributionService.js";
import Swal from "sweetalert2";

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
  const [fromDate, setFromDate] = useState(null); //for date
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [tableData, setTableData] = useState([]);
  const [selectAllData, setSelectAllData] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Changed to 0-based indexing
  const [selectedAction, setSelectedAction] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const rowsPerPage = 7; // Number of rows per page

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
              reject_dtm: isNaN(rejectedDate) ? "N/A" : rejectedDate.toLocaleString() || "N/A",
              created_dtm: isNaN(createdDate) ? "N/A" : createdDate.toLocaleString() || "N/A"
            };
          });
          setTableData(formattedData);
          setIsLoading(false);
      } catch {
          setError("Failed to fetch DRC details. Please try again later.");
          setIsLoading(false);
      }
    };
      
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
          });
          return;
      }
      
      if ((from && !to) || (!from && to)) {
          Swal.fire({
            title: "Incomplete Date Range",
            text: "Both From Date and To Date must be selected together.",
            icon: "warning",
            confirmButtonText: "OK",
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
  
  const handleCreateTaskForDownload = async({action_type, fromDate, toDate}) => {
    
      if(!action_type && !fromDate && !toDate){
            Swal.fire({
              title: 'Warning',
              text: 'Missing Parameters',
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          }
          else if ((fromDate && !toDate) || (!fromDate && toDate)) {
            Swal.fire({
              title: "Incomplete Date Range",
              text: "Both From Date and To Date must be selected together.",
              icon: "warning",
              confirmButtonText: "OK",
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
                confirmButtonText: 'OK'
              });
            }
          }catch(error){
            Swal.fire({
              title: 'Error',
              text: 'Error creating task',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
          }
    };
  // validation for date
  const handleFromDateChange = (date) => {
    if (toDate && date > toDate) {
      setError("The 'From' date cannot be later than the 'To' date.");
    } else {
      setError("");
      setFromDate(date);
    }
  };

  // validation for date
  const handleToDateChange = (date) => {
    if (fromDate && date < fromDate) {
      setError("The 'To' date cannot be earlier than the 'From' date.");
    } else {
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
      <div className="flex justify-end gap-10 my-12 items-center">
        {/* Source Dropdown */}
        <div className="flex items-center gap-4">
          <select
            className={GlobalStyle.inputText}
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
          >
            <option value="">Action Type</option>
            <option value="collect arrears">Collect Arrears</option>
            <option value="collect arrears and CPE">Collect Arrears and CPE</option>
            <option value="collect CPE">Collect CPE</option>
          </select>
        </div>

        {/* Date Picker Section */}
        <div className="flex items-center gap-4">
          <label>Date:</label>
          <DatePicker
            selected={fromDate}
            onChange={handleFromDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/MM/yyyy"
            className={GlobalStyle.inputText}
          />
          <DatePicker
            selected={toDate}
            onChange={handleToDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/MM/yyyy"
            className={GlobalStyle.inputText}
          />
          {error && <span className={GlobalStyle.errorText}>{error}</span>}
        </div>

        {/* Filter Button */}
        <button
          className={`${GlobalStyle.buttonPrimary} h-[35px]`}
          onClick={handleFilterClick}
        >
          Filter
        </button>
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
                <th scope="col" className={GlobalStyle.tableHeader}></th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  ID
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Status
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Account No.
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
                  <td className={GlobalStyle.tableData}>
                    <input
                      type="checkbox"
                      className={"rounded-lg"}
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowCheckboxChange(row.id)}
                    />
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <a href={`#${row.id}`} className="hover:underline">
                      {row.id}
                    </a>
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <div className="flex justify-center items-center h-full">
                      {row.status.toLowerCase() === "incident reject" && (
                        <div
                          title="Incident Reject"
                          aria-label="Incident Reject"
                        >
                          <img
                            src={Incident_Reject}
                            alt="Incident Reject"
                            className="w-5 h-5"
                          />
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
        <label className="flex items-center gap-2">
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
        </label>

        <button
          className={`${GlobalStyle.buttonPrimary} ml-4`}
          onClick={()=>{handleCreateTaskForDownload({
            action_type: selectedAction, 
            fromDate: fromDate, 
            toDate: toDate
          })}}
        >
          Create Task Let Me Know
        </button>
      </div>
    </div>
      )}
    </div>
  );
}
