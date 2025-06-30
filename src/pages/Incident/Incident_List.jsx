/*Purpose:
Created Date: 2025-01-09
Created By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Last Modified Date: 2025-01-09
Modified By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Last Modified Date: 2025-01-20
Modified By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
             Vihanga Jayawardena (vihangaeshan2002@gmail.com)
             Janendra Chamodi (apjanendra@gmail.com)
             Update 2025-06-28
Version: React v18
ui number : 1.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch, FaDownload, FaPlus } from "react-icons/fa";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import { fetchIncidents, Task_for_Download_Incidents } from "../../services/Incidents/incidentService.js";
import { getLoggedUserId } from "../../services/auth/authService";
import { Tooltip } from "react-tooltip";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";
import opeanincident from "/src/assets/images/incidents/Incident_Open.png";
import rejectincident from "/src/assets/images/incidents/Incident_Reject.png";
import inprogressincident from "/src/assets/images/incidents/Incident_InProgress.png";
import incidentDone from "/src/assets/images/incidents/Incident_Done.png"
import errorincident from "/src/assets/images/incidents/Incident_Error.png";
import error from "/src/assets/images/incidents/Reject.png";

const Incident_List = () => {
 
 
  
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [toDate, setToDate] = useState(null);
  const [status1, setStatus1] = useState("");
  const [status2, setStatus2] = useState("");
  const [status3, setStatus3] = useState("");
   
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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
    fromDate: null,
    toDate: null
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
        return opeanincident;
      case "incident inprogress":
        return inprogressincident;
      case "incident error":
        return errorincident;
      // case "reject":
      //   return error;
      // case "incident reject":
      //   return rejectincident;
      case "complete":
        return incidentDone;
      default:
        return null;
    }
  };

  const renderStatusIcon = (status, index) => {
    const iconPath = getStatusIcon(status);
    if (!iconPath){
      return <span>{status}</span>;
    }  

    const tooltipId = `tooltip-${index}`;

    return (
      <div className="flex items-center gap-2">
        <img src={iconPath} 
        alt={status} 
       
        className="w-6 h-6" 
        data-tooltip-id={tooltipId} />

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
  const CheckDateDifference = (fromDate, toDate) => {
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
          endDate = toDate;
          handleApicall(fromDate, toDate);  
        } else {
          setToDate(null);  
          console.log("EndDate cleared");
        }
      });
    }
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
          confirmButtonColor: "#f1c40f"
        });
        setToDate(null);
        setFromDate(null);
        return;
      } else {
        CheckDateDifference(fromDate, toDate);
      }
    }
  }, [fromDate, toDate]);
  
  
  
    const filteredDataBySearch = paginatedData.filter((row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );


      const filterValidations = () => {
        if ( !status1 && !status2 && !status3 && !fromDate && !toDate ) {
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
    
        return true;  
      };

   
  const callAPI = async (filters) => {
    try {
      
      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split('T')[0];
      };

      const payload = {
        Actions: filters.status1,
        Incident_Status: filters.status2,
        Source_Type: filters.status3,
        from_date: formatDate(filters.fromDate),
        to_date: formatDate(filters.toDate),
        pages: filters.page,
      };

      setIsLoading(true);
      const response = await fetchIncidents(payload);
      setIsLoading(false);
      
      if (response && response.data ) {
        setFilteredData((prevData) => [...prevData, ...response.data]);
        
       if (response.data.length === 0) {
           setIsMoreDataAvailable(false);  
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
             setCurrentPage(1);  
           }
         } else {
           const maxData = currentPage === 1 ? 10 : 30;
           if (response.data.length < maxData) {
             setIsMoreDataAvailable(false); 
           }
         }
 
       } else {
         Swal.fire({
           title: "Error",
           text: "No valid incident data found in response.",
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
       setIsLoading(false);  
     }
   }

 
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage);
      callAPI({
        ...committedFilters,
        page: currentPage
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
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        setTotalPages(totalPages);
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      }
    }
  };

 
 
    const handleFilterButton = () => {
    setIsMoreDataAvailable(true);
    setTotalPages(0);
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
      toDate
    });
    setFilteredData([]);
    
    if (currentPage === 1) {
      callAPI({
        status1,
        status2,
        status3,
        fromDate,
        toDate,
        page: 1
      });
    } else {
      setCurrentPage(1);

    }
    }
    
  }
  
  const handleClear = () => {
    setStatus1("");
    setStatus2("");
    setStatus3("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setTotalPages(0);
    setFilteredData([]);
    setMaxCurrentPage(0);
    setIsMoreDataAvailable(true);
    setCommittedFilters({
      status1: "",
      status2: "",
      status3: "",
      fromDate: null,
      toDate: null
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
            confirmButtonColor: "#f1c40f"
          });
      return;
    }

   
    setIsCreatingTask(true);
 
    try {
      
 
      // const requestData = {
      //   DRC_Action: status1,
      //   Incident_Status: status2,
      //   Source_Type: status3,
      //   from_date:fromDate,
      //   to_date: toDate,
      //   Created_By: user_id
      // };
 
      const response = await Task_for_Download_Incidents( status1,status2,fromDate,toDate,userData);
      if (response && response.message === "Task created successfully") {
           Swal.fire({
             title:  "Success",
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
          <h1 className={GlobalStyle.headingLarge}>Incident List</h1>

          <div className="flex justify-end mt-6">
            <button onClick={HandleAddIncident} className={`${GlobalStyle.buttonPrimary} flex items-center`}>
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
                  <option value="" hidden>Action Type</option>
                  <option value="collect arrears" style={{ color: "black" }}>collect arrears</option>
                  <option value="collect arrears and CPE" style={{ color: "black" }}>collect arrears and CPE</option>
                  <option value="collect CPE" style={{ color: "black" }}>collect CPE</option>
                </select>
              </div>

              <div className="flex items-center">
                <select
                  value={status2}
                  onChange={(e) => setStatus2(e.target.value)}
                  className={`${GlobalStyle.selectBox}`}
                  style={{ color: status2 === "" ? "gray" : "black" }}
                >
                  <option value="" hidden>Status</option>
                  <option value="Incident Open" style={{ color: "black" }}>Incident Open</option>
                  <option value="Reject" style={{ color: "black" }}>Reject</option>
                  <option value="Complete" style={{ color: "black" }}>Complete</option>
                  <option value="Incident Error" style={{ color: "black" }}>Incident Error</option>
                  <option value="Incident InProgress" style={{ color: "black" }}>Incident InProgress</option>
                </select>
              </div>

              <div className="flex items-center">
                <select
                  value={status3}
                  onChange={(e) => setStatus3(e.target.value)}
                  className={`${GlobalStyle.selectBox}`}
                  style={{ color: status3 === "" ? "gray" : "black" }}
                >
                  <option value="" hidden>Source Type</option>
                  <option value="Pilot Suspended" style={{ color: "black" }}>Pilot Suspended</option>
                  <option value="Product Terminate" style={{ color: "black" }}>Product Terminate</option>
                  <option value="Special" style={{ color: "black" }}>Special</option>
                </select>
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
                  filteredDataBySearch.map((row, index) => (
                    <tr
                      key={row.incidentID||index}
                      className={
                        index % 2 === 0
                          ? GlobalStyle.tableRowEven
                          : GlobalStyle.tableRowOdd
                      }
                    >
                      <td className={GlobalStyle.tableData}>{row.incidentID || "N/A"}</td>
                      <td className={`${GlobalStyle.tableData} flex justify-center`}>
                        {renderStatusIcon(row.status, index)}
                      </td>
                      <td className={GlobalStyle.tableData}>{row.accountNo || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>{row.action || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>{row.sourceType || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>{new Date(row.created_dtm).toLocaleDateString("en-GB") || "N/A"}</td>
                     
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
              disabled={currentPage === totalPages}
              className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""}`}
            >
              <FaArrowRight />
            </button>
          </div>)}

          {/* Create Task Button */}
          {["admin", "superadmin", "slt"].includes(userRole) && filteredDataBySearch.length > 0 && (
            <div className="flex justify-end mt-6">
              <button
                onClick={HandleCreateTask}
                className={`${GlobalStyle.buttonPrimary} flex items-center ${isCreatingTask ? 'opacity-50' : ''}`}
                disabled={isCreatingTask}
              >
                 {!isCreatingTask && <FaDownload style={{ marginRight: '8px' }} />}
                 {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};


export default Incident_List;
