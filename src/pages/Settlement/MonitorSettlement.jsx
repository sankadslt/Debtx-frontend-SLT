/*Purpose: This template is used for the 7.5 Sup - Monitor Settlemnt page.
Created Date: 2025-12-03
Created By: Susinidu Sachinthana (susinidusachinthana@gmail.com)
Last Modified Date: 2025-12-03
Modified Date: 2025-12-03
Modified By: Susinidu Sachinthana, Chamath Jayasanka
Modified Date: 2025-05-14
Modified By: Janani Kumarasiri (jkktg001@gmail.com)
Version: node 22
ui number : 7.5
Dependencies: tailwind css
Related Files:
Notes:  */

import { useState, useEffect, useRef } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import more from "../../assets/images/imagefor1.a.13(one).png";
import { listAllSettlementCases } from "../../services/settlement/SettlementServices";
import Swal from 'sweetalert2';
import { Tooltip } from "react-tooltip";
import { Create_Task_For_Downloard_Settlement_List } from "../../services/settlement/SettlementServices";
import { getLoggedUserId } from "../../services/auth/authService";
import RO_Settle_Pending from "/src/assets/images/Settlement/RO_Settle_Pending.png";
import RO_Settle_Open_Pending from "/src/assets/images/Settlement/RO_Settle_Open_Pending.png";
import RO_Settle_Active from "/src/assets/images/Settlement/RO_Settle_Active.png";
import MB_Settle_Pending from "/src/assets/images/Settlement/MB Settle Pending.png";
import MB_Settle_Open_Pending from "/src/assets/images/Settlement/MB Settle Open Pending.png"
import MB_Settle_Active from "/src/assets/images/Settlement/MB Settle Active.png";
import Litigation_Settle_Pending from "/src/assets/images/Settlement/Litigation Settle Pending.png";
import Litigation_Settle_Open_Pending from "/src/assets/images/Settlement/Litigation Settle Open-Pending.png";
import Litigation_Settle_Active from "/src/assets/images/Settlement/Litigation Settle Active.png";
import LOD_Settle_Active from "/src/assets/images/Settlement/LOD_Settle_Active.png";
import LOD_Settle_Pending from "/src/assets/images/Settlement/LOD_Settle_Pending.png";
import LOD_Settle_Open_Pending from "/src/assets/images/Settlement/LOD_Settle_Open_Pending.png";
import WRIT_Settle_Pending from "/src/assets/images/Settlement/WRIT_Settle_Pending.png";
import WRIT_Settle_Open_Pending from "/src/assets/images/Settlement/WRIT_Settle_Open-Pending.png";
import WRIT_Settle_Active from "/src/assets/images/Settlement/WRIT_Settle_Active.png";
import Dispute_Settle_Pending from "/src/assets/images/Settlement/Dispute_Settle_Pending.png";
import Dispute_Settle_Open_Pending from "/src/assets/images/Settlement/Dispute_Settle_Open_Pending.png";
import Dispute_Settle_Active from "/src/assets/images/Settlement/Dispute_Settle_Active.png";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

