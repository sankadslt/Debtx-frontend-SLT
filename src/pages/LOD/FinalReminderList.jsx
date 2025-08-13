/*Purpose:
Created Date: 2025-04-04
Created By: Janani Kumarasiri (jkktg001@gmail.com)
Last Modified Date: 
Modified By: 
Last Modified Date: 
Modified By: 
Version: React v18
ui number : 3.5
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */


import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch, FaEdit, FaEye, FaDownload } from "react-icons/fa";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import { List_Final_Reminder_Lod_Cases } from "../../services/LOD/LOD.js";
import { Tooltip } from "react-tooltip";
import Final_Reminder from "../../assets/images/LOD/Final_Reminder.png";
import Final_Reminder_Settle_Active from "../../assets/images/LOD/Final_Reminder_Settle_Active.png";
import Final_Reminder_Settle_Open_Pending from "../../assets/images/LOD/Final_Reminder_Settle_Open_Pending.png";
import Final_Reminder_Settle_Pending from "../../assets/images/LOD/Final_Reminder_Settle_Pending.png";
import { jwtDecode } from "jwt-decode";
import { Create_Task_For_Downloard_Each_Digital_Signature_LOD_Cases_Not_LIT_Priscribed } from "../../services/LOD/LOD.js";
import { getLoggedUserId } from "../../services/auth/authService.js";

