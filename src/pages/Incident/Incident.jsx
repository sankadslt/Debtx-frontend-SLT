/*Purpose:
Created Date: 2025-07-17
Created By: Yugani Gunarathna (jtdsiriwardena@gmail.com)
Last Modified Date: 2025-07-18
Modified By: Sathmi Peiris (sathmipeiris@gmail.com)
Last Modified Date: 2025-07-20
Modified By:  Yugani Gunarathna 
              Sathmi Peiris
             Update 2025-07-20
             
Version: React v18
ui number : 1.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS and connects to Incident collection with Account Number filtering */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import {
  FaArrowLeft,
  FaArrowRight,
  FaSearch,
  FaDownload,
  FaPlus,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import {
  New_List_Incidents,
  Task_for_Download_Incidents,
} from "../../services/Incidents/incidentService.js";
import { getLoggedUserId } from "../../services/auth/authService.js";
import { Tooltip } from "react-tooltip";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService.js";
import opeanincident from "/src/assets/images/incidents/Incident_Open.png";
import inprogressincident from "/src/assets/images/incidents/Incident_InProgress.png";
import incidentDone from "/src/assets/images/incidents/Incident_Done.png";
import errorincident from "/src/assets/images/incidents/Incident_Error.png";
import Open_CPE_Collect from "../../assets/images/incidents/Only_CPE_Collect.png";
import Reject_Pending from "../../assets/images/incidents/Reject_Pending.png";
import Incident_Reject from "../../assets/images/incidents/Incident_Reject.png";

const Incident = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [toDate, setToDate] = useState(null);
  const [status1, setStatus1] = useState("");
  const [status2, setStatus2] = useState("");
  const [status3, setStatus3] = useState("");
  const [accountNo, setAccountNo] = useState(""); // NEW: Account Number state
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const rowsPerPage = 10;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const hasMounted = useRef(false);

  // UPDATED: Added accountNumber to committedFilters
  const [committedFilters, setCommittedFilters] = useState({
    status1: "",
    status2: "",
    status3: "",
    fromDate: null,
    toDate: null,
    accountNo: "",
  });

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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "incident open":
      case "open no agent":
        return opeanincident;
      case "incident inprogress":
      case "incident error":
        return errorincident;

      case "open cpe collect":
        return Open_CPE_Collect;

      case "reject pending":
        return Reject_Pending;

      case "incident reject":
        return Incident_Reject;

      case "complete":
      case "completed":
        return incidentDone;
      case "direct lod":
        return inprogressincident;
      default:
        return null;
    }
  };
  // render status icon with tooltip
  const renderStatusIcon = (status, index) => {
    const iconPath = getStatusIcon(status);
    if (!iconPath) {
      return <span>{status}</span>;
    }

    const tooltipId = `tooltip-${index}`;

    return (
      <div className="flex items-center gap-2">
        <img
          src={iconPath}
          alt={status}
          className="w-6 h-6"
          data-tooltip-id={tooltipId}
        />

        <Tooltip id={tooltipId} place="bottom" effect="solid">
          {status}
        </Tooltip>
      </div>
    );
  };
  const navigate = useNavigate();

  const handlestartdatechange = (date) => {
    setFromDate(date);
  };

  const handleenddatechange = (date) => {
    setToDate(date);
  };

  useEffect(() => {
    if (fromDate && toDate) {
      if (new Date(fromDate) > new Date(toDate)) {
        Swal.fire({
          title: "Warning",
          text: "To date should be greater than or equal to From date",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonColor: "#f1c40f",
        });
        setToDate(null);
        setFromDate(null);
        return;
      }
    }
  }, [fromDate, toDate]);

  const filteredDataBySearch = filteredData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filterValidations = () => {
    if (
      !status1 &&
      !status2 &&
      !status3 &&
      !fromDate &&
      !toDate &&
      !accountNo
    ) {
      Swal.fire({
        title: "Warning",
        text: "No filter is selected. Please, select a filter.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f",
      });
      setToDate(null);
      setFromDate(null);
      return false;
    }

    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      Swal.fire({
        title: "Warning",
        text: "Both From Date and To Date must be selected.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f",
      });
      setToDate(null);
      setFromDate(null);
      return false;
    }

    return true;
  };
  const callAPI = async (filters) => {
    try {
      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        );
        return offsetDate.toISOString().split("T")[0];
      };

      const payload = {
        Actions: filters.status1,
        Incident_Status: filters.status2,
        Source_Type: filters.status3,
        From_Date: formatDate(filters.fromDate),
        To_Date: formatDate(filters.toDate),
        Account_Num: filters.accountNo,
        pages: filters.page,
      };

      setIsLoading(true);
      const response = await New_List_Incidents(payload);
      setIsLoading(false);

      if (response && response.incidents && Array.isArray(response.incidents)) {
        const newData = response.incidents;

        if (currentPage === 1) {
          setFilteredData(newData); // RESET page 1
        } else {
          setFilteredData((prev) => [...prev, ...newData]); // ADD page 2+
        }

        // if (newData.length < 10) {
        //   setIsMoreDataAvailable(false);
        // }

        if (newData.length === 0) {
          setIsMoreDataAvailable(false); // No more data available
          if (currentPage === 1) {
            Swal.fire({
              title: "No Results",
              text: "No matching data found for the selected filters.",
              icon: "warning",
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonColor: "#f1c40f",
            });
          } else if (currentPage === 2) {
            setCurrentPage(1); // Reset to page 1 if no data found on page 2
          }
        } else {
          const maxData = currentPage === 1 ? 10 : 30;
          if (newData.length < maxData) {
            console.log("No more data available", newData.length);
            setIsMoreDataAvailable(false); // No more data available
          }
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "No valid Incident data found in response.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        setFilteredData([]);
      }
    } catch (error) {
      console.error("API call failed:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data.",
        icon: "error",
      });
      // setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage);
      callAPI({
        ...committedFilters,
        page: currentPage,
      });
    }
  }, [currentPage]);

  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // console.log("Current Page:", currentPage);
    } else if (direction === "next") {
      if (isMoreDataAvailable) {
        setCurrentPage(currentPage + 1);
      } else {
        if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
          setCurrentPage(currentPage + 1);
        }
      }
      // console.log("Current Page:", currentPage);
    }
  };

  const handleFilterButton = () => {
    setIsMoreDataAvailable(true);
    //setTotalPages(0);
    setMaxCurrentPage(0);
    const isValid = filterValidations();
    if (!isValid) {
      return;
    } else {
      setCommittedFilters({
        status1,
        status2,
        status3,
        fromDate,
        toDate,
        accountNo,
      });
      setFilteredData([]);

      if (currentPage === 1) {
        callAPI({
          status1,
          status2,
          status3,
          fromDate,
          toDate,
          accountNo,
          page: 1,
        });
      } else {
        setCurrentPage(1);
      }
    }
  };

  const handleClear = () => {
    setStatus1("");
    setStatus2("");
    setStatus3("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setAccountNo("");
    setFilteredData([]);
    setMaxCurrentPage(0);
    setIsMoreDataAvailable(true);
    setCommittedFilters({
      status1: "",
      status2: "",
      status3: "",
      accountNo: "",
      fromDate: null,
      toDate: null,
    });
    if (currentPage != 1) {
      setCurrentPage(1);
    } else {
      setCurrentPage(0);
      setTimeout(() => setCurrentPage(1), 0);
    }
  };

  const HandleCreateTask = async () => {
    const userData = await getLoggedUserId();

    if (!fromDate || !toDate) {
      Swal.fire({
        title: "Warning",
        text: "Please select From Date and To Date.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    setIsCreatingTask(true);

    try {
      const response = await Task_for_Download_Incidents(
        status1,
        status2,
        fromDate,
        toDate,
        // accountNo,
        userData
      );
      if (response && response.message === "Task created successfully") {
        Swal.fire({
          title: "Success",
          text: `Task created successfully!`,
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

  const HandleAddIncident = () => navigate("/incident/register");

  if (isLoading) {
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
          <h1 className={GlobalStyle.headingLarge}>Incident </h1>

          <div className="flex justify-end mt-6">
            <button
              onClick={HandleAddIncident}
              className={`${GlobalStyle.buttonPrimary} flex items-center`}
            >
              <FaPlus className="mr-2" />
              Add Incident
            </button>
          </div>

          {/* Filters Section */}
          <div className={`${GlobalStyle.cardContainer} w-full mt-6`}>
            <div className="flex flex-wrap xl:flex-nowrap items-center justify-end w-full space-x-3">
              <div className="flex items-center">
                <select
                  value={status1}
                  onChange={(e) => setStatus1(e.target.value)}
                  className={`${GlobalStyle.selectBox}`}
                  style={{ color: status1 === "" ? "gray" : "black" }}
                >
                  <option value="" hidden>
                    Action Type
                  </option>
                  <option value="collect arrears" style={{ color: "black" }}>
                    collect arrears
                  </option>
                  <option
                    value="collect arrears and CPE"
                    style={{ color: "black" }}
                  >
                    collect arrears and CPE
                  </option>
                  <option value="collect CPE" style={{ color: "black" }}>
                    collect CPE
                  </option>
                </select>
              </div>

              <div className="flex items-center">
                <select
                  value={status2}
                  onChange={(e) => setStatus2(e.target.value)}
                  className={`${GlobalStyle.selectBox}`}
                  style={{ color: status2 === "" ? "gray" : "black" }}
                >
                  <option value="" hidden>
                    Status
                  </option>
                  <option value="Incident Open" style={{ color: "black" }}>
                    Incident Open
                  </option>
                  <option value="Complete" style={{ color: "black" }}>
                    Complete
                  </option>
                  <option value="Incident Error" style={{ color: "black" }}>
                    Incident Error
                  </option>
                  <option
                    value="Incident InProgress"
                    style={{ color: "black" }}
                  >
                    Incident InProgress
                  </option>
                </select>
              </div>

              <div className="flex items-center">
                <select
                  value={status3}
                  onChange={(e) => setStatus3(e.target.value)}
                  className={`${GlobalStyle.selectBox}`}
                  style={{ color: status3 === "" ? "gray" : "black" }}
                >
                  <option value="" hidden>
                    Source Type
                  </option>
                  <option value="Pilot Suspended" style={{ color: "black" }}>
                    Pilot Suspended
                  </option>
                  <option value="Product Terminate" style={{ color: "black" }}>
                    Product Terminate
                  </option>
                  <option value="Special" style={{ color: "black" }}>
                    Special
                  </option>
                </select>
              </div>

              {/* NEW: Account Number Input Field */}
              <div className="flex items-center">
                <input
                  type="text"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  placeholder="Account Number"
                  className={`${GlobalStyle.inputText} w-full sm:w-auto`}
                  style={{ minWidth: "150px" }}
                />
              </div>

              <label className={GlobalStyle.dataPickerDate}>Date</label>
              <DatePicker
                selected={fromDate}
                onChange={handlestartdatechange}
                dateFormat="dd/MM/yyyy"
                placeholderText="From"
                className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              />
              <DatePicker
                selected={toDate}
                onChange={handleenddatechange}
                dateFormat="dd/MM/yyyy"
                placeholderText="To"
                className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              />

              {["admin", "superadmin", "slt"].includes(userRole) && (
                <button
                  className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`}
                  onClick={handleFilterButton}
                >
                  Filter
                </button>
              )}
              {["admin", "superadmin", "slt"].includes(userRole) && (
                <button
                  className={`${GlobalStyle.buttonRemove} w-full sm:w-auto`}
                  onClick={handleClear}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-4 flex justify-start mt-10">
            <div className={GlobalStyle.searchBarContainer}>
              <input
                type="text"
                className={GlobalStyle.inputSearch}
                value={searchQuery}
                onChange={(e) => {
                  setCurrentPage(1); // Reset to page 1 on search
                  setSearchQuery(e.target.value);
                }}
              />
              <FaSearch className={GlobalStyle.searchBarIcon} />
            </div>
          </div>

          {/* Table */}
          <div
            className={`${GlobalStyle.tableContainer} mt-10 overflow-x-auto`}
          >
            <table className={GlobalStyle.table}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th className={GlobalStyle.tableHeader}>ID</th>
                  <th className={GlobalStyle.tableHeader}>Status</th>
                  <th className={GlobalStyle.tableHeader}>Account No</th>
                  <th className={GlobalStyle.tableHeader}>Action</th>
                  <th className={GlobalStyle.tableHeader}>Source Type</th>
                  <th className={GlobalStyle.tableHeader}>Created DTM</th>
                </tr>
              </thead>

              <tbody>
                {filteredDataBySearch && filteredDataBySearch.length > 0 ? (
                  filteredDataBySearch
                    .slice(startIndex, startIndex + rowsPerPage)
                    .map((row, index) => (
                      <tr
                        key={row.incidentID || index}
                        className={
                          index % 2 === 0
                            ? GlobalStyle.tableRowEven
                            : GlobalStyle.tableRowOdd
                        }
                      >
                        <td className={GlobalStyle.tableData}>
                          {row.Incident_Id || ""}
                        </td>
                        <td
                          className={`${GlobalStyle.tableData} flex justify-center`}
                        >
                          {renderStatusIcon(row.Incident_Status, index)}
                        </td>
                        <td className={GlobalStyle.tableData}>
                          {row.Account_Num || ""}
                        </td>
                        <td className={GlobalStyle.tableData}>
                          {row.Actions || ""}
                        </td>
                        <td className={GlobalStyle.tableData}>
                          {row.Source_Type || ""}
                        </td>
                        <td className={GlobalStyle.tableData}>
                          {new Date(row.Created_Dtm).toLocaleString("en-GB", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }) || ""}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className={`${GlobalStyle.tableData} text-center`}
                    >
                      No cases available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          {/* {filteredDataBySearch.length > 0 && (
            <div className={GlobalStyle.navButtonContainer}>
              <button
                onClick={() => handlePrevNext("prev")}
                disabled={currentPage <= 1}
                className={`${GlobalStyle.navButton} ${
                  currentPage <= 1 ? "cursor-not-allowed" : ""
                }`}
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
                    ? currentPage >=
                      Math.ceil(filteredDataBySearch.length / rowsPerPage)
                    : !isMoreDataAvailable &&
                      currentPage >=
                        Math.ceil(filteredData.length / rowsPerPage)
                }
                className={`${GlobalStyle.navButton} ${
                  (
                    searchQuery
                      ? currentPage >=
                        Math.ceil(filteredDataBySearch.length / rowsPerPage)
                      : !isMoreDataAvailable &&
                        currentPage >=
                          Math.ceil(filteredData.length / rowsPerPage)
                  )
                    ? "cursor-not-allowed"
                    : ""
                }`}
              >
                <FaArrowRight />
              </button>
            </div>
          )} */}
          {filteredDataBySearch.length > 0 && (
            <div className={GlobalStyle.navButtonContainer}>
              <button
                onClick={() => handlePrevNext("prev")}
                disabled={currentPage <= 1}
                className={`${GlobalStyle.navButton} ${
                  currentPage <= 1 ? "cursor-not-allowed" : ""
                }`}
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
                    ? currentPage >=
                      Math.ceil(filteredDataBySearch.length / rowsPerPage)
                    : !isMoreDataAvailable &&
                      currentPage >=
                        Math.ceil(filteredData.length / rowsPerPage)
                }
                className={`${GlobalStyle.navButton} ${
                  (
                    searchQuery
                      ? currentPage >=
                        Math.ceil(filteredDataBySearch.length / rowsPerPage)
                      : !isMoreDataAvailable &&
                        currentPage >=
                          Math.ceil(filteredData.length / rowsPerPage)
                  )
                    ? "cursor-not-allowed"
                    : ""
                }`}
              >
                <FaArrowRight />
              </button>
            </div>
          )}

          {/* Create Task Button */}
          {["admin", "superadmin", "slt"].includes(userRole) &&
            filteredDataBySearch.length > 0 && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={HandleCreateTask}
                  className={`${GlobalStyle.buttonPrimary} flex items-center ${
                    isCreatingTask ? "opacity-50" : ""
                  }`}
                  disabled={isCreatingTask}
                >
                  {!isCreatingTask && (
                    <FaDownload style={{ marginRight: "8px" }} />
                  )}
                  {isCreatingTask
                    ? "Creating Tasks..."
                    : "Create task and let me know"}
                </button>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default Incident;
