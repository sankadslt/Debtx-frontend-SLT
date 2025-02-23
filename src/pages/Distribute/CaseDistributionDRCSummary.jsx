/*Purpose: This template is used for the 1.A.14 - Case Distribution DRC Summary
Created Date: 2025-01-25
Created By: Udana (udanarajanayaka220@gmail.com)
Version: node 20
ui number : 1.A.14
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the codes */

import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";

const CaseDistributionDRCSummary = () => {
  // Sample data for the table
  const data = [
    {
      batchId: "B1",
      created_dtm: "C002",
      drc: "CMS",
      count: "5",
      total_arrears: "12",
      proceed_on: "100",
    },
    {
      batchId: "B2",
      created_dtm: "C001",
      drc: "RTOM",
      count: "5",
      total_arrears: "12",
      proceed_on: "100",
    },
  ];

  // State for filters and table
  const [selectedDRC, setSelectedDRC] = useState("");
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

  // Modified handleDRCChange to only update state without filtering
  const handleDRCChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedDRC(selectedValue);
  };

  // Handle filter action - all filtering happens here
  const handleFilter = () => {
    const filtered = data.filter((item) => {
      const drcMatch = selectedDRC === "" || item.drc === selectedDRC;

      return drcMatch;
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleCreateTask = () => {
    alert("Create Task and Let Me Know button clicked!");
  };

  const handleCreateTasks = () => {
    alert("Create Task and Let Me Know button clicked!");
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Distributed DRC Summary</h1>
      <h2 className={GlobalStyle.headingMedium}>Batch-B1</h2>

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
              <th className={GlobalStyle.tableHeader}>Created dtm</th>
              <th className={GlobalStyle.tableHeader}>DRC</th>
              <th className={GlobalStyle.tableHeader}>Count</th>
              <th className={GlobalStyle.tableHeader}>Total Arreas</th>
              <th className={GlobalStyle.tableHeader}>Proceed On</th>
              <th className={GlobalStyle.tableHeader}></th>
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
                <td className={GlobalStyle.tableData}>{item.created_dtm}</td>
                <td className={GlobalStyle.tableData}>{item.drc}</td>
                <td className={GlobalStyle.tableData}>{item.count}</td>
                <td className={GlobalStyle.tableData}>{item.total_arrears}</td>
                <td className={GlobalStyle.tableData}>{item.proceed_on}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={handleCreateTasks}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={26}
                      height={29}
                      fill="none"
                    >
                      <path
                        fill="#000"
                        fillRule="evenodd"
                        d="M13 .32c7.18 0 13 5.821 13 13 0 7.18-5.82 13-13 13s-13-5.82-13-13c0-7.179 5.82-13 13-13Zm5.85 11.05a1.95 1.95 0 1 0 0 3.901 1.95 1.95 0 0 0 0-3.9Zm-5.85 0a1.95 1.95 0 1 0 0 3.901 1.95 1.95 0 0 0 0-3.9Zm-5.85 0a1.95 1.95 0 1 0 0 3.901 1.95 1.95 0 0 0 0-3.9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br></br>

      {/* Button */}
      <div className="flex justify-between">
        <br></br>
        {/* Right-aligned button */}
        <button
          onClick={handleCreateTask}
          className={GlobalStyle.buttonPrimary} // Same style as Approve button
        >
          Create Task and Let Me Know
        </button>
      </div>
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
    </div>
  );
};

export default CaseDistributionDRCSummary;
