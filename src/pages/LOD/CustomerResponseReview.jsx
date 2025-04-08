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
// import { List_Final_Reminder_Lod_Cases } from "../../services/LOD/LOD.js";
import { useParams } from "react-router-dom";
import { Case_Details_Settlement_LOD_FTL_LOD } from "../../services/LOD/LOD";

const CustomerResponseReview = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageSettlementPlans, setCurrentPageSettlementPlans] = useState(0);
    const [currentPagePaymentDetails, setCurrentPagePaymentDetails] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [LODStatus, setLODStatus] = useState("");
    const [DateType, setDateType] = useState("");
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { caseId } = useParams(); // Get the case_id from the URL parameters
    const rowsPerPage = 5; // Number of rows per page
    const navigate = useNavigate();

    const fetchCaseDetails = async () => {
        setIsLoading(true);
        try {
            const CaseDetails = await Case_Details_Settlement_LOD_FTL_LOD(caseId);
            setData(CaseDetails);
        } catch (error) {
            setData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCaseDetails();
    }, []);

    // const HandleAddIncident = () => navigate("/incident/register");

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const lodResponse = data.lod_response || [];
    const pagesResponseHistory = Math.ceil(lodResponse.length / rowsPerPage);
    const startIndex = currentPage * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const dataInPageResponseHistory = lodResponse.slice(startIndex, endIndex);

    const handlePrevPageResponseHistory = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPageResponseHistory = () => {
        if (currentPage < pagesResponseHistory - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const settlementPlans = data.settlement_plans || [];
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

    const paymentDetails = data.payment_details || [];
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

    return (
        <div className={GlobalStyle.fontPoppins}>
            <h2 className={GlobalStyle.headingLarge}>Customer Response</h2>

            <div className="flex gap-4 mt-4 justify-center">
                <div className="w-full">
                    <div className={`${GlobalStyle.cardContainer} w-full`}>
                        <div className="table">
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
                        {dataInPageResponseHistory.length > 0 ? (
                            dataInPageResponseHistory.map((log, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0
                                        ? "bg-white bg-opacity-75"
                                        : "bg-gray-50 bg-opacity-50"
                                        } border-b`}
                                >
                                    <td className={GlobalStyle.tableData}>
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
                <button className={GlobalStyle.navButton} onClick={handlePrevPageResponseHistory} disabled={currentPage === 0}>
                    <FaArrowLeft />
                </button>
                <span className="text-gray-700">
                    Page {currentPage + 1} of {pagesResponseHistory}
                </span>
                <button className={GlobalStyle.navButton} onClick={handleNextPageResponseHistory} disabled={currentPage === pagesResponseHistory - 1}>
                    <FaArrowRight />
                </button>
            </div>

            <h2 className={`${GlobalStyle.headingMedium} mt-4`}><b>Settlement Plan</b></h2>

            <div className="flex gap-4 mt-4 justify-center">
                <h2 className={`${GlobalStyle.headingMedium} mt-4`}><b>Last Monitoring DTM:</b></h2>
                <h2 className={`${GlobalStyle.headingMedium} mt-4`}>
                    {settlementPlans.length > 0 &&
                        new Date(settlementPlans[settlementPlans.length - 1].last_monitoring_dtm).toLocaleString("en-GB", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                        })}

                </h2>
            </div>

            <div className={`${GlobalStyle.tableContainer} mt-4`}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>Seq. No</th>
                            <th className={GlobalStyle.tableHeader}>Installment Settle Amount</th>
                            <th className={GlobalStyle.tableHeader}>Plan Date</th>
                            <th className={GlobalStyle.tableHeader}>Installment Paid Amount</th>
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
                                    <td className={GlobalStyle.tableData}>{log.installment_seq}</td>
                                    <td className={GlobalStyle.tableData}>
                                        {log?.Installment_Settle_Amount &&
                                            log.Installment_Settle_Amount.toLocaleString("en-LK", {
                                                style: "currency",
                                                currency: "LKR",
                                            })
                                        }
                                    </td>
                                    <td className={GlobalStyle.tableData}>
                                        {log?.Plan_Date &&
                                            new Date(log.Plan_Date).toLocaleString("en-GB", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: true,
                                            })}
                                    </td>
                                    <td className={GlobalStyle.tableData}>
                                        {log?.Installment_Paid_Amount &&
                                            log.Installment_Paid_Amount.toLocaleString("en-LK", {
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

            <h2 className={`${GlobalStyle.headingMedium} mt-4`}><b>Payment Details</b></h2>

            <div className={`${GlobalStyle.tableContainer} mt-4`}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>Date</th>
                            <th className={GlobalStyle.tableHeader}>Paid amount</th>
                            <th className={GlobalStyle.tableHeader}>Settled Balance</th>
                            <th className={GlobalStyle.tableHeader}>Installment Sequence</th>
                            <th className={GlobalStyle.tableHeader}>Transaction Type</th>
                            <th className={GlobalStyle.tableHeader}>Transaction Amount</th>
                            <th className={GlobalStyle.tableHeader}>Transaction_DTM</th>
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
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: true,
                                            })}
                                    </td>
                                    <td className={GlobalStyle.tableData}>
                                        {log?.payment &&
                                            log.payment.toLocaleString("en-LK", {
                                                style: "currency",
                                                currency: "LKR",
                                            })
                                        }
                                    </td>
                                    <td className={GlobalStyle.tableData}>
                                        {log?.cummilative_settled_balance &&
                                            log.cummilative_settled_balance.toLocaleString("en-LK", {
                                                style: "currency",
                                                currency: "LKR",
                                            })
                                        }
                                    </td>
                                    <td className={GlobalStyle.tableData}>{log.installment_seq}</td>
                                    <td className={GlobalStyle.tableData}>{log.money_transaction_type}</td>
                                    <td className={GlobalStyle.tableData}>
                                        {log?.money_transaction_amount &&
                                            log.money_transaction_amount.toLocaleString("en-LK", {
                                                style: "currency",
                                                currency: "LKR",
                                            })
                                        }
                                    </td>
                                    <td className={GlobalStyle.tableData}>
                                        {log?.money_transaction_date &&
                                            new Date(log.money_transaction_date).toLocaleString("en-GB", {
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
        </div>
    );


};

export default CustomerResponseReview;