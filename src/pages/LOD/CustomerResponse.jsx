/*Purpose:
Created Date: 2025-04-07
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
import { useParams } from "react-router-dom";

const CustomerResponse = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [LODStatus, setLODStatus] = useState("");
    const [DateType, setDateType] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { caseId } = useParams(); // Get the case_id from the URL parameters

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
            <h2 className={GlobalStyle.headingLarge}>Customer Response</h2>

            <div className="flex gap-4 mt-4 justify-center">
                <div className={GlobalStyle.cardContainer}>

                    <div className={`${GlobalStyle.cardContainer} w-full`}>
                        {/* <p className="mb-2">
                            <strong>Case ID:</strong>
                        </p>
                        <p className="mb-2">
                            <strong>Customer Ref:</strong>{" "}
                        </p>
                        <p className="mb-2">
                            <strong>Account no:</strong>{" "}
                        </p>
                        <p className="mb-2">
                            <strong>Arrears Amount:</strong>{" "}
                        </p>
                        <p className="mb-2">
                            <strong>Last Payment Date:</strong>{" "}
                        </p> */}
                        <div class="table w-full">
                            <div class="table-row">
                                <div class="table-cell px-4 py-2 font-bold">Case ID:</div>
                                <div class="table-cell px-4 py-2">[Actual Case ID]</div>
                            </div>
                            <div class="table-row">
                                <div class="table-cell px-4 py-2 font-bold">Customer Ref:</div>
                                <div class="table-cell px-4 py-2">[Actual Customer Ref]</div>
                            </div>
                            <div class="table-row">
                                <div class="table-cell px-4 py-2 font-bold">Account no:</div>
                                <div class="table-cell px-4 py-2">[Actual Account no]</div>
                            </div>
                            <div class="table-row">
                                <div class="table-cell px-4 py-2 font-bold">Arrears Amount:</div>
                                <div class="table-cell px-4 py-2">[Actual Arrears Amount]</div>
                            </div>
                            <div class="table-row">
                                <div class="table-cell px-4 py-2 font-bold">Last Payment Date:</div>
                                <div class="table-cell px-4 py-2">[Actual Last Payment Date]</div>
                            </div>
                        </div>
                    </div>


                    {/* Select Box */}
                    <div className="flex flex-justify-between items-center space-x-6">
                        <label className={`${GlobalStyle.headingSmall} mb-1`}>
                            Customer Response:
                        </label>
                        <select className={GlobalStyle.selectBox}>
                            <option value="" hidden>Customer Response</option>
                            <option value="Agree to Settle">Agree to Settle</option>
                            <option value="Customer Dispute">Customer Dispute</option>
                            <option value="Request More Information">Request More Information</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className={GlobalStyle.remarkTopic}>Remark</label>
                        <textarea
                            value=""
                            className={`${GlobalStyle.remark} w-full`}
                            rows="5"
                        ></textarea>
                    </div>

                    {/* Button */}
                    <dev className="flex justify-end space-x-2">
                        <button
                            className={`${GlobalStyle.buttonPrimary}`}
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            Submit
                        </button>
                    </dev>
                </div>
            </div>

            <h2 className={`${GlobalStyle.headingMedium}`}><b>Response History</b></h2>

            <div className={`${GlobalStyle.tableContainer} mt-4`}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>DTM</th>
                            <th className={GlobalStyle.tableHeader}>Response</th>
                            <th className={GlobalStyle.tableHeader}>Remark</th>
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
                                    <td className={GlobalStyle.tableData}>{log.CustomerTypeName}</td>
                                    <td className={GlobalStyle.tableData}>{log.AccountManagerCode}</td>
                                    <td className={GlobalStyle.tableData}>{log.SourceType}</td>
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
        </div>
    );


};


export default CustomerResponse;