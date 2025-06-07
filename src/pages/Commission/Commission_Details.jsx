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
import { Settlement_Details_By_Settlement_ID_Case_ID } from "../../services/settlement/SettlementServices";
import { Case_Details_Payment_By_Case_ID } from "../../services/Transaction/Money_TransactionService";
import { getLoggedUserId } from "../../services/auth/authService";
import { Create_Task_For_Downloard_Settlement_Details_By_Case_ID } from "../../services/settlement/SettlementServices";
import { Commission_Details_By_Commission_ID } from "../../services/commission/commissionService";
import Swal from 'sweetalert2';

const CommissionPreview = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [currentPagePaymentDetails, setCurrentPagePaymentDetails] = useState(0);
    const [currentPagesettlementPlanRecievedDetails, setCurrentPagesettlementPlanRecievedDetails] = useState(0);
    const [CommissionData, setCommissionData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const location = useLocation(); // Get the current location
    const { Commission_ID } = location.state || {};// Get the case_id from the URL parameters
    const { moneyTransactionID } = location.state || {};// Get the Money_Transaction_ID from the URL parameters
    const rowsPerPage = 5; // Number of rows per page
    const navigate = useNavigate();

    // fetching case details
    const fetchCaseDetails = async () => {
        setIsLoading(true);
        try {
            const CommissionDetails = await Commission_Details_By_Commission_ID(Commission_ID);
            console.log("Case Details:", CommissionDetails);
            setCommissionData(CommissionDetails);
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Error fetching payment details",
                icon: "error",
                allowOutsideClick: false,
                allowEscapeKey: false
            });
            setCommissionData([]);
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

    const handleBackButton = () => {
        navigate("/Commission/CommissionCaseList");
    }

    return (
        <div className={GlobalStyle.fontPoppins}>
            <div className="flex justify-between items-center mt-4">
                {/* Title */}
                <h2 className={GlobalStyle.headingLarge}>Commission Details</h2>
            </div>

            {/* Case details card */}
            <div className="flex gap-4 mt-4 justify-center">
                <div className={`${GlobalStyle.cardContainer} w-full max-w-2xl`}>
                    <div className="table">
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Case ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{CommissionData.case_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Account Number</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{CommissionData.account_num}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">DRC ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{CommissionData.drc_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">RO ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{CommissionData.ro_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Created DTM</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {CommissionData?.created_on &&
                                    new Date(CommissionData?.created_on).toLocaleString("en-GB", {
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
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Commission Amount</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {CommissionData.commission_amount &&
                                    CommissionData.commission_amount.toLocaleString("en-LK", {
                                        style: "currency",
                                        currency: "LKR",
                                    })
                                }
                            </div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Commission Type</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{CommissionData.commission_type}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Commission Action</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{CommissionData.commission_action}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mt-4 justify-center">
                <div className={`${GlobalStyle.cardContainer} w-full max-w-2xl`}>
                    <div className="table">
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Commission Status</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{CommissionData.commission_status}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Commission Status On</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {CommissionData?.commission_status_on &&
                                    new Date(CommissionData?.commission_status_on).toLocaleString("en-GB", {
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
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Commission Status Reason</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{CommissionData.commission_status_reason}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Check by</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{CommissionData.check_by}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Check on</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {CommissionData?.check_on &&
                                    new Date(CommissionData?.check_on).toLocaleString("en-GB", {
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
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Approved On</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {CommissionData?.approved_on &&
                                    new Date(CommissionData?.approved_on).toLocaleString("en-GB", {
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
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Approved by</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{CommissionData.approved_by}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mt-4 justify-center">
                <div className={`${GlobalStyle.cardContainer} w-full max-w-2xl`}>
                    <div className="table">
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Catalog ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{CommissionData.caterlog_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Commission Pay Rate ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{CommissionData.commission_pay_rate_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Commission Ref</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{CommissionData.commission_ref}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Transaction Ref</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{CommissionData.transaction_ref}</div>
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

export default CommissionPreview;