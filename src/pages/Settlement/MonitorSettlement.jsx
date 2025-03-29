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

import React, { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import more from "../../assets/images/imagefor1.a.13(one).png";
import Swal from "sweetalert2";
import { list_All_Settlement_Cases } from "../../services/case/CaseServices";


//const API_URL = "http://localhost:5000/api/settlement/List_All_Settlement_Cases";

const Monitor_settlement = () => {
  // State Variables
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [caseId, setCaseId] = useState("");
  const [status, setStatus] = useState("");
  const [phase, setPhase] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [caseIdFilter, setCaseIdFilter] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

  const navigate = useNavigate();

  // Fetch Initial Data when component mounts
  useEffect(() => {
    fetchCases();
  }, []);



const fetchCases = async (payload = {}) => {
    setLoading(true);
    try {

        const response =await list_All_Settlement_Cases(payload);
        console.log("response :", response);

        if (response?.status === "success" && Array.isArray(response.data.data)) {
            setFilteredData(response.data.data);
        } else {

          console.log("response :", response);
            console.error("Invalid response format:", response.data);
            setFilteredData([]);
        }
    } catch (error) {
        console.error(
            "Error fetching data:",
            error.response?.data || error.message
        );
        setFilteredData([]);
    } finally {
        setLoading(false);
    }
};


const handlestartdatechange = (date) => {
  if (toDate && date > toDate) {

    Swal.fire({
      title: "Warning",
      text: "The 'From' date cannot be later than the 'To' date.",
      icon: "warning",
      confirmButtonText: "OK",
    });
    setFromDate(null);
  }



  else {
    setError("");
    setFromDate(date);
  }
};

const handleenddatechange = (date) => {
  if (fromDate && date < fromDate) {

    Swal.fire({
      title: "Warning",
      text: "The 'To' date cannot be earlier than the 'From' date.",
      icon: "warning",
      confirmButtonText: "OK",
    });
    setToDate(null);
  } else {
    setError("");
    setToDate(date);
  }
};









  // Handle Filters
  const handleFilter = () => {
    if (!caseIdFilter && !phase && !status && !fromDate && !toDate) {
      Swal.fire({
        title: "Warning",
        text: "No filter data is selected. Please, select data.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      return;
    }

    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      Swal.fire({
        title: "Warning",
        text: "Both From Date and To Date must be selected.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      return;
    }

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      Swal.fire({
        title: "Warning",
        text: "To date should be greater than or equal to From date",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      return;
    }

    
    const payload = {
      case_id: caseIdFilter || null,
      settlement_phase: phase || null,
      settlement_status: status || null,
      from_date: fromDate ? fromDate.toISOString().split("T")[0] : null,
      to_date: toDate ? toDate.toISOString().split("T")[0] : null,
    };

   
    fetchCases(payload);
  };

  // Handle Pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <div className="flex flex-col flex-1">
        <main className="p-6">
          <h1 className={GlobalStyle.headingLarge}>Settlement List</h1>

          {/* Filters Section */}
          <div className="flex flex-wrap gap-4 mb-6 mt-10">
            <input
              type="text"
              value={caseIdFilter}
              onChange={(e) => setCaseIdFilter(e.target.value)}
              className={`${GlobalStyle.inputText} w-40`}
              placeholder="Case ID"
            />
            <select value={phase} onChange={(e) => setPhase(e.target.value)} className={`${GlobalStyle.selectBox}`}>
              <option value="">All</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Mediation board">Mediation board</option>
              <option value="Litigation">Litigation</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${GlobalStyle.selectBox}`}>
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Open_Pending">Open-Pending</option>
              <option value="Active">Active</option>
            </select>
            <DatePicker
              selected={fromDate}
              onChange={handlestartdatechange}
              dateFormat="dd/MM/yyyy"
              placeholderText="From"
              className={`${GlobalStyle.inputText}`}
            />
            <DatePicker
              selected={toDate}
              onChange={handleenddatechange}
              dateFormat="dd/MM/yyyy"
              placeholderText="To"
              className={`${GlobalStyle.inputText}`}
            />
            <button className={GlobalStyle.buttonPrimary} onClick={handleFilter}>
              Filter
            </button>
          </div>

          {/* Loading State */}
          {loading && <p>Loading...</p>}

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
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? GlobalStyle.tableRowEven : GlobalStyle.tableRowOdd}>
                      <td className={GlobalStyle.tableData}>{item.case_id}</td>
                      <td className={GlobalStyle.tableData}>{item.settlement_status}</td>
                      <td className={GlobalStyle.tableData}>{new Date(item.created_dtm).toLocaleDateString("en-CA")}</td>
                      <td className={GlobalStyle.tableData}>{item.settlement_id}</td>
                      <td className={GlobalStyle.tableData}>{item.settlement_phase}</td>
                      <td className={GlobalStyle.tableData}>
                        <img src={more} title="More" alt="more icon" className="w-5 h-5" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No cases available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={GlobalStyle.navButtonContainer}>
            <button onClick={() => handlePrevNext("prev")} disabled={currentPage === 1}><FaArrowLeft /></button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => handlePrevNext("next")} disabled={currentPage === totalPages}><FaArrowRight /></button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Monitor_settlement;
