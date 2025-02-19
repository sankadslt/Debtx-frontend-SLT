/*Purpose: This template is used for the 1.15.2 - DRC Assign Manager Approval 
Created Date: 2025-02-17
Created By: Sanjaya (sanjayaperera80@gmail.com)
Last Modified Date: 2025-02-17
Last Modified Date: 2025-02-18
Modified By:  Udana (udanarajanayaka220@gmail.com)
Version: node 20
ui number : 1.15.2
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the codes */

import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Importing GlobalStyle
import DatePicker from "react-datepicker";
import {
  List_DRC_Assign_Manager_Approval,
  Approve_DRC_Assign_Manager_Approval,
  Reject_DRC_Assign_Manager_Approval,
  Create_task_for_DRC_Assign_Manager_Approval,
} from "/src/services/distribution/distributionService.js";
import "react-datepicker/dist/react-datepicker.css";

export default function DRCAssignManagerApproval3() {
  // State Variables
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [drcFilter, setDrcFilter] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Fetch data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await List_DRC_Assign_Manager_Approval(approverType,dateFrom,dateTo);
        setData(response); // Set initial data
        setFilteredData(response); // Set filtered data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  // Apply filters
  const applyFilters = () => {
    const filteredData = data.filter((item) => {
      const itemDate = item.createdOn ? new Date(item.createdOn.split(".").join("-")) : null;

      // DRC Filter
      const isDRCMatch = drcFilter ? item.approvalType.toLowerCase().includes(drcFilter.toLowerCase()) : true;

      // Date Range Filter
      const isDateInRange =
        (!startDate || (itemDate && itemDate >= new Date(startDate))) &&
        (!endDate || (itemDate && itemDate <= new Date(endDate)));

      return isDRCMatch && isDateInRange;
    });

    setFilteredData(filteredData);
  };

  // Handle Pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Filter Data by Search Query
  const filteredDataBySearch = searchQuery
    ? filteredData.filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
    )
    : currentData;

  // Handle Row Selection
  const handleRowSelect = (index) => {
    const newSelectedRows = new Set(selectedRows);
    newSelectedRows.has(index) ? newSelectedRows.delete(index) : newSelectedRows.add(index);
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.size === filteredData.length);
  };

  // Handle Select All
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map((_, index) => index)));
    }
    setSelectAll(!selectAll);
  };


  // Approve for DRC Assignments
  const handleApprove = async () => {
    try {
      const approvedBy = "currentUserId"; // Replace with actual user ID
      const response = await Approve_DRC_Assign_Manager_Approval(approverReferences, approvedBy);
      console.log("Approved successfully", response);
      
    } catch (error) {
      console.error("Error during approval:", error);
    }
  };


// Reject for DRC Assignments
  const handleReject = async () => {
    try {
      const approvedBy = "currentUserId"; // Replace with actual user ID
      const response = await Reject_DRC_Assign_Manager_Approval(approverReferences, approvedBy);
      console.log("Rejected successfully", response);
      
    } catch (error) {
      console.error("Error during rejection:", error);
    }
  };

  // Create Task for DRC Assignments
  const handleCreateTask = async () => {
    try {
      const CreatedBy = "currentUserId"; // Replace with actual user ID
      const response = await Create_task_for_DRC_Assign_Manager_Approval(approverReferences, CreatedBy);
      console.log("Task created successfully", response);
      
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };


  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Assigned DRC Summary</h1>

      <div className="flex justify-between mt-16 mb-6">
        <div className="flex justify-start mb-8">
          <div className={GlobalStyle.searchBarContainer}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={GlobalStyle.inputSearch}
            />
            <FaSearch className={GlobalStyle.searchBarIcon} />
          </div>
        </div>

        <div className="flex gap-10">
          <div className="flex gap-4 h-[35px] mt-2">
            <select
              className={GlobalStyle.selectBox}
              value={drcFilter}
              onChange={(e) => setDrcFilter(e.target.value)}
            >
              <option value="">Select Approve Type</option>
              <option value="O1">O1</option>
              <option value="O2">O2</option>
              <option value="O3">O3</option>
            </select>
          </div>

          <div className="flex flex-col items-center mb-4">
            <div className={GlobalStyle.datePickerContainer}>
              <label className={GlobalStyle.dataPickerDate}>Date </label>
              <DatePicker selected={startDate} onChange={setStartDate} dateFormat="dd/MM/yyyy" className={GlobalStyle.inputText} />
              <DatePicker selected={endDate} onChange={setEndDate} dateFormat="dd/MM/yyyy" className={GlobalStyle.inputText} />
            </div>
          </div>

          <button onClick={applyFilters} className={`${GlobalStyle.buttonPrimary} h-[35px] mt-2`}>Filter</button>
        </div>
      </div>

      {/* Table Section */}
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>
                <input type="checkbox" checked={selectAll} onChange={handleSelectAll} className="mx-auto" />
              </th>
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Created on</th>
              <th className={GlobalStyle.tableHeader}>Created by</th>
              <th className={GlobalStyle.tableHeader}>Approve Type</th>
              <th className={GlobalStyle.tableHeader}>Approve Status</th>
              <th className={GlobalStyle.tableHeader}>Approve By</th>
              <th className={GlobalStyle.tableHeader}>Remark</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}>
                <td className="text-center">
                  <input type="checkbox" checked={selectedRows.has(index)} onChange={() => handleRowSelect(index)} className="mx-auto" />
                </td>
                <td className={GlobalStyle.tableData}>{item.caseId}</td>
                <td className={GlobalStyle.tableData}>{item.createdOn}</td>
                <td className={GlobalStyle.tableData}>{item.createdBy}</td>
                <td className={GlobalStyle.tableData}>{item.approvalType}</td>
                <td className={GlobalStyle.tableData}>{item.approvalStatus}</td>
                <td className={GlobalStyle.tableData}>{item.approvalBy}</td>
                <td className={GlobalStyle.tableData}>{item.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className={GlobalStyle.navButtonContainer}>
        <button
          onClick={() => handlePrevNext("prev")}
          disabled={currentPage === 1}
          className={`${GlobalStyle.navButton} ${currentPage === 1 ? "cursor-not-allowed" : ""}`}
        >
          <FaArrowLeft />
        </button>
        <span className={`${GlobalStyle.pageIndicator} mx-4`}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePrevNext("next")}
          disabled={currentPage === totalPages}
          className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""}`}
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Select All Data Checkbox and Approve Button */}
      <div className="flex justify-end gap-4 mt-4">
        {/* Select All Data Checkbox */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded-lg"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          Select All Data
        </label>

        {/* Reject Button */}
        <button onClick={handleReject} className={GlobalStyle.buttonPrimary}>
          Reject
        </button>

        {/* Approve Button */}
        <button onClick={handleApprove} className={GlobalStyle.buttonPrimary}>
          Approve
        </button>
      </div>

      <div>

        {/* Let me know Button */}
        <button onClick={handleCreateTask} className={GlobalStyle.buttonPrimary}>
          Create Task and Let me know
        </button>
      </div>
    </div>
  );
}

