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
import one from "/src/assets/images/distribution/imagefor1.a.13(one).png";
import two from "/src/assets/images/distribution/imagefor1.a.13(two).png";
import three from "/src/assets/images/distribution/imagefor1.a.13(three).png";
import four from "/src/assets/images/distribution/imagefor1.a.13(four).png";
import open from "/src/assets/images/distribution/Open.png";
import Error from "/src/assets/images/distribution/Error.png";
import Inprogress from "/src/assets/images/distribution/In_Progress.png";
import Complete from "/src/assets/images/distribution/Complete.png";
import Ammend from "/src/assets/images/distribution/Ammend.png";
import Distributed from "/src/assets/images/distribution/Distributed.png";
import Manager from "/src/assets/images/distribution/Manager_Approved.png";
import Aproval from "/src/assets/images/distribution/Forward_To_Approval.png";
import Proceed from "/src/assets/images/distribution/Proceed.png";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaSearch, FaDownload } from "react-icons/fa";
import { getLoggedUserId } from "/src/services/auth/authService.js";
import {
  fetchAllArrearsBands,
  List_count_by_drc_commision_rule,
  List_Case_Distribution_DRC_Summary,
  Create_Task_For_case_distribution,
  Batch_Forward_for_Proceed,
  Validate_Existing_Batch_Task
} from "/src/services/case/CaseServices.js";
import Swal from "sweetalert2";
import { RiShareForwardFill } from "react-icons/ri";
import { IoListCircleOutline } from "react-icons/io5";
import { RiExchangeLine } from "react-icons/ri";
import { HiDotsCircleHorizontal } from "react-icons/hi";



import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";



