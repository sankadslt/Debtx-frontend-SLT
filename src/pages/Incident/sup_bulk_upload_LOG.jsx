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


 

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle";


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

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const requestBody = {};

            if (fromDate) {
                requestBody.From_Date = fromDate.toISOString();
            }

            if (toDate) {
                requestBody.To_Date = toDate.toISOString();
            }

            if (status) {
                requestBody.status = status;
            }

            const response = await fetch('http://localhost:5000/api/incident/List_Transaction_Logs_Upload_Files', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            if (result.status === "success") {
                const transformedData = result.data.map(item => ({
                    dateTime: new Date(item.Uploaded_Dtm).toLocaleDateString(),
                    createdTime: new Date(item.Uploaded_Dtm).toLocaleTimeString(),
                    uploadedBy: item.Uploaded_By || 'N/A',
                    fileName: item.File_Name || 'N/A',
                    type: item.File_Type || 'N/A',
                    status: item.File_Status || 'N/A'
                }));
                setData(transformedData);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(error.message || 'Failed to fetch data');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle client-side search
    const filteredData = data.filter((row) => {
        return Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
    });

    // Client-side pagination
    const pages = Math.ceil(filteredData.length / rowsPerPage);
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const handleFromDateChange = (date) => {
        if (toDate && date > toDate) {
            setError("The 'From' date cannot be later than the 'To' date.");
        } else {
            setError("");
            setFromDate(date);
        }
    };

    const handleToDateChange = (date) => {
        if (fromDate && date < fromDate) {
            setError("The 'To' date cannot be earlier than the 'From' date.");
        } else {
            setError("");
            setToDate(date);
        }
    };

    const handleFilter = () => {
        setCurrentPage(0);
        fetchData();
    };

    const handleClearFilters = () => {
        setFromDate(null);
        setToDate(null);
        setStatus("");
        setSearchQuery("");
        setCurrentPage(0);
        fetchData();
    };

    const handlePrevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < pages - 1) setCurrentPage(currentPage + 1);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
            <h1 className={`${GlobalStyle.headingLarge} mb-6`}>Incident Upload Log</h1>

            {/* Filters Section */}
            <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <span>Status:</span>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">All</option>
                        <option value="Open">Open</option>
                        <option value="Close">Close</option>
                    </select>

                    <label className={GlobalStyle.dataPickerDate}>Date:</label>
                    <DatePicker
                        selected={fromDate}
                        onChange={handleFromDateChange}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="From"
                        className={GlobalStyle.inputText}
                    />
                    <span>To:</span>
                    <DatePicker
                        selected={toDate}
                        onChange={handleToDateChange}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="To"
                        className={GlobalStyle.inputText}
                    />
                    <button
                        className={GlobalStyle.buttonPrimary}
                        onClick={handleFilter}
                    >
                        Filter
                    </button>
                    <button
                        className={GlobalStyle.buttonPrimary}
                        onClick={handleClearFilters}
                    >
                        Clear Filters
                    </button>
                </div>
                {error && <span className={GlobalStyle.errorText}>{error}</span>}
            </div>

            {/* Table Section */}
            <div className="flex flex-col">
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
                                    <th className={GlobalStyle.tableHeader}>Date & time</th>
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
                                        <tr
                                            key={index}
                                            className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}
                                        >
                                            <td className={GlobalStyle.tableData}>{row.dateTime}</td>
                                            <td className={GlobalStyle.tableData}>{row.createdTime}</td>
                                            <td className={GlobalStyle.tableData}>{row.uploadedBy}</td>
                                            <td className={GlobalStyle.tableData}>
                                                <span
                                                    className={`px-2 py-1 rounded-full ${
                                                        row.status === "Open"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-green-100 text-green-800"
                                                    }`}
                                                >
                                                    {row.status}
                                                </span>
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
                        <button
                            className={GlobalStyle.navButton}
                            onClick={handlePrevPage}
                            disabled={currentPage === 0}
                        >
                            <FaArrowLeft />
                        </button>
                        <span>
                            Page {currentPage + 1} of {pages}
                        </span>
                        <button
                            className={GlobalStyle.navButton}
                            onClick={handleNextPage}
                            disabled={currentPage === pages - 1}
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupBulkUploadLog;