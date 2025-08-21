 /* 
Purpose: Abundant Incident Log View
Created Date: 2025.08.07
Created By: sadinsa


Version: React v18
ui number : 1.7.4
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS
*/

import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import Incident_Reject from "../../assets/images/incidents/Incident_Reject.png";
import {List_Abundant_Incident } from "../../services/distribution/distributionService";
import {Create_Rejected_List_for_Download} from "../../services/task/taskIncidentService";

const AbundantIncidentlog = () => {
  const navigate = useNavigate();
 
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [actionType, setActionType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const rowsPerPage = 10;

  const [filteredData, setFilteredData] = useState([]);

  const [committedFilters, setCommittedFilters] = useState({
    actionType: "",
    fromDate: null,
    toDate: null,
  });

  const hasMounted = useRef(false);

  // Role-Based Access
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

  const renderStatusIcon = (status, index) => {
    const tooltipId = `tooltip-${index}`;

    return (
      <div className="flex items-center gap-2">
        <img
          src={Incident_Reject}
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

  const handleFromDateChange = (date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date) => {
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
      } else {
        checkDateDifference(fromDate, toDate);
      }
    }
  }, [fromDate, toDate]);

  const checkDateDifference = (fromDate, toDate) => {
    const start = new Date(fromDate).getTime();
    const end = new Date(toDate).getTime();
    const diffInMs = end - start;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const diffInMonths = diffInDays / 30;

    if (diffInMonths > 1) {
      Swal.fire({
        title: "Date Range Exceeded",
        text: "The selected dates have more than a 1-month gap. Do you want to proceed?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#28a745",
        cancelButtonText: "No",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
         
        } else {
          setToDate(null);
        }
      });
    }
  };

  const filterValidations = () => {
    if (!actionType && !fromDate && !toDate) {
      Swal.fire({
        title: "Warning",
        text: "No filter is selected. Please, select a filter.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f",
      });
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
      return false;
    }

    return true;
  };

  const fetchData = async (filters) => {
    try {
      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split("T")[0];
      };

      const payload = {
        Actions: filters.actionType,
        from_date: formatDate(filters.fromDate),
        to_date: formatDate(filters.toDate),
        pages: filters.page,
      };

      setIsLoading(true);
      const response = await List_Abundant_Incident(payload);
      setIsLoading(false);

      if (response && response.data) {
        const formattedData = response.data.map((incident) => ({
          id: incident.incidentID,
          status: incident.status,
          account_no: incident.accountNo,
          filtered_reason: incident.filtered_reason,
          Proceed_Dtm:incident.Proceed_Dtm,
          drc_commision_rule: incident.drc_commision_rule,
          Arrears: incident.Arrears,
          action: incident.action,
          source_type: incident.sourceType,
          created_dtm: incident.created_dtm,
        }));

        if (filters.page === 1) {
          setFilteredData(formattedData);
        } else {
          setFilteredData((prevData) => {
         
            const existingIds = new Set(prevData.map((item) => item.id));
            const newData = formattedData.filter((item) => !existingIds.has(item.id));
            return [...prevData, ...newData];
          });
        }

        if (response.data.length === 0) {
          setIsMoreDataAvailable(false);
          if (filters.page === 1) {
            Swal.fire({
              title: "No Results",
              text: "No matching data found for the selected filters.",
              icon: "warning",
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonColor: "#f1c40f",
            });
          } else if (filters.page === 2) {
            setCurrentPage(1);
          }
        } else {
          const maxData = filters.page === 1 ? 10 : 30;
          if (response.data.length < maxData) {
            setIsMoreDataAvailable(false);
          } else {
            setIsMoreDataAvailable(true);
          }
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "No valid incident data found in response.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching rejected incidents:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch data. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      setFilteredData([]);
    } finally {
      setIsLoading(false);
    }
  };

  
  useEffect(() => {
    if (currentPage < 1) return;
    fetchData({
      ...committedFilters,
      page: currentPage,
    });
  }, [currentPage, committedFilters]);

  const handleFilterButton = () => {
    if (!filterValidations()) return;

    setIsMoreDataAvailable(true);
    setMaxCurrentPage(0);
    setCommittedFilters({
      actionType,
      fromDate,
      toDate,
    });
    setFilteredData([]);
    setCurrentPage(1);  
  };

  const handleClear = () => {
    setActionType("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setFilteredData([]);
    setMaxCurrentPage(0);
    setIsMoreDataAvailable(true);
    setCommittedFilters({
      actionType: "",
      fromDate: null,
      toDate: null,
    });
    setCurrentPage(1); 
  };

  const handleCreateTaskForDownload = async () => {
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
      const response = await Create_Rejected_List_for_Download({
        Actions: actionType,
        from_date: fromDate,
        to_date: toDate,
      });

      if (response && response.status === 201) {
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

  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (
      direction === "next" &&
      (isMoreDataAvailable || currentPage < Math.ceil(filteredData.length / rowsPerPage))
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const filteredDataBySearch = filteredData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredDataBySearch.slice(startIndex, endIndex);

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
          <h1 className={GlobalStyle.headingLarge}>Abundant Incident Log</h1>

          {/* Filters Section */}
          <div className={`${GlobalStyle.cardContainer} w-full mt-6`}>
            <div className="flex flex-wrap xl:flex-nowrap items-center justify-end w-full space-x-3">
              <div className="flex items-center">
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className={`${GlobalStyle.selectBox}`}
                  style={{ color: actionType === "" ? "gray" : "black" }}
                >
                  <option value="" hidden>
                    Action Type
                  </option>
                  <option value="collect arrears" style={{ color: "black" }}>
                    Collect Arrears
                  </option>
                  <option value="collect arrears and CPE" style={{ color: "black" }}>
                    Collect Arrears and CPE
                  </option>
                  <option value="collect CPE" style={{ color: "black" }}>
                    Collect CPE
                  </option>
                </select>
              </div>

              <label className={GlobalStyle.dataPickerDate}>Date</label>
              <DatePicker
                selected={fromDate}
                onChange={handleFromDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="From"
                className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              />
              <DatePicker
                selected={toDate}
                onChange={handleToDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="To"
                className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              />

              {["admin", "superadmin", "slt"].includes(userRole) && (
                <>
                  <button
                    className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`}
                    onClick={handleFilterButton}
                  >
                    Filter
                  </button>

                  <button
                    className={`${GlobalStyle.buttonRemove} w-full sm:w-auto`}
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
                value={searchQuery}
                onChange={(e) => {
                  setCurrentPage(1);
                  setSearchQuery(e.target.value);
                }}
                // placeholder="Search..."
              />
              <FaSearch className={GlobalStyle.searchBarIcon} />
            </div>
          </div>

          {/* Table */}
          <div className={`${GlobalStyle.tableContainer} mt-10 overflow-x-auto`}>
            <table className={GlobalStyle.table}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th className={GlobalStyle.tableHeader}>ID</th>
                  <th className={GlobalStyle.tableHeader}>Status</th>
                  
                  <th className={GlobalStyle.tableHeader}>Service Type</th>
                  <th  className={GlobalStyle.tableHeader}>
                      Filtered Reason
                    </th>
                    <th  className={GlobalStyle.tableHeader}>
                      Reject On
                    </th>
                  <th className={GlobalStyle.tableHeader}>Account No</th>
                  <th className={GlobalStyle.tableHeader}>Amount</th>
                  {/* <th className={GlobalStyle.tableHeader}>Action</th> */}
                  <th className={GlobalStyle.tableHeader}>Source Type</th>
                  <th className={GlobalStyle.tableHeader}>Created DTM</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => (
                    <tr
                      key={row.id || index}
                      className={
                        index % 2 === 0
                          ? GlobalStyle.tableRowEven
                          : GlobalStyle.tableRowOdd
                      }
                    >
                      <td className={GlobalStyle.tableData}>{row.id}</td>
                      <td className={`${GlobalStyle.tableData} flex justify-center`}>
                        {renderStatusIcon(row.status, index)}
                      </td>
                      <td className={GlobalStyle.tableData}>{row.drc_commision_rule}</td>
                      <td className={GlobalStyle.tableData}>
                        {row.filtered_reason}
                      </td>
                      <td className={GlobalStyle.tableData}>
                       
                          {row.Proceed_Dtm
                          ? new Date(row.Proceed_Dtm).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : ""}
                      </td>
                     
                      <td className={GlobalStyle.tableData}>{row.account_no}</td>
                      <td className={GlobalStyle.tableCurrency}>
  {typeof row.Arrears === 'number'
    ? row.Arrears.toLocaleString("en-LK", {
        // style: "currency",
        // currency: "LKR",
      })
    : ""}
</td>
                      {/* <td className={GlobalStyle.tableData}>{row.action}</td> */}
                      <td className={GlobalStyle.tableData}>{row.source_type}</td>
                      <td className={GlobalStyle.tableData}>
                        {row.created_dtm
                          ? new Date(row.created_dtm).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className={`${GlobalStyle.tableData} text-center`}>
                      No abundant incidents available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
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
                    ? currentPage >=
                      Math.ceil(filteredDataBySearch.length / rowsPerPage)
                    : !isMoreDataAvailable &&
                      currentPage >= Math.ceil(filteredData.length / rowsPerPage)
                }
                className={`${GlobalStyle.navButton}`}
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
                  onClick={handleCreateTaskForDownload}
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

export default AbundantIncidentlog;