const LOD_Log = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [LODStatus, setLODStatus] = useState("");
    const [DateType, setDateType] = useState("");
    const [FinalReminderdata, setFinalReminderData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [maxCurrentPage, setMaxCurrentPage] = useState(0); // Track the maximum current page
    const [isFilterApplied, setIsFilterApplied] = useState(false); // Track if filter is applied
    const rowsPerPage = 10; // Number of rows per page
    const navigate = useNavigate();
    const hasMounted = useRef(false);
    const [committedFilters, setCommittedFilters] = useState({
        LODStatus: "",
        DateType: "",
        fromDate: null,
        toDate: null,
    });
    const [userRole, setUserRole] = useState(null); // Role-Based Buttons
    const [isCreatingTask, setIsCreatingTask] = useState(false); // Track task creation state

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
            case "final reminder":
                return Final_Reminder;
            case "final reminder settle pending":
                return Final_Reminder_Settle_Pending;
            case "final reminder settle open-pending":
                return Final_Reminder_Settle_Open_Pending;
            case "final reminder settle active":
                return Final_Reminder_Settle_Active;
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
                    className="w-7 h-7"
                    data-tooltip-id={tooltipId} // Add tooltip ID to image
                />
                {/* Tooltip component */}
                <Tooltip id={tooltipId} place="bottom" effect="solid">
                    {`${status}`} {/* Tooltip text is the phase and status */}
                </Tooltip>
            </div>
        );
    };

    // validation for date
    const handleFromDateChange = (date) => {
        if (!DateType) {
            Swal.fire({
                title: "Invalid Input",
                text: "'Date Type' must be selected before choosing a date.",
                icon: "warning",
                confirmButtonColor: "#f1c40f"
            });
        } else if (toDate && date > toDate) {
            Swal.fire({
                title: "Invalid Input",
                text: "'From' date cannot be later than the 'To' date.",
                icon: "warning",
                confirmButtonColor: "#f1c40f"
            });
        } else {
            setFromDate(date);
        }

    };

    // validation for date
    const handleToDateChange = (date) => {
        if (!DateType) {
            Swal.fire({
                title: "Invalid Input",
                text: "'Date Type' must be selected before choosing a date.",
                icon: "warning",
                confirmButtonColor: "#f1c40f"
            });
        } else if (fromDate && date < fromDate) {
            Swal.fire({
                title: "Invalid Input",
                text: "The 'To' date cannot be earlier than the 'From' date.",
                icon: "warning",
                confirmButtonColor: "#f1c40f"
            });
        } else {
            setToDate(date);
        }
    };

    // Handle filter button
    const handleFilter = () => {
        // setTotalAPIPages(1); // Reset total API pages
        const isValid = filterValidate(); // Validate filters before fetching data
        if (!isValid) {
            return; // If validation fails, do not proceed
        } else {
            setCommittedFilters({
                LODStatus: LODStatus,
                DateType: DateType,
                fromDate: fromDate,
                toDate: toDate,
            });
            setIsMoreDataAvailable(true); // Reset more data available state
            setMaxCurrentPage(0); // Reset max current page
            setFinalReminderData([]); // Reset LOD data before fetching new data
            if (currentPage === 1) {
                fetchData({
                    LODStatus: LODStatus,
                    DateType: DateType,
                    fromDate: fromDate,
                    toDate: toDate,
                    currentPage: 1
                });
            } else {
                setCurrentPage(1);
            }
            setIsFilterApplied(true); // Set filter applied state to true
        }
    }

    const HandleCreateTaskEachLOD = async () => {
        // if (!LODType) {
        //     Swal.fire({
        //         title: "Error",
        //         text: "Please apply filter 2 befor download.",
        //         icon: "error",
        //         confirmButtonColor: "#d33",
        //     });
        //     return;
        // }

        if (!fromDate || !toDate || !DateType) {
            Swal.fire({
                title: "Warning",
                text: "Please select 'From Date', 'To Date', and 'Date Type' before creating a task.",
                icon: "warning",
                confirmButtonColor: "#f1c40f"
            });
            return;
        };

        const userData = await getLoggedUserId(); // Assign user ID

        setIsCreatingTask(true);
        try {
            const payload = {
                Created_By: userData,
                current_document_type: "Final Reminder",
                from_date: fromDate,
                to_date: toDate,
                date_type: DateType,
                status: LODStatus,
            };
            // console.log("Payload:", payload);

            const response = await Create_Task_For_Downloard_Each_Digital_Signature_LOD_Cases_Not_LIT_Priscribed(payload);
            console.log("Response:", response);
            if (response.status === 200) {
                Swal.fire({
                    title: `Task created successfully!`,
                    text: "Task ID: " + response.data.data.data.Task_Id,
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

    const filterValidate = () => {
        if (!LODStatus && !DateType && !fromDate && !toDate) {
            Swal.fire({
                title: "Invalid Input",
                text: "Please select at least one filter.",
                icon: "warning",
                confirmButtonColor: "#f1c40f"
            });
            return false;
        }

        if (DateType && !fromDate && !toDate) {
            Swal.fire({
                title: "Invalid Input",
                text: "Please select a date range when 'Date Type' is selected.",
                icon: "warning",
                confirmButtonColor: "#f1c40f"
            });
            return false;
        }

        if (fromDate && !toDate || !fromDate && toDate) {
            Swal.fire({
                title: "Invalid Input",
                text: "Please select both 'From' and 'To' dates.",
                icon: "warning",
                confirmButtonColor: "#f1c40f"
            });
            return false;
        }

        return true;
    }

    // Fetch list of LOD cases
    const fetchData = async (filters) => {
        setIsLoading(true);
        try {
            const LOD = await List_Final_Reminder_Lod_Cases(filters.LODStatus, filters.DateType, filters.fromDate, filters.toDate, "Final Reminder", filters.currentPage);

            if (currentPage === 1) {
                setFinalReminderData(LOD);
            } else {
                setFinalReminderData((prevData) => [...prevData, ...LOD]);
            }

            if (LOD.length === 0) {
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
                } if (currentPage === 2) {
                    setCurrentPage(1); // Reset to page 1 if no data found on page 2
                }
            } else {
                const maxData = currentPage === 1 ? 10 : 30;
                if (LOD.length < maxData) {
                    setIsMoreDataAvailable(false); // More data available
                }
            }
        } catch (error) {
            Swal.fire({
                title: "No Results",
                text: "Error fetching data.",
                icon: "error",
                confirmButtonColor: "#d33"
            });
            setFinalReminderData([]);
        } finally {
            setIsLoading(false);
        }
    };

    // fetching case details everytime currentpage changes
    useEffect(() => {
        if (isMoreDataAvailable && currentPage > maxCurrentPage) {
            setMaxCurrentPage(currentPage); // Update max current page
            fetchData({
                ...committedFilters,
                currentPage: currentPage
            }); // Call the function whenever currentPage changes
        }
    }, [currentPage]);

    // Handle clear Filter button
    const clearFilter = async () => {
        setLODStatus("");
        setDateType("");
        setFromDate("");
        setToDate("");
        setSearchQuery("");
        setFinalReminderData([]);
        setIsFilterApplied(false); // Reset filter applied state
        setIsMoreDataAvailable(true); // Reset more data available state    
        setTotalPages(0); // Reset total pages
        setMaxCurrentPage(0); // Reset max current page
        setCommittedFilters({
            LODStatus: "",
            DateType: "",
            fromDate: null,
            toDate: null,
        })
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

    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = FinalReminderdata.slice(startIndex, startIndex + rowsPerPage);

    // handle search
    const filteredData = FinalReminderdata.filter((row) =>
        Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = async () => {
        if (isMoreDataAvailable) {
            setCurrentPage(currentPage + 1);
        } else {
            // const totalPages = Math.ceil(FinalReminderdata.length / rowsPerPage);
            // setTotalPages(totalPages);
            if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
                setCurrentPage(currentPage + 1);
            }
        }
        // setIsLoading(true);
        // try {
        //     const nextPage = currentPage + 1;
        //     const nextData = await List_Final_Reminder_Lod_Cases(
        //         LODStatus,
        //         DateType,
        //         fromDate,
        //         toDate,
        //         "LOD",
        //         nextPage + 1
        //     );

        //     // Next page will displayed only if fetch data is not empty
        //     if (nextData.length > 0) {
        //         setCurrentPage(nextPage);
        //         setFinalReminderData(nextData);
        //     }
        // } catch (error) {
        //     Swal.fire("Error", "Failed to load next page.", "error");
        // } finally {
        //     setIsLoading(false);
        // }
    };

    const naviCustomerResponse = (caseId) => {
        navigate("/pages/LOD/CustomerResponse", { state: { caseId } });
    };

    const naviCustomerResponseReview = (caseId) => {
        navigate("/pages/LOD/CustomerResponseReview", { state: { caseId } });
    };

    // Function to navigate to the case ID page
    const naviCaseID = (caseId) => {
        navigate("/Incident/Case_Details", { state: { CaseID: caseId } });
    }

    return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Title */}
            <h2 className={GlobalStyle.headingLarge}>Final Reminder List</h2>

            {/* filters */}
            <div className={`${GlobalStyle.cardContainer} w-full`}>

                <div className="flex flex-wrap  xl:flex-nowrap items-center justify-end w-full space-x-3 gap-3">
                    <select value={LODStatus} onChange={(e) => setLODStatus(e.target.value)} style={{ color: LODStatus === "" ? "gray" : "black" }} className={GlobalStyle.selectBox}>
                        <option value="" hidden>Status</option>
                        <option value="Final Reminder" style={{ color: "black" }}>Final Reminder</option>
                        <option value="Final Reminder Settle Pending" style={{ color: "black" }}>Final Reminder Settle Pending</option>
                        <option value="Final Reminder Settle Open-Pending" style={{ color: "black" }}>Final Reminder Settle Open-Pending</option>
                        <option value="Final Reminder Settle Active" style={{ color: "black" }}>Final Reminder Settle Active</option>
                    </select>

                    <select value={DateType} onChange={(e) => setDateType(e.target.value)} style={{ color: DateType === "" ? "gray" : "black" }} className={GlobalStyle.selectBox}>
                        <option value="" hidden>Date Type</option>
                        <option value="created_date" style={{ color: "black" }}>Created Date</option>
                        <option value="expire_date" style={{ color: "black" }}>Expire Date</option>
                        <option value="last_response_date" style={{ color: "black" }}>Last Response Date</option>
                    </select>

                    <label className={GlobalStyle.dataPickerDate}>Date</label>
                    {/* <div className={GlobalStyle.datePickerContainer}> */}
                    <DatePicker
                        selected={fromDate}
                        onChange={handleFromDateChange}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="From"
                        className={GlobalStyle.inputText}
                    />
                    <DatePicker
                        selected={toDate}
                        onChange={handleToDateChange}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="To"
                        className={GlobalStyle.inputText}
                    />
                    {/* </div> */}

                    {["admin", "superadmin", "slt"].includes(userRole) && (
                        <button
                            onClick={handleFilter}
                            className={GlobalStyle.buttonPrimary}
                        >
                            Filter
                        </button>
                    )}
                    {["admin", "superadmin", "slt"].includes(userRole) && (
                        <button
                            onClick={clearFilter}
                            className={GlobalStyle.buttonRemove}
                        >
                            Clear
                        </button>
                    )}
                </div>

            </div>

            {/* Search bar */}
            <div className="mb-4 flex justify-start">
                <div className={GlobalStyle.searchBarContainer}>
                    <input
                        type="text"
                        placeholder=""
                        value={searchQuery}
                        onChange={(e) => {
                            setCurrentPage(1); // Reset to page 1 on new search
                            setSearchQuery(e.target.value);
                        }}
                        className={GlobalStyle.inputSearch}
                    />
                    <FaSearch className={GlobalStyle.searchBarIcon} />
                </div>
            </div>

            {/* table */}
            <div className={`${GlobalStyle.tableContainer} mt-10 overflow-x-auto`}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>Case ID</th>
                            <th className={GlobalStyle.tableHeader}>Status</th>
                            <th className={GlobalStyle.tableHeader}>LOD Batch No</th>
                            <th className={GlobalStyle.tableHeader}>Notification Count</th>
                            <th className={GlobalStyle.tableHeader}>Created DTM</th>
                            <th className={GlobalStyle.tableHeader}>Expire DTM</th>
                            <th className={GlobalStyle.tableHeader}>Response Updated Date</th>
                            <th className={GlobalStyle.tableHeader}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.slice(startIndex, startIndex + rowsPerPage).map((log, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0
                                        ? "bg-white bg-opacity-75"
                                        : "bg-gray-50 bg-opacity-50"
                                        } border-b`}
                                >
                                    <td
                                        className={`${GlobalStyle.tableData}  text-black hover:underline cursor-pointer`}
                                        onClick={() => naviCaseID(log.LODID)}
                                    >
                                        {log.LODID.toString().padStart(3, '0')}
                                    </td>
                                    <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>
                                        {/* {log.Status} */}
                                        {renderStatusIcon(log.Status, index)}
                                    </td>
                                    <td className={GlobalStyle.tableData}>{log.LODBatchNo}</td>
                                    <td className={GlobalStyle.tableData}>{log.NotificationCount}</td>
                                    <td className={GlobalStyle.tableData}>
                                        {log.CreatedDTM
                                            ? new Date(log.CreatedDTM).toLocaleString("en-GB", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: true,
                                            })
                                            : ""}

                                    </td>
                                    <td className={GlobalStyle.tableData}>
                                        {log.ExpireDTM
                                            ? new Date(log.ExpireDTM).toLocaleString("en-GB", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: true,
                                            })
                                            : ""}

                                    </td>
                                    <td className={GlobalStyle.tableData}>
                                        {log.LastResponse
                                            ? new Date(log.LastResponse).toLocaleString("en-GB", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: true,
                                            })
                                            : ""}

                                    </td>
                                    <td className={GlobalStyle.tableData}>
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                className={GlobalStyle.buttonIcon}
                                                style={{ fontSize: "24px" }}
                                                onClick={() => naviCustomerResponse(log.LODID)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className={GlobalStyle.buttonIcon}
                                                style={{ fontSize: "24px" }}
                                                onClick={() => naviCustomerResponseReview(log.LODID)}
                                            >
                                                <FaEye />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="text-center py-4">
                                    No data matching the criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Page nevigation buttons */}
            {filteredData.length > 0 && (
                <div className={GlobalStyle.navButtonContainer}>
                    <button className={GlobalStyle.navButton} onClick={handlePrevPage} disabled={currentPage <= 1}>
                        <FaArrowLeft />
                    </button>
                    <span className="text-gray-700">
                        Page {currentPage}
                    </span>
                    <button
                        className={GlobalStyle.navButton}
                        onClick={handleNextPage}
                        disabled={searchQuery
                            ? currentPage >= Math.ceil(filteredData.length / rowsPerPage)
                            : !isMoreDataAvailable && currentPage >= Math.ceil(FinalReminderdata.length / rowsPerPage)
                        }
                    >
                        <FaArrowRight />
                    </button>
                </div>
            )}

            {["admin", "superadmin", "slt"].includes(userRole) && filteredData.length > 0 && (
                <button
                    onClick={HandleCreateTaskEachLOD}
                    className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? 'opacity-50' : ''}`}
                    // className={`${GlobalStyle.buttonPrimary}`}
                    disabled={isCreatingTask}
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    {!isCreatingTask && <FaDownload style={{ marginRight: '8px' }} />}
                    {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'}
                    {/* Create task and let me know */}
                </button>
            )}
        </div>
    );


};


export default LOD_Log;