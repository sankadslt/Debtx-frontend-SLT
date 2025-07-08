/*Purpose: 
Created Date: 2025-01-09
Created By: Vihanga eshan Jayarathna (vihangaeshan2002@gmail.com)
Last Modified Date: 2025-01-09
Modified By: Vihanga eshan Jayarathna (vihangaeshan2002@gmail.com)
Version: React v18
ui number : 1.2
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */


import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa";
import { FiUpload } from 'react-icons/fi';
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import Swal from "sweetalert2";
import OpenIcon from "../../assets/images/incidents/Incident_Done.png";
import InProgressIcon from "../../assets/images/incidents/Incident_InProgress.png";
import RejectIcon from "../../assets/images/incidents/Incident_Reject.png";
import uploadopen from "../../assets/images/incidents/Upload_Open.png";
import uploadinprogress from "../../assets/images/incidents/Upload_InProgress.png";
import uploadcomplete from "../../assets/images/incidents/Upload_Complete.png";
import uploadfailed from "../../assets/images/incidents/Upload_Failed.png";

import { List_Transaction_Logs_Upload_Files } from "../../services/Incidents/incidentService.js";
import { useNavigate } from 'react-router-dom';
import { Tooltip } from "react-tooltip";


import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

import { FaArrowUp } from 'react-icons/fa';


