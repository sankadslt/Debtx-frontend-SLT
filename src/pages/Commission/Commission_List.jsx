/*Purpose: This template is used for the SLT Commission List1 (8.1).
Created Date: 2025-03-13
Created By: U.H.Nandali Linara (nadalilinara5@gmail.com)
Modified By : Lasandi Randini (randini-im20057@stu.kln.ac.lk)
Last Modified Date: 2025-03-14
Version: node 11
ui number :8.1
Dependencies: tailwind css
Related Files:  router.js.js (routes) */

import { useState, useEffect, useRef } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa";
import { List_All_Commission_Cases } from "../../services/commission/commissionService";
import { commission_type_cases_count } from "../../services/commission/commissionService";
import { Active_DRC_Details } from "../../services/drc/Drc";
import { Create_task_for_Download_Commision_Case_List } from "../../services/commission/commissionService";
import { getLoggedUserId } from "../../services/auth/authService";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

const Commission_List = () => {
  const [selectValue, setSelectValue] = useState("Account No");
  const [inputFilter, setInputFilter] = useState("");
  const [phase, setPhase] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [drcNames, setDrcNames] = useState([]);
  const [selectedDrcId, setSelectedDrcId] = useState("");
  const [commissionCounts, setCommissionCounts] = useState({
    totalCount: 0,
    pendingCount: 0,
    unresolvedCount: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [dateError, setDateError] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [commissionType, setCommissionType] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [caseId, setCaseId] = useState("");
  const [searchBy, setSearchBy] = useState("case_id");
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons
  const hasMounted = useRef(false);
  const [committedFilters, setCommittedFilters] = useState({
    caseId: "",
    accountNo: "",
    commissionType: "",
    selectedDrcId: "",
    fromDate: null,
    toDate: null
  });

  const rowsPerPage = 10;

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

    const fetchDrcNames = async () => {
      try {
        const names = await Active_DRC_Details();

        setDrcNames(names);
      } catch (error) {
        // console.error("Error fetching DRC names:", error);
        setDrcNames([]);
      }
    };
    // fetchData();
    setFilteredData(data);
    fetchDrcNames();
    fetchCommissionCounts();
  }, []);

  // Fetch commission counts on component mount
  const fetchCommissionCounts = async () => {
    try {
      const response = await commission_type_cases_count({});
      if (response) {
        // console.log("Commission counts:", response);
        setCommissionCounts(response);
      } else {
        console.error("Error fetching commission counts:", response);
      }
    } catch (error) {
      console.error("Error fetching commission counts:", error);
    }
  };

  // Function to validate filters before API call
  const filterValidations = () => {
    if (!caseId && !accountNo && !commissionType && !selectedDrcId && !fromDate && !toDate) {
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
  }

  // Function to call the API with the selected filters
  const CallAPI = async (filter) => {
    try {
      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split('T')[0];
      };

      const filters = {
        case_id: filter.caseId,
        From_DAT: formatDate(filter.fromDate),
        TO_DAT: formatDate(filter.toDate),
        Account_Num: filter.accountNo,
        DRC_ID: filter.selectedDrcId,
        Commission_Type: filter.commissionType,
        pages: filter.page,
      };
      console.log("Filters sent to api:", filters);

      setIsLoading(true);
      const response = await List_All_Commission_Cases(filters);

      if (response && response.data && response.status === "success") {
        console.log("Valid data received:", response.data);
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
              confirmButtonColor: "#f1c40f",
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
          confirmButtonColor: "#d33",
        });
        setFilteredData([]);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to fetch data.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleFromDateChange = (date) => {
    setFromDate(date);
    validateDates(date, toDate);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    validateDates(fromDate, date);
  };

  const validateDates = (from, to) => {
    if (from && to) {

      if (from > to) {
        Swal.fire({
          title: "Warning",
          text: "From date must be before to date",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#f1c40f",
        });
        setFromDate(null);
        setToDate(null);
        return false;
      }
    }
    return true;
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
        confirmButtonColor: "#f1c40f",
      });
      setCaseId(""); // Clear the invalid input
      return;
    }
  }

  useEffect(() => {
    validateCaseId(); // Validate case ID input
  }, [caseId]);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage); // Update max current page
      // CallAPI(); // Call the function whenever currentPage changes
      CallAPI({
        ...committedFilters,
        page: currentPage,
      })
    }
  }, [currentPage]);

  // Handle filter button click
  const handleFilterButton = () => { // Reset to the first page
    setIsMoreDataAvailable(true); // Reset more data available state
    setMaxCurrentPage(0); // Reset max current page
    setTotalPages(0); // Reset total pages
    // setTotalAPIPages(1); // Reset total API pages
    const isValid = filterValidations(); // Validate filters
    if (!isValid) {
      return; // If validation fails, do not proceed
    } else {
      setCommittedFilters({
        caseId,
        accountNo,
        commissionType,
        selectedDrcId,
        fromDate,
        toDate
      })
      setFilteredData([]); // Clear previous results
      if (currentPage === 1) {
        CallAPI({
          caseId,
          accountNo,
          commissionType,
          selectedDrcId,
          fromDate,
          toDate,
          page: 1
        });
      } else {
        setCurrentPage(1);
      }
    }
  }

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  // Search Section
  const filteredDataBySearch = paginatedData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleNextPage = () => {
    if (isMoreDataAvailable) {
      setCurrentPage(currentPage + 1);
    } else {
      const totalPages = Math.ceil(filteredData.length / rowsPerPage);
      setTotalPages(totalPages);
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Clear all filters and reset state
  const handleClear = () => {
    setCaseId("");
    setAccountNo("");
    setCommissionType("");
    setFromDate(null);
    setToDate(null);
    setSelectedDrcId("");
    setSearchQuery("");
    setTotalPages(0); // Reset total pages
    setFilteredData([]); // Clear filtered data
    setIsMoreDataAvailable(true); // Reset more data available state
    setMaxCurrentPage(0); // Reset max current page
    setCommittedFilters({
      caseId: "",
      accountNo: "",
      commissionType: "",
      selectedDrcId: "",
      fromDate: null,
      toDate: null
    })
    if (currentPage != 1) {
      setCurrentPage(1); // Reset to page 1
    } else {
      setCurrentPage(0); // Temp set to 0
      setTimeout(() => setCurrentPage(1), 0); // Reset to 1 after
    }
  };

  // Handle task creation for downloading commission case list
  const HandleCreateTaskDownloadCommissiontList = async () => {

    const userData = await getLoggedUserId(); // Assign user ID

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
      const response = await Create_task_for_Download_Commision_Case_List(userData, selectedDrcId, commissionType, fromDate, toDate, caseId, accountNo);
      if (response === "success") {
        Swal.fire({
          title: response,
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

  const navigate = useNavigate();

  const naviCaseID = (caseId) => {
    navigate("/Incident/Case_Details", { state: { CaseID: caseId } });
  }

  const naviPreview = (Commission_ID) => {
    navigate("/Commission/preview", { state: { Commission_ID } });
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
      <h1 className={GlobalStyle.headingLarge + " mb-6"}>Commission List</h1>

      <div
        className={`${GlobalStyle.miniCaseCountBar} mb-6 flex justify-center w-full `}
      >
        <div className={GlobalStyle.miniCountBarSubTopicContainer}>
          <div className={GlobalStyle.miniCountBarMainBox}>
            <span>Commission</span>
            <p className={GlobalStyle.miniCountBarMainTopic}>
              {" "}
              {commissionCounts.totalCount}
            </p>
          </div>
          <div className={GlobalStyle.miniCountBarMainBox}>
            <span>Pending :</span>
            <p className={GlobalStyle.miniCountBarMainTopic}>
              {" "}
              {commissionCounts.pendingCount}
            </p>
          </div>
          <div className={GlobalStyle.miniCountBarMainBox}>
            <span>Unresolved :</span>
            <p className={GlobalStyle.miniCountBarMainTopic}>
              {commissionCounts.unresolvedCount}
            </p>
          </div>
        </div>
      </div>
      {/* Filter Section */}
      <div className="flex justify-end">
        <div className={`${GlobalStyle.cardContainer} w-full`}>
          <div className="flex flex-wrap items-center justify-end w-full space-x-4 space-y-3">
            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className={`${GlobalStyle.selectBox} mt-3`}
              style={{ color: searchBy === "" ? "gray" : "black" }}
            >
              <option value="" hidden>select</option>
              <option value="Account No">Account No</option>
              <option value="case_id">Case ID</option>
            </select>

            <input
              type="text"
              value={searchBy === "case_id" ? caseId : accountNo}
              onChange={(e) =>
                searchBy === "case_id"
                  ? setCaseId(e.target.value)
                  : setAccountNo(e.target.value)
              }
              className={GlobalStyle.inputText}
              placeholder={searchBy === "case_id" ? "Case ID" : "Account Number"}
            />

            <select
              value={commissionType}
              onChange={(e) => setCommissionType(e.target.value)}
              className={GlobalStyle.selectBox}
              style={{ color: commissionType === "" ? "gray" : "black" }}
            >
              <option value="" hidden>Commission Type</option>
              <option value="Commissioned" style={{ color: "black" }}>Commissioned</option>
              <option value="Unresolved Commission" style={{ color: "black" }}>Unresolved Commission</option>
              <option value="Pending Commission" style={{ color: "black" }}>Pending Commission</option>
            </select>

            <select
              value={selectedDrcId}
              onChange={(e) => setSelectedDrcId(e.target.value)}
              className={GlobalStyle.selectBox}
              style={{ color: selectedDrcId === "" ? "gray" : "black" }}
            >
              <option value="" hidden>Select DRC</option>
              {drcNames.length > 0 ? (drcNames.map((drc) => (
                <option key={drc.key} value={drc.id.toString()} style={{ color: "black" }}>
                  {drc.value}
                </option>
              ))
              ) : (
                <option value="" disabled style={{ color: "gray" }}>No DRCs available</option>
              )}
            </select>

            <div className="flex flex-wrap items-center justify-end space-x-3 w-full mt-2">
              <label className={GlobalStyle.dataPickerDate}>Date</label>
              {/* <div className="flex items-center space-x-2"> */}
              {/* <div className="flex items-center"> */}
              <DatePicker
                selected={fromDate}
                onChange={handleFromDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="From"
                className={GlobalStyle.inputText}
              />
              {/* </div> */}

              {/* <div className="flex items-center"> */}
              <DatePicker
                selected={toDate}
                onChange={handleToDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="To"
                className={GlobalStyle.inputText}
              />
              {/* </div> */}
              {/* </div> */}

              {["admin", "superadmin", "slt"].includes(userRole) && (
                <button
                  className={GlobalStyle.buttonPrimary}
                  onClick={handleFilterButton}
                >
                  Filter
                </button>
              )}
              {["admin", "superadmin", "slt"].includes(userRole) && (<button
                className={GlobalStyle.buttonRemove}
                onClick={handleClear}
              >
                Clear
              </button>)}
            </div>
            {dateError && (
              <div className="text-red-500 text-sm mt-1">{dateError}</div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center">
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

      <div className={`${GlobalStyle.tableContainer}  overflow-x-auto`}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Commission Status</th>
              <th className={GlobalStyle.tableHeader}>DRC</th>
              <th className={GlobalStyle.tableHeader}>Commission Amount (LKR)</th>
              <th className={GlobalStyle.tableHeader}>Commission Type</th>
              <th className={GlobalStyle.tableHeader}>Commission Action</th>
              <th className={GlobalStyle.tableHeader}>Created Date</th>
              <th className={GlobalStyle.tableHeader}></th>
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
                  <td
                    className={`${GlobalStyle.tableData}  text-black hover:underline cursor-pointer`}
                    onClick={() => naviCaseID(row.Case_ID)}
                  >
                    {row.Case_ID}
                  </td>
                  <td className={GlobalStyle.tableData}>{row.Commission_Status}</td>
                  <td className={GlobalStyle.tableData}>{row.DRC_Name}</td>
                  <td className={GlobalStyle.tableCurrency}>{row.Commission_Amount}</td>
                  <td className={GlobalStyle.tableData}>{row.Commission_Type}</td>
                  <td className={GlobalStyle.tableData}>{row.Commission_Action}</td>
                  <td className={GlobalStyle.tableData}>
                    {row.Created_On &&
                      new Date(row.Created_On).toLocaleString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        // hour: "2-digit",
                        // minute: "2-digit",
                        // second: "2-digit",
                        hour12: true,
                      })}
                  </td>
                  <td className={GlobalStyle.tableData + " text-center"}>
                    <button
                      className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => naviPreview(row.Commission_ID)}
                      data-tooltip-id="preview-tooltip"
                    >
                      ⋯
                    </button>
                    <Tooltip id="preview-tooltip" place="bottom" effect="solid">
                      More Details
                    </Tooltip>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className={GlobalStyle.tableData + " text-center"}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {
        filteredData.length != 0 && (
          <div className={GlobalStyle.navButtonContainer}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed" : ""}`}
            >
              <FaArrowLeft />
            </button>
            <span>
              Page {currentPage}
            </span>
            <button
              className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""}`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <FaArrowRight />
            </button>
          </div>
        )
      }
      <div className="flex justify-between mt-4">
        <div style={{ visibility: filteredDataBySearch.length > 0 ? "visible" : "hidden" }}>
          {["admin", "superadmin", "slt"].includes(userRole) && (
            <button
              onClick={HandleCreateTaskDownloadCommissiontList}
              className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? 'opacity-50' : ''}`}
              disabled={isCreatingTask}
              style={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}
            >
              {!isCreatingTask && <FaDownload style={{ marginRight: '8px' }} />}
              {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'}
            </button>
          )}
        </div>

        {["admin", "superadmin", "slt"].includes(userRole) && (
          <button
            // onClick={HandleCreateTaskDownloadCommissiontList}
            // className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? 'opacity-50' : ''}`}
            className={GlobalStyle.buttonPrimary}
            // disabled={isCreatingTask}
            style={{ display: 'flex', alignItems: 'center', marginTop: '16px' }}
          >
            {/* {!isCreatingTask && <FaDownload style={{ marginRight: '8px' }} />}
            {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'} */}
            Forward for Approval
          </button>
        )}
      </div>
    </div >
  );
};

export default Commission_List;
