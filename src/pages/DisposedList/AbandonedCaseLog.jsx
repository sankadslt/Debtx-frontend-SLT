import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import { GetAbandonedCaseLogDetailsByAccountNumber } from "../../services/case/CaseServices";
import { getLoggedUserId } from "../../services/auth/authService.js";

const STATUS_ICONS = {
  "pending abandoned": { icon: "/icons/pending.svg", tooltip: "Pending Abandoned" },
  "abandoned": { icon: "/icons/abandoned.svg", tooltip: "Abandoned" },
  "pending write off": { icon: "/icons/writeoff.svg", tooltip: "Pending Write Off" }
};

const StatusIcon = ({ status }) => {
  const info = STATUS_ICONS[status.toLowerCase()];
  if (!info) return <span>{status}</span>;
  return (
    <div className="relative group">
      <img src={info.icon} alt={status} className="w-6 h-6 cursor-help" />
      <div className="absolute invisible group-hover:visible bg-black text-white text-sm rounded px-2 py-1 bottom-full left-1/2 transform -translate-x-1/2 mb-1 z-10 whitespace-nowrap">
        {info.tooltip}
        <div className="absolute w-2 h-2 bg-black rotate-45 top-full left-1/2 transform -translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default function AbandonedCaseLog() {
  const [abandonedCases, setAbandonedCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [accountNumber, setAccountNo] = useState("");
  const rowsPerPage = 5;

  useEffect(() => {
    const loadUser = async () => {
      await getLoggedUserId(); // Optional: Set user state if needed
    };
    loadUser();
  }, []);

  const formatDate = (date) =>
    date ? new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0] : null;

  const handleFilter = async () => {
    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      Swal.fire({
        title: "Invalid Date Range",
        text: "Both From and To dates are required.",
        icon: "warning"
      });
      return;
    }

    const payload = {
      fromDate: formatDate(fromDate),
      toDate: formatDate(toDate),
      status,
      accountNumber,
      page: currentPage,
      limit: rowsPerPage,
    };

    try {
      const response = await GetAbandonedCaseLogDetailsByAccountNumber(payload);

      if (response.data.success) {
        setAbandonedCases(response.data.data);
        setFilteredCases(response.data.data);
      } else {
        Swal.fire("No Data", response.data.message, "info");
        setAbandonedCases([]);
        setFilteredCases([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire("Error", "Something went wrong while fetching data.", "error");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const response = abandonedCases.filter((item) =>
      Object.values(item).join(" ").toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCases(response);
    setCurrentPage(1);
  };

  const paginatedData = filteredCases.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredCases.length / rowsPerPage);

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <h1 className={GlobalStyle.headingLarge}>Abandoned Case Log</h1>

      {/* Filter */}
      <div className="flex gap-4 items-center justify-end flex-wrap mt-4">
        <input
          type="text"
          placeholder="Enter Account No"
          value={accountNumber}
          onChange={(e) => setAccountNo(e.target.value)}
          className={GlobalStyle.inputText}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={GlobalStyle.selectBox}
        >
          <option value="">Status</option>
          <option value="Pending Write Off">pending write off</option>
          <option value="Pending Abandoned">Pending Abandoned</option>
          <option value="Abandoned">Abandoned</option>
        </select>
        <div className="flex gap-2 items-center">
          <label className={GlobalStyle.dataPickerDate}>Date</label>
          <DatePicker
            selected={fromDate}
            onChange={setFromDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="From"
            className={GlobalStyle.inputText}
          />
          <DatePicker
            selected={toDate}
            onChange={setToDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="To"
            className={GlobalStyle.inputText}
          />
        </div>
        <button onClick={handleFilter} className={GlobalStyle.buttonPrimary}>Filter</button>
      </div>

      {/* Search */}
      <div className="flex justify-start mt-8 mb-4">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
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
              <th className={GlobalStyle.tableHeader}>Amount</th>
              <th className={GlobalStyle.tableHeader}>Status</th>
              <th className={GlobalStyle.tableHeader}>Remark</th>
              <th className={GlobalStyle.tableHeader}>Abandoned By</th>
              <th className={GlobalStyle.tableHeader}>Abandoned On</th>
              <th className={GlobalStyle.tableHeader}>Approved On</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={index} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b`}>
                  <td className={GlobalStyle.tableData}>{row.caseId}</td>
                  <td className={GlobalStyle.tableData}>{row.amount}</td>
                  <td className={GlobalStyle.tableData}><StatusIcon status={row.status} /></td>
                  <td className={GlobalStyle.tableData}>{row.remark}</td>
                  <td className={GlobalStyle.tableData}>{row.abandonedBy}</td>
                  <td className={GlobalStyle.tableData}>{row.abandonedOn}</td>
                  <td className={GlobalStyle.tableData}>{row.approvedOn}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">No results found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredCases.length > 0 && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={GlobalStyle.navButton}
          >
            <FaArrowLeft />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={GlobalStyle.navButton}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
}