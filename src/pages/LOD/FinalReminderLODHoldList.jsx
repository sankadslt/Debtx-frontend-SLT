/*Purpose:
Created Date: 2025-04-09
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
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { FaArrowLeft, FaArrowRight, FaSearch, FaEdit, FaEye } from "react-icons/fa";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import { List_Final_Reminder_Lod_Cases } from "../../services/LOD/LOD.js";

const Final_Reminder_LOD_Hold_List = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [LODStatus, setLODStatus] = useState("");
    const [DateType, setDateType] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeWithdrawPopupLODID, setActiveWithdrawPopupLODID] = useState(null);
    const [WithdrawRemark, setWithdrawRemark] = useState("");
    // const navigate = useNavigate();

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

    // fetching case details everytime currentpage changes
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

    // display loading animation when data is loading
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // handle search
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
                nextPage + 1
            );

            // Next page will displayed only if fetch data is not empty
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

    const handleWithdrawPopup = (LODID) => {
        setActiveWithdrawPopupLODID(LODID);
        setWithdrawRemark("");
    };

    const closeWithdrawPopup = () => {
        setActiveWithdrawPopupLODID(null);
    };

    const handleWithdraw = () => {
        if (!WithdrawRemark.trim()) {
            Swal.fire("Error", "Please enter a remark for the withdraw.", "error");
            return;
        }

        closeWithdrawPopup();
    };

    const WithdrawFinalReminderLOD = async () => {
        if (!activeWithdrawPopupLODID) {
            Swal.fire("Error", "Please select a LOD or Final Reminder.", "error");
            return;
        }

        const userData = await getLoggedUserId(); // Assign user ID

    };

    return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Title */}
            <h2 className={GlobalStyle.headingLarge}>Letter of Demand Hold List</h2>

            {/* filters */}
            <div className={`${GlobalStyle.cardContainer} w-full`}>

                <div className="flex items-center justify-end w-full space-x-6">
                    <select value={LODStatus} onChange={(e) => setLODStatus(e.target.value)} style={{ color: LODStatus === "" ? "gray" : "black" }} className={GlobalStyle.selectBox}>
                        <option value="" hidden>LOD Type</option>
                        <option value="Initial LOD">LOD</option>
                        <option value="LOD Settle Pending">Final Reminder</option>
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

                    <button onClick={fetchData} className={GlobalStyle.buttonPrimary}>Filter</button>
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
                            <th className={GlobalStyle.tableHeader}>Case No</th>
                            <th className={GlobalStyle.tableHeader}>Status</th>
                            <th className={GlobalStyle.tableHeader}>LOD Type</th>
                            <th className={GlobalStyle.tableHeader}>Hold By</th>
                            <th className={GlobalStyle.tableHeader}>Hold DTM</th>
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
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                // onClick={fetchData}
                                                className={GlobalStyle.buttonPrimary}
                                            >
                                                Proceed
                                            </button>
                                            <button
                                                onClick={() => handleWithdrawPopup(log.LODID)}
                                                className={GlobalStyle.buttonPrimary}
                                            >
                                                Withdraw
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

            {activeWithdrawPopupLODID && (
                <div className={GlobalStyle.popupBoxContainer}>
                    <div className={GlobalStyle.popupBoxBody}>
                        <div className={GlobalStyle.popupBox}>
                            <h2 className={GlobalStyle.popupBoxTitle}>
                                Withdraw Case
                            </h2>
                            <button
                                className={GlobalStyle.popupBoxCloseButton}
                                onClick={() => closeWithdrawPopup()}
                            >
                                ×
                            </button>
                        </div>
                        <div>
                            <div className="mb-6">
                                <label className={GlobalStyle.remarkTopic}>Remark</label>
                                <textarea
                                    value={WithdrawRemark}
                                    onChange={(e) => setWithdrawRemark(e.target.value)}
                                    className={`${GlobalStyle.remark} w-full`}
                                    rows="5"
                                ></textarea>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleWithdraw}
                                    className={`${GlobalStyle.buttonPrimary} mr-4`}
                                >
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Page nevigation buttons */}
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


export default Final_Reminder_LOD_Hold_List;