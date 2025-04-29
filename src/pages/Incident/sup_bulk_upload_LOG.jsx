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
import {List_Transaction_Logs_Upload_Files} from "../../services/Incidents/incidentService.js";
import { useNavigate } from 'react-router-dom';
import { Tooltip } from "react-tooltip";



// Function to get the status icon based on the status value
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



    // Function to validate the selected dates and status before fetching data
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

    // Function to fetch data from the API
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const requestBody = {};
            if (fromDate) requestBody.From_Date = fromDate.toISOString();
            if (toDate) requestBody.To_Date = toDate.toISOString();
            if (status) requestBody.status = status;
            

            // const response = await fetch("http://localhost:5000/api/incident/List_Transaction_Logs_Upload_Files", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(requestBody),
            // });

             const response = await List_Transaction_Logs_Upload_Files(requestBody);
        
             console.log("Request Body:", requestBody);

            //const response = await List_Transaction_Logs_Upload_Files(requestBody);

            

            const result = await response;
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
            Swal.fire({
                title: "Error",
                text: "Failed to fetch data. Please try again later.",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "OK"
            });
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [fromDate, toDate, status]);

    // Fetch data when the component mounts or when the filters change
    useEffect(() => {
        fetchData();
    }, [fetchData, fromDate, toDate, status]);


    const filteredData = data.filter((row) =>
        Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pages = Math.ceil(filteredData.length / rowsPerPage);
    const startIndex = currentPage * rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

    // Function to clear filters and reset the state
    const clearFilters = () => {
        setFromDate(null);
        setToDate(null);
        setStatus("");
        setSelectedFromDate(null);
        setSelectedToDate(null);
        setSelectedStatus("");
        fetchData();
    }
    const navigate = useNavigate();

    const handleUploadClick = () => {
        navigate('/incident/register-bulk'); // Navigate to the Bulk Upload page

    };

    return (
        <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
            <div className="flex items-center justify-between mb-6">
                <h1 className={`${GlobalStyle.headingLarge}`}>Incident Upload Log</h1>
                <button className={GlobalStyle.buttonPrimary} onClick={handleUploadClick}>
                    Upload a new file
                </button>
            </div>
            {/* Filters */}
            <div className="flex justify-end ">
            <div className= {`${GlobalStyle.cardContainer}  w-[70vw] mb-8 mt-8  `} > {/* Filter Section Small issue with the viewport width. or 
                                                                                        else can use  w-3/4  */}
                <div className="flex items-center gap-4 justify-end">
                    
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className={GlobalStyle.selectBox} style={{ color: selectedStatus === "" ? "gray" : "black" }}>
                        <option value="" hidden>Status</option>
                        <option value="Open" style={{ color: "black" }}>Open</option>
                        <option value="InProgress" style={{ color: "black" }}>In Progress</option>
                        <option value="Reject" style={{ color: "black" }}>Reject</option>
                    </select>
                    <label className={GlobalStyle.dataPickerDate}>Date:</label>
                    
                    <DatePicker
                        selected={selectedFromDate}
                        onChange={(date) =>{
                            if (selectedToDate && date > selectedToDate) {
                                Swal.fire({
                                    title: "Invalid Date Selection!",
                                    text: "The 'From' date cannot be later than the 'To' date.",
                                    icon: "error",
                                    confirmButtonColor: "#f1c40f",
                                    confirmButtonText: "OK"
                                });
                            } else if (selectedToDate) {
                                // Check month gap
                                const diffInMs = selectedToDate - date;
                                const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                    
                                if (diffInDays > 31) {
                                    Swal.fire({
                                        title: "Invalid Range!",
                                        text: "The range between From and To dates cannot be more than 1 month.",
                                        icon: "warning",
                                        confirmButtonColor: "#f1c40f",
                                        confirmButtonText: "OK"
                                    });
                                    return; // Don't set the date
                                }
                    
                                setSelectedFromDate(date);
                            } else {
                                setSelectedFromDate(date);
                            }
                        }}
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
                                    confirmButtonColor: "#f1c40f",
                                    confirmButtonText: "OK"
                                });
                            } else if (selectedFromDate) {
                                // Check month gap
                                const diffInMs = date - selectedFromDate;
                                const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                    
                                if (diffInDays > 31) {
                                    Swal.fire({
                                        title: "Invalid Range!",
                                        text: "The range between From and To dates cannot be more than 1 month.",
                                        icon: "warning",
                                        confirmButtonColor: "#f1c40f",
                                        confirmButtonText: "OK"
                                    });
                                    return; // Don't set the date
                                }
                    
                                setSelectedToDate(date);
                            } else {
                                setSelectedToDate(date);
                            }

                        }}
                        
                        dateFormat="dd/MM/yyyy"
                        placeholderText="To"
                        className={GlobalStyle.inputText}
                    />
                    <button className={GlobalStyle.buttonPrimary} onClick={validateAndFetchData}>
                        Filter
                    </button>
                    <button className={GlobalStyle.buttonRemove} onClick={clearFilters}>
                        Clear
                    </button>
                </div>
                {/* {error && <span className={GlobalStyle.errorText}>{error}</span>} */}
            </div>
            </div>

            {/* Search Bar */}
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

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : (
                /* Table */
                <div className={GlobalStyle.tableContainer}>
                    <table className={GlobalStyle.table}>
                        <thead className={GlobalStyle.thead}>
                            <tr>
                                <th className={GlobalStyle.tableHeader}>Status</th>
                                <th className={GlobalStyle.tableHeader}>Uploaded By</th>
                                <th className={GlobalStyle.tableHeader}>File Name</th>
                                <th className={GlobalStyle.tableHeader}>Type</th>
                                <th className={GlobalStyle.tableHeader}>Date & Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, index) => (
                                    <tr key={index} className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}>

                                        <td className={`${GlobalStyle.tableData} flex justify-center mt-2`}>
                                            <div className="flex items-center gap-2">
                                                <img src={getStatusIcon(row.status)} alt={row.status} data-tooltip-id={`tooltip-${index}`} className="w-6 h-6" />
                                                <Tooltip id={`tooltip-${index}`} place="bottom" effect="solid">
                                                    {row.status}
                                                </Tooltip>
                            
                                            </div>
                                        </td>
                                       
                                        <td className={GlobalStyle.tableData}>{row.uploadedBy}</td>
                                        <td className={GlobalStyle.tableData}>{row.fileName}</td>
                                        <td className={GlobalStyle.tableData}>{row.type}</td>
                                        <td className={GlobalStyle.tableData}> {new Date(row.dateTime).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })} , 
                                        {row.createdTime}</td>
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