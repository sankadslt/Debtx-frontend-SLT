import React, { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const WithdrawalCaseLog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for the table with real dates
  const caseData = [
    {
      caseId: "C001",
      status: "Pending write off",
      accountNo: "12233",
      amount: "15000",
      remark: "",
      withdrawBy: "",
      withdrawOn: "",
      approvedOn: "",
    },
    {
      caseId: "C002",
      status: "Write off",
      accountNo: "11223",
      amount: "23000",
      remark: "",
      withdrawBy: "",
      withdrawOn: "",
      approvedOn: "",
    },
    {
      caseId: "C003",
      status: "Write off",
      accountNo: "44556",
      amount: "10000",
      remark: "",
      withdrawBy: "",
      withdrawOn: "",
      approvedOn: "",
    },
  ];

  const [filteredData, setFilteredData] = useState(caseData);
  const rowsPerPage = 7;

  // Apply filtering whenever search query or dates change
  useEffect(() => {
    filterData();
  }, [searchQuery, fromDate, toDate]);

  // Filtering function
  const filterData = () => {
    setIsLoading(true);
    let filtered = [...caseData];

    // Filter by date
    if (fromDate && toDate) {
      filtered = filtered.filter((item) => {
        if (!item.writeOffOn) return false;
        const itemDate = new Date(item.writeOffOn);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          (value ?? "")
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredData(filtered);
    setCurrentPage(0);
    setIsLoading(false);
  };

  const handleFilter = () => {
    filterData();
  };

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>Withdrawal Case Log</h1>

      {/* Add Button */}
      <div className="flex justify-end mb-4">
        <button
          className={GlobalStyle.buttonPrimary}
          onClick={() => {
            // Add your logic for handling the Add button click here
          }}
        >
          Add
        </button>
      </div>

      {/* Filter Section */}
      <div className="flex gap-4 justify-end">
        <div className={GlobalStyle.datePickerContainer}>
          <DatePicker
            selected={fromDate}
            onChange={handleFromDateChange}
            dateFormat="MM/dd/yyyy"
            placeholderText="MM/dd/yyyy"
            className={GlobalStyle.inputText}
          />
          <DatePicker
            selected={toDate}
            onChange={handleToDateChange}
            dateFormat="MM/dd/yyyy"
            placeholderText="MM/dd/yyyy"
            className={GlobalStyle.inputText}
          />

          <button className={GlobalStyle.buttonPrimary} onClick={handleFilter}>
            Filter
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Search Bar */}
      <div className="mb-4 flex justify-start">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className={GlobalStyle.inputSearch}
            placeholder=""
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>
      </div>

      {/* Table Section */}
      <div className={GlobalStyle.tableContainer}>
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th className={GlobalStyle.tableHeader}>Case ID</th>
                <th className={GlobalStyle.tableHeader}>Status</th>
                <th className={GlobalStyle.tableHeader}>Account No</th>
                <th className={GlobalStyle.tableHeader}>Amount</th>
                <th className={GlobalStyle.tableHeader}>Remark</th>
                <th className={GlobalStyle.tableHeader}>Withdraw By</th>
                <th className={GlobalStyle.tableHeader}>Withdraw On</th>
                <th className={GlobalStyle.tableHeader}>Approved On</th>
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
                  <td className={GlobalStyle.tableData}>{row.caseId}</td>
                  <td className={GlobalStyle.tableData}>{row.status}</td>
                  <td className={GlobalStyle.tableData}>{row.accountNo}</td>
                  <td className={GlobalStyle.tableData}>{row.amount}</td>
                  <td className={GlobalStyle.tableData}>{row.remark}</td>
                  <td className={GlobalStyle.tableData}>{row.withdrawBy}</td>
                  <td className={GlobalStyle.tableData}>{row.withdrawOn}</td>
                  <td className={GlobalStyle.tableData}>{row.approvedOn}</td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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
};

export default WithdrawalCaseLog;
