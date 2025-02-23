/*Purpose: This template is used for the 1.15.2 - DRC Assign Manager Approval 
Created Date: 2025-02-17
Created By: Sanjaya (sanjayaperera80@gmail.com)
Last Modified Date: 2025-02-17
Version: node 20
ui number : 1.15.2
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the codes */

import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Importing GlobalStyle
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import one from "/src/assets/images/imagefor1.a.13(one).png";
export default function DRCAssignManagerApproval3() {
  const data = [
    {
      caseId: "",
      createdOn: "2025.11.05",
      createdBy: "ID123",
      approvalType: "-",
      approvalStatus: "open",
      approvalBy: "ID123",
      remark: "",
    },
    {
      caseId: "C001",
      createdOn: "2025.11.05",
      createdBy: "",
      approvalType: "-",
      approvalStatus: "Approve",
      approvalBy: "",
      remark: "",
    },
    {
      caseId: "",
      createdOn: "",
      createdBy: "",
      approvalType: "-",
      approvalStatus: "Reject",
      approvalBy: "",
      remark: "",
    },
  ];

  // State for search query and filtered data
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState(data);
  const [drcFilter, setDrcFilter] = useState(""); // DRC filter state
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  // Filter data based on selected filters
  const applyFilters = () => {
    const filteredData = data.filter((item) => {
      const itemDate = new Date(item.createdDate.split(".").join("-")); // Convert item date to Date object

      // Apply DRC filter
      const isDRCMatch = drcFilter
        ? item.drc.toLowerCase().includes(drcFilter.toLowerCase())
        : true;

      // Apply Date Range filter
      const isDateInRange =
        (!startDate || itemDate >= new Date(startDate)) &&
        (!endDate || itemDate <= new Date(endDate));

      return isDRCMatch && isDateInRange;
    });

    setFilteredData(filteredData);
  };
  // Handle pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Filtering the data based on search query
  const filteredDataBySearch = searchQuery
    ? filteredData.filter((row) =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : currentData;

  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all rows in the filtered data
      setSelectedRows(new Set(filteredData.map((_, index) => index)));
    } else {
      // Deselect all rows
      setSelectedRows(new Set());
    }
  };

  const handleRowSelect = (index) => {
    const newSelectedRows = new Set(selectedRows);

    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index);
    } else {
      newSelectedRows.add(index);
    }

    setSelectedRows(newSelectedRows);

    // Automatically deselect the "Select All" checkbox if any row is deselected
    if (newSelectedRows.size !== filteredData.length) {
      setSelectAll(false);
    } else {
      setSelectAll(true);
    }
  };

  function onSubmit() {
    alert("Create task and let me know");
  }
  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Assigned DRC Summary</h1>
      <div className="flex justify-between mt-16 mb-6">
        <div className="flex justify-start mb-8">
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

        <div className="flex gap-10">
          {" "}
          <div className="flex gap-4 h-[35px] mt-2">
            <select
              className={GlobalStyle.selectBox}
              value={drcFilter}
              onChange={(e) => setDrcFilter(e.target.value)}
            >
              <option value="">Select Approve Type</option>
              <option value="oprion1">O1</option>
              <option value="option2">O2</option>
              <option value="option3">O3</option>
            </select>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className={GlobalStyle.datePickerContainer}>
              <label className={GlobalStyle.dataPickerDate}>Date </label>

              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className={GlobalStyle.inputText}
              />

              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className={GlobalStyle.inputText}
              />
            </div>
          </div>
          <button
            onClick={applyFilters}
            className={`${GlobalStyle.buttonPrimary} h-[35px] mt-2`}
          >
            Filter
          </button>
        </div>
      </div>

      {/* Search Section */}

      {/* Table Section */}
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>
                {/* <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="mx-auto"
                /> */}
              </th>
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Created on</th>
              <th className={GlobalStyle.tableHeader}>Created by</th>
              <th className={GlobalStyle.tableHeader}>Approve Type</th>
              <th className={GlobalStyle.tableHeader}>Approve Status</th>
              <th className={GlobalStyle.tableHeader}>Approve By</th>
              <th className={GlobalStyle.tableHeader}>Remark</th>
              <th className={GlobalStyle.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.map((item, index) => (
              <tr
                key={`${item.drc}-${index}`}
                className={
                  index % 2 === 0
                    ? GlobalStyle.tableRowEven
                    : GlobalStyle.tableRowOdd
                }
              >
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(index)}
                    onChange={() => handleRowSelect(index)}
                    className="mx-auto"
                  />
                </td>
                <td className={GlobalStyle.tableData}>{item.caseID}</td>
                <td className={GlobalStyle.tableData}>{item.createdOn}</td>
                <td className={GlobalStyle.tableData}>{item.createdBy}</td>
                <td className={GlobalStyle.tableData}>{item.approvalType}</td>
                <td className={GlobalStyle.tableData}>{item.approvalStatus}</td>
                <td className={GlobalStyle.tableData}>{item.approvalBy}</td>
                <td className={GlobalStyle.tableData}>{item.remark}</td>
                <td className={GlobalStyle.tableData}>
                  <button>
                    <img
                      src={one}
                      width={15}
                      height={15}
                      alt="Summary"
                      style={{ position: "relative", top: "4px", right: "2px" }}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
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

      {/* Select All Data Checkbox and Approve Button */}
      <div className="flex justify-end gap-4 mt-4">
        {/* Select All Data Checkbox */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded-lg"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          Select All Data
        </label>

        {/* Approve Button */}
        <button onClick={onSubmit} className={GlobalStyle.buttonPrimary}>
          Reject
        </button>
        <button onClick={onSubmit} className={GlobalStyle.buttonPrimary}>
          Approve
        </button>
      </div>
      <div>
        <button onClick={onSubmit} className={GlobalStyle.buttonPrimary}>
          Create Task and Let me know
        </button>
      </div>
    </div>
  );
}
