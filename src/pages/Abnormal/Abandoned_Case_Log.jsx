 
import { useState, useEffect, useRef } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight, FaDownload, FaTimes } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { getLoggedUserId } from "../../services/auth/authService";
import { Tooltip } from "react-tooltip";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";
import {
  fetchAbondonedCases,
  Task_for_Download_Abondoned,
  updateAbondonedCaseRemark,
} from "../../services/Abnormal/AbnormalServices";

 import Abondoned from "/src/assets/images/Abnormal/Abandoned.png";

const STATUS_ICONS = {
  "Abondoned": {
    icon: Abondoned,
    tooltip: "Abondoned",
  },
  "Pending Abondoned": {
    //icon: Pending_Abondoned,
    tooltip: "Pending Abondoned",
  },
};

const StatusIcon = ({ status, index }) => {
  const statusInfo = STATUS_ICONS[status];
  if (!statusInfo) return <span>{status}</span>;

  const tooltipId = `tooltip-${index}`;

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

const AbondonedCaseModal = ({ onSuccess, onClose }) => {
  const [caseId, setCaseId] = useState("");
  const [remark, setRemark] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!caseId) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please enter a Case ID.",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    if (!remark) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please enter a remark before submitting!",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    setIsLoading(true);

    try {
      const userId = await getLoggedUserId();
      const payload = {
        approver_reference: caseId,
        remark: remark,
        remark_edit_by: userId,
        created_by: userId,
      };

      const response = await updateAbondonedCaseRemark(payload);

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Case submitted successfully.",
          confirmButtonColor: "#28a745",
        });
        onSuccess?.();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || error?.message || "An error occurred.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className={GlobalStyle.headingLarge}>Abondoned Case</span>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes size={20} />
        </button>
      </div>

      <div className="mb-10">
        <label className={`${GlobalStyle.headingSmall} block mb-1`}>Case ID:</label>
        <input
          type="text"
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          className={GlobalStyle.inputText}
          placeholder="Enter Case ID"
        />
      </div>

      <div className="mb-6">
        <label className={`${GlobalStyle.headingSmall} block mb-1`}>Remark:</label>
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className={`${GlobalStyle.remark} text-lg py-4 px-4 w-full`}
          rows={6}
          placeholder="Enter your remark"
        />
      </div>

      <div className="text-right">
        <button
          className={`${GlobalStyle.buttonPrimary} px-6 py-2`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto relative">
        {children}
      </div>
    </div>
  );
};

