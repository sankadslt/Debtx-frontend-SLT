// Purpose: This template is used for Mediation board acceptance
// Created Date: 2025/01/07
// Created By:W.R.S.M.Bandara
// Last Modified Date: 2025/01/08
// Modified By: savindyabandara413@gmail.com
// Version: node 11
// ui number : v2.11
// Dependencies: tailwind css
// Related Files:
// Notes: This template uses a tailwind css form for the background and section dividing
import React, { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { useNavigate, useLocation } from "react-router-dom";
import { List_Details_Of_Mediation_Board_Acceptance } from "/src/services/case/CaseServices.js";

const ForwardMediationBoard = () => {
  const [acceptRequest, setAcceptRequest] = useState(""); // State for Yes/No toggle
  const [remarkText, setRemarkText] = useState(""); // State for remarks input
  const [Data, setData] = useState([]); // State for remarks input
  const [requesthistory, setrequesthistory] = useState([]); // State for remarks input
  const navigate = useNavigate();
  const location = useLocation();

  const caseId = location.state?.case_Id;
  const userInteraction = location.state?.User_Interaction_TYPE;
  const delegateUserId = location.state?.Delegate_User_id;
  const locationLogId = location.state?.INteraction_Log_ID;

  console.log("passed case id is ", caseId);
  console.log("passed user interaction ", userInteraction);
  console.log("passed delegate id", delegateUserId);
  console.log("passed location id ", locationLogId);

  const negotiationHistory = [
    {
      date: "2024.11.04",
      Negotiation: "------",
      remark: "------",
    },
    {
      date: "2024.11.05",
      Negotiation: "------",
      remark: "------",
    },
    {
      date: "2024.11.06",
      Negotiation: "------",
      remark: "------",
    },
  ];

  const taskHistory = [
    {
      date: "2024.11.05",
      Negotiation: "----",
      remark: "------",
    },
    {
      date: "2024.11.07",
      Negotiation: "----",
      remark: "----",
    },
    {
      date: "2024.11.09",
      Negotiation: "----",
      remark: "----",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          case_id: caseId,
          User_Intraction_Type: userInteraction,
          delegate_user_id: delegateUserId,
          Interaction_Log_ID: locationLogId,
        };

        const response = await List_Details_Of_Mediation_Board_Acceptance(
          payload
        );
        console.log("response", response);
        
        setData(response);
        setrequesthistory(response?.Request_History);
        console.log("request history", requesthistory);
    
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, [ caseId, userInteraction, delegateUserId, locationLogId]);

  const handleWithdraw = () => {
    alert("Withdrawn");
    e.preventDefault(); // Prevent page reload
    alert(`Request Accepted: ${acceptRequest}`);

    // Reset form after submission
    setAcceptRequest("");
    setRemarkText("");
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    alert(`Request Accepted: ${acceptRequest}`);

    // Reset form after submission
    setAcceptRequest("");
    setRemarkText("");
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>
        Request Type: Forward Mediation Board
      </h1>
      <div className={`${GlobalStyle.cardContainer}`}>
        <p className="mb-2">
          <strong>Case ID: </strong> {caseId}
        </p>
        <p className="mb-2">
          <strong>Customer Ref:</strong>  {Data?.customer_ref}
        </p>
        <p className="mb-2">
          <strong>Account no:</strong> {Data?.account_no}
        </p>
        <p className="mb-2">
          <strong>Arrears Amount:</strong> {Data?.current_arrears_amount}
        </p>
        <p className="mb-2">
          <strong>Last Payment Date:</strong> {new Date(Data?.last_payment_date).toLocaleDateString("en-GB")}
        </p>
      </div>
      <div className="mt-10 mb-6">
        <label className={GlobalStyle.remarkTopic}>
          Negotiation History :{" "}
        </label>
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Date
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Negotiation
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Remark
                </th>
              </tr>
            </thead>
            <tbody>
              {negotiationHistory.map((detail, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }`}
                >
                  <td className={GlobalStyle.tableData}>{detail.date}</td>
                  <td className={GlobalStyle.tableData}>
                    {detail.Negotiation}
                  </td>
                  <td className={GlobalStyle.tableData}>{detail.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-10 mb-6">
        <label className={GlobalStyle.remarkTopic}>Request History : </label>
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Date
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Negotiation
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Remark
                </th>
              </tr>
            </thead>
            <tbody>
              {requesthistory.map((detail, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }`}
                >
                  <td className={GlobalStyle.tableData}>{new Date(detail.CreateDTM).toLocaleDateString()}</td>
                  <td className={GlobalStyle.tableData}>
                    {detail.User_Interaction_Type}
                  </td>
                  <td className={GlobalStyle.tableData}>{detail.Rejected_Reason || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-10 mb-6">
        <label className={GlobalStyle.remarkTopic}>Accept Request:</label>
        <div className="flex justify-left gap-8 mt-2">
          <label className="flex items">
            <input
              type="radio"
              value="Yes"
              name="acceptRequest"
              checked={acceptRequest === "Yes"}
              className="mr-2"
              onChange={(e) => setAcceptRequest(e.target.value)}
            />
            Yes
          </label>
          <label className="flex items">
            <input
              type="radio"
              value="No"
              name="acceptRequest"
              checked={acceptRequest === "No"}
              className="mr-2"
              onChange={(e) => setAcceptRequest(e.target.value)}
            />
            No
          </label>
        </div>
      </div>
      <div className="mb-6">
        <label className={GlobalStyle.remarkTopic}>Remark</label>
        <textarea
          value={remarkText}
          onChange={(e) => setRemarkText(e.target.value)}
          className={`${GlobalStyle.remark}`}
          rows="5"
        ></textarea>
      </div>
      <div className="flex gap-4">
        <button className={GlobalStyle.buttonPrimary} onClick={handleWithdraw}>
          Withdraw
        </button>
        <button className={GlobalStyle.buttonPrimary} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default ForwardMediationBoard;
