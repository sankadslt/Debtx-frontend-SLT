/* Purpose: This template is used for the 2.17.1 - Mediation Board Reaponse .
Created Date: 2025-02-28
Created By: sakumini (sakuminic@gmail.com)
Modified By: Buthmi Mithara (buthmimithara1234@gmail.com)
Version: node 20
ui number : 2.17.1
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the Mediation Board Response Screen */

import { useState,useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { useNavigate ,useParams} from "react-router-dom";
import Swal from "sweetalert2";

import { List_All_DRCs_Mediation_Board_Cases, Accept_Non_Settlement_Request_from_Mediation_Board } from "../../services/case/CaseServices";

const MediationBoardResponse = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [nonSettlementAccept, setNonSettlementAccept] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        setLoading(true);
        const response = await List_All_DRCs_Mediation_Board_Cases({});
        console.log("Full Response:", response);
  
        if (response?.data && response.data.length > 0) {
          const filteredCase = response.data.find((item) => item.case_id == caseId);
          
          if (filteredCase) {
            setCaseData(filteredCase);
          } else {
            setCaseData(null);
          }
        } else {
          setCaseData(null);
        }
      } catch (error) {
        console.error("Error fetching case details:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCaseDetails();
  }, [caseId]);
  

  if (loading) return <p>Loading...</p>;
  if (!caseData) return <p>No case details found.</p>;

  console.log("Case Data:", caseData);
 console.log("case_current_status",caseData.case_current_status);
  const isNonSettlementCase = caseData.case_current_status === "MB Fail with Pending Non-Settlement";


  const handleSubmit = async () => {
    try {
      if (!nonSettlementAccept) {
        Swal.fire("Error", "You must accept Non-Settlement before submitting.", "error");
        return;
      }
console.log("caseId",caseId);
      await Accept_Non_Settlement_Request_from_Mediation_Board(caseId);

      Swal.fire("Success", "Non-Settlement request accepted successfully!", "success");
      navigate("/MediationBoard/MediationBoardCaseList");
    } catch  {
      Swal.fire("Error", "Failed to submit Non-Settlement acceptance.", "error");
    }
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
              <td className="text-gray-700">{caseData.case_id}</td>
            </tr>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Customer Ref</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseData.customer_ref}</td>
            </tr>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Account no</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseData.account_no}</td>
            </tr>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Arrears Amount</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">{caseData.current_arrears_amount}</td>
            </tr>
            <tr className="flex items-start py-1">
              <td className="font-bold w-48">Last Payment Date</td>
              <td className="px-2 font-bold">:</td>
              <td className="text-gray-700">
  {caseData.latest_next_calling_dtm 
    ? new Date(caseData.latest_next_calling_dtm).toLocaleDateString("en-GB") 
    : "N/A"}
</td>

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