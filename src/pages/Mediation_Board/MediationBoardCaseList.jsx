/* Purpose: This template is used for the 2.17 - Mediation Board case list .
Created Date: 2025-02-27
Created By: sakumini (sakuminic@gmail.com)
Modified By: Buthmi mithara (buthmimithara1234@gmail.com)
Version: node 20
ui number : 2.17
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the Mediation Board case list Screen */

import React, { useState } from "react";
import {FaArrowLeft,FaArrowRight,FaSearch,FaInfoCircle,} from "react-icons/fa";
import DatePicker from "react-datepicker";
import GlobalStyle from "../../assets/prototype/GlobalStyle";

// Import status icons with correct file extensions
import Forward_to_Mediation_Board from "../../assets/images/mediationBoard/Forward_to_Mediation_Board.png";
import MB_fail_with_pending_non_settlement from "../../assets/images/mediationBoard/MB_fail_with_pending_non_settlement.png";
import MB_Negotiation from "../../assets/images/mediationBoard/MB_Negotiation.png";
import MB_Settle_Active from "../../assets/images/mediationBoard/MB_Settle_Active.png";
import MB_Settle_open_pending from "../../assets/images/mediationBoard/MB_Settle_open_pending.png";
import MB_Settle_pending from "../../assets/images/mediationBoard/MB_Settle_pending.png";

// Status icon mapping
const STATUS_ICONS = {
  Forward_to_Mediation_Board: {
    icon: Forward_to_Mediation_Board,
    tooltip: "Forward to Mediation Board",
  },
  MB_fail_with_pending_non_settlement: {
    icon: MB_fail_with_pending_non_settlement,
    tooltip: "MB fail with pending non settlement",
  },
  MB_Negotiation: {
    icon: MB_Negotiation,
    tooltip: "MB Negotiation",
  },
  MB_Settle_Active: {
    icon: MB_Settle_Active,
    tooltip: "MB Settle Active",
  },
  MB_Settle_open_pending: {
    icon: MB_Settle_open_pending,
    tooltip: "MB Settle open pending",
  },
  MB_Settle_pending: {
    icon: MB_Settle_pending,
    tooltip: "MB Settle pending",
  },
};

// Status Icon component with tooltip
const StatusIcon = ({ status }) => {
  const statusInfo = STATUS_ICONS[status];

  if (!statusInfo) return <span>{status}</span>;

  return (
    <div className="relative group">
      <img src={statusInfo.icon} alt={status} className="w-6 h-6 cursor-help" />
      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-sm rounded px-2 py-1 left-1/2 transform -translate-x-1/2 bottom-full mb-1 whitespace-nowrap z-10">
        {statusInfo.tooltip}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </div>
  );
};

