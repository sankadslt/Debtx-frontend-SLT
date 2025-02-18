/* 
Purpose: This template is used for the 1.15.1 - DRC Assign Manager Approval 
Created Date: 2025-02-17
Created By: Sanjaya (sanjayaperera80@gmail.com)
Last Modified Date: 2025-02-17
Version: node 20
UI Number: 1.15.1
Dependencies: Tailwind CSS
Related Files: (routes)
Notes: The following page contains the code 
*/

import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { ListAllBatchDetails } from "/src/services/distribution/distributionService.js";
import { Approve_Batch_or_Batches } from "/src/services/distribution/distributionService.js";
import { Create_Task_For_Batch_Approval } from "/src/services/distribution/distributionService.js";
import "react-datepicker/dist/react-datepicker.css";
import { getUserData } from "/src/services/auth/authService.js";

export default function DRCAssignManagerApproval2() {
  // State variables to manage data, search, pagination, and selections
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const recordsPerPage = 5;

  // Fetch batch details when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        const batchData = await ListAllBatchDetails();
        setData(batchData);
        setFilteredData(batchData);
      } catch (error) {
        console.error("Error fetching batch details:", error);
      }
    }
    fetchData();
  }, []);

  // Filter data when searchQuery changes
  useEffect(() => {
    setFilteredData(
      searchQuery
        ? data.filter((row) =>
            Object.values(row)
              .join(" ")
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
        : data
    );
  }, [searchQuery, data]);

  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  // Handle previous and next page navigation
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle selecting all rows
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRows(new Set(filteredData.map((_, index) => index)));
    } else {
      setSelectedRows(new Set());
    }
  };

  // Handle individual row selection
  const handleRowSelect = (index) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index);
    } else {
      newSelectedRows.add(index);
    }
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.size === filteredData.length);
  };

  // Function triggered on approval
  async function onSubmit() {
    try {
      const userData = await getUserData();
      const selectedBatchIDs = Array.from(selectedRows).map(
        (index) => currentData[index]?.batchID
      );
  
      console.log("Selected Batch IDs:", selectedBatchIDs);
      console.log("Approved By:", userData.name);
  
      if (selectedBatchIDs.length === 0) {
        alert(`User: ${userData.name} (${userData.email})\nNo batch selected!`);
        return;
      }
  
      // Ensure the request payload matches the expected API structure
      const response = await Approve_Batch_or_Batches(selectedBatchIDs, userData.name);
  
      console.log("API Response:", response);
  
      if (response.status === 200) {
        alert("Batches approved successfully!");
      } else {
        alert("Approval failed. Please try again.");
      }
    } catch (error) {
      console.error("Error approving batches:", error);
      alert("Error while approving. Check console for details.");
    }
  }
  

  async function onCreateTask() {
    const selectedBatchIDs = Array.from(selectedRows).map(
      (index) => currentData[index]?.batchID
    );

    if (selectedBatchIDs.length === 0) {
      alert("No batch selected!");
      return;
    }

    try {
      const response = await Create_Task_For_Batch_Approval(
        selectedBatchIDs,
        "manager_1"
      );
      alert(
        "Task created successfully!\nResponse: " + JSON.stringify(response.data)
      );
    } catch (error) {
      alert("Failed to create task.\nError: " + JSON.stringify(error));
    }
  }

  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Page Header */}
      <h1 className={GlobalStyle.headingLarge}>DRC Assign Approval</h1>

      {/* Search Bar */}
      <div className="flex justify-between mt-16 mb-6">
        <div className="flex justify-start mb-8">
          <div className={GlobalStyle.searchBarContainer}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={GlobalStyle.inputSearch}
            />
            <FaSearch className={GlobalStyle.searchBarIcon} />
          </div>
        </div>
      </div>

      {/* Table Display */}
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="mx-auto"
                />
              </th>
              <th className={GlobalStyle.tableHeader}>Batch ID</th>
              <th className={GlobalStyle.tableHeader}>Created Date</th>
              <th className={GlobalStyle.tableHeader}>DRC Commission Rule</th>
              <th className={GlobalStyle.tableHeader}>Case Count</th>
              <th className={GlobalStyle.tableHeader}>Total Arrears</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={index}
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
                <td className={GlobalStyle.tableData}>{item.batchID}</td>
                <td className={GlobalStyle.tableData}>{item.createdDate}</td>
                <td className={GlobalStyle.tableData}>{item.drc}</td>
                <td className={GlobalStyle.tableData}>{item.caseCount}</td>
                <td className={GlobalStyle.tableData}>{item.totalArrears}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className={GlobalStyle.navButtonContainer}>
        <button
          onClick={() => handlePrevNext("prev")}
          disabled={currentPage === 1}
          className={GlobalStyle.navButton}
        >
          <FaArrowLeft />
        </button>
        <span className={GlobalStyle.pageIndicator}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePrevNext("next")}
          disabled={currentPage === totalPages}
          className={GlobalStyle.navButton}
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Approve & Select All Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded-lg"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          Select All Data
        </label>
        <button onClick={onSubmit} className={GlobalStyle.buttonPrimary}>
          Approve
        </button>
      </div>

      {/* Extra Button for Task Creation */}
      <div>
        <button onClick={onCreateTask} className={GlobalStyle.buttonPrimary}>
          Create task and let me know
        </button>
      </div>
    </div>
  );
}
