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
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Case_Details_Payment_By_Case_ID } from "../../services/Transaction/Money_TransactionService";
import Swal from 'sweetalert2';

const PaymentPreview = () => {
    // const [currentPage, setCurrentPage] = useState(0);
    const [currentPagePaymentDetails, setCurrentPagePaymentDetails] = useState(0);
    const [currentPagesettlementPlanRecievedDetails, setCurrentPagesettlementPlanRecievedDetails] = useState(0);
    const [Paymentdata, setPaymentData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const [isCreatingTask, setIsCreatingTask] = useState(false);
    const location = useLocation(); // Get the current location
    const { caseId } = location.state || {};// Get the case_id from the URL parameters
    const { moneyTransactionID } = location.state || {};// Get the Money_Transaction_ID from the URL parameters
    const rowsPerPage = 5; // Number of rows per page
    const navigate = useNavigate();

    // fetching case details
    const fetchCaseDetails = async () => {
        setIsLoading(true);
        try {
            // console.log("caseId:", caseId);
            // console.log("moneyTransactionID:", moneyTransactionID);
            const CaseDetails = await Case_Details_Payment_By_Case_ID(caseId, moneyTransactionID);
            console.log("Case Details:", CaseDetails);
            setPaymentData(CaseDetails);
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Error fetching payment details",
                icon: "error",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            setPaymentData([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetching data initially
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

    // varibles need for settlement plane table
    const PaymentDetails = Paymentdata.payment_details || [];
    const pagesPaymentDetails = Math.ceil(PaymentDetails.length / rowsPerPage);
    const startIndexPaymentDetails = currentPagePaymentDetails * rowsPerPage;
    const endIndexPaymentDetails = startIndexPaymentDetails + rowsPerPage;
    const dataInPagePaymentDetails = PaymentDetails.slice(startIndexPaymentDetails, endIndexPaymentDetails);

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

    const handleBackButton = () => {
        navigate("/pages/Money_Transaction/MoneyTransaction");
    }

    return (
        <div className={GlobalStyle.fontPoppins}>
            <div className="flex justify-between items-center mt-4">
                {/* Title */}
                <h2 className={GlobalStyle.headingLarge}>Payment Details</h2>
            </div>

            {/* Case details card */}
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
                <div className={`${GlobalStyle.cardContainer} w-full max-w-lg`}>
                    <div className="table">
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Case ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Paymentdata.case_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Account no</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Paymentdata.account_no}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Money Transaction ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Paymentdata.money_transaction_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Created DTM</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {Paymentdata?.created_dtm &&
                                    new Date(Paymentdata?.created_dtm).toLocaleString("en-GB", {
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

                <div className={`${GlobalStyle.cardContainer}  w-full max-w-lg`}>
                    <div className="table">
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Settlement Phase</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Paymentdata.settlement_phase}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Cummilative Settled Balance</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {Paymentdata?.cummulative_settled_balance &&
                                    Paymentdata.cummulative_settled_balance.toLocaleString("en-LK", {
                                        style: "currency",
                                        currency: "LKR",
                                    })
                                }
                            </div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Settlement ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Paymentdata.settlement_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Installment Sequence</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Paymentdata.installment_seq}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment table */}
            <h2 className={`${GlobalStyle.headingMedium} mt-4`}><b>Money Transaction details</b></h2>

            <div className={`${GlobalStyle.tableContainer} mt-4 overflow-x-auto`}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>Money transaction Reference</th>
                            <th className={GlobalStyle.tableHeader}>Money Transaction Reference Type</th>
                            <th className={GlobalStyle.tableHeader}>Money Transaction Amount</th>
                            <th className={GlobalStyle.tableHeader}>Money Transaction Date</th>
                            <th className={GlobalStyle.tableHeader}>Money Transaction Type</th>
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
                                    <td className={GlobalStyle.tableData}>{log.money_transaction_ref}</td>
                                    <td className={GlobalStyle.tableData}>{log.money_transaction_reference_type}</td>
                                    <td className={GlobalStyle.tableCurrency}>
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
                                                // hour: "2-digit",
                                                // minute: "2-digit",
                                                // second: "2-digit",
                                                // hour12: true,
                                            })}
                                    </td>
                                    <td className={GlobalStyle.tableData}>{log.money_transaction_type}</td>
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

            {/* Commission Details Card */}
            <h2 className={`${GlobalStyle.headingMedium} mt-4`}><b>Commission Details</b></h2>

            <div className="flex gap-4 mt-4 justify-center">
                <div className={`${GlobalStyle.cardContainer} w-full max-w-2xl`}>
                    <div className="table">
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Settled Effected Amount for Commission</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Paymentdata.settle_Effected_Amount}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Commission Type</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Paymentdata.commission_type}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Commission Amount</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Paymentdata.commission_amount}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">DRC ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Paymentdata.drc_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">RO ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Paymentdata.ro_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Commission Issued By</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Paymentdata.commision_issued_by}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Commission Issued DTM</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {Paymentdata?.commision_issued_dtm &&
                                    new Date(Paymentdata?.commision_issued_dtm).toLocaleString("en-GB", {
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

export default PaymentPreview;