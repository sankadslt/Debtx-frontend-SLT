/*Purpose:
Created Date: 2025-04-07
Created By: Janani Kumarasiri (jkktg001@gmail.com)
Last Modified Date: 
Modified By: 
Last Modified Date: 
Modified By: 
Version: React v18
ui number : 3.6
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */


import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { getLoggedUserId } from "../../services/auth/authService.js";
import { Creat_Customer_Responce } from "../../services/LOD/LOD.js";
import { case_details_for_lod_final_reminder } from "../../services/LOD/LOD.js";
import { jwtDecode } from "jwt-decode";

const CustomerResponse = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [LODdata, setLODData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [ResponseType, setResponseType] = useState("");
    const [ResponseRemark, setResponseRemark] = useState("");
    const [isResponseHistory, setIsResponseHistory] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Get the location object from react-router-dom
    const { caseId } = location.state || {}; // Get the case_id from the URL parameters
    const rowsPerPage = 10; // Number of rows per page
    const [userRole, setUserRole] = useState(null); // Role-Based Buttons

    // Role-Based Buttons
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            let decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                refreshAccessToken().then((newToken) => {
                    if (!newToken) return;
                    const newDecoded = jwtDecode(newToken);
                    setUserRole(newDecoded.role);
                });
            } else {
                setUserRole(decoded.role);
            }
        } catch (error) {
            console.error("Invalid token:", error);
        }
    }, []);

    // Handle Submit button
    const handleSubmit = async () => {
        if (!ResponseType || !ResponseRemark) {
            Swal.fire({
                title: "Error",
                text: "Please enter both Customer Response and Remark",
                icon: "error",
                confirmButtonColor: "#d33",
            });
            return;
        }

        const userData = await getLoggedUserId();

        try {
            // const intLODCount = parseInt(LODCount, 10);
            const response = await Creat_Customer_Responce(caseId, ResponseType, ResponseRemark, userData);
            // console.log(response)
            if (response === "success") {
                Swal.fire({
                    title: response,
                    text: `Customer Response created successfully!`,
                    icon: "success",
                    confirmButtonColor: "#28a745",
                });
                setResponseType("");
                setResponseRemark("");
                fetchCaseDetails({});
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message || "Failed to create task.",
                icon: "error",
                confirmButtonColor: "#d33",
            });
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
            setLODData(CaseDetails);
            console.log(CaseDetails.lod_response);
        } catch (error) {
            setLODData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCaseDetails();
    }, []);

    // display loading animation when data is loading
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // variables need for table
    const lodResponse = LODdata.lod_response || [];
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
        if (LODdata.current_document_type === "LOD") {
            navigate("/pages/LOD/LODLog");
        } else {
            navigate("/pages/LOD/FinalReminderList");
        }
    }

    return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Title */}
            <h2 className={GlobalStyle.headingLarge}>Customer Response</h2>

            {/* Case Details card */}
            <div className="flex justify-center mb-4">
                <div className={`${GlobalStyle.cardContainer}`}>
                    <div className="table w-full">
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Case ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{LODdata.case_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Customer Ref</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{LODdata.customer_ref}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Account no</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{LODdata.account_no}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Arrears Amount</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {LODdata?.arrears_amount &&
                                    LODdata.arrears_amount.toLocaleString("en-LK", {
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
                                {LODdata?.last_payment_date &&
                                    new Date(LODdata.last_payment_date).toLocaleString("en-GB", {
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
            </div>

            {/* create custome response */}
            <div className="flex gap-4 mt-4 justify-center">
                <div className={GlobalStyle.cardContainer}>
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
                            <option value="Agree to Settle" style={{ color: "black" }}>Agree to Settle</option>
                            <option value="Customer Dispute" style={{ color: "black" }}>Customer Dispute</option>
                            <option value="Request More Information" style={{ color: "black" }}>Request More Information</option>
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
                        {["admin", "superadmin", "slt"].includes(userRole) && (
                            <button
                                className={`${GlobalStyle.buttonPrimary}`}
                                style={{ display: 'flex', alignItems: 'center' }}
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        )}
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
                                    <th className={GlobalStyle.tableHeader}>Response</th>
                                    <th className={GlobalStyle.tableHeader}>Remark</th>
                                    <th className={GlobalStyle.tableHeader}>DTM</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.length > 0 ? (
                                    paginatedData
                                        .sort((a, b) => new Date(b.created_on) - new Date(a.created_on))
                                        .map((log, index) => (
                                            <tr
                                                key={index}
                                                className={`${index % 2 === 0
                                                    ? "bg-white bg-opacity-75"
                                                    : "bg-gray-50 bg-opacity-50"
                                                    } border-b`}
                                            >
                                                <td className={GlobalStyle.tableData}>{log.response_type}</td>
                                                <td className={GlobalStyle.tableData}>{log.lod_remark}</td>
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
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4">
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
                    className={GlobalStyle.buttonPrimary}
                    onClick={handleBackButton}
                >
                    <FaArrowLeft />
                </button>
            </div>
        </div>
    );


};


export default CustomerResponse;