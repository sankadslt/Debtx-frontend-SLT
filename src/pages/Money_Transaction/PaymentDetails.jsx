/* Purpose: This template is used for the 7.7 - Payment Details .
Created Date: 2025-03-13
Created By: Buthmi mithara (buthmimithara1234@gmail.com)
Version: node 20
ui number : 7.7
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the Payment Details Screen */


import React, { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import infor from "../../assets/images/moneyTransaction/infor.png";
import Swal from 'sweetalert2';

const PaymentDetails = () => {
  const [selectValue, setSelectValue] = useState("Account No");
  const [inputFilter, setInputFilter] = useState("");
  const [phase, setPhase] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 7; // Number of rows per page

  // Sample data
  const data = [
    {
      caseId: "RC001",
      accountNo: "307200",
      settlementId: "S1",
      paiddtm: "2025-02-10",
      amount: "54000",
      type: "Payment",
      phase: "Negotiation",
      settledbalance: "54000",
    },
    {
      caseId: "RC002",
      accountNo: "307201",
      settlementId: "S2",
      paiddtm: "2025-02-12",
      amount: "75000",
      type: "Refund",
      phase: "Finalization",
      settledbalance: "75000",
    },
    {
      caseId: "RC003",
      accountNo: "307202",
      settlementId: "S3",
      paiddtm: "2025-02-15",
      amount: "120000",
      type: "Payment",
      phase: "Review",
      settledbalance: "120000",
    },
    {
      caseId: "RC004",
      accountNo: "307203",
      settlementId: "S4",
      paiddtm: "2025-02-18",
      amount: "85000",
      type: "Chargeback",
      phase: "Negotiation",
      settledbalance: "85000",
    },
  ];

  // Show all data by default
  useEffect(() => {
    setFilteredData(data);
  }, []);

  // Date handlers with immediate validation
  const handleFromDateChange = (date) => {
    setFromDate(date);
    
    // Check if dates are invalid immediately after selection
    if (date && toDate && date.getTime() > toDate.getTime()) {
      Swal.fire({
        title: "Warning",
        text: "From date should be less than or equal to To date",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    }
    
    if (toDate) checkDateDifference(date, toDate);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    
    // Check if dates are invalid immediately after selection
    if (fromDate && date && fromDate.getTime() > date.getTime()) {
      Swal.fire({
        title: "Warning",
        text: "To date should be greater than or equal to From date",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
    }
    
    if (fromDate) checkDateDifference(fromDate, date);
  };

  const checkDateDifference = (startDate, endDate) => {
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
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#28a745",
        cancelButtonText: "No",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          // If user confirms, keep the dates and continue
          setToDate(endDate);
        } else {
          // If user cancels, reset the to date
          setToDate(null);
        }
      });
    }
  };

  // Function to filter data based on input criteria
  const handleFilterClick = () => {
    // Check if only one date field is filled
    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      Swal.fire({
        title: "Warning",
        text: "Both From and To dates are required",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      return;
    }

    // Check if any filter is selected
    const hasActiveFilters = 
      inputFilter.trim() !== "" || 
      phase !== "" || 
      (fromDate && toDate);

    if (!hasActiveFilters) {
      Swal.fire({
        title: "Warning",
        text: "No filter data is selected. Please, select data.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      return;
    }

    // Check if from date is after to date
    if (fromDate && toDate && fromDate.getTime() > toDate.getTime()) {
      Swal.fire({
        title: "Warning",
        text: "To date should be greater than or equal to From date",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      return;
    }

    // Proceed with filtering if validations pass
    let filtered = data.filter((row) => {
      let matchesSearch = true;
      let matchesPhase = true;
      let matchesDate = true;

      // Search filter (Case ID or Account No)
      if (inputFilter.trim() !== "") {
        if (selectValue === "Case Id") {
          matchesSearch = row.caseId
            .toLowerCase()
            .includes(inputFilter.toLowerCase());
        } else {
          matchesSearch = row.accountNo
            .toLowerCase()
            .includes(inputFilter.toLowerCase());
        }
      }

      // Phase filter
      if (phase !== "" && row.phase.toLowerCase() !== phase.toLowerCase()) {
        matchesPhase = false;
      }

      // Date range filter
      const rowDate = new Date(row.paiddtm);
      if (fromDate && rowDate < fromDate) matchesDate = false;
      if (toDate && rowDate > toDate) matchesDate = false;

      return matchesSearch && matchesPhase && matchesDate;
    });

    setFilteredData(filtered);
    setCurrentPage(0); // Reset to page 1 when filters are applied
  };

  // Dynamic search function across all fields
  const getSearchedData = () => {
    if (!searchQuery.trim()) return filteredData; // Return filtered data if no search

    return filteredData.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  // Pagination logic
  const pages = Math.ceil(getSearchedData().length / rowsPerPage); // Total pages
  const startIndex = currentPage * rowsPerPage; // Calculate the starting index of current page
  const currentData = getSearchedData().slice(
    startIndex,
    startIndex + rowsPerPage
  ); // Slice the data to show on current page

  const handleNextPage = () => {
    if (currentPage < pages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <h1 className={GlobalStyle.headingLarge}>Payment Details</h1>

      {/* Filters - Single Row */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-end my-6 gap-1 mb-8">
        <select
          value={selectValue}
          onChange={(e) => setSelectValue(e.target.value)}
          className={`${GlobalStyle.selectBox} w-32 md:w-40`}
        >
          <option value="Account No">Account No</option>
          <option value="Case Id">Case ID</option>
        </select>

        <input
          type="text"
          value={inputFilter}
          onChange={(e) => setInputFilter(e.target.value)}
          className={`${GlobalStyle.inputText} w-32 md:w-40`}
          placeholder="Enter"
        />

        <select
          value={phase}
          onChange={(e) => setPhase(e.target.value)}
          className={GlobalStyle.selectBox}
        >
          <option value="">Select Phase</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Finalization">Finalization</option>
          <option value="Review">Review</option>
        </select>

        <label className={GlobalStyle.dataPickerDate}>Date</label>
        <DatePicker
          selected={fromDate}
          onChange={handleFromDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/MM/yyyy"
          className={`${GlobalStyle.inputText} w-32 md:w-40`}
        />

        <DatePicker
          selected={toDate}
          onChange={handleToDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/MM/yyyy"
          className={`${GlobalStyle.inputText} w-32 md:w-40`}
        />

        <button
          className={GlobalStyle.buttonPrimary}
          onClick={handleFilterClick}
        >
          Filter
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            className={GlobalStyle.inputSearch}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>
      </div>

      {/* Table */}
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Account No</th>
              <th className={GlobalStyle.tableHeader}>Settlement ID</th>
              <th className={GlobalStyle.tableHeader}>Paid DTM</th>
              <th className={GlobalStyle.tableHeader}>Amount</th>
              <th className={GlobalStyle.tableHeader}>Type</th>
              <th className={GlobalStyle.tableHeader}>Phase</th>
              <th className={GlobalStyle.tableHeader}>Settled Balance</th>
              <th className={GlobalStyle.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
                >
                  <td className={GlobalStyle.tableData}>{row.caseId}</td>
                  <td className={GlobalStyle.tableData}>{row.accountNo}</td>
                  <td className={GlobalStyle.tableData}>{row.settlementId}</td>
                  <td className={GlobalStyle.tableData}>{row.paiddtm}</td>
                  <td className={GlobalStyle.tableData}>
                    {parseInt(row.amount).toLocaleString("en-US")}
                  </td>
                  <td className={GlobalStyle.tableData}>{row.type}</td>
                  <td className={GlobalStyle.tableData}>{row.phase}</td>
                  <td className={GlobalStyle.tableData}>
                    {parseInt(row.settledbalance).toLocaleString("en-US")}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <img
                      src={infor}
                      alt="Info"
                      className="w-6 h-6 cursor-pointer"
                      onClick={() => {}} // Add your navigate function here
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-2">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
            disabled={currentPage >= pages - 1}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;