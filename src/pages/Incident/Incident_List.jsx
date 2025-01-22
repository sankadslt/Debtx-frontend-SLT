/*Purpose:
Created Date: 2025-01-09
Created By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Last Modified Date: 2025-01-09
Modified By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Last Modified Date: 2025-01-20
Modified By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
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

// Status Icon Component
const StatusIcon = ({ status }) => {
    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'incident open':
                return '/src/assets/images/incidents/Incident_Open.png';
            case 'incident reject':
                return '/src/assets/images/incidents/Incident_Reject.png';
            case 'incident inprogress':
                return '/src/assets/images/incidents/Incident_InProgress.png';
            default:
                return null;
        }
    };

    const iconPath = getStatusIcon(status);
    
    if (!iconPath) {
        return <span>{status}</span>;
    }

    return (
        <img 
            src={iconPath} 
            alt={status}
            className="w-6 h-6"
            title={status}
        />
    );
};

const Incident_List = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const rowsPerPage = 7;
    const [fromDate, setFromDate] = useState(null); 
    const [toDate, setToDate] = useState(null); 

    const [error, setError] = useState(""); 
    const [status1, setStatus1] = useState("");
    const [status2, setStatus2] = useState("");
    const [status3, setStatus3] = useState("");
    const [data, setData] = useState([]);
 
    const [activeFilters, setActiveFilters] = useState({
        Actions: "",
        Incident_Status: "",
        From_Date: null,
        To_Date: null
    });
    const fetchData = async (filters) => {
        try {
            const response = await axios.post("http://localhost:5000/api/incident/List_Incidents", filters);
            
            const mappedData = response.data.incidents.map(incident => ({
                caseID: incident.Incident_Id,
                status: incident.Incident_Status,
                accountNo: incident.Account_Num,
                action: incident.Actions,
                sourceType: incident.Source_Type,
                createdDTM: new Date(incident.Created_Dtm).toLocaleString()
            }));
            
            setData(mappedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(activeFilters);
    }, [activeFilters]); // Added dependency array to prevent infinite loop


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
        if ((fromDate && !toDate) || (!fromDate && toDate)) {
            setError("Both 'From' and 'To' dates must be selected together.");
            return;
        }

        setError("");

        const newFilters = {
            Actions: status1,
            Incident_Status: status2,
            From_Date: fromDate ? fromDate.toISOString() : null,
            To_Date: toDate ? toDate.toISOString() : null
        };
        
        setActiveFilters(newFilters);
        setCurrentPage(0);
    };

    const filteredData = data.filter((row) =>
    const filteredData = data
    .filter((row) =>
      
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

    const navigate = useNavigate();
    const HandleAddIncident = () => navigate("/add-incident");
    const HandleCreateTask = () => navigate("/add-incident");


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
                    <select
                        value={status1}
                        onChange={(e) => setStatus1(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">Action Type</option>
                        <option value="collect arrears">collect arrears</option>
                        <option value="collect arrears and CPE">collect arrears and CPE</option>
                        <option value="collect CPE">collect CPE</option>


                    </select>

                    <select
                        value={status2}
                        onChange={(e) => setStatus2(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">Status</option>
                        <option value="Incident Open">Incident Open</option>
                        <option value="Incident Reject">Incident Reject</option>


                    </select>

                    <select
                        value={status3}
                        onChange={(e) => setStatus3(e.target.value)}
                        className={GlobalStyle.selectBox}
                    >
                        <option value="">Source Type</option>
                        <option value="Pilot Suspended">Pilot Suspended</option>
                        <option value="Product Terminate">Product Terminate</option>
                        <option value="Special">Special</option>
                    </select>

                    <div className="flex flex-col mb-4">
                        <div className={GlobalStyle.datePickerContainer}>
                            <label className={GlobalStyle.dataPickerDate}>Date </label>
                            <DatePicker
                                selected={fromDate}
                                onChange={handleFromDateChange}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/MM/yyyy"
                                className={GlobalStyle.inputText}
                            />
                            <DatePicker
                                selected={toDate}
                                onChange={handleToDateChange}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="dd/MM/yyyy"
                                className={GlobalStyle.inputText}
                            />
                        </div>
                        {error && <span className={GlobalStyle.errorText}>{error}</span>}
                    </div>

                    <button onClick={handleFilter} className={GlobalStyle.buttonPrimary}>
                        Filter
                    </button>
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
                        {paginatedData.map((log, index) => (
                            <tr

                                key={index}
                                className={`${
                                    index % 2 === 0
                                        ? "bg-white bg-opacity-75"
                                        : "bg-gray-50 bg-opacity-50"
                                } border-b`}
                            >

                                <td className={GlobalStyle.tableData}>{log.caseID}</td>
                                <td className={'${GlobalStyle.tableData} flex justify-center'}>
                                    <StatusIcon status={log.status} />
                                </td>
                                <td className={GlobalStyle.tableData}>{log.accountNo}</td>
                                <td className={GlobalStyle.tableData}>{log.action}</td>
                                <td className={GlobalStyle.tableData}>{log.sourceType}</td>
                                <td className={GlobalStyle.tableData}>{log.createdDTM}</td>
                            </tr>
                        ))}
                        {paginatedData.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    No logs found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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

            <div className="flex justify-end mt-6">
                <button onClick={HandleCreateTask} className={GlobalStyle.buttonPrimary}>
                    Create task and let me know
                </button>
            </div>
        </div>
    );
};

export default Incident_List;