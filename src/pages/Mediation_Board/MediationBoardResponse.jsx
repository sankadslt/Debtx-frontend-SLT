/*Purpose:
Created Date: 2025-04-07
Created By: Janani Kumarasiri (jkktg001@gmail.com)
Last Modified Date: 
Modified By: 
Last Modified Date: 
Modified By: 
Version: React v18
ui number : 3.7
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */


import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { Case_Details_Settlement_LOD_FTL_LOD } from "../../services/LOD/LOD";
import { Case_Details_for_DRC } from "../../services/case/CaseServices";
import Swal from "sweetalert2";

const MediationBoardResponse = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageSettlementPlans, setCurrentPageSettlementPlans] = useState(0);
    const [currentPagePaymentDetails, setCurrentPagePaymentDetails] = useState(0);
    const [Casedata, setCaseData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation(); // Get the current location object
    const { caseID } = location.state || {}; // Get the case_id from the state parameters
    const { DRC_ID } = location.state || {}; // Get the drc_id from the state parameters
    const rowsPerPage = 5; // Number of rows per page
    const navigate = useNavigate();

    // fetching case details
    const fetchCaseDetails = async () => {
        setIsLoading(true);
        try {
            // console.log("caseId", caseID);
            // console.log("DRC_ID", DRC_ID);
            const CaseDetails = await Case_Details_for_DRC(caseID, DRC_ID);
            if (CaseDetails) {
                setCaseData(CaseDetails);
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Error fetching case details",
                    icon: "error",
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
                setCaseData([]);
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Error fetching case details",
                icon: "error",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            setCaseData([]);
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
    const paymentDetails = Casedata.payment_details || [];
    const pagesPaymentDetails = Math.ceil(paymentDetails.length / rowsPerPage);
    const startIndexPaymentDetails = currentPagePaymentDetails * rowsPerPage;
    const endIndexPaymentDetails = startIndexPaymentDetails + rowsPerPage;
    const dataInPagePaymentDetails = paymentDetails.slice(startIndexPaymentDetails, endIndexPaymentDetails);

    const handlePrevPagePaymentDetails = () => {
        if (currentPagePaymentDetails > 0) {
            setCurrentPageSettlementPlans(currentPagePaymentDetails - 1);
        }
    };

    const handleNextPagePaymentDetails = () => {
        if (currentPagePaymentDetails < pagesPaymentDetails - 1) {
            setCurrentPageSettlementPlans(currentPagePaymentDetails + 1);
        }
    };

    // varibles need for settlement plane table
    const settlementPlans = Casedata.settlement_plans || [];
    const pagesSettlementPlans = Math.ceil(settlementPlans.length / rowsPerPage);
    const startIndexSettlementPlans = currentPageSettlementPlans * rowsPerPage;
    const endIndexSettlementPlans = startIndexSettlementPlans + rowsPerPage;
    const dataInPageSettlementPlans = settlementPlans.slice(startIndexSettlementPlans, endIndexSettlementPlans);

    const handlePrevPageSettlementPlans = () => {
        if (currentPageSettlementPlans > 0) {
            setCurrentPageSettlementPlans(currentPageSettlementPlans - 1);
        }
    };

    const handleNextPageSettlementPlans = () => {
        if (currentPageSettlementPlans < pagesSettlementPlans - 1) {
            setCurrentPageSettlementPlans(currentPageSettlementPlans + 1);
        }
    };

    return (
        <div className={GlobalStyle.fontPoppins}>
            {/* Title */}
            <h2 className={GlobalStyle.headingLarge}>Customer Response</h2>

            {/* Case details card */}
            <div className="flex gap-4 mt-4 justify-center">
                <div className={`${GlobalStyle.cardContainer}`}>
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

            {/* Response History table */}
            <h2 className={`${GlobalStyle.headingMedium}`}><b>Mediation Board Negotiation History</b></h2>

            <div className={`${GlobalStyle.tableContainer} mt-4`}>
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

            {/* Settilement Plan table */}
            <h2 className={`${GlobalStyle.headingMedium} mt-4`}><b>Payment Details</b></h2>

            <div className={`${GlobalStyle.tableContainer} mt-4`}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>Date</th>
                            <th className={GlobalStyle.tableHeader}>Paid Amount</th>
                            <th className={GlobalStyle.tableHeader}>Settled Balance</th>
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
                                    <td className={GlobalStyle.tableCurrency}>
                                        {log?.payment &&
                                            log.payment.toLocaleString("en-LK", {
                                                style: "currency",
                                                currency: "LKR",
                                            })
                                        }
                                    </td>
                                    <td className={GlobalStyle.tableCurrency}>
                                        {log?.settle_balanced &&
                                            log.settle_balanced.toLocaleString("en-LK", {
                                                style: "currency",
                                                currency: "LKR",
                                            })
                                        }
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

            {/* Payment Details Table */}
            <h2 className={`${GlobalStyle.headingMedium} mt-4`}><b>Requested Additional Details</b></h2>

            <div className={`${GlobalStyle.tableContainer} mt-4`}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>Date</th>
                            <th className={GlobalStyle.tableHeader}>Paid Amount</th>
                            <th className={GlobalStyle.tableHeader}>Settled Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataInPageSettlementPlans.length > 0 ? (
                            dataInPageSettlementPlans.map((log, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0
                                        ? "bg-white bg-opacity-75"
                                        : "bg-gray-50 bg-opacity-50"
                                        } border-b`}
                                >
                                    <td className={GlobalStyle.tableData}>{log.settlement_plan[0]?.installment_seq}</td>
                                    <td className={GlobalStyle.tableCurrency}>
                                        {log?.settlement_plan[0]?.Installment_Settle_Amount &&
                                            log.settlement_plan[0]?.Installment_Settle_Amount.toLocaleString("en-LK", {
                                                style: "currency",
                                                currency: "LKR",
                                            })
                                        }
                                    </td>
                                    <td className={GlobalStyle.tableData}>
                                        {log?.settlement_plan[0]?.Plan_Date &&
                                            new Date(log.settlement_plan[0]?.Plan_Date).toLocaleString("en-GB", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                // hour: "2-digit",
                                                // minute: "2-digit",
                                                // second: "2-digit",
                                                // hour12: true,
                                            })}
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

            <div className={GlobalStyle.navButtonContainer}>
                <button className={GlobalStyle.navButton} onClick={handlePrevPageSettlementPlans} disabled={currentPageSettlementPlans === 0}>
                    <FaArrowLeft />
                </button>
                <span className="text-gray-700">
                    Page {currentPageSettlementPlans + 1} of {pagesSettlementPlans}
                </span>
                <button className={GlobalStyle.navButton} onClick={handleNextPageSettlementPlans} disabled={currentPageSettlementPlans === pagesSettlementPlans - 1}>
                    <FaArrowRight />
                </button>
            </div>

            <div>
                <button
                    className={GlobalStyle.navButton}
                    onClick={() => navigate("/MediationBoard/MediationBoardCaseList")}
                >
                    <FaArrowLeft />
                </button>
            </div>
        </div>
    );


};

export default MediationBoardResponse;