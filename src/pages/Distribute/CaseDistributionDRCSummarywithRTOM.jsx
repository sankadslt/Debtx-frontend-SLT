/*Purpose: This template is used for the 1.A.14.1 - Case Distribution DRC Summary with RTOM
Created Date: 2025-01-28
Created By: Udana (udanarajanayaka220@gmail.com)
Version: node 20
ui number : 1.A.14.1
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the codes */

import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";

const CaseDistributionDRCSummarywithRTOM = () => {
  // Sample data for the table
  const data = [
    {
      rtom: "A",
      caseAmount: "100",
      arrearsAmount: "10",
    },
    {
      rtom: "B",
      caseAmount: "10",
      arrearsAmount: "10",
    },
  ];

  // State for filters and table

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

  const handleCreateTask = () => {
    alert("Create Task and Let Me Know button clicked!");
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Distributed DRC Summary</h1>
      <div className=" py-5 mt-2 ml-10 w-fit ">
        <h2 className={GlobalStyle.headingMedium}>Batch-B1</h2>
        <h2 className={GlobalStyle.headingMedium}>TCM(DRC Name)</h2>
      </div>

      {/* Search Section */}
      <div className="flex py-2 items-center justify-start gap-2 mt-2 mb-4">
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
                <td className={GlobalStyle.tableData}>{item.rtom}</td>
                <td className={GlobalStyle.tableData}>{item.caseAmount}</td>
                <td className={GlobalStyle.tableData}>{item.arrearsAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br />

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

export default CaseDistributionDRCSummarywithRTOM;
