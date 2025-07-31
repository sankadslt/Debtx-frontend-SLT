/*Purpose:
Created Date: 2025-07-02
Created By: Sathmi Peiris (sathmipeiris@gmail.com)
Last Modified Date: 2025-07-09
Modified By: 
Last Modified Date: 
Modified By: 
Version: React v18
ui number : 
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useState, useEffect, useRef } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import {
  FaSearch,
  FaArrowLeft,
  FaArrowRight,
  FaDownload,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import { Create_Task_For_Downloard_Settlement_List } from "../../services/settlement/SettlementServices";
import { getLoggedUserId } from "../../services/auth/authService";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";
import { List_All_Tasks } from "../../services/task/taskService.js";
import { Tooltip } from "react-tooltip";

import Task_List_In_Progress from "/src/assets/images/Status Icons/In_Progress.png";
import Task_List_Open from "/src/assets/images/Status Icons/Open.png";
import Task_List_Success from "/src/assets/images/Status Icons/Success.png";

const ListAllTasks = () => {
  // State Variables
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  //   const [caseId, setCaseId] = useState("");
  const [taskstatus, setTaskstatus] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false); // State to track task creation status
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true); // State to track if more data is available
  const rowsPerPage = 10; // Number of rows per page

  // variables need for table

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const hasMounted = useRef(false);
  const [committedFilters, setCommittedFilters] = useState({
    taskstatus: "",
    fromDate: null,
    toDate: null,
  });

  // Role-Based Buttons
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

  // return Icon based on settlement status and settlement phase
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return Task_List_Open;
      case "complete":
        return Task_List_Success;
      case "success":
      return Task_List_Success;
      case "inprogress":
        return Task_List_In_Progress;
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
          data-tooltip-id={tooltipId} // Add tooltip ID to image
        />
        {/* Tooltip component */}
        <Tooltip id={tooltipId} place="bottom" effect="solid">
          {` ${status}`} {/* Tooltip text is status */}
        </Tooltip>
      </div>
    );
  };

  // const navigate = useNavigate();

  const handlestartdatechange = (date) => {
    setFromDate(date);
    // if (toDate) checkdatediffrence(date, toDate); /////
  };

  const handleenddatechange = (date) => {
    setToDate(date);
    // if (fromDate) checkdatediffrence(fromDate, date); /////
  };

  // Check if toDate is greater than fromDate
  useEffect(() => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      Swal.fire({
        title: "Warning",
        text: "To date should be greater than or equal to From date",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "# 28a745",
      });
      setToDate(null);
      setFromDate(null);
      return;
    }
  }, [fromDate, toDate]);

  // handle search
  const filteredDataBySearch = filteredData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Validate filters before calling the API
  const filterValidations = () => {
    if (!fromDate && !toDate && !taskstatus) {
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

    return true; // All validations passed
  };

  // Function to call the API and fetch filtered data
  const callAPI = async (filters) => {
    try {
      // Format the date to 'YYYY-MM-DD' format
      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        );
        return offsetDate.toISOString().split("T")[0];
      };

      console.log(currentPage);

      // Fetch user ID
      const userId = await getLoggedUserId();
      if (!userId) {
        Swal.fire("Error", "User not authenticated. Please log in.", "error");
        return;
      }

      const payload = {
        task_status: filters.taskstatus,
        logged_in_user: userId,
        from_date: formatDate(filters.fromDate),
        to_date: formatDate(filters.toDate),
        pages: filters.currentPage,
      };
      console.log("Payload sent to API: ", payload);

      setIsLoading(true); // Set loading state to true
      const response = await List_All_Tasks(payload);
      setIsLoading(false); // Set loading state to false

      // Updated response handling
      if (response && response.data) {
        // console.log("Valid data received:", response.data);

        if (currentPage === 1) {
          setFilteredData(response.data);
        } else {
          setFilteredData((prevData) => [...prevData, ...response.data]);
        }
        if (response.data.length === 0) {
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
            setCurrentPage(1);
          }
        } else {
          const maxData = currentPage === 1 ? 10 : 30;
          if (response.data.length < maxData) {
            setIsMoreDataAvailable(false); // More data available
          }
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "No valid taskslist data found in response.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    if (isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage); // Update max currentpage

      callAPI({
        ...committedFilters,
        currentPage: currentPage,
      });
    }
  }, [currentPage]);

  // Handle Pagination
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

  // Handle Filter Button cl ick
  const handleFilterButton = () => {
    // setFilteredData([]); // Clear previous results
    setIsMoreDataAvailable(true); // Reset more data available state
    setTotalPages(0); // Reset total pages
    setMaxCurrentPage(0); // Reset max current page
    const isValid = filterValidations(); // Validate filters before applying
    if (!isValid) {
      return; // If validation fails, do not proceed
    } else {
      setCommittedFilters({
        taskstatus,
        fromDate,
        toDate,
      });
      setFilteredData([]);
      if (currentPage === 1) {
        callAPI({
          taskstatus,
          fromDate,
          toDate,
          currentPage: 1,
        });
      } else {
        setCurrentPage(1);
      }
    }
  };

  // Handle Clear Button click
  const handleClear = () => {
    setTaskstatus("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setTotalPages(0); // Reset total pages
    setFilteredData([]); // Clear filtered data
    setMaxCurrentPage(0); // Reset max current page
    setIsMoreDataAvailable(true); // Reset more data available state
    setCommittedFilters({
      taskstatus: "",
      fromDate: null,
      toDate: null,
    });
    if (currentPage != 1) {
      setCurrentPage(1); // Reset to page 1
    } else {
      setCurrentPage(0); // Temp set to 0
      setTimeout(() => setCurrentPage(1), 0); // Reset to 1 after
    }
  };

  // display loading animation when data is loading
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
          <h1 className={GlobalStyle.headingLarge}>Task List</h1>

          {/* Filters Section */}

          <div className={`${GlobalStyle.cardContainer} w-full mt-6`}>
            <div className="flex flex-wrap  xl:flex-nowrap items-center justify-end w-full space-x-3">
              <div className="flex items-center">
                <select
                  value={taskstatus}
                  onChange={(e) => setTaskstatus(e.target.value)}
                  style={{ color: taskstatus === "" ? "gray" : "black" }}
                  className={GlobalStyle.selectBox}
                >
                  <option value="" hidden>
                    Task Status
                  </option>
                  <option value="open">Open</option>
                  {/* <option value="error">Error</option> */}
                  <option value="inprogress">In Progress</option>
                  <option value="complete">Complete</option>
                </select>
              </div>

              <label className={GlobalStyle.dataPickerDate}>Date</label>
              {/* <div className={GlobalStyle.datePickerContainer}> */}
              {/* <div className="flex items-center space-x-2"> */}
              {/* <div className="flex items-center"> */}
              <DatePicker
                selected={fromDate}
                onChange={handlestartdatechange}
                dateFormat="dd/MM/yyyy"
                placeholderText="From"
                className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              />
              {/* </div> */}

              {/* <div className="flex items-center"> */}
              <DatePicker
                selected={toDate}
                onChange={handleenddatechange}
                dateFormat="dd/MM/yyyy"
                placeholderText="To"
                className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              />
              {/* </div> */}
              {/* </div> */}

              {["admin", "superadmin", "slt"].includes(userRole) && (
                <button
                  className={`${GlobalStyle.buttonPrimary}  w-full sm:w-auto`}
                  onClick={handleFilterButton}
                >
                  Filter
                </button>
              )}
              {["admin", "superadmin", "slt"].includes(userRole) && (
                <button
                  className={`${GlobalStyle.buttonRemove}  w-full sm:w-auto`}
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
                  <th className={GlobalStyle.tableHeader}>Task ID</th>
                  {/* <th className={GlobalStyle.tableHeader}>Template Task ID</th> */}
                  <th className={GlobalStyle.tableHeader}>Task Status</th>

                  <th className={GlobalStyle.tableHeader}>Task Type</th>
                  {/* <th className={GlobalStyle.tableHeader}>Task Status</th> */}
                  <th className={GlobalStyle.tableHeader}>Created By</th>
                  <th className={GlobalStyle.tableHeader}>Created Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredDataBySearch && filteredDataBySearch.length > 0 ? (
                  filteredDataBySearch
                    .slice(startIndex, endIndex)
                    .map((item, index) => (
                      <tr
                        key={item.task_id || index}
                        className={
                          index % 2 === 0
                            ? GlobalStyle.tableRowEven
                            : GlobalStyle.tableRowOdd
                        }
                      >
                        <td
                          className={`${GlobalStyle.tableData}  text-black hover:underline cursor-pointer`}
                          // onClick={() => naviCaseID(item.case_id)}
                        >
                          {item.task_id || "N/A"}
                        </td>

                        {/* <td className={GlobalStyle.tableData}>
                        {" "}
                        {item.template_task_id || "N/A"}{" "}
                      </td> */}
                        <td
                          className={`${GlobalStyle.tableData} flex justify-center items-center`}
                        >
                          {renderStatusIcon(item.task_status, index)}
                        </td>
                        <td className={GlobalStyle.tableData}>
                          {" "}
                          {item.task_type || "N/A"}{" "}
                        </td>

                        {/* <td className={GlobalStyle.tableData}>
                        {" "}
                        {item.task_status || "N/A"}{" "}
                      </td> */}
                        <td className={GlobalStyle.tableData}>
                          {" "}
                          {item.Created_By || "N/A"}{" "}
                        </td>
                        <td className={GlobalStyle.tableData}>
                          {new Date(item.created_dtm).toLocaleDateString(
                            "en-GB"
                          ) || "N/A"}
                          {/* ,{" "} */}
                          {/* {new Date(item.created_dtm)
                          .toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })
                          .toUpperCase()} */}
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

          {/* {["admin", "superadmin", "slt"].includes(userRole) &&
            filteredDataBySearch.length > 0 && (
              <button
                // onClick={HandleCreateTaskDownloadSettlementList}
                className={`${GlobalStyle.buttonPrimary} ${
                  isCreatingTask ? "opacity-50" : ""
                }`}
                disabled={isCreatingTask}
                style={{ display: "flex", alignItems: "center" }}
              >
                {!isCreatingTask && (
                  <FaDownload style={{ marginRight: "8px" }} />
                )}
                {isCreatingTask
                  ? "Creating Tasks..."
                  : "Create task and let me know"}
              </button>
            )} */}
        </main>
      </div>
    </div>
  );
};

export default ListAllTasks;
