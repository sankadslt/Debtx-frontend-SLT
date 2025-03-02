/* Purpose: This template is used for the 2.17 - Mediation Board case list .
Created Date: 2025-02-27
Created By: sakumini (sakuminic@gmail.com)
Modified By: Buthmi mithara (buthmimithara1234@gmail.com)
Version: node 20
ui number : 2.17
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the Mediation Board case list Screen */

import { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import edit from "../../assets/images/mediationBoard/edit.png";
import { useNavigate } from "react-router-dom";
import { List_All_DRCs_Mediation_Board_Cases } from "../../services/case/CaseServices";
// Import status icons with correct file extensions
import Forward_to_Mediation_Board from "../../assets/images/mediationBoard/Forward_to_Mediation_Board.png";
import MB_fail_with_pending_non_settlement from "../../assets/images/mediationBoard/MB_fail_with_pending_non_settlement.png";
import MB_Negotiation from "../../assets/images/mediationBoard/MB_Negotiation.png";
import MB_Settle_Active from "../../assets/images/mediationBoard/MB_Settle_Active.png";
import MB_Settle_open_pending from "../../assets/images/mediationBoard/MB_Settle_open_pending.png";
import MB_Settle_pending from "../../assets/images/mediationBoard/MB_Settle_pending.png";
import Swal from "sweetalert2";
// Status icon mapping
const STATUS_ICONS = {
  Forward_to_Mediation_Board: {
    icon: Forward_to_Mediation_Board,
    tooltip: "Forward to Mediation Board",
  },
  MB_fail_with_pending_non_settlement: {
    icon: MB_fail_with_pending_non_settlement,
    tooltip: "MB fail with pending non settlement",
  },
  MB_Negotiation: {
    icon: MB_Negotiation,
    tooltip: "MB Negotiation",
  },
  MB_Settle_Active: {
    icon: MB_Settle_Active,
    tooltip: "MB Settle Active",
  },
  MB_Settle_open_pending: {
    icon: MB_Settle_open_pending,
    tooltip: "MB Settle open pending",
  },
  MB_Settle_pending: {
    icon: MB_Settle_pending,
    tooltip: "MB Settle pending",
  },
};

// Status Icon component with tooltip
const StatusIcon = ({ status }) => {
  const statusInfo = STATUS_ICONS[status];

  if (!statusInfo) return <span>{status}</span>;

  return (
    <div className="relative group">
      <img src={statusInfo.icon} alt={status} className="w-6 h-6 cursor-help" />
      <div className="absolute invisible group-hover:visible bg-gray-800 text-white text-sm rounded px-2 py-1 left-1/2 transform -translate-x-1/2 bottom-full mb-1 whitespace-nowrap z-10">
        {statusInfo.tooltip}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </div>
  );
};

export default function MediationBoardCaseList() {

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDRC, setSelectedDRC] = useState("");
  const [selectedRTOM, setSelectedRTOM] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState(tableData);
  const navigate = useNavigate();

  const rowsPerPage = 7;

  const fetchData = async () => {
    try {
      setIsLoading(true);
  
      const filters = {
        case_current_status: selectedStatus,
        rtom: selectedRTOM,
        drc_name: selectedDRC,
        From_DAT: fromDate ? fromDate.toISOString().split("T")[0] : null,
        To_DAT: toDate ? toDate.toISOString().split("T")[0] : null,
      };
  
      const response = await List_All_DRCs_Mediation_Board_Cases(filters);
      console.log("Response:", response);
  
      if (!response?.data) {
        setTableData([]);
        setFilteredData([]);
        return;
      }
  
      const formattedData = response.data.map((item) => ({
        id: item.case_id || "N/A",
        case_status: item.case_current_status || "N/A",
        date: item.created_dtm ? new Date(item.created_dtm).toLocaleDateString("en-GB") : "N/A",
        drc: item.drc_name || "N/A",
        rtom: item.rtom || "N/A",
        calling_round: item.mediation_board_call_count || "N/A",
        next_calling_date: item.latest_next_calling_dtm ? new Date(item.latest_next_calling_dtm).toLocaleDateString("en-GB") : "N/A",
        created_dtm: item.created_dtm ? new Date(item.created_dtm).toISOString().split("T")[0] : "N/A",
      }));
  
      
      const filteredResults = formattedData.filter((row) => {
        const matchesStatus = !selectedStatus || row.case_status === selectedStatus;
        const matchesDRC = !selectedDRC || row.drc === selectedDRC;
        const matchesRTOM = !selectedRTOM || row.rtom === selectedRTOM;
        const matchesDate =
          (!fromDate || new Date(row.created_dtm) >= fromDate) &&
          (!toDate || new Date(row.created_dtm) <= toDate);
  
        return matchesStatus && matchesDRC && matchesRTOM && matchesDate;
      });
  
      setTableData(formattedData);
      setFilteredData(filteredResults);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  
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

  useEffect(() => {
    setFilteredData(
      tableData.filter((row) =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery]); 

  const handleFilterClick = () => {
    if (!selectedStatus && !selectedDRC && !selectedRTOM && !fromDate && !toDate) {
      Swal.fire({
        title: "Missing Filters",
        text: "Please select a filter criteria.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
  
    const filtered = tableData.filter((row) => {
      const matchesStatus = !selectedStatus || row.case_status === selectedStatus;
      const matchesDRC = !selectedDRC || row.drc === selectedDRC;
      const matchesRTOM = !selectedRTOM || row.rtom === selectedRTOM;
      const matchesDate =
        (!fromDate || new Date(row.created_dtm) >= new Date(fromDate)) &&
        (!toDate || new Date(row.created_dtm) <= new Date(toDate));
  
      return matchesStatus && matchesDRC && matchesRTOM && matchesDate;
    });
  
    setFilteredData(filtered);
  };
  

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

  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>Mediation Board Case List</h1>

      {/* Filter section */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-end my-6 gap-1 mb-8">
        {/* Status dropdown */}
        <div className="w-40">
          <select
            className={`${GlobalStyle.selectBox} w-32 md:w-40`}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">Status</option>
            <option value="Forward to Mediation Board">
            Forward to Mediation Board
            </option>
            <option value="MB Request Customer-Info">
            MB Request Customer-Info
            </option>
            <option value=" MB Handover Customer-Info">
            MB Handover Customer-Info
            </option>
            <option value="MB Fail with Pending Non-Settlement">
            MB Fail with Pending Non-Settlement
            </option>
            <option value="MB Negotiation">MB Negotiation</option>
            <option value="MB Settle Active">MB Settle Active</option>
            <option value="MB Settle Open-Pending">
              MB Settle Open-Pending
            </option>
            <option value="MB Settle Pending">MB Settle Pending</option>
            {/* Add other status options */}
          </select>
        </div>

        {/* DRC dropdown */}
        <div className="w-40">
          <select
            className={`${GlobalStyle.selectBox} w-32 md:w-40`}
            value={selectedDRC}
            onChange={(e) => setSelectedDRC(e.target.value)}
          >
            <option value="">DRC</option>
            <option value="abcd">ABCD</option>
            {/* Add other DRC options */}
          </select>
        </div>

        {/* RTOM dropdown */}
        <div className="w-40">
          <select
            className={`${GlobalStyle.selectBox} w-32 md:w-40`}
            value={selectedRTOM}
            onChange={(e) => setSelectedRTOM(e.target.value)}
          >
            <option value="">RTOM</option>
            <option value="Standard">Standard</option>
            {/* Add other RTOM options */}
          </select>
        </div>

        <label className={GlobalStyle.dataPickerDate}>Date</label>
        <DatePicker
          selected={fromDate}
          onChange={handleFromDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/MM/yyyy"
          className={`${GlobalStyle.inputText} w-32 md:w-40`}
        />
        <DatePicker
          selected={toDate}
          onChange={handleToDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/MM/yyyy"
          className={`${GlobalStyle.inputText} w-32 md:w-40`}
        />

        {/* Filter button */}
        <button
          className={GlobalStyle.buttonPrimary}
          onClick={handleFilterClick}
        >
          Filter
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Search bar */}
      <div className="mb-4 flex justify-start">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={GlobalStyle.inputSearch}
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>
      </div>

      {/* Table */}
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Status</th>
              <th className={GlobalStyle.tableHeader}>Date</th>
              <th className={GlobalStyle.tableHeader}>DRC</th>
              <th className={GlobalStyle.tableHeader}>RO Name</th>
              <th className={GlobalStyle.tableHeader}>RTOM</th>
              <th className={GlobalStyle.tableHeader}>Calling Round</th>
              <th className={GlobalStyle.tableHeader}>Next Calling Date</th>
              <th className={GlobalStyle.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={index} // Ensure uniqueness
                className={`${
                  index % 2 === 0
                    ? "bg-white bg-opacity-75"
                    : "bg-gray-50 bg-opacity-50"
                } border-b`}
              >
                <td className={GlobalStyle.tableData}>{row.id}</td>
                <td
                  className={`${GlobalStyle.tableData} flex justify-center items-center`}
                >
                  <StatusIcon status={row.case_status} />
                </td>
                <td className={GlobalStyle.tableData}>{row.date}</td>
                <td className={GlobalStyle.tableData}>{row.drc_name}</td>
                <td className={GlobalStyle.tableData}>{row.ro}</td>
                <td className={GlobalStyle.tableData}>{row.rtom}</td>
                <td className={GlobalStyle.tableData}>{row.calling_round}</td>
                <td className={GlobalStyle.tableData}>
                  {row.next_calling_date}
                </td>
                <td className={GlobalStyle.tableData}>
                  <img
                    src={edit}
                    alt="Edit Case"
                    className="w-6 h-6 cursor-pointer"
                    onClick={() =>
                      navigate(`/MediationBoard/MediationBoardResponse/${row.id}`, {
                        state: { caseData: row },
                      })
                      
                    }
                  />
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  {isloading ? "Loading..." : "No results found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
}
