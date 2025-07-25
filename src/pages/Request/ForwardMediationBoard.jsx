// Purpose: This template is used for Mediation board acceptance
// Created Date: 2025/01/07
// Created By:W.R.S.M.Bandara
// Last Modified Date: 2025/03/14
// Modified By: savindyabandara413@gmail.com, ytheenura5@gmail.com
// Modified By: Janani Kumarasiri (jkktg001@gmail.com)
// Version: node 11
// ui number : v2.11
// Dependencies: tailwind css
// Related Files:
// Notes: This template uses a tailwind css form for the background and section dividing
import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { useNavigate, useLocation } from "react-router-dom";
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

  const [calendarMonth, setCalendarMonth] = useState(); // State for calendar month input\



  const navigate = useNavigate();
  const location = useLocation();

  const caseId = location.state?.case_Id;
  const requestType = location.state?.User_Interaction_TYPE;
  // const delegateUserId = location.state?.delegate_user_id;
  const INteraction_Log_ID = location.state?.INteraction_Log_ID;
  const interationid = location.state?.INteraction_ID;

  // const caseId = 6;
  // const INteraction_Log_ID = 1;
  // const interationid = 4;

  // console.log("passed case id is ", caseId);
  // console.log("passed user interaction ", requestType);
  // console.log("passed delegate id", delegateUserId);
  // console.log("passed Interaction_Log_ID ", INteraction_Log_ID);
  // console.log("passed Interaction_ID ", interationid);

  const months = Data?.validity_period_months;
  // const requestType = userInteraction;
  // const requestType = "Negotiation period extend Request" // for testing

  // let request_mode = "";
  // if (
  //   requestType === "Mediation board forward request letter" ||
  //   requestType === "Negotiation Settlement plan Request" ||
  //   requestType === "Negotiation period extend Request" ||
  //   requestType === "Negotiation customer further information Request" ||
  //   requestType === "Negotiation Customer request service"
  // ) {
  //   request_mode = "Negotiation";
  // } else if (
  //   requestType === "Mediation Board Settlement plan Request" ||
  //   requestType === "Mediation Board period extend Request" ||
  //   requestType === "Mediation Board customer further information request" ||
  //   requestType === "Mediation Board Customer request service"

  // ) {
  //   request_mode = "Mediation Board";
  // }

  // console.log("Request Mode:", request_mode);


  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const recordsPerPage = 5;

  // Negotiation History Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = NegotiationHistory.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(NegotiationHistory.length / recordsPerPage);

  // Request History Pagination
  const indexOfLastRecord1 = currentPage1 * recordsPerPage;
  const indexOfFirstRecord1 = indexOfLastRecord1 - recordsPerPage;
  const currentData1 = requesthistory.slice(indexOfFirstRecord1, indexOfLastRecord1);
  const totalPAges = Math.ceil(requesthistory.length / recordsPerPage);

  // Mediation Board Pagination
  const indexOfLastRecord2 = currentPage2 * recordsPerPage;
  const indexOfFirstRecord2 = indexOfLastRecord2 - recordsPerPage;
  const currentData2 = mediationboard.slice(indexOfFirstRecord2, indexOfLastRecord2);
  const TOtalPages = Math.ceil(mediationboard.length / recordsPerPage);

  const handlebackbuttonClick = () => {
    navigate("/additional_request_log");
  };

  // Negotiation History Navigation Handle
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Request History Navigation Handle
  const handlepagnation = (direction) => {
    if (direction === "prev" && currentPage1 > 1) {
      setCurrentPage1(currentPage1 - 1);
    } else if (direction === "next" && currentPage1 < totalPAges) {
      setCurrentPage1(currentPage1 + 1);
    }
  };

  // Mediation Board Navigation Handle
  const handlePrevNext1 = (direction) => {
    if (direction === "prev" && currentPage2 > 1) {
      setCurrentPage2(currentPage2 - 1);
    } else if (direction === "next" && currentPage2 < TOtalPages) {
      setCurrentPage2(currentPage2 + 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getLoggedUserId();
        console.log("Logged User ID:", userData);

        if (!caseId || !requestType || !INteraction_Log_ID) {
          return;
        }

        const payload = {
          case_id: caseId,
          User_Interaction_Type: requestType,
          delegate_user_id: userData,
          Interaction_Log_ID: INteraction_Log_ID,
        };

        const response = await List_Details_Of_Mediation_Board_Acceptance(
          payload
        );
        // console.log("response", response);

        setData(response);

        if (response?.ro_requests) {
          setrequesthistory(response?.ro_requests);
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
        // console.log("The fetched mediation board is this", mediationboard);
        // console.log("The fetched negotiation history is this", NegotiationHistory);
        // console.log("The fetched request history is this", requesthistory);
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Error fetching data.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        // console.log("error", error);
      }
    };
    fetchData();
  }, [caseId, requestType, INteraction_Log_ID]);

  // Handdle withdraw button function
  // const handleWithdraw = async () => {
  //   const loggedUserId = await getLoggedUserId();
  //   const payload = {
  //     create_by: loggedUserId,
  //     Interaction_Log_ID: INteraction_Log_ID,
  //     case_id: caseId,
  //     User_Interaction_Type: requestType,
  //     Request_Mode: request_mode,
  //     Interaction_ID: interationid,
  //     "Request Accept": acceptRequest,
  //     Reamrk: remarkText,
  //     No_of_Calendar_Month: calendarMonth,
  //     Letter_Send: letterSent
  //   };
  //   console.log("payload", payload);
  //   try {
  //     const response = await Withdraw_Mediation_Board_Acceptance(payload);
  //     console.log("response", response);
  //     Swal.fire({
  //       icon: "success",
  //       title: "Success",
  //       text: "Selected records have been withdrawn successfully.",
  //       confirmButtonColor: "#28a745",
  //     });
  //   } catch (error) {
  //     console.error("Error withdrawing batch:", error);

  //     const errorMessage = error?.response?.data?.message ||
  //       error?.message ||
  //       "An error occurred. Please try again.";

  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: errorMessage,
  //       confirmButtonColor: "#d33",
  //     });
  //   }
  // };

  // Handle submit function
  const handleSubmit = async () => {
    const loggedUserId = await getLoggedUserId();

    if (!acceptRequest) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select whether to accept the request or not.",
        confirmButtonColor: "#ffc107",
      });
      return;
    }

    if (requestType === "Mediation board forward request letter"
      && acceptRequest === "No" && !remarkText) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please provide a remark if you are not accepting the request.",
        confirmButtonColor: "#ffc107",
      });
      return;
    }

    const payload = {
      create_by: loggedUserId,
      Interaction_Log_ID: INteraction_Log_ID,
      case_id: caseId,
      User_Interaction_Type: requestType,
      // Request_Mode: request_mode,
      Interaction_ID: interationid,
      requestAccept: acceptRequest,
      Reamrk: remarkText,
      No_of_Calendar_Month: calendarMonth,
      Letter_Send: letterSent
    };
    // console.log("payload", payload);

    try {
      const response = await Submit_Mediation_Board_Acceptance(payload);
      // console.log("response", response);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Selected records have been approved successfully.",
        confirmButtonColor: "#28a745",
      });
      navigate("/additional_request_log");

    } catch (error) {
      // console.error("Error approving batch:", error);

      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        "An error occurred. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
    }
  }

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge} style={{ marginBottom: "20px" }}>Request Type: {requestType}</h1>

      <div className="flex justify-center items-center">
        <div className={`${GlobalStyle.cardContainer} w-full max-w-lg`}>

          <table>
            <colgroup>
              <col />
              <col style={{ width: "20px" }} />
              <col />
            </colgroup>
            {/* Infomation card */}
            <tbody>
              <tr>
                <td className="py-2"><strong>Case ID</strong></td>
                <td className="py-2"> <strong> : </strong> </td>
                <td className="py-2"> {caseId}</td>
              </tr>
              <tr>
                <td className="py-2"><strong>Customer Ref</strong></td>
                <td className="py-2"> <strong> : </strong> </td>
                <td className="py-2"> {Data?.customer_ref}</td>
              </tr>
              <tr>
                <td className="py-2"><strong>Account no</strong></td>
                <td className="py-2"> <strong> : </strong> </td>
                <td className="py-2"> {Data?.account_no}</td>
              </tr>
              {requestType === "Mediation board forward request letter" && (
                <tr>
                  <td className="py-2"><strong>Customer Name</strong></td>
                  <td className="py-2"> <strong> : </strong> </td>
                  <td className="py-2"> {Data?.customer_name}</td>
                </tr>
              )}
              <tr>
                <td className="py-2"><strong>Arrears Amount</strong></td>
                <td className="py-2"> <strong> : </strong> </td>
                <td className="py-2">
                  {Data?.current_arrears_amount !== undefined
                    ? Data.current_arrears_amount.toLocaleString("en-LK", {
                      style: "currency",
                      currency: "LKR",
                    })
                    : ""}
                </td>
              </tr>
              {/* {requestType === "Mediation board forward request letter" && (
                <tr>
                  <td className="py-2"><strong>Validity Expire Date</strong></td>
                  <td className="py-2"> <strong> : </strong> </td>
                  <td className="py-2"> {new Date(Data?.validity_expire_dtm).toLocaleDateString("en-GB")} </td>
                </tr>
              )} */}
              <tr>
                <td className="py-2"><strong>Last Payment Date</strong></td>
                <td className="py-2"> <strong> : </strong> </td>
                <td className="py-2">
                  {Data.last_payment_date ?
                    new Date(Data.last_payment_date).toLocaleDateString("en-GB")
                    : ""}
                </td>
              </tr>
              {requestType === "Mediation board forward request letter" && (
                <tr>
                  <td className="py-2"><strong>Customer Type Name</strong></td>
                  <td className="py-2"> <strong> : </strong> </td>
                  <td className="py-2"> {Data?.customer_type_name}</td>
                </tr>
              )}
              {requestType === "Mediation board forward request letter" && (
                <tr>
                  <td className="py-2"><strong>Account Manager Code</strong></td>
                  <td className="py-2"> <strong> : </strong> </td>
                  <td className="py-2"> {Data?.account_manager_code}</td>
                </tr>
              )}
              {/* {requestType === "Mediation board forward request letter" && (
                <tr>
                  <td className="py-2"><strong>Credit Class No</strong></td>
                  <td className="py-2"> <strong> : </strong> </td>
                  <td className="py-2"></td>
                </tr>
              )} */}
              {/* {requestType === "Mediation board forward request letter" && (
                <tr>
                  <td className="py-2"><strong>Credit Class Name</strong></td>
                  <td className="py-2"> <strong> : </strong> </td>
                  <td className="py-2"></td>
                </tr>
              )} */}
            </tbody>
          </table>

          {/* Negotiation History */}

        </div>
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
                {currentData && currentData.length > 0 ? (
                  currentData
                    .sort((a, b) => new Date(b.created_dtm) - new Date(a.created_dtm))
                    .map((detail, index) => (
                      <tr
                        key={index}
                        className={`${index % 2 === 0
                          ? GlobalStyle.tableRowEven
                          : GlobalStyle.tableRowOdd
                          }`}
                      >
                        <td className={GlobalStyle.tableData}> {new Date(detail.created_dtm).toLocaleDateString("en-GB")}</td>
                        <td className={GlobalStyle.tableData}>
                          {detail.field_reason}
                        </td>
                        <td className={GlobalStyle.tableData}>{detail.negotiation_remark}</td>
                      </tr>
                    ))) : (
                  <tr>
                    <td colSpan="3" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                      No negotiation history available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>
          <div className={GlobalStyle.navButtonContainer}>
            <button
              onClick={() => handlePrevNext("prev")}
              disabled={currentPage === 1}
              className={`${GlobalStyle.navButton} ${currentPage === 1 ? "cursor-not-allowed" : ""
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
              className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""
                }`}
            >
              <FaArrowRight />
            </button>
          </div>
        </div>)}

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
                    Customer Response
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Remark
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData2 && currentData2.length > 0 ? (
                  currentData2
                    .sort((a, b) => new Date(b.created_dtm) - new Date(a.created_dtm))
                    .map((detail, index) => (
                      <tr
                        key={index}
                        className={`${index % 2 === 0
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
                    ))) : (
                  <tr>
                    <td colSpan="3" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                      No mediation board history available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>
          <div className={GlobalStyle.navButtonContainer}>
            <button
              onClick={() => handlePrevNext1("prev")}
              disabled={currentPage2 === 1}
              className={`${GlobalStyle.navButton} ${currentPage2 === 1 ? "cursor-not-allowed" : ""
                }`}
            >
              <FaArrowLeft />
            </button>
            <span className={`${GlobalStyle.pageIndicator} mx-4`}>
              Page {currentPage2} of {TOtalPages}
            </span>
            <button
              onClick={() => handlePrevNext1("next")}
              disabled={currentPage2 === TOtalPages}
              className={`${GlobalStyle.navButton} ${currentPage2 === TOtalPages ? "cursor-not-allowed" : ""
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
                  Request
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Remark
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData1 && currentData1.length > 0 ? (
                currentData1
                  .sort((a, b) => new Date(b.created_dtm) - new Date(a.created_dtm))
                  .map((detail, index) => (
                    <tr
                      key={index}
                      className={`${index % 2 === 0
                        ? GlobalStyle.tableRowEven
                        : GlobalStyle.tableRowOdd
                        }`}
                    >
                      <td className={GlobalStyle.tableData}>
                        {detail.created_dtm ?
                          new Date(detail.created_dtm).toLocaleDateString("en-GB")
                          : ""
                        }
                      </td>
                      <td className={GlobalStyle.tableData}>
                        {detail.ro_request}
                      </td>
                      <td className={GlobalStyle.tableData}>{detail.request_remark}</td>
                    </tr>
                  ))) : (
                <tr>
                  <td colSpan="3" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                    No request history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={GlobalStyle.navButtonContainer}>
          <button
            onClick={() => handlepagnation("prev")}
            disabled={currentPage1 === 1}
            className={`${GlobalStyle.navButton} ${currentPage1 === 1 ? "cursor-not-allowed" : ""
              }`}
          >
            <FaArrowLeft />
          </button>
          <span className={`${GlobalStyle.pageIndicator} mx-4`}>
            Page {currentPage1} of {totalPAges}
          </span>
          <button
            onClick={() => handlepagnation("next")}
            disabled={currentPage1 === totalPAges}
            className={`${GlobalStyle.navButton} ${currentPage1 === totalPAges ? "cursor-not-allowed" : ""
              }`}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* forward mediation board */}
      {requestType === "Mediation board forward request letter" && (
        <div className="flex justify-center items-center">
          <div className={GlobalStyle.cardContainer}>
            <div className="mb-6">
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

            {acceptRequest === "No" && (
              <div className="mb-6">
                <label className={GlobalStyle.remarkTopic}>Remark</label>
                <textarea
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  className={`${GlobalStyle.remark} w-full`}
                  rows="5"
                // disabled={acceptRequest === "Yes"}
                ></textarea>
              </div>
            )}

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
                // onClick={handleWithdraw}
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
        </div>
      )}

      {/* validity period extension */}
      {(requestType === "Negotiation period extend Request" || requestType === "Mediation Board period extend Request") && (
        <div className="flex justify-center items-center">
          <div className={GlobalStyle.cardContainer}>
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
                className={`${GlobalStyle.remark} w-full`}
                rows="5"
              ></textarea>
            </div>

            <div className="flex gap-4">
              {/* <button
                className={GlobalStyle.buttonPrimary}
              // onClick={handleWithdraw}
              >
                Withdraw
              </button> */}
              <button
                className={GlobalStyle.buttonPrimary}
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
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
          <div className="flex justify-center items-center">
            <div className={GlobalStyle.cardContainer}>
              <div className="mb-6">
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
                  className={`${GlobalStyle.remark} w-full`}
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
          </div>
        )}

      {/* Back button */}

      <div className="flex justify-start items-center w-full  mt-8 ">
        <button
          className={`${GlobalStyle.buttonPrimary} `}
          onClick={handlebackbuttonClick}
        >
          <FaArrowLeft className="mr-2" />

        </button>
      </div>
    </div>
  );
};



export default ForwardMediationBoard;
