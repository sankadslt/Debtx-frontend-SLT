/* Purpose: This template is used for the 9.1 - Write Off case list .
Created Date: 2025-04-03
Created By: Buthmi mithara (buthmimithara1234@gmail.com)
Version: node 20
ui number : 9.1
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the Write Off case list Screen */

import React, { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import {
  FaArrowLeft,
  FaArrowRight,
  FaSearch,
  FaDownload,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import PendingWriteOff from "../../assets/images/Write_Off/Pending Write-Off.png";
import WriteOff from "../../assets/images/Write_Off/Write-Off.png";
import { Tooltip } from "react-tooltip";
import { Create_Task_For_Downloard_Write_Off_List, List_All_Write_off_Cases } from "../../services/writeoff/writeOffService";
import { getLoggedUserId } from "../../services/auth/authService";

const rowsPerPage = 10;

const WriteOffCaseList = () => {
  // Filter and search state
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Data and UI state
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAPIPages, setTotalAPIPages] = useState(1);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const rowsPerPage = 10; // Number of rows per page

  // variables need for table
  // const maxPages = Math.ceil(filteredDataBySearch.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Status icon logic
  const getStatusIcon = (status) => {
    switch ((status || "").toLowerCase()) {
      case "pending write off":
        return PendingWriteOff;
      case "write off":
        return WriteOff;
      default:
        return null;
    }
  };

  // Format amount with commas
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return "";
    return Number(amount).toLocaleString("en-US");
  };

  // Fetch data from backend API when Filter button is pressed
  const handleFilter = async (page = 1) => {
    if (!selectedStatus && !selectedFromDate && !selectedToDate) {
      Swal.fire({
        title: "Action required!",
        text: "Please select at least one filter (status or date range).",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      return;
    }
    if (selectedFromDate && selectedToDate && selectedFromDate > selectedToDate) {
      Swal.fire({
        title: "Invalid Date Range",
        text: "'From' date cannot be after 'To' date.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsLoading(true);

    // Format dates as YYYY-MM-DD
    const formatDate = (date) => {
      if (!date) return undefined;
      const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      return d.toISOString().split("T")[0];
    };

    try {
      const payload = {
        status: selectedStatus
          ? selectedStatus === "Pending write off"
            ? "Pending Write Off"
            : "Write Off"
          : undefined,
        fromDate: selectedFromDate ? formatDate(selectedFromDate) : undefined,
        toDate: selectedToDate ? formatDate(selectedToDate) : undefined,
        page,
        limit: rowsPerPage,
      };
      Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);
      const response = await List_All_Write_off_Cases(payload);

      if (response.status === "success" && response.data && response.data.results) {
        setFilteredData(response.data.results);
        setTotalPages(response.data.pagination ? response.data.pagination.pages : 1);
        setCurrentPage(page);
      } else {
        setFilteredData([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (error) {
      setFilteredData([]);
      setTotalPages(1);
      setCurrentPage(1);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to fetch write-off cases.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) handleFilter(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) handleFilter(currentPage + 1);
  };

  // Date change handlers
  const handleFromDateChange = (date) => {
    if (selectedToDate && date > selectedToDate) {
      Swal.fire({
        title: "Invalid Date Selection!",
        text: "The 'From' date cannot be later than the 'To' date.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    } else {
      setSelectedFromDate(date);
    }
  };
  const handleToDateChange = (date) => {
    if (selectedFromDate && date < selectedFromDate) {
      Swal.fire({
        title: "Invalid Date Selection!",
        text: "The 'To' date cannot be earlier than the 'From' date.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    } else {
      setSelectedToDate(date);
    }
  };

  // Clear filters and table
  const clearFilters = () => {
    setSelectedStatus("");
    setSelectedFromDate(null);
    setSelectedToDate(null);
    setSearchQuery("");
    setFilteredData([]);
    setCurrentPage(1);
    setTotalPages(1);
  };

  // Create Task Handler
  const HandleCreateTaskWriteOffCaseList = async () => {
    const createdBy = "system"; // Replace with actual user if available

    if (!selectedStatus && !selectedFromDate && !selectedToDate) {
      Swal.fire({
        title: "Action required!",
        text: "Please select at least one filter (status or date range) before creating a task.",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      return;
    }
    if (selectedFromDate && selectedToDate && selectedFromDate > selectedToDate) {
      Swal.fire({
        title: "Invalid Date Range",
        text: "'From' date cannot be after 'To' date.",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsCreatingTask(true);
    try {
      const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return d.toISOString().split("T")[0];
      };

      const responseStatus = await Create_Task_For_Downloard_Write_Off_List(
        createdBy,
        null,
        selectedStatus
          ? selectedStatus === "Pending write off"
            ? "Pending Write Off"
            : "Write Off"
          : undefined,
        formatDate(selectedFromDate),
        formatDate(selectedToDate),
        null,
        null
      );

      if (responseStatus === "success") {
        Swal.fire("Success", "Task created successfully!", "success");
      } else {
        Swal.fire("Error", "Failed to create task.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to create task.", "error");
    } finally {
      setIsCreatingTask(false);
    }
  };

  // Filter table rows by search query (case-insensitive, all columns)
  const filteredRows = filteredData.filter(row =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>Write-Off Case List</h1>

      {/* Filter Section */}
      <div className="flex justify-end ">
        <div className={`${GlobalStyle.cardContainer} w-[70vw] mb-8 mt-8`}>
          <div className="flex items-center gap-4 justify-end">
            {/* Status dropdown */}
            <select
              className={GlobalStyle.selectBox}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ color: selectedStatus === "" ? "gray" : "black" }}
            >
              <option value="" hidden>
                Status
              </option>
              <option value="Pending write off" style={{ color: "black" }}>
                Pending Write-Off
              </option>
              <option value="Write off" style={{ color: "black" }}>
                Write Off
              </option>
            </select>

            <label className={GlobalStyle.dataPickerDate}>Date: </label>
            <DatePicker
              selected={selectedFromDate}
              onChange={handleFromDateChange}
              dateFormat="MM/dd/yyyy"
              placeholderText="From"
              className={GlobalStyle.inputText}
            />
            <DatePicker
              selected={selectedToDate}
              onChange={handleToDateChange}
              dateFormat="MM/dd/yyyy"
              placeholderText="To"
              className={GlobalStyle.inputText}
            />
            <button
              className={GlobalStyle.buttonPrimary}
              onClick={() => handleFilter(1)}
            >
              Filter
            </button>

            <button className={GlobalStyle.buttonRemove} onClick={clearFilters}>
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex justify-start">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={GlobalStyle.inputSearch}
            placeholder=""
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>
      </div>

      {/* Table Section */}
      <div className={GlobalStyle.tableContainer}>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th className={GlobalStyle.tableHeader}>Case ID</th>
                <th className={GlobalStyle.tableHeader}>Status</th>
                <th className={GlobalStyle.tableHeader}>Account No</th>
                <th className={GlobalStyle.tableHeader}>Customer Ref</th>
                <th className={GlobalStyle.tableHeader}>Amount</th>
                <th className={GlobalStyle.tableHeader}>Phase</th>
                <th className={GlobalStyle.tableHeader}>Write Off On</th>
              </tr>
            </thead>
            <tbody>
            {filteredRows.length > 0 ? (
                filteredRows.map((row, index) => (
                  <tr
                    key={row.case_id || index}
                    className={`${
                      index % 2 === 0
                        ? "bg-white bg-opacity-75"
                        : "bg-gray-50 bg-opacity-50"
                    } border-b`}
                  >
                    <td className={GlobalStyle.tableData}>{row.case_id}</td>
                    <td className={GlobalStyle.tableData}>
                      <div className="flex justify-center">
                        <img
                          src={getStatusIcon(row.case_current_status)}
                          alt={row.case_current_status}
                          className="w-6 h-6 cursor-pointer"
                          data-tooltip-id={`status-tooltip-${index}`}
                        />
                        <Tooltip
                          id={`status-tooltip-${index}`}
                          place="bottom"
                          effect="solid"
                        >
                          {row.case_current_status}
                        </Tooltip>
                      </div>
                    </td>
                    <td className={GlobalStyle.tableData}>{row.account_no}</td>
                    <td className={GlobalStyle.tableData}>{row.customer_ref}</td>
                    <td className={GlobalStyle.tableData}>
                      {formatAmount(row.amount)}
                    </td>
                    <td className={GlobalStyle.tableData}>{row.case_phase || ""}</td>
                    <td className={GlobalStyle.tableData}>
                      {row.write_off_on
                        ? new Date(row.write_off_on).toLocaleDateString("en-CA")
                        : ""}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No results found. 
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            className={GlobalStyle.navButton}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <FaArrowLeft />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={GlobalStyle.navButton}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      {/* Create Task Button */}
      <button
        onClick={HandleCreateTaskWriteOffCaseList}
        className={`${GlobalStyle.buttonPrimary} ${
          isCreatingTask ? "opacity-50" : ""
        }`}
        disabled={isCreatingTask}
        style={{ display: "flex", alignItems: "center" }}
      >
        {!isCreatingTask && <FaDownload style={{ marginRight: "8px" }} />}
        {isCreatingTask ? "Creating Tasks..." : "Create task and let me know"}
      </button>
    </div>
  );
};

export default WriteOffCaseList;







