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
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { getLoggedUserId } from "../../services/auth/authService.js";
import { Creat_Customer_Responce } from "../../services/LOD/LOD.js";
import { case_details_for_lod_final_reminder } from "../../services/LOD/LOD.js";

const CustomerResponse = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [LODStatus, setLODStatus] = useState("");
    const [DateType, setDateType] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [ResponseType, setResponseType] = useState("");
    const [ResponseRemark, setResponseRemark] = useState("");
    const [isResponseHistory, setIsResponseHistory] = useState(false);
    const navigate = useNavigate();
    const { caseId } = useParams(); // Get the case_id from the URL parameters
    const rowsPerPage = 10; // Number of rows per page

    // Handle Submit button
    const handleSubmit = async () => {
        if (!ResponseType || !ResponseRemark) {
            Swal.fire("Error", "Please enter both Customer Response and Remark", "error");
            return;
        }

        const userData = await getLoggedUserId();

        try {
            // const intLODCount = parseInt(LODCount, 10);
            const response = await Creat_Customer_Responce(caseId, ResponseType, ResponseRemark, userData);
            Swal.fire("Success", `Customer Response created successfully!`, "success");
            setResponseType("");
            setResponseRemark("");
            fetchCaseDetails({});
        } catch (error) {
            Swal.fire("Error", error.message || "Failed to create task.", "error");
        }
    }

    // Handle History Response button
    const handleHistoryResponse = () => {
        setIsResponseHistory(true);
    }

    // Fetch details of the case
    const fetchCaseDetails = async () => {
        setIsLoading(true);
        try {
            console.log(caseId);
            const CaseDetails = await case_details_for_lod_final_reminder(caseId);
            setData(CaseDetails);
            console.log(CaseDetails.lod_response);
        } catch (error) {
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCaseDetails();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const lodResponse = data.lod_response || [];
    const pages = Math.ceil(lodResponse.length / rowsPerPage);
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = lodResponse.slice(startIndex, endIndex);

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

    const handleBackButton = () => {
        if (data.current_document_type === "LOD") {
            navigate("/pages/LOD/LODLog");
        } else {
            navigate("/pages/LOD/FinalReminderList");
        }
    }

    return (
        <div className={GlobalStyle.fontPoppins}>
            <h2 className={GlobalStyle.headingLarge}>Customer Response</h2>

            <div className="flex gap-4 mt-4 justify-center">
                <div className={GlobalStyle.cardContainer}>

                    <div className={`${GlobalStyle.cardContainer} w-full`}>
                        <div className="table w-full">
                            <div className="table-row">
                                <div className="table-cell px-4 py-2 font-bold">Case ID</div>
                                <div className="table-cell px-4 py-2 font-bold">:</div>
                                <div className="table-cell px-4 py-2">{data.case_id}</div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell px-4 py-2 font-bold">Customer Ref</div>
                                <div className="table-cell px-4 py-2 font-bold">:</div>
                                <div className="table-cell px-4 py-2">{data.customer_ref}</div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell px-4 py-2 font-bold">Account no</div>
                                <div className="table-cell px-4 py-2 font-bold">:</div>
                                <div className="table-cell px-4 py-2">{data.account_no}</div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell px-4 py-2 font-bold">Arrears Amount</div>
                                <div className="table-cell px-4 py-2 font-bold">:</div>
                                <div className="table-cell px-4 py-2">
                                    {data?.arrears_amount &&
                                        data.arrears_amount.toLocaleString("en-LK", {
                                            style: "currency",
                                            currency: "LKR",
                                        })
                                    }
                                </div>
                            </div>
                            <div className="table-row">
                                <div className="table-cell px-4 py-2 font-bold">Last Payment Date</div>
                                <div className="table-cell px-4 py-2 font-bold">:</div>
                                <div className="table-cell px-4 py-2">
                                    {data?.last_payment_date &&
                                        new Date(data.last_payment_date).toLocaleString("en-GB", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                            hour12: true,
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Select Box */}
                    <div className="flex flex-justify-between items-center space-x-6">
                        <label className={`${GlobalStyle.headingSmall} mb-1`}>
                            Customer Response:
                        </label>
                        <select
                            value={ResponseType}
                            className={GlobalStyle.selectBox}
                            onChange={(e) => {
                                setResponseType(e.target.value);
                            }}
                            style={{ color: ResponseType === "" ? "gray" : "black" }}
                        >
                            <option value="" hidden>Customer Response</option>
                            <option value="Agree to Settle">Agree to Settle</option>
                            <option value="Customer Dispute">Customer Dispute</option>
                            <option value="Request More Information">Request More Information</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className={GlobalStyle.remarkTopic}>Remark</label>
                        <textarea
                            value={ResponseRemark}
                            onChange={(e) => setResponseRemark(e.target.value)}
                            className={`${GlobalStyle.remark} w-full`}
                            rows="5"
                        ></textarea>
                    </div>

                    {/* Button */}
                    <dev className="flex justify-end space-x-2">
                        <button
                            className={`${GlobalStyle.buttonPrimary}`}
                            style={{ display: 'flex', alignItems: 'center' }}
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </dev>
                </div>
            </div>

            {!isResponseHistory && (
                <button
                    className={`${GlobalStyle.buttonPrimary} mb-4`}
                    style={{ display: 'flex', alignItems: 'center' }}
                    onClick={handleHistoryResponse}
                >
                    Response History
                </button>
            )}

            {isResponseHistory && (
                <div>
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
                                {paginatedData.length > 0 ? (
                                    paginatedData.map((log, index) => (
                                        <tr
                                            key={index}
                                            className={`${index % 2 === 0
                                                ? "bg-white bg-opacity-75"
                                                : "bg-gray-50 bg-opacity-50"
                                                } border-b`}
                                        >
                                            <td className={GlobalStyle.tableData}>
                                                {/* {log.created_on} */}
                                                {log?.created_on &&
                                                    new Date(log.created_on).toLocaleString("en-GB", {
                                                        year: "numeric",
                                                        month: "2-digit",
                                                        day: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        second: "2-digit",
                                                        hour12: true,
                                                    })}
                                            </td>
                                            <td className={GlobalStyle.tableData}>{log.response_type}</td>
                                            <td className={GlobalStyle.tableData}>{log.lod_remark}</td>
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
                </div>
            )}

            <div>
                <button
                    className={GlobalStyle.navButton}
                    onClick={handleBackButton}
                >
                    <FaArrowLeft />
                </button>
            </div>
        </div>
    );


};


export default CustomerResponse;