const AbondonedCaseLog = () => {
 
  const [abondonedCases, setAbondonedCases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [status, setStatus] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [isAbondonedCaseModalOpen, setIsAbondonedCaseModalOpen] = useState(false);
  const [committedFilters, setCommittedFilters] = useState({
    status: "",
    accountNumber: "",
    fromDate: null,
    toDate: null,
  });

  const rowsPerPage = 10;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const filteredDataBySearch = abondonedCases.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      let decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        refreshAccessToken().then((newToken) => {
          if (!newToken) return;
          const newDecoded = jwtDecode(newToken);
          setUserRole(newDecoded.role);
        });
      } else {
        setUserRole(decoded.role);
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, []);

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
  };

  useEffect(() => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      Swal.fire({
        title: "Warning",
        text: "To date should be greater than or equal to From date",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
      setToDate(null);
      setFromDate(null);
    }
  }, [fromDate, toDate]);

  const filterValidations = () => {
    if (!status && !accountNumber && !fromDate && !toDate) {
      Swal.fire({
        title: "Warning",
        text: "No filter is selected. Please select a filter.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
      return false;
    }

    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      Swal.fire({
        title: "Warning",
        text: "Both From Date and To Date must be selected.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
      return false;
    }

    return true;
  };

  const loadAbondonedCases = async (filters) => {
    try {
      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split("T")[0];
      };

      const payload = {
        status: filters.status,
        accountNumber: filters.accountNumber,
        fromDate: formatDate(filters.fromDate),
        toDate: formatDate(filters.toDate),
        page: filters.page,
      };

      setLoading(true);
      const response = await fetchAbondonedCases(payload);
      setLoading(false);

      if (response?.data) {
        if (currentPage === 1) {
          setAbondonedCases(response.data);
        } else {
          setAbondonedCases((prev) => [...prev, ...response.data]);
        }

        if (response.data.length === 0) {
          setIsMoreDataAvailable(false);
          if (currentPage === 1) {
            Swal.fire({
              title: "No Results",
              text: "No matching data found for the selected filters.",
              icon: "warning",
              confirmButtonColor: "#f1c40f",
            });
          }
        } else {
          const maxData = currentPage === 1 ? 10 : 30;
          if (response.data.length < maxData) {
            setIsMoreDataAvailable(false);
          }
        }
      } else {
        setAbondonedCases([]);
      }
    } catch (error) {
      console.error("Error fetching abondoned cases:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch abondoned cases.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage);
      loadAbondonedCases({
        ...committedFilters,
        page: currentPage,
      });
    }
  }, [currentPage]);

  const handleFilterButton = () => {
    setIsMoreDataAvailable(true);
    setMaxCurrentPage(0);
    const isValid = filterValidations();
    if (!isValid) return;

    setCommittedFilters({
      status,
      accountNumber,
      fromDate,
      toDate,
    });
    setAbondonedCases([]);

    if (currentPage === 1) {
      loadAbondonedCases({
        status,
        accountNumber,
        fromDate,
        toDate,
        page: 1,
      });
    } else {
      setCurrentPage(1);
    }
  };

  const handleClear = () => {
    setStatus("");
    setAccountNumber("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setAbondonedCases([]);
    setMaxCurrentPage(0);
    setIsMoreDataAvailable(true);
    setCommittedFilters({
      status: "",
      accountNumber: "",
      fromDate: null,
      toDate: null,
    });
    setCurrentPage(currentPage === 1 ? 0 : 1);
    setTimeout(() => currentPage === 1 && setCurrentPage(1), 0);
  };

  const handleAdd = () => {
    setIsAbondonedCaseModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAbondonedCaseModalOpen(false);
  };

  const handleAbondonedSuccess = () => {
    handleCloseModal();
    if (Object.values(committedFilters).some(Boolean)) {
      loadAbondonedCases({ ...committedFilters, page: 1 });
    }
  };

  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next") {
      if (isMoreDataAvailable || currentPage < Math.ceil(abondonedCases.length / rowsPerPage)) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const handleCreateTask = async () => {
    if (!fromDate || !toDate) {
      Swal.fire({
        title: "Warning",
        text: "Please select From Date and To Date.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    setIsCreatingTask(true);
    try {
      const userData = await getLoggedUserId();
      const response = await Task_for_Download_Abondoned(
        status,
        accountNumber,
        fromDate,
        toDate,
        userData
      );

      if (response?.message === "Task created successfully") {
        Swal.fire({
          title: "Success",
          text: "Task created successfully!",
          icon: "success",
          confirmButtonColor: "#28a745",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to create task.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsCreatingTask(false);
    }
  };

  const formatCurrency = (amount) =>
    parseFloat(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <div className="flex flex-col flex-1">
        <main className="p-6">
          <h1 className={GlobalStyle.headingLarge}>Abondoned Case Log</h1>
          
          {["admin", "superadmin", "slt"].includes(userRole) && (
            <div className="flex justify-end mt-2 sm:mt-0">
              <button className={GlobalStyle.buttonPrimary} onClick={handleAdd}>
                Add
              </button>
            </div>
          )}

          {/* Filters Section */}
          <div className={`${GlobalStyle.cardContainer} w-full mt-6`}>
            <div className="flex flex-wrap xl:flex-nowrap items-center justify-end w-full space-x-3">
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
                  <option value="Pending Abondoned" style={{ color: "black" }}>Pending Abondoned</option>
                  <option value="Abondoned" style={{ color: "black" }}>Abondoned</option>
                </select>
              </div>

              <label className={GlobalStyle.dataPickerDate}>Date</label>
              <DatePicker
                selected={fromDate}
                onChange={handleFromDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="From"
                className={GlobalStyle.inputText}
              />
              <DatePicker
                selected={toDate}
                onChange={handleToDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="To"
                className={GlobalStyle.inputText}
              />

              {["admin", "superadmin", "slt"].includes(userRole) && (
                <>
                  <button
                    className={GlobalStyle.buttonPrimary}
                    onClick={handleFilterButton}
                    disabled={loading}
                  >
                    Filter
                  </button>
                  <button
                    className={GlobalStyle.buttonRemove}
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                </>
              )}
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
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchQuery(e.target.value);
                }}
              />
              <FaSearch className={GlobalStyle.searchBarIcon} />
            </div>
          </div>

          {/* Table */}
          <div className={`${GlobalStyle.tableContainer} mt-10 overflow-x-auto`}>
            <table className={GlobalStyle.table}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th className={GlobalStyle.tableHeader}>Case ID</th>
                  <th className={GlobalStyle.tableHeader}>Status</th>
                  <th className={GlobalStyle.tableHeader}>Amount</th>
                  <th className={GlobalStyle.tableHeader}>Remark</th>
                  <th className={GlobalStyle.tableHeader}>Abondoned By</th>
                  <th className={GlobalStyle.tableHeader}>Abondoned On</th>
                  <th className={GlobalStyle.tableHeader}>Approved On</th>
                </tr>
              </thead>
              <tbody>
                {filteredDataBySearch.length > 0 ? (
                  filteredDataBySearch.slice(startIndex, endIndex).map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
                    >
                      <td className={GlobalStyle.tableData}>{row.caseId || ""}</td>
                      <td className={`${GlobalStyle.tableData} flex justify-left`}>
                        <StatusIcon status={row.status} index={index} />
                      </td>
                      <td className={GlobalStyle.tableData}>{formatCurrency(row.amount)}</td>
                      <td className={GlobalStyle.tableData}>{row.remark || ""}</td>
                      <td className={GlobalStyle.tableData}>{row.abondonedBy || ""}</td>
                      <td className={GlobalStyle.tableData}>
                        {row.abondonedOn ? new Date(row.abondonedOn).toLocaleDateString("en-GB") : ""}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {row.approvedOn ? new Date(row.approvedOn).toLocaleDateString("en-GB") : ""}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className={`${GlobalStyle.tableData} text-center`}>
                      No cases available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredDataBySearch.length > 0 && (
            <div className={GlobalStyle.navButtonContainer}>
              <button
                onClick={() => handlePrevNext("prev")}
                disabled={currentPage <= 1}
                className={`${GlobalStyle.navButton}`}
              >
                <FaArrowLeft />
              </button>
              <span className={`${GlobalStyle.pageIndicator} mx-4`}>
                Page {currentPage}
              </span>
              <button
                onClick={() => handlePrevNext("next")}
                disabled={
                  searchQuery
                    ? currentPage >= Math.ceil(filteredDataBySearch.length / rowsPerPage)
                    : !isMoreDataAvailable && currentPage >= Math.ceil(abondonedCases.length / rowsPerPage)
                }
                className={`${GlobalStyle.navButton}`}
              >
                <FaArrowRight />
              </button>
            </div>
          )}

          {/* Create Task Button */}
          {["admin", "superadmin", "slt"].includes(userRole) && filteredDataBySearch.length > 0 && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleCreateTask}
                className={`${GlobalStyle.buttonPrimary} flex items-center ${
                  isCreatingTask ? "opacity-50" : ""
                }`}
                disabled={isCreatingTask}
              >
                {!isCreatingTask && <FaDownload style={{ marginRight: "8px" }} />}
                {isCreatingTask ? "Creating Tasks..." : "Create task and let me know"}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Abondoned Case Modal */}
      <Modal isOpen={isAbondonedCaseModalOpen} onClose={handleCloseModal}>
        <AbondonedCaseModal 
          onSuccess={handleAbondonedSuccess} 
          onClose={handleCloseModal} 
        />
      </Modal>
    </div>
  );
};

export default AbondonedCaseLog;