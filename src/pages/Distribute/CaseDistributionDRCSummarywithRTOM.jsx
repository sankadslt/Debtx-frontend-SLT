/*Purpose: This template is used for the 1.A.14.1 - Case Distribution DRC Summary with RTOM
Created Date: 2025-01-28
Created By: Udana (udanarajanayaka220@gmail.com)
Version: node 20
ui number : 1.A.14.1
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the codes */


import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";


const CaseDistributionDRCSummarywithRTOM = () => {
  // Sample data for the table
  const data = [
    {
      batchSeq: "S1",
      createdDtm: "A1",
      drc: "CMS",
      rtom: "A",
      caseAmount: "100",
      arrearsAmount: "10",
    },
    {
      batchSeq: "S2",
      createdDtm: "A1",
      drc: "CMS",
      rtom: "B",
      caseAmount: "100",
      arrearsAmount: "10",
    },
    {
      batchSeq: "S2",
      createdDtm: "A1",
      drc: "CMS",
      rtom: "A",
      caseAmount: "100",
      arrearsAmount: "10",
    },
    {
      batchSeq: "S4",
      createdDtm: "A1",
      drc: "CMS",
      rtom: "A",
      caseAmount: "100",
      arrearsAmount: "10",
    },
    {
      batchSeq: "S5",
      createdDtm: "A1",
      drc: "CMS",
      rtom: "A",
      caseAmount: "100",
      arrearsAmount: "10",
    },
    {
      batchSeq: "S6",
      createdDtm: "A1",
      drc: "CMS",
      rtom: "A",
      caseAmount: "100",
      arrearsAmount: "10",
    },
    {
      batchSeq: "S7",
      createdDtm: "A1",
      drc: "CMS",
      rtom: "A",
      caseAmount: "100",
      arrearsAmount: "10",
    },
    {
      batchSeq: "S8",
      createdDtm: "A1",
      drc: "CMS",
      rtom: "A",
      caseAmount: "100",
      arrearsAmount: "10",
    },
    {
      batchSeq: "S8",
      createdDtm: "A1",
      drc: "CMS",
      rtom: "A",
      caseAmount: "100",
      arrearsAmount: "10",
    },
  ];

  // State for filters and table
  const [selectedDRC, setSelectedDRC] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [filteredData, setFilteredData] = useState(data);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  // Filtering the data based on search query
  const filteredDataBySearch = filteredData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Apply pagination to the search-filtered data
  const currentData = filteredDataBySearch.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredDataBySearch.length / recordsPerPage);

  // Modified handleDRCChange to only update state without filtering
  const handleDRCChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedDRC(selectedValue);
  };

  // Handle filter action - all filtering happens here
  const handleFilter = () => {
    const filtered = data.filter((item) => {
      const drcMatch = selectedDRC === "" || item.drc === selectedDRC;
      const createdDateValid = !fromDate || new Date(item.createdDate) >= new Date(fromDate);
      const approvedOnValid =
        !toDate ||
        item.approvedOn === "mm/dd/yyyy" ||
        new Date(item.approvedOn) <= new Date(toDate);
      return drcMatch && createdDateValid && approvedOnValid;
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle checkbox selection
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows(new Set(currentData.map((_, index) => index)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleRowSelect = (index) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index);
    } else {
      newSelectedRows.add(index);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleCreateTask = () => {
    alert("Create Task and Let Me Know button clicked!");
  };

  const handleApprove = () => {
    alert("Approve button clicked!");
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Distributed DRC Summary</h1>

      {/* Filter Section */}
      <div className="flex px-3 py-2 items-center justify-end gap-4 mt-20 mb-4">
        {/* DRC Select Dropdown */}
        <select
          className={GlobalStyle.selectBox}
          value={selectedDRC}
          onChange={handleDRCChange}
        >
          <option value="">DRC</option>
          {["CMS", "TCM", "RE", "CO LAN", "ACCIVA", "VISONCOM", "PROMPT"].map(
            (drc) => (
              <option key={drc} value={drc}>
                {drc}
              </option>
            )
          )}
        </select>



        {/* Date Picker */}
        <div className="flex items-center gap-2">
          <div className={GlobalStyle.datePickerContainer}>
            <label className={GlobalStyle.dataPickerDate}>Date </label>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/MM/yyyy"
              className={GlobalStyle.inputText}
            />
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/MM/yyyy"
              className={GlobalStyle.inputText}
            />
          </div>
        </div>

        <select
          className={GlobalStyle.selectBox}
          value={selectedDRC}
          onChange={handleDRCChange}
        >
          <option value="">Status</option>
          {["Pending", "Approved", "Rejected"].map(
            (drc) => (
              <option key={drc} value={drc}>
                {drc}
              </option>
            )
          )}
        </select>

        {/* Filter Button */}
        <button
          onClick={handleFilter}
          className={`${GlobalStyle.buttonPrimary}`}
        >
          Filter
        </button>
      </div>

      {/* Search Section */}
      <div className="flex justify-start mb-4">
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

      {/* Table Section */}
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}></th>
              <th className={GlobalStyle.tableHeader}>Batch seq.</th>
              <th className={GlobalStyle.tableHeader}>Created dtm</th>
              <th className={GlobalStyle.tableHeader}>DRC</th>
              <th className={GlobalStyle.tableHeader}>RTOM</th>
              <th className={GlobalStyle.tableHeader}>Case Count</th>
              <th className={GlobalStyle.tableHeader}>Arrears Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={item.caseId}
                className={
                  index % 2 === 0
                    ? GlobalStyle.tableRowEven
                    : GlobalStyle.tableRowOdd
                }
              >
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(index)}
                    onChange={() => handleRowSelect(index)}
                    className="mx-auto"
                  />
                </td>
                <td className={GlobalStyle.tableData}>{item.batchSeq}</td>
                <td className={GlobalStyle.tableData}>{item.createdDtm}</td>
                <td className={GlobalStyle.tableData}>{item.drc}</td>
                <td className={GlobalStyle.tableData}>{item.rtom}</td>
                <td className={GlobalStyle.tableData}>{item.caseAmount}</td>
                <td className={GlobalStyle.tableData}>{item.arrearsAmount}</td>
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
          className={`${GlobalStyle.navButton} ${currentPage === 1 ? "cursor-not-allowed" : ""
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
          className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""
            }`}
        >
          <FaArrowRight />
        </button>
      </div>


      {/* Button */}
      <div className="flex justify-between">

        {/* Button on the left */}
        <button>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={65}
            height={65}
            fill="none"

          >
            <circle
              cx={32.5}
              cy={32.5}
              r={32.45}
              fill="#B3CCE3"
              stroke="#58120E"
              strokeWidth={0.1}
              transform="rotate(-90 32.5 32.5)"
            />
            <path
              fill="#001120"
              d="m36.46 32.051 10.385-10.384-3.063-3.064-13.449 13.448L43.782 45.5l3.063-3.064L36.46 32.051Z"
            />
            <path
              fill="#001120"
              d="m23.46 32.051 10.385-10.384-3.063-3.064-13.449 13.448L30.782 45.5l3.063-3.064L23.46 32.051Z"
            />
          </svg>

        </button>

        {/* Right-aligned button */}
        <button
          onClick={handleCreateTask}
          className={GlobalStyle.buttonPrimary} // Same style as Approve button
        >

          Create Task and Let Me Know
        </button>




      </div>


    </div>
  );
};

export default CaseDistributionDRCSummarywithRTOM;

