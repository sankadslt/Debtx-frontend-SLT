/*Purpose: 
Created Date: 2025-04-02
Created By: Nimesh Perera (nimeshmathew999@gmail.com)
Last Modified Date: 2025-04-28
Modified By: Nimesh Perera (nimeshmathew999@gmail.com)
Version: React v18
ui number : 4.6.2
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import DatePicker from "react-datepicker"
import GlobalStyle from "../../assets/prototype/GlobalStyle"
import { useEffect, useState } from "react";
import { getLitigationPhaseCaseDetails, listLitigationPhaseCaseDetails } from "../../services/litigation/litigationService";
import { useLocation } from "react-router-dom";

export const Litigation_Case_Details = () => {
  const location =useLocation();
  const case_id =location.state?.case_id || "";

  const [caseDetails, setCaseDetails] =useState(null);
  const [settlementAndPaymentDetails, setSettlementAndPaymentDetails] =useState(null);

  const [loading, setLoading] =useState(false);

//   const case_id ="1"; //For testing

  useEffect(() => {
    const fetchCaseDetails =async() => {
        setLoading(true);
        const response =await listLitigationPhaseCaseDetails(case_id);
        if (response.success) {
            setCaseDetails(response.data);
            console.log(response.data);
            
        }else{
            console.error(response.message);
        }
        setLoading(false);
    }

    const fetchSettlementAndPaymentDetails = async () => {
        setLoading(true);
        try {
            const response = await getLitigationPhaseCaseDetails(case_id);
    
            if (response) {
                setSettlementAndPaymentDetails(response);
                console.log("Settlement and Payment:", response);
            } else {
                console.error("Error retrieving case details: Invalid response");
            }
        } catch (error) {
            console.error("Error fetching settlement and payment details:", error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchCaseDetails();
    fetchSettlementAndPaymentDetails();
  }, [case_id]);

  const legalSubmission = caseDetails?.litigation?.[0]?.legal_submission?.at(-1) || {};
  const courtDetails = caseDetails?.litigation?.[0]?.legal_details?.at(-1) || {};

  const { submission, submission_on, submission_remark } = legalSubmission;
  const { court_no, court_registered_date, case_handling_officer, remark } = courtDetails;
    
  return (
    <div className={GlobalStyle.fontPoppins}>
        <h1 className={GlobalStyle.headingLarge}>Litigation Case Details</h1>
        <div className="flex flex-col gap-4 mt-4 items-center justify-center">
            <div className={GlobalStyle.cardContainer}>     
                {/* Card */}
                <div className="flex flex-col w-full items-center justify-center">
                    <div className={`${GlobalStyle.cardContainer} w-full`}>
                        {loading ? (
                            <p className="text-center">Loading...</p>
                        ) : (
                            [
                            { label: "Case ID", value: caseDetails?.case_id },
                            { label: "Customer Ref", value: caseDetails?.customer_ref },
                            { label: "Account No", value: caseDetails?.account_no },
                            { label: "Arrears Amount", value: caseDetails?.current_arrears_amount },
                            { label: "Last Payment Date", value: new Date(caseDetails?.last_payment_date).toLocaleDateString("en-GB")},
                            ].map((item, index) => (
                            <p key={index} className="mb-2 flex items-center">
                                <strong className="w-40 text-left">{item.label}</strong>
                                <span className="w-6 text-center">:</span>
                                <span className="flex-1">{item.value || "N/A"}</span>
                            </p>
                            ))
                        )}
                    </div>
                </div>

                {/* Legal Submission */}
                <div className="flex gap-2 justify-start mb-4">
                    <label className="w-56 mt-4">Legal Submission : </label>
                    <div className="flex flex-col gap-2 border-2 rounded-xl p-4 w-full">
                        {loading ? (
                            <p className="text-center">Loading...</p>
                        ) : (
                            [
                            { label: "Submission", value: submission },
                            { label: "Submitted Date", value: new Date(submission_on).toLocaleDateString("en-GB")},
                            { label: "Remark", value: submission_remark},
                            ].map((item, index) => (
                            <p key={index} className="flex items-center">
                                <span className="w-40 text-left">{item.label}</span>
                                <span className="w-6 text-center">:</span>
                                <span className="flex-1">{item.value || "N/A"}</span>
                            </p>
                            ))
                        )}
                    </div>
                </div>

                {/* Court Details */}
                <div className="flex gap-2 justify-start mb-4">
                    <label className="w-56 mt-4">Court Details : </label>
                    <div className="flex flex-col gap-2 border-2 rounded-xl p-4 w-full">
                    {loading ? (
                            <p className="text-center">Loading...</p>
                        ) : (
                            [
                            { label: "Court No", value: court_no },
                            { label: "Court Registered Date", value: new Date(court_registered_date).toLocaleDateString("en-GB")},
                            { label: "Case Handling Officer", value: case_handling_officer},
                            { label: "Remark", value: remark},
                            ].map((item, index) => (
                            <p key={index} className="flex items-center">
                                <span className="min-w-48 text-left">{item.label}</span>
                                <span className="w-6 text-center">:</span>
                                <span className="flex-1">{item.value || "N/A"}</span>
                            </p>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-10 w-full">
                {/* Settlement Plan */}
                <div className="flex flex-col w-full gap-2">
                    <h1 className={`${GlobalStyle.headingMedium} font-semibold`}>Settlement Plan</h1>
                    {/* Court Registered Date*/}
                    <div className="flex gap-4 items-center">
                        <label>Last Monitoring DTM : </label>
                        <span className="flex flex-col gap-2 border-2 rounded-xl py-2 px-8 w-fit">
                            {new Date(settlementAndPaymentDetails?.settlementData?.last_monitoring_dtm).toLocaleDateString('en-GB')}
                        </span>
                    </div>
                    <div className={GlobalStyle.tableContainer}>
                        <table className={GlobalStyle.table}>
                            <thead className={GlobalStyle.thead}>
                                <tr>
                                    <th className={GlobalStyle.tableHeader}>Seq No</th>
                                    <th className={GlobalStyle.tableHeader}>Installment Settle Amount</th>
                                    <th className={GlobalStyle.tableHeader}>Plan Date</th>
                                    <th className={GlobalStyle.tableHeader}>Installment Paid Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                            {settlementAndPaymentDetails?.settlementData?.settlement_plan?.length > 0 ? (
                                settlementAndPaymentDetails.settlementData.settlement_plan.map((item, index) => (
                                    <tr key={item._id || index}>
                                        <td className={GlobalStyle.tableData}>{item.installment_seq}</td>
                                        <td className={GlobalStyle.tableData}>{item.Installment_Settle_Amount}</td>
                                        <td className={GlobalStyle.tableData}>
                                            {item.Plan_Date ? new Date(item.Plan_Date).toLocaleDateString('en-GB') : 'N/A'}
                                        </td>
                                        <td className={GlobalStyle.tableData}>{item.Installment_Paid_Amount}</td>
                                    </tr>
                                ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4 text-gray-500">
                                            No settlement data available
                                        </td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Payment Details */}
                <div className="flex flex-col w-full gap-2">
                    <h1 className={`${GlobalStyle.headingMedium} font-semibold`}>Payment Details</h1>
                    <div className={GlobalStyle.tableContainer}>
                        <table className={GlobalStyle.table}>
                            <thead className={GlobalStyle.thead}>
                                <tr>
                                    <th className={GlobalStyle.tableHeader}>Date</th>
                                    <th className={GlobalStyle.tableHeader}>Paid Amount</th>
                                    <th className={GlobalStyle.tableHeader}>Settled Balance</th>
                                    <th className={GlobalStyle.tableHeader}>Installment Sequence</th>
                                    <th className={GlobalStyle.tableHeader}>Transaction Type</th>
                                    <th className={GlobalStyle.tableHeader}>Transaction Amount</th>
                                    <th className={GlobalStyle.tableHeader}>Transaction DTM</th>
                                </tr>
                            </thead>
                            <tbody>
                            {settlementAndPaymentDetails?.paymentData ? (
                                <tr>
                                <td className={GlobalStyle.tableData}>
                                    {new Date(settlementAndPaymentDetails.paymentData.created_dtm).toLocaleDateString('en-GB')}
                                </td>
                                <td className={GlobalStyle.tableData}>
                                    {settlementAndPaymentDetails.paymentData.Installment_Paid_Amount || 'N/A'}
                                </td>
                                <td className={GlobalStyle.tableData}>
                                    {settlementAndPaymentDetails.paymentData.cummilative_settled_balance}
                                </td>
                                <td className={GlobalStyle.tableData}>
                                    {settlementAndPaymentDetails.paymentData.installment_seq}
                                </td>
                                <td className={GlobalStyle.tableData}>
                                    {settlementAndPaymentDetails.paymentData.money_transaction_type}
                                </td>
                                <td className={GlobalStyle.tableData}>
                                    {settlementAndPaymentDetails.paymentData.money_transaction_amount}
                                </td>
                                <td className={GlobalStyle.tableData}>
                                    {new Date(settlementAndPaymentDetails.paymentData.money_transaction_date).toLocaleDateString('en-GB')}
                                </td>
                                </tr>
                            ) : (
                                <tr>
                                <td colSpan={7} className="text-center py-4 text-gray-500">No payment data available</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
