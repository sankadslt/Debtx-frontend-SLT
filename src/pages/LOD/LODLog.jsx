/*Purpose:
Created Date: 2025-04-04
Created By: Janani Kumarasiri (jkktg001@gmail.com)
Last Modified Date: 
Modified By: 
Last Modified Date: 
Modified By: 
Version: React v18
ui number : 3.4
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch, FaEdit, FaEye } from "react-icons/fa";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import { List_Final_Reminder_Lod_Cases } from "../../services/LOD/LOD.js";

const LOD_Log = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [LODStatus, setLODStatus] = useState("");
    const [DateType, setDateType] = useState("");
    const [LODdata, setLODData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [maxCurrentPage, setMaxCurrentPage] = useState(0); // Track the maximum current page
    const [isFilterApplied, setIsFilterApplied] = useState(false); // Track if filter is applied
    const rowsPerPage = 10; // Number of rows per page
    const navigate = useNavigate();

    // validation for date
    const handleFromDateChange = (date) => {
        if (!DateType) {
            Swal.fire("Invalid Input", "'Date Type' must be selected before choosing a date.", "warning");
        } else if (toDate && date > toDate) {
            Swal.fire("Invalid Input", "'From' date cannot be later than the 'To' date.", "warning");
        } else {
            setFromDate(date);
        }

    };

    // validation for date
    const handleToDateChange = (date) => {
        if (!DateType) {
            Swal.fire("Invalid Input", "'Date Type' must be selected before choosing a date.", "warning");
        } else if (fromDate && date < fromDate) {
            Swal.fire("Invalid Input", "The 'To' date cannot be earlier than the 'From' date.", "warning");
        } else {
            setToDate(date);
        }
    };

    // Handle filter button
    const handleFilter = () => {
        if (!LODStatus && !DateType && !fromDate && !toDate) {
            Swal.fire("Invalid Input", "Please select at least one filter.", "warning");
            return;
        }
        // fetchData();
        setLODData([]); // Reset LOD data before fetching new data
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

    // Fetch list of LOD cases
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const LOD = await List_Final_Reminder_Lod_Cases(LODStatus, DateType, fromDate, toDate, "LOD", currentPage);
            console.log("LOD data:", LOD);
            setLODData((prevData) => [...prevData, ...LOD]);
            if (LOD.length === 0) {
                setIsMoreDataAvailable(false);
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
                if (LOD.length < maxData) {
                    setIsMoreDataAvailable(false); // More data available
                }
            }
        } catch (error) {
            // console.error("Error fetching LOD data:", error);
            Swal.fire("No Results", "Error fetching data.", "error");
            setLODData([]);
        } finally {
            setIsLoading(false);
        }
    };

    // fetching case details everytime currentpage changes
    useEffect(() => {
        if (isFilterApplied && isMoreDataAvailable && currentPage > maxCurrentPage) {
            setMaxCurrentPage(currentPage); // Update max current page
            fetchData(); // Call the function whenever currentPage changes
        }
    }, [currentPage]);

    // Handle Filter button
    const clearFilter = async () => {
        setIsFilterApplied(false); // Reset filter applied state
        setMaxCurrentPage(0); // Reset max current page
        setLODStatus("");
        setDateType("");
        setFromDate("");
        setToDate("");
        setLODData([]);
        setTotalPages(0);
        setIsMoreDataAvailable(true);
        setCurrentPage(0);
        filteredData([]);
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
    const paginatedData = LODdata.slice(startIndex, startIndex + rowsPerPage);

    // handle search
    const filteredData = paginatedData.filter((row) =>
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

    // handle next page
    const handleNextPage = async () => {
        if (isMoreDataAvailable) {
            setCurrentPage(currentPage + 1);
        } else {
            const totalPages = Math.ceil(LODdata.length / rowsPerPage);
            setTotalPages(totalPages);
            if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
            }
        }
        // console.log("Current page:", currentPage);
        // console.log("Total pages:", totalPages);
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
        //         setLODData(nextData);
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


    return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Title */}
            <h2 className={GlobalStyle.headingLarge}>LOD List</h2>

            {/* filters */}
            <div className={`${GlobalStyle.cardContainer} w-full`}>

                <div className="flex items-center justify-end w-full space-x-6">
                    <select value={LODStatus} onChange={(e) => setLODStatus(e.target.value)} style={{ color: LODStatus === "" ? "gray" : "black" }} className={GlobalStyle.selectBox}>
                        <option value="" hidden>Status</option>
                        <option value="Initial LOD">Initial LOD</option>
                        <option value="LOD Settle Pending">LOD Settle Pending</option>
                        <option value="LOD Settle Open-Pending">LOD Settle Open-Pending</option>
                        <option value="LOD Settle Active">LOD Settle Active</option>
                    </select>

                    <select value={DateType} onChange={(e) => setDateType(e.target.value)} style={{ color: DateType === "" ? "gray" : "black" }} className={GlobalStyle.selectBox}>
                        <option value="" hidden>Date Type</option>
                        <option value="created_date">Created Date</option>
                        <option value="expire_date">Expire Date</option>
                        <option value="last_response_date">Last Response Date</option>
                    </select>

                    <label className={GlobalStyle.dataPickerDate}>Date</label>
                    <div className={GlobalStyle.datePickerContainer}>
                        <DatePicker
                            selected={fromDate}
                            onChange={handleFromDateChange}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="From Date"
                            className={GlobalStyle.inputText}
                        />
                        <DatePicker
                            selected={toDate}
                            onChange={handleToDateChange}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="To Date"
                            className={GlobalStyle.inputText}
                        />
                    </div>

                    <button onClick={handleFilter} className={GlobalStyle.buttonPrimary}>Filter</button>
                    <button onClick={clearFilter} className={GlobalStyle.buttonRemove}>Clear</button>
                </div>

            </div>

            {/* Search bar */}
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

            {/* table */}
            <div className={GlobalStyle.tableContainer}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>Case ID</th>
                            <th className={GlobalStyle.tableHeader}>Status</th>
                            <th className={GlobalStyle.tableHeader}>LOD Batch No</th>
                            <th className={GlobalStyle.tableHeader}>Notification Count</th>
                            <th className={GlobalStyle.tableHeader}>Created DTM</th>
                            <th className={GlobalStyle.tableHeader}>Expire DTM</th>
                            <th className={GlobalStyle.tableHeader}>Last Response</th>
                            <th className={GlobalStyle.tableHeader}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((log, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0
                                        ? "bg-white bg-opacity-75"
                                        : "bg-gray-50 bg-opacity-50"
                                        } border-b`}
                                >
                                    <td className={GlobalStyle.tableData}>{log.LODID}</td>
                                    <td className={GlobalStyle.tableData}>{log.Status}</td>
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
            <div className={GlobalStyle.navButtonContainer}>
                <button className={GlobalStyle.navButton} onClick={handlePrevPage} disabled={currentPage <= 1}>
                    <FaArrowLeft />
                </button>
                <span className="text-gray-700">
                    Page {currentPage}
                </span>
                <button className={GlobalStyle.navButton} onClick={handleNextPage} disabled={currentPage === totalPages}>
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );


};


export default LOD_Log;