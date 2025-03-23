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
import { list_All_Settlement_Cases } from "../../services/settlement/SettlementServices";
import Swal from 'sweetalert2';

// // Import status icons with correct file extensions
// import RO_Negotiation_FMB_pending from "../../assets/images/negotiation/RO_Negotiation_FMB_pending.png";
// import RO_Negotiation_Extneded from "../../assets/images/negotiation/RO_Negotiation_Extneded.png";
// import RO_Negotiation_Extension_Pending from "../../assets/images/negotiation/RO_Negotiation_Extension_Pending.png";
// import Negotiation_Settle_Active from "../../assets/images/negotiation/Negotiation_Settle_Active.png";
// import Negotiation_Settle_Open_Pending from "../../assets/images/negotiation/Negotiation_Settle_Open_Pending.png";
// import Negotiation_Settle_Pending from "../../assets/images/negotiation/Negotiation_Settle_Pending.png";
// import RO_Negotiation from "../../assets/images/negotiation/RO_Negotiation.png";

// // Status icon mapping
// const STATUS_ICONS = {
//   "RO Negotiation FMB Pending": {
//     icon: RO_Negotiation_FMB_pending,
//     tooltip: "RO Negotiation FMB pending"
//   },
//   "RO Negotiation Extended": {
//     icon: RO_Negotiation_Extneded,
//     tooltip: "RO Negotiation Extneded"
//   },
//   "RO Negotiation Extension Pending": {
//     icon: RO_Negotiation_Extension_Pending,
//     tooltip: "RO Negotiation Extension Pending"
//   },
//   "Negotiation Settle Active": {
//     icon: Negotiation_Settle_Active,
//     tooltip: "Negotiation Settle Active"
//   },
//   "Negotiation Settle Open-Pending": {
//     icon: Negotiation_Settle_Open_Pending,
//     tooltip: "Negotiation Settle Open-Pending"
//   },
//   "Negotiation Settle Pending": {
//     icon: Negotiation_Settle_Pending,
//     tooltip: "Negotiation Settle Pending"
//   },
//   "RO Negotiation": {
//     icon: RO_Negotiation,
//     tooltip: "MB Settle open pending"
//   },
// };

// // Status Icon component with tooltip
// const StatusIcon = ({ status }) => {
//   const statusInfo = STATUS_ICONS[status];
  
//   if (!statusInfo) return <span>{status}</span>;

//   return (
//     <div className="relative group">
//       <img 
//         src={statusInfo.icon} 
//         alt={status}
//         className="w-6 h-6 cursor-help"
//       />
//       <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-sm rounded px-2 py-1 left-1/2 transform -translate-x-1/2 bottom-full mb-1 whitespace-nowrap z-10">
//         {statusInfo.tooltip}
//         <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-2 h-2 bg-gray-800 rotate-45"></div>
//       </div>
//     </div>
//   );
// };

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

  const handlestartdatechange = (date) => {
    setFromDate(date);
    if (toDate) checkdatediffrence(date, toDate);
  };

  const handleenddatechange = (date) => {
    if (fromDate) {
      checkdatediffrence(fromDate, date);
    }
    setToDate(date);
  }

  const checkdatediffrence = (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const diffInMs = end - start;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const diffInMonths = diffInDays / 30;

    if (diffInMonths > 1) {
      Swal.fire({
        title: "Date Range Exceeded",
        text: "The selected dates have more than a 1-month gap. Do you want to proceed?",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#28a745",
        cancelButtonText: "No",
        cancelButtonColor: "#d33",
      }).then((result) => {
        if (result.isConfirmed) {

          endDate = endDate;
          handleApicall(startDate, endDate);
        } else {
          setToDate(null);
          console.log("Dates cleared");
        }
      }
      );

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
      setFilteredData([]); // Clear previous results

      // Format the date to 'YYYY-MM-DD' format
      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split('T')[0];
      };

      if (!caseIdFilter && !phase && !status && !fromDate && !toDate) {
        Swal.fire({
          title: "Warning",
          text: "No filter data is selected. Please, select data.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        setToDate(null);
        setFromDate(null);
        return;
      };

      if ((fromDate && !toDate) || (!fromDate && toDate)) {
        Swal.fire({
          title: "Warning",
          text: "Both From Date and To Date must be selected.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        setToDate(null);
        setFromDate(null);
        return;
      }

      if (new Date(fromDate) > new Date(toDate)) {
        Swal.fire({
          title: "Warning",
          text: "To date should be greater than or equal to From date",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        setToDate(null);
        setFromDate(null);
        return;
      };

      const payload = {
        case_id: caseIdFilter,
        settlement_phase: phase,
        settlement_status: status,
        from_date: formatDate(fromDate),
        to_date: formatDate(toDate),
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
      console.error("Error filtering cases:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data. Please try again.",
        icon: "error"
      });
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
                <option value="">Settlement Phase</option>
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
                <option value="">Settlement Status</option>
                <option value="Pending">Pending</option>
                <option value="Open_Pending">Open-Pending</option>
                <option value="Active">Active</option>
              </select>
            </div>

            <div className="flex items-center">
              <DatePicker
                selected={fromDate}
                onChange={handlestartdatechange}
                dateFormat="dd/MM/yyyy"
                placeholderText="From"
                className={`${GlobalStyle.inputText}`}
              />
            </div>

            <div className="flex items-center">
              <DatePicker
                selected={toDate}
                onChange={handleenddatechange}
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

          {/* {error && <span className={GlobalStyle.errorText}>{error}</span>} */}

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
