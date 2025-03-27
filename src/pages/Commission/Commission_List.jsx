/*Purpose: This template is used for the SLT Commission List1 (8.1).
Created Date: 2025-03-13
Created By: U.H.Nandali Linara (nadalilinara5@gmail.com)
Modified By : Lasandi Randini (randini-im20057@stu.kln.ac.lk)
Last Modified Date: 2025-03-14
Version: node 11
ui number :8.1
Dependencies: tailwind css
Related Files:  router.js.js (routes) */

import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { List_All_Commission_Cases } from "../../services/commission/commissionService";
import { Active_DRC_Details } from "../../services/drc/Drc";
import Swal from "sweetalert2";

const Commission_List = () => {
  const [selectValue, setSelectValue] = useState("Account No");
  const [inputFilter, setInputFilter] = useState("");
  const [phase, setPhase] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [drcNames, setDrcNames] = useState([]);
  const [selectedDrcId, setSelectedDrcId] = useState("");
  const [commissionCounts, setCommissionCounts] = useState({
    total: 0,
    commissioned: 0,
    unresolvedCommission: 0,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [dateError, setDateError] = useState("");

  const rowsPerPage = 5;
  useEffect(() => {
    const fetchDrcNames = async () => {
      try {
        const names = await Active_DRC_Details();

        setDrcNames(names);
      } catch (error) {
        console.error("Error fetching DRC names:", error);
      }
    };
    fetchData();
    setFilteredData(data);
    fetchDrcNames();
  }, []);

  const fetchData = async () => {
    try {
      const filters = {
        case_id: selectValue === "Case ID" ? inputFilter : undefined,
        From_DAT: fromDate ? fromDate.toISOString() : undefined,
        TO_DAT: toDate ? toDate.toISOString() : undefined,
        DRC_ID: selectedDrcId || phase || undefined,
      };

      const response = await List_All_Commission_Cases(filters);
      console.log(response.data);

      setCommissionCounts(
        response?.counts || {
          total: 0,
          commissioned: 0,
          unresolvedCommission: 0,
        }
      );
      console.log(response.counts);
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to fetch data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
    validateDates(date, toDate);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    validateDates(fromDate, date);
  };

  const validateDates = (from, to) => {
    if (from && to) {
     
      if (from >= to) {
        Swal.fire({
          title: "Warning",
          text: "From date must be before to date",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
        });
        return false;
      }
      const oneMonthLater = new Date(from);
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

      if (to > oneMonthLater) {
        Swal.fire({
          title: "Warning",
          text: "Date range cannot exceed one month",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
        });
        return false;
      }
    }

    return true;
  };

  const handleFilterClick = () => {
    if (fromDate && toDate && !validateDates(fromDate, toDate)) {
      return;
    }

    const selectedDrcIdMapped = selectedDrcId
      ? parseInt(selectedDrcId, 10)
      : null;

    let filtered = data.filter((row) => {
      let matchesSearch = true;
      let matchesPhase = true;
      let matchesDate = true;

      if (inputFilter.trim() !== "") {
        if (selectValue === "Case ID") {
          const caseIdFilter = parseInt(inputFilter, 10);
          matchesSearch = row.case_id === caseIdFilter;
        } else if (selectValue === "Account No") {
          matchesSearch =
            row.account_no &&
            row.account_no.toLowerCase().includes(inputFilter.toLowerCase());
        }
      }

      if (selectedDrcIdMapped !== null) {
        matchesPhase = row.drc_id === selectedDrcIdMapped;
      }

      const rowDate = new Date(row.created_on);
      if (fromDate && rowDate < fromDate) matchesDate = false;
      if (toDate && rowDate > toDate) matchesDate = false;

      return matchesSearch && matchesPhase && matchesDate;
    });

    setFilteredData(filtered);
    setCurrentPage(0);
  };


  const getSearchedData = () => {
    if (!searchQuery.trim()) return filteredData;

    return filteredData.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  const pages = Math.ceil(getSearchedData().length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const currentData = getSearchedData().slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < pages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <h1 className={GlobalStyle.headingLarge + " mb-6"}>Commission List</h1>

      <div
        className={`${GlobalStyle.miniCaseCountBar} mb-6 flex justify-center w-full `}
      >
        <div className={GlobalStyle.miniCountBarSubTopicContainer}>
          <div className={GlobalStyle.miniCountBarMainBox}>
            <span>Commission :</span>
            <p className={GlobalStyle.miniCountBarMainTopic}>
              {" "}
              {commissionCounts.commissioned +
                commissionCounts.unresolvedCommission}
            </p>
          </div>
          <div className={GlobalStyle.miniCountBarMainBox}>
            <span>Unresolved :</span>
            <p className={GlobalStyle.miniCountBarMainTopic}>
              {" "}
              {commissionCounts.unresolvedCommission}
            </p>
          </div>
          <div className={GlobalStyle.miniCountBarMainBox}>
            <span>Commissioned:</span>
            <p className={GlobalStyle.miniCountBarMainTopic}>
              {commissionCounts.unresolvedCommission}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        <select
          value={selectValue}
          onChange={(e) => setSelectValue(e.target.value)}
          className={GlobalStyle.selectBox}
        >
          <option value="">select</option>
          <option value="Account No">Account No</option>
          <option value="Case ID">Case ID</option>
        </select>

        <input
          type="text"
          value={inputFilter}
          onChange={(e) => setInputFilter(e.target.value)}
          className={GlobalStyle.inputText}
          placeholder="Enter"
        />

        <select
          value={selectedDrcId}
          onChange={(e) => setSelectedDrcId(e.target.value)}
          className={GlobalStyle.inputText}
        >
          <option value="">Select DRC</option>
          {drcNames.map((drc) => (
            <option key={drc.key} value={drc.id.toString()}>
              {drc.value}
            </option>
          ))}
        </select>

        <DatePicker
          selected={fromDate}
          onChange={handleFromDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="From"
          className={GlobalStyle.inputText}
        />

        <DatePicker
          selected={toDate}
          onChange={handleToDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="To"
          className={GlobalStyle.inputText}
        />

        <button
          className={GlobalStyle.buttonPrimary}
          onClick={handleFilterClick}
        >
          Filter
        </button>
        {dateError && (
          <div className="text-red-500 text-sm mt-1">{dateError}</div>
        )}
      </div>

      <div className="mb-4 flex items-center">
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

      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Commission Status</th>
              <th className={GlobalStyle.tableHeader}>DRC</th>
              <th className={GlobalStyle.tableHeader}>Created Date</th>
              <th className={GlobalStyle.tableHeader}>Commission Amount</th>
              <th className={GlobalStyle.tableHeader}>Commission Type</th>
              <th className={GlobalStyle.tableHeader}>Commission Action</th>
              <th className={GlobalStyle.tableHeader}> </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
                >
                  <td className={GlobalStyle.tableData}>{row.case_id}</td>
                  <td className={GlobalStyle.tableData}>
                    {row.commission_status}
                  </td>
                  <td className={GlobalStyle.tableData}>{row.drc_id}</td>
                  <td className={GlobalStyle.tableData}>
                    {new Date(row.created_on).toLocaleDateString()}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.commission_amount}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.commission_type}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.commission_action}
                  </td>
                  <td className={GlobalStyle.tableData + " text-center"}>
                    <button className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center">
                      ⋯
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-2">
                  No records found
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
          <button
            className={GlobalStyle.navButton}
            onClick={handleNextPage}
            disabled={currentPage >= pages - 1}
          >
            <FaArrowRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Commission_List;
