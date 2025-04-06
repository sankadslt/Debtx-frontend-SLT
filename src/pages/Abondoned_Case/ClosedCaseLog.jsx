/* Purpose: This template is used for the 16.1 - Closed case log .
Created Date: 2025-04-06
Created By: Buthmi mithara (buthmimithara1234@gmail.com)
Version: node 20
ui number : 16.1
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the Closed case log Screen */

import React, { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const WriteOffCaseList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for the table with real dates
  const caseData = [
    {
      caseId: "C001",
      status: "Pending write off",
      closedOn: "03/20/2024",
    },
    {
      caseId: "C002",
      status: "Write off",
      closedOn: "02/10/2024",
    },
    {
      caseId: "C003",
      status: "Write off",
      closedOn: "01/05/2024",
    },
  ];

  const [filteredData, setFilteredData] = useState(caseData);
  const rowsPerPage = 7;

  // Apply filtering whenever search query or dates change
  useEffect(() => {
    filterData();
  }, [searchQuery, fromDate, toDate]);

  // Filtering function
  const filterData = () => {
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
  };

  const handleFilter = () => {
    filterData();
  };

  const handleFromDateChange = (date) => {
    if (toDate && date > toDate) {
      setError("The 'From' date cannot be later than the 'To' date.");
    } else {
      setError("");
      setFromDate(date);
    }
  };

  const handleToDateChange = (date) => {
    if (fromDate && date < fromDate) {
      setError("The 'To' date cannot be earlier than the 'From' date.");
    } else {
      setError("");
      setToDate(date);
    }
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
      <h1 className={GlobalStyle.headingLarge}>Closed Case Log</h1>

      {/* Filter Section */}
      <div className="flex gap-4 justify-end">
        <div className={GlobalStyle.datePickerContainer}>
          <DatePicker
            selected={fromDate}
            onChange={handleFromDateChange}
            dateFormat="MM/dd/yyyy"
            placeholderText="MM/dd/yyyy"
            className={GlobalStyle.inputText}
          />
          <DatePicker
            selected={toDate}
            onChange={handleToDateChange}
            dateFormat="MM/dd/yyyy"
            placeholderText="MM/dd/yyyy"
            className={GlobalStyle.inputText}
          />

          <button
            className={GlobalStyle.buttonPrimary} 
            onClick={handleFilter}
          >
            Filter
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

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
                <th className={GlobalStyle.tableHeader}>Closed On</th>
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
                  <td className={GlobalStyle.tableData}>{row.caseId}</td>
                  <td className={GlobalStyle.tableData}>{row.status}</td>
                  <td className={GlobalStyle.tableData}>{row.closedOn}</td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No results found
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
