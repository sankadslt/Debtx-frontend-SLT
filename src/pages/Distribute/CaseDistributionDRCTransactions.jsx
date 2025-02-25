// Purpose: This template is used for the Case Distribution Page (1.A.13).
// Created Date: 2025-01-07
// Created By: Sanjaya Perera (sanjayaperera80@gmail.com)
// Last Modified Date: 2025-01-23
// Modified Date: 2025-01-23
// Modified By: Sanjaya Perera (sanjayaperera80@gmail.com)
// Version: node 11
// ui number : 1.A.13
// Dependencies: tailwind css
// Related Files:  app.js (routes)
// Notes:.

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import forwardtoapproval from "/src/assets/images/forwardtoapproval.png";
import managerapproved from "/src/assets/images/managerapproved.png";
import proceed from "/src/assets/images/proceed.png";
import one from "/src/assets/images/imagefor1.a.13(one).png";
import two from "/src/assets/images/imagefor1.a.13(two).png";
import three from "/src/assets/images/imagefor1.a.13(three).png";
import four from "/src/assets/images/imagefor1.a.13(four).png";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import {getLoggedUserId} from "/src/services/auth/authService.js";
import { fetchAllArrearsBands ,get_count_by_drc_commision_rule ,List_Case_Distribution_DRC_Summary, Create_Task_For_case_distribution, Batch_Forward_for_Proceed } from "/src/services/case/CaseServices.js";
import Swal from "sweetalert2";


export default function AssignPendingDRCSummary() {
  

const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);
const [filteredData1, setFilteredData1] = useState([]); // Data fetched from API
const [searchQuery1, setSearchQuery1] = useState(""); // For searching
const [currentPage1, setCurrentPage1] = useState(1);
const [disabledRows, setDisabledRows] = useState({});
const navigate = useNavigate();
// Items per page
const itemsPerPage1 = 4;

// Fetch the data and set it to filteredData1 state
const applyFilters = async () => {
  const fetchData = async () => {
    
    const requestdata = {};

    if (selectedBandKey) {
      requestdata.current_arrears_band = selectedBandKey;
    }
    if (startDate) {
      requestdata.date_from = startDate;
    }
    if (endDate) {
      requestdata.date_to = endDate;
    }
    if (selectedService) {
      requestdata.drc_commision_rule = selectedService;
    }

    console.log("Filtered Request Data:", requestdata);;

    try {
      // Send the filtered data to the backend
      const response = await List_Case_Distribution_DRC_Summary(requestdata);
      
      if (Array.isArray(response)) {
        setFilteredData1(response); // Store the fetched data into state
      }
    } catch (error) {
      console.error("API Fetch Error:", error);
    }
  };

 
  await fetchData();
};

// Search Function: Filtering data based on search query
const filteredSearchData1 = filteredData1.filter((row) =>
  Object.values(row)
    .join(" ")
    .toLowerCase()
    .includes(searchQuery1.toLowerCase())
);

// Pagination state calculation
const totalPages1 = Math.ceil(filteredSearchData1.length / itemsPerPage1);
const startIndex1 = (currentPage1 - 1) * itemsPerPage1;
const endIndex1 = startIndex1 + itemsPerPage1;
const paginatedData1 = filteredSearchData1.slice(startIndex1, endIndex1);
  const [arrearsBands, setArrearsBands] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedBand, setSelectedBand] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedBandKey, setSelectedBandKey] = useState("");

