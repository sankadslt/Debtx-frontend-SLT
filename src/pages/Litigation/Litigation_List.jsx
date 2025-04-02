/*Purpose: 
Created Date: 2025-04-01
Created By: Nimesh Perera (nimeshmathew999@gmail.com)
Last Modified Date: 2025-04-01
Modified By: Nimesh Perera (nimeshmathew999@gmail.com)
Version: React v18
ui number : 4.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import DatePicker from "react-datepicker"
import GlobalStyle from "../../assets/prototype/GlobalStyle"
import { useEffect, useRef, useState } from "react"
import { FaArrowLeft, FaArrowRight, FaEye, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Litigation_Fail_Update } from "./Litigation_Fail_Update";

export const Litigation_List = () => {
  const navigate =useNavigate();
  const [fromDate, setFromDate] =useState(null);
  const [toDate, setToDate] =useState(null);
  const [searchQuery, setSearchQuery] =useState("");
  const [currentPage, setCurrentPage] =useState(0);
  const [isloading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] =useState(false);
  const rowsPerPage =5;

  const sampleData = [
    {
        id: "001",
        status: "Initial_Litigation",
        account_no: "123456",
        amount: "5000",
        legal_accepted_date: "01/04/2024",
        settlement_created_date: "15/04/2024",
    },

    {
        id: "002",
        status: "Pending_FTL",
        account_no: "123456",
        amount: "5000",
        legal_accepted_date: "01/04/2024",
        settlement_created_date: "15/04/2024",
    },
    {
        id: "003",
        status: "FTL_Settle_Pending",
        account_no: "123456",
        amount: "5000",
        legal_accepted_date: "01/04/2024",
        settlement_created_date: "15/04/2024",
    },
    {
        id: "004",
        status: "FTL",
        account_no: "123456",
        amount: "5000",
        legal_accepted_date: "01/04/2024",
        settlement_created_date: "15/04/2024",
    },
    {
        id: "005",
        status: "FLU",
        account_no: "123456",
        amount: "5000",
        legal_accepted_date: "01/04/2024",
        settlement_created_date: "15/04/2024",
    },
    {
        id: "006",
        status: "SLA",
        account_no: "123456",
        amount: "5000",
        legal_accepted_date: "01/04/2024",
        settlement_created_date: "15/04/2024",
    },
    {
        id: "007",
        status: "FLA",
        account_no: "123456",
        amount: "5000",
        legal_accepted_date: "01/04/2024",
        settlement_created_date: "15/04/2024",
    },
    {
        id: "008",
        status: "Litigation",
        account_no: "123456",
        amount: "5000",
        legal_accepted_date: "01/04/2024",
        settlement_created_date: "15/04/2024",
    },
  ];

  const filteredData = sampleData.filter(
    (item) =>
      item.id.includes(searchQuery) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < pages - 1) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleFilter = () => {
    alert("Filter clicked");
  }

  return (
    <div className={GlobalStyle.fontPoppins}>
        <h1 className={GlobalStyle.headingLarge}>Litigation List</h1>

        {/* Filtering Section */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-end my-6 gap-1 mb-8">
            <div className="flex items-center justify-end gap-[20px] w-full">
                {/* Status */}
                <select className={GlobalStyle.selectBox}>
                    <option value="">Status</option>
                    <option value="Initial_Litigation">Initial Litigation</option>
                    <option value="Pending_FTL">Pending FTL</option>
                    <option value="FTL_Settle_Pending">FTL Settle Pending</option>
                    <option value="FTL">FTL</option>
                    <option value="FLU">FLU (Fail from Legal Unit)</option>
                    <option value="SLA">SLA (Success Legal Action)</option>
                    <option value="FLA">FLA (Fail Legal Action)</option>
                    <option value="Litigation">Litigation</option>
                </select>

                {/* Date Type */}
                <select className={GlobalStyle.selectBox}>
                    <option value="">Date Type</option>
                    <option value="accepted">Legal Accepted Date</option>
                    <option value="created">Settlement Created DTM</option>
                </select>

                {/* Date */}
                <div className="flex gap-1 items-center">
                    <label className={GlobalStyle.dataPickerDate}>Date</label>
                    <DatePicker
                        selected={fromDate}
                        onChange={(date) => setFromDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/mm/yyyy"
                        className={`${GlobalStyle.inputText} w-32 md:w-40`}
                    />

                    <DatePicker
                        selected={toDate}
                        onChange={(date) => setToDate(date)}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="dd/mm/yyyy"
                        className={`${GlobalStyle.inputText} w-32 md:w-40`}
                    />
                </div>

                {/* Filter Button */}
                <button
                    className={GlobalStyle.buttonPrimary}
                    onClick={handleFilter}
                >
                    Filter
                </button>
            </div>
        </div>

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
                <th className={GlobalStyle.tableHeader}>Account No</th>
                <th className={GlobalStyle.tableHeader}>Amount</th>
                <th className={GlobalStyle.tableHeader}>Legal Accepeted Date</th>
                <th className={GlobalStyle.tableHeader}>Settlement Created Date</th>
                <th className={GlobalStyle.tableHeader}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {paginatedData.map((item, index) => (
                <tr
                    key={index}
                    className={`${
                    index % 2 === 0
                        ? "bg-white bg-opacity-75"
                        : "bg-gray-50 bg-opacity-50"
                    } border-b`}
                >
                    <td className={GlobalStyle.tableData}>{item.id}</td>
                    <td className={GlobalStyle.tableData}>{item.status}</td>
                    <td className={GlobalStyle.tableData}>{item.account_no}</td>
                    <td className={GlobalStyle.tableData}>{item.amount}</td>
                    <td className={GlobalStyle.tableData}>{item.legal_accepted_date}</td>
                    <td className={GlobalStyle.tableData}>{item.settlement_created_date}</td>
                    <td className={`${GlobalStyle.tableData} px-4`}>
                        {item.status === "Initial_Litigation" && (
                            <div>
                                <button 
                                    className="px-4 py-2 bg-white rounded-full border border-[#001120]"
                                    onClick={() => navigate("/pages/Litigation/Litigation_Documentation")}
                                >
                                    Documents
                                </button>
                            </div>
                        )}
                        {item.status === "Pending_FTL" && (
                            <div className="flex gap-2">
                                <button 
                                    className="px-4 py-2 bg-[#50B748] rounded-full border border-[#001120]"
                                    onClick={() => navigate("/pages/Litigation/Litigation_Submission_Document_Summary")}
                                >
                                    Documents
                                </button>
                                <button 
                                    className="px-4 py-2 bg-white rounded-full border border-[#001120]"
                                    onClick={() => navigate("/pages/Litigation/Litigation_Submission")}    
                                >
                                    Legal Submission
                                </button>
                            </div>
                        )}
                        {item.status === "FTL_Settle_Pending" && (
                            <div className="flex justify-center gap-2">   
                                <button  onClick={() => navigate("/pages/Litigation/Litigation_Case_Details")}>
                                    <FaEye className="w-6 h-6"/>
                                </button>
                            </div>
                        )}
                        {item.status === "Litigation" && (
                            <div className="flex gap-2">   
                                <button className="px-4 py-2 bg-white rounded-full border border-[#001120]">
                                    Create Settlement
                                </button>
                                <button 
                                    className="px-4 py-2 bg-white rounded-full border border-[#001120]"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Legal Fail
                                </button>
                                <Litigation_Fail_Update isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}/>
                            </div>
                        )}
                        {item.status === "FTL" && (
                            <div className="flex gap-2">   
                                <button 
                                    className="px-4 py-2 bg-white rounded-full border border-[#001120]"
                                    onClick={() => navigate("/pages/Litigation/Litigation_Court_Details_Update")}    
                                >
                                    Legal Details
                                </button>
                                <button className="px-4 py-2 bg-white rounded-full border border-[#001120]">
                                    Create Settlement
                                </button>
                            </div>
                        )}
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
  )
}
