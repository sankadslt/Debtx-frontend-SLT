/*Purpose: 
Created Date: 2025-04-01
Created By: Nimesh Perera (nimeshmathew999@gmail.com)
Last Modified Date: 2025-04-04
Modified By: Nimesh Perera (nimeshmathew999@gmail.com), Sasindu Srinayaka (sasindusrinayaka@gmail.com)
Version: React v18
ui number : 4.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import DatePicker from "react-datepicker"
import GlobalStyle from "../../assets/prototype/GlobalStyle"
import { useEffect, useState } from "react"
import { FaArrowLeft, FaArrowRight, FaEye, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Litigation_Fail_Update } from "./Litigation_Fail_Update";
import { listAllLitigationCases } from "../../services/litigation/litigationService";
import Swal from 'sweetalert2';

export const Litigation_List = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [dateType, setDateType] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Changed to start from 1 to match backend
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [totalCases, setTotalCases] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
 
  // Status mapping between frontend display values and backend expected values
  const statusMapping = {
    "Initial_Litigation": "Initial_Litigation",
    "Pending_FTL": "Pending FTL",
    "FTL_Settle_Pending": "FTL_Settle_Pending",
    "FTL": "Forward To Litigation",
    "FLU": "Fail from Legal Unit",
    "SLA": "Success Legal Action",
    "FLA": "Fail Legal Action",
    "Litigation": "Litigation"
  };

  // Date type mapping between frontend display values and backend expected values
  const dateTypeMapping = {
    "accepted": "legal accepted date",
    "created": "Settlement created dtm"
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      fetchData(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchData(currentPage - 1);
    }
  };

  const fetchData = async (page = 1) => {
    try {
      setIsLoading(true);
      
      // Format the date to 'YYYY-MM-DD' format
      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split('T')[0];
      };
      
      // Create the payload with mapped values where needed
      const payload = {
        pages: page,
        case_current_status: status ? statusMapping[status] : "",
        date_type: dateType ? dateTypeMapping[dateType] : "",
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate)
      };
      
      console.log("Payload sent to API: ", payload);
      
      const response = await listAllLitigationCases(payload);
      
      if (response && response.status === "success") {
        setFilteredData(response.data);
        setTotalCases(response.total_cases);
        setTotalPages(Math.ceil(response.total_cases / (page === 1 ? 10 : 30)));
      } else {
        setFilteredData([]);
        setTotalCases(0);
        setTotalPages(1);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Swal.fire({
          title: "No Results",
          text: "No matching data found for the selected filters.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        setFilteredData([]);
      } else {
        console.error("Error fetching litigation cases:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to fetch data. Please try again.",
          icon: "error"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = () => {
    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      Swal.fire({
        title: "Warning",
        text: "Both From Date and To Date must be selected.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      setToDate(null);
      setFromDate(null);
      return;
    }

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      Swal.fire({
        title: "Warning",
        text: "To date should be greater than or equal to From date",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      setToDate(null);
      setFromDate(null);
      return;
    }
    
    setCurrentPage(1); // Reset to first page when filtering
    fetchData(1);
  };

  // Function to handle searching through current results
  const getFilteredResults = () => {
    if (!searchQuery) return filteredData;
    
    return filteredData.filter(item => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (item.id && item.id.toString().toLowerCase().includes(searchLower)) ||
        (item.status && item.status.toLowerCase().includes(searchLower)) ||
        (item.account_no && item.account_no.toString().toLowerCase().includes(searchLower))
      );
    });
  };

  const displayData = getFilteredResults();

  // Map backend status values to frontend display values (reverse of statusMapping)
  const getDisplayStatus = (backendStatus) => {
    for (const [key, value] of Object.entries(statusMapping)) {
      if (value === backendStatus) return key;
    }
    return backendStatus; // Fallback to original value if no mapping found
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
        <h1 className={GlobalStyle.headingLarge}>Litigation List</h1>

        {/* Filtering Section */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-end my-6 gap-1 mb-8">
            <div className="flex items-center justify-end gap-[20px] w-full">
                {/* Status */}
                <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={GlobalStyle.selectBox}
                >
                    <option value="">Status</option>
                    <option value="Initial_Litigation">Initial Litigation</option>
                    <option value="Pending_FTL">Pending FTL</option>
                    <option value="FTL_Settle_Pending">FTL Settle Pending</option>
                    <option value="FTL">FTL</option>
                    <option value="FLU">FLU (Fail from Legal Unit)</option>
                    <option value="SLA">SLA (Success Legal Action)</option>
                    <option value="FLA">FLA (Fail Legal Action)</option>
                    <option value="Litigation">Litigation</option>
                </select>

                {/* Date Type */}
                <select 
                value={dateType}
                onChange={(e) => setDateType(e.target.value)}
                className={GlobalStyle.selectBox}>
                    <option value="">Date Type</option>
                    <option value="accepted">Legal Accepted Date</option>
                    <option value="created">Settlement Created DTM</option>
                </select>

                {/* Date */}
                <div className="flex gap-1 items-center">
                    <label className={GlobalStyle.dataPickerDate}>Date</label>
                    <DatePicker
                        selected={fromDate}
                        onChange={(date) => setFromDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/mm/yyyy"
                        className={`${GlobalStyle.inputText} w-32 md:w-40`}
                        disabled={!dateType}
                    />

                    <DatePicker
                        selected={toDate}
                        onChange={(date) => setToDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/mm/yyyy"
                        className={`${GlobalStyle.inputText} w-32 md:w-40`}
                        disabled={!dateType}
                    />
                </div>

                {/* Filter Button */}
                <button
                    className={GlobalStyle.buttonPrimary}
                    onClick={handleFilter}
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Filter"}
                </button>
            </div>
        </div>

        {/* Search bar */}
        <div className="mb-4 flex justify-start">
            <div className={GlobalStyle.searchBarContainer}>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={GlobalStyle.inputSearch}
                placeholder="Search by ID, Status, or Account No"
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
                  <th className={GlobalStyle.tableHeader}>Account No</th>
                  <th className={GlobalStyle.tableHeader}>Amount</th>
                  <th className={GlobalStyle.tableHeader}>Legal Accepted Date</th>
                  <th className={GlobalStyle.tableHeader}>Settlement Created Date</th>
                  <th className={GlobalStyle.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map((item, index) => {
                  // Map the backend status to frontend display status
                  const displayStatus = getDisplayStatus(item.status);
                  
                  return (
                    <tr
                      key={item._id || item.id || index}
                      className={`${
                        index % 2 === 0
                          ? "bg-white bg-opacity-75"
                          : "bg-gray-50 bg-opacity-50"
                      } border-b`}
                    >
                      <td className={`${GlobalStyle.tableData} text-center`}>{item.case_id}</td>
                      <td className={GlobalStyle.tableData}>{displayStatus}</td>
                      <td className={`${GlobalStyle.tableData} text-center`}>{item.account_no}</td>
                      <td className={GlobalStyle.tableData}>{item.current_arreas_amount}</td>
                      <td className={GlobalStyle.tableData}>{item.legal_accepted_date
                        ? new Date(item.legal_accepted_date).toLocaleDateString("en-GB")
                        : "N/A"}
                      </td>
                      <td className={GlobalStyle.tableData}>{item.settlement_created_date
                        ? new Date(item.settlement_created_date).toLocaleDateString("en-GB")
                        : "N/A"}
                      </td>
                      <td className={`${GlobalStyle.tableData} px-4`}>
                        {displayStatus === "Initial_Litigation" && (
                          <div>
                            <button 
                              className={GlobalStyle.buttonPrimary}
                              onClick={() => navigate("/pages/Litigation/Litigation_Documentation")}
                            >
                              Documents
                            </button>
                          </div>
                        )}
                        {displayStatus === "Pending_FTL" && (
                          <div className="flex gap-2">
                            <button 
                              className="px-4 py-2 bg-[#50B748] rounded-full border border-[#001120]"
                              onClick={() => navigate("/pages/Litigation/Litigation_Submission_Document_Summary")}
                            >
                              Documents
                            </button>
                            <button 
                              className={GlobalStyle.buttonPrimary}
                              onClick={() => navigate("/pages/Litigation/Litigation_Submission")}    
                            >
                              Legal Submission
                            </button>
                          </div>
                        )}
                        {displayStatus === "FTL_Settle_Pending" && (
                          <div className="flex justify-center gap-2">   
                            <button onClick={() => navigate("/pages/Litigation/Litigation_Case_Details")}>
                              <FaEye className="w-6 h-6"/>
                            </button>
                          </div>
                        )}
                        {displayStatus === "Litigation" && (
                          <div className="flex gap-2">   
                            <button className={GlobalStyle.buttonPrimary}>
                              Create Settlement
                            </button>
                            <button 
                              className={GlobalStyle.buttonPrimary}
                              onClick={() => setIsModalOpen(true)}
                            >
                              Legal Fail
                            </button>
                            <Litigation_Fail_Update isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
                          </div>
                        )}
                        {displayStatus === "FTL" && (
                          <div className="flex gap-2">   
                            <button 
                              className={GlobalStyle.buttonPrimary}
                              onClick={() => navigate("/pages/Litigation/Litigation_Court_Details_Update")}    
                            >
                              Legal Details
                            </button>
                            <button 
                              className={GlobalStyle.buttonPrimary}
                            >
                              Create Settlement
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {isLoading && (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                )}
                {!isLoading && displayData.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={GlobalStyle.navButtonContainer}>
            <button
              className={GlobalStyle.navButton}
              onClick={handlePrevPage}
              disabled={currentPage === 1 || isLoading}
            >
              <FaArrowLeft />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={GlobalStyle.navButton}
              onClick={handleNextPage}
              disabled={currentPage === totalPages || isLoading}
            >
              <FaArrowRight />
            </button>
          </div>
        )}
    </div>
  )
}
