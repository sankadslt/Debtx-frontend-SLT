 /* Purpose: This component displays the Withdrawal Case Log UI
Created Date: 2025-05-19
Created By: [Your Name]
Last Modified Date: 2025-05-19
Modified By: [Your Name]
Version: node 22
Dependencies: tailwind css, react-icons, react-datepicker, sweetalert2
Related Files:
Notes: */

import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { getLoggedUserId } from "../../services/auth/authService";
import { fetchWithdrawalCases } from "../../services/case/CaseServices";
import { Tooltip } from "react-tooltip";

// Status icons mapping (add your actual icon paths)
const STATUS_ICONS = {
  "Pending": {
  //  icon: "/path/to/pending-icon.png",
    tooltip: "Pending withdrawal"
  },
  "Approved": {
  //  icon: "/path/to/approved-icon.png",
    tooltip: "Approved withdrawal"
  },
  "Rejected": {
   // icon: "/path/to/rejected-icon.png",
    tooltip: "Rejected withdrawal"
  },
  "Pending Write Off": {
   // icon: "/path/to/writeoff-icon.png",
    tooltip: "Pending write off"
  }
};

const StatusIcon = ({ status }) => {
  const statusInfo = STATUS_ICONS[status];
  if (!statusInfo) return <span>{status}</span>;

  const tooltipId = `tooltip-${status.replace(/\s+/g, '-')}`;

  return (
    <div className="flex items-center gap-2">
      <img
        src={statusInfo.icon}
        alt={status}
        className="w-6 h-6"
        data-tooltip-id={tooltipId}
      />
      <Tooltip id={tooltipId} place="bottom" effect="solid">
        {statusInfo.tooltip}
      </Tooltip>
    </div>
  );
};

