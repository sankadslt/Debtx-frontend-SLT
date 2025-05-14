/*Purpose:
Created Date: 2025-01-09
Created By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Last Modified Date: 2025-01-09
Modified By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Last Modified Date: 2025-01-20
Modified By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
             Vihanga Jayawardena (vihangaeshan2002@gmail.com)
             Janendra Chamodi (apjanendra@gmail.com)
Version: React v18
ui number : 1.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch , FaDownload  } from "react-icons/fa";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import { fetchIncidents ,Task_for_Download_Incidents } from "../../services/Incidents/incidentService.js";
//import { Task_for_Download_Incidents } from "../../services/task/taskService.js"; // moved to the incident service 
import { getLoggedUserId } from "../../services/auth/authService";
import { Tooltip } from "react-tooltip";
import { FaPlus } from 'react-icons/fa';
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";
import opeanincident from  "/src/assets/images/incidents/Incident_Open.png"
import rejectincident from  "/src/assets/images/incidents/Incident_Reject.png"
import inprogressincident from  "/src/assets/images/incidents/Incident_InProgress.png"
import errorincident from "/src/assets/images/incidents/Incident_Error.png"
import error from "/src/assets/images/incidents/Reject.png"


const Incident_List = () => {
    const [currentPage, setCurrentPage] = useState(0); // Pagination state
    const [searchQuery, setSearchQuery] = useState(""); //  Search query state
    const [fromDate, setFromDate] = useState(null); // Date state for filtering
    const [toDate, setToDate] = useState(null);// / Date state for filtering
    const rowsPerPage = 8; // Pagination state
    const [status1, setStatus1] = useState(""); // Status state for filtering
    const [status2, setStatus2] = useState(""); // / Status state for filtering
    const [status3, setStatus3] = useState(""); // Status state for filtering
    const [data, setData] = useState([]);   // Data state for storing incident data
    const [isLoading, setIsLoading] = useState(false); // Loading state for task creation
    const [isCreatingTask, setIsCreatingTask] = useState(false); 
    const [isFiltered, setIsFiltered] = useState(false); // Filtered state for filtering data

    const [userRole, setUserRole] = useState(null); // Role-Based Buttons
    const navigate = useNavigate();


    // Role-Based Button
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


    // / Function to get the status icon based on the status value
    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "incident open":
                return opeanincident;
            case "incident inprogress":
                return inprogressincident;
            case "incident error":
                return errorincident;
            case "reject" || "incident reject":
                return error;
            default:
                return null;
        }
    };
    // Function to render the status icon with tooltip
    const renderStatusIcon = (status , index) => {
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
                {status} {/* Tooltip text is the status */}
            </Tooltip>
        </div>
        );
    };
    
    // Function to handle date change for "From" date
    const handleFromDateChange = (date) => {
        if (toDate && date > toDate) {
            Swal.fire({
                title: "Error",
                text: "From date cannot be after the To date.",
                icon: "error",
                confirmButtonColor: "#f1c40f", 
            });
        } else if (toDate) {
            // Calculate month gap
            const diffInMs = toDate - date;
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
            
            if (diffInDays > 31) {
                Swal.fire({
                    title: "Warning",
                    text: "The selected range is more than 1 month.",
                    icon: "warning",
                    confirmButtonColor: "#f1c40f",
                });
                
                return;
            }
            setFromDate(date);
        } else {
            setFromDate(date);
            
        }
        
    };
    
    // Function to handle date change for "To" date
    const handleToDateChange = (date) => {
        if (fromDate && date < fromDate) {
            Swal.fire({
                title: "Error",
                text: "To date cannot be before the From date.",
                icon: "error",
                confirmButtonColor: "#f1c40f", 
            });
        } else if (fromDate) {
            // Calculate month gap
            const diffInMs = date - fromDate;
            const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
            
            if (diffInDays > 31) {
                Swal.fire({
                    title: "Warning",
                    text: "The selected range is more than 1 month.",
                    icon: "warning",
                    confirmButtonColor: "#f1c40f",
                });
                
                return;
            }
            setToDate(date);
        } else {
            setToDate(date);
        }
    };

    // Function to fetch incident data from the API
    const fetchData = async (filters) => {
        setIsLoading(true);
        try {
            const incidents = await fetchIncidents(filters);
            setData(incidents);
            setIsFiltered(incidents.length > 0);
        } catch (error) {
            setIsFiltered(false);
           
            Swal.fire({
                title: "Error",
                text: error.message || "No incidents matching the criteria.",
                icon: "error",
                confirmButtonColor: "#d33", 
            });
        } finally {
            setIsLoading(false);
        }
    };

    // / Function to handle filter button click
    const handleFilter = async () => {
        try {
            if (!fromDate || !toDate) {
                
                Swal.fire({
                    title: "Error",
                    text: "Both 'From' and 'To' dates are required.",
                    icon: "error",
                    confirmButtonColor: "#d33", 
                });
                return;
            }
            const filters = {
                Actions: status1,
                Incident_Status: status2,
                Source_Type: status3,
                From_Date: fromDate.toISOString(),
                To_Date: toDate.toISOString()
            };
            await fetchData(filters);
        } catch (error) {
           
            Swal.fire({
                title: "Error",
                text: error.message || "No incidents matching the criteria.",
                icon: "error",
                confirmButtonColor: "#d33", 
            });
        }
    };
    
    // Function to handle filter clear button click
    const handlefilterclear = () => {
        setStatus1("");
        setStatus2("");
        setStatus3("");
        setFromDate(null);
        setToDate(null);
        fetchData({});
    };

    // Function to handle the creation of a task for downloading incidents
    const HandleCreateTask = async () => {
        if (!fromDate || !toDate) {
            Swal.fire({
                title: "Warning",
                text: "Both 'From' and 'To' dates are required.",
                icon: "warning",
                confirmButtonColor: "#f1c40f",
                
            });
            return;
        }
        if (!isFiltered) {
            
            Swal.fire({
                title: "warning",
                text: "Please apply filters that return data before creating a task.",
                icon: "warning",
                confirmButtonColor: "#f1c40f",
                
            });
            return;
        }

        const adjustToLocalISO = (date) => {
            const offset = date.getTimezoneOffset() * 60000;
            return new Date(date.getTime() - offset).toISOString();
        };
          const user_id = await getLoggedUserId();
        const requestData = {
            DRC_Action: status1,
            Incident_Status: status2,
            Source_Type: status3,
            From_Date: adjustToLocalISO(fromDate),
            To_Date: adjustToLocalISO(toDate),
            Created_By:user_id
        };

        setIsCreatingTask(true);
        try {
            const response = await Task_for_Download_Incidents(requestData);
            console.log("Task created successfully:", response);
            
            Swal.fire({
                title: "Success",
                text: `Task created successfully! Task ID: ${response.ResponseData.data.Task_Id}`,
                icon: "success",
                confirmButtonColor: "#28a745", 
            });
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

    useEffect(() => {
        fetchData({});
    }, []);

    /// Function to handle the addition of a new incident
    const HandleAddIncident = () => navigate("/incident/register");

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Function to handle search input change
    const filteredData = data.filter((row) =>
        String(row.incidentID).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.status).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.accountNo).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.action).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.sourceType).toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const pages = Math.ceil(filteredData.length / rowsPerPage);
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    // Function to handle previous page button click
    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Function to handle next page button click
    const handleNextPage = () => {
        if (currentPage < pages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

     
    
    return (
        <div className={GlobalStyle.fontPoppins}>
            <h2 className={GlobalStyle.headingLarge}>Incident List</h2>


            <div className="flex  justify-end mt-6">
                <button onClick={HandleAddIncident}  className={`${GlobalStyle.buttonPrimary} flex items-center`}>
                    <FaPlus className="mr-2"/>
                    Add Incident
                </button>
            </div>
            {/*Filter section */}
            <div className= {`${GlobalStyle.cardContainer} w-full mb-8 mt-8`}>
                <div className="flex items-center justify-end w-full space-x-6">
                    <select value={status1} onChange={(e) => setStatus1(e.target.value)} style={{ color: status1 === "" ? "gray" : "black" }} className={GlobalStyle.selectBox}>
                        <option value="" hidden >Action Type</option>
                        <option value="collect arrears" style={{ color: "black" }}>collect arrears</option>
                        <option value="collect arrears and CPE" style={{ color: "black" }}>collect arrears and CPE</option>
                        <option value="collect CPE" style={{ color: "black" }}>collect CPE</option>
                    </select>

                    <select value={status2} onChange={(e) => setStatus2(e.target.value)} style={{ color: status2 === "" ? "gray" : "black" }} className={GlobalStyle.selectBox}>
                        <option value="" hidden>Status</option>
                        <option value="Incident Open" style={{ color: "black" }}>Incident Open</option>
                        <option value="Incident Reject" style={{ color: "black" }}>Incident Reject</option>
                    </select>

                    <select value={status3} onChange={(e) => setStatus3(e.target.value)} style={{ color: status3 === "" ? "gray" : "black" }} className={GlobalStyle.selectBox}>
                        <option value="" hidden>Source Type</option>
                        <option value="Pilot Suspended" style={{ color: "black" }}>Pilot Suspended</option>
                        <option value="Product Terminate"style={{ color: "black" }}>Product Terminate</option>
                        <option value="Special" style={{ color: "black" }}>Special</option>
                    </select>
                    
                    <label className={GlobalStyle.dataPickerDate}>Date:</label>
                    <DatePicker selected={fromDate} onChange={handleFromDateChange} dateFormat="dd/MM/yyyy" placeholderText="From " className={GlobalStyle.inputText} />
                    <DatePicker selected={toDate} onChange={handleToDateChange} dateFormat="dd/MM/yyyy" placeholderText="To " className={GlobalStyle.inputText} />
                   
                    {/* <button onClick={handleFilter} className={GlobalStyle.buttonPrimary}>Filter</button> */}
                    <div>
                    {["admin", "superadmin", "slt"].includes(userRole) && (
                   <button onClick={handleFilter} className={GlobalStyle.buttonPrimary}>Filter</button>
                    )}
                </div>

                <div>
                    {["admin", "superadmin", "slt"].includes(userRole) && (
                  <button className={GlobalStyle.buttonRemove} onClick={handlefilterclear} >
                  Clear 
              </button>
                    )}
                </div>
                    {/* <button className={GlobalStyle.buttonRemove} onClick={handlefilterclear} >
                        Clear 
                    </button> */}
                    
                </div>
            </div>

             {/* Search Section */}
            <div className="mb-4 flex justify-start">
                <div className={GlobalStyle.searchBarContainer}>
                    <input
                        type="text"
                        placeholder=""
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={GlobalStyle.inputSearch}
                    />
                    <FaSearch className={GlobalStyle.searchBarIcon} />
                </div>
            </div>

             {/* Table Section */}
            <div className={GlobalStyle.tableContainer}>
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
                        {paginatedData.length > 0 ? (
                            paginatedData.map((log, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0
                                        ? "bg-white bg-opacity-75"
                                        : "bg-gray-50 bg-opacity-50"
                                    } border-b`}
                                >
                                    <td className={GlobalStyle.tableData}>{log.incidentID}</td>
                                    <td className={`${GlobalStyle.tableData} flex justify-center mt-2`}>
                                        {renderStatusIcon(log.status , index)}
                                    </td>
                                    <td className={GlobalStyle.tableData}>{log.accountNo}</td>
                                    <td className={GlobalStyle.tableData}>{log.action}</td>
                                    <td className={GlobalStyle.tableData}>{log.sourceType}</td>
                                    <td className={GlobalStyle.tableData}>{new Date(log.createdDTM).toLocaleString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: true,
                                        })}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    No data matching the criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
             {/* Pagnation section */}
             { filteredData.length > 0 && ( 
            <div className={GlobalStyle.navButtonContainer}>
                <button className={GlobalStyle.navButton} onClick={handlePrevPage} disabled={currentPage === 0}>
                    <FaArrowLeft />
                </button>
                <span className="text-gray-700">
                    Page {currentPage + 1} of {pages}
                </span>
                <button className={GlobalStyle.navButton} onClick={handleNextPage} disabled={currentPage === pages - 1}>
                    <FaArrowRight />
                </button>
            </div>
            )}
                        
            {/* Create Task Button */}
            <div className="flex justify-end mt-6">
                { paginatedData.length > 0 && (
                <div>
                    {["admin", "superadmin", "slt"].includes(userRole) && (
                  <button 
                  onClick={HandleCreateTask} 
                  className={`${GlobalStyle.buttonPrimary} flex items-center ${isCreatingTask ? 'opacity-50' : ''}`}
                  disabled={isCreatingTask}
              >   
                  <FaDownload className="mr-2" />
                  {isCreatingTask ? 'Creating Tasks...' : '  Create task and let me know'}
              </button>
                    )}
                </div>
                )}
                {/* <button 
                    onClick={HandleCreateTask} 
                    className={`${GlobalStyle.buttonPrimary} flex items-center ${isCreatingTask ? 'opacity-50' : ''}`}
                    disabled={isCreatingTask}
                >   
                    <FaDownload className="mr-2" />
                    {isCreatingTask ? 'Creating Tasks...' : '  Create task and let me know'}
                </button> */}
            </div>
        </div>
    );

    
};


export default Incident_List;