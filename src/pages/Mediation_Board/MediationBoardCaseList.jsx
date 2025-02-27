/* Purpose: This template is used for the 2.17 - Mediation Board case list .
Created Date: 2025-02-27
Created By: sakumini (sakuminic@gmail.com)
Modified By: 
Version: node 20
ui number : 2.17
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the Mediation Board case list Screen */

import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch, FaInfoCircle } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle";

export default function MediationBoardCaseList() {
  // State management
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDRC, setSelectedDRC] = useState("");
  const [selectedRTOM, setSelectedRTOM] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);

  // Mock data for the table
  const caseData = [
    {
      caseId: "C001",
      status: "MB Negotiation",
      date: "mm/dd/yyyy",
      drc: "ABCD",
      roName: "ABCD",
      rtom: "RTOM 01",
      callingRound: 1,
      nextCallingDate: "mm/dd/yyyy"
    },
    {
      caseId: "C001",
      status: "FMB Failed",
      date: "mm/dd/yyyy",
      drc: "ABCD",
      roName: "ABCD",
      rtom: "RTOM 01",
      callingRound: 3,
      nextCallingDate: "-"
    }
  ];

  // Handle filter updates
  const handleFilter = () => {
    // Implementation for filtering would go here
    console.log("Filtering with:", { selectedStatus, selectedDRC, selectedRTOM, dateRange });
  };

  // Handle pagination
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>Mediation Board Case List</h1>
      
      {/* Filter section */}
      <div className="flex flex-wrap justify-end gap-4 my-8">
        {/* Status dropdown */}
        <div className="w-40">
          <select 
            className={GlobalStyle.selectBox}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Status</option>
            <option value="mb-negotiation">MB Negotiation</option>
            <option value="fmb-failed">FMB Failed</option>
            {/* Add other status options */}
          </select>
        </div>
        
        {/* DRC dropdown */}
        <div className="w-40">
          <select 
            className={GlobalStyle.selectBox}
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
            className={GlobalStyle.selectBox}
            value={selectedRTOM}
            onChange={(e) => setSelectedRTOM(e.target.value)}
          >
            <option value="">RTOM</option>
            <option value="rtom-01">RTOM 01</option>
            {/* Add other RTOM options */}
          </select>
        </div>
        
        {/* Date range */}
        <div className="flex items-center gap-2">
          <span className={GlobalStyle.dataPickerDate}>Date - From :</span>
          <input 
            type="text" 
            placeholder="mm/dd/yyyy" 
            className={GlobalStyle.inputText}
            value={dateRange.from}
            onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
          />
          <span className={GlobalStyle.dataPickerDate}>To :</span>
          <input 
            type="text" 
            placeholder="mm/dd/yyyy" 
            className={GlobalStyle.inputText}
            value={dateRange.to}
            onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
          />
        </div>
        
        {/* Filter button */}
        <button 
          className={GlobalStyle.buttonPrimary}
          onClick={handleFilter}
        >
          Filter
        </button>
      </div>
      
      {/* Search bar */}
      <div className="flex mb-4">
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
          <thead>
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
            {caseData.map((row, index) => (
              <tr 
                key={index}
                className={index % 2 === 0 ? "bg-white bg-opacity-75 border-b" : "bg-gray-50 bg-opacity-50 border-b"}
              >
                <td className={GlobalStyle.tableData}>
                  <a href="#" className="text-blue-600 hover:underline">{row.caseId}</a>
                </td>
                <td className={GlobalStyle.tableData}>{row.status}</td>
                <td className={GlobalStyle.tableData}>{row.date}</td>
                <td className={GlobalStyle.tableData}>{row.drc}</td>
                <td className={GlobalStyle.tableData}>{row.roName}</td>
                <td className={GlobalStyle.tableData}>{row.rtom}</td>
                <td className={GlobalStyle.tableData}>{row.callingRound}</td>
                <td className={GlobalStyle.tableData}>{row.nextCallingDate}</td>
                <td className={GlobalStyle.tableData}>
                  <FaInfoCircle className="mx-auto text-blue-700 text-xl cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
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
    </div>
  );
}