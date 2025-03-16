/*Purpose: This template is used for the 7.5 Sup - Monitor Settlemnt page.
Created Date: 2025-12-03
Created By: Susinidu Sachinthana (susinidusachinthana@gmail.com)
Last Modified Date: 2025-12-03
Modified Date: 2025-12-03
Modified By: Susinidu Sachinthana, Chamath Jayasanka
Version: node 22
ui number : 7.5
Dependencies: tailwind css
Related Files:
Notes:  */

import React, { useState } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import more from "../../assets/images/imagefor1.a.13(one).png";
import { list_All_Settlement_Cases } from "../../services/case/CaseServices";

const Monitor_settlement = () => {
  // State Variables
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [caseIdFilter, setCaseIdFilter] = useState("");
  const [status, setStatus] = useState("");
  const [phase, setPhase] = useState("");

  const [error, setError] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  // Handle Pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  /*  const [appliedFilters, setAppliedFilters] = useState({
     searchQuery: "",
     caseIdFilter: "",
     status: "",
     phase: "",
     fromDate: null,
     toDate: null,
   }); */

  const rowsPerPage = 7;

  const navigate = useNavigate();

  const handleFromDateChange = (date) => {
    if (toDate && date > toDate) {
      setError("The 'From' date cannot be later than the 'To' date.");
    } else {
      setError("");
      setFromDate(date);
    }
  };

  const handleToDateChange = (date) => {
    if (fromDate && date < fromDate) {
      setError("The 'To' date cannot be earlier than the 'From' date.");
    } else {
      setError("");
      setToDate(date);
    }
  };

  // Search Section
  const filteredDataBySearch = currentData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleFilter = async () => {
    try {
      const payload = {
        case_id: caseIdFilter,
        settlement_phase: phase,
        settlement_status: status,
        from_date: fromDate ? fromDate.toISOString().split("T")[0] : null,
        to_date: toDate ? toDate.toISOString().split("T")[0] : null,
      };

      console.log("Payload sent to API: ", payload);
      const response = await list_All_Settlement_Cases(payload);

      if (response && Array.isArray(response.data)) {
        console.log("Valid data received:", response.data);
        setFilteredData(response.data); 
      } else {
        console.error("No valid Settlement data found in response:", response);
      }
    } catch (error) {
      console.error("Error filtering Settlements:", error);
    }
  };




  /* // Sample Data
  const data = [
    {
      caseId: "RC001",
      status: "FTL",
      created_dtm: "2025-01-01",
      settlement_id: "S1",
      settlement_phase: "Negotiation",
    },
    {
      caseId: "RC002",
      status: "Write off",
      created_dtm: "2025-02-01",
      settlement_id: "S2",
      settlement_phase: "Mediation board",
    },
    {
      caseId: "RC003",
      status: "Being settle",
      created_dtm: "2025-03-01",
      settlement_id: "S3",
      settlement_phase: "Litigation",
    },
    {
      caseId: "RC001",
      status: "FTL",
      created_dtm: "2025-01-01",
      settlement_id: "S1",
      settlement_phase: "Negotiation",
    },
    {
      caseId: "RC002",
      status: "Write off",
      created_dtm: "2025-02-01",
      settlement_id: "S2",
      settlement_phase: "Mediation board",
    },
    {
      caseId: "RC003",
      status: "Being settle",
      created_dtm: "2025-03-01",
      settlement_id: "S3",
      settlement_phase: "Litigation",
    },
    {
      caseId: "RC001",
      status: "FTL",
      created_dtm: "2025-01-01",
      settlement_id: "S1",
      settlement_phase: "Negotiation",
    },
    {
      caseId: "RC002",
      status: "Write off",
      created_dtm: "2025-02-01",
      settlement_id: "S2",
      settlement_phase: "Mediation board",
    },
    {
      caseId: "RC003",
      status: "Being settle",
      created_dtm: "2025-03-01",
      settlement_id: "S3",
      settlement_phase: "Litigation",
    },
  ];
 */


  // Filtering Logic
  /* const filterData = () => {
    return data.filter((row) => {
      const matchesSearch =
        row.caseId
          .toLowerCase()
          .includes(appliedFilters.searchQuery.toLowerCase()) ||
        row.status
          .toLowerCase()
          .includes(appliedFilters.searchQuery.toLowerCase()) ||
        row.created_dtm
          .toLowerCase()
          .includes(appliedFilters.searchQuery.toLowerCase()) ||
        row.settlement_id
          .toLowerCase()
          .includes(appliedFilters.searchQuery.toLowerCase()) ||
        row.settlement_phase
          .toLowerCase()
          .includes(appliedFilters.searchQuery.toLowerCase());

      const matchesCaseId = row.caseId
        .toLowerCase()
        .includes(appliedFilters.caseIdFilter.toLowerCase());
      const matchesStatus =
        !appliedFilters.status ||
        row.status.toLowerCase() === appliedFilters.status.toLowerCase();
      const matchesPhase =
        !appliedFilters.phase ||
        row.settlement_phase.toLowerCase() ===
        appliedFilters.phase.toLowerCase();
      const matchesFromDate =
        !appliedFilters.fromDate ||
        new Date(row.created_dtm) >= new Date(appliedFilters.fromDate);
      const matchesToDate =
        !appliedFilters.toDate ||
        new Date(row.created_dtm) <= new Date(appliedFilters.toDate);

      return (
        matchesSearch &&
        matchesCaseId &&
        matchesStatus &&
        matchesPhase &&
        matchesFromDate &&
        matchesToDate
      );
    });
  }; */

  // Pagination Logic
  /* const pages = Math.ceil(filterData().length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filterData().slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < pages - 1) setCurrentPage(currentPage + 1);
  };
 */
  // Handle Filter Click
