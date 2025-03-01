/* Purpose: This template is used for the 2.17.1 - Mediation Board Reaponse .
Created Date: 2025-02-28
Created By: sakumini (sakuminic@gmail.com)
Modified By: Buthmi Mithara (buthmimithara1234@gmail.com)
Version: node 20
ui number : 2.17.1
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the Mediation Board Response Screen */

import React, { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const MediationBoardResponse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [nonSettlementAccept, setNonSettlementAccept] = useState(false);
  
  // Check if the case has MB_fail_with_pending_non_settlement status
  const caseData = location.state?.caseData || {
    status: "MB_fail_with_pending_non_settlement", // Default for testing
    caseId: "C002",
    date: "11/04/2024",
    drc: "ABCD",
    roName: "ABCD",
    rtom: "RTOM 01",
    callingRound: 3,
    nextCallingDate: "-"
  };
  
  // Sample case details - in production, this would come from the API
  const caseDetails = {
    caseId: caseData.caseId || "C002",
    customerRef: "",
    accountNo: "",
    arrearsAmount: "",
    lastPaymentDate: ""
  };
  
  const isNonSettlementCase = caseData.status === "MB_fail_with_pending_non_settlement";
  
  const handleSubmit = () => {
    // Submit the non-settlement acceptance
    console.log("Non-Settlement Accept:", nonSettlementAccept);
    navigate("/MediationBoard/MediationBoardCaseList");
  };

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8">Mediation Board Response</h1>

      {/* Case Info Card with Table Structure */}
      <div className="p-4 rounded-lg shadow-xl mb-6 bg-white bg-opacity-15 border-2 border-zinc-300 max-w-4xl">
        <table className="w-full">
          <tbody>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Case ID</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseDetails.caseId}</td>
            </tr>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Customer Ref</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseDetails.customerRef}</td>
            </tr>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Account no</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseDetails.accountNo}</td>
            </tr>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Arrears Amount</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseDetails.arrearsAmount}</td>
            </tr>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Last Payment Date</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseDetails.lastPaymentDate}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Non-Settlement Accept Section - Only shown for relevant status */}
      {isNonSettlementCase && (
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
      )}

      {/* Submit Button - Only shown for non-settlement cases */}
      {isNonSettlementCase && (
        <div className="mt-8 flex justify-end max-w-4xl">
          <button
            onClick={handleSubmit}
            className={`${GlobalStyle.buttonPrimary} px-8`}
          >
            Submit
          </button>
        </div>
      )}

      {/* Negotiation History Section */}
      <h2 className="text-xl font-semibold mb-4">Negotiation History</h2>
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Calling Date
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Customer Represented
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Agree to Settle
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Field Reason
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Remark
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white bg-opacity-75 border-b">
              <td className={GlobalStyle.tableData}>2024.11.04</td>
              <td className={GlobalStyle.tableData}>Yes/No</td>
              <td className={GlobalStyle.tableData}>Yes/No</td>
              <td className={GlobalStyle.tableData}></td>
              <td className={GlobalStyle.tableData}>............</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment Details Section */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Payment Details</h2>
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Date
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Paid amount
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Settled Balance
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white bg-opacity-75 border-b">
              <td className={GlobalStyle.tableData}>2024.11.04</td>
              <td className={GlobalStyle.tableData}>...................</td>
              <td className={GlobalStyle.tableData}>............</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Requested Additional Details Section */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Requested Additional Details</h2>
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Date
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Request
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Remark
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white bg-opacity-75 border-b">
              <td className={GlobalStyle.tableData}>2024.11.04</td>
              <td className={GlobalStyle.tableData}>...................</td>
              <td className={GlobalStyle.tableData}>............</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MediationBoardResponse;