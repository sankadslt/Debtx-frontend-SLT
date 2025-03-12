import React, { useState, useEffect } from 'react';
import GlobalStyle from '../../assets/prototype/GlobalStyle';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Commission_List = () => {
  const [selectValue, setSelectValue] = useState('Account No');
  const [inputFilter, setInputFilter] = useState('');
  const [phase, setPhase] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5; // Number of rows per page

  const handleFromDateChange = (date) => setFromDate(date);
  const handleToDateChange = (date) => setToDate(date);

  // Sample data
  const data = [
    { caseId: "RC001", accountNo: "307200", settlementId: "S1", paiddtm: "2025-02-10", amount: "54000", type: "Payment", phase: "Negotiation", settledbalance: "54000" },
    { caseId: "RC002", accountNo: "307201", settlementId: "S2", paiddtm: "2025-02-12", amount: "75000", type: "Refund", phase: "Finalization", settledbalance: "75000" },
    { caseId: "RC003", accountNo: "307202", settlementId: "S3", paiddtm: "2025-02-15", amount: "120000", type: "Payment", phase: "Review", settledbalance: "120000" },
    { caseId: "RC004", accountNo: "307203", settlementId: "S4", paiddtm: "2025-02-18", amount: "85000", type: "Chargeback", phase: "Negotiation", settledbalance: "85000" },
    { caseId: "RC005", accountNo: "307204", settlementId: "S5", paiddtm: "2025-02-20", amount: "64000", type: "Payment", phase: "Finalization", settledbalance: "64000" }
  ];

  // Show all data by default
  useEffect(() => {
    setFilteredData(data);
  }, []);

  // Function to filter data based on input criteria
  const handleFilterClick = () => {
    let filtered = data.filter(row => {
      let matchesSearch = true;
      let matchesPhase = true;
      let matchesDate = true;

      // Search filter (Case ID or Account No)
      if (inputFilter.trim() !== '') {
        if (selectValue === 'Case Id') {
          matchesSearch = row.caseId.toLowerCase().includes(inputFilter.toLowerCase());
        } else {
          matchesSearch = row.accountNo.toLowerCase().includes(inputFilter.toLowerCase());
        }
      }

      // Phase filter
      if (phase !== '' && row.phase.toLowerCase() !== phase.toLowerCase()) {
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

    return filteredData.filter(row =>
      Object.values(row).some(value =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  // Pagination logic
  const pages = Math.ceil(getSearchedData().length / rowsPerPage); // Total pages
  const startIndex = currentPage * rowsPerPage; // Calculate the starting index of current page
  const currentData = getSearchedData().slice(startIndex, startIndex + rowsPerPage); // Slice the data to show on current page

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
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select
          value={selectValue}
          onChange={(e) => setSelectValue(e.target.value)}
          className={GlobalStyle.selectBox}
        >
          <option value="Account No">Account No</option>
          <option value="Case Id">Case ID</option>
        </select>

        <input
          type="text"
          value={inputFilter}
          onChange={(e) => setInputFilter(e.target.value)}
          className={GlobalStyle.inputText}
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

        <button className={GlobalStyle.buttonPrimary} onClick={handleFilterClick}>
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
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}>
                  <td className={GlobalStyle.tableData}>{row.caseId}</td>
                  <td className={GlobalStyle.tableData}>{row.accountNo}</td>
                  <td className={GlobalStyle.tableData}>{row.settlementId}</td>
                  <td className={GlobalStyle.tableData}>{row.paiddtm}</td>
                  <td className={GlobalStyle.tableData}>{row.amount}</td>
                  <td className={GlobalStyle.tableData}>{row.type}</td>
                  <td className={GlobalStyle.tableData}>{row.phase}</td>
                  <td className={GlobalStyle.tableData}>{row.settledbalance}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-2">
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

export default Commission_List;
