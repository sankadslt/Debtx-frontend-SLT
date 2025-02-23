/* 
Purpose: This template is used for the 1.15.1 - DRC Assign Manager Approval 
Created Date: 2025-02-17
Created By: Sanjaya (sanjayaperera80@gmail.com)
Last Modified Date: 2025-02-18
Modified By:  Malindu (mhssc20@gmail.com)
Version: node 20
UI Number: 1.15.1
Dependencies: Tailwind CSS
Related Files: (routes)
Notes: The following page contains the code 
*/

import { useState , useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; 
import "react-datepicker/dist/react-datepicker.css";
import {List_All_Batch_Details} from "/src/services/case/CaseServices.js";

export default function DRCAssignManagerApproval2() {




  // State for search query and filtered data
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await List_All_Batch_Details();
        setFilteredData(response);
        console.log("All batch details:", response);
      } catch (error) {
        console.error("Error fetching all batch details:", error);
      }
    }
    fetchData();
  }, []);



  // Handle pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Filtering the data based on search query
  const filteredDataBySearch = searchQuery
    ? filteredData.filter((row) =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : currentData;

  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all rows in the filtered data
      setSelectedRows(new Set(filteredData.map((_, index) => index)));
    } else {
      // Deselect all rows
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

    // Automatically deselect the "Select All" checkbox if any row is deselected
    if (newSelectedRows.size !== filteredData.length) {
      setSelectAll(false);
    } else {
      setSelectAll(true);
    }
  };

  function onSubmit() {
    alert("Create task and let me know");
  }
  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}> DRC Assign Approval</h1>
      <div className="flex justify-between mt-16 mb-6">
        <div className="flex justify-start mb-8">
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
      </div>

      {/* Search Section */}

      {/* Table Section */}
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>
               
              </th>
              <th className={GlobalStyle.tableHeader}>Batch ID</th>
              <th className={GlobalStyle.tableHeader}>Created Date</th>
              <th className={GlobalStyle.tableHeader}>DRC Commission rule</th>
              <th className={GlobalStyle.tableHeader}>Case count</th>
              <th className={GlobalStyle.tableHeader}>Total Arrears</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.map((item, index) => (
              <tr
                key={`${item.drc}-${index}`}
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
                <td className={GlobalStyle.tableData}>{item.case_distribution_details?.case_distribution_batch_id || "N/A"}</td>
                <td className={GlobalStyle.tableData}>{new Date (item.created_on).toLocaleDateString()}</td>
                <td className={GlobalStyle.tableData}> {item.case_distribution_details?.drc_commision_rule || "N/A"}</td>
                <td className={GlobalStyle.tableData}>{item.case_distribution_details?.rulebase_count || "N/A"}</td>
                <td className={GlobalStyle.tableData}>{item.totalArrears}</td>
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
          className={`${GlobalStyle.navButton} ${
            currentPage === 1 ? "cursor-not-allowed" : ""
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
          className={`${GlobalStyle.navButton} ${
            currentPage === totalPages ? "cursor-not-allowed" : ""
          }`}
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Select All Data Checkbox and Approve Button */}
      <div className="flex justify-end gap-4 mt-4">
        {/* Select All Data Checkbox */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded-lg"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          Select All Data
        </label>

        {/* Approve Button */}
        <button
          onClick={onSubmit}
          className={GlobalStyle.buttonPrimary}
          //   disabled={selectedRows.size === 0} // Disable if no rows are selected
        >
          Approve
        </button>
      </div>
      <div>
        <button onClick={onSubmit} className={GlobalStyle.buttonPrimary}>
          Create task and let me know
        </button>
      </div>
    </div>
  );
}