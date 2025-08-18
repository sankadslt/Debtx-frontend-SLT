  /*Purpose:
Created Date: 2025-07-17
Created By: Yugani Gunarathna (yuganesha027g@gmail.com)
Last Modified Date: 2025-07-18
Modified By: Sathmi Peiris (sathmipeiris@gmail.com)
Last Modified Date: 2025-07-20
Modified By:  Yugani Gunarathna 
              Sathmi Peiris
              Dinithi Wijesekara 
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
  Task_for_Download_Incidents_Full_List,
} from "../../services/Incidents/incidentService.js";
import { getLoggedUserId } from "../../services/auth/authService.js";
import { Tooltip } from "react-tooltip";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService.js";
import { getActiveServiceDetails } from "../../services/drc/Drc";
import Incident_Reject from "../../assets/images/incidents/Incident_Reject.png";
import Direct_LOD from "/src/assets/images/incidents/Direct_LOD.png";
import Reject_Pending from "/src/assets/images/incidents/Reject_Pending.png";
import Open_No_Agent from "/src/assets/images/incidents/Open_No_Agent.png";
import Only_CPE_Collect from "/src/assets/images/incidents/Only_CPE_Collect.png";
import Incident_InProgress from "/src/assets/images/incidents/Incident_InProgress.png";
import Reject from "/src/assets/images/incidents/Reject.png";
import Open from "/src/assets/images/incidents/Open .png";
import Done from "/src/assets/images/incidents/Done .png";
import Forward from "/src/assets/images/incidents/Forward .png";
const Incident = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [toDate, setToDate] = useState(null);
  const [status1, setStatus1] = useState("");
  const [status2, setStatus2] = useState("");
  const [status3, setStatus3] = useState("");
  const [status4, setStatus4] = useState("");
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [accountNo, setAccountNo] = useState("");
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

  const [committedFilters, setCommittedFilters] = useState({
    status1: "",
    status2: "",
    status3: "",
    status4: "",
    selectedServiceType: "",
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

  const fetchServiceTypes = async () => {
    try {
      const services = await getActiveServiceDetails();
      const transformedServices = services.map(service => ({
        id: service.service_id,
        value: service.service_type
      }));
      setServiceTypes(transformedServices);
    } catch (error) {
      setServiceTypes([]);
    }
  };

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "direct lod":
        return Direct_LOD;
      case "incident reject":
        return Incident_Reject;
      case "reject pending":
        return Reject_Pending;
      case "open no agent":
        return Open_No_Agent;
      case "open cpe collect":
        return Only_CPE_Collect;
      case "incident inprogress":
        return Incident_InProgress;
        case "open":
          return Open;
          case "reject":
            return Reject;
            case "done":
              return Done;
              case "forward":
                return Forward;
      default:
        return null;
    }
  };

  const renderStatusIcon = (status, index, columnName) => {
    const iconPath = getStatusIcon(status);
    if (!iconPath) {
      return <span>{status}</span>;
    }
  
    // Create unique tooltip ID by combining index and column name
    const tooltipId = `tooltip-${columnName}-${index}`;
  
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

   const naviIncidentID = (incidentId) => {
    navigate("/Incident/Incident_Details", { state: { IncidentID: incidentId } });
  };

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

  const filteredDataBySearch = filteredData.filter((row) => {
    const searchableValues = [
      row.Incident_Id,
      row.Incident_Status,
      row.Drc_Commision_Rule,
      row.Account_Num,
      row.Actions,
      row.Source_Type,
      row.Arrears,
      new Date(row.Created_Dtm).toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    ];

    return searchableValues
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  const filterValidations = () => {
    if (
      !status1 &&
      !status2 &&
      !status3 &&
      !status4 &&
      !selectedServiceType &&
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
        Incident_Direction: filters.status4,
        Service_Type: filters.selectedServiceType,
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
          setFilteredData(newData);
        } else {
          setFilteredData((prev) => [...prev, ...newData]);
        }

        if (newData.length === 0) {
          setIsMoreDataAvailable(false);
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
          if (newData.length < maxData) {
            setIsMoreDataAvailable(false);
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
    } else if (direction === "next") {
      if (isMoreDataAvailable) {
        setCurrentPage(currentPage + 1);
      } else {
        if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
          setCurrentPage(currentPage + 1);
        }
      }
    }
  };

  const handleFilterButton = () => {
    setIsMoreDataAvailable(true);
    setMaxCurrentPage(0);
    const isValid = filterValidations();
    if (!isValid) {
      return;
    } else {
      setCommittedFilters({
        status1,
        status2,
        status3,
        status4,
        selectedServiceType,
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
          status4,
          selectedServiceType,
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
    setStatus4("");
    setSelectedServiceType("");
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
      status4: "",
      selectedServiceType: "",
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
      const response = await Task_for_Download_Incidents_Full_List(
        status1,
        status2,
        selectedServiceType,
        status3,
        status4,
        fromDate,
        toDate,
        userData
      );   
      
      if (response && response.message === "Task created successfully") {
        Swal.fire({
          title: "Task created successfully!",
          text: "Task ID: " + response.Task_Id,
          icon: "success",
          confirmButtonColor: "#28a745",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.message || "Failed to create task.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsCreatingTask(false);
    }
  };  
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
          <h1 className={GlobalStyle.headingLarge}>Incident Log</h1>

          {/* Filters Section */}
          <div className={`${GlobalStyle.cardContainer} w-full mt-6`}>
            <div className="flex flex-wrap items-center justify-end w-full gap-3">
            <input
                type="text"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder="Account Number"
                className={`${GlobalStyle.inputText} w-full sm:w-auto`}
                style={{ minWidth: "150px" }}
              />
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

              <select
                value={selectedServiceType}
                onChange={(e) => setSelectedServiceType(e.target.value)}
                className={`${GlobalStyle.selectBox}`}
                style={{ color: selectedServiceType === "" ? "gray" : "black" }}
              >
                <option value="" hidden>Service Type</option>
                {serviceTypes.length > 0 ? (
                  serviceTypes.map((service) => (
                    <option key={service.id} value={service.Service_Type} style={{ color: "black" }}>
                      {service.value}
                    </option>
                  ))
                ) : (
                  <option disabled>No Service Type available</option>
                )}
              </select>

              <select
                value={status2}
                onChange={(e) => setStatus2(e.target.value)}
                className={`${GlobalStyle.selectBox}`}
                style={{ color: status2 === "" ? "gray" : "black" }}
              >
                <option value="" hidden>
                  Status
                </option>
                <option value="Open" style={{ color: "black" }}>
                  Open
                </option>
                <option value="Reject" style={{ color: "black" }}>
                  Reject
                </option>
                <option value="Done" style={{ color: "black" }}>
                  Done
                </option>
                <option value="Forward" style={{ color: "black" }}>
                  Forward
                </option>
              
                 
              </select>

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
              <select
                value={status4}
                onChange={(e) => setStatus4(e.target.value)}
                className={`${GlobalStyle.selectBox}`}
                style={{ color: status4 === "" ? "gray" : "black" }}
              >
                <option value="" hidden>
                  Incident Direction
                </option>
                <option value="Direct LOD" style={{ color: "black" }}>
                Direct LOD
                </option>
                <option
                  value="Incident Reject"
                  style={{ color: "black" }}
                >
                   Incident Reject
                </option>
                <option value="Reject Pending" style={{ color: "black" }}>
                Reject Pending
                </option>
                <option value="Open No Agent" style={{ color: "black" }}>
                Open No Agent
                </option>
                <option value="Open CPE Collect" style={{ color: "black" }}>
                Open CPE Collect
                </option>
              </select>
              

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
                  <th className={GlobalStyle.tableHeader}>Incident ID</th>
                  <th className={GlobalStyle.tableHeader}>Incident Direction</th>
                  <th className={GlobalStyle.tableHeader}>Status</th>
                  <th className={GlobalStyle.tableHeader}>Service Type</th>
                    <th className={GlobalStyle.tableHeader}>Account No</th>
                  <th className={GlobalStyle.tableHeader}>Action</th>
                  <th className={GlobalStyle.tableHeader}>Source Type</th>
                  <th className={GlobalStyle.tableHeader}>Arrears Amount (LKR)</th>
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
                        className={`${
                          index % 2 === 0
                            ? GlobalStyle.tableRowEven
                            : GlobalStyle.tableRowOdd
                        } cursor-pointer hover:bg-gray-100 hover:underline transition-all duration-200`}
                        onClick={() => naviIncidentID(row.Incident_Id)}
                      >
                        <td className={GlobalStyle.tableData}>
                          {row.Incident_Id || ""}
                        </td>
                         
                        {/* <td className={GlobalStyle.tableData}>
                          {row.Incident_direction || ""}
                        </td> */}
                        <td
                          className={`${GlobalStyle.tableData} flex justify-center`}
                        >
                          {renderStatusIcon(row.Incident_direction, index, "direction")}
                        </td>

                        <td
                          className={`${GlobalStyle.tableData}>flex justify-center`}
                        >
                          {renderStatusIcon(row.Incident_Status, index,"status")}
                        </td>
                         
                        <td className={GlobalStyle.tableData}>
                          {row.drc_commision_rule || ""}
                        </td>
                        <td className={GlobalStyle.tableData}>
                          {row.Account_Num || ""}
                        </td>
                        
                        <td className={GlobalStyle.tableData}>
                          {row.Actions || ""}
                        </td>
                        <td className={GlobalStyle.tableData}>
                          {row.Source_Type || "null"}
                        </td>
                        
                        <td className={GlobalStyle.tableCurrency}>
  {typeof row.Arrears === 'number'
    ? row.Arrears.toLocaleString("en-LK") // just format with commas
    : ""}
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
                      colSpan={8}
                      className={`${GlobalStyle.tableData} text-center`}
                    >
                      No cases available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredDataBySearch.length > 0 && (
            <div className={GlobalStyle.navButtonContainer}>
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

          {["admin", "superadmin", "slt"].includes(userRole) &&
            filteredDataBySearch.length > 0 && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={HandleCreateTask}
                  className={`${GlobalStyle.buttonPrimary} flex items-center ${isCreatingTask ? "opacity-50" : ""
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