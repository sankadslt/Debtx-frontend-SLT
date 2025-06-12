/*Purpose: This template is used for the 7.5 Sup - Monitor Settlemnt page.
Created Date: 2025-12-03
Created By: Susinidu Sachinthana (susinidusachinthana@gmail.com)
Last Modified Date: 2025-14-05
Modified Date: 2025-12-03
Modified By: Susinidu Sachinthana, Chamath Jayasanka
Modified Date: 2025-14-05
Modified By: Janani Kumarasiri
Version: node 22
ui number : 7.5
Dependencies: tailwind css
Related Files:
Notes:  */

import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import more from "../../assets/images/imagefor1.a.13(one).png";
import Swal from 'sweetalert2';
import { getLoggedUserId } from "../../services/auth/authService";
import { List_All_Payment_Cases } from "../../services/Transaction/Money_TransactionService";
import { Create_task_for_Download_Payment_Case_List } from "../../services/Transaction/Money_TransactionService";
import { Tooltip } from "react-tooltip";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

const PaymentDetails = () => {
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
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true); // State to track if more data is available
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const rowsPerPage = 10; // Number of rows per page

  // variables need for table
  // const maxPages = Math.ceil(filteredDataBySearch.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const navigate = useNavigate();

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

  const handlestartdatechange = (date) => {
    setFromDate(date);
    if (toDate) checkdatediffrence(date, toDate);
  };

  const handleenddatechange = (date) => {
    setToDate(date);
    if (fromDate) checkdatediffrence(fromDate, date);
  };

  // Function to check the difference between two dates
  const checkdatediffrence = (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffInMs = end - start;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const diffInMonths = diffInDays / 30;

    if (diffInMonths > 1) {
      Swal.fire({
        title: "Date Range Exceeded",
        text: "The selected dates shouldn't have more than a 1-month gap.",
        icon: "warning",
        confirmButtonColor: "#f1c40f"
      })
      setToDate(null);
      setFromDate(null);
      return;
    }
  };

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
  const filteredDataBySearch = paginatedData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  //Fetching data from API
  const handleFilter = async () => {
    try {
      // Format the date to 'YYYY-MM-DD' format
      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split('T')[0];
      };

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
        return;
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
        return;
      }

      console.log(currentPage);

      const payload = {
        case_id: caseId,
        account_num: accountNo,
        settlement_phase: phase,
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
        pages: currentPage,
      };
      console.log("Payload sent to API: ", payload);

      setIsLoading(true); // Set loading state to true
      const response = await List_All_Payment_Cases(payload).catch((error) => {
        if (error.response && error.response.status === 404) {
          Swal.fire({
            title: "No Results",
            text: "No matching data found for the selected filters.",
            icon: "warning",
            allowOutsideClick: false,
            allowEscapeKey: false,
            confirmButtonColor: "#f1c40f"
          });
          setFilteredData([]);
          return null;
        } else {
          throw error;
        }
      });
      setIsLoading(false); // Set loading state to false

      // Updated response handling
      if (response && response.data) {
        // console.log("Valid data received:", response.data);

        setFilteredData((prevData) => [...prevData, ...response.data]);

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
          }
        } else {
          const maxData = currentPage === 1 ? 10 : 30;
          if (response.data.length < maxData) {
            setIsMoreDataAvailable(false); // More data available
          }
        }

        // setFilteredData(response.data.data);
      } else {
        console.error("No valid Settlement data found in response:", response);
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
    }
  };

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

  // Validate case ID input whenever it changes
  useEffect(() => {
    validateCaseId(); // Validate case ID input
  }, [caseId]);

  // Fetch data when the component mounts
  useEffect(() => {
    if (isFilterApplied && isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage); // Update max current page
      handleFilter(); // Call the function whenever currentPage changes
    }
  }, [currentPage]);

  // handle page change and filter data
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      // console.log("Current Page:", currentPage);
    } else if (direction === "next") {
      // setCurrentPage(currentPage + 1);
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

  // handle filter button click
  const handleFilterButton = () => { // Reset to the first page
    setFilteredData([]); // Clear previous results
    setMaxCurrentPage(0); // Reset max current page
    setIsMoreDataAvailable(true); // Reset more data available state
    setTotalPages(0); // Reset total pages
    // setTotalAPIPages(1); // Reset total API pages
    if (currentPage === 1) {
      handleFilter();
    } else {
      setCurrentPage(1);
    }
    setIsFilterApplied(true); // Set filter applied state to true
  }

  const handleClear = () => {
    setCaseId("");
    setAccountNo("");
    setPhase("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setCurrentPage(0); // Reset to the first page
    setIsFilterApplied(false); // Reset filter applied state
    setTotalPages(0); // Reset total pages
    setFilteredData([]); // Clear filtered data
    setIsMoreDataAvailable(true); // Reset more data available state
    setMaxCurrentPage(0); // Reset max current page
    // setTotalAPIPages(1); // Reset total API pages
  };

  const naviPreview = (caseId, moneyTransactionID) => {
    // console.log("caseId", caseId);
    // console.log("moneyTransactionID", moneyTransactionID);
    navigate("/pages/Money_Transaction/payment/preview", { state: { caseId, moneyTransactionID } });
  };

  const naviCaseID = (caseId) => {
    navigate("/Incident/Case_Details", { state: { CaseID: caseId } });
  }

  // Function to handle the creation of tasks for downloading settlement list
  const HandleCreateTaskDownloadPaymentList = async () => {

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
      const response = await Create_task_for_Download_Payment_Case_List(userData, phase, fromDate, toDate, caseId, accountNo);
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
          <h1 className={GlobalStyle.headingLarge}>Payment Details</h1>

          {/* Filters Section */}
          <div className={`${GlobalStyle.cardContainer} w-full`}>
            <div className="flex flex-wrap  xl:flex-nowrap items-center justify-end w-full space-x-3">

              <div className="flex items-center">
                <select
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value)}
                  className={`${GlobalStyle.selectBox}`}
                  style={{ color: searchBy === "" ? "gray" : "black" }}
                >
                  <option value="" hidden>Select</option>
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
                  <option value="" hidden>Select Phase</option>
                  <option value="Register" style={{ color: "black" }}>Register</option>
                  <option value="Distribution" style={{ color: "black" }}>Distribution</option>
                  <option value="Negotiation" style={{ color: "black" }}>Negotiation</option>
                  <option value="Mediation Board" style={{ color: "black" }}>Mediation Board</option>
                  <option value="Letter Of Demand" style={{ color: "black" }}>Letter Of Demand</option>
                  <option value="Litigation" style={{ color: "black" }}>Litigation</option>
                  <option value="Dispute" style={{ color: "black" }}>Dispute</option>
                  <option value="WRIT" style={{ color: "black" }}>WRIT</option>
                </select>
              </div>

              <label className={GlobalStyle.dataPickerDate} style={{ whiteSpace: "nowrap" }}>Paid Date :</label>
              {/* <div className={GlobalStyle.datePickerContainer}> */}
              {/* <div className="flex items-center space-x-2">
                <div className="flex items-center"> */}
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
              {/* </div>
              </div> */}

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
          <div className={`${GlobalStyle.tableContainer} mt-10 overflow-x-auto`}>
            <table className={GlobalStyle.table}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th className={GlobalStyle.tableHeader}>Case ID</th>
                  <th className={GlobalStyle.tableHeader}>Account No.</th>
                  <th className={GlobalStyle.tableHeader}>Settlement ID</th>
                  <th className={GlobalStyle.tableHeader}>Amount (LKR)</th>
                  <th className={GlobalStyle.tableHeader}>Type</th>
                  <th className={GlobalStyle.tableHeader}>Phase </th>
                  <th className={GlobalStyle.tableHeader}>Settled Balance (LKR)</th>
                  <th className={GlobalStyle.tableHeader}>Paid DTM</th>
                  <th className={GlobalStyle.tableHeader}></th>
                </tr>
              </thead>

              <tbody>
                {filteredDataBySearch && filteredDataBySearch.length > 0 ? (
                  filteredDataBySearch.map((item, index) => (
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
                        onClick={() => naviCaseID(item.Case_ID)}
                      >
                        {item.Case_ID || "N/A"}
                      </td>
                      <td className={GlobalStyle.tableData}>{item.Account_No || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>{item.Settlement_ID || "N/A"}</td>
                      <td className={GlobalStyle.tableCurrency}>{item.Money_Transaction_Amount}</td>
                      <td className={GlobalStyle.tableData}>{item.Transaction_Type || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>{item.Settlement_Phase || "N/A"}</td>
                      <td className={GlobalStyle.tableCurrency}>{item.Cummulative_Settled_Balance}</td>
                      <td className={GlobalStyle.tableData}>
                        {item.Money_Transaction_Date &&
                          new Date(item.Money_Transaction_Date).toLocaleString("en-GB", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                          })}
                      </td>
                      <td className={GlobalStyle.tableData}>
                        <img
                          src={more}
                          onClick={() => naviPreview(item.Case_ID, item.Money_Transaction_ID)}
                          data-tooltip-id="my-tooltip"
                          className="w-5 h-5 cursor-pointer"

                        />
                        <Tooltip id="my-tooltip" place="bottom" effect="solid">
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
          </div>)}

          {["admin", "superadmin", "slt"].includes(userRole) && filteredDataBySearch.length > 0 && (
            <button
              onClick={HandleCreateTaskDownloadPaymentList}
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

export default PaymentDetails;
