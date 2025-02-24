/*Purpose: This template is used for the 1.15.2 - DRC Assign Manager Approval 
Created Date: 2025-02-17
Created By: Sanjaya (sanjayaperera80@gmail.com)
Last Modified Date: 2025-02-17
Version: node 20
ui number : 1.15.2
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the codes */

import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Importing GlobalStyle
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  List_DRC_Assign_Manager_Approval,
  Approve_DRC_Assign_Manager_Approval,
} from "../../services/case/CaseServices";
import { getLoggedUserId } from "/src/services/auth/authService.js";
import one from "/src/assets/images/imagefor1.a.13(one).png";
import Swal from "sweetalert2";

export default function DRCAssignManagerApproval3() {
  // State for search query and filtered data
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([]);
  const [drcFilter, setDrcFilter] = useState(""); // DRC filter state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 2;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  // Filter data based on selected filters
  const applyFilters = async () => {
    const payload = {};
    if (drcFilter) {
      payload.approver_type = drcFilter;
    }
    if (startDate) {
      payload.date_from = startDate;
    }
    if (endDate) {
      payload.date_to = endDate;
    }

    console.log("Filtered Request Data:", payload);

    try {
      const response = await List_DRC_Assign_Manager_Approval(payload);
      setFilteredData(response);
    } catch (error) {
      console.error("Error fetching DRC assign manager approval:", error);
    }
  };
  // Handle pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Filtering the data based on search query
  const filteredDataBySearch = searchQuery
    ? filteredData.filter((row) =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : currentData;

  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all rows in the filtered data
      setSelectedRows(
        new Set(filteredDataBySearch.map((row) => row.approver_reference))
      );
    } else {
      // Deselect all rows
      setSelectedRows(new Set());
    }
  };

  const handleRowSelect = (caseid) => {
    const newSelectedRows = new Set(selectedRows);

    if (newSelectedRows.has(caseid)) {
      newSelectedRows.delete(caseid);
    } else {
      if (newSelectedRows.size >= 5) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "You can only select 5 records at a time.",
          confirmButtonColor: "#f1c40f",
        });
        return;
      }
      newSelectedRows.add(caseid);
    }

    setSelectedRows(newSelectedRows);

    // Automatically deselect the "Select All" checkbox if any row is deselected
    if (newSelectedRows.size !== filteredData.length) {
      setSelectAll(false);
    } else {
      setSelectAll(true);
    }
  };

  const handleOnApproveTypeChange = (e) => {
    setDrcFilter(e.target.value);
  };

  const onApproveButtonClick = async () => {
    const userId = await getLoggedUserId();
    const batchIds = Array.from(selectedRows);
    console.log("Selected batch IDs:", batchIds);
    if (batchIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select at least one record to approve.",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }
    const payload = {
      approver_references: batchIds,
      approved_by: userId,
    };
    console.log("Approve payload:", payload);
    try {
      const response = await Approve_DRC_Assign_Manager_Approval(payload);
      console.log("Approve response:", response);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Selected records have been approved successfully.",
        confirmButtonColor: "#f1c40f",
      });
      setSelectAll(false);
      setSelectedRows(new Set());
    } catch (error) {
      console.error("Error approving batch:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while approving the selected records.",
        confirmButtonColor: "#f1c40f",
      });
    }
  };

  function onSubmit() {
    alert("Create task and let me know");
  }
  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Assigned DRC Summary</h1>
      <div className="flex justify-between mt-16 mb-6">
        <div className="flex justify-start mb-8">
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

        <div className="flex gap-10">
          {" "}
          <div className="flex gap-4 h-[35px] mt-2">
            <select
              className={GlobalStyle.selectBox}
              value={drcFilter}
              onChange={handleOnApproveTypeChange}
            >
              <option value="" hidden>
                Select Approve Type
              </option>
              <option value="DRC_ReAssign">DRC_ReAssign</option>
            </select>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className={GlobalStyle.datePickerContainer}>
              <label className={GlobalStyle.dataPickerDate}>Date </label>

              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className={GlobalStyle.inputText}
              />

              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className={GlobalStyle.inputText}
              />
            </div>
          </div>
          <button
            onClick={applyFilters}
            className={`${GlobalStyle.buttonPrimary} h-[35px] mt-2`}
          >
            Filter
          </button>
        </div>
      </div>

      {/* Search Section */}

      {/* Table Section */}
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>
                {/* <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="mx-auto"
                /> */}
              </th>
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Created on</th>
              <th className={GlobalStyle.tableHeader}>Created by</th>
              <th className={GlobalStyle.tableHeader}>Approve Type</th>
              <th className={GlobalStyle.tableHeader}>Approve Status</th>
              <th className={GlobalStyle.tableHeader}>Approve By</th>
              <th className={GlobalStyle.tableHeader}>Remark</th>
              <th className={GlobalStyle.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.length > 0 ? (
              filteredDataBySearch.map((item, index) => (
                <tr
                  key={`${item.drc}-${index}`}
                  className={
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
                >
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(item.approver_reference)}
                      onChange={() => handleRowSelect(item.approver_reference)}
                      className="mx-auto"
                    />
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {item.approver_reference}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {new Date(item.created_on).toLocaleDateString()}
                  </td>
                  <td className={GlobalStyle.tableData}>{item.created_by}</td>
                  <td className={GlobalStyle.tableData}>
                    {item.approver_type}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {item.approver_status
                      ? item.approver_status
                      : "Pending Approval"}
                  </td>
                  <td className={GlobalStyle.tableData}>{item.approved_by}</td>
                  <td className={GlobalStyle.tableData}>
                    {item.remark.length > 0
                      ? item.remark[item.remark.length - 1].remark
                      : "N/A"}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <button>
                      <img
                        src={one}
                        width={15}
                        height={15}
                        alt="Summary"
                        style={{
                          position: "relative",
                          top: "4px",
                          right: "2px",
                        }}
                      />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className={GlobalStyle.tableData}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
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
        <span className={`${GlobalStyle.pageIndicator} mx-4`}>
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

        {/* Approve Button */}
        <button onClick={onSubmit} className={GlobalStyle.buttonPrimary}>
          Reject
        </button>
        <button
          onClick={onApproveButtonClick}
          className={GlobalStyle.buttonPrimary}
        >
          Approve
        </button>
      </div>
      <div>
        <button onClick={onSubmit} className={GlobalStyle.buttonPrimary}>
          Create Task and Let me know
        </button>
      </div>
    </div>
  );
}
