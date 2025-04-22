/* Purpose: This template is used for the 9.1 - Write Off case list .
Created Date: 2025-04-03
Created By: Buthmi mithara (buthmimithara1234@gmail.com)
Version: node 20
ui number : 9.1
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the Write Off case list Screen */

import React, { useState, useEffect, useCallback } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch, FaDownload } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import PendingWriteOff from "../../assets/images/Write_Off/Pending Write-Off.png";
import WriteOff from "../../assets/images/Write_Off/Write-Off.png";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";

const WriteOffCaseList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
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
    return Number(amount).toLocaleString("en-US");
  };

  // Sample data for the table with real dates
  const caseData = [
    {
      caseId: "C001",
      status: "Pending write off",
      accountNo: "12233",
      customerRef: "23456",
      amount: "15000",
      phase: "LOD",
      writeOffOn: "03/20/2024",
    },
    {
      caseId: "C002",
      status: "Write off",
      accountNo: "11223",
      customerRef: "99887",
      amount: "23000",
      phase: "",
      writeOffOn: "02/10/2024",
    },
    {
      caseId: "C003",
      status: "Write off",
      accountNo: "44556",
      customerRef: "33445",
      amount: "10000",
      phase: "",
      writeOffOn: "04/01/2024",
    },
  ];

  const [filteredData, setFilteredData] = useState(caseData);
  const rowsPerPage = 7;

  // Apply filtering whenever search query or dates change
  useEffect(() => {
    filterData();
  }, [searchQuery, fromDate, toDate]);

  // Filtering function
  const filterData = useCallback(() => {
    setIsLoading(true);
    let filtered = [...caseData];

    // Filter by date
    if (fromDate && toDate) {
      filtered = filtered.filter((item) => {
        if (!item.writeOffOn) return false;
        const itemDate = new Date(item.writeOffOn);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          (value ?? "")
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredData(filtered);
    setCurrentPage(0);
    setIsLoading(false);
  }, [caseData, fromDate, toDate, searchQuery, selectedStatus]);

  const validateAndFetchData = () => {
    if (!selectedFromDate && !selectedToDate && !selectedStatus) {
      Swal.fire({
        title: "Action required!",
        text: "Please complete the necessary steps before proceeding",
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
      return;
    }

    setFromDate(selectedFromDate);
    setToDate(selectedToDate);
    setSelectedStatus(selectedStatus);
    filterData();
  };

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

  const clearFilters = () => {
    setFromDate(null);
    setToDate(null);
    setSelectedStatus("");
    setSelectedFromDate(null);
    setSelectedToDate(null);
    filterData();
  };

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

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
              onClick={validateAndFetchData}
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
            onChange={handleSearchChange}
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
                <th className={GlobalStyle.tableHeader}>Customer ref</th>
                <th className={GlobalStyle.tableHeader}>Amount</th>
                <th className={GlobalStyle.tableHeader}>Phase</th>
                <th className={GlobalStyle.tableHeader}>Write Off On</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0
                        ? "bg-white bg-opacity-75"
                        : "bg-gray-50 bg-opacity-50"
                    } border-b`}
                  >
                    <td className={GlobalStyle.tableData}>{row.caseId}</td>
                    <td className={GlobalStyle.tableData}>
                      <div className="flex justify-center">
                        <img
                          src={getStatusIcon(row.status)}
                          alt={row.status}
                          className="w-6 h-6 cursor-pointer"
                          data-tooltip-id={`status-tooltip-${index}`}
                        />
                        <Tooltip
                          id={`status-tooltip-${index}`}
                          place="bottom"
                          effect="solid"
                        >
                          {row.status}
                        </Tooltip>
                      </div>
                    </td>
                    <td className={GlobalStyle.tableData}>{row.accountNo}</td>
                    <td className={GlobalStyle.tableData}>{row.customerRef}</td>
                    <td className={GlobalStyle.tableData}>
                      {formatAmount(row.amount)}
                    </td>
                    <td className={GlobalStyle.tableData}>{row.phase}</td>
                    <td className={GlobalStyle.tableData}>{row.writeOffOn}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No results found. Try clearing the filters to see all
                    records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
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
      
    </div>
  );
};

export default WriteOffCaseList;
