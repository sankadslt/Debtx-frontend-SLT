/* Purpose: This template is used for the 7.7 - Payment Details .
Created Date: 2025-03-13
Created By: Buthmi mithara (buthmimithara1234@gmail.com)
Modified By: K.K C Sakumini (sakuminic@gmail.com)
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
import { List_All_Payment_Cases } from "../../services/Transaction/Money_TransactionService";

const PaymentDetails = () => {
  const [selectValue, setSelectValue] = useState("Account No");
  const [inputFilter, setInputFilter] = useState("");
  const [phase, setPhase] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const rowsPerPage = 10; // Number of rows per page

  // Fetch initial data on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Function to fetch initial data
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const response = await List_All_Payment_Cases({
        page: 1,
        limit: rowsPerPage,
        recent: true
      });
      
      // Transform backend data to match frontend structure
      const transformedData = transformPaymentData(response.data);
      setFilteredData(transformedData);
    } catch (error) {
      console.error("Failed to fetch payment data:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch payment data",
        icon: "error"
      });
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to transform backend data to frontend format
  const transformPaymentData = (paymentData) => {
    return paymentData.map(payment => ({
      caseId: payment.Case_ID?.toString() || "-",
      accountNo: payment.Account_No?.toString() || "-",
      settlementId: payment.Settlement_ID?.toString() || "-",
      paiddtm: payment.Money_Transaction_Date ? new Date(payment.Money_Transaction_Date).toISOString().split('T')[0] : "-",
      amount: payment.Money_Transaction_Amount?.toString() || "0",
      type: payment.Transaction_Type|| "-",
      phase: payment.Settlement_Phase || "-",
      settledbalance: payment. Cummulative_Settled_Balance?.toString() || "0"
    }));
  };

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
  const handleFilterClick = async () => {
    // Check if only one date field is filled
    if ((!fromDate && !toDate) || (!fromDate && !toDate)) {
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

    try {
      setIsLoading(true);
      
      // Prepare query parameters
      const payload = {
        page: 1,
        limit: rowsPerPage,
      };
      
      // Add filters based on selection
      if (inputFilter.trim() !== "") {
        if (selectValue === "Case Id") {
          payload.case_id = inputFilter.trim();
        } else if (selectValue === "Account No") {
          payload.account_num = inputFilter.trim();
        }
      }
      
      // Add phase filter
      if (phase !== "") {
        payload.settlement_phase = phase;
      }
      
      // Add date range
      if (fromDate && toDate) {
        payload.start_date = fromDate.toISOString().split('T')[0];
        payload.end_date = toDate.toISOString().split('T')[0];
      }
      
      const response = await List_All_Payment_Cases(payload);
      
      // Transform and update the UI
      const transformedData = transformPaymentData(response.data);
      setFilteredData(transformedData);
      setCurrentPage(0); // Reset to page 1 when filters are applied
      
      // Show message if no results
      if (transformedData.length === 0) {
        Swal.fire({
          title: "Information",
          text: "No records found for the selected criteria",
          icon: "info"
        });
      }
      
    } catch (error) {
      console.error("Failed to fetch filtered data:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data",
        icon: "error"
      });
    } finally {
      setIsLoading(false);
    }
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
          <option value="Register">Register</option>
          <option value="Distribution">Distribution</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Mediation Board">Mediation Board</option>
          <option value="Letter Of Demand">Letter Of Demand</option>    
          <option value="Litigation">Litigation</option>
          <option value="Dispute">Dispute</option>
          <option value="WRIT">WRIT</option>
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
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Filter'}
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
            {isLoading ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : currentData.length > 0 ? (
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
                    {parseInt(row.amount) ? parseInt(row.amount).toLocaleString("en-US") : "-"}
                  </td>
                  <td className={GlobalStyle.tableData}>{row.type}</td>
                  <td className={GlobalStyle.tableData}>{row.phase}</td>
                  <td className={GlobalStyle.tableData}>
                    {parseInt(row.settledbalance) ? parseInt(row.settledbalance).toLocaleString("en-US") : "-"}
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