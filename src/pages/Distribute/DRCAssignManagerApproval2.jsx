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
import {List_All_Batch_Details , Approve_Batch_or_Batches , Create_task_for_batch_approval} from "/src/services/case/CaseServices.js";
import {getLoggedUserId} from "/src/services/auth/authService.js";
import Swal from "sweetalert2";


export default function DRCAssignManagerApproval2() {

  // State for search query and filtered data
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 1;
  const fetchData = async () => {
    try {
      const response = await List_All_Batch_Details();
      setFilteredData(response);
      console.log("All batch details:", response);
    } catch (error) {
      console.error("Error fetching all batch details:", error);
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);
  
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const filteredDataBySearch = searchQuery
  
  ? filteredData.filter((item) => {
      const batchId = item.case_distribution_details?.case_distribution_batch_id || "N/A";
      const createdDate = new Date(item.created_on).toLocaleDateString();
      const commissionRule = item.case_distribution_details?.drc_commision_rule || "N/A";
      const ruleBaseCount = item.case_distribution_details?.rulebase_count || "N/A";

      const rowString = `${batchId} ${createdDate} ${commissionRule} ${ruleBaseCount}`.toLowerCase();
      return rowString.includes(searchQuery.toLowerCase());
    })
  : filteredData;

    
  const currentData = filteredDataBySearch.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredDataBySearch.length / recordsPerPage);


  // Handle pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  

  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set())

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all rows in the filtered data
      setSelectedRows(new Set(filteredDataBySearch.map(item => item.case_distribution_details?.case_distribution_batch_id || "N/A")));
    } else {
      // Deselect all rows
      setSelectedRows(new Set());
    }
  };

  const handleRowSelect = (batchId) => {

    const newSelectedRows = new Set(selectedRows);
  
    if (newSelectedRows.has(batchId)) {
      newSelectedRows.delete(batchId);
    } else {
      if (newSelectedRows.size >=5) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "You can only select 5 records at a time.",
          confirmButtonColor: "#f1c40f",
        });
        return;
      }
      newSelectedRows.add(batchId);
    }  
    setSelectedRows(newSelectedRows);

    // Automatically deselect the "Select All" checkbox if any row is deselected
    if (newSelectedRows.size !== filteredData.length) {
      setSelectAll(false);
    } else {
      setSelectAll(true);
    }
  };
  
  console.log("Selected rows:", selectedRows);
  
  
  const onapprovebuttonclick = async () => {
    const userId = await getLoggedUserId();
    const batchIds = Array.from(selectedRows);
    console.log("Selected batch IDs:", batchIds);
    if (batchIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select at least one record to approve.",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }
    const payload = {
      approver_references : batchIds,
      approved_by : userId,
    }
    console.log("Payload:", payload);
    try {
          const response = await Approve_Batch_or_Batches (payload); // Use 'await' here
          console.log("Response:", response);
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Data sent successfully.",
            confirmButtonColor: "#28a745",
          });
          fetchData();
          
        } catch (error) {
          console.error("Error in sending the data:", error);
    
          const errorMessage = error?.response?.data?.message || 
                                 error?.message || 
                                 "An error occurred. Please try again.";
    
            Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
                confirmButtonColor: "#d33",
            });
        }
  }

  const onSubmit = async () => {
    const userId = await getLoggedUserId();
    const batchIds = Array.from(selectedRows);

    if (batchIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select at least one record to approve.",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }
    const payload = {
      approver_references : batchIds,
      Created_By : userId,
    }
    try {
      const response = await Create_task_for_batch_approval (payload); // Use 'await' here
      console.log("Response:", response);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data sent successfully.",
        confirmButtonColor: "#28a745",
      });
      fetchData();
    } catch (error) {
      console.error("Error in sending the data:", error);

      const errorMessage = error?.response?.data?.message || 
                             error?.message || 
                             "An error occurred. Please try again.";

        Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
            confirmButtonColor: "#d33",
        });
    }

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
          {currentData.length > 0 ? (
            currentData.map((item, index) => (

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
                    checked={selectedRows.has(item.case_distribution_details?.case_distribution_batch_id || "N/A")}
                    onChange={() => handleRowSelect(item.case_distribution_details?.case_distribution_batch_id || "N/A")}
                    className="mx-auto"
                  />
                </td>
                <td className={GlobalStyle.tableData}>{item.case_distribution_details?.case_distribution_batch_id || "N/A"}</td>
                <td className={GlobalStyle.tableData}>{new Date (item.created_on).toLocaleDateString()}</td>
                <td className={GlobalStyle.tableData}> {item.case_distribution_details?.drc_commision_rule || "N/A"}</td>
                <td className={GlobalStyle.tableData}>{item.case_distribution_details?.rulebase_count || "N/A"}</td>
                <td className={GlobalStyle.tableData}>{item.totalArrears}</td>
              </tr>
            ))
            ) : (
              <tr>
                <td colSpan="6" className={GlobalStyle.tableData}>
                  No data available
                </td>
              </tr>
            )
          }
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
          onClick={onapprovebuttonclick}
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