console.log("Page Data:", paginatedData1);

  useEffect(() => {
    const fetchArrearsBands = async () => {
      try {
        const bands = await fetchAllArrearsBands();
        setArrearsBands(bands);
      } catch (error) {
        console.error("Error fetching arrears bands:", error);
      }
    };
    fetchArrearsBands();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get_count_by_drc_commision_rule();
        
        const data = response.data || []; // Extract the "data" array from the response
        setServices(data); 
        
      } catch (error) {
        console.error(
          "Error fetching case count by DRC commission rule:",
          error.response?.data || error.message
        );
      }
    };
    fetchData();
  }, []);

  const handlearrersBandChange = (e) => {
    setSelectedBand(e.target.value);
    console.log ("Arrears band :",e.target.value);

    const selectedkey = arrearsBands.find((band) => band.value === e.target.value);
    setSelectedBandKey(selectedkey.key);
    console.log("Selected Band Key :",selectedkey.key);
  };

  const handlesrvicetypeChange = (e) => {
    setSelectedService(e.target.value);
    console.log("Service type :",e.target.value);
  };

 
  const handlecreatetaskandletmeknow = async () => {
    const userId = await getLoggedUserId();

    const payload = {
      current_arrears_band : selectedBandKey || "null",
      date_from : startDate || "null",
      date_to : endDate || "null",
      drc_commision_rule: selectedService || "null",
      Created_By: userId,
    };

    console.log("Create Task Payload:", payload);
   try {
      const response = await Create_Task_For_case_distribution(payload);
      console.log("Create Task Response:", response);

      if (response.status = "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Task created successfully.",
          confirmButtonColor: "#28a745",
        });
      }
      
    } catch (error) {
      console.error("Error creating task for case distribution:", error);

      const errorMessage = error.response?.data?.message || error.message || "An error occurred. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });

    }

  };
  const handleonforwardclick = (batchID) => {
    Swal.fire({
    title: "Are you sure you want to forward for Approval?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    confirmButtonColor: "#28a745",
    cancelButtonText: "No",
    cancelButtonColor: "#d33",
    }).then((result) => {
    if (result.isConfirmed) {
     
    const forwardForProceed = async () => {
    try {
      const userId = await getLoggedUserId();

      const data = paginatedData1.find((item) => item.case_distribution_batch_id === batchID);
      console.log("Selected Batch Data:", data);
      const batchSeqDetails = data?.batch_seq_details?.[0] || {};
      const distribution = batchSeqDetails?.array_of_distributions?.[0] || {};
      const payload = {
        case_distribution_batch_id: [batchID],
        Proceed_by: userId,
        plus_drc : distribution.plus_drc || "null",
        plus_drc_id : distribution.plus_drc_id || "null",
        minus_drc : distribution.minus_drc  || "null",
        minus_drc_id : distribution.minus_drc_id  || "null",
        
      };
      console.log("Forward for Proceed Payload:", payload);
      const response = await Batch_Forward_for_Proceed(payload);
      console.log("Forward for Proceed Response:", response);
      
    } catch (error){
      console.error (error)
      const errorMessage = error.response?.data?.message || error.message || "An error occurred. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
     
    }
  };
  forwardForProceed();
  }
  });
  };

  const handleonsummaryclick = (batchID) => {
    navigate("/pages/Distribute/CaseDistributionDRCTransactions-1Batch", {
      state: { BatchID: batchID },
    });
    console.log("Case Distribution batch ID:", batchID);
};

  const handleonexchangeclick = (batchID) => {
    navigate("/pages/Distribute/AmendAssignedDRC", { 
      state: { BatchID: batchID },
    });
    console.log("Case Distribution batch ID:", batchID);
};
  const handlePrevNext1 = (direction) => {
    if (direction === "prev" && currentPage1 > 1) {
      setCurrentPage1(currentPage1 - 1);
    }
    if (direction === "next" && currentPage1 < totalPages1) {
      setCurrentPage1(currentPage1 + 1);
    }
  };

  
  const formatDate = (isoString) => {
    return isoString ? new Date(isoString).toISOString().split("T")[0] : null;
  };
  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <h1 className={`${GlobalStyle.headingLarge}`}>Case distribution</h1>
      

      {/* Filter Section */}
      <div className="flex justify-between gap-10 mt-16 mb-5">
        <div className="flex gap-10">
          {" "}
          <div className="flex gap-4 h-[35px] mt-2">
            <select
             className={`${GlobalStyle.selectBox}`}
              value={selectedBand}
              onChange={handlearrersBandChange}
            
            >
              <option value="" hidden>
                Arrears Band
              </option>
              {arrearsBands.map(({ key, value }) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4 h-[35px] mt-2">
            <select
              className={GlobalStyle.selectBox}
              value={selectedService}
              onChange={handlesrvicetypeChange}
            >
              <option value="" hidden>
                Service Type
              </option>
              {services.map((service) => (  
                <option key={service.drc_commision_rule} value={service.drc_commision_rule}>
                  {service.drc_commision_rule}
                </option>
              ))}


              
            </select>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className={GlobalStyle.datePickerContainer}>
              <label className={GlobalStyle.dataPickerDate}>Date </label>

              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className={GlobalStyle.inputText}
              />

              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className={GlobalStyle.inputText}
              />
            </div>
          </div>
          <button
            onClick={applyFilters}
            className={`${GlobalStyle.buttonPrimary} h-[35px] mt-2`}
          >
            Filter
          </button>
        </div>
      </div>

      {/* Table*/}
      <div className="flex flex-col">
        <div>
          {" "}
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
        </div>
        <div className={`${GlobalStyle.tableContainer}`}>
        <table className={`${GlobalStyle.table}`}>
          <thead className={`${GlobalStyle.thead}`}>
            <tr className="border border-[#0087FF] border-opacity-15">
            <th className={GlobalStyle.tableHeader} style={{ width: "100px",fontSize : "10px" }}>Distributed Status</th>
              <th className={GlobalStyle.tableHeader} style={{ width: "80px", fontSize : "10px" }}>Case Distribution Batch ID</th>
              <th className={GlobalStyle.tableHeader} style={{ width: "90px", fontSize : "10px" }}>Created dtm</th>
              <th className={GlobalStyle.tableHeader} style={{ width: "75px", fontSize : "10px" }}>Action Type</th>
              <th className={GlobalStyle.tableHeader} style={{ width: "120px", fontSize : "10px" }}>DRC Commission Rule</th>
              <th className={GlobalStyle.tableHeader} style={{ width: "120px",fontSize : "10px" }}>Arrears Band (Selection Rule)</th>
              <th className={GlobalStyle.tableHeader} style={{ width: "90px", fontSize : "10px" }}>Case Count (RuleBase count)</th>
              {/* <th className={GlobalStyle.tableHeader} style={{ width: "100px",fontSize : "10px"}}>Total Arrears </th> */}
              
              <th className={GlobalStyle.tableHeader} style={{ width: "100px",fontSize : "10px" }}>Approval</th>
              <th className={GlobalStyle.tableHeader} style={{ width: "60px",fontSize : "10px" }}></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData1.length > 0 ? (
              
              paginatedData1.map((item, index) => (
                
                <tr key={index} 
                  className={index % 2 === 0 ? 
                  GlobalStyle.tableRowEven : 
                  GlobalStyle.tableRowOdd}>
                  <td className={GlobalStyle.tableData} style={{ width: "100px", textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" } }>
                    {item.status?.[0]?.crd_distribution_status === "Open" && (
                      <>
                      <img data-tooltip-id={`tooltip-open-${index}`} data-tooltip-content="Open" src="/src/assets/images/open.png" width={20} height={15} alt="Open"  />
                      <Tooltip id={`tooltip-open-${index}`} place="top"/>
                      </>
                    )}
                    {item.status?.[0]?.crd_distribution_status === "Complete" && (
                      <>
                      <img data-tooltip-id={`tooltip-complete-${index}`} data-tooltip-content="Complete" src="/src/assets/images/complete.png" width={20} height={15} alt="Complete" />
                      <Tooltip id={`tooltip-complete-${index}`} place="top"/>
                      </>
                    )}
                    {item.status?.[0]?.crd_distribution_status === "Error" && (
                      <>
                      <img data-tooltip-id={`tooltip-error-${index}`} data-tooltip-content="Error" src="/src/assets/images/error.png" width={20} height={15} alt="Error" />
                      <Tooltip id={`tooltip-error-${index}`} place="top"/>
                      </>
                    )}
                    {item.status?.[0]?.crd_distribution_status === "InProgress" && (
                      <>
                      <img data-tooltip-id={`tooltip-progress-${index}`} data-tooltip-content="InProgress" src="/src/assets/images/inprogress.png" width={20} height={15} alt="InProgress" />
                      <Tooltip id={`tooltip-progress-${index}`} place="top"/>
                      </>
                    )}
                    </div>
                  </td>
                  <td className={GlobalStyle.tableData} style={{ width: "80px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.case_distribution_batch_id}
                  </td>
                  <td className={GlobalStyle.tableData} style={{ width: "90px", whiteSpace: "nowrap" }}>
                    {new Date(item.created_dtm).toLocaleDateString()}
                  </td>
                  <td className={GlobalStyle.tableData} style={{ width: "75px", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" } }>
                    {item.batch_seq_details?.[0]?.action_type === "distribution" && (
                      <>
                      <img  data-tooltip-id={`tooltip-distribute-${index}`} data-tooltip-content="Distributed" src="/src/assets/images/distributed.png" width={20} height={15} alt="Distributed" />
                      <Tooltip id={`tooltip-distribute-${index}`} place="top"/>
                      </>
                    )}
                    {item.batch_seq_details?.[0]?.action_type === "amend" && (
                      <>
                      <img  data-tooltip-id={`tooltip-amend-${index}`} data-tooltip-content="Amend" src="/src/assets/images/amend.png" width={20} height={15} alt="Amend" />
                      <Tooltip id={`tooltip-amend-${index}`} place="top"/>
                      </>
                     
                    )}
                    </div>
                  </td>
                  <td className={GlobalStyle.tableData} style={{ width: "120px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.drc_commision_rule}
                  </td>
                  <td className={GlobalStyle.tableData} style={{ width: "120px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.current_arrears_band}
                  </td>
                  <td className={GlobalStyle.tableData} style={{ width: "90px", textAlign: "center" }}>
                    {item.rulebase_count}
                  </td>
                  {/* <td className={GlobalStyle.tableData} style={{ width: "100px", textAlign: "center" }}>
                    {item.rulebase_arrears_sum}
                  </td> */}
                  
                  <td className={GlobalStyle.tableData} style={{ width: "100px", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" } }>
                    {item.forward_for_approvals_on && !item.approved_on && !item.proceed_on && (
                      <>
                       <img data-tooltip-id={`tooltip-forward-${index}`} data-tooltip-content={item.forward_for_approvals_on
                          ? `Forward for Approval on: ${formatDate(item.forward_for_approvals_on)}`
                          : "Forward for Approval" } 
                          src={forwardtoapproval} width={20} height={15} alt="Forward for Approval" />
                        <Tooltip id={`tooltip-forward-${index}`} place="top"/>
                      </>
                     
                    )}
                    {item.forward_for_approvals_on && !item.approved_on && item.proceed_on && (
                      <>
                      <img data-tooltip-id={`tooltip-proceed-${index}`} data-tooltip-content= {item.proceed_on ? `Proceeded on: ${formatDate(item.proceed_on)}` : "Proceed"}
                      src={proceed} width={20} height={15} alt="Proceed" />
                      <Tooltip id={`tooltip-proceed-${index}`} place="top"/>
                      </>
                    )}
                    {item.forward_for_approvals_on && item.approved_on && item.proceed_on && (
                      <>
                      <img data-tooltip-id={`tooltip-manager-${index}`} data-tooltip-content={item.approved_on ? `Manager Approved on: ${formatDate(item.approved_on)}` : "Manager Approved" }
                       src={managerapproved} width={20} height={15} alt="Manager Approved" />
                      <Tooltip id={`tooltip-manager-${index}`} place="top"/>
                      </>
                    )}
                    </div>
                  </td>
                  <td className={GlobalStyle.tableData} style={{ width: "60px", textAlign: "center" }}>
                    <button data-tooltip-id= {`tooltip-summary-${index}`} onClick={() => handleonsummaryclick(item.case_distribution_batch_id)} >
                    <img src={one} width={15} height={15} alt="Summary" style={{ position: "relative", top: "4px" , right: "2px"}} />
                    </button>
                    <Tooltip id={`tooltip-summary-${index}`} place="top" content="Distribution Summary"/>


                    <button data-tooltip-id={`tooltip-exchange-${index}`} onClick={() => handleonexchangeclick(item.case_distribution_batch_id)} disabled= {!!item.forward_for_approvals_on }>
                    <img src={two} width={15} height={12} alt="Exchange case count" style={{ position: "relative", top: "3px",   }} />
                    </button>
                    <Tooltip id={`tooltip-exchange-${index}`} place="top" content="Exchange case count"/>


                    <button data-tooltip-id={`tooltip-full-${index}`} >
                    <img src={three} width={15} height={15} alt="Full Summary" style={{ position: "relative", top: "3px", left: "2px" }} />
                    </button>
                    <Tooltip id={`tooltip-full-${index}`} place="top" content="Distributed Full Summary"/>


                    <button data-tooltip-id={`tooltip-${item.case_distribution_batch_id}`} onClick={() => handleonforwardclick(item.case_distribution_batch_id)} disabled={!!item.forward_for_approvals_on}>
                    <img
                      src={four}
                      width={15}
                      height={15}
                      alt="Forward"
                      style={{ position: "relative", top: "2px", left: "3px" }}
                    />
                  </button>
                  <Tooltip id={`tooltip-${item.case_distribution_batch_id}`} place="top">
                    Forward for Approval
                  </Tooltip>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className= {GlobalStyle.tableData}>No data available</td>
              </tr>
            )}
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
          Page {currentPage1} of {totalPages1}
        </span>
        <button
          onClick={() => handlePrevNext1("next")}
          disabled={currentPage1 === totalPages1}
          className={`${GlobalStyle.navButton} ${
            currentPage1 === totalPages1 ? "cursor-not-allowed" : ""
          }`}
        >
          <FaArrowRight />
        </button>
      </div>

      <div className="flex justify-end">
        {" "}
        <button
          onClick={handlecreatetaskandletmeknow}
          className={`${GlobalStyle.buttonPrimary} h-[35px] mt-2`}
        >
          Create task and let me know
        </button>
      </div>
    </div>
  );
}
