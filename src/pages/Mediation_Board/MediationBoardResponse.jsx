/* Purpose: This template is used for the 2.17.1 - Mediation Board Reaponse .
Created Date: 2025-02-28
Created By: sakumini (sakuminic@gmail.com)
Modified By: Buthmi Mithara (buthmimithara1234@gmail.com)
Modified By: Janani Kumarasiri (tgjkk001@gmail.com)
Version: node 20
ui number : 2.17.1
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the Mediation Board Response Screen */

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Case_Details_for_DRC } from "../../services/case/CaseServices";
import Swal from "sweetalert2";
import { Accept_Non_Settlement_Request_from_Mediation_Board } from "../../services/case/CaseServices";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";
import { getLoggedUserId } from "../../services/auth/authService";

const MediationBoardResponse = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageroRequests, setCurrentPageroRequests] = useState(0);
    const [currentPagePaymentDetails, setCurrentPagePaymentDetails] = useState(0);
    const [Casedata, setCaseData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation(); // Get the current location object
    const { caseID } = location.state || {}; // Get the case_id from the state parameters
    const { DRC_ID } = location.state || {}; // Get the drc_id from the state parameters
    const [nonSettlementAccept, setNonSettlementAccept] = useState(false);
    const rowsPerPage = 5; // Number of rows per page
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null); // Role-Based Buttons

    // fetching case details
    const fetchCaseDetails = async () => {
        setIsLoading(true);
        try {
            const CaseDetails = await Case_Details_for_DRC(caseID, DRC_ID);
            if (CaseDetails) {
                setCaseData(CaseDetails[0]);
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Error fetching case details",
                    icon: "error",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    confirmButtonColor: "#d33"
                });
                setCaseData([]);
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Error fetching case details",
                icon: "error",
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonColor: "#d33"
            });
            setCaseData([]);
        } finally {
            setIsLoading(false);
        }
    };

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

    // handle submit button of non-settlement accept
    const handleSubmit = async () => {
        try {
            if (!nonSettlementAccept) {
                Swal.fire({
                    title: "Error",
                    text: "You must accept Non-Settlement before submitting.",
                    icon: "error",
                    confirmButtonColor: "#d33"
                });
                return;
            }

            const received_by = getLoggedUserId();

            setIsLoading(true);
            const response = await Accept_Non_Settlement_Request_from_Mediation_Board(caseID, received_by);

            if (response === 200) {
                Swal.fire({
                    title: "Success",
                    text: "Non-Settlement request accepted successfully!",
                    icon: "success",
                    confirmButtonColor: "#28a745"
                });
                navigate("/MediationBoard/MediationBoardCaseList");
            } else {
                Swal.fire({
                    title: "Error", 
                    text: "Failed to submit Non-Settlement acceptance.", 
                    icon: "error",
                    confirmButtonColor: "#d33"
                });
                setNonSettlementAccept(false);
            }
        } catch {
            Swal.fire({
                title: "Error", 
                text: "Failed to submit Non-Settlement acceptance.", 
                icon: "error",
                confirmButtonColor: "#d33"
            });
            setNonSettlementAccept(false);
        } finally {
            setIsLoading(false);
        }
    };

    // variables need for response history table
    const MBNegotiationHistory = Casedata.mediation_board || [];
    const pagesMBNegotiationHistory = Math.ceil(MBNegotiationHistory.length / rowsPerPage);
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const dataInPageMBNegotiationHistory = MBNegotiationHistory.slice(startIndex, endIndex);

    const handlePrevPageMBNegotiationeHistory = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPageMBNegotiationHistory = () => {
        if (currentPage < pagesMBNegotiationHistory - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    // variables need for payment  details table
    const paymentDetails = Casedata.money_transactions || [];
    const pagesPaymentDetails = Math.ceil(paymentDetails.length / rowsPerPage);
    const startIndexPaymentDetails = currentPagePaymentDetails * rowsPerPage;
    const endIndexPaymentDetails = startIndexPaymentDetails + rowsPerPage;
    const dataInPagePaymentDetails = paymentDetails.slice(startIndexPaymentDetails, endIndexPaymentDetails);

    const handlePrevPagePaymentDetails = () => {
        if (currentPagePaymentDetails > 0) {
            setCurrentPagePaymentDetails(currentPagePaymentDetails - 1);
        }
    };

    const handleNextPagePaymentDetails = () => {
        if (currentPagePaymentDetails < pagesPaymentDetails - 1) {
            setCurrentPagePaymentDetails(currentPagePaymentDetails + 1);
        }
    };

    // varibles need for settlement plane table
    const roRequests = Casedata.ro_requests || [];
    const pagesroRequests = Math.ceil(roRequests.length / rowsPerPage);
    const startIndexroRequests = currentPageroRequests * rowsPerPage;
    const endIndexroRequests = startIndexroRequests + rowsPerPage;
    const dataInPageroRequests = roRequests.slice(startIndexroRequests, endIndexroRequests);

    const handlePrevPageroRequests = () => {
        if (currentPageroRequests > 0) {
            setCurrentPageroRequests(currentPageroRequests - 1);
        }
    };

    const handleNextPageroRequests = () => {
        if (currentPageroRequests < pagesSettlementPlans - 1) {
            setCurrentPageroRequests(currentPageroRequests + 1);
        }
    };

    return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Title */}
            <h2 className={GlobalStyle.headingLarge}>Customer Response</h2>

            {/* Case details card */}
            <div className="flex gap-4 mt-4 justify-center">
                <div className={`${GlobalStyle.cardContainer}  w-full max-w-lg`}>
                    <div className="table">
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Case ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Casedata.case_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Customer Ref</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Casedata.customer_ref}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Account no</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Casedata.account_no}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Arrears Amount</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {Casedata?.arrears_amount &&
                                    Casedata.arrears_amount.toLocaleString("en-LK", {
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
                                {Casedata?.last_payment_date &&
                                    new Date(Casedata.last_payment_date).toLocaleString("en-GB", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                        // hour: "2-digit",
                                        // minute: "2-digit",
                                        // second: "2-digit",
                                        // hour12: true,
                                    })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Non-settlement accept checkbox */}
            {Casedata.case_current_status === "MB Fail with Pending Non-Settlement" && (
                <div className="flex gap-4 mt-4 mb-4 justify-center">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="font-semibold text-lg">Non-Settlement Accept:</span>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={nonSettlementAccept}
                                onChange={() => setNonSettlementAccept(!nonSettlementAccept)}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-sm font-medium">{nonSettlementAccept ? "Yes" : "No"}</span>
                        </label>
                    </div>

                    <div className="mt-8 flex justify-end max-w-4xl">
                        {["admin", "superadmin", "slt"].includes(userRole) && (<button
                            onClick={handleSubmit}
                            className={`${GlobalStyle.buttonPrimary} px-8`}
                        >
                            Submit
                        </button>)}
                    </div>
                </div>
            )}

            {/* Mediation Board Negotiation History table */}
            <h2 className={`${GlobalStyle.headingMedium}`}><b>Mediation Board Negotiation History</b></h2>

            <div className={`${GlobalStyle.tableContainer} mt-4 overflow-x-auto`}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>Calling Date</th>
                            <th className={GlobalStyle.tableHeader}>Customer Represented</th>
                            <th className={GlobalStyle.tableHeader}>Agree to Settle</th>
                            <th className={GlobalStyle.tableHeader}>Customer Response</th>
                            <th className={GlobalStyle.tableHeader}>Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataInPageMBNegotiationHistory.length > 0 ? (
                            dataInPageMBNegotiationHistory.map((log, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0
                                        ? "bg-white bg-opacity-75"
                                        : "bg-gray-50 bg-opacity-50"
                                        } border-b`}
                                >
                                    <td className={GlobalStyle.tableData}>
                                        {log?.mediation_board_calling_dtm &&
                                            new Date(log.mediation_board_calling_dtm).toLocaleString("en-GB", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                // hour: "2-digit",
                                                // minute: "2-digit",
                                                // second: "2-digit",
                                                hour12: true,
                                            })}
                                    </td>
                                    <td className={GlobalStyle.tableData}>{log.customer_available}</td>
                                    <td className={GlobalStyle.tableData}>{log.agree_to_settle}</td>
                                    <td className={GlobalStyle.tableData}>{log.customer_response}</td>
                                    <td className={GlobalStyle.tableData}>{log.comment}</td>
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

            {dataInPageMBNegotiationHistory.length > 0 && (
                <div className={GlobalStyle.navButtonContainer}>
                    <button className={GlobalStyle.navButton} onClick={handlePrevPageMBNegotiationeHistory} disabled={currentPage === 0}>
                        <FaArrowLeft />
                    </button>
                    <span className="text-gray-700">
                        Page {currentPage + 1} of {pagesMBNegotiationHistory}
                    </span>
                    <button className={GlobalStyle.navButton} onClick={handleNextPageMBNegotiationHistory} disabled={currentPage === pagesMBNegotiationHistory - 1}>
                        <FaArrowRight />
                    </button>
                </div>
            )}

            {/* Payment Details table */}
            <h2 className={`${GlobalStyle.headingMedium} mt-4`}><b>Payment Details</b></h2>

            <div className={`${GlobalStyle.tableContainer} mt-4 overflow-x-auto`}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>Date</th>
                            <th className={GlobalStyle.tableHeader}>Paid Amount (LKR)</th>
                            <th className={GlobalStyle.tableHeader}>Settled Balance (LKR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataInPagePaymentDetails.length > 0 ? (
                            dataInPagePaymentDetails.map((log, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0
                                        ? "bg-white bg-opacity-75"
                                        : "bg-gray-50 bg-opacity-50"
                                        } border-b`}
                                >
                                    <td className={GlobalStyle.tableData}>
                                        {log?.payment_Dtm &&
                                            new Date(log.payment_Dtm).toLocaleString("en-GB", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                // hour: "2-digit",
                                                // minute: "2-digit",
                                                // second: "2-digit",
                                                // hour12: true,
                                            })}
                                    </td>
                                    <td className={GlobalStyle.tableCurrency}>{log.payment}</td>
                                    <td className={GlobalStyle.tableCurrency}>{log.settle_balanced}</td>
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

            {dataInPagePaymentDetails.length > 0 && (
                <div className={GlobalStyle.navButtonContainer}>
                    <button className={GlobalStyle.navButton} onClick={handlePrevPagePaymentDetails} disabled={currentPagePaymentDetails === 0}>
                        <FaArrowLeft />
                    </button>
                    <span className="text-gray-700">
                        Page {currentPagePaymentDetails + 1} of {pagesPaymentDetails}
                    </span>
                    <button className={GlobalStyle.navButton} onClick={handleNextPagePaymentDetails} disabled={currentPagePaymentDetails === pagesPaymentDetails - 1}>
                        <FaArrowRight />
                    </button>
                </div>
            )}

            {/* Request Additional Details Table */}
            <h2 className={`${GlobalStyle.headingMedium} mt-4 `}><b>Requested Additional Details</b></h2>

            <div className={`${GlobalStyle.tableContainer} mt-4 overflow-x-auto`}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>Date</th>
                            <th className={GlobalStyle.tableHeader}>Request</th>
                            <th className={GlobalStyle.tableHeader}>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataInPageroRequests.length > 0 ? (
                            dataInPageroRequests.map((log, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0
                                        ? "bg-white bg-opacity-75"
                                        : "bg-gray-50 bg-opacity-50"
                                        } border-b`}
                                >
                                    <td className={GlobalStyle.tableData}>
                                        {log?.created_dtm &&
                                            new Date(log.created_dtm).toLocaleString("en-GB", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                // hour: "2-digit",
                                                // minute: "2-digit",
                                                // second: "2-digit",
                                                // hour12: true,
                                            })}
                                    </td>
                                    <td className={GlobalStyle.tableData}>{log.ro_request}</td>
                                    <td className={GlobalStyle.tableData}>{log.request_remark}</td>
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

            {dataInPageroRequests.length > 0 && (
                <div className={GlobalStyle.navButtonContainer}>
                    <button className={GlobalStyle.navButton} onClick={handlePrevPageroRequests} disabled={currentPageroRequests === 0}>
                        <FaArrowLeft />
                    </button>
                    <span className="text-gray-700">
                        Page {currentPageroRequests + 1} of {pagesroRequests}
                    </span>
                    <button className={GlobalStyle.navButton} onClick={handleNextPageroRequests} disabled={currentPageroRequests === pagesroRequests - 1}>
                        <FaArrowRight />
                    </button>
                </div>
            )}

            <div>
                <button
                    className={`${GlobalStyle.buttonPrimary} mt-4`}
                    onClick={() => navigate("/MediationBoard/MediationBoardCaseList")}
                >
                    <FaArrowLeft />
                </button>
            </div>
        </div>
    );


};

export default MediationBoardResponse;