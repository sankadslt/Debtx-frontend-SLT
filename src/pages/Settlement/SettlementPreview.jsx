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
import { Settlement_Details_By_Settlement_ID_Case_ID } from "../../services/settlement/SettlementServices";
import { getLoggedUserId } from "../../services/auth/authService";
import { Create_Task_For_Downloard_Settlement_Details_By_Case_ID } from "../../services/settlement/SettlementServices";
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

const SettlementPreview = () => {
    // const [currentPage, setCurrentPage] = useState(0);
    const [currentPageSettlementPlans, setCurrentPageSettlementPlans] = useState(0);
    const [currentPagesettlementPlanRecievedDetails, setCurrentPagesettlementPlanRecievedDetails] = useState(0);
    const [Settlementdata, setSettlementData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const location = useLocation(); // Get the current location
    const { caseId } = location.state || {};// Get the case_id from the URL parameters
    const { settlementID } = location.state || {};// Get the settlementID from the URL parameters
    const rowsPerPage = 5; // Number of rows per page
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null); // Role-Based Buttons

    // fetching case details
    const fetchCaseDetails = async () => {
        setIsLoading(true);
        try {
            const CaseDetails = await Settlement_Details_By_Settlement_ID_Case_ID(caseId, settlementID);
            console.log("Case Details:", CaseDetails);
            setSettlementData(CaseDetails);
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Error fetching settlement details",
                icon: "error",
                allowOutsideClick: false,
                allowEscapeKey: false,
                confirmButtonColor: "#d33"
            });
            setSettlementData([]);
        } finally {
            setIsLoading(false);
        }
    };

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

        fetchCaseDetails();
    }, []);

    // useEffect(() => {
    //     fetchCaseDetails();
    // }, []);

    // display loading animation when data is loading
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // varibles need for settlement plane table
    const settlementPlans = Settlementdata.settlement_plans || [];
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
    const settlementPlanRecievedDetails = Settlementdata.settlement_plan_received || [];
    const pagessettlementPlanRecievedDetails = Math.ceil(settlementPlanRecievedDetails.length / rowsPerPage);
    const startIndexsettlementPlanRecievedDetails = currentPagesettlementPlanRecievedDetails * rowsPerPage;
    const endIndexsettlementPlanRecievedDetails = startIndexsettlementPlanRecievedDetails + rowsPerPage;
    const dataInPagesettlementPlanRecievedDetails = settlementPlanRecievedDetails.slice(startIndexsettlementPlanRecievedDetails, endIndexsettlementPlanRecievedDetails);

    const handlePrevPagesettlementPlanRecievedDetails = () => {
        if (currentPagesettlementPlanRecievedDetails > 0) {
            setCurrentPagesettlementPlanRecievedDetails(currentPagesettlementPlanRecievedDetails - 1);
        }
    };

    const handleNextPagesettlementPlanRecievedDetails = () => {
        if (currentPagesettlementPlanRecievedDetails < pagessettlementPlanRecievedDetails - 1) {
            setCurrentPagesettlementPlanRecievedDetails(currentPagesettlementPlanRecievedDetails + 1);
        }
    };

    const handleBackButton = () => {
        navigate("/pages/Settlement/MonitorSettlement");
    }

    // Handle create task button click
    const HandleCreateTaskDownloadSettlementDetailsByCaseID = async () => {

        const userData = await getLoggedUserId(); // Assign user ID

        setIsCreatingTask(true);
        try {
            const response = await Create_Task_For_Downloard_Settlement_Details_By_Case_ID(userData, caseId, settlementID);
            if (response.status === 200) {
                Swal.fire({
                    title: "Task created successfully!",
                    text: "Task ID: " + response.data.data.data.Task_Id,
                    icon: "success",
                    confirmButtonColor: "#28a745"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message || "Failed to create task.",
                icon: "error",
                confirmButtonColor: "#d33"
            });
        } finally {
            setIsCreatingTask(false);
        }
    };

    return (
        <div className={GlobalStyle.fontPoppins}>
            <div className="flex justify-between items-center mt-4">
                {/* Title */}
                <h2 className={GlobalStyle.headingLarge}>Settlement Details</h2>

                {/* Button to create task */}
                {["admin", "superadmin", "slt"].includes(userRole) && (
                    <button
                        onClick={HandleCreateTaskDownloadSettlementDetailsByCaseID}
                        className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? 'opacity-50' : ''}`}
                        disabled={isCreatingTask}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        {!isCreatingTask && <FaDownload style={{ marginRight: '8px' }} />}
                        {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'}
                    </button>
                )}
            </div>

            {/* Case details card */}
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
                <div className={`${GlobalStyle.cardContainer} w-full max-w-xl`}>
                    <div className="table">
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Settlement ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Settlementdata.settlement_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Case ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Settlementdata.case_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Account no</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Settlementdata.account_no}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Billing Arrears Amount</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {Settlementdata?.bss_arrears_amount &&
                                    Settlementdata.bss_arrears_amount.toLocaleString("en-LK", {
                                        style: "currency",
                                        currency: "LKR",
                                    })
                                }
                            </div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Arrears Amount</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {Settlementdata?.arrears_amount &&
                                    Settlementdata.arrears_amount.toLocaleString("en-LK", {
                                        style: "currency",
                                        currency: "LKR",
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${GlobalStyle.cardContainer} w-full max-w-xl`}>
                    <div className="table">
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Last Monitoring DTM</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {Settlementdata?.last_monitoring_dtm &&
                                    new Date(Settlementdata.last_monitoring_dtm).toLocaleString("en-GB", {
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
                            <div className="table-cell px-4 py-2 font-bold">Settlement Status</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Settlementdata.settlement_status}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Status DTM</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {Settlementdata?.status_dtm &&
                                    new Date(Settlementdata.status_dtm).toLocaleString("en-GB", {
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
                            <div className="table-cell px-4 py-2 font-bold">Status Reason</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Settlementdata.status_reason}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settilement Plan table */}
            <h2 className={`${GlobalStyle.headingMedium} mt-4`}><b>System Created Settlement Plan</b></h2>

            <div className={`${GlobalStyle.tableContainer} mt-4 overflow-x-auto`}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>Installment Seq.</th>
                            <th className={GlobalStyle.tableHeader}>Installment Settle Amount (LKR)</th>
                            <th className={GlobalStyle.tableHeader}>Cumulative Settle Amount (LKR)</th>
                            <th className={GlobalStyle.tableHeader}>Plan Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataInPageSettlementPlans.length > 0 ? (
                            dataInPageSettlementPlans
                                .sort((a, b) => new Date(b.Plan_Date) - new Date(a.Plan_Date))
                                .map((log, index) => (
                                    <tr
                                        key={index}
                                        className={`${index % 2 === 0
                                            ? "bg-white bg-opacity-75"
                                            : "bg-gray-50 bg-opacity-50"
                                            } border-b`}
                                    >
                                        <td className={GlobalStyle.tableData}>{log.installment_seq}</td>
                                        <td className={GlobalStyle.tableCurrency}>{log.Installment_Settle_Amount}</td>
                                        <td className={GlobalStyle.tableCurrency}>{log.cumulative_Settle_Amount}</td>
                                        <td className={GlobalStyle.tableData}>
                                            {log?.Plan_Date &&
                                                new Date(log.Plan_Date).toLocaleString("en-GB", {
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

            {dataInPageSettlementPlans.length > 0 && (
                <div className={GlobalStyle.navButtonContainer}>
                    <button
                        className={`${GlobalStyle.navButton} ${currentPageSettlementPlans === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handlePrevPageSettlementPlans}
                        disabled={currentPageSettlementPlans === 0}
                    >
                        <FaArrowLeft />
                    </button>
                    <span className="text-gray-700">
                        Page {currentPageSettlementPlans + 1} of {pagesSettlementPlans}
                    </span>
                    <button
                        className={`${GlobalStyle.navButton} ${currentPageSettlementPlans === pagesSettlementPlans - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleNextPageSettlementPlans}
                        disabled={currentPageSettlementPlans === pagesSettlementPlans - 1}
                    >
                        <FaArrowRight />
                    </button>
                </div>
            )}

            {/* Received Settlement Plan Table */}
            <h2 className={`${GlobalStyle.headingMedium} mt-4`}><b>Customer Requested Settlement Plan</b></h2>

            <div className="flex flex-wrap gap-4 mt-4 justify-center">
                {/* <div className="flex gap-4 mt-4 justify-center"> */}
                <div className={`${GlobalStyle.cardContainer} w-full max-w-xl`}>
                    <div className="table">
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Settlement Phase</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Settlementdata.settlement_phase}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Settlement Type</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Settlementdata.settlement_type}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Settlement Created By</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Settlementdata.created_by}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Settlement Created DTM</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {Settlementdata?.created_dtm &&
                                    new Date(Settlementdata.created_dtm).toLocaleString("en-GB", {
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
                            <div className="table-cell px-4 py-2 font-bold">Settlement Expire DTM</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {Settlementdata?.expire_date &&
                                    new Date(Settlementdata.expire_date).toLocaleString("en-GB", {
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
                            <div className="table-cell px-4 py-2 font-bold">DRC ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Settlementdata.drc_id}</div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">RO ID</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">{Settlementdata.ro_id}</div>
                        </div>
                    </div>
                </div>
                {/* </div> */}

                {/* <div className="flex gap-4 mt-4 justify-center"> */}
                <div className={`${GlobalStyle.cardContainer} w-full max-w-xl`}>
                    <div className="table">
                        <div className="table-row px-4 py-2 font-bold underline">
                            Received Settlement Plan
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Initial Amount</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {/* {Settlementdata?.settlement_plan_received[0] &&
                                    Settlementdata.settlement_plan_received[0].toLocaleString("en-LK", {
                                        style: "currency",
                                        currency: "LKR",
                                    })
                                } */}
                                {Array.isArray(Settlementdata?.settlement_plan_received) &&
                                    Settlementdata.settlement_plan_received[0] !== undefined
                                    ? Settlementdata.settlement_plan_received[0].toLocaleString("en-LK", {
                                        style: "currency",
                                        currency: "LKR",
                                    })
                                    : ""}
                            </div>
                        </div>
                        <div className="table-row">
                            <div className="table-cell px-4 py-2 font-bold">Monitor Months</div>
                            <div className="table-cell px-4 py-2 font-bold">:</div>
                            <div className="table-cell px-4 py-2">
                                {/* {Settlementdata.settlement_plan_received[1]} */}
                                {Array.isArray(Settlementdata?.settlement_plan_received) &&
                                    Settlementdata.settlement_plan_received[1] !== undefined
                                    ? Settlementdata.settlement_plan_received[1]
                                    : ""}
                            </div>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </div>

            {/* <div className={`${GlobalStyle.tableContainer} mt-4 overflow-x-auto`}>
                <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                        <tr>
                            <th className={GlobalStyle.tableHeader}>Installment Seq.</th>
                            <th className={GlobalStyle.tableHeader}>Installment Settle Amount (LKR)</th>
                            <th className={GlobalStyle.tableHeader}>Plan Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataInPagesettlementPlanRecievedDetails.length > 0 ? (
                            dataInPagesettlementPlanRecievedDetails.map((log, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0
                                        ? "bg-white bg-opacity-75"
                                        : "bg-gray-50 bg-opacity-50"
                                        } border-b`}
                                >
                                    <td className={GlobalStyle.tableData}>{log.installment_seq}</td>
                                    <td className={GlobalStyle.tableCurrency}>{log.Installment_Settle_Amount}</td>
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
            </div> */}

            {/* {dataInPagesettlementPlanRecievedDetails.length > 0 && (
                <div className={GlobalStyle.navButtonContainer}>
                    <button className={GlobalStyle.navButton} onClick={handlePrevPagesettlementPlanRecievedDetails} disabled={currentPagesettlementPlanRecievedDetails === 0}>
                        <FaArrowLeft />
                    </button>
                    <span className="text-gray-700">
                        Page {currentPagesettlementPlanRecievedDetails + 1} of {pagessettlementPlanRecievedDetails}
                    </span>
                    <button className={GlobalStyle.navButton} onClick={handleNextPagesettlementPlanRecievedDetails} disabled={currentPagesettlementPlanRecievedDetails === pagessettlementPlanRecievedDetails - 1}>
                        <FaArrowRight />
                    </button>
                </div>
            )} */}

            <div>
                <button
                    className={`${GlobalStyle.buttonPrimary} mt-4`}
                    onClick={handleBackButton}
                >
                    <FaArrowLeft />
                </button>
            </div>
        </div>
    );


};

export default SettlementPreview;