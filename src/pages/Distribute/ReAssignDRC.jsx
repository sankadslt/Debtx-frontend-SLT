// Purpose: This template is used for the Re-Assign DRC page(1.A.18).
// Created Date: 2025-01-07
// Created By: H.P.R Chandrasekara (hprchandrasekara@gmail.com)
// Last Modified Date : 2025-01-07
// Modified Date: 2025-01-07
// Modified By: H.P.R Chandrasekara (hprchandrasekara@gmail.com)
// Version: node 11
// ui number : 1.18
// Dependencies: tailwind css
// Related Files:  app.js (routes)
// Notes:.


import { useState , useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { useLocation , useNavigate } from "react-router-dom";
import { AssignDRCToCaseDetails , Assign_DRC_To_Case} from "/src/services/case/CaseServices.js";
import {getLoggedUserId} from "/src/services/auth/authService.js";
import { Active_DRC_Details } from "/src/services/drc/Drc.js";
import Swal from "sweetalert2";

export default function ReAssignDRC() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage1, setCurrentPage1] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery1, setSearchQuery1] = useState("");
  const [caseDetails, setCaseDetails] = useState([]);
  const [tabledata, setTabledata] = useState([]);
  const [table1data, setTable1data] = useState([]);
  const [drcNames, setDrcNames] = useState([]);
  const [newEntry, setNewEntry] = useState({
    drckey: "",
    drc: "",
    remark : ""
  });

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const payload = { case_id: 1 };
    
        console.log("Sending API request with payload:", payload);
    
        const response = await AssignDRCToCaseDetails(payload);
    
        console.log("API Response:", response);

        console.log("Case details received:", response.data);
        setCaseDetails(response.data);
        
        setTabledata(response.data.ro_negotiation)
        console.log("Table:", response.data.ro_negotiation);

        setTable1data(response.data.drc)
        console.log("Table1:", response.data.drc);
          
      } catch (error) {
        console.error("Error fetching case details:", error);
        setCaseDetails([]);
      }
    };
    
  
    fetchCaseDetails();
  }, []);

  useEffect(() => {
    const fetchDRCNames = async () => {
      try {
        const Names = await Active_DRC_Details();
        setDrcNames(Names);
        
      } catch (error) {
        console.error("Error fetching drc names:", error);
      }
    };
    fetchDRCNames();
  });

  const handleonbacknuttonclick = () => {
    navigate("/pages/Distribute/AssignDRCCaseList" );
  };
  
  const onSubmit = async () => {
    const userId = await getLoggedUserId();

    const payload = {
      case_id: 1,
      drc_id: newEntry.drckey,
      remark: newEntry.remark,
      assigned_by: userId,
      drc_name: newEntry.drc
    };

    console.log("Sending API request with payload:", payload);

    try {
      const response = await Assign_DRC_To_Case(payload);

      console.log("API Response:", response);

      if (response.status = "success") {
        Swal.fire({
                icon: "success",
                title: "Success",
                text: "Data sent successfully.",
                confirmButtonColor: "#28a745",
        });
      } 
    }
    catch (error) {
      console.error("Error assigning DRC:", error);
      const errorMessage = error?.response?.data?.message || 
                                   error?.message || 
                                   "An error occurred. Please try again.";
      
              Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: errorMessage,
                  confirmButtonColor: "#d33",
              });
    }

  };

  const filteredSearchData = tabledata.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredSearchData1 = table1data.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery1.toLowerCase())
  );

  const itemsPerPage = 5;


// Pagination for filteredSearchData1 (table1data)
const totalpages1 = Math.ceil(filteredSearchData1.length / itemsPerPage);

const handlePrevNext1 = (direction) => {
  if (direction === "prev" && currentPage1 > 1) {
    setCurrentPage1(currentPage1 - 1);
  }
  if (direction === "next" && currentPage1 < totalpages1) {
    setCurrentPage1(currentPage1 + 1);
  }
};

const startIndex1 = (currentPage1 - 1) * itemsPerPage;
const endIndex1 = startIndex1 + itemsPerPage;
const paginatedData1 = filteredSearchData1.slice(startIndex1, endIndex1);




