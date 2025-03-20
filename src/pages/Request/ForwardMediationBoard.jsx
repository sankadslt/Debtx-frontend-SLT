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
import {
  List_Details_Of_Mediation_Board_Acceptance,
  Submit_Mediation_Board_Acceptance,
  Withdraw_Mediation_Board_Acceptance,
} from "/src/services/case/CaseServices.js";
import Swal from "sweetalert2";
import { getLoggedUserId } from "/src/services/auth/authService.js";

const ForwardMediationBoard = () => {
  const [acceptRequest, setAcceptRequest] = useState(""); // State for Yes/No toggle
  const [remarkText, setRemarkText] = useState(""); // State for remarks input
  const [Data, setData] = useState([]); // State for remarks input
  const [requesthistory, setrequesthistory] = useState([]); // State for remarks input
  const [negotiationHistory, setNegotiationHistory] = useState([]); // State for remarks input

  const [letterSend, setLetterSend] = useState(false);
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

        if (response?.Request_History) {
          setrequesthistory(response?.Request_History);
        } else {
          setrequesthistory([]);
        }

        if (response?.ro_negotiation) {
          setNegotiationHistory(response?.ro_negotiation);
        } else {
          setNegotiationHistory([]);
        }
        console.log("negotiation history", negotiationHistory);
        console.log("request history", requesthistory);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, [caseId, userInteraction, delegateUserId, locationLogId]);

  const handleWithdraw = () => {
    alert("Withdrawn");
    e.preventDefault(); // Prevent page reload
    alert(`Request Accepted: ${acceptRequest}`);

    // Reset form after submission
    setAcceptRequest("");
    setRemarkText("");
  };

  const handleSubmit = (e) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to rejected the selected record?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const userId = await getLoggedUserId();
          const payload = {
            ccreate_by: userId,
            Interaction_Log_ID: locationLogId,
            case_id: caseId,
            User_Interaction_Type: userInteraction,
            Request_Mode: Data?.Request_Mode || "",
            Interaction_ID: Data?.Interaction_ID || "",
            "Request Accept": acceptRequest,
            Reamrk: remarkText,
            No_of_Calendar_Month: "1",
            Letter_Send: letterSend,
          };
          console.log("payload", payload);
          const response = await Submit_Mediation_Board_Acceptance(payload);
          console.log("response", response);

          Swal.fire({
            title: "Success!",
            text: "Request has been submitted successfully",
            icon: "success",
            confirmButtonColor: "#28a745",
          }).then(() => {
            navigate(-1);
          });
        } catch (error) {
          console.log("error", error);
          Swal.fire({
            title: "Error!",
            text: "Failed to submit the request",
            icon: "error",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
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
          <strong>Customer Ref:</strong> {Data?.customer_ref}
        </p>
        <p className="mb-2">
          <strong>Account no:</strong> {Data?.account_no}
        </p>
        <p className="mb-2">
          <strong>Arrears Amount:</strong> {Data?.current_arrears_amount}
        </p>
        <p className="mb-2">
          <strong>Last Payment Date:</strong>{" "}
          {new Date(Data?.last_payment_date).toLocaleDateString("en-GB")}
        </p>
        <p className="mb-2">
          <strong>Customer Type name:</strong> {Data?.Customer_Type_Name}
        </p>
        <p className="mb-2">
          <strong>Account Manager Code:</strong> {Data?.ACCOUNT_MANAGER}
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
                  <td className={GlobalStyle.tableData}>
                    {new Date(detail.created_dtm).toLocaleDateString()}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {detail.field_reason}
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
                  <td className={GlobalStyle.tableData}>
                    {new Date(detail.CreateDTM).toLocaleDateString()}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {detail.User_Interaction_Type}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {detail.Rejected_Reason || ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-10 mb-6">
        <label className={GlobalStyle.remarkTopic}>Accept Request:</label>
        <div className="flex justify-left gap-8 mt-2">
          <label className="flex items-center">
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
          <label className="flex items-center">
            <input
              type="radio"
              value="No"
              name="acceptRequest"
              checked={acceptRequest === "No"}
              className="mr-2"
              onChange={(e) => {
                setAcceptRequest(e.target.value);
                setLetterSend(false); // Reset letterSend when selecting "No"
              }}
            />
            No
          </label>
        </div>

        <div className="mb-6 mt-4">
          <label className={GlobalStyle.remarkTopic}>Remark</label>
          <textarea
            value={remarkText}
            onChange={(e) => setRemarkText(e.target.value)}
            className={`${GlobalStyle.remark}`}
            rows="5"
          ></textarea>
        </div>
        {acceptRequest === "Yes" && (
          <div className="mb-5 mt-4 flex items-center gap-2">
            <span className={GlobalStyle.remarkTopic}>Letter Send:</span>
            <input
              type="checkbox"
              checked={letterSend}
              className="mt--1"
              onChange={(e) => setLetterSend(e.target.checked)}
            />
            <span className={GlobalStyle.remarkTopic}>Yes</span>
          </div>
        )}

        <div className="flex gap-4 justify-end">
          {acceptRequest !== "Yes" && (
            <button
              className={GlobalStyle.buttonPrimary}
              onClick={handleWithdraw}
            >
              Withdraw
            </button>
          )}
          <button className={GlobalStyle.buttonPrimary} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForwardMediationBoard;