/*   const handleFilterClick = () => {
    setAppliedFilters({
      searchQuery,
      caseIdFilter,
      status,
      phase,
      fromDate,
      toDate,
    });
    setCurrentPage(0); // Reset to first page when applying filters
  }; */

  const navi = () => {
    navigate("/lod/ftl-log/preview");
  };

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <div className="flex flex-col flex-1">
        <main className="p-6">
          <h1 className={GlobalStyle.headingLarge}>Settlement List</h1>

          {/* Filters Section */}
          <div className="flex flex-wrap gap-4 mb-6 mt-10">
            <div className="flex items-center">
              <input
                type="text"
                value={caseIdFilter}
                onChange={(e) => setCaseIdFilter(e.target.value)}
                className={`${GlobalStyle.inputText}  w-40`}
                placeholder="Case ID"
              />
            </div>

            <div className="flex items-center">
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className={`${GlobalStyle.selectBox}`}
              >
                <option value="">All</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Mediation board">Mediation board</option>
                <option value="Litigation">Litigation</option>
              </select>
            </div>

            <div className="flex items-center">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`${GlobalStyle.selectBox}`}
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Open_Pending">Open-Pending</option>
                <option value="Active">Active</option>
              </select>
            </div>

            <div className="flex items-center">
              <DatePicker
                selected={fromDate}
                onChange={handleFromDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="From"
                className={`${GlobalStyle.inputText}`}
              />
            </div>

            <div className="flex items-center">
              <DatePicker
                selected={toDate}
                onChange={handleToDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="To"
                className={`${GlobalStyle.inputText}`}
              />
            </div>
            <button
              className={GlobalStyle.buttonPrimary}
              onClick={handleFilter}
            >
              Filter
            </button>
          </div>

          {error && <span className={GlobalStyle.errorText}>{error}</span>}

          {/* Search Bar */}
          <div className="mb-4 flex justify-start mt-10">
            <div className={GlobalStyle.searchBarContainer}>
              <input
                type="text"
                className={GlobalStyle.inputSearch}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className={GlobalStyle.searchBarIcon} />
            </div>
          </div>

          {/* Table */}
          <div className={`${GlobalStyle.tableContainer} mt-10`}>
            <table className={GlobalStyle.table}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th className={GlobalStyle.tableHeader}>Case ID</th>
                  <th className={GlobalStyle.tableHeader}>Status</th>
                  <th className={GlobalStyle.tableHeader}>Created DTM</th>
                  <th className={GlobalStyle.tableHeader}>Settlement ID</th>
                  <th className={GlobalStyle.tableHeader}>Settlement Phase</th>
                  <th className={GlobalStyle.tableHeader}></th>
                </tr>
              </thead>
              {/* <tbody>
                {paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? GlobalStyle.tableRowEven
                        : GlobalStyle.tableRowOdd
                    }
                  >
                    <td className={GlobalStyle.tableData}>{row.caseId}</td>
                    <td className={GlobalStyle.tableData}>{row.status}</td>
                    <td className={GlobalStyle.tableData}>{row.created_dtm}</td>
                    <td className={GlobalStyle.tableData}>
                      {row.settlement_id}
                    </td>
                    <td className={GlobalStyle.tableData}>
                      {row.settlement_phase}
                    </td>
                    <td className={GlobalStyle.tableData}>
                      <img
                        src={more}
                        onClick={navi}
                        title="More"
                        alt="more icon"
                        className="w-5 h-5"
                      />
                    </td>
                  </tr>
                ))}
              </tbody> */}

              <tbody>
                {filteredDataBySearch && filteredDataBySearch.length > 0 ? (
                  filteredDataBySearch.map((item, index) => (
                    <tr
                      key={item.case_id || index}
                      className={
                        index % 2 === 0
                          ? GlobalStyle.tableRowEven
                          : GlobalStyle.tableRowOdd
                      }
                    >
                      <td className={`${GlobalStyle.tableData}  text-black hover:underline cursor-pointer`}>{item.case_id || "N/A"}</td>
                      <td className={`${GlobalStyle.tableData} flex justify-center items-center`}>{item.settlement_status}</td>
                      <td className={GlobalStyle.tableData}>{new Date(item.created_dtm).toLocaleDateString("en-CA") || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>{item.settlement_id || "N/A"}</td>
                      <td className={GlobalStyle.tableData}> {item.settlement_phase || "N/A"} </td>
                      <td className={GlobalStyle.tableData}>
                        <img
                          src={more}
                          onClick={navi}
                          title="More"
                          alt="more icon"
                          className="w-5 h-5"
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center">No cases available</td>
                  </tr>
                )}
              </tbody>








            </table>
          </div>

          {/* Pagination Section */}
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

        </main>
      </div>
    </div>
  );
};

export default Monitor_settlement;