const Monitor_settlement = () => {
  // State Variables
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [caseId, setCaseId] = useState("");
  const [status, setStatus] = useState("");
  const [phase, setPhase] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [searchBy, setSearchBy] = useState("case_id"); // Default search by case ID
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false); // State to track task creation status
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  // const [totalAPIPages, setTotalAPIPages] = useState(1);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true); // State to track if more data is available
  const rowsPerPage = 10; // Number of rows per page

  // variables need for table
  // const maxPages = Math.ceil(filteredDataBySearch.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const hasMounted = useRef(false);
  const [committedFilters, setCommittedFilters] = useState({
    caseId: "",
    accountNo: "",
    phase: "",
    status: "",
    fromDate: null,
    toDate: null
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
  const getStatusIcon = (phase, status) => {
    switch (phase?.toLowerCase()) {
      case "negotiation":
        switch (status?.toLowerCase()) {
          case "pending":
            return RO_Settle_Pending;
          case "open_pending":
            return RO_Settle_Open_Pending;
          case "active":
            return RO_Settle_Active;
          default:
            return null;
        }
      case "mediation board":
        switch (status?.toLowerCase()) {
          case "pending":
            return MB_Settle_Pending;
          case "open_pending":
            return MB_Settle_Open_Pending;
          case "active":
            return MB_Settle_Active;
          default:
            return null;
        }
      case "litigation":
        switch (status?.toLowerCase()) {
          case "pending":
            return Litigation_Settle_Pending;
          case "open_pending":
            return Litigation_Settle_Open_Pending;
          case "active":
            return Litigation_Settle_Active;
          default:
            return null;
        }
      case "lod":
        switch (status?.toLowerCase()) {
          case "pending":
            return LOD_Settle_Pending;
          case "open_pending":
            return LOD_Settle_Open_Pending;
          case "active":
            return LOD_Settle_Active;
          default:
            return null;
        }
      case "writ":
        switch (status?.toLowerCase()) {
          case "pending":
            return WRIT_Settle_Pending;
          case "open_pending":
            return WRIT_Settle_Open_Pending;
          case "active":
            return WRIT_Settle_Active;
          default:
            return null;
        }
      case "dispute":
        switch (status?.toLowerCase()) {
          case "pending":
            return Dispute_Settle_Pending;
          case "open_pending":
            return Dispute_Settle_Open_Pending;
          case "active":
            return Dispute_Settle_Active;
          default:
            return null;
        }
      default:
        return null;
    }
  };

  // render status icon with tooltip
  const renderStatusIcon = (phase, status, index) => {
    const iconPath = getStatusIcon(phase, status);

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
          {`${phase} Settle ${status}`} {/* Tooltip text is the phase and status */}
        </Tooltip>
      </div>
    );
  };

  const navigate = useNavigate();

  const handlestartdatechange = (date) => {
    setFromDate(date);
    // if (toDate) checkdatediffrence(date, toDate);
  };

  const handleenddatechange = (date) => {
    setToDate(date);
    // if (fromDate) checkdatediffrence(fromDate, date);
  };

  // Check the difference between two dates
  // If the difference is more than 1 month, show a warning
  // const checkdatediffrence = (startDate, endDate) => {
  //   const start = new Date(startDate).getTime();
  //   const end = new Date(endDate).getTime();
  //   const diffInMs = end - start;
  //   const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  //   const diffInMonths = diffInDays / 30;

  //   if (diffInMonths > 1) {
  //     Swal.fire({
  //       title: "Date Range Exceeded",
  //       text: "The selected dates shouldn't have more than a 1-month gap.",
  //       icon: "warning",
  //       confirmButtonColor: "#f1c40f"
  //     })
  //     setToDate(null);
  //     setFromDate(null);
  //     return;
  //   }
  // };

  // Check if toDate is greater than fromDate
  useEffect(() => {
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      Swal.fire({
        title: "Warning",
        text: "To date should be greater than or equal to From date",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f"
      });
      setToDate(null);
      setFromDate(null);
      return;
    }
  }, [fromDate, toDate]);

  // Search Section
  const filteredDataBySearch = filteredData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Validate case ID input preventing non-numeric characters
  const validateCaseId = () => {
    if (searchBy === "case_id" && !/^\d*$/.test(caseId)) {
      Swal.fire({
        title: "Warning",
        text: "Invalid input. Only numbers are allowed for Case ID.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f"
      });
      setCaseId(""); // Clear the invalid input
      return;
    }
  }

  useEffect(() => {
    validateCaseId(); // Validate case ID input
  }, [caseId]);

  // Validate filters before calling the API
  const filterValidations = () => {
    if (!caseId && !phase && !status && !fromDate && !toDate && !accountNo) {
      Swal.fire({
        title: "Warning",
        text: "No filter is selected. Please, select a filter.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f"
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
        confirmButtonColor: "#f1c40f"
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
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split('T')[0];
      };

      console.log(currentPage);

      // const payload = {
      //   case_id: caseId,
      //   account_no: accountNo,
      //   settlement_phase: phase,
      //   settlement_status: status,
      //   from_date: formatDate(fromDate),
      //   to_date: formatDate(toDate),
      //   pages: currentPage,
      // };
      const payload = {
        case_id: filters.caseId,
        account_no: filters.accountNo,
        settlement_phase: filters.phase,
        settlement_status: filters.status,
        from_date: formatDate(filters.fromDate),
        to_date: formatDate(filters.toDate),
        pages: filters.page,
      };
      console.log("Payload sent to API: ", payload);

      setIsLoading(true); // Set loading state to true
      const response = await listAllSettlementCases(payload);
      setIsLoading(false); // Set loading state to false

      // Updated response handling
      if (response && response.data) {
        // console.log("Valid data received:", response.data);
        if (currentPage === 1) {
          setFilteredData(response.data)
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
              confirmButtonColor: "#f1c40f"
            });
          } else if (currentPage === 2) {
            setCurrentPage(1); // Reset to page 1 if no data found on page 2
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
          text: "No valid Settlement data found in response.",
          icon: "error",
          confirmButtonColor: "#d33"
        });
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  }

  useEffect(() => {
    if (isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage); // Update max current page
      // callAPI(); // Call the function whenever currentPage changes
      callAPI({
        ...committedFilters,
        page: currentPage
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

  // Handle Filter Button click
  const handleFilterButton = () => {
    setIsMoreDataAvailable(true); // Reset more data available state
    setTotalPages(0); // Reset total pages
    setMaxCurrentPage(0); // Reset max current page
    const isValid = filterValidations(); // Validate filters before applying
    if (!isValid) {
      return; // If validation fails, do not proceed
    } else {
      setCommittedFilters({
        caseId,
        accountNo,
        phase,
        status,
        fromDate,
        toDate
      });
      setFilteredData([]); // Clear previous results
      if (currentPage === 1) {
        // callAPI();
        callAPI({
          caseId,
          accountNo,
          phase,
          status,
          fromDate,
          toDate,
          page: 1
        });
      } else {
        setCurrentPage(1);
      }
    }
  }

  // Handle Clear Button click
  const handleClear = () => {
    setCaseId("");
    setAccountNo("");
    setPhase("");
    setStatus("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setTotalPages(0); // Reset total pages
    setFilteredData([]); // Clear filtered data
    setMaxCurrentPage(0); // Reset max current page
    setIsMoreDataAvailable(true); // Reset more data available state
    // Clear committed filters
    setCommittedFilters({
      caseId: "",
      accountNo: "",
      phase: "",
      status: "",
      fromDate: null,
      toDate: null
    });
    if (currentPage != 1) {
      setCurrentPage(1); // Reset to page 1
    } else {
      setCurrentPage(0); // Temp set to 0
      setTimeout(() => setCurrentPage(1), 0); // Reset to 1 after
    }
  };

  // Function to navigate to the settlement details page
  const naviPreview = (caseId, settlementID) => {
    navigate("/lod/ftl-log/preview", { state: { caseId, settlementID } });
  };

  // Function to navigate to the case ID page
  const naviCaseID = (caseId) => {
    navigate("/Incident/Case_Details", { state: { CaseID: caseId } });
  }

  // Function to handle the creation of tasks for downloading settlement list
  const HandleCreateTaskDownloadSettlementList = async () => {

    const userData = await getLoggedUserId(); // Assign user ID

    if (!fromDate || !toDate) {
      Swal.fire({
        title: "Warning",
        text: "Please select From Date and To Date.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f"
      });
      return;
    }

    setIsCreatingTask(true);
    try {
      const response = await Create_Task_For_Downloard_Settlement_List(userData, phase, status, fromDate, toDate, caseId, accountNo);
      if (response === "success") {
        Swal.fire({
          title: response,
          text: `Task created successfully!`,
          icon: "success",
          confirmButtonColor: "#28a745"
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to create task.",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    } finally {
      setIsCreatingTask(false);
    }
  };

  useEffect(() => {
    setAccountNo("");
    setCaseId("");
  }, [searchBy]);


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
          <h1 className={GlobalStyle.headingLarge}>Settlement List</h1>

          {/* Filters Section */}
          <div className={`${GlobalStyle.cardContainer} w-full mt-6`}>
            <div className="flex flex-wrap  xl:flex-nowrap items-center justify-end w-full space-x-3">

              <div className="flex items-center">
                <select
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                  className={`${GlobalStyle.selectBox}`}
                  style={{ color: searchBy === "" ? "gray" : "black" }}
                >
                  <option value="" hidden >Select</option>
                  <option value="account_no" style={{ color: "black" }}>Account Number</option>
                  <option value="case_id" style={{ color: "black" }}>Case ID</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="text"
                  value={searchBy === "case_id" ? caseId : accountNo}
                  onChange={(e) =>
                    searchBy === "case_id"
                      ? setCaseId(e.target.value)
                      : setAccountNo(e.target.value)
                  }
                  className={`${GlobalStyle.inputText}  w-40`}
                  placeholder={searchBy === "case_id" ? "Case ID" : "Account Number"}
                />
              </div>

              <div className="flex items-center">
                <select
                  value={phase}
                  onChange={(e) => setPhase(e.target.value)}
                  className={`${GlobalStyle.selectBox}`}
                  style={{ color: phase === "" ? "gray" : "black" }}
                >
                  <option value="" hidden>Phase</option>
                  <option value="Negotiation" style={{ color: "black" }}>Negotiation</option>
                  <option value="Mediation Board" style={{ color: "black" }}>Mediation Board</option>
                  <option value="Litigation" style={{ color: "black" }}>Litigation</option>
                  <option value="LOD" style={{ color: "black" }}>LOD</option>
                  <option value="WRIT" style={{ color: "black" }}>WRIT</option>
                  <option value="Dispute" style={{ color: "black" }}>Dispute</option>
                </select>
              </div>

              <div className="flex items-center">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`${GlobalStyle.selectBox}`}
                  style={{ color: status === "" ? "gray" : "black" }}
                >
                  <option value="" hidden>Status</option>
                  <option value="Pending" style={{ color: "black" }}>Pending</option>
                  <option value="Open_Pending" style={{ color: "black" }}>Open Pending</option>
                  <option value="Active" style={{ color: "black" }}>Active</option>
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
                  setSearchQuery(e.target.value)
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
                  <th className={GlobalStyle.tableHeader}>Settlement ID</th>
                  <th className={GlobalStyle.tableHeader}>Settlement Phase</th>
                  <th className={GlobalStyle.tableHeader}>Created DTM</th>
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
                        {item.case_id || "N/A"}
                      </td>
                      <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>
                        {renderStatusIcon(item.settlement_phase, item.settlement_status, index)}
                      </td>
                      <td className={GlobalStyle.tableData}>{item.settlement_id || "N/A"}</td>
                      <td className={GlobalStyle.tableData}> {item.settlement_phase || "N/A"} </td>
                      <td className={GlobalStyle.tableData}>{new Date(item.created_dtm).toLocaleDateString("en-GB") || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>
                        <img
                          src={more}
                          onClick={() => naviPreview(item.case_id, item.settlement_id)}

                          data-tooltip-id="tooltip-more"
                          className="w-5 h-5 cursor-pointer"
                        />
                        <Tooltip id="tooltip-more" place="bottom" effect="solid">
                          More Details
                        </Tooltip>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className={`${GlobalStyle.tableData} text-center`}>No cases available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Section */}
          {filteredDataBySearch.length > 0 && (<div className={GlobalStyle.navButtonContainer}>
            <button
              onClick={() => handlePrevNext("prev")}
              disabled={currentPage <= 1}
              className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed" : ""}`}
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
                  : !isMoreDataAvailable && currentPage >= Math.ceil(filteredData.length / rowsPerPage
                  )}
              className={`${GlobalStyle.navButton} ${(searchQuery
                  ? currentPage >= Math.ceil(filteredDataBySearch.length / rowsPerPage)
                  : !isMoreDataAvailable && currentPage >= Math.ceil(filteredData.length / rowsPerPage))
                  ? "cursor-not-allowed"
                  : ""
                }`}
            >
              <FaArrowRight />
            </button>
          </div>)}

          {["admin", "superadmin", "slt"].includes(userRole) && filteredDataBySearch.length > 0 && (
            <button
              onClick={HandleCreateTaskDownloadSettlementList}
              className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? 'opacity-50' : ''}`}
              disabled={isCreatingTask}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {!isCreatingTask && <FaDownload style={{ marginRight: '8px' }} />}
              {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'}
            </button>
          )}
        </main>
      </div>
    </div>
  );
};

export default Monitor_settlement;
