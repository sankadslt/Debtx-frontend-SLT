// Purpose: This  is the Additional Request Log page.
// Created Date: 2025-01-07
// Created By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
// Last Modified Date: 2025-01-09
// Modified By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
// Version: node 22.2.0
// ui number : v2.10
// Dependencies: tailwind css
// Notes :

import { useState, useEffect } from "react";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { ListRequestLogFromRecoveryOfficers } from "../../services/request/request.js";

const RecoveryOfficerRequests = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [requestType, setRequestType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [approved, setApproved] = useState("");
  const [requestsData, setRequestsData] = useState([]);
  const navigate = useNavigate();
  const rowsPerPage = 7;

  useEffect(() => {
    const payload = {
      delegate_user_id: 5,
    };
    const fetchcases = async () => {
      try {
        const response = await ListRequestLogFromRecoveryOfficers(payload);
        console.log(response);
        setRequestsData(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchcases();
  }, []);

  // validation for date
  const handleFromDateChange = (date) => {
    if (toDate && date > toDate) {
      setError("The 'From' date cannot be later than the 'To' date.");
    } else {
      setError("");
      setFromDate(date);
    }
  };

  // validation for date
  const handleToDateChange = (date) => {
    if (fromDate && date < fromDate) {
      setError("The 'To' date cannot be earlier than the 'From' date.");
    } else {
      setError("");
      setToDate(date);
    }
  };

  // Filter data based on search query
  const filteredData = requestsData.filter((row) => {
    const matchesSearchQuery = Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesRequestType = requestType
      ? row.requestType.toLowerCase() === requestType.toLowerCase()
      : true;

    const matchesApproved = approved
      ? row.approval.toLowerCase() === approved.toLowerCase()
      : true;

    const rowDate = new Date(row.requestedDate); // Ensure requestedDate is a valid Date object
    const matchesDateRange =
      (!fromDate || rowDate >= fromDate) && (!toDate || rowDate <= toDate);

    return (
      matchesSearchQuery &&
      matchesRequestType &&
      matchesApproved &&
      matchesDateRange
    );
  });

  const navi = () => {
    navigate("");
  };

  const pages = Math.ceil(filteredData.length / rowsPerPage);
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

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>
        Requests from Recovery Officer
      </h1>
      <div className="flex justify-end gap-6 items-center mb-8">
        <div className="flex items-center gap-2">
          <span className={GlobalStyle.headingMedium}>Request Type:</span>
          <select
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            className={GlobalStyle.selectBox}
          >
            <option value="">Select</option>
            <option value="fmb">FMB</option>
            <option value="period extension">Period extension</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className={GlobalStyle.headingMedium}> Approved:</span>
          <select
            value={approved}
            onChange={(e) => setApproved(e.target.value)}
            className={GlobalStyle.selectBox}
          >
            <option value="">Select</option>
            <option value="yes">YES</option>
            <option value="no">no</option>
            <option value="-">-</option>
          </select>
        </div>

        <div className={GlobalStyle.datePickerContainer}>
          <span className={GlobalStyle.dataPickerDate}>Date </span>
          <DatePicker
            selected={fromDate}
            onChange={handleFromDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/MM/yyyy"
            className={GlobalStyle.inputText}
          />
          <DatePicker
            selected={toDate}
            onChange={handleToDateChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/MM/yyyy"
            className={GlobalStyle.inputText}
          />
        </div>
        {error && <span className={GlobalStyle.errorText}>{error}</span>}
        <button
          className={GlobalStyle.buttonPrimary}
          onClick={() => setCurrentPage(0)} // Reset to first page when filter is applied
        >
          Filter
        </button>
      </div>

      {/* Table Section */}
      <div className="flex flex-col">
        {/* Search Bar Section */}
        <div className="mb-4 flex justify-start">
          <div className={GlobalStyle.searchBarContainer}>
            <input
              type="text"
              placeholder=""
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={GlobalStyle.inputSearch}
            />
            <FaSearch className={GlobalStyle.searchBarIcon} />
          </div>
        </div>

        {/* Table Section */}
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Case ID
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Status
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Request Status
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Amount
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Validity Period
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  DRC
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Request Type
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Requested date
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Approved
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-white bg-opacity-75"
                      : "bg-gray-50 bg-opacity-50"
                  } border-b`}
                >
                  <td className={GlobalStyle.tableData}>
                    <a href={`#${row.caseId}`} className="hover:underline">
                      {row.Interaction_Log_ID}
                    </a>
                  </td>
                  <td className={GlobalStyle.tableData}>{row.Request_Mode}</td>
                  <td className={GlobalStyle.tableData}>
                    {row.User_Interaction_Status}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.case_details?.current_arrears_amount ?? ""}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.case_details?.Validity_Period
                      ? row.case_details.Validity_Period.split(" - ")
                          .map((date) => date.split("T")[0])
                          .join(" - ")
                      : "N/A"}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.case_details?.drc?.drc_id ?? ""}
                  </td>
                  <td className={GlobalStyle.tableData}>{row.Request_Mode}</td>
                  <td className={GlobalStyle.tableData}>
                    {new Date(row.CreateDTM).toLocaleDateString()}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.Approve_Status}
                  </td>
                  <td
                    className={`${GlobalStyle.tableData} text-center px-6 py-4`}
                  >
                    <button
                      className={`${GlobalStyle.buttonPrimary} mx-auto`}
                      onClick={navi}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Buttons */}
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
          <button
            className={GlobalStyle.navButton}
            onClick={handleNextPage}
            disabled={currentPage === pages - 1}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecoveryOfficerRequests;