const SupBulkUploadLog = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    //const [currentPage, setCurrentPage] = useState(0);
    const [status, setStatus] = useState("");
    //const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    // const [selectedFromDate, setSelectedFromDate] = useState(null);
    // const [selectedToDate, setSelectedToDate] = useState(null);


    const [isLoading, setIsLoading] = useState(false);
    const [userRole, setUserRole] = useState(null); // Role-Based Buttons

    const [currentPage, setCurrentPage] = useState(1);
    const [maxCurrentPage, setMaxCurrentPage] = useState(0);
    //const [totalPages, setTotalPages] = useState(0);

    const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
    const rowsPerPage = 10;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    const hasMounted = useRef(false);

    const [committedFilters, setCommittedFilters] = useState({
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

    // Function to get the status icon based on the status value
    const getStatusIcon = (status) => {
        switch (status) {
            case "Upload Open":
                return uploadopen;
            case "Upload InProgress":
                return uploadinprogress;
            case "Upload Failed":
                return uploadfailed;
            case "Upload Complete":
                return uploadcomplete;
            default:
                return null;
        }
    };

    const navigate = useNavigate();

    // Date Handlers
    const handlestartdatechange = (date) => {
        setFromDate(date);
        // if (toDate) checkdatediffrence(date, toDate);
    };

    const handleenddatechange = (date) => {
        setToDate(date);
        // if (fromDate) checkdatediffrence(fromDate, date);
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
                    handleApicall(fromDate, toDate); // Proceed with the API call
                } else {
                    setToDate(null); // Clear the end date if the user chooses not to proceed
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

    // Search Section
    const filteredDataBySearch = filteredData.filter((row) =>
        Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    // Validate filters before calling the API

    const filterValidations = () => {
        if (!fromDate && !toDate && !status) {
            Swal.fire({
                title: "Warning",
                text: "No filter is selected. Please, select a filter.",
                icon: "warning",
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonColor: "#f1c40f",
                confirmButtonText: "OK"
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
            return false;
        }

        return true; // All validations passed
    };

    // API Call Function (renamed from fetchData to callAPI)
    const callAPI = async (filters) => {
        try {
            const formatDate = (date) => {
                if (!date) return null;
                const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                return offsetDate.toISOString().split('T')[0];
            };

            const payload = {
                status: filters.status,
                from_date: formatDate(filters.fromDate),
                to_date: formatDate(filters.toDate),
                pages: filters.page,
            };


            // const response = await fetch("http://localhost:5000/api/incident/List_Transaction_Logs_Upload_Files", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(requestBody),
            // });

            setIsLoading(true); // Set loading state to true

            const response = await List_Transaction_Logs_Upload_Files(payload);

            setIsLoading(false); // Set loading state to false

            // Updated response handling
            if (response && response.data) {
                if (currentPage === 1) {
                    setFilteredData(response.data);
                } else {
                    setFilteredData((prevData) => [...prevData, ...response.data]);
                }

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

        if (isMoreDataAvailable && currentPage > maxCurrentPage) {
            setMaxCurrentPage(currentPage);
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
        } else if (
            direction === "next" &&
            (isMoreDataAvailable || currentPage < Math.ceil(filteredData.length / rowsPerPage))
        ) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle Filter Button
    const handleFilterButton = () => {
        setIsMoreDataAvailable(true);
        //setTotalPages(0);
        setMaxCurrentPage(0);
        const isValid = filterValidations();
        if (!isValid) {
            return;
        } else {
            setCommittedFilters({
                status,
                fromDate,
                toDate
            });
            setFilteredData([]); // Clear previous results
            if (currentPage === 1) {
                callAPI({
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


    const handleClear = () => {
        setStatus("");
        setFromDate(null);
        setToDate(null);
        //setTotalPages(0);
        setSearchQuery("");
        setFilteredData([]);
        setMaxCurrentPage(0);
        setIsMoreDataAvailable(true);
        setCommittedFilters({
            status: "",
            fromDate: null,
            toDate: null
        });
        if (currentPage != 1) {
            setCurrentPage(1);
        } else {
            setCurrentPage(0);
            setTimeout(() => setCurrentPage(1), 0);
        }
    }


    const handleUploadClick = () => {
        navigate('/incident/register-bulk'); // Navigate to the Bulk Upload page
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className={`p-4 ${GlobalStyle.fontPoppins}`} >
            <div className="flex flex-col flex-1">
                <main className="p-6">
                    <h1 className={`${GlobalStyle.headingLarge} `}>Incident Upload Log</h1>

                    <div className="flex justify-end ">

                        <div>
                            {["admin", "superadmin", "slt"].includes(userRole) && (
                                <button className={`${GlobalStyle.buttonPrimary}  flex items-center`} onClick={handleUploadClick}>
                                    <FaArrowUp className="mr-2" />
                                    Upload a new file
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex justify-end w-full">
                        <div className="w-[950px] md:w-[950px] sm:w-full">
                            <div className={`${GlobalStyle.cardContainer}  w-full mt-6`} > {/* Filter Section Small issue with the viewport width. or else can use  w-3/4  */}
                                <div className="flex flex-wrap xl:flex-nowrap items-center justify-end w-full space-x-3">
                                    <div className="flex items-center">
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className={`${GlobalStyle.selectBox}`}
                                            style={{ color: status === "" ? "gray" : "black" }}
                                        >
                                            <option value="" hidden>Status</option>
                                            <option value="Upload Open" style={{ color: "black" }}>Upload Open</option>
                                            <option value="Upload InProgress" style={{ color: "black" }}>Upload InProgress</option>
                                            <option value="Upload Failed" style={{ color: "black" }}>Upload Failed</option>
                                            <option value="Upload Complete" style={{ color: "black" }}>Upload Complete</option>
                                        </select>
                                    </div>

                                    <label className={GlobalStyle.dataPickerDate}>Date:</label>

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
                                {/* {error && <span className={GlobalStyle.errorText}>{error}</span>} */}
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4 flex justify-start mt-4">
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
                                    <th className={GlobalStyle.tableHeader}>Status</th>
                                    <th className={GlobalStyle.tableHeader}>File Name</th>
                                    <th className={GlobalStyle.tableHeader}>Type</th>
                                    <th className={GlobalStyle.tableHeader}>Uploaded By</th>
                                    <th className={GlobalStyle.tableHeader}>Date & Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDataBySearch.length > 0 ? (
                                    filteredDataBySearch.slice(startIndex, startIndex + rowsPerPage).map((row, index) => (
                                        <tr
                                            key={index}
                                            className={
                                                index % 2 === 0
                                                    ? GlobalStyle.tableRowEven
                                                    : GlobalStyle.tableRowOdd
                                            }
                                        >
                                            <td className={`${GlobalStyle.tableData} flex justify-center mt-2`}>
                                                <div className="flex items-center gap-2">
                                                    <img src={getStatusIcon(row.status)} alt={row.status} data-tooltip-id={`tooltip-${index}`} className="w-6 h-6" />
                                                    <Tooltip id={`tooltip-${index}`} place="bottom" effect="solid">
                                                        {row.status}
                                                    </Tooltip>
                                                </div>
                                            </td>

                                            <td className={GlobalStyle.tableData}>{row.fileName || ""}</td>
                                            <td className={GlobalStyle.tableData}>{row.type || ""}</td>
                                            <td className={GlobalStyle.tableData}>{row.uploadedBy || ""}</td>
                                            <td className={GlobalStyle.tableData}>{new Date(row.dateTime).toLocaleDateString("en-GB")},{" "}
                                                {new Date(row.createdTime).toLocaleTimeString("en-GB", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                    hour12: true
                                                }).toUpperCase()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9}
                                            className={`${GlobalStyle.tableData} text-center`}>
                                            No data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>



                    {/* Pagination */}
                    {filteredDataBySearch.length > 0 && (<div className={GlobalStyle.navButtonContainer}>
                        <button
                            onClick={() => handlePrevNext("prev")}
                            disabled={currentPage <= 1}
                            className={`${GlobalStyle.navButton}`}
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
                                    : !isMoreDataAvailable && currentPage >= Math.ceil(filteredData.length / rowsPerPage)}
                            className={`${GlobalStyle.navButton}`}
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                    )}
                </main>
            </div>
        </div>
    );
};




export default SupBulkUploadLog;