const totalPages = Math.ceil(filteredSearchData.length / itemsPerPage);

  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredSearchData.slice(startIndex, endIndex);


  
  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <h1 className={`${GlobalStyle.headingLarge} mb-5`}>Re-Assign DRC</h1>

      {/* card box*/}
      <div className={`${GlobalStyle.cardContainer}`}>
        <p className="flex gap-3 mb-2">
          <strong>Case ID: </strong>
          <div> {caseDetails.case_id}</div>
        </p>
        <p className="mb-2">
          <strong>Customer Ref: </strong>{caseDetails.customer_ref}
        </p>
        <p className="flex gap-3 mb-2">
          <strong>Account no: </strong>
          <div> {caseDetails.account_no}</div>
        </p>
        <p className="mb-2">
          <strong>Arrears Amount: </strong>{caseDetails.current_arrears_amount}
        </p>
        <p className="mb-2">
          <strong>Last Payment Date: </strong>{new Date(caseDetails.last_payment_date).toLocaleDateString()}
        </p>
      </div>

      <div className=" mb -6">
        <h2 className={`${GlobalStyle.headingMedium} mb-5`}>RO Details : </h2>
        <div className="flex flex-col">
              <div className="flex justify-start mb-4">
                  <div className={GlobalStyle.searchBarContainer}>
                    <input
                      type="text"
                      placeholder=""
                      value={searchQuery1}
                      onChange={(e) => setSearchQuery1(e.target.value)}
                      className={GlobalStyle.inputSearch}
                    />
                    <FaSearch className={GlobalStyle.searchBarIcon} />
                  </div>
                </div>
            
                <div className={GlobalStyle.tableContainer}>
                  <table className={GlobalStyle.table}>
                    <thead className={GlobalStyle.thead}>
                      <tr>
                        <th scope="col" className={GlobalStyle.tableHeader}>
                          DRC Name
                        </th>
                        <th scope="col" className={GlobalStyle.tableHeader}>
                          RO Count
                        </th>
                        <th scope="col" className={GlobalStyle.tableHeader}>
                          Assign Date
                        </th>
                        <th scope="col" className={GlobalStyle.tableHeader}>
                          Removed Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData1.length > 0 ? (
                        paginatedData1.map((detail, index) => (
                          <tr
                            key={index}
                            className={`${
                              index % 2 === 0
                                ? "bg-white bg-opacity-75"
                                : "bg-gray-50 bg-opacity-50"
                            } border-b`}
                          >
                            <td className={GlobalStyle.tableData}>{detail.drc_name}</td>
                            <td className={GlobalStyle.tableData}>{detail.recovery_officers.length}</td>
                            <td className={GlobalStyle.tableData}>{new Date(detail.created_dtm).toLocaleDateString()}</td>
                            <td className={GlobalStyle.tableData}>{new Date(detail.removed_dtm).toLocaleDateString()}</td>
                          </tr>
                        ))
                      ):(
                        <tr>
                          <td colSpan="4" className={GlobalStyle.tableData}>
                            No data found
                          </td>
                        </tr>
                      )
                    } 
                    </tbody>
                  </table>
                </div>
             </div>
             <div className={`${GlobalStyle.navButtonContainer} mb-14`}>
          <button
            onClick={() => handlePrevNext1("prev")}
            disabled={currentPage1 === 1}
            className={`${GlobalStyle.navButton} ${
              currentPage1 === 1 ? "cursor-not-allowed" : ""
            }`}
          >
            <FaArrowLeft />
          </button>
          <span>
            Page {currentPage1} of {totalpages1}
          </span>
          <button
            onClick={() => handlePrevNext1("next")}
            disabled={currentPage1 === totalpages1}
            className={`${GlobalStyle.navButton} ${
              currentPage1 === totalPages ? "cursor-not-allowed" : ""
            }`}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      <div className=" mt-6 mb-6">
        <h2 className={`${GlobalStyle.headingMedium} mb-5`}>
          Last Negotiation Details
        </h2>
        <div className="flex flex-col">
          <div className="flex justify-start mb-4">
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
          <div className={GlobalStyle.tableContainer}>
            <table className={GlobalStyle.table}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Date
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    DRC
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    RO
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Remark
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((detail, index) => (
                    <tr
                      key={index}
                      className={`${
                        index % 2 === 0
                          ? "bg-white bg-opacity-75"
                          : "bg-gray-50 bg-opacity-50"
                      } border-b`}
                    >
                      <td className={GlobalStyle.tableData}>{new Date (detail.created_dtm).toLocaleDateString()}</td>
                      <td className={GlobalStyle.tableData}>{detail.drc_id || " N/A "}</td>
                      <td className={GlobalStyle.tableData}>{detail.ro_id || "N/A"}</td>
                      <td className={GlobalStyle.tableData}>{detail.remark}</td>
                    </tr>
                  ))
                ):(
                  <tr>
                    <td colSpan="4" className={GlobalStyle.tableData}>
                      No data found
                    </td>
                  </tr>
                )
              } 
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${GlobalStyle.navButtonContainer} mb-14`}>
          <button
            onClick={() => handlePrevNext("prev")}
            disabled={currentPage === 1}
            className={`${GlobalStyle.navButton} ${
              currentPage === 1 ? "cursor-not-allowed" : ""
            }`}
          >
            <FaArrowLeft />
          </button>
          <span>
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
      </div>

      <div className="flex flex-col gap-4 mt-9">
        <h1 className={`${GlobalStyle.headingMedium}`}>Assign DRC</h1>
        <select 
        className={GlobalStyle.selectBox}
        value={newEntry.drc}
              onChange={(e) =>{
                const selectedDRC = drcNames.find((drc) => drc.value === e.target.value);
                setNewEntry({ ...newEntry, 
                  drckey: selectedDRC.key,
                  drc: selectedDRC.value });
              }}
        
        >
        <option value="" hidden>
                DRC
              </option>
              {drcNames.map(({ key, value }) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
        </select>
      </div>
      <div className="mt-6">
      <div className="mb-6">
        <label className={GlobalStyle.remarkTopic}>Remark</label>
        <textarea
          value={newEntry.remark}
          onChange={(e) => setNewEntry({ ...newEntry, remark: e.target.value })}
          className={`${GlobalStyle.remark}`}
          rows="5"
        ></textarea>
      </div>
      </div>

      <div className="flex items-end justify-end">
        <button className={`${GlobalStyle.buttonPrimary}`} onClick={onSubmit}>
          Submit
        </button>
      </div>

      <button className={GlobalStyle.buttonPrimary} onClick={handleonbacknuttonclick}>
         <FaArrowLeft className="mr-2" />
      </button>
    </div>
  );
}