export default function MediationBoardCaseList() {
  // State management
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDRC, setSelectedDRC] = useState("");
  const [selectedRTOM, setSelectedRTOM] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Fixed: Starting from 0 to match slice logic
  const [loading, setLoading] = useState(false); // Added: Missing loading state

  const rowsPerPage = 7;

  // Mock data for the table
  const caseData = [
    {
      caseId: "C001",
      status: "Forward_to_Mediation_Board",
      date: "mm/dd/yyyy",
      drc: "ABCD",
      roName: "ABCD",
      rtom: "RTOM 01",
      callingRound: 1,
      nextCallingDate: "mm/dd/yyyy",
    },
    {
      caseId: "C002", // Fixed: Made unique
      status: "MB_fail_with_pending_non_settlement",
      date: "mm/dd/yyyy",
      drc: "ABCD",
      roName: "ABCD",
      rtom: "RTOM 01",
      callingRound: 3,
      nextCallingDate: "-",
    },
  ];

  // Date handlers
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

  // Handle filter updates
  const handleFilter = () => {
    // Implementation for filtering would go here
    console.log("Filtering with:", {
      selectedStatus,
      selectedDRC,
      selectedRTOM,
      fromDate,
      toDate,
    }); // Fixed: dateRange not defined
  };

  // Data filtering and pagination
  const filteredData = caseData.filter(
    (
      row // Fixed: cases -> caseData
    ) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const pages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  // Pagination handlers
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(pages - 1, prev + 1));
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>Mediation Board Case List</h1>

      {/* Filter section */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-end my-6 gap-1 mb-8">
        {/* Status dropdown */}
        <div className="w-40">
          <select
            className={`${GlobalStyle.selectBox} w-32 md:w-40`}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Status</option>
            <option value="Forward_to_Mediation_Board">
              Forward_to_Mediation_Board
            </option>
            <option value="MB_fail_with_pending_non_settlement">
              MB_fail_with_pending_non_settlement
            </option>
            <option value="MB_Negotiation">MB_Negotiation</option>
            <option value="MB_Settle_Active">MB_Settle_Active</option>
            <option value="MB_Settle_open_pending">
              MB_Settle_open_pending
            </option>
            <option value="MB_Settle_pending">MB_Settle_pending</option>
            {/* Add other status options */}
          </select>
        </div>

        {/* DRC dropdown */}
        <div className="w-40">
          <select
            className={`${GlobalStyle.selectBox} w-32 md:w-40`}
            value={selectedDRC}
            onChange={(e) => setSelectedDRC(e.target.value)}
          >
            <option value="">DRC</option>
            <option value="abcd">ABCD</option>
            {/* Add other DRC options */}
          </select>
        </div>

        {/* RTOM dropdown */}
        <div className="w-40">
          <select
            className={`${GlobalStyle.selectBox} w-32 md:w-40`}
            value={selectedRTOM}
            onChange={(e) => setSelectedRTOM(e.target.value)}
          >
            <option value="">RTOM</option>
            <option value="rtom-01">RTOM 01</option>
            {/* Add other RTOM options */}
          </select>
        </div>

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

        {/* Filter button */}
        <button className={GlobalStyle.buttonPrimary} onClick={handleFilter}>
          Filter
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Search bar */}
      <div className="mb-4 flex justify-start">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={GlobalStyle.inputSearch}
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
              <th className={GlobalStyle.tableHeader}>Status</th>
              <th className={GlobalStyle.tableHeader}>Date</th>
              <th className={GlobalStyle.tableHeader}>DRC</th>
              <th className={GlobalStyle.tableHeader}>RO Name</th>
              <th className={GlobalStyle.tableHeader}>RTOM</th>
              <th className={GlobalStyle.tableHeader}>Calling Round</th>
              <th className={GlobalStyle.tableHeader}>Next Calling Date</th>
              <th className={GlobalStyle.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={index} // Fixed: Using row.case_id -> index since caseId might not be unique
                className={`${
                  index % 2 === 0
                    ? "bg-white bg-opacity-75"
                    : "bg-gray-50 bg-opacity-50"
                } border-b`}
              >
                <td className={GlobalStyle.tableData}>{row.caseId}</td>
                <td
                  className={`${GlobalStyle.tableData} flex justify-center items-center`}
                >
                  <StatusIcon status={row.status} />
                </td>
                <td className={GlobalStyle.tableData}>{row.date}</td>
                <td className={GlobalStyle.tableData}>{row.drc}</td>
                <td className={GlobalStyle.tableData}>{row.roName}</td>
                <td className={GlobalStyle.tableData}>{row.rtom}</td>
                <td className={GlobalStyle.tableData}>{row.callingRound}</td>
                <td className={GlobalStyle.tableData}>{row.nextCallingDate}</td>
                <td className={GlobalStyle.tableData}>
                  <FaInfoCircle className="mx-auto text-black text-xl cursor-pointer" />
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  {" "}
                  {/* Fixed: colSpan="8" -> "9" to match columns */}
                  {loading ? "Loading..." : "No results found"}
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
            disabled={currentPage === pages - 1}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}