export default function WithdrawalCaseLog() {
  // State variables
  const [withdrawalCases, setWithdrawalCases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [status, setStatus] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pagination, setPagination] = useState({ 
    total: 0, 
    page: 1, 
    limit: 10, 
    pages: 0 
  });
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  
  const rowsPerPage = 10;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = withdrawalCases.slice(startIndex, endIndex);
  const filteredDataBySearch = paginatedData.filter((row) =>
    Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const loadUser = async () => {
      const user = await getLoggedUserId();
    
      setUserData(user);
    };
    loadUser();
  }, []);

  
  const handleFromDateChange = (date) => {
    if (!date || (toDate && date > toDate)) {
      Swal.fire("Warning", "The 'From' date cannot be later than the 'To' date.", "warning");
      return;
    }
    checkDateDifference(date, toDate);
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    if (!date || (fromDate && date < fromDate)) {
      Swal.fire("Warning", "The 'To' date cannot be before the 'From' date.", "warning");
      return;
    }
    checkDateDifference(fromDate, date);
    setToDate(date);
  };

  const checkDateDifference = (startDate, endDate) => {
    if (!startDate || !endDate) return;
    
    const diffInDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    if (diffInDays > 31) {
      Swal.fire({
        title: "Date Range Exceeded", 
        text: "The selected dates have more than a 1-month gap.", 
        icon: "warning"
      }).then(() => {
        setToDate(null);
        setFromDate(null);
      });
    }
  };

  const loadWithdrawalCases = async (page = 1) => {
    try {
      setLoading(true);
      
      if (!accountNumber || !status || (fromDate && !toDate) || (!fromDate && toDate)) {
        Swal.fire({
          title: "Warning",
          text: "Fill all required fields properly.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        return;
      }

      const payload = {
        fromDate: fromDate ? new Date(fromDate.getTime() - fromDate.getTimezoneOffset() * 60000).toISOString().split("T")[0] : null,
        toDate: toDate ? new Date(toDate.getTime() - toDate.getTimezoneOffset() * 60000).toISOString().split("T")[0] : null,
        status,
        accountNumber: String(accountNumber).trim(),
        page,
        limit: rowsPerPage,
      };

      const result = await fetchWithdrawalCases(payload)
      setWithdrawalCases(result.data);
      setPagination(result.pagination);
      setCurrentPage(page);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to fetch withdrawal cases. Please try again.",
        icon: "error"
      });
    } finally {
      setLoading(false);
      
    }
  };

  const handleFilterButton = () => {
    setWithdrawalCases([]);
    setMaxCurrentPage(0);
    if (currentPage === 1) {
      loadWithdrawalCases();
    } else {
      setCurrentPage(1);
    }
    setIsFilterApplied(true);
    
  };

  const handleClear = () => {
    setAccountNumber("");
    setStatus("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setCurrentPage(1);
    setIsFilterApplied(false);
    setWithdrawalCases([]);
  };

  const handlePageChange = () => {
    if (currentPage > maxCurrentPage && currentPage <= pagination.pages) {
      setMaxCurrentPage(currentPage);
      loadWithdrawalCases(currentPage);
    }
  };

  useEffect(() => {
    if (isFilterApplied) {
      handlePageChange();
    }
  }, [currentPage]);

  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < pagination.pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatCurrency = (amount) => 
    parseFloat(amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });

  const formatDisplayDate = (dateString) => 
    dateString && dateString !== "N/A" ? new Date(dateString).toLocaleDateString("en-GB") : "N/A";

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <div className="flex flex-col flex-1">
        <main className="p-6">
          <h1 className={GlobalStyle.headingLarge}>Withdrawal Case Log</h1>

          {/* Filters Section */}
          <div className={`${GlobalStyle.cardContainer} w-full`}>
            <div className="flex items-center justify-end w-full space-x-6">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Account No"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className={GlobalStyle.inputText}
                />
              </div>

              <div className="flex items-center">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={GlobalStyle.selectBox}
                  style={{ color: status === "" ? "gray" : "black" }}
                >
                  <option value="" hidden>Select Status</option>
                  <option value="Write Off">Write-Off</option>
                  <option value="Approval Pending Write Off">Approval Pending Write-Off</option>
                
                  <option value="Pending Write Off">Pending Write-Off</option>
                </select>
              </div>

              <label className={GlobalStyle.dataPickerDate}>Date</label>
              <div className={GlobalStyle.datePickerContainer}>
                <div className="flex items-center">
                  <DatePicker
                    selected={fromDate}
                    onChange={handleFromDateChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="From"
                    className={GlobalStyle.inputText}
                  />
                </div>

                <div className="flex items-center">
                  <DatePicker
                    selected={toDate}
                    onChange={handleToDateChange}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="To"
                    className={GlobalStyle.inputText}
                  />
                </div>
              </div>

              <button
                className={GlobalStyle.buttonPrimary}
                onClick={handleFilterButton}
                disabled={loading}
              >
                {loading ? "Loading..." : "Filter"}
              </button>
              
              <button
                className={GlobalStyle.buttonRemove}
                onClick={handleClear}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4 flex justify-start mt-10">
            <div className={GlobalStyle.searchBarContainer}>
              <input
                type="text"
                className={GlobalStyle.inputSearch}
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className={GlobalStyle.searchBarIcon} />
            </div>
          </div>

          {/* Table */}
          <div className={`${GlobalStyle.tableContainer} mt-10`}>
            <table className={GlobalStyle.table}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th className={GlobalStyle.tableHeader}>Case ID</th>
                  <th className={GlobalStyle.tableHeader}>Status</th>
                  <th className={GlobalStyle.tableHeader}>Account No</th>
                  <th className={GlobalStyle.tableHeader}>Amount</th>
                  <th className={GlobalStyle.tableHeader}>Remark</th>
                  <th className={GlobalStyle.tableHeader}>Withdraw By</th>
                  <th className={GlobalStyle.tableHeader}>Withdraw On</th>
                  <th className={GlobalStyle.tableHeader}>Approved On</th>
                </tr>
              </thead>
              <tbody>
                {filteredDataBySearch.length > 0 ? (
                  filteredDataBySearch.map((row, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0
                          ? GlobalStyle.tableRowEven
                          : GlobalStyle.tableRowOdd
                      }
                    >
                      <td className={GlobalStyle.tableData}>{row.caseId || "N/A"}</td>
                      <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>
                         {row.status} 
                      </td>
                      <td className={GlobalStyle.tableData}>{row.accountNo || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>{formatCurrency(row.amount)}</td>
                      <td className={GlobalStyle.tableData}>{row.remark || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>{row.withdrawBy || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>{formatDisplayDate(row.withdrawOn)}</td>
                      <td className={GlobalStyle.tableData}>{formatDisplayDate(row.approvedOn)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      {loading ? "Loading..." : "No results found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {withdrawalCases.length > 0 && (
            <div className={GlobalStyle.navButtonContainer}>
              <button
                onClick={() => handlePrevNext("prev")}
                disabled={currentPage === 1}
                className={`${GlobalStyle.navButton} ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                <FaArrowLeft />
              </button>
              <span className={`${GlobalStyle.pageIndicator} mx-4`}>
                Page {currentPage} of {pagination.pages || 1}
              </span>
              <button
                onClick={() => handlePrevNext("next")}
                disabled={currentPage === pagination.pages || pagination.pages === 0}
                className={`${GlobalStyle.navButton} ${
                  currentPage === pagination.pages || pagination.pages === 0 
                    ? "cursor-not-allowed opacity-50" 
                    : ""
                }`}
              >
                <FaArrowRight />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}