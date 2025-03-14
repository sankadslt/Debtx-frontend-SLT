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
import React, { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";

const ForwardMediationBoard = () => {
  const [acceptRequest, setAcceptRequest] = useState(""); // State for Yes/No toggle
  const [remarkText, setRemarkText] = useState(""); // State for remarks input
  const [letterSent, setLetterSent] = useState(false); // State for letter sent checkbox

  const [calendarMonth, setCalendarMonth] = useState(); // State for calendar month input
  // const requestType = "forward mediation board";
  // const requestType = "validity period extension";
  // const requestType = "Additional Information";
  const requestType = "Customer Service Activation";

  const months = 3;

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

  const handleWithdraw = (e) => {
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
    setLetterSent(false);
    setCalendarMonth("");
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>Request Type: {requestType}</h1>
      <div className={`${GlobalStyle.cardContainer}`}>
        <p className="mb-2">
          <strong>Case ID:</strong>
        </p>
        <p className="mb-2">
          <strong>Customer Ref:</strong>{" "}
        </p>
        <p className="mb-2">
          <strong>Account no:</strong>{" "}
        </p>
        <p className="mb-2">
          <strong>Arrears Amount:</strong>{" "}
        </p>
        <p className="mb-2">
          <strong>Last Payment Date:</strong>{" "}
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
        <label className={GlobalStyle.remarkTopic}>Task History : </label>
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
              {taskHistory.map((detail, index) => (
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

      {/* forward mediation board */}
      {requestType === "forward mediation board" && (
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
      {requestType === "validity period extension" && (
        <div>
          <div className="mb-6">
            <label className={GlobalStyle.remarkTopic}>
              Requested Period: {months} months
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
                max="12"
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
      {requestType === "Additional Information" && (
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

      {/* Customer Service Activation */}
      {requestType === "Customer Service Activation" && (
        <div>
          <div className="mt-10 mb-6">
            <label className={GlobalStyle.remarkTopic}>Request informed:</label>
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
