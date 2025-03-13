// Purpose: This template is used for the SLT Commission List1 (8.1).
// Created Date: 2025-03-13
// Created By: U.H.Nandali Linara (nadalilinara5@gmail.com)
// Last Modified Date: 2025-03-14
// Version: node 11
// ui number :8.1
// Dependencies: tailwind css
// Related Files:  router.js.js (routes)

import React, { useState, useEffect } from 'react';
import GlobalStyle from '../../assets/prototype/GlobalStyle';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSearch, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Commission_List = () => {
  const [selectValue, setSelectValue] = useState('Account No');
  const [inputFilter, setInputFilter] = useState('');
  const [phase, setPhase] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [dateError, setDateError] = useState('');
  const rowsPerPage = 5; // Number of rows per page

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
      // Check if from date is before to date
      if (from >= to) {
        Swal.fire({
          title: 'Warning',
          text: 'From date must be before to date',
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6'
        });
        return false;
      }
      const oneMonthLater = new Date(from);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    
    if (to > oneMonthLater) {
      Swal.fire({
        title: 'Warning',
        text: 'Date range cannot exceed one month',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return false;
    }
  }
  
  return true;
};

  // Sample data
  const data = [
    { caseId: "RC001",commissionstatus: "", drc: "CMS", createdDtm: "2025-02-08", commissionamount: "5000",  commissiontype: "Unresolved Commission", commissionaction: "Payment" ,  },
    { caseId: "RC002", commissionstatus: "", drc: "TCM", createdDtm: "2025-02-10", commissionamount: "8000", commissiontype: "Pending Commission", commissionaction: "CPE" },
    { caseId: "RC001", commissionstatus: "",drc: "CMS", createdDtm: "2025-02-08", commissionamount: "5000",commissiontype: "Unresolved Commission", commissionaction: "Payment" ,  },
    { caseId: "RC001", commissionstatus: "", drc: "CMS", createdDtm: "2025-02-08", commissionamount: "5000", commissiontype: "Unresolved Commission", commissionaction: "Payment" ,  },
    { caseId: "RC001", commissionstatus: "",drc: "CMS", createdDtm: "2025-02-08", commissionamount: "5000",commissiontype: "Unresolved Commission", commissionaction: "Payment" ,  },
    { caseId: "RC001", commissionstatus: "", drc: "CMS", createdDtm: "2025-02-08", commissionamount: "5000", commissiontype: "Unresolved Commission", commissionaction: "Payment" ,  },
    { caseId: "RC001",commissionstatus: "", drc: "CMS", createdDtm: "2025-02-08", commissionamount: "5000", commissiontype: "Unresolved Commission", commissionaction: "Payment" ,  },
    { caseId: "RC001", commissionstatus: "",drc: "CMS", createdDtm: "2025-02-08", commissionamount: "5000", commissiontype: "Unresolved Commission", commissionaction: "Payment" ,  },
  ];

  // Show all data by default
  useEffect(() => {
    setFilteredData(data);
  }, []);

  // Function to filter data based on input criteria
  const handleFilterClick = () => {
    if (fromDate && toDate && !validateDates(fromDate, toDate)) {
      return; // Stop filtering if dates are invalid
    }
    let filtered = data.filter(row => {
      let matchesSearch = true;
      let matchesPhase = true;
      let matchesDate = true;

      // Search filter (Case ID or Account No)
      if (inputFilter.trim() !== '') {
        if (selectValue === 'Case ID') {
          matchesSearch = row.caseId.toLowerCase().includes(inputFilter.toLowerCase());
        } else if (selectValue === 'Account No') {
          // Check if accountNo exists in the row before filtering
          matchesSearch = row.accountNo ? row.accountNo.toLowerCase().includes(inputFilter.toLowerCase()) : false;
        }
      }
  

      // Phase filter
      if (phase !== '' && phase !== 'DRC') {
        matchesSearch = row.drc === phase;
      }

      // Date range filter
      const rowDate = new Date(row.paiddtm);
      if (fromDate && rowDate < fromDate) matchesDate = false;
      if (toDate && rowDate > toDate) matchesDate = false;

      return matchesSearch && matchesPhase && matchesDate;
    });

    setFilteredData(filtered);
    setCurrentPage(0); // Reset to page 1 when filters are applied
  };

  // Dynamic search function across all fields
  const getSearchedData = () => {
    if (!searchQuery.trim()) return filteredData; // Return filtered data if no search

    return filteredData.filter(row =>
      Object.values(row).some(value =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  // Pagination logic
  const pages = Math.ceil(getSearchedData().length / rowsPerPage); // Total pages
  const startIndex = currentPage * rowsPerPage; // Calculate the starting index of current page
  const currentData = getSearchedData().slice(startIndex, startIndex + rowsPerPage); // Slice the data to show on current page

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

      <div className={`${GlobalStyle.miniCaseCountBar} mb-6 flex justify-center w-full mb-2`}>
  <div className={GlobalStyle.miniCountBarSubTopicContainer}>
    <div className={GlobalStyle.miniCountBarMainBox}>
      <span>Commission :</span>
      <p className={GlobalStyle.miniCountBarMainTopic}>1200</p>
    </div>
    <div className={GlobalStyle.miniCountBarMainBox}>
      <span>Unresolved :</span>
      <p className={GlobalStyle.miniCountBarMainTopic}>800</p>
    </div>
    <div className={GlobalStyle.miniCountBarMainBox}>
      <span>Unresolved:</span>
      <p className={GlobalStyle.miniCountBarMainTopic}>400</p>
    </div>
  </div>
</div>

      {/* Filters - Single Row */}
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
          value={phase}
          onChange={(e) => setPhase(e.target.value)}
          className={GlobalStyle.selectBox}
        >
          <option value="">DRC</option>
          <option value="CMS">CMS</option>
          <option value="TCM">TCM</option>
          <option value="RE">RE</option>
          <option value="CO LAN">CO LAN</option>
          <option value="ACCIVA">ACCIVA</option>
          <option value="VISONCOM">VISONCOM</option>
          <option value="PROMPT">PROMPT</option>
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

        <button className={GlobalStyle.buttonPrimary} onClick={handleFilterClick}>
          Filter
        </button>
        {dateError && (
  <div className="text-red-500 text-sm mt-1">{dateError}</div>
)}
      </div>

      {/* Search Bar */}
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

      {/* Table */}
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
                <tr key={index} className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}>
                  <td className={GlobalStyle.tableData}>{row.caseId}</td>
                  <td className={GlobalStyle.tableData}>{row.commissionstatus}</td>
                  <td className={GlobalStyle.tableData}>{row.drc}</td>
                  <td className={GlobalStyle.tableData}>{row.createdDtm}</td>
                  <td className={GlobalStyle.tableData}>{row.commissionamount}</td>
                  <td className={GlobalStyle.tableData}>{row.commissiontype}</td>
                  <td className={GlobalStyle.tableData}>{row.commissionaction}</td>
                  <td className={GlobalStyle.tableData + " text-center"}>
                  <button className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center">⋯</button>
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
