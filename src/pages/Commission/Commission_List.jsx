/*Purpose: This template is used for the SLT Commission List1 (8.1).
Created Date: 2025-03-13
Created By: U.H.Nandali Linara (nadalilinara5@gmail.com)
Modified By : Lasandi Randini (randini-im20057@stu.kln.ac.lk)
Last Modified Date: 2025-03-14
Version: node 11
ui number :8.1
Dependencies: tailwind css
Related Files:  router.js.js (routes) */

import { useState, useEffect } from "react";
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
  const [currentPage, setCurrentPage] = useState(0);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [dateError, setDateError] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [commissionType, setCommissionType] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [caseId, setCaseId] = useState("");
  const [searchBy, setSearchBy] = useState("case_id");
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons

  const rowsPerPage = 10;
  // useEffect(() => {
  //   const fetchDrcNames = async () => {
  //     try {
  //       const names = await Active_DRC_Details();

  //       setDrcNames(names);
  //     } catch (error) {
  //       console.error("Error fetching DRC names:", error);
  //     }
  //   };
  //   // fetchData();
  //   setFilteredData(data);
  //   fetchDrcNames();
  //   fetchCommissionCounts();
  // }, []);

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
        console.error("Error fetching DRC names:", error);
      }
    };
    // fetchData();
    setFilteredData(data);
    fetchDrcNames();
    fetchCommissionCounts();
  }, []);

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

  const fetchData = async () => {
    try {

      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split('T')[0];
      };

      if (!caseId && !accountNo && !commissionType && !selectedDrcId && !fromDate && !toDate) {
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

      const filters = {
        case_id: caseId,
        From_DAT: formatDate(fromDate),
        TO_DAT: formatDate(toDate),
        Account_Num: accountNo,
        DRC_ID: selectedDrcId,
        Commission_Type: commissionType,
        pages: currentPage,
      };
      console.log("Filters sent to api:", filters);

      setIsLoading(true);
      const response = await List_All_Commission_Cases(filters);

      if (response && response.data && response.status === "success") {
        console.log("Valid data received:", response.data);
        // console.log(response.data.pagination.pages);
        // const totalPages = Math.ceil(response.data.pagination.total / rowsPerPage);
        // setTotalPages(totalPages);
        // setTotalAPIPages(response.data.pagination.pages); // Set the total pages from the API response
        // Append the new data to the existing data
        setFilteredData((prevData) => [...prevData, ...response.data]);
        if (response.data.length === 0) {
          setIsMoreDataAvailable(false); // No more data available
          if (currentPage === 1) {
            Swal.fire({
              title: "No Results",
              text: "No matching data found for the selected filters.",
              icon: "warning",
              allowOutsideClick: false,
              allowEscapeKey: false
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
        Swal.fire({
          title: "Error",
          text: "No valid Settlement data found in response.",
          icon: "error"
        });
        setFilteredData([]);
      }

      // setCommissionCounts(
      //   response?.counts || {
      //     total: 0,
      //     commissioned: 0,
      //     unresolvedCommission: 0,
      //   }
      // );
      // console.log(response.counts);
      // setData(response.data);
      // setFilteredData(response.data);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to fetch data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

      if (from >= to) {
        Swal.fire({
          title: "Warning",
          text: "From date must be before to date",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
        });
        setFromDate(null);
        setToDate(null);
        return false;
      }
      const oneMonthLater = new Date(from);
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

      if (to > oneMonthLater) {
        Swal.fire({
          title: "Warning",
          text: "Date range cannot exceed one month",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
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
      });
      setCaseId(""); // Clear the invalid input
      return;
    }
  }

  useEffect(() => {
    validateCaseId(); // Validate case ID input
  }, [caseId]);

  // const handleFilterClick = () => {
  //   // if (fromDate && toDate && !validateDates(fromDate, toDate)) {
  //   //   return;
  //   // }

  //   const selectedDrcIdMapped = selectedDrcId
  //     ? parseInt(selectedDrcId, 10)
  //     : null;

  //   let filtered = data.filter((row) => {
  //     let matchesSearch = true;
  //     let matchesPhase = true;
  //     let matchesDate = true;

  //     if (inputFilter.trim() !== "") {
  //       if (selectValue === "Case ID") {
  //         const caseIdFilter = parseInt(inputFilter, 10);
  //         matchesSearch = row.case_id === caseIdFilter;
  //       } else if (selectValue === "Account No") {
  //         matchesSearch =
  //           row.account_no &&
  //           row.account_no.toLowerCase().includes(inputFilter.toLowerCase());
  //       }
  //     }

  //     if (selectedDrcIdMapped !== null) {
  //       matchesPhase = row.drc_id === selectedDrcIdMapped;
  //     }

  //     const rowDate = new Date(row.created_on);
  //     if (fromDate && rowDate < fromDate) matchesDate = false;
  //     if (toDate && rowDate > toDate) matchesDate = false;

  //     return matchesSearch && matchesPhase && matchesDate;
  //   });

  //   setFilteredData(filtered);
  //   setCurrentPage(0);
  // };

  useEffect(() => {
    if (isFilterApplied && isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage); // Update max current page
      fetchData(); // Call the function whenever currentPage changes
    }
  }, [currentPage]);

  const handleFilterButton = () => { // Reset to the first page
    setFilteredData([]); // Clear previous results
    setIsMoreDataAvailable(true); // Reset more data available state
    setMaxCurrentPage(0); // Reset max current page
    // setTotalAPIPages(1); // Reset total API pages
    if (currentPage === 1) {
      fetchData();
    } else {
      setCurrentPage(1);
    }
    setIsFilterApplied(true); // Set filter applied state to true
  }

  // const getSearchedData = () => {
  //   if (!searchQuery.trim()) return filteredData;

  //   return filteredData.filter((row) =>
  //     Object.values(row).some((value) =>
  //       value.toString().toLowerCase().includes(searchQuery.toLowerCase())
  //     )
  //   );
  // };

  // const pages = Math.ceil(getSearchedData().length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  // const currentData = getSearchedData().slice(startIndex, startIndex + rowsPerPage);
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);
  // console.log("Filtered data:", filteredData);

  // console.log("Paginated data:", paginatedData);

  // Search Section
  const filteredDataBySearch = paginatedData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleNextPage = () => {
    // if (currentPage < pages - 1) {
    //   setCurrentPage(currentPage + 1);
    // }
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

  const handleClear = () => {
    setCaseId("");
    setAccountNo("");
    setCommissionType("");
    setFromDate(null);
    setToDate(null);
    setSelectedDrcId("");
    setSearchQuery("");
    setCurrentPage(0); // Reset to the first page
    setIsFilterApplied(false); // Reset filter applied state
    setTotalPages(0); // Reset total pages
    setFilteredData([]); // Clear filtered data
  };

  const HandleCreateTaskDownloadCommissiontList = async () => {

    const userData = await getLoggedUserId(); // Assign user ID

    if (!fromDate || !toDate) {
      Swal.fire({
        title: "Warning",
        text: "Please select From Date and To Date.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false
      });
      return;
    }

    // if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
    //   Swal.fire({
    //     title: "Warning",
    //     text: "To date should be greater than or equal to From date",
    //     icon: "warning",
    //     allowOutsideClick: false,
    //     allowEscapeKey: false
    //   });
    //   setToDate(null);
    //   setFromDate(null);
    //   return;
    // }

    // if (searchBy === "case_id" && !/^\d*$/.test(caseId)) {
    //   Swal.fire({
    //     title: "Warning",
    //     text: "Invalid input. Only numbers are allowed for Case ID.",
    //     icon: "warning",
    //     allowOutsideClick: false,
    //     allowEscapeKey: false,
    //   });
    //   setCaseId(""); // Clear the invalid input
    //   return;
    // }

    setIsCreatingTask(true);
    try {
      const response = await Create_task_for_Download_Commision_Case_List(userData, selectedDrcId, commissionType, fromDate, toDate, caseId, accountNo);
      if (response === "success") {
        Swal.fire(response, `Task created successfully!`, "success");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to create task.", "error");
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
              <option value="Commissioned">Commissioned</option>
              <option value="Unresolved Commission">Unresolved Commission</option>
              <option value="Pending Commission">Pending Commission</option>
            </select>

            <select
              value={selectedDrcId}
              onChange={(e) => setSelectedDrcId(e.target.value)}
              className={GlobalStyle.selectBox}
              style={{ color: selectedDrcId === "" ? "gray" : "black" }}
            >
              <option value="" hidden>Select DRC</option>
              {drcNames.map((drc) => (
                <option key={drc.key} value={drc.id.toString()}>
                  {drc.value}
                </option>
              ))}
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
              <th className={GlobalStyle.tableHeader}>Commission Amount</th>
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
                  <td className={GlobalStyle.tableCurrency}>
                    {row.Commission_Amount?.toLocaleString("en-LK", {
                      style: "currency",
                      currency: "LKR",
                    })}
                  </td>
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
    </div >
  );
};

export default Commission_List;
