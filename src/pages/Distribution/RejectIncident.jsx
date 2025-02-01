/*
Purpose: 
Created Date: 2025.01.23
Created By: Nadali Linara
Last Modified Date: 2025.01.25
Modified By:Buthmi Mithara
Version: node 11
ui number : 1.7.2
Dependencies: tailwind css
Related Files: 
Notes: 

*/

import DatePicker from "react-datepicker";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Import GlobalStyle
import Reject_Pending from "../../assets/images/Reject_Pending.png";

export default function RejectIncident() {
  const navigate = useNavigate();

  // Table data
  const tableData = [
    {
      id: "RC001",
      status: "Reject Pending4",
      account_no: "12345",
      filtered_reason: "Credit-class = VIP",
      rejected_on: "2024-11-01",
      source_type: "pilot-suspended",
    },
    {
      id: "RC002",
      status: "Reject Pending4",
      account_no: "12345",
      filtered_reason: "Customer Type = slt",
      rejected_on: "2024-11-01",
      source_type: "pilot-suspended",
    },
    {
      id: "RC003",
      status: "Reject Pending4",
      account_no: "12345",
      filtered_reason: "Credit-class = VIP",
      rejected_on: "2024-11-01",
      source_type: "pilot-suspended",
    },
    {
      id: "RC001",
      status: "Reject Pending4",
      account_no: "12345",
      filtered_reason: "Credit-class = VIP",
      rejected_on: "2024-11-01",
      source_type: "pilot-suspended",
    },
    {
      id: "RC003",
      status: "Reject Pending4",
      account_no: "12345",
      filtered_reason: "Customer Type = slt",
      rejected_on: "2024-11-01",
      source_type: "pilot-suspended",
    },
    {
      id: "RC002",
      status: "Reject Pending4",
      account_no: "12345",
      filtered_reason: "Credit-class = VIP",
      rejected_on: "2024-11-01",
      source_type: "pilot-suspended",
    },
    {
      id: "RC002",
      status: "Reject Pending4",
      account_no: "12345",
      filtered_reason: "Credit-class = VIP",
      rejected_on: "2024-11-01",
      source_type: "pilot-suspended",
    },
    {
      id: "RC002",
      status: "Reject Pending4",
      account_no: "12345",
      filtered_reason: "Credit-class = VIP",
      rejected_on: "2024-11-01",
      source_type: "pilot-suspended",
    },
  ];

  // Filter state
  const [fromDate, setFromDate] = useState(null); //for date
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [filteredData, setFilteredData] = useState(tableData);
  const [selectAllData, setSelectAllData] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

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

  //search fuction
  const filteredSearchData = filteredData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Pagination state
  const rowsPerPage = 7;
  const pages = Math.ceil(filteredData.length / rowsPerPage);

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

  // Paginated data
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredSearchData.slice(startIndex, endIndex);

  const handleRowCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((id) => id !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAllDataChange = () => {
    if (selectAllData) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((row) => row.id));
    }
    setSelectAllData(!selectAllData);
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className="flex justify-between items-center w-full">
        <h1 className={`${GlobalStyle.headingLarge} m-0`}>
          Pending Reject Incidents
        </h1>
        <Link
          className={`${GlobalStyle.buttonPrimary}`}
          to="/lod/ftllod/ftllod/downloadcreateftllod"
        >
          Create task and let me know
        </Link>
      </div>

      {/* Filter Section */}
      <div className="flex justify-between items-center gap-x-4 my-8">
        {/* Source Selection */}
        <div className="flex items-center gap-2">
          <h1 className="mr-2">Source:</h1>
          <select className={GlobalStyle.selectBox}>
            <option value="option1">Select</option>
            <option value="option2">Option 1</option>
            <option value="option3">Option 2</option>
          </select>
        </div>

        {/* Date Picker Section */}
        <div className="flex items-center gap-2 ">
          <div className={GlobalStyle.datePickerContainer}>
            <label className={GlobalStyle.dataPickerDate}>Date:</label>
            <div className="flex gap-2">
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
          </div>
          {error && <span className={GlobalStyle.errorText}>{error}</span>}
        </div>

        {/* Filter Button */}
        <button
          className={`${GlobalStyle.buttonPrimary} h-[35px]`}
          onClick={""}
        >
          Filter
        </button>
      </div>

      {/* Table Section */}
      <div className="flex flex-col">
        <div className="flex justify-start mb-4">
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
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th scope="col" className={GlobalStyle.tableHeader}></th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Id
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Status
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Account No
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Filtered Reason
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Rejected On
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Source Type
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
                    <input
                      type="checkbox"
                      className={"rounded-lg"}
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowCheckboxChange(row.id)}
                    />
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <a href={`#${row.id}`} className="hover:underline">
                      {row.id}
                    </a>
                  </td>

                  <td
                    className={`${GlobalStyle.tableData} flex items-center justify-center`}
                  >
                    {row.status === "Reject Pending4" && (
                      <img
                        src={Reject_Pending}
                        alt="Reject Pending"
                        className="w-5 h-5"
                      />
                    )}
                  </td>

                  <td className={GlobalStyle.tableData}>{row.account_no}</td>
                  <td className={GlobalStyle.tableData}>
                    {row.filtered_reason}
                  </td>
                  <td className={GlobalStyle.tableData}>{row.rejected_on}</td>
                  <td className={GlobalStyle.tableData}>{row.source_type}</td>
                  <td
                    className={`${GlobalStyle.tableData} text-center px-6 py-4`}
                  >
                    <button
                      className={`${GlobalStyle.buttonPrimary} mx-auto`}
                      onClick={""}
                    >
                      Reject
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

        <div className="flex justify-end items-center w-full mt-6">
          {/* Select All Data Checkbox */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded-lg"
              checked={selectAllData}
              onChange={handleSelectAllDataChange}
            />
            Select All
          </label>

          <Link
            className={`${GlobalStyle.buttonPrimary} ml-4`}
            to="/lod/ftllod/ftllod/downloadcreateftllod"
          >
            More Forward
          </Link>
        </div>
      </div>
    </div>
  );
}
