/*Purpose:
Created Date: 2025-04-09
Created By: Janani Kumarasiri (jkktg001@gmail.com)
Last Modified Date: 
Modified By: 
Last Modified Date: 
Modified By: 
Version: React v18
ui number : 3.8
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
import { listAllLODHoldlist } from "../../services/LOD/LOD";
import Swal from "sweetalert2";
import { Create_Task_For_Downloard_Settlement_List } from "../../services/settlement/SettlementServices";
import { getLoggedUserId } from "../../services/auth/authService";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

import { List_Final_Reminder_Lod_Cases } from "../../services/LOD/LOD.js";

const Final_Reminder_LOD_Hold_List = () => {
  // State Variables
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [caseId, setCaseId] = useState("");
  const [lodtype, setLodtype] = useState("");
  const [searchBy, setSearchBy] = useState("case_id"); // Default search by case ID
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false); // State to track task creation status
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons

  const [activeWithdrawPopupLODID, setActiveWithdrawPopupLODID] =
    useState(null);
  const [WithdrawRemark, setWithdrawRemark] = useState("");

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
    lodtype: "",
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

  const navigate = useNavigate();

  const handlestartdatechange = (date) => {
    setFromDate(date);
    // if (toDate) checkdatediffrence(date, toDate); /////
  };

  const handleenddatechange = (date) => {
    setToDate(date);
    // if (fromDate) checkdatediffrence(fromDate, date); /////
  };

  // Check the difference between two dates
  // If the difference is more than 1 month, show a warning
  //   const checkdatediffrence = (startDate, endDate) => {
  //     const start = new Date(startDate).getTime();
  //     const end = new Date(endDate).getTime();
  //     const diffInMs = end - start;
  //     const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  //     const diffInMonths = diffInDays / 30;

  //     if (diffInMonths > 1) {
  //       Swal.fire({
  //         title: "Date Range Exceeded",
  //         text: "The selected dates shouldn't have more than a 1-month gap.",
  //         icon: "warning",
  //         confirmButtonColor: "#f1c40f",
  //       });
  //       setToDate(null);
  //       setFromDate(null);
  //       return;
  //     }
  //   };

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

  // Search Section
  //   const filteredDataBySearch = paginatedData.filter(
  //     (row) =>
  //       String(row.case_id).toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       String(row.status).toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       String(row.lod_type).toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       String(row.hold_by).toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       String(row.date).toLowerCase().includes(searchQuery.toLowerCase())
  //   );

  // handle search
  const filteredDataBySearch = filteredData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  //   // Validate case ID input preventing non-numeric characters
  //   const validateCaseId = () => {
  //     if (searchBy === "case_id" && !/^\d*$/.test(caseId)) {
  //       Swal.fire({
  //         title: "Warning",
  //         text: "Invalid input. Only numbers are allowed for Case ID.",
  //         icon: "warning",
  //         allowOutsideClick: false,
  //         allowEscapeKey: false,
  //         confirmButtonColor: "#f1c40f",
  //       });
  //       setCaseId(""); // Clear the invalid input
  //       return;
  //     }
  //   };

  //   useEffect(() => {
  //     validateCaseId(); // Validate case ID input
  //   }, [caseId]);

  // Validate filters before calling the API
  const filterValidations = () => {
    if (!fromDate && !toDate && !lodtype) {
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

      const payload = {
        LODtype: filters.lodtype,
        from_date: formatDate(filters.fromDate),
        to_date: formatDate(filters.toDate),
        pages: filters.currentPage,
      };
      console.log("Payload sent to API: ", payload);

      setIsLoading(true); // Set loading state to true
      const response = await listAllLODHoldlist(payload);
      setIsLoading(false); // Set loading state to false

      // Updated response handling
      if (response && response.data) {
        // console.log("Valid data received:", response.data);

        if (currentPage === 1) {
          setFilteredData(response.data); // Set initial data for page 1
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
          text: "No valid LD Holdlist data found in response.",
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
      setMaxCurrentPage(currentPage); // Update max current page
      // callAPI(); // Call the function whenever currentPage changes
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
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        setTotalPages(totalPages);
        if (currentPage < totalPages) {
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
        lodtype,
        fromDate,
        toDate,
      });
      setFilteredData([]);
      if (currentPage === 1) {
        callAPI({
          lodtype,
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
    setLodtype("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setTotalPages(0); // Reset total pages
    setFilteredData([]); // Clear filtered data
    setMaxCurrentPage(0); // Reset max current page
    setIsMoreDataAvailable(true); // Reset more data available state
    setCommittedFilters({
      lodtype: "",
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

  //   // Function to navigate to the settlement details page
  //   const naviPreview = (caseId, settlementID) => {
  //     navigate("/lod/ftl-log/preview", { state: { caseId, settlementID } });
  //   };

  // Function to navigate to the case ID page
  const naviCaseID = (caseId) => {
    navigate("/Incident/Case_Details", { state: { CaseID: caseId } });
  };

  // Function to handle the creation of tasks for downloading settlement list
  //   const HandleCreateTaskDownloadSettlementList = async () => {
  //     const userData = await getLoggedUserId(); // Assign user ID

  //     if (!fromDate || !toDate) {
  //       Swal.fire({
  //         title: "Warning",
  //         text: "Please select From Date and To Date.",
  //         icon: "warning",
  //         allowOutsideClick: false,
  //         allowEscapeKey: false,
  //         confirmButtonColor: "#f1c40f",
  //       });
  //       return;
  //     }

  //     setIsCreatingTask(true);
  //     // setStatus("MB Negotiaion");
  //     try {
  //       const response = await Create_Task_For_Downloard_Settlement_List(
  //         userData,
  //         fromDate,
  //         lodtype,
  //         toDate,
  //         caseId
  //       );
  //       if (response === "success") {
  //         Swal.fire({
  //           title: response,
  //           text: `Task created successfully!`,
  //           icon: "success",
  //           confirmButtonColor: "#28a745",
  //         });
  //       }
  //     } catch (error) {
  //       Swal.fire({
  //         title: "Error",
  //         text: error.message || "Failed to create task.",
  //         icon: "error",
  //         confirmButtonColor: "#d33",
  //       });
  //     } finally {
  //       setIsCreatingTask(false);
  //     }
  //   };

  // display loading animation when data is loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleWithdrawPopup = (LODID) => {
    setActiveWithdrawPopupLODID(LODID);
    setWithdrawRemark("");
  };

  const closeWithdrawPopup = () => {
    setActiveWithdrawPopupLODID(null);
  };

  const handleWithdraw = () => {
    if (!WithdrawRemark.trim()) {
      Swal.fire("Error", "Please enter a remark for the withdraw.", "error");
      return;
    }

    closeWithdrawPopup();
  };

  const WithdrawFinalReminderLOD = async () => {
    if (!activeWithdrawPopupLODID) {
      Swal.fire("Error", "Please select a LOD or Final Reminder.", "error");
      return;
    }

    const userData = await getLoggedUserId(); // Assign user ID
  };

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <div className="flex flex-col flex-1">
        <main className="p-6">
          <h1 className={GlobalStyle.headingLarge}>
            Letter Of Demand Hold List
          </h1>

          {/* Filters Section */}
          <div className={`${GlobalStyle.cardContainer} w-full mt-6`}>
            <div className="flex flex-wrap  xl:flex-nowrap items-center justify-end w-full space-x-3">
              <div className="flex items-center">
                <select
                  value={lodtype}
                  onChange={(e) => setLodtype(e.target.value)}
                  style={{ color: lodtype === "" ? "gray" : "black" }}
                  className={GlobalStyle.selectBox}
                >
                  <option value="" hidden>
                    LOD Type
                  </option>
                  <option value="LOD">LOD</option>
                  <option value="Final Reminder">Final Reminder</option>
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  <th className={GlobalStyle.tableHeader}>Case No.</th>
                  <th className={GlobalStyle.tableHeader}>Status</th>
                  <th className={GlobalStyle.tableHeader}>LOD Type</th>
                  <th className={GlobalStyle.tableHeader}>Hold by</th>
                  <th className={GlobalStyle.tableHeader}>Hold DTM</th>
                  <th className={GlobalStyle.tableHeader}></th>
                </tr>
              </thead>

              <tbody>
                {filteredDataBySearch && filteredDataBySearch.length > 0 ? (
                  filteredDataBySearch.slice(startIndex, endIndex).map((item, index) => (
                    <tr
                      key={item.settlement_id || index}
                      className={
                        index % 2 === 0
                          ? GlobalStyle.tableRowEven
                          : GlobalStyle.tableRowOdd
                      }
                    >
                      <td
                        className={`${GlobalStyle.tableData}  text-black hover:underline cursor-pointer`}
                        onClick={() => naviCaseID(item.case_id)}
                      >
                        {item.case_id || ""}
                      </td>

                      <td className={GlobalStyle.tableData}>
                        {" "}
                        {item.status || ""}{" "}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {" "}
                        {item.lod_type || ""}{" "}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {" "}
                        {item.hold_by || ""}{" "}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {new Date(item.date).toLocaleDateString("en-GB") ||
                          ""}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {["admin", "superadmin", "slt"].includes(userRole) && (
                          <div className="flex flex-row gap-2">
                            <button
                              className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`}
                            // onClick={}
                            >
                              Proceed
                            </button>
                            <button
                              className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`}
                              onClick={() => handleWithdrawPopup(item.case_id)}
                            >
                              Withdraw
                            </button>
                          </div>
                        )}
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

          {activeWithdrawPopupLODID && (
            <div className={GlobalStyle.popupBoxContainer}>
              <div className={GlobalStyle.popupBoxBody}>
                <div className={GlobalStyle.popupBox}>
                  <h2 className={GlobalStyle.popupBoxTitle}>Withdraw Case</h2>
                  <button
                    className={GlobalStyle.popupBoxCloseButton}
                    onClick={() => closeWithdrawPopup()}
                  >
                    ×
                  </button>
                </div>
                <div>
                  <div className="mb-6">
                    <label className={GlobalStyle.remarkTopic}>Remark</label>
                    <textarea
                      value={WithdrawRemark}
                      onChange={(e) => setWithdrawRemark(e.target.value)}
                      className={`${GlobalStyle.remark} w-full`}
                      rows="5"
                    ></textarea>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleWithdraw}
                      className={`${GlobalStyle.buttonPrimary} mr-4`}
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pagination Section */}
          {filteredDataBySearch.length > 0 && (
            <div className={GlobalStyle.navButtonContainer}>
              <button
                onClick={() => handlePrevNext("prev")}
                disabled={currentPage <= 1}
                className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed" : ""
                  }`}
              >
                <FaArrowLeft />
              </button>
              <span className={`${GlobalStyle.pageIndicator} mx-4`}>
                Page {currentPage}
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
          )}

          {["admin", "superadmin", "slt"].includes(userRole) &&
            filteredDataBySearch.length > 0 && (
              <button
                // onClick={HandleCreateTaskDownloadSettlementList}
                className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? "opacity-50" : ""
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
            )}
        </main>
      </div>
    </div>
  );
};

export default Final_Reminder_LOD_Hold_List;
