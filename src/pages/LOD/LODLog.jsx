/*Purpose:
Created Date: 2025-04-04
Created By: Janani Kumarasiri (jkktg001@gmail.com)
Last Modified Date: 
Modified By: 
Last Modified Date: 
Modified By: 
Version: React v18
ui number : 1.1
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
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // validation for date
    const handleFromDateChange = (date) => {
        if (!DateType) {
            Swal.fire("Invalid Input", "'Date Type' must be selected before choosing a date.", "error");
        } else if (toDate && date > toDate) {
            Swal.fire("Invalid Input", "'From' date cannot be later than the 'To' date.", "warning");
        } else {
            setFromDate(date);
        }

    };

    // validation for date
    const handleToDateChange = (date) => {
        if (!DateType) {
            Swal.fire("Invalid Input", "'Date Type' must be selected before choosing a date.", "error");
        } else if (fromDate && date < fromDate) {
            Swal.fire("Invalid Input", "The 'To' date cannot be earlier than the 'From' date.", "warning");
        } else {
            setToDate(date);
        }
    };

    // Fetch list of LOD cases
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const LOD = await List_Final_Reminder_Lod_Cases(LODStatus, DateType, fromDate, toDate, "LOD", currentPage + 1);
            setData(LOD);
            // setIsFiltered(LOD.length > 0);
        } catch (error) {
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData({});
    }, [currentPage]);

    // Handle Filter button
    const clearFilter = async () => {
        setLODStatus("");
        setDateType("");
        setFromDate("");
        setToDate("");
    };

    // const HandleAddIncident = () => navigate("/incident/register");

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const filteredData = data.filter((row) =>
        String(row.LODID).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.Status).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.LODBatchNo).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.NotificationCount).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.CreatedDTM).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.ExpireDTM).toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(row.LastResponse).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = async () => {
        setIsLoading(true);
        try {
            const nextPage = currentPage + 1;
            const nextData = await List_Final_Reminder_Lod_Cases(
                LODStatus,
                DateType,
                fromDate,
                toDate,
                "LOD",
                nextPage + 1 // backend pages are probably 1-indexed
            );

            if (nextData.length > 0) {
                setCurrentPage(nextPage);
                setData(nextData);
            }
        } catch (error) {
            Swal.fire("Error", "Failed to load next page.", "error");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className={GlobalStyle.fontPoppins}>
            <h2 className={GlobalStyle.headingLarge}>LOD List</h2>

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

                    <button onClick={fetchData} className={GlobalStyle.buttonPrimary}>Filter</button>
                    <button onClick={clearFilter} className={GlobalStyle.buttonRemove}>Clear</button>
                </div>

            </div>

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
                                                onClick={() => navigate(`/pages/LOD/CustomerResponse/${log.LODID}`)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className={GlobalStyle.buttonIcon}
                                                style={{ fontSize: "24px" }}
                                                onClick={() => navigate(`/pages/LOD/CustomerResponseReview/${log.LODID}`)}
                                            >
                                                <FaEye />
                                            </button>
                                        </div>
                                    </td>
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

            <div className={GlobalStyle.navButtonContainer}>
                <button className={GlobalStyle.navButton} onClick={handlePrevPage} disabled={currentPage === 0}>
                    <FaArrowLeft />
                </button>
                <span className="text-gray-700">
                    Page {currentPage + 1}
                </span>
                <button className={GlobalStyle.navButton} onClick={handleNextPage}>
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );


};


export default LOD_Log;