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
import open from "/src/assets/images/Remastered/Open.png";
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

import Batch_Ammend from "/src/assets/images/Remastered/Batch_Ammend.png";
import Batch_Approved from "/src/assets/images/Remastered/Batch_Approved.png";
import Batch_Distributed from "/src/assets/images/Remastered/Batch_Distributed.png";
import Batch_Forward_Approved from "/src/assets/images/Remastered/Batch_Forward_Approved.png";
import batch_forword_distribute from "/src/assets/images/Remastered/batch_forword_distribute.png";
import Batch_Rejected from "/src/assets/images/Remastered/Batch_Rejected.png";
import Rejected_Batch_Distributed from "/src/assets/images/Remastered/Rejected_Batch_Distributed.png";
import Selection_Failed from "/src/assets/images/Remastered/Selection_Failed.png";


export default function AssignPendingDRCSummary() {


  const [startDate, setStartDate] = useState(null); // usestate for start date
  const [endDate, setEndDate] = useState(null); // usestate for end date
  const [filteredData1, setFilteredData1] = useState([]); // Data fetched from API
  const [searchQuery1, setSearchQuery1] = useState(""); // For searching
  const [currentPage1, setCurrentPage1] = useState(1); // Current page for pagination
  const [disabledRows, setDisabledRows] = useState({}); // Disabled rows for buttons
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons
  const [isLoading, setIsLoading] = useState(false); // Loading state for data fetching
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true); // To check if more data is available for pagination
  const [maxCurrentPage, setMaxCurrentPage] = useState(0); // To track the maximum current page
  const [committedFilters, setCommittedFilters] = useState({
    selectedBandKey: "",
    startDate: null,
    endDate: null,
    selectedService: "",
  }); // To store committed filters for pagination
  const navigate = useNavigate();
  // Items per page
  const itemsPerPage1 = 10;
  const [arrearsBands, setArrearsBands] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedBand, setSelectedBand] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedBandKey, setSelectedBandKey] = useState("");


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
      // if (endDate) checkdatediffrence(date, endDate);
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
      // if (startDate) {
      //   checkdatediffrence(startDate, date);
      // }
      setEndDate(date);
    }
  };

  // Check the date diffrence
  // const checkdatediffrence = (startDate, endDate) => {
  //   const start = new Date(startDate).getTime();
  //   const end = new Date(endDate).getTime();
  //   const diffInMs = end - start;
  //   const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  //   const diffInMonths = diffInDays / 30;
  //   if (diffInMonths > 1) {
  //     Swal.fire({
  //       title: "Date Range Exceeded",
  //       text: "The selected dates have more than a 1-month gap. Do you want to proceed?",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonText: "Yes",
  //       confirmButtonColor: "#28a745",
  //       cancelButtonText: "No",
  //       cancelButtonColor: "#d33",
  //     }).then((result) => {
  //       if (result.isConfirmed) {

  //         endDate = endDate;
  //         handleApicall(startDate, endDate);
  //       } else {
  //         setEndDate(null);
  //         // console.log("EndDate cleared");
  //       }
  //     }
  //     );

  //   }
  // };

  // Handle API call
  // const handleApicall = async (startDate, endDate) => {
  //   const userId = await getLoggedUserId();

  //   const payload = {
  //     current_arrears_band: selectedBandKey || "null",
  //     date_from: startDate || "null",
  //     date_to: endDate || "null",
  //     drc_commision_rule: selectedService || "null",
  //     Created_By: userId,
  //   };

  //   setIsLoading(true); // Set loading state to true
  //   // console.log("Create Task Payload:", payload);
  //   try {
  //     const response = await Create_Task_For_case_distribution(payload);
  //     setIsLoading(false); // Set loading state to false
  //     // console.log("Create Task Response:", response);

  //     if (response.status = "success") {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Task created successfully!",
  //         text: "Task ID: " + response.data.data.Task_Id,
  //         confirmButtonColor: "#28a745",
  //       });
  //     }

  //   } catch (error) {
  //     console.error("Error creating task for case distribution:", error);

  //     const errorMessage = error.response?.data?.message || error.message || "An error occurred. Please try again.";
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: errorMessage,
  //       confirmButtonColor: "#d33",
  //     });

  //   } finally {
  //     setIsLoading(false); // Set loading state to false after API call
  //   }

  // };

  const fetchDataAPI = async (filters) => {
    const payload = {
      current_arrears_band: filters.selectedBandKey,
      date_from: filters.startDate,
      date_to: filters.endDate,
      drc_commision_rule: filters.selectedService,
      pages: filters.currentPage1,
    }

    if ((startDate && !endDate) || (!startDate && endDate)) {
      Swal.fire({
        title: "Warning",
        text: "Please select both start and end dates.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }
    //console.log("Filtered Request Data:", requestdata);;
    setIsLoading(true); // Set loading state to true
    try {
      // Send the filtered data to the backend
      // console.log("Request Data:", requestdata);
      console.log("Request Data:", payload);
      const response = await List_Case_Distribution_DRC_Summary(payload);
      setIsLoading(false); // Set loading state to false

      console.log("API Response:", response);

      // if (Array.isArray(response.data)) {
      //   if (response.data.length === 0) {
      //     Swal.fire({
      //       title: "Warning",
      //       text: "No matching data found for the selected filters.",
      //       icon: "warning",
      //       confirmButtonColor: "#f1c40f",
      //     });
      //   } else {
      //     setFilteredData1(response.data); // Store the fetched data into state
      //   }
      //   // console.log("Filtered Data:", response.data);
      // }
      // Updated response handling
      if (response && response.data) {
        // console.log("Valid data received:", response.data);
        if (currentPage1 === 1) {
          setFilteredData1(response.data)
        } else {
          setFilteredData1((prevData) => [...prevData, ...response.data]);
        }

        if (response.data.length === 0) {
          setIsMoreDataAvailable(false); // No more data available
          if (currentPage1 === 1) {
            Swal.fire({
              title: "No Results",
              text: "No matching data found for the selected filters.",
              icon: "warning",
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonColor: "#f1c40f"
            });
          } else if (currentPage1 === 2) {
            setCurrentPage1(1); // Reset to page 1 if no data found on page 2
          }
        } else {
          const maxData = currentPage1 === 1 ? 10 : 30;
          if (response.data.length < maxData) {
            setIsMoreDataAvailable(false); // More data available
          }
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "No valid Settlement data found in response.",
          icon: "error",
          confirmButtonColor: "#d33"
        });
        setFilteredData1([]);
      }
    } catch (error) {
      console.error("API Fetch Error:", error);
    } finally {
      setIsLoading(false); // Set loading state to false after API call
    }
  };

  useEffect(() => {
    if (isMoreDataAvailable && currentPage1 > maxCurrentPage) {
      setMaxCurrentPage(currentPage1); // Update max current page
      // callAPI(); // Call the function whenever currentPage changes
      fetchDataAPI({
        ...committedFilters,
        currentPage1: currentPage1
      });
    }
  }, [currentPage1]);

  // Fetch the data and set it to filteredData1 state
  const applyFilters = async () => {
    setCurrentPage1(1); // Reset to first page on filter apply
    setIsMoreDataAvailable(true); // Reset more data available state
    setMaxCurrentPage(0); // Reset max current page

    if (!startDate && !endDate && !selectedBandKey && !selectedService) {
      Swal.fire({
        title: "Warning",
        text: "Please select at least one filter.",
        icon: "warning",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }
    setFilteredData1([]); // Clear previous data
    setSearchQuery1(""); // Clear search query
    setCommittedFilters({
      selectedBandKey: selectedBandKey,
      startDate: startDate,
      endDate: endDate,
      selectedService: selectedService,
    }); // Reset committed filters
    if (currentPage1 === 1) {
      fetchDataAPI({
        startDate: startDate,
        endDate: endDate,
        selectedBandKey: selectedBandKey,
        selectedService: selectedService,
        currentPage1: 1,
      }); // Fetch data with current filters
    } else {
      setCurrentPage1(1); // Reset to first page if filters are applied
    }
  };

  // Clear filters and reset state
  const clearfilters = async () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedBandKey("");
    setSelectedBand("");
    setSelectedService("");
    setFilteredData1([]);
    setIsMoreDataAvailable(true); // Reset more data available state
    setMaxCurrentPage(0); // Reset max current page
    setSearchQuery1(""); // Clear search query
    setCommittedFilters({
      selectedBandKey: "",
      startDate: null,
      endDate: null,
      selectedService: "",
    })
    if (currentPage1 != 1) {
      setCurrentPage1(1); // Reset to page 1
    } else {
      setCurrentPage1(0); // Temp set to 0
      setTimeout(() => setCurrentPage1(1), 0); // Reset to 1 after
    }

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
    setSelectedBandKey(e.target.value);
    // console.log ("Arrears band :",e.target.value);

    // const selectedkey = arrearsBands.find((band) => band.value === e.target.value);
    // setSelectedBandKey(selectedkey.key);
    // console.log("Selected Band Key :",selectedkey.key);
  };

  const displayArrearsBand = (key) => {
    const selectedBand = arrearsBands.find((band) => band.key === key);
    return selectedBand;
  }


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
          title: "Task created successfully!",
          text: "Task ID: " + response.data.data.Task_Id,
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
            const areThereAnyTasks = await Validate_Existing_Batch_Task(batchID);

            if (areThereAnyTasks.status === 200) {

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
                allowOutsideClick: false,
                allowEscapeKey: false,
              }).then((result) => {
                if (result.isConfirmed) {
                  // Reload the data when user clicks OK
                  if (currentPage1 === 1) {
                    fetchDataAPI({
                      ...committedFilters,
                      currentPage1: 1
                    });
                  } else {
                    setCurrentPage1(1);
                  }
                }
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
            console.error(error);
            if (error.status === 409) {
              Swal.fire({
                icon: "warning",
                title: "Warning",
                text: "Already has tasks with this case distribution batch id.",
                confirmButtonColor: "#f1c40f",
              });
            } else {
              const errorMessage = error.response?.data?.message || error.message || "An error occurred. Please try again.";
              Swal.fire({
                icon: "error",
                title: "Error",
                text: errorMessage,
                confirmButtonColor: "#d33",
              });
            }
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
      const response = await Validate_Existing_Batch_Task(batchID);
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
    if (direction === "next") {
      if (isMoreDataAvailable) {
        setCurrentPage1(currentPage1 + 1);
      } else {
        if (currentPage1 < Math.ceil(filteredData1.length / itemsPerPage1)) {
          setCurrentPage1(currentPage1 + 1);
        }
      }
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <h1 className={`${GlobalStyle.headingLarge}`}>DRC Transactions</h1>


      {/* Filter Section */}
      <div className="flex justify-end">
        <div className="w-[1110px] sm:w-[100%] md:w-[1110px]">
          <div className={`${GlobalStyle.cardContainer} w-full mt-4 `}>
            <div className="flex flex-wrap justify-end items-center justify-end w-full gap-4 ">
              {/* <div className="flex   gap-8"> */}
              {" "}
              <div className="flex gap-4 h-[35px] ">
                <select
                  className={`${GlobalStyle.selectBox}`}
                  value={selectedBandKey}
                  onChange={handlearrersBandChange}
                  style={{ color: selectedBandKey === "" ? "gray" : "black" }}
                >
                  <option value="" hidden>
                    Arrears Band
                  </option>
                  {arrearsBands.map(({ key, value }) => (
                    <option key={key} value={key} style={{ color: "black" }}>
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
                onChange={(e) => {
                  setCurrentPage1(1); // Reset to first page on search
                  setSearchQuery1(e.target.value)
                }}
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
                        {item.current_batch_distribution_status === "Open" && (
                          <>
                            <img data-tooltip-id={`tooltip-open-${index}`} data-tooltip-content={`Open - ${new Date(item.create_dtm).toLocaleDateString('en-GB')}`} src={open} width={20} height={15} alt="Open" />
                            <Tooltip id={`tooltip-open-${index}`} place="bottom" />
                          </>
                        )}
                        {item.current_batch_distribution_status === "batch_forword_distribute" && (
                          <>
                            <img data-tooltip-id={`tooltip-batch-forword-distribute-${index}`} data-tooltip-content="Batch Forward Distribute" src={batch_forword_distribute} width={20} height={15} alt="Batch Forword Distribute" />
                            <Tooltip id={`tooltip-batch-forword-distribute-${index}`} place="bottom" />
                          </>
                        )}
                        {item.current_batch_distribution_status === "batch_amend" && (
                          <>
                            <img data-tooltip-id={`tooltip-batch-amend-${index}`} data-tooltip-content="Batch Amend" src={Batch_Ammend} width={20} height={15} alt="Batch Amend" />
                            <Tooltip id={`tooltip-batch-amend-${index}`} place="bottom" />
                          </>
                        )}
                        {item.current_batch_distribution_status === "batch_approved" && (
                          <>
                            <img data-tooltip-id={`tooltip-batch-approved-${index}`} data-tooltip-content="Batch Approved" src={Batch_Approved} width={20} height={15} alt="Batch Approved" />
                            <Tooltip id={`tooltip-batch-approved-${index}`} place="bottom" />
                          </>
                        )}
                        {item.current_batch_distribution_status === "batch_distributed" && (
                          <>
                            <img data-tooltip-id={`tooltip-batch-distributed-${index}`} data-tooltip-content="Batch Distributed" src={Batch_Distributed} width={20} height={15} alt="Batch Distributed" />
                            <Tooltip id={`tooltip-batch-distributed-${index}`} place="bottom" />
                          </>
                        )}
                        {item.current_batch_distribution_status === "batch_rejected" && (
                          <>
                            <img data-tooltip-id={`tooltip-batch-rejected-${index}`} data-tooltip-content={`Batch Rejected `} src={Batch_Rejected} width={20} height={15} alt="Batch Rejected" />
                            <Tooltip id={`tooltip-batch-rejected-${index}`} place="bottom" />
                          </>
                        )}
                        {item.current_batch_distribution_status === "batch_forword_approval" && (
                          <>
                            <img data-tooltip-id={`tooltip-progress-${index}`} data-tooltip-content={`Batch Forword Approval`} src={Batch_Forward_Approved} width={20} height={15} alt="Batch Forward Approval" />
                            <Tooltip id={`tooltip-progress-${index}`} place="bottom" />
                          </>
                        )}
                        {item.current_batch_distribution_status === "selection_failed" && (
                          <>
                            <img data-tooltip-id={`tooltip-selection-failed-${index}`} data-tooltip-content={`Selection_Failed`} src={Selection_Failed} width={20} height={15} alt="Selection_Failed" />
                            <Tooltip id={`tooltip-selection-failed-${index}`} place="bottom" />
                          </>
                        )}
                        {item.current_batch_distribution_status === "rejected_batch_distributed" && (
                          <>
                            <img data-tooltip-id={`tooltip-rejected-batch-distributed-${index}`} data-tooltip-content={`Rejected Batch Distributed`} src={Rejected_Batch_Distributed} width={20} height={15} alt="Rejected Batch Distributed" />
                            <Tooltip id={`tooltip-rejected-batch-distributed-${index}`} place="bottom" />
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
                        {item.action_type === "amend" && (
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
                      {displayArrearsBand(item.current_arrears_band)?.value}
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
                      {item.create_dtm && !isNaN(new Date(item.create_dtm)) &&
                        new Date(item.create_dtm).toLocaleString('en-GB', {
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


                      <button data-tooltip-id={`tooltip-exchange-${index}`}
                        onClick={() => handleonexchangeclick(item.case_distribution_id)}
                        disabled={
                          item.current_batch_distribution_status != "Open" &&
                          item.current_batch_distribution_status != "batch_forword_distribute" &&
                          item.current_batch_distribution_status != "batch_amend"
                        }
                        className={`${item.current_batch_distribution_status != "Open" &&
                          item.current_batch_distribution_status != "batch_forword_distribute" &&
                          item.current_batch_distribution_status != "batch_amend" ? "cursor-not-allowed opacity-50" : ""}`}
                      >
                        {/* <img src={two} width={15} height={12} alt="Exchange case count" style={{ position: "relative", top: "3px",   }} /> */}
                        <RiExchangeLine size={20} color="#0056a2" style={{ position: "relative", top: "2px", left: "2px" }} />
                      </button>
                      <Tooltip id={`tooltip-exchange-${index}`} place="bottom" content="Exchange case count" />


                      <button data-tooltip-id={`tooltip-full-${index}`}
                        onClick={() => handleonfullsummaryclick(item.case_distribution_id)}
                        disabled={item.current_batch_distribution_status === "selection_failed"}
                        className={`${item.current_batch_distribution_status === "selection_failed" ? "cursor-not-allowed opacity-50" : ""}`}
                      >
                        {/* <img src={three} width={15} height={15} alt="Full Summary" style={{ position: "relative", top: "3px", left: "4px" }} /> */}
                        <IoListCircleOutline size={20} color="#0056a2" style={{ position: "relative", top: "2px", left: "2px" }} />
                      </button>
                      <Tooltip id={`tooltip-full-${index}`} place="bottom" content="Distributed Full Summary" />


                      <button data-tooltip-id={`tooltip-${item.case_distribution_batch_id}`}
                        onClick={() => handleonforwardclick(item.case_distribution_id)}
                        disabled={
                          item.current_batch_distribution_status != "Open" &&
                          item.current_batch_distribution_status != "batch_forword_distribute" &&
                          item.current_batch_distribution_status != "batch_amend"
                        }
                        className={`${item.current_batch_distribution_status != "Open" &&
                          item.current_batch_distribution_status != "batch_forword_distribute" &&
                          item.current_batch_distribution_status != "batch_amend" ? "cursor-not-allowed opacity-50" : ""}`}
                      >
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
            className={`${GlobalStyle.navButton} ${currentPage1 === 1 ? "cursor-not-allowed opacity-50" : ""
              }`}
          >
            <FaArrowLeft />
          </button>
          <span>
            Page {currentPage1}
          </span>
          <button
            onClick={() => handlePrevNext1("next")}
            disabled={
              searchQuery1
                ? currentPage1 >= Math.ceil(filteredSearchData1.length / itemsPerPage1)
                : currentPage1 >= Math.ceil(filteredSearchData1.length / itemsPerPage1) && !isMoreDataAvailable
            }
            className={`${GlobalStyle.navButton} ${searchQuery1
              ? currentPage1 >= Math.ceil(filteredSearchData1.length / itemsPerPage1)
              : currentPage1 >= Math.ceil(filteredSearchData1.length / itemsPerPage1) && !isMoreDataAvailable
                ? "cursor-not-allowed opacity-50" : ""
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
