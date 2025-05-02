/*Purpose: 
Created Date: 2025-04-01
Created By: Nimesh Perera (nimeshmathew999@gmail.com)
Last Modified Date: 2025-04-28
Modified By: Nimesh Perera (nimeshmathew999@gmail.com), Sasindu Srinayaka (sasindusrinayaka@gmail.com)
Version: React v18
ui number : 4.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import DatePicker from "react-datepicker"
import GlobalStyle from "../../assets/prototype/GlobalStyle"
import { useEffect, useState } from "react"
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Litigation_Fail_Update } from "./Litigation_Fail_Update";
import { listAllLitigationCases } from "../../services/litigation/litigationService";
import Swal from 'sweetalert2';

//Status Icons
import Initial_Litigation from '../../assets/images/litigation/status/Initial_Litigation.png'
import FTL_Settle_Pending from '../../assets/images/litigation/status/Litigation_Settle_Pending.png'
import Pending_FTL from '../../assets/images/litigation/status/Litigation_Settle_Open_Pending.png'
import FLU from '../../assets/images/litigation/status/FLU.png'
import FLA from '../../assets/images/litigation/status/FLA.png'
import SLA from '../../assets/images/litigation/status/Litigation_Settle_Active.png'
// import FTL from '../../assets/images/litigation/status/FTL.png'
// import Litigation from '../../assets/images/litigation/status/Litigation.png'

//Button Icons
import Create_Settlement from '../../assets/images/litigation/buttons/Create_Settlement.png'
import Documents_Collected from '../../assets/images/litigation/buttons/Documents-Collected.png'
import Documents from '../../assets/images/litigation/buttons/Documents.png'
import Legal_Details from '../../assets/images/litigation/buttons/Legal_Details.png'
import Legal_Submission from '../../assets/images/litigation/buttons/Legal_Submission.png'
import Preview from '../../assets/images/litigation/buttons/Preview.png'

export const Litigation_List = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [dateType, setDateType] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAPIPages, setTotalAPIPages] = useState(1);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const rowsPerPage = 10; // Number of rows per page 

  //Popup
  const [showPopup, setShowPopup] = useState(false);

  // variables need for table
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

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

  const getStatusIcon = (status) => {
    switch (status) {
        case "Initial_Litigation":
          return Initial_Litigation;
        case "FLU":
          return FLU;
        case "FLA":
          return FLA;
        case "Pending FTL":
          return Pending_FTL;
        case "FTL_Settle_Pending":
          return FTL_Settle_Pending;
        case "SLA":
          return SLA;
        default:
            return null;
    }
  };

  const renderStatusIcon = (status) => {
    const icon = getStatusIcon(status);
    
    if (!icon) {
        return <span>{status}</span>;
    }

    return (
        <img
            src={icon}
            alt={status}
            className="w-6 h-6"
            title={status}
        />
    );
  };

  // Date type mapping between frontend display values and backend expected values
  const dateTypeMapping = {
    "accepted": "legal accepted date",
    "created": "Settlement created dtm"
  };

  // Handle api calling only when the currentPage incriment more that before
  const handlePageChange = () => {
    if (currentPage > maxCurrentPage && currentPage <= totalAPIPages) {
      setMaxCurrentPage(currentPage);
      handleFilter(); // Call the filter function only after the page incrimet 
    }
  };
  
  useEffect(() => {
    if (isFilterApplied) {
      handlePageChange(); // Call the function whenever currentPage changes
    }
  }, [currentPage]);

  // Handle Pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFilter = async() => {
    // Format the date to 'YYYY-MM-DD' format
    const formatDate = (date) => {
      if (!date) return null;
      const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      return offsetDate.toISOString().split('T')[0];
    };

    try{
      if (!status && !dateType && !fromDate && !toDate) {
        Swal.fire({
          title: "Warning",
          text: "No filter is selected. Please, select a filter.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        setToDate(null);
        setFromDate(null);
        return;
      }

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

      // Create the payload with mapped values where needed
      const payload = {
        pages: currentPage,
        case_current_status: status ? statusMapping[status] : "",
        date_type: dateType ? dateTypeMapping[dateType] : "",
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate)
      };
      console.log("Payload sent to API: ", payload);
      
      setIsLoading(true);
      const response = await listAllLitigationCases(payload).catch((error) => {
        if (error.response && error.response.status === 404) {
          Swal.fire({
            title: "No Results",
            text: "No matching data found for the selected filters.",
            icon: "warning",
            allowOutsideClick: false,
            allowEscapeKey: false
          });
          setFilteredData([]);
          return null;
        } else {
          throw error;
        }
      });
      setIsLoading(false);
      
      // Updated response handling
      if (response && response.data) {
        console.log("Valid data received:", response.data)
        // console.log(response.data.pagination.pages);
        const totalPages = Math.ceil(response.total_cases / rowsPerPage);
        setTotalPages(totalPages);
        setTotalAPIPages(totalPages <= 10 ? 1 : Math.ceil((totalPages - 10) / 30) + 1);
        // Append the new data to the existing data
        setFilteredData((prevData) => [...prevData, ...response.data]);

        console.log("pages", totalPages);
        console.log("pagesAPI", totalAPIPages);
        

        // setFilteredData(response.data.data);
      } else {
        console.error("No valid Settlement data found in response:", response);
        setFilteredData([]);
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
    } 
  };

  const handleFilterButton = () => { // Reset to the first page
    setFilteredData([]); // Clear previous results
    setMaxCurrentPage(0); // Reset max current page
    setTotalAPIPages(1); // Reset total API pages
    if (currentPage === 1) {
      handleFilter();
    } else {
      setCurrentPage(1);
    }
    setIsFilterApplied(true); // Set filter applied state to true
  }

  // Function to handle searching through current results
  const getFilteredResults = () => {
    if (!searchQuery) return paginatedData;
    
    return paginatedData.filter(item => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (item.case_id && item.case_id.toString().toLowerCase().includes(searchLower)) ||
        (item.status && item.status.toLowerCase().includes(searchLower)) ||
        (item.account_no && item.account_no.toString().toLowerCase().includes(searchLower))
      );
    });
  };

  const filteredDataBySearch = getFilteredResults();

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
                    onClick={handleFilterButton}
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
                {filteredDataBySearch.map((item, index) => {
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
                      <td className={`${GlobalStyle.tableData} flex justify-center items-center mt-1`}>{renderStatusIcon(item.status)}</td>
                      <td className={`${GlobalStyle.tableData} text-center`}>{item.account_no}</td>
                      <td className={`${GlobalStyle.tableData} text-right px-2`}>{item.current_arreas_amount}</td>
                      <td className={`${GlobalStyle.tableData} text-center`}>{item.legal_accepted_date
                        ? new Date(item.legal_accepted_date).toLocaleDateString("en-GB")
                        : "N/A"}
                      </td>
                      <td className={`${GlobalStyle.tableData} text-center`}>{item.settlement_created_date
                        ? new Date(item.settlement_created_date).toLocaleDateString("en-GB")
                        : "N/A"}
                      </td>
                      <td className={`${GlobalStyle.tableData} px-4`}>
                        {displayStatus === "Initial_Litigation" && (
                          <div className="flex gap-4 items-center justify-center">
                            <img
                              src={Documents}
                              alt="Documents"
                              className="w-6 h-6 cursor-pointer"
                              title="Documents"
                              onClick={() => navigate("/pages/Litigation/Litigation_Documentation", {
                                state:{case_id : item.case_id}
                              })}
                            />
                          </div>
                        )}
                        {displayStatus === "Pending_FTL" && (
                          <div className="flex gap-4 items-center justify-center">
                            <img
                              src={Documents_Collected}
                              alt="Documents Collected"
                              className="w-6 h-6 cursor-pointer"
                              title="Documents Collected"
                              onClick={() => navigate("/pages/Litigation/Litigation_Submission_Document_Summary")}
                            />
                            <img
                              src={Legal_Submission}
                              alt="Legal Submission"
                              className="w-6 h-6 cursor-pointer"
                              title="Legal Submission"
                              onClick={() => navigate("/pages/Litigation/Litigation_Submission", {
                                state:{case_id : item.case_id}
                              })}    
                            />
                          </div>
                        )}
                        {displayStatus === "FTL_Settle_Pending" && (
                          <div className="flex justify-center gap-2">   
                            <img
                              src={Preview}
                              alt="Preview"
                              className="w-6 h-6 cursor-pointer"
                              title="Preview"
                              onClick={() => navigate("/pages/Litigation/Litigation_Case_Details", {
                                state:{case_id : item.case_id}
                              })}                       
                            />
                          </div>
                        )}
                        {displayStatus === "Litigation" && (
                          <div className="flex gap-4 items-center justify-center">   
                            <img
                              src={Create_Settlement}
                              alt="Create Settlement"
                              className="w-6 h-6 cursor-pointer"
                              title="Create Settlement"
                              onClick={() => navigate("/pages/Litigation/Litigation_Documentation")}
                            />
                            <button 
                              className={GlobalStyle.buttonPrimary}
                              onClick={() => setShowPopup(true)}
                            >
                              Legal Fail
                            </button>
                          </div>
                        )}
                        
                        {/* Popup */}
                        {showPopup && (
                          <div className={GlobalStyle.popupBoxContainer}>
                            <div className={GlobalStyle.popupBoxBody}>
                              <div className={GlobalStyle.popupBox}>
                                <h2 className={GlobalStyle.popupBoxTitle}>Legal Fail Update</h2>

                                <button
                                  className={GlobalStyle.popupBoxCloseButton}
                                  onClick={() => setShowPopup(false)}
                                >
                                  ×
                                </button>
                              </div>

                              <div>
                                <Litigation_Fail_Update case_id={item.case_id} />
                              </div>
                            </div>
                          </div>
                        )}

                        {displayStatus === "FTL" && ( 
                          <div className="flex gap-4 items-center justify-center">
                            <img
                              src={Legal_Details}
                              alt="Legal Details"
                              className="w-6 h-6 cursor-pointer"
                              title="Create Details"
                              onClick={() => navigate("/pages/Litigation/Litigation_Court_Details_Update", {
                                state:{case_id : item.case_id}
                              })} 
                            />
                            <img
                              src={Create_Settlement}
                              alt="Create Settlement"
                              className="w-6 h-6 cursor-pointer"
                              title="Create Settlement"
                              onClick={() => navigate("/pages/Litigation/Litigation_Documentation")}
                            />
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
                {!isLoading && filteredDataBySearch.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No results found
                    </td>
                  </tr>
                )}
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

        {/* Test
        <div className="flex justify-start gap-4 mt-4">
          <button className={`${GlobalStyle.buttonPrimary}`} onClick={() => setShowPopup(true)}>
            Show Litigation Fail
          </button>
        </div> */}
    </div>
  )
}
