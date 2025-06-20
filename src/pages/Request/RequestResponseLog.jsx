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

import React, { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import DatePicker from "react-datepicker";
import { FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa";
import {
  List_Request_Response_log,
  Create_Task_For_Request_Responce_Log_Download,
} from "../../services/request/request";
import { getLoggedUserId } from "/src/services/auth/authService.js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";
import { Tooltip } from "react-tooltip";
import RO_Negotiation from "/src/assets/images/Negotiation/RO_Negotiation.png";
import RO_Settle_Pending from "/src/assets/images/Negotiation/RO_Settle_Pending.png";
import RO_Negotiation_Extension_Pending from "/src/assets/images/Negotiation/RO Negotiation extend pending.png";
import MB_Negotiation from "/src/assets/images/Mediation_Board/MB_Negotiation.png";
import MB_Settle_Pending from "/src/assets/images/Mediation_Board/MB Settle Pending.png";
import Forward_To_Mediation_Board from "/src/assets/images/Mediation_Board/Forward_To_Mediation_Board.png";


const RequestResponseLog = () => {
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [requestType, setRequestType] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons

  const statuses = [];
  const rowsPerPage = 5;

  const navigate = useNavigate();

  const getStatusIcon = (status) => {
    switch (status) {
      case "RO Negotiation":
        return RO_Negotiation;
      case "Negotiation Settle Pending":
        return RO_Settle_Pending;
      case "RO Negotiation Extension Pending":
        return RO_Negotiation_Extension_Pending;
      case "MB Negotiation":
        return MB_Negotiation;
      case "MB Settle Pending":
        return MB_Settle_Pending;
      case "Forward to Mediation Board":
        return Forward_To_Mediation_Board;
      default:
        return null; // Return null or a default icon if status doesn't match
    }
  };

  // render status icon with tooltip
  const renderStatusIcon = (status, index) => {
    const iconPath = getStatusIcon(status);

    if (!iconPath) {
      return <span>{status}</span>;
    }

    const tooltipId = `tooltip-${index}`;

    return (
      <div className="flex items-center gap-2">
        <img
          src={iconPath}
          alt={status}
          className="w-6 h-6"
          data-tooltip-id={tooltipId} // Add tooltip ID to image
        />
        {/* Tooltip component */}
        <Tooltip id={tooltipId} place="bottom" effect="solid">
          {status}
        </Tooltip>
      </div>
    );
  };


  // Role-Based Buttons
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      let decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        refreshAccessToken().then((newToken) => {
          if (!newToken) return;
          const newDecoded = jwtDecode(newToken);
          setUserRole(newDecoded.role);
        });
      } else {
        setUserRole(decoded.role);
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, []);


  // Filtering logic
  const handleFilter = async () => {

    if (!requestType && !fromDate && !toDate) {
      Swal.fire({
        title: "Warning",
        text: "Please select at least one filter option.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    if (!requestType || !fromDate || !toDate) {
      Swal.fire({
        title: "Warning",
        text: "Please select all filter options: Request Type, From Date, and To Date.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    const payload = {
      case_current_status: requestType,
      date_from: fromDate,
      date_to: toDate,
    };
    console.log("Payload for fetching cases:", payload);
    try {
      const response = await List_Request_Response_log(payload);
      console.log("Response from fetching cases:", response.data);
      console.log("Filtered data:", response.data);

      const data = Array.isArray(response.data) ? response.data : [];
      setFilteredData(data);
      setCurrentPage(0);

    } catch (error) {

      console.error("Error fetching cases:", error);

      setFilteredData([]);

    }
  };

  //  const handleToDateChange = (date) => {
  //     if (fromDate && date < fromDate) {
  //       Swal.fire({
  //         icon: "warning",
  //         title: "Warning",
  //         text: "End date cannot be earlier than start date.",
  //         confirmButtonColor: "#f1c40f",
  //       });
  //     } else {
  //       setError("");
  //       if (fromDate) {
  //         CheckDateDifference(fromDate, date);
  //       }
  //       setToDate(date);
  //     }
  //   };


  const handlestartdatechange = (date) => {
    if (toDate && date > toDate) {
      Swal.fire({
        title: "Warning",
        text: "From date cannot be after the To date.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
    }
    else {
      // setError("");
      if (toDate) {
        CheckDateDifference(date, toDate);
      }
      setFromDate(date);
    }
  };

  const handleendDateChange = (date) => {
    if (fromDate && date < fromDate) {
      Swal.fire({
        title: "Warning",
        text: "To date cannot be before the From date.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
    } else {
      //setError("");
      if (fromDate) {
        CheckDateDifference(fromDate, date);
      }
      setToDate(date);
    }
  };


  const CheckDateDifference = (fromDate, toDate) => {
    const start = new Date(fromDate).getTime();
    const end = new Date(toDate).getTime();
    const diffInMs = end - start;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const diffInMonths = diffInDays / 30;

    if (diffInMonths > 1) {
      Swal.fire({
        title: "Date Range Exceeded",
        text: "The selected dates have more than a 1-month gap. Do you want to proceed?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#28a745",
        cancelButtonText: "No",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {
          endDate = toDate;
          handleApicall(fromDate, toDate); // Proceed with the API call
        } else {
          setToDate(null); // Clear the end date if the user chooses not to proceed
          console.log("EndDate cleared");
        }
      });
    }
  };

  const handleApicall = async (fromDate, toDate) => {

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

    try {
      const response = await Create_Task_For_Request_Responce_Log_Download(
        payload
      );
      console.log("Response from creating task:", response);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Task created successfully.",
        confirmButtonColor: "#28a745",
      });
    } catch (error) {
      console.error("Error creating task:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
    }
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

    if (!startDate || !endDate) {
      Swal.fire({
        title: "warning",
        text: "Please select both start and end dates.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    // alert("Task created successfully!");
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
    try {
      const response = await Create_Task_For_Request_Responce_Log_Download(
        payload
      );
      console.log("Response from creating task:", response);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Task created successfully.",
        confirmButtonColor: "#28a745",
      });
    } catch (error) {
      console.error("Error creating task:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });

    }
  };

  const onhoverbuttonclick = (caseid) => {
    navigate("/Incident/Case_Details", {
      state: { CaseID: caseid }, // Pass the case ID as a parameter
    });
    // console.log("Navigating to Case Details with ID:", caseid);
  }


  const handleclearbuttonclick = () => {
    setRequestType("");
    setFromDate(null);
    setToDate(null);
    setFilteredData([]);
    setCurrentPage(0);

  }

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

      <h1 className={`${GlobalStyle.headingLarge} mb-8`}>Request Response Log</h1>
      <div className="flex justify-end">
        <div className={`${GlobalStyle.cardContainer}  w-[75vw] flex justify-end gap-4 items-center mb-8 mt-8`}>


          <div className="flex gap-4 justify-end">
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className={GlobalStyle.selectBox}
              style={{ color: requestType === "" ? "gray" : "black" }}
            >
              <option value="" hidden>Select Status</option>
              <option value="RO Negotiation Extended" style={{ color: "black" }}>
                RO Negotiation Extended
              </option>
              <option value="Negotiation Settle Pending" style={{ color: "black" }}>
                Negotiation Settle Pending
              </option>
              <option value="RO Negotiation" style={{ color: "black" }}>RO Negotiation</option>
              <option value="MB Negotiation" style={{ color: "black" }}>MB Negotiation</option>
              <option value="MB Settle Pending" style={{ color: "black" }}>
                MB Settle Pending
              </option>
              <option value="Forward to Mediation Board" style={{ color: "black" }}>Forward to Mediation Board</option>
              {/* <option value="FMB"  style={{ color: "black" }}>FMB</option> */}

              {statuses.map((statusOption, index) => (
                <option key={index} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>

            <label className={GlobalStyle.dataPickerDate} style={{ marginTop: '5px', display: 'block' }} >Date:  </label>
            <DatePicker
              selected={fromDate}
              // onChange={(date) => setFromDate(date)}
              onChange={handlestartdatechange}
              dateFormat="MM/dd/yyyy"
              placeholderText="From"
              className={GlobalStyle.inputText}
            />
            <DatePicker
              selected={toDate}
              onChange={handleendDateChange}
              dateFormat="MM/dd/yyyy"
              placeholderText="To"
              className={GlobalStyle.inputText}
            />
            <div>
              {["admin", "superadmin", "slt"].includes(userRole) && (
                <button onClick={handleFilter} className={GlobalStyle.buttonPrimary}>
                  Filter
                </button>
              )}
            </div>
            {/* <button onClick={handleFilter} className={GlobalStyle.buttonPrimary}>
                Filter
              </button> */}
            <div>
              {["admin", "superadmin", "slt"].includes(userRole) && (
                <button className={GlobalStyle.buttonRemove} onClick={handleclearbuttonclick}   >
                  Clear
                </button>
              )}
            </div>
            {/* <button className={GlobalStyle.buttonRemove} onClick={handleclearbuttonclick}   >
                            Clear 
                </button> */}
          </div>
        </div>
      </div>


      
         <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>

            <tr>
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Status</th>
              <th className={GlobalStyle.tableHeader}>Request Status</th>
              <th className={GlobalStyle.tableHeader}>Validity Period</th>
              <th className={GlobalStyle.tableHeader}>DRC</th>
              <th className={GlobalStyle.tableHeader}>Request Details</th>
              <th className={GlobalStyle.tableHeader}> Letter Issued on </th>
              <th className={GlobalStyle.tableHeader}>Approved On</th>
              <th className={GlobalStyle.tableHeader}>Approved By</th>
              <th className={GlobalStyle.tableHeader}>Remark</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={index} className="border-b bg-gray-50">
                <td className={GlobalStyle.tableData}>
                  <button
                    onClick={() => onhoverbuttonclick(row.case_id)}
                    onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"}
                    onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"} >

                    {row.case_id}

                  </button>
                </td>
                <td className={GlobalStyle.tableData}>
                  {/* {row.case_current_status} */}
                  {renderStatusIcon(row.case_current_status, index)}
                </td>
                <td className={GlobalStyle.tableData}>
                  {row.User_Interaction_Status}
                </td>
                <td className={GlobalStyle.tableData}>
                  {row.Validity_Period}
                </td>

                <td className={GlobalStyle.tableData}>{row.drc_name}</td>
                <td className={GlobalStyle.tableData}>
                  {row.Request_Description}
                </td>
                <td className={GlobalStyle.tableData}>
                  {new Date(row.Letter_Issued_on).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </td>
                <td className={GlobalStyle.tableData}>
                  {new Date(row.created_dtm).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </td>

                <td className={GlobalStyle.tableData}>{row.created_by}</td>
                <td className={GlobalStyle.tableData}>{row.Remark}</td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan="10" className={GlobalStyle.tableData} style={{ textAlign: 'center' }}>
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {filteredData.length > rowsPerPage && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            className={GlobalStyle.navButton}
            onClick={handlePrevPage}
            disabled={currentPage === 0}
          >
            <FaArrowLeft />
          </button>

          <span>
            Page {currentPage + 1} of {pages}
          </span>

          <button className={GlobalStyle.navButton} onClick={handleNextPage} disabled={currentPage === pages - 1}>
            <FaArrowRight />
          </button>
        </div>
      )}
      <div className="flex justify-end mt-4">

        {paginatedData.length > 0 && (
          <div>
            {["admin", "superadmin", "slt"].includes(userRole) && (
              <button className={`${GlobalStyle.buttonPrimary} h-[35px] mt-2 flex items-center`} onClick={handleTask}>
                <FaDownload className="mr-2" />
                Create task and let me know
              </button>
            )}
          </div>
        )}
        {/* <button className={`${GlobalStyle.buttonPrimary} h-[35px] mt-2 flex items-center`} onClick={handleTask}>
           <FaDownload className="mr-2" />
          Create task and let me know
        </button> */}

      </div>
    </div>
  );
};

export default RequestResponseLog;
