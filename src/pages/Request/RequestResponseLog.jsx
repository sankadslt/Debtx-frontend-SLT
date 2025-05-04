// Purpose: This template is used for Request Response Log
// Created Date: 2025/01/07
// Created By:W.R.S.M.Bandara
// Last Modified Date: 2025/01/09
// Modified By: savindyabandara413@gmail.com
// Version: node 11
// ui number : v2.14
// Dependencies: tailwind css
// Related Files:
// Notes: This template uses a tailwind css form for the styling

import React, { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import DatePicker from "react-datepicker";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {
  List_Request_Response_log,
  Create_Task_For_Request_Responce_Log_Download,
} from "../../services/request/request";
import { getLoggedUserId } from "/src/services/auth/authService.js";
import Swal from "sweetalert2";

const RequestResponseLog = () => {
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [requestType, setRequestType] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const statuses = [];
  const rowsPerPage = 5;

  // Filtering logic
  const handleFilter = async () => {
    const payload = {
      case_current_status: requestType,
      date_from: fromDate,
      date_to: toDate,
    };
    console.log("Payload for fetching cases:", payload);
    const response = await List_Request_Response_log(payload);
    console.log("Response from fetching cases:", response);

    setFilteredData(response);
    console.log("Filtered data:", response);
    setCurrentPage(0);
  };

  // Pagination setup
  const pages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Task creation function
  const handleTask = async () => {
    alert("Task created successfully!");
    const case_current_status = filteredData.map(
      (row) => row.case_current_status
    );

    const date_from = fromDate;
    const date_to = toDate;
    const userID = await getLoggedUserId();
    const Created_By = userID;
    const payload = {
      case_current_status,
      date_from,
      date_to,
      Created_By,
    };
    console.log("Payload for creating task:", payload);
    const response = await Create_Task_For_Request_Responce_Log_Download(
      payload
    );
    console.log("Response from creating task:", response);
  };

  // if (batchIds.length === 0) {
  //   Swal.fire({
  //     icon: "warning",
  //     title: "Warning",
  //     text: "Please select at least one record to approve.",
  //     confirmButtonColor: "#f1c40f",
  //   });
  //   return;
  // }
  //   const payload = {
  //     case_current_status: batchIds,
  //     Created_By: userId,
  //   };
  //   try {
  //     const response = await Create_Task_For_Request_Responce_Log_Download(
  //       payload
  //     ); // Use 'await' here
  //     console.log("Response:", response);
  //     Swal.fire({
  //       icon: "success",
  //       title: "Success",
  //       text: "Data sent successfully.",
  //       confirmButtonColor: "#28a745",
  //     });
  //     handleFilter();
  //   } catch (error) {
  //     console.error("Error in sending the data:", error);

  //     const errorMessage =
  //       error?.response?.data?.message ||
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

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>Request Response Log</h1>
      <div className="flex flex-col mb-10">
        <div className="flex gap-4 justify-end">
          <select
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            className={GlobalStyle.selectBox}
          >
            <option value="">Select Status</option>
            <option value="RO Negotiation Settle Pending">
              RO Negotiation Settle Pending
            </option>
            <option value="RO Negotiation extended">
              RO Negotiation extended
            </option>
            <option value="RO Negotiation">RO Negotiation</option>
            <option value="MB Negotiation">MB Negotiation</option>
            <option value="MB Negotiation Settle Pending">
              MB Negotiation Settle Pending
            </option>
            <option value="Withdraw">Withdraw</option>
            <option value="FMB">FMB</option>

            {statuses.map((statusOption, index) => (
              <option key={index} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>

          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            dateFormat="MM/dd/yyyy"
            placeholderText="From Date"
            className={GlobalStyle.inputText}
          />
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            dateFormat="MM/dd/yyyy"
            placeholderText="To Date"
            className={GlobalStyle.inputText}
          />
          <button onClick={handleFilter} className={GlobalStyle.buttonPrimary}>
            Filter
          </button>
        </div>
      </div>

      {filteredData.length > 0 && (
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th className={GlobalStyle.tableHeader}>Case ID</th>
                <th className={GlobalStyle.tableHeader}>Status</th>
                <th className={GlobalStyle.tableHeader}>Request Status</th>
                <th className={GlobalStyle.tableHeader}>Validity Period</th>
                <th className={GlobalStyle.tableHeader}>DRC</th>
                <th className={GlobalStyle.tableHeader}>Request Details</th>
                <th className={GlobalStyle.tableHeader}>Approved On</th>
                <th className={GlobalStyle.tableHeader}>Approved By</th>
                <th className={GlobalStyle.tableHeader}>Remark</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr key={index} className="border-b bg-gray-50">
                  <td className={GlobalStyle.tableData}>{row.case_id}</td>
                  <td className={GlobalStyle.tableData}>
                    {row.case_current_status}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.User_Interaction_Status}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.Validity_Period.split(" - ")
                      .map((date) => date.split("T")[0])
                      .join(" - ")}
                  </td>

                  <td className={GlobalStyle.tableData}>{row.drc_name}</td>
                  <td className={GlobalStyle.tableData}>
                    {row.Request_Description}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.Approved_on.split(" - ")
                      .map((date) => date.split("T")[0])
                      .join(" - ")}
                  </td>

                  <td className={GlobalStyle.tableData}>{row.Approved_by}</td>
                  <td className={GlobalStyle.tableData}>{row.Remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className={GlobalStyle.navButtonContainer}>
          <button onClick={handlePrevPage} disabled={currentPage === 0}>
            <FaArrowLeft />
          </button>
          <span>
            Page {currentPage + 1} of {pages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === pages - 1}>
            <FaArrowRight />
          </button>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <button className={GlobalStyle.buttonPrimary} onClick={handleTask}>
          Create task and let me know
        </button>
      </div>
    </div>
  );
};

export default RequestResponseLog;
