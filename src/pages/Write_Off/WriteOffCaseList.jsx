/* Purpose: This template is used for the 9.1 - Write Off case list .
Created Date: 2025-04-03
Created By: Buthmi mithara (buthmimithara1234@gmail.com)
Version: node 20
ui number : 9.1
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the Write Off case list Screen */

import React, { useState, useEffect } from "react";
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
import {
  Create_Task_For_Downloard_Write_Off_List,
  List_All_Write_off_Cases,
} from "../../services/writeoff/writeOffService";
import { getLoggedUserId } from "../../services/auth/authService";

// Number of rows per page for pagination
const rowsPerPage = 10;

const WriteOffCaseList = () => {
  // -------------------- State Management --------------------
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

  // Calculate indices for paginated data display
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // -------------------- Utility Functions --------------------

  // Return the icon image based on status
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

  // Format amount with commas for display
  const formatAmount = (amount) => {
    if (amount === undefined || amount === null) return "";
    return Number(amount).toLocaleString("en-US");
  };

  // Format JS Date object as YYYY-MM-DD string for API
  const formatDate = (date) => {
    if (!date) return null;
    const offsetDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return offsetDate.toISOString().split("T")[0];
  };

  // -------------------- Data Fetching & Filtering --------------------

  // Fetch filtered data from backend based on filters and pagination
  const handleFilter = async () => {
    try {
      // Validate at least one filter is selected
      if (!selectedStatus && !selectedFromDate && !selectedToDate) {
        Swal.fire({
          title: "Warning",
          text: "Please select at least one filter (status or date range).",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        setSelectedFromDate(null);
        setSelectedToDate(null);
        return;
      }
      // Ensure both dates are selected if one is
      if (
        (selectedFromDate && !selectedToDate) ||
        (!selectedFromDate && selectedToDate)
      ) {
        Swal.fire({
          title: "Warning",
          text: "Both From Date and To Date must be selected.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        setSelectedFromDate(null);
        setSelectedToDate(null);
        return;
      }
      // Ensure date range is valid
      if (
        selectedFromDate &&
        selectedToDate &&
        new Date(selectedFromDate) > new Date(selectedToDate)
      ) {
        Swal.fire({
          title: "Warning",
          text: "To date should be greater than or equal to From date.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false,
        });
        setSelectedFromDate(null);
        setSelectedToDate(null);
        return;
      }

      console.log(currentPage);

      setIsLoading(true);

      // Build payload for API
      const payload = {
        status: selectedStatus
          ? selectedStatus === "Pending write off"
            ? "Pending Write Off"
            : "Write Off"
          : undefined,
        fromDate: selectedFromDate ? formatDate(selectedFromDate) : undefined,
        toDate: selectedToDate ? formatDate(selectedToDate) : undefined,
        page: currentPage,
        limit: rowsPerPage,
      };
      console.log("Payload sent to API: ", payload);
      
      // Remove undefined fields for clean API request
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key]
      );

      // API call to fetch cases
      const response = await List_All_Write_off_Cases(payload).catch(
        (error) => {
          if (error.response && error.response.status === 404) {
            Swal.fire({
              title: "No Results",
              text: "No matching data found for the selected filters.",
              icon: "warning",
              allowOutsideClick: false,
              allowEscapeKey: false,
            });
            setFilteredData([]);
            return null;
          } else {
            throw error;
          }
        }
      );

      setIsLoading(false);

      // Handle API response and update state
      if (
        response &&
        response.status === "success" &&
        response.data &&
        response.data.results
      ) {
        const apiPages = response.data.pagination?.pages || 1;
        setTotalPages(apiPages);
        setTotalAPIPages(apiPages);
        // Append new results for pagination
        setFilteredData((prevData) => [...prevData, ...response.data.results]);
      } else {
        setFilteredData([]);
        setTotalPages(1);
      }
    } catch (error) {
      setFilteredData([]);
      setTotalPages(1);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to fetch write-off cases.",
        icon: "error",
      });
      setIsLoading(false);
    }
  };

  // -------------------- Date Change Handlers --------------------

  // Ensure from date is not after to date
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

  // Ensure to date is not before from date
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

  // -------------------- Pagination Logic --------------------

  // Handle api calling only when the currentPage incriment more that before
  // Only fetch next page from API if needed
  const handlePageChange = () => {
    if (currentPage > maxCurrentPage && currentPage <= totalAPIPages) {
      setMaxCurrentPage(currentPage);
      handleFilter(); // Call the filter function only after the page incrimet
    }
  };

  // Watch for page change and trigger data fetch if filter is applied
  useEffect(() => {
    if (isFilterApplied) {
      handlePageChange(); // Call the function whenever currentPage changes
    }
    // eslint-disable-next-line
  }, [currentPage]);

  // Handle next/previous page button clicks
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // -------------------- Filter/Clear/Search Logic --------------------

  // When filter button is pressed, reset data and start from page 1
  const handleFilterButton = () => {
    setFilteredData([]);
    setMaxCurrentPage(0);
    setTotalAPIPages(1);
    if (currentPage === 1) {
      handleFilter();
    } else {
      setCurrentPage(1);
    }
    setIsFilterApplied(true);
  };

  // Reset all filters, search, pagination and data
  const handleClear = () => {
    setSelectedStatus("");
    setSelectedFromDate(null);
    setSelectedToDate(null);
    setSearchQuery("");
    setFilteredData([]);
    setCurrentPage(1);
    setTotalPages(1);
    setIsFilterApplied(false);
    setTotalAPIPages(1);
  };

  // -------------------- Task Creation Logic --------------------

  // Create a download task for the current filter
  const HandleCreateTaskWriteOffCaseList = async () => {
    const userData = await getLoggedUserId();

    // Validate filters before creating task
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
    if (
      selectedFromDate &&
      selectedToDate &&
      selectedFromDate > selectedToDate
    ) {
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
      const responseStatus = await Create_Task_For_Downloard_Write_Off_List(
        userData,
        selectedStatus
          ? selectedStatus === "Pending write off"
            ? "Pending Write Off"
            : "Write Off"
          : undefined,
        formatDate(selectedFromDate),
        formatDate(selectedToDate)
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

  // -------------------- Search Filtering --------------------

  // Filter displayed data by search input
  const filteredDataBySearch = paginatedData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // -------------------- UI Rendering --------------------

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>Write-Off Case List</h1>

      {/* Filter Section */}
      <div className="flex justify-end ">
        <div className={`${GlobalStyle.cardContainer} w-[70vw] mb-8 mt-5`}>
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

            {/* Date pickers */}
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

            {/* Filter and Clear buttons */}
            <button
              className={GlobalStyle.buttonPrimary}
              onClick={handleFilterButton}
            >
              Filter
            </button>
            <button className={GlobalStyle.buttonRemove} onClick={handleClear}>
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
            {filteredDataBySearch && filteredDataBySearch.length > 0 ? (
              filteredDataBySearch.map((row, index) => (
                <tr
                  key={row.case_id || index}
                  className={
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
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
                  <td className={GlobalStyle.tableData}>
                    {row.case_phase || ""}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.write_off_on
                      ? new Date(row.write_off_on).toLocaleDateString("en-CA")
                      : ""}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center">
                  No cases available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className={GlobalStyle.navButtonContainer}>
        <button
          className={`${GlobalStyle.navButton} ${
            currentPage === 1 ? "cursor-not-allowed" : ""
          }`}
          onClick={() => handlePrevNext("prev")}
          disabled={currentPage === 1}
        >
          <FaArrowLeft />
        </button>
        <span className={`${GlobalStyle.pageIndicator} mx-4`}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`${GlobalStyle.navButton} ${
            currentPage === totalPages ? "cursor-not-allowed" : ""
          }`}
          onClick={() => handlePrevNext("next")}
          disabled={currentPage === totalPages}
        >
          <FaArrowRight />
        </button>
      </div>

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
