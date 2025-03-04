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

import { useCallback, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import Swal from "sweetalert2";

import OpenIcon from "../../assets/images/incidents/Incident_Done.png";
import InProgressIcon from "../../assets/images/incidents/Incident_InProgress.png";
import RejectIcon from "../../assets/images/incidents/Incident_Reject.png";

const getStatusIcon = (status) => {
    switch (status) {
        case "Open":
            return OpenIcon;
        case "InProgress":
            return InProgressIcon;
        case "Reject":
            return RejectIcon;
        default:
            return null;
    }
};

const SupBulkUploadLog = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [status, setStatus] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const rowsPerPage = 7;

    const [selectedFromDate, setSelectedFromDate] = useState(null);
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");




    const validateAndFetchData = () => {
        if (!selectedFromDate && !selectedToDate && !selectedStatus) {
            Swal.fire({
                title: "Action required!",
                text: "Please complete the necessary steps before proceeding",
                icon: "warning",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK"
            });
            return;
        }

        setFromDate(selectedFromDate);
        setToDate(selectedToDate);
        setStatus(selectedStatus);
    };


    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const requestBody = {};
            if (fromDate) requestBody.From_Date = fromDate.toISOString();
            if (toDate) requestBody.To_Date = toDate.toISOString();
            if (status) requestBody.status = status;

            const response = await fetch("http://localhost:5000/api/incident/List_Transaction_Logs_Upload_Files", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();
            if (result.status === "success") {
                const transformedData = result.data.map((item) => ({
                    dateTime: new Date(item.Uploaded_Dtm).toLocaleDateString(),
                    createdTime: new Date(item.Uploaded_Dtm).toLocaleTimeString(),
                    uploadedBy: item.Uploaded_By || "N/A",
                    fileName: item.File_Name || "N/A",
                    type: item.File_Type || "N/A",
                    status: item.File_Status || "N/A",
                }));
                setData(transformedData);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(error.message || "Failed to fetch data");
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [fromDate, toDate, status]);


    useEffect(() => {
        fetchData();
    }, [fetchData, fromDate, toDate, status]);


    const filteredData = data.filter((row) =>
        Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pages = Math.ceil(filteredData.length / rowsPerPage);
    const startIndex = currentPage * rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

    const clearFilters = () => {
        setFromDate(null);
        setToDate(null);
        setStatus("");

        fetchData();
    };

    return (
        <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
            <h1 className={`${GlobalStyle.headingLarge} mb-6`}>Incident Upload Log</h1>

            {/* Filters */}
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <span>Status:</span>
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className={GlobalStyle.selectBox}>
                        <option value="">All</option>
                        <option value="Open">Open</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Reject">Reject</option>
                    </select>

                    <label className={GlobalStyle.dataPickerDate}>Date:</label>

                    <span>To:</span>
                    <DatePicker
                        selected={selectedFromDate}
                        onChange={(date) => setSelectedFromDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="From"
                        className={GlobalStyle.inputText}
                    />
                    <DatePicker
                        selected={selectedToDate}
                        onChange={(date) => {
                            if (selectedFromDate && date < selectedFromDate) {
                                Swal.fire({
                                    title: "Invalid Date Selection!",
                                    text: "The 'To' date cannot be earlier than the 'From' date.",
                                    icon: "error",
                                    confirmButtonColor: "#3085d6",
                                    confirmButtonText: "OK"
                                });
                            } else {
                                setSelectedToDate(date);
                            }
                        }}
                        minDate={selectedFromDate}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="To"
                        className={GlobalStyle.inputText}
                    />
                    <button className={GlobalStyle.buttonPrimary} onClick={validateAndFetchData}>
                        Filter
                    </button>
                    <button className={GlobalStyle.buttonPrimary} onClick={clearFilters}>
                        Clear Filters
                    </button>
                </div>
                {error && <span className={GlobalStyle.errorText}>{error}</span>}
            </div>

            {/* Search Bar */}
            <div className="mb-4 flex justify-start">
                <div className={GlobalStyle.searchBarContainer}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={GlobalStyle.inputSearch}
                    />
                    <FaSearch className={GlobalStyle.searchBarIcon} />
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : (
                /* Table */
                <div className={GlobalStyle.tableContainer}>
                    <table className={GlobalStyle.table}>
                        <thead className={GlobalStyle.thead}>
                            <tr>
                                <th className={GlobalStyle.tableHeader}>Date & Time</th>
                                <th className={GlobalStyle.tableHeader}>Created Time</th>
                                <th className={GlobalStyle.tableHeader}>Uploaded By</th>
                                <th className={GlobalStyle.tableHeader}>Status</th>
                                <th className={GlobalStyle.tableHeader}>File Name</th>
                                <th className={GlobalStyle.tableHeader}>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, index) => (
                                    <tr key={index} className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}>
                                        <td className={GlobalStyle.tableData}>{row.dateTime}</td>
                                        <td className={GlobalStyle.tableData}>{row.createdTime}</td>
                                        <td className={GlobalStyle.tableData}>{row.uploadedBy}</td>
                                        <td className={`${GlobalStyle.tableData} flex justify-center mt-2`}>
                                            <div className="flex items-center gap-2">
                                                <div className="relative group">
                                                    <img
                                                        src={getStatusIcon(row.status)}
                                                        alt={row.status}
                                                        className="w-6 h-6 cursor-pointer"
                                                    />
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                                        {row.status}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={GlobalStyle.tableData}>{row.fileName}</td>
                                        <td className={GlobalStyle.tableData}>{row.type}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        No data available. Try clearing the filters to see all records.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {filteredData.length > rowsPerPage && (
                <div className={GlobalStyle.navButtonContainer}>
                    <button className={GlobalStyle.navButton} onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>
                        <FaArrowLeft />
                    </button>
                    <span>
                        Page {currentPage + 1} of {pages}
                    </span>
                    <button className={GlobalStyle.navButton} onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pages - 1}>
                        <FaArrowRight />
                    </button>
                </div>
            )}
        </div>
    );
};

export default SupBulkUploadLog;