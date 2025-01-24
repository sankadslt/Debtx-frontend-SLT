import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";


const CaseDistributionDRCSummary = () => {
    // Sample data for the table
    const data = [
        {
            batchId: "B1",
            created_dtm: "C002",
            drc: "CMS",
            count: "5",
            total_arrears: "12",
            proceed_on: "100",
            action_type: "Pending",

        },
        {
            batchId: "B2",
            created_dtm: "C001",
            drc: "RTOM",
            count: "5",
            total_arrears: "12",
            proceed_on: "100",
            action_type: "Pending",
        },
        {
            batchId: "B1",
            created_dtm: "C001",
            drc: "RTOM",
            count: "5",
            total_arrears: "12",
            proceed_on: "100",
            action_type: "Pending",
        },
        {
            batchId: "B1",
            created_dtm: "C001",
            drc: "RTOM",
            count: "5",
            total_arrears: "12",
            proceed_on: "100",
            action_type: "Pending",
        },
        {
            batchId: "B1",
            created_dtm: "C001",
            drc: "RTOM",
            count: "5",
            total_arrears: "12",
            proceed_on: "100",
            action_type: "Pending",
        },
        {
            batchId: "B1",
            created_dtm: "C001",
            drc: "RTOM",
            count: "5",
            total_arrears: "12",
            proceed_on: "100",
            action_type: "Pending",
        },
        {
            batchId: "B1",
            created_dtm: "C001",
            drc: "RTOM",
            count: "5",
            total_arrears: "12",
            proceed_on: "100",
            action_type: "Pending",
        },
        {
            batchId: "B1",
            created_dtm: "C001",
            drc: "RTOM",
            count: "5",
            total_arrears: "12",
            proceed_on: "100",
            action_type: "Pending",
        },
        {
            batchId: "B1",
            created_dtm: "C001",
            drc: "RTOM",
            count: "5",
            total_arrears: "12",
            proceed_on: "100",
            action_type: "Pending",
        },
    ];

    // State for filters and table
    const [selectedDRC, setSelectedDRC] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [filteredData, setFilteredData] = useState(data);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 7;
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    // Filtering the data based on search query
    const filteredDataBySearch = filteredData.filter((row) =>
        Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
    );

    // Apply pagination to the search-filtered data
    const currentData = filteredDataBySearch.slice(
        indexOfFirstRecord,
        indexOfLastRecord
    );
    const totalPages = Math.ceil(filteredDataBySearch.length / recordsPerPage);

    // Modified handleDRCChange to only update state without filtering
    const handleDRCChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedDRC(selectedValue);
    };

    // Handle filter action - all filtering happens here
    const handleFilter = () => {
        const filtered = data.filter((item) => {
            const drcMatch = selectedDRC === "" || item.drc === selectedDRC;
            const createdDateValid = !fromDate || new Date(item.createdDate) >= new Date(fromDate);
            const approvedOnValid =
                !toDate ||
                item.approvedOn === "mm/dd/yyyy" ||
                new Date(item.approvedOn) <= new Date(toDate);
            return drcMatch && createdDateValid && approvedOnValid;
        });
        setFilteredData(filtered);
        setCurrentPage(1);
    };

    // Handle pagination
    const handlePrevNext = (direction) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        } else if (direction === "next" && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle checkbox selection
    const [selectAll, setSelectAll] = useState(false);
    const [selectedRows, setSelectedRows] = useState(new Set());

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            setSelectedRows(new Set(currentData.map((_, index) => index)));
        } else {
            setSelectedRows(new Set());
        }
    };

    const handleRowSelect = (index) => {
        const newSelectedRows = new Set(selectedRows);
        if (newSelectedRows.has(index)) {
            newSelectedRows.delete(index);
        } else {
            newSelectedRows.add(index);
        }
        setSelectedRows(newSelectedRows);
    };

    const handleCreateTask = () => {
        alert("Create Task and Let Me Know button clicked!");
    };

    const handleCreateTasks = () => {
        alert("Create Task and Let Me Know button clicked!");
    };



    return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Title */}
            <h1 className={GlobalStyle.headingLarge}>Distributed DRC Summary</h1>

            {/* Filter Section */}
            <div className="flex px-3 py-2 items-center justify-end gap-4 mt-20 mb-4">
                {/* DRC Select Dropdown */}
                <select
                    className={GlobalStyle.selectBox}
                    value={selectedDRC}
                    onChange={handleDRCChange}
                >
                    <option value="">DRC</option>
                    {["CMS", "TCM", "RE", "CO LAN", "ACCIVA", "VISONCOM", "PROMPT"].map(
                        (drc) => (
                            <option key={drc} value={drc}>
                                {drc}
                            </option>
                        )
                    )}
                </select>



                {/* Date Picker */}
                <div className="flex items-center gap-2">
                    <div className={GlobalStyle.datePickerContainer}>
                        <label className={GlobalStyle.dataPickerDate}>Date </label>
                        <DatePicker
                            selected={fromDate}
                            onChange={(date) => setFromDate(date)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="dd/MM/yyyy"
                            className={GlobalStyle.inputText}
                        />
                        <DatePicker
                            selected={toDate}
                            onChange={(date) => setToDate(date)}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="dd/MM/yyyy"
                            className={GlobalStyle.inputText}
                        />
                    </div>
                </div>

                <select
                    className={GlobalStyle.selectBox}
                    value={selectedDRC}
                    onChange={handleDRCChange}
                >
                    <option value="">Status</option>
                    {["Pending", "Approved", "Rejected"].map(
                        (drc) => (
                            <option key={drc} value={drc}>
                                {drc}
                            </option>
                        )
                    )}
                </select>

                {/* Filter Button */}
                <button
                    onClick={handleFilter}
                    className={`${GlobalStyle.buttonPrimary}`}
                >
                    Filter
                </button>
            </div>

            {/* Search Section */}
            <div className="flex justify-start mb-4">
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
                            <th className={GlobalStyle.tableHeader}></th>
                            <th className={GlobalStyle.tableHeader}>Batch ID</th>
                            <th className={GlobalStyle.tableHeader}>Created dtm</th>
                            <th className={GlobalStyle.tableHeader}>DRC</th>
                            <th className={GlobalStyle.tableHeader}>Count</th>
                            <th className={GlobalStyle.tableHeader}>Total Arreas</th>
                            <th className={GlobalStyle.tableHeader}>Proceed On</th>
                            <th className={GlobalStyle.tableHeader}></th>

                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr
                                key={item.caseId}
                                className={
                                    index % 2 === 0
                                        ? GlobalStyle.tableRowEven
                                        : GlobalStyle.tableRowOdd
                                }
                            >
                                <td className="text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.has(index)}
                                        onChange={() => handleRowSelect(index)}
                                        className="mx-auto"
                                    />
                                </td>
                                <td className={GlobalStyle.tableData}>{item.batchId}</td>
                                <td className={GlobalStyle.tableData}>{item.created_dtm}</td>
                                <td className={GlobalStyle.tableData}>{item.drc}</td>
                                <td className={GlobalStyle.tableData}>{item.count}</td>
                                <td className={GlobalStyle.tableData}>{item.total_arrears}</td>
                                <td className={GlobalStyle.tableData}>{item.proceed_on}</td>
                                <td className="px-6 py-4 text-center">

                                    <button onClick={handleCreateTasks}>

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={26}
                                            height={29}
                                            fill="none"

                                        >
                                            <path
                                                fill="#000"
                                                fillRule="evenodd"
                                                d="M13 .32c7.18 0 13 5.821 13 13 0 7.18-5.82 13-13 13s-13-5.82-13-13c0-7.179 5.82-13 13-13Zm5.85 11.05a1.95 1.95 0 1 0 0 3.901 1.95 1.95 0 0 0 0-3.9Zm-5.85 0a1.95 1.95 0 1 0 0 3.901 1.95 1.95 0 0 0 0-3.9Zm-5.85 0a1.95 1.95 0 1 0 0 3.901 1.95 1.95 0 0 0 0-3.9Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>

                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>

            {/* Pagination Section */}
            <div className={GlobalStyle.navButtonContainer}>
                <button
                    onClick={() => handlePrevNext("prev")}
                    disabled={currentPage === 1}
                    className={`${GlobalStyle.navButton} ${currentPage === 1 ? "cursor-not-allowed" : ""
                        }`}
                >
                    <FaArrowLeft />
                </button>
                <span className={`${GlobalStyle.pageIndicator} mx-4`}>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePrevNext("next")}
                    disabled={currentPage === totalPages}
                    className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""
                        }`}
                >
                    <FaArrowRight />
                </button>
            </div>

            {/* Select All Data Checkbox and Buttons */}
            <div className="flex justify-end items-center mt-4">
                {/* Left-aligned button */}
                <button
                    onClick={handleCreateTask}
                    className={GlobalStyle.buttonPrimary} // Same style as Approve button
                >

                    Create Task and Let Me Know
                </button>

            </div>



        </div>

    );
};

export default CaseDistributionDRCSummary;
