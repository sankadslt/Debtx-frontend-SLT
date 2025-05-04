/*Purpose:
Created Date: 2025-04-25
Created By: Janani Kumarasiri (jkktg001@gmail.com)
Last Modified Date: 
Modified By: 
Last Modified Date: 
Modified By: 
Version: React v18
ui number : 7.6
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */


import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { Case_Details_Settlement_LOD_FTL_LOD } from "../../services/LOD/LOD";

const SettlementPreview = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [currentPageSettlementPlans, setCurrentPageSettlementPlans] = useState(0);
    const [currentPagePaymentDetails, setCurrentPagePaymentDetails] = useState(0);
    const [LODdata, setLODData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation(); // Get the current location
    const { caseId } = location.state || {};// Get the case_id from the URL parameters
    const rowsPerPage = 5; // Number of rows per page
    const navigate = useNavigate();

    // fetching case details
    const fetchCaseDetails = async () => {
        setIsLoading(true);
        try {
            const CaseDetails = await Case_Details_Settlement_LOD_FTL_LOD(caseId);
            setLODData(CaseDetails);
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

    // variables need for response history table
    const lodResponse = LODdata.lod_response || [];
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

    // varibles need for settlement plane table
    const settlementPlans = LODdata.settlement_plans || [];
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

    // variables need for payment  details table
    const paymentDetails = LODdata.payment_details || [];
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

    const handleBackButton = () => {
        navigate("/pages/Settlement/MonitorSettlement");
    }

    return (
        <div className={GlobalStyle.fontPoppins}>
            <div className="flex justify-between items-center mt-4">
                {/* Title */}
                <h2 className={GlobalStyle.headingLarge}>Settlement Details</h2>

                <button
                    // onClick={HandleCreateTaskDownloadSettlementList}
                    // className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? 'opacity-50' : ''}`}
                    className={GlobalStyle.buttonPrimary}
                    // disabled={isCreatingTask}
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    {/* {!isCreatingTask && <FaDownload style={{ marginRight: '8px' }} />}
                {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'} */}
                    <FaDownload style={{ marginRight: '8px' }} />
                    Create task and let me know
                </button>
            </div>

            {/* Case details card */}
            <div className="flex gap-4 mt-4 justify-center">
                <div className={`${GlobalStyle.cardContainer}`}>
                    <div className="table">
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Settlement ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{LODdata.case_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Case ID</div>
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
                            <div className="table-cell px-4 py-2 font-bold">Last Monitoring DTM</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {LODdata?.last_payment_date &&
                                    new Date(LODdata.last_payment_date).toLocaleString("en-GB", {
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

                <div className={`${GlobalStyle.cardContainer}`}>
                    <div className="table">
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Settlement Status</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{LODdata.case_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Status DTM</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{LODdata.customer_ref}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Status Reason</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{LODdata.account_no}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Response History table */}
            {/* <h2 className={`${GlobalStyle.headingMedium}`}><b>Response History</b></h2>

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
                        {dataInPageResponseHistory.length > 0 ? (
                            dataInPageResponseHistory.map((log, index) => (
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
            </div> */}

            {/* Settilement Plan table */}
            <h2 className={`${GlobalStyle.headingMedium} mt-4`}><b>Settlement Plan</b></h2>

            {/* <div className="flex gap-4 mt-4 justify-center">
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
            </div> */}

            <div className={`${GlobalStyle.tableContainer} mt-4`}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>Installment Seq.</th>
                            <th className={GlobalStyle.tableHeader}>Installment Settle Amount</th>
                            <th className={GlobalStyle.tableHeader}>Cumulative Settle Amount</th>
                            <th className={GlobalStyle.tableHeader}>Plan Date</th>
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
                                    <td className={GlobalStyle.tableCurrency}>
                                        {log?.settlement_plan[0]?.Installment_Paid_Amount &&
                                            log.settlement_plan[0]?.Installment_Paid_Amount.toLocaleString("en-LK", {
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

            {/* Payment Details Table */}
            <h2 className={`${GlobalStyle.headingMedium} mt-4`}><b>Received Settlement Plan</b></h2>

            <div className="flex gap-4 mt-4 justify-center">
                <div className={`${GlobalStyle.cardContainer}`}>
                    <div className="table">
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Settlement Phase</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{LODdata.case_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Settlement Type</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{LODdata.customer_ref}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Settlement Created By</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{LODdata.account_no}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Settlement Created DTM</div>
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
                            <div className="table-cell px-4 py-2 font-bold">DRC ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {LODdata?.last_payment_date &&
                                    new Date(LODdata.last_payment_date).toLocaleString("en-GB", {
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
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">RO ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {LODdata?.last_payment_date &&
                                    new Date(LODdata.last_payment_date).toLocaleString("en-GB", {
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

            <div className={`${GlobalStyle.tableContainer} mt-4`}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>Installment Seq.</th>
                            <th className={GlobalStyle.tableHeader}>Installment Settle Amount</th>
                            <th className={GlobalStyle.tableHeader}>Plan Date</th>
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
                                    <td className={GlobalStyle.tableData}>{log.installment_seq}</td>
                                    <td className={GlobalStyle.tableCurrency}>
                                        {log?.payment &&
                                            log.payment.toLocaleString("en-LK", {
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

export default SettlementPreview;