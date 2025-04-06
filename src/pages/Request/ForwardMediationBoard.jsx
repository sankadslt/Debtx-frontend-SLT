// Purpose: This template is used for Mediation board acceptance
// Created Date: 2025/01/07
// Created By:W.R.S.M.Bandara
// Last Modified Date: 2025/03/14
// Modified By: savindyabandara413@gmail.com, ytheenura5@gmail.com
// Version: node 11
// ui number : v2.11
// Dependencies: tailwind css
// Related Files:
// Notes: This template uses a tailwind css form for the background and section dividing
import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { useNavigate, useLocation, } from "react-router-dom";
import {
  List_Details_Of_Mediation_Board_Acceptance,
  Submit_Mediation_Board_Acceptance,
  Withdraw_Mediation_Board_Acceptance
} from "../../services/request/request.js";
import Swal from "sweetalert2";
import { getLoggedUserId } from "/src/services/auth/authService.js";

const ForwardMediationBoard = () => {
  const [acceptRequest, setAcceptRequest] = useState(""); // State for Yes/No toggle
  const [remarkText, setRemarkText] = useState(""); // State for remarks input
  const [letterSent, setLetterSent] = useState(false); // State for letter sent checkbox
  const [Data, setData] = useState({});
  const [requesthistory, setrequesthistory] = useState([]);
  const [NegotiationHistory, setNegotiationHistory] = useState([]);
  const [mediationboard, setMediationBoard] = useState([]); // State for mediation board data

  const [calendarMonth, setCalendarMonth] = useState(); // State for calendar month input
  
 

  const navigate = useNavigate();
  const location = useLocation();

  const caseId = location.state?.case_Id;
  const userInteraction = location.state?.User_Interaction_TYPE;
  const delegateUserId = location.state?.Delegate_User_id;
  const locationLogId = location.state?.INteraction_Log_ID;
  const interationid = location.state?.INteraction_ID;

  console.log("passed case id is ", caseId);
  console.log("passed user interaction ", userInteraction);
  console.log("passed delegate id", delegateUserId);
  console.log("passed Interaction_Log_ID ", locationLogId);
  console.log("passed Interaction_ID ", interationid);

  const months = Data?.monitor_months; // Assuming this is the requested period in months
  const requestType = userInteraction;

  let request_mode = "";
    if (
      requestType === "Mediation board forward request letter" || 
      requestType === "Negotiation Settlement plan Request" ||
      requestType === "Negotiation period extend Request" ||
      requestType === "Negotiation customer further information Request" ||
      requestType === "Negotiation Customer request service" 
    ) {
      request_mode = "Negotiation";
    } else if (
      requestType === "Mediation Board Settlement plan Request"||
      requestType === "Mediation Board period extend Request" ||
      requestType === "Mediation Board customer further information request" ||
      requestType === "Mediation Board Customer request service" 
      
    ) {
      request_mode = "Mediation Board";
    }

    console.log("Request Mode:", request_mode);

  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPAge, setCurrentPAge] = useState(1);
  const [CUrrentPage, setCUrrentPage] = useState(1);
  const recordsPerPage = 5;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = NegotiationHistory.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(NegotiationHistory.length / recordsPerPage);


  const indexOfLastRecord1 = currentPAge * recordsPerPage;
  const indexOfFirstRecord1 = indexOfLastRecord1 - recordsPerPage;
  const currentData1 = requesthistory.slice(indexOfFirstRecord1, indexOfLastRecord1);
  const totalPAges = Math.ceil(requesthistory.length / recordsPerPage);

  const indexOfLastRecord2 = CUrrentPage * recordsPerPage;
  const indexOfFirstRecord2 = indexOfLastRecord2 - recordsPerPage;
  const currentData2 = mediationboard.slice(indexOfFirstRecord2, indexOfLastRecord2);
  const TOtalPages = Math.ceil(mediationboard.length / recordsPerPage);


  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlepagnation = (direction) => {
    if (direction === "prev" && currentPAge > 1) {
      setCurrentPAge(currentPAge - 1);
    } else if (direction === "next" && currentPAge < totalPAges) {
      setCurrentPAge(currentPAge + 1);
    }
  };

  const handlePrevNext1 = (direction) => {
    if (direction === "prev" && CUrrentPage > 1) {
      setCUrrentPage(CUrrentPage - 1);
    } else if (direction === "next" && CUrrentPage < TOtalPages) {
      setCUrrentPage(CUrrentPage + 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          case_id: caseId,
          User_Intraction_Type: userInteraction,
          delegate_user_id: delegateUserId,
          Interaction_Log_ID: locationLogId,
        };
        console.log("payload", payload);
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
        if (response?.mediation_board) {
          setMediationBoard(response?.mediation_board);
        } else {
          setMediationBoard([]);
        }
        console.log("The fetched mediation board is this", mediationboard);
        console.log("The fetched negotiation history is this", NegotiationHistory);
        console.log("The fetched request history is this", requesthistory);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, [caseId, userInteraction, delegateUserId, locationLogId]);


 const handleWithdraw = async () => {
    const loggedUserId = await getLoggedUserId();
    const payload = {
      create_by: loggedUserId,
      Interaction_Log_ID: locationLogId,
      case_id: caseId,
      User_Interaction_Type: userInteraction,
      Request_Mode: request_mode,
      Interaction_ID : interationid,
      "Request Accept": acceptRequest,
      Reamrk: remarkText,
      No_of_Calendar_Month: calendarMonth,
      Letter_Send: letterSent
    };
    console.log("payload", payload);
    try {
      const response = await Withdraw_Mediation_Board_Acceptance(payload);
      console.log("response", response);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Selected records have been withdrawn successfully.",
        confirmButtonColor: "#28a745",
      });
    } catch (error) {
      console.error("Error withdrawing batch:", error);

      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        "An error occurred. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#f1c40f",
      });
    }
  };


  const handleSubmit = async () => {
    const loggedUserId = await getLoggedUserId();
    const payload = {
      create_by: loggedUserId,
      Interaction_Log_ID: locationLogId,
      case_id: caseId,
      User_Interaction_Type: userInteraction,
      Request_Mode: request_mode,
      Interaction_ID : interationid,
      "Request Accept": acceptRequest,
      Reamrk: remarkText,
      No_of_Calendar_Month: calendarMonth,
      Letter_Send: letterSent
    };
    console.log("payload", payload);
    try {
      const response = await Submit_Mediation_Board_Acceptance(payload);
      console.log("response", response);
      Swal.fire({
              icon: "success",
              title: "Success",
              text: "Selected records have been approved successfully.",
              confirmButtonColor: "#28a745",
            });

      } catch (error) {
            console.error("Error approving batch:", error);
            
            const errorMessage = error?.response?.data?.message || 
                                   error?.message || 
                                   "An error occurred. Please try again.";
      
            Swal.fire({
              icon: "error",
              title: "Error",
              text: errorMessage,
              confirmButtonColor: "#f1c40f",
            });
          }
    }

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge} style={{ marginBottom: "20px" }}>Request Type: {requestType}</h1>
      <div className={`${GlobalStyle.cardContainer}`}>
        <p className="mb-2">
          <strong>Case ID: </strong>
          {caseId}
        </p>
        <p className="mb-2">
          <strong>Customer Ref: </strong> {Data?.customer_ref}
        </p>
        <p className="mb-2">
          <strong>Account no: </strong>
          {Data?.account_no}
        </p>
        {requestType === "Mediation board forward request letter" && (
            <p className="mb-2">
              <strong>Customer Name: </strong> {Data?.customer_name}
            </p>
          )}
        <p className="mb-2">
          <strong>Arrears Amount: </strong> {Data?.current_arrears_amount}
        </p>
        {requestType === "Mediation board forward request letter" && (
            <p className="mb-2">
              <strong> Validity Expire Date: </strong> {Data?.customer_name}
            </p>
          )}
        <p className="mb-2">
          <strong>Last Payment Date: </strong>{" "}
          {new Date(Data?.last_payment_date).toLocaleDateString("en-GB")}
        </p>
        {requestType === "Mediation board forward request letter" && (
            <p className="mb-2">
              <strong> Customer Type Name: </strong> {Data?.Customer_Type_Name}
            </p>
          )}
          {requestType === "Mediation board forward request letter" && (
            <p className="mb-2">
              <strong> Account Manager Code: </strong> {Data?.ACCOUNT_MANAGER}
            </p>
          )}
        {requestType === "Mediation board forward request letter" && (
            <p className="mb-2">
              <strong> Credit Class No: </strong> {Data?.customer_name}
            </p>
          )}
        {requestType === "Mediation board forward request letter" && (
            <p className="mb-2">
              <strong> Credit Class Name: </strong> {Data?.customer_name}
            </p>
          )}
        

      </div>
      {NegotiationHistory.length > 0 && (
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
              {currentData.map((detail, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }`}
                >
                  <td className={GlobalStyle.tableData}> {new Date(detail.created_dtm).toLocaleDateString("en-GB")}</td>
                  <td className={GlobalStyle.tableData}>
                    {detail.field_reason}
                  </td>
                  <td className={GlobalStyle.tableData}>{detail.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
        <div className={GlobalStyle.navButtonContainer}>
            <button
              onClick={() => handlePrevNext("prev")}
              disabled={currentPage === 1}
              className={`${GlobalStyle.navButton} ${
                currentPage === 1 ? "cursor-not-allowed" : ""
              }`}
            >
              <FaArrowLeft />
            </button>
            <span className={`${GlobalStyle.pageIndicator} mx-4`}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePrevNext("next")}
              disabled={currentPage === totalPages}
              className={`${GlobalStyle.navButton} ${
                currentPage === totalPages ? "cursor-not-allowed" : ""
              }`}
            >
              <FaArrowRight />
            </button>
          </div>
      </div>
      )}

      {/* Mediation board */}

      {mediationboard.length > 0 && (
        <div className="mt-10 mb-6">
        <label className={GlobalStyle.remarkTopic}>
          MediationBoard History :{" "}
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
              {currentData2.map((detail, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }`}
                >
                  <td className={GlobalStyle.tableData}> {new Date(detail.created_dtm).toLocaleDateString("en-GB")}</td>
                  <td className={GlobalStyle.tableData}>
                    {detail.customer_response}
                  </td>
                  <td className={GlobalStyle.tableData}>{detail.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
        <div className={GlobalStyle.navButtonContainer}>
            <button
              onClick={() => handlePrevNext1("prev")}
              disabled={CUrrentPage === 1}
              className={`${GlobalStyle.navButton} ${
                CUrrentPage === 1 ? "cursor-not-allowed" : ""
              }`}
            >
              <FaArrowLeft />
            </button>
            <span className={`${GlobalStyle.pageIndicator} mx-4`}>
              Page {CUrrentPage} of {TOtalPages}
            </span>
            <button
              onClick={() => handlePrevNext1("next")}
              disabled={CUrrentPage === TOtalPages}
              className={`${GlobalStyle.navButton} ${
                CUrrentPage === TOtalPages ? "cursor-not-allowed" : ""
              }`}
            >
              <FaArrowRight />
            </button>
          </div>
      </div>
      )}
      {/* Request history table */}
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
              {currentData1.map((detail, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }`}
                >
                  <td className={GlobalStyle.tableData}>{new Date(detail.CreateDTM).toLocaleDateString("en-GB")}</td>
                  <td className={GlobalStyle.tableData}>
                    {detail.User_Interaction_Type}
                  </td>
                  <td className={GlobalStyle.tableData}>{detail.User_Interaction_Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={GlobalStyle.navButtonContainer}>
            <button
              onClick={() => handlepagnation("prev")}
              disabled={currentPAge === 1}
              className={`${GlobalStyle.navButton} ${
                currentPAge === 1 ? "cursor-not-allowed" : ""
              }`}
            >
              <FaArrowLeft />
            </button>
            <span className={`${GlobalStyle.pageIndicator} mx-4`}>
              Page {currentPAge} of {totalPAges}
            </span>
            <button
              onClick={() => handlepagnation("next")}
              disabled={currentPAge === totalPAges}
              className={`${GlobalStyle.navButton} ${
                currentPAge === totalPAges ? "cursor-not-allowed" : ""
              }`}
            >
              <FaArrowRight />
            </button>
          </div>
      </div>

      {/* forward mediation board */}
      {requestType === "Mediation board forward request letter" && (
        <div>
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
              disabled={acceptRequest === "Yes"}
            ></textarea>
          </div>

          {acceptRequest === "Yes" && (
            <div className="mb-6 flex items-center">
              <label className={GlobalStyle.remarkTopic}>Letter Sent</label>
              <input
                type="checkbox"
                checked={letterSent}
                onChange={(e) => setLetterSent(e.target.checked)}
                className="ml-2 mb-2"
              />
            </div>
          )}

          <div className="flex gap-4">
            {acceptRequest !== "Yes" && (
              <button
                className={GlobalStyle.buttonPrimary}
                onClick={handleWithdraw}
              >
                Withdraw
              </button>
            )}
            <button
              className={GlobalStyle.buttonPrimary}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* validity period extension */}
      {(requestType === "Negotiation period extend Request" || requestType === "Mediation Board period extend Request" ) && (
        <div>
          <div className="mb-6">
            <label className={GlobalStyle.remarkTopic}>
              Validity Period: {months} months
            </label>
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
                  disabled={months >= 5}
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

          {acceptRequest === "Yes" && (
            <div className="mb-6 flex items-center gap-3">
              <label className={GlobalStyle.remarkTopic}>Calender month:</label>
              <input
                type="number"
                className={`${GlobalStyle.inputText}`}
                min="1"
                max="5"
                defaultValue={2}
                onChange={(e) => setCalendarMonth(e.target.value)}
                value={calendarMonth}
              />
            </div>
          )}

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
            <button
              className={GlobalStyle.buttonPrimary}
              onClick={handleWithdraw}
            >
              Withdraw
            </button>
            <button
              className={GlobalStyle.buttonPrimary}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Additional information */}
      {(requestType === "Negotiation customer further information Request" ||
        requestType === "Negotiation Settlement plan Request" ||
        requestType === "Negotiation Customer request service" ||
        requestType === "Mediation Board Settlement plan Request" ||
        requestType === "Mediation Board customer further information request" ||
        requestType === "Mediation Board Customer request service"
) && (
        <div>
          <div className="mt-10 mb-6">
            <label className={GlobalStyle.remarkTopic}>Request provided:</label>
            <div className="flex justify-left gap-8 mt-2">
              <label className="flex items">
                <input
                  type="radio"
                  value="Yes"
                  name="acceptRequest"
                  checked={acceptRequest === "Yes"}
                  className="mr-2"
                  onChange={(e) => setAcceptRequest(e.target.value)}
                  disabled={months >= 5}
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
            <button
              className={GlobalStyle.buttonPrimary}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForwardMediationBoard;
