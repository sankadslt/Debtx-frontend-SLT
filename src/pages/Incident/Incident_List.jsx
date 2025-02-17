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
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import axios from "axios";
import PropTypes from "prop-types";

import Swal from "sweetalert2";
import StatusIcon from '../../components/StatusIcon';

import { fetchIncidents } from "../../services/Incidents/incidentService";
import { Task_for_Download_Incidents } from "../../services/task/taskService.js";

const Incident_List = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const rowsPerPage = 8;
    const [status1, setStatus1] = useState("");
    const [status2, setStatus2] = useState("");
    const [status3, setStatus3] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [isFiltered, setIsFiltered] = useState(false);
    const navigate = useNavigate();

    const fetchData = async (filters) => {
        setIsLoading(true);
        try {
            const incidents = await fetchIncidents(filters);
            setData(incidents);
            setIsFiltered(incidents.length > 0);
        } catch (error) {
            setIsFiltered(false);
            Swal.fire("Error", error.message || "No incidents matching the criteria.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilter = async () => {
        try { if (!fromDate || !toDate) {
            Swal.fire("Error", "Both 'From' and 'To' dates are required.", "error");
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
    } catch (error) { Swal.fire("Error", error.message || "No incidents matching the criteria", "error")}
};

    const HandleCreateTask = async () => {

        if (!fromDate || !toDate) {
            Swal.fire("Error", "Both 'From' and 'To' dates are required.", "error");
            return;
        }
        if (!isFiltered) {
            Swal.fire("Error", "Please apply filters that return data before creating a task.", "error");
            return;
        }



        const adjustToLocalISO = (date) => {
            const offset = date.getTimezoneOffset() * 60000;
            return new Date(date.getTime() - offset).toISOString();
        };
        const requestData = {
            DRC_Action: status1,
            Incident_Status: status2,
            Source_Type: status3,
            From_Date: adjustToLocalISO(fromDate),
            To_Date: adjustToLocalISO(toDate),
            Created_By: "Admin"
        };

        setIsCreatingTask(true);
        try {
            const response = await Task_for_Download_Incidents(requestData);
            Swal.fire("Success", `Task created successfully! Task ID: ${response.Task_Id}`, "success");
        } catch (error) {
            Swal.fire("Error", error.message || "Failed to create task.", "error");
        } finally {
            setIsCreatingTask(false);
        }
    };

    useEffect(() => {
        fetchData({});
    }, []);

    const HandleAddIncident = () => navigate("/incident/register");

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

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
    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < pages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };



    return (
        <div className={GlobalStyle.fontPoppins}>
            <h2 className={GlobalStyle.headingLarge}>Incident Log</h2>

            <div className="flex justify-end mt-6">
                <button onClick={HandleAddIncident} className={GlobalStyle.buttonPrimary}>
                    Add Incident
                </button>
            </div>

            <div className="w-full mb-8 mt-8">
            <div className="flex items-center justify-end w-full space-x-6">
                <select value={status1} onChange={(e) => setStatus1(e.target.value)} className={GlobalStyle.selectBox}>
                    <option value="">Action Type</option>
                    <option value="collect arrears">collect arrears</option>
                    <option value="collect arrears and CPE">collect arrears and CPE</option>
                    <option value="collect CPE">collect CPE</option>
                </select>

                <select value={status2} onChange={(e) => setStatus2(e.target.value)} className={GlobalStyle.selectBox}>
                    <option value="">Status</option>
                    <option value="Incident Open">Incident Open</option>
                    <option value="Incident Reject">Incident Reject</option>
                </select>

                <select value={status3} onChange={(e) => setStatus3(e.target.value)} className={GlobalStyle.selectBox}>
                    <option value="">Source Type</option>
                    <option value="Pilot Suspended">Pilot Suspended</option>
                    <option value="Product Terminate">Product Terminate</option>
                    <option value="Special">Special</option>
                </select>

                <DatePicker selected={fromDate} onChange={setFromDate} dateFormat="dd/MM/yyyy" placeholderText="From Date" className={GlobalStyle.inputText} />
                <DatePicker selected={toDate} onChange={setToDate} dateFormat="dd/MM/yyyy" placeholderText="To Date" className={GlobalStyle.inputText} />

                <button onClick={handleFilter} className={GlobalStyle.buttonPrimary}>Filter</button>
            </div>
            </div>

            <div className="mb-4 flex justify-start">
                <div className={GlobalStyle.searchBarContainer}>
                    <input
                        type="text"
                        placeholder="Search"
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
                            <th className={GlobalStyle.tableHeader}>ID</th>
                            <th className={GlobalStyle.tableHeader}>Status</th>
                            <th className={GlobalStyle.tableHeader}>Account No.</th>
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
                                    <td className={'${GlobalStyle.tableData} flex justify-center mt-2'}>
                                        <StatusIcon status={log.status} />
                                    </td>
                                    <td className={GlobalStyle.tableData}>{log.accountNo}</td>
                                    <td className={GlobalStyle.tableData}>{log.action}</td>
                                    <td className={GlobalStyle.tableData}>{log.sourceType}</td>
                                    <td className={GlobalStyle.tableData}>{log.createdDTM}</td>
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
                    Page {currentPage + 1} of {pages}
                </span>
                <button className={GlobalStyle.navButton} onClick={handleNextPage} disabled={currentPage === pages - 1}>
                    <FaArrowRight />
                </button>
            </div>

           
            <div className="flex justify-end mt-6">
                <button 
                    onClick={HandleCreateTask} 
                    className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? 'opacity-50' : ''}`}
                    disabled={isCreatingTask}
                >
                    {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'}
                </button>
            </div>
        </div>
    );
};

// StatusIcon.propTypes = {
//     status: PropTypes.string.isRequired,
// };

export default Incident_List;