export default function AssignPendingDRCSummary() {


  const [startDate, setStartDate] = useState(null); // usestate for start date
  const [endDate, setEndDate] = useState(null); // usestate for end date
  const [filteredData1, setFilteredData1] = useState([]); // Data fetched from API
  const [searchQuery1, setSearchQuery1] = useState(""); // For searching
  const [currentPage1, setCurrentPage1] = useState(1); // Current page for pagination
  const [disabledRows, setDisabledRows] = useState({}); // Disabled rows for buttons
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons

  const navigate = useNavigate();
  // Items per page
  const itemsPerPage1 = 4;


  // Role-Based Buttons
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      let decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        refreshAccessToken().then((newToken) => {
          if (!newToken) return;
          const newDecoded = jwtDecode(newToken);
          setUserRole(newDecoded.role);
        });
      } else {
        setUserRole(decoded.role);
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }, []);

  // Handle start date change
  const handlestartdatechange = (date) => {
    if (endDate && date > endDate) {
      Swal.fire({
        title: "warning",
        text: "From date cannot be after the To date.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
      setStartDate(null);
    } else {
      setStartDate(date);
      if (endDate) checkdatediffrence(date, endDate);
    }
  };
  // Function to Handle end date change
  const handleenddatechange = (date) => {
    if (startDate && date < startDate) {
      Swal.fire({
        title: "warning",
        text: "To date cannot be before the From date.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
      setEndDate(null);
    } else {
      if (startDate) {
        checkdatediffrence(startDate, date);
      }
      setEndDate(date);
    }
  };

  // Check the date diffrence
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
          setEndDate(null);
          // console.log("EndDate cleared");
        }
      }
      );

    }
  };

  // Handle API call
  const handleApicall = async (startDate, endDate) => {
    const userId = await getLoggedUserId();

    const payload = {
      current_arrears_band: selectedBandKey || "null",
      date_from: startDate || "null",
      date_to: endDate || "null",
      drc_commision_rule: selectedService || "null",
      Created_By: userId,
    };

    // console.log("Create Task Payload:", payload);
    try {
      const response = await Create_Task_For_case_distribution(payload);
      // console.log("Create Task Response:", response);

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

      if ((startDate && !endDate) || (!startDate && endDate)) {
        Swal.fire({
          title: "Error",
          text: "Please select both start and end dates.",
          icon: "error",
          confirmButtonColor: "#f1c40f",
        });
        return;
      }
      //console.log("Filtered Request Data:", requestdata);;

      try {
        // Send the filtered data to the backend
        // console.log("Request Data:", requestdata);
        const response = await List_Case_Distribution_DRC_Summary(requestdata);

        // console.log("API Response:", response);

        if (Array.isArray(response.data)) {
          setFilteredData1(response.data); // Store the fetched data into state
          // console.log("Filtered Data:", response.data);
        }
      } catch (error) {
        console.error("API Fetch Error:", error);
      }
    };


    await fetchData();
  };

  // Clear filters and reset state
  const clearfilters = async () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedBand("");
    setSelectedService("");
    setFilteredData1([]);

    // const fetchData = async () => {
    //   try {
    //     const response = await List_Case_Distribution_DRC_Summary({});
    //     if (Array.isArray(response)) {
    //       setFilteredData1(response); // Store the fetched data into state
    //     }
    //   } catch (error) {
    //     console.error("API Fetch Error:", error);
    //   }
    // };
    // await fetchData();

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

  //console.log("Page Data:", paginatedData1);

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
        const response = await List_count_by_drc_commision_rule();

        const data = response.data || []; // Extract the "data" array from the response
        setServices(data);
        //console.log("Services Data:", data); 

      } catch (error) {
        console.error(
          "Error fetching case count by DRC commission rule:",
          error.response?.data || error.message
        );
      }
    };
    fetchData();
  }, []);

  // Handle Arrears Band Change
  const handlearrersBandChange = (e) => {
    setSelectedBand(e.target.value);
    // console.log ("Arrears band :",e.target.value);

    const selectedkey = arrearsBands.find((band) => band.value === e.target.value);
    setSelectedBandKey(selectedkey.key);
    // console.log("Selected Band Key :",selectedkey.key);
  };


  // Handle Service Type Change
  const handlesrvicetypeChange = (e) => {
    setSelectedService(e.target.value);
    //  console.log("Service type :",e.target.value);
  };

  // The function to handle the creation of a task and notify the user
  const handlecreatetaskandletmeknow = async () => {

    if (!startDate || !endDate) {
      Swal.fire({
        title: "warning",
        text: "Please select both start and end dates.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }


    const userId = await getLoggedUserId();

    const payload = {
      current_arrears_band: selectedBandKey || "null",
      date_from: startDate || "null",
      date_to: endDate || "null",
      drc_commision_rule: selectedService || "null",
      Created_By: userId,
    };

    // console.log("Create Task Payload:", payload);
    try {
      const response = await Create_Task_For_case_distribution(payload);
      console.log("Create Task Response:", response);

      if (response.status = "success") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Task created successfully! `,
          // text: `Task created successfully! Task ID: ${response.ResponseData.data.Task_Id}`,
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

  // Function to handle forward for approval click
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
            // console.log("Selected Batch Data:", data);
            const batchSeqDetails = data?.batch_seq_details?.[0] || {};
            const distribution = batchSeqDetails?.array_of_distributions?.[0] || {};
            const payload = {
              case_distribution_batch_id: batchID,
              Proceed_by: userId,
              //plus_drc : distribution.plus_drc || "null",
              // plus_drc_id : distribution.plus_drc_id || "null",
              // minus_drc : distribution.minus_drc  || "null",
              // minus_drc_id : distribution.minus_drc_id  || "null",

            };
            // console.log("Forward for Proceed Payload:", payload);
            const response = await Batch_Forward_for_Proceed(payload);
            // console.log("Forward for Proceed Response:", response);

            Swal.fire({
              icon: "success",
              title: "Success",
              text: "Forwarded for Proceed successfully.",
              confirmButtonColor: "#28a745",
            });

            applyFilters(); // Refresh the data after forwarding

          } catch (error) {
            console.error(error)
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

  // Function to handle summary click
  const handleonsummaryclick = (batchID) => {
    navigate("/pages/Distribute/CaseDistributionDRCTransactions-1Batch", {
      state: { BatchID: batchID },
    });
    // console.log("Case Distribution batch ID:", batchID);
  };

  // Function to handle exchange click
  const handleonexchangeclick = async (batchID) => {
    try {
      const response = await Validate_Existing_Batch_Task({ case_distribution_batch_id: batchID });
      console.log("Validation Response:", response);
      console.log("Batch ID:", batchID);
      if (response.status === 200) {
        navigate("/pages/Distribute/AmendAssignedDRC", {
          state: { BatchID: batchID },
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Already has tasks with this case distribution batch id.",
          confirmButtonColor: "#f1c40f",
        });
      }
    } catch (error) {
      // console.error("Error in handleonexchangeclick:", error);
      if (error.status === 409) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Already has tasks with this case distribution batch id.",
          confirmButtonColor: "#f1c40f",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Already has tasks with this case distribution batch id.",
          confirmButtonColor: "#d33",
        });
      }
    }
    //console.log("Case Distribution batch ID:", batchID);
  };

  // Function to handle previous and next page navigation
  const handlePrevNext1 = (direction) => {
    if (direction === "prev" && currentPage1 > 1) {
      setCurrentPage1(currentPage1 - 1);
    }
    if (direction === "next" && currentPage1 < totalPages1) {
      setCurrentPage1(currentPage1 + 1);
    }
  };

  // Function to format date
  const formatDate = (isoString) => {
    return isoString ? new Date(isoString).toISOString().split("T")[0] : null;
  };

  // Function to handle full summary click
  const handleonfullsummaryclick = (batchID) => {
    navigate("/pages/Distribute/CaseDistributionDRCSummary", {
      state: { BatchID: batchID },
    });
    //  console.log("Case Distribution batch ID:", batchID);
  };
  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <h1 className={`${GlobalStyle.headingLarge}`}>Case distribution </h1>


      {/* Filter Section */}
      <div className={`${GlobalStyle.cardContainer} w-full mt-4 `}>
        <div className="flex flex-wrap justify-end items-center justify-end w-full gap-8 ">
          {/* <div className="flex   gap-8"> */}
          {" "}
          <div className="flex gap-4 h-[35px] ">
            <select
              className={`${GlobalStyle.selectBox}`}
              value={selectedBand}
              onChange={handlearrersBandChange}
              style={{ color: selectedBand === "" ? "gray" : "black" }}
            >
              <option value="" hidden>
                Arrears Band
              </option>
              {arrearsBands.map(({ key, value }) => (
                <option key={key} value={value} style={{ color: "black" }}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4 h-[35px] ">
            <select
              className={GlobalStyle.selectBox}
              value={selectedService}
              onChange={handlesrvicetypeChange}
              style={{ color: selectedService === "" ? "gray" : "black" }}
            >
              <option value="" hidden>
                Service Type
              </option>
              {services.map((service) => (
                <option key={service.drc_commision_rule} value={service.drc_commision_rule} style={{ color: "black" }}>
                  {service.drc_commision_rule}
                </option>
              ))}



            </select>
          </div>


          <label className={GlobalStyle.dataPickerDate} style={{ marginTop: '5px', display: 'block' }} >Date :  </label>

          <DatePicker
            selected={startDate}
            onChange={handlestartdatechange}
            dateFormat="dd/MM/yyyy"
            placeholderText="From"
            className={`${GlobalStyle.inputText} w-full sm:w-auto`}
          />

          <DatePicker
            selected={endDate}
            onChange={handleenddatechange}
            dateFormat="dd/MM/yyyy"
            placeholderText="To"
            className={`${GlobalStyle.inputText} w-full sm:w-auto`}
          />



          {/* <button
                onClick={applyFilters}
                className={`${GlobalStyle.buttonPrimary} h-[35px] `}
              >
                Filter
              </button> */}
          <div>
            {["admin", "superadmin", "slt"].includes(userRole) && (
              <button
                onClick={applyFilters}
                className={`${GlobalStyle.buttonPrimary} w-full h-[35px] sm:w-auto`}
              >
                Filter
              </button>
            )}
          </div>

          {/* <button className={`${GlobalStyle.buttonRemove} h-[35px] `}  onClick={clearfilters}>
                            Clear 
                        </button> */}
          <div>
            {["admin", "superadmin", "slt"].includes(userRole) && (
              <button className={`${GlobalStyle.buttonRemove} h-[35px] w-full sm:w-auto`} onClick={clearfilters}>
                Clear
              </button>
            )}
          </div>

          {/* </div> */}
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
        <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
          <table className={`${GlobalStyle.table}`}>
            <thead className={`${GlobalStyle.thead}`}>
              <tr className="border border-[#0087FF] border-opacity-15">
                <th className={GlobalStyle.tableHeader} style={{ width: "100px", fontSize: "10px" }}>Distributed Status</th>
                <th className={GlobalStyle.tableHeader} style={{ width: "80px", fontSize: "10px" }}>Case Distribution Batch ID</th>

                <th className={GlobalStyle.tableHeader} style={{ width: "75px", fontSize: "10px" }}>Action Type</th>
                <th className={GlobalStyle.tableHeader} style={{ width: "120px", fontSize: "10px" }}>DRC Commission Rule</th>
                <th className={GlobalStyle.tableHeader} style={{ width: "120px", fontSize: "10px" }}>Arrears Band (Selection Rule)</th>
                <th className={GlobalStyle.tableHeader} style={{ width: "90px", fontSize: "10px" }}>Case Count (RuleBase count)</th>
                <th className={GlobalStyle.tableHeader} style={{ width: "100px", fontSize: "10px" }}> Captured Count </th>

                {/* <th className={GlobalStyle.tableHeader} style={{ width: "100px",fontSize : "10px" }}>Approval</th> */}
                <th className={GlobalStyle.tableHeader} style={{ width: "90px", fontSize: "10px" }}>Created dtm</th>
                <th className={GlobalStyle.tableHeader} style={{ width: "80px", fontSize: "10px" }}> </th>
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
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        {item.current_batch_distribution_status === "open" && (
                          <>
                            <img data-tooltip-id={`tooltip-open-${index}`} data-tooltip-content={`Open - ${new Date(item.create_dtm).toLocaleDateString('en-GB')}`} src={open} width={20} height={15} alt="Open" />
                            <Tooltip id={`tooltip-open-${index}`} place="bottom" />
                          </>
                        )}
                        {item.current_batch_distribution_status === "batch_distributed" && (
                          <>
                            <img data-tooltip-id={`tooltip-complete-${index}`} data-tooltip-content="Batch Distributed" src={Complete} width={20} height={15} alt="Batch Distributed" />
                            <Tooltip id={`tooltip-complete-${index}`} place="bottom" />
                          </>
                        )}
                        {item.current_batch_distribution_status === "batch_rejected" && (
                          <>
                            <img data-tooltip-id={`tooltip-error-${index}`} data-tooltip-content={`Batch Rejected `} src={Error} width={20} height={15} alt="Batch Rejected" />
                            <Tooltip id={`tooltip-error-${index}`} place="bottom" />
                          </>
                        )}
                        {item.current_batch_distribution_status === "batch_forward_approval" && (
                          <>
                            <img data-tooltip-id={`tooltip-progress-${index}`} data-tooltip-content={`Open - ${new Date(item.Forward_For_Approvals_On).toLocaleDateString('en-GB')}`} src={Inprogress} width={20} height={15} alt="Batch Forward Approval" />
                            <Tooltip id={`tooltip-progress-${index}`} place="bottom" />
                          </>
                        )}
                      </div>
                    </td>
                    <td className={GlobalStyle.tableData} style={{ width: "80px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.case_distribution_id}
                    </td>

                    <td className={GlobalStyle.tableData} style={{ width: "75px", textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        {item.action_type === "distribution" && (
                          <>
                            <img data-tooltip-id={`tooltip-distribute-${index}`} data-tooltip-content="Distribution" src={Distributed} width={20} height={15} alt="Distributed" />
                            <Tooltip id={`tooltip-distribute-${index}`} place="bottom" />
                          </>
                        )}
                        {item.action_type === "Amend" && (
                          <>
                            <img data-tooltip-id={`tooltip-amend-${index}`} data-tooltip-content="Amend" src={Ammend} width={20} height={15} alt="Amend" />
                            <Tooltip id={`tooltip-amend-${index}`} place="bottom" />
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
                      {item.inspected_count}
                    </td>
                    <td className={GlobalStyle.tableData} style={{ width: "100px", textAlign: "center" }}>
                      {item.captured_count}
                    </td>

                    {/* <td className={GlobalStyle.tableData} style={{ width: "100px", textAlign: "center" }}>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" } }>
                    {item.forward_for_approvals_on && !item.approved_on && !item.proceed_on && (
                      <>
                       <img data-tooltip-id={`tooltip-forward-${index}`} data-tooltip-content={item.forward_for_approvals_on
                          ? `Forward for Approval on: ${formatDate(item.forward_for_approvals_on)}`
                          : "Forward for Approval" } 
                          src={Aproval} width={20} height={15} alt="Forward for Approval" />
                        <Tooltip id={`tooltip-forward-${index}`} place="bottom"/>
                      </>
                     
                    )}
                    {item.forward_for_approvals_on && !item.approved_on && item.proceed_on && (
                      <>
                      <img data-tooltip-id={`tooltip-proceed-${index}`} data-tooltip-content= {item.proceed_on ? `Proceeded on: ${formatDate(item.proceed_on)}` : "Proceed"}
                      src={Proceed} width={20} height={15} alt="Proceed" />
                      <Tooltip id={`tooltip-proceed-${index}`} place="bottom"/>
                      </>
                    )}
                    {item.forward_for_approvals_on && item.approved_on && item.proceed_on && (
                      <>
                      <img data-tooltip-id={`tooltip-manager-${index}`} data-tooltip-content={item.approved_on ? `Manager Approved on: ${formatDate(item.approved_on)}` : "Manager Approved" }
                       src={Manager} width={20} height={15} alt="Manager Approved" />
                      <Tooltip id={`tooltip-manager-${index}`} place="bottom"/>
                      </>
                    )}
                    </div>
                  </td> */}
                    <td className={GlobalStyle.tableData} style={{ width: "90px", whiteSpace: "nowrap" }}>
                      {new Date(item.create_dtm).toLocaleString('en-GB', {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric", // Ensures two-digit year (YY)
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true, // Keeps AM/PM format
                      })}


                    </td>

                    <td className={GlobalStyle.tableData} style={{ width: "60px", textAlign: "center" }}>
                      <button data-tooltip-id={`tooltip-summary-${index}`} onClick={() => handleonsummaryclick(item.case_distribution_id)} >
                        {/* <img src={one} width={15} height={15} alt="Summary" style={{ position: "relative", top: "4px" , right: "4px"}} /> */}
                        <HiDotsCircleHorizontal size={20} color="#0056a2" style={{ position: "relative", top: "2px", left: "2px" }} />
                      </button>
                      <Tooltip id={`tooltip-summary-${index}`} place="bottom" content="Distribution Summary" />


                      <button data-tooltip-id={`tooltip-exchange-${index}`} onClick={() => handleonexchangeclick(item.case_distribution_id)} disabled={item.current_batch_distribution_status != "open" && item.current_batch_distribution_status != "batch_forword_distribute" && item.current_batch_distribution_status != "batch_amend"} >
                        {/* <img src={two} width={15} height={12} alt="Exchange case count" style={{ position: "relative", top: "3px",   }} /> */}
                        <RiExchangeLine size={20} color="#0056a2" style={{ position: "relative", top: "2px", left: "2px" }} />
                      </button>
                      <Tooltip id={`tooltip-exchange-${index}`} place="bottom" content="Exchange case count" />


                      <button data-tooltip-id={`tooltip-full-${index}`} onClick={() => handleonfullsummaryclick(item.case_distribution_id)} disabled={item.current_batch_distribution_status === "selection_failed"} >
                        {/* <img src={three} width={15} height={15} alt="Full Summary" style={{ position: "relative", top: "3px", left: "4px" }} /> */}
                        <IoListCircleOutline size={20} color="#0056a2" style={{ position: "relative", top: "2px", left: "2px" }} />
                      </button>
                      <Tooltip id={`tooltip-full-${index}`} place="bottom" content="Distributed Full Summary" />


                      <button data-tooltip-id={`tooltip-${item.case_distribution_batch_id}`} onClick={() => handleonforwardclick(item.case_distribution_id)} disabled={item.current_batch_distribution_status != "open" && item.current_batch_distribution_status != "batch_forword_distribute" && item.current_batch_distribution_status != "batch_amend"} >
                        {/* <img
                      src={four}
                      width={15}
                      height={15}
                      alt="Forward"
                      style={{ position: "relative", top: "2px", left: "6px" }}
                    /> */}
                        < RiShareForwardFill size={20} color="#0056a2" style={{ position: "relative", top: "2px", left: "2px" }} />
                      </button>
                      <Tooltip id={`tooltip-${item.case_distribution_batch_id}`} place="bottom">
                        Forward for Approval
                      </Tooltip>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className={GlobalStyle.tableData} style={{ textAlign: 'center', verticalAlign: 'middle' }}  >No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>


      </div>

      {filteredSearchData1.length > 0 && (

        <div className={`${GlobalStyle.navButtonContainer} mb-14`}>
          <button
            onClick={() => handlePrevNext1("prev")}
            disabled={currentPage1 === 1}
            className={`${GlobalStyle.navButton} ${currentPage1 === 1 ? "cursor-not-allowed" : ""
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
            className={`${GlobalStyle.navButton} ${currentPage1 === totalPages1 ? "cursor-not-allowed" : ""
              }`}
          >
            <FaArrowRight />
          </button>
        </div>
      )}


      {/* Create Task and Let Me Know Button */}
      <div className="flex justify-end mt-4">
        {" "}
        {/* <button
          onClick={handlecreatetaskandletmeknow}
          className={`${GlobalStyle.buttonPrimary} h-[35px] mt-2 flex items-center`}
        >
          <FaDownload className="mr-2" />
          Create task and let me know
        </button> */}
        {paginatedData1.length > 0 && (
          <div>
            {["admin", "superadmin", "slt"].includes(userRole) && (
              <button
                onClick={handlecreatetaskandletmeknow}
                className={`${GlobalStyle.buttonPrimary} h-[35px] mt-2 flex items-center`}
              >
                <FaDownload className="mr-2" />
                Create task and let me know
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
