/* Purpose: This template is used for the 2.17.1 - Mediation Board Reaponse .
Created Date: 2025-02-28
Created By: sakumini (sakuminic@gmail.com)
Modified By: 
Version: node 20
ui number : 2.17.1
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the Mediation Board Response Screen */

import React from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";

const MediationBoardResponse = () => {
  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8">Mediation Board Response</h1>

      {/* Case Info Card */}
      <div className="p-4 rounded-lg shadow-xl mb-6 bg-white bg-opacity-15 border-2 border-zinc-300 max-w-4xl">
        <p className="mb-2">
          <strong>Case ID:</strong>
        </p>
        <p className="mb-2">
          <strong>Customer Ref:</strong>
        </p>
        <p className="mb-2">
          <strong>Account no:</strong>
        </p>
        <p className="mb-2">
          <strong>Arrears Amount:</strong>
        </p>
        <p className="mb-2">
          <strong>Last Payment Date:</strong>
        </p>
      </div>

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