// Purpose: This  is the Additional Request Log page.
// Created Date: 2025-01-07
// Created By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
// Last Modified Date: 2025-01-09
// Modified By: Buthmi Mithara Abeysena (buthmimithara1234@gmail.com)
// Version: node 22.2.0
// ui number : v2.10
// Dependencies: tailwind css
// Notes :

import { useState, useEffect } from "react";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import {
  ListRequestLogFromRecoveryOfficers,
  ListAllRequestLogFromRecoveryOfficers,
  Create_task_for_Request_log_download_when_select_more_than_one_month,
} from "../../services/request/request.js";
import { Active_DRC_Details } from "/src/services/drc/Drc.js";
import { getLoggedUserId } from "/src/services/auth/authService.js";
import Swal from "sweetalert2";

const RecoveryOfficerRequests = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [requestType, setRequestType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [approved, setApproved] = useState("");
  const [requestsData, setRequestsData] = useState([]);
  const [count, setcount] = useState(0);
  const [allRequestsData, setAllRequestsData] = useState([]);
  const [drcNames, setDrcNames] = useState([]);
  const [selectedBand, setSelectedBand] = useState("");
  const [firstRequestCount, setFirstRequestCount] = useState(0);
  const navigate = useNavigate();
  const rowsPerPage = 7;
  console.log("Selected DRC:", selectedBand);

  // useEffect(() => {
  //   const fetchcases = async () => {
  //     try {
  //       const userId = await getLoggedUserId();
  //       const payload = {
  //         delegate_user_id: userId,
  //       };
  //       console.log("Payload for fetching cases:", payload);
  //       const response = await ListRequestLogFromRecoveryOfficers(payload);
  //       console.log(response);
  //       const lastTwoRecords = response.slice(-10).reverse();
  //       const firstRequestCount =
  //         response.length > 0 ? response[0].Request_Count : 0;
  //       console.log("First request count:", firstRequestCount);
  //       console.log("Last two records:", lastTwoRecords);
  //       setRequestsData(lastTwoRecords);
  //       setFirstRequestCount(firstRequestCount);
  //     } catch (error) {
  //       console.error(error);
  //       setRequestsData([]);
  //     }
  //   };
  //   fetchcases();
  // }, []);

  console.log("Selected request type:", requestType);
  console.log("Selected approved:", approved);


  //  const handleFromDateChange = (date) => {
  //         if (toDate && date > toDate) {
  //             Swal.fire({
  //                 title: "Error",
  //                 text: "From date cannot be after the To date.",
  //                 icon: "error",
  //                 confirmButtonColor: "#f1c40f", 
  //             });
  //         } else if (toDate) {
  //             // Calculate month gap
  //             const diffInMs = toDate - date;
  //             const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
              
  //             if (diffInDays > 31) {
  //                 Swal.fire({
  //                     title: "Warning",
  //                     text: "The selected range is more than 1 month.",
  //                     icon: "warning",
  //                     confirmButtonColor: "#f1c40f",
  //                 });
                  
  //                 return;
  //             }
  //             setFromDate(date);
  //         } else {
  //             setFromDate(date);
              
  //         }
          
  //     };


   //fetch all drc names
  useEffect(() => {
    const fetchDRCNames = async () => {
      try {
        const Names = await Active_DRC_Details();
        setDrcNames(Names);
        console.log("Fetched DRC Names:", Names);
        
      } catch (error) {
        console.error("Error fetching drc names:", error);
      }
    };
    fetchDRCNames();
  }, []);

  // validation for date
  const handleFromDateChange = (date) => {
    if (toDate && date > toDate) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Start date cannot be later than end date.",
        confirmButtonColor: "#f1c40f",
      });
    } else if (toDate) {
      // Calculate month gap
      const diffInMs = toDate - date;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      if (diffInDays > 31) {
        Swal.fire({
          title: "Warning",
          text: "The selected range is more than 1 month.",
          icon: "warning",
          confirmButtonColor: "#f1c40f",
        });
        return;
      }
      setFromDate(date);
    } else {
      setFromDate(date);
    }
  };
      

  // validation for date
  const handleToDateChange = (date) => {
    if (fromDate && date < fromDate) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "End date cannot be earlier than start date.",
        confirmButtonColor: "#f1c40f",
      });
    } else if (fromDate) {
      // Calculate month gap
      const diffInMs = date - fromDate;
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
      if (diffInDays > 31) {
        Swal.fire({
          title: "Warning",
          text: "The selected range is more than 1 month.",
          icon: "warning",
          confirmButtonColor: "#f1c40f",
        });
        return;
      }
      setToDate(date);
    } else {
      setToDate(date);
    }
  };

  // const CheckDateDifference = (startDate, endDate) => {
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
  //         setToDate(null); // Clear the end date if the user chooses not to proceed
  //         console.log("EndDate cleared");
  //       }
  //     });
  //   }
  // };

  // const handleApicall = async (startDate, endDate) => {
  //   const userId = await getLoggedUserId();
  //   console.log("User ID:", userId);
  //   const payload = {
  //     delegate_user_id: userId,
  //     User_Interaction_Type: requestType,
  //     "Request Accept": approved,
  //     date_from: startDate,
  //     date_to: endDate,
  //     Created_By: userId,
  //   };
  //   console.log("Payload for date download:", payload);
  //   try {
  //     const response =
  //       await Create_task_for_Request_log_download_when_select_more_than_one_month(
  //         payload
  //       );
  //     console.log("Response for date download:", response);

  //     Swal.fire({
  //       icon: "success",
  //       title: "Success",
  //       text: "Data sent successfully.",
  //       confirmButtonColor: "#28a745",
  //     });
  //     setFromDate(null);
  //     setToDate(null);
  //   } catch (error) {
  //     console.error("Error in sending the data:", error);

  //     const errorMessage =
  //       error?.response?.data?.message ||
  //       error?.message ||
  //       "An error occurred. Please try again.";

  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: errorMessage,
  //       confirmButtonColor: "#d33",
  //     });
  //   }
  // };

  // Filter data based on search query
  const filteredData = requestsData.filter((row) => {
    const matchesSearchQuery = Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesSearchQuery;
  });

  const navi = (
    case_id,
    User_Interaction_Type,
    delegate_user_id,
    Interaction_Log_ID,
    Interaction_ID
  ) => {
    console.log("case_id", case_id);
    console.log("User_Interaction_Type", User_Interaction_Type);
    console.log("delegate_user_id", delegate_user_id);
    console.log("Interaction_Log_ID", Interaction_Log_ID);
    console.log("Interaction_ID", Interaction_ID);
    if (User_Interaction_Type === "Mediation Board Settlement plan Request") {
      navigate("/pages/CreateSettlement/CreateSettlementPlan", {
        state: {
          case_Id: case_id,
          User_Interaction_TYPE: User_Interaction_Type,
          Delegate_User_id: delegate_user_id,
          INteraction_Log_ID: Interaction_Log_ID,
        },
      });
    } else {
      navigate(`/drc/mediation-board`, {
        state: {
          case_Id: case_id,
          User_Interaction_TYPE: User_Interaction_Type,
        //  Delegate_User_id: delegate_user_id,
          INteraction_Log_ID: Interaction_Log_ID,
          INteraction_ID: Interaction_ID,
        },
      });
    }
  };
  const pages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  console.log("");
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

  const onfilterbuttonclick = () => {
    const fetchcases = async () => {
      try {
        const userId = await getLoggedUserId();
        console.log("User ID:", userId);
        const payload = {
          delegate_user_id: userId,
          User_Interaction_Type: requestType,
         // "Request Accept": approved,
          date_from: fromDate,
          drc_id: selectedBand,
          date_to: toDate,
        };
        console.log("Filter payload:", payload);
        const response = await ListAllRequestLogFromRecoveryOfficers(payload);

        const data = Array.isArray(response.data) ? response.data : [];
         console.log("the response given by the api", data);
        setcount(response.count);
        console.log("the count of the  response:", response.count);
        setRequestsData(data);
      } catch (error) {
        console.error(error);
        setRequestsData([]);
      }
    };
    fetchcases();
  };

  const handleclearbutton = () => {
    setFromDate(null);
    setToDate(null);
    setRequestType("");
    setApproved("");
    setSelectedBand("");
    setRequestsData([]);
    setSearchQuery("");
    setcount(0);

  }

    

  // const setshowall = () => {
  //   alert("show all clicked");

  //   const fetchcases = async () => {
  //     try {
  //       const userId = await getLoggedUserId();
  //       console.log("User ID:", userId);
  //       const payload = {
  //         delegate_user_id: userId,
  //         User_Interaction_Type: requestType,
  //         "Request Accept": approved,
  //         date_from: fromDate,
  //         date_to: toDate,
  //       };
  //       console.log("Payload for fetching all cases:", payload);
  //       const response = await ListAllRequestLogFromRecoveryOfficers(payload);
  //       console.log(response);
  //       setRequestsData(response);
  //     } catch (error) {
  //       console.error(error);
  //       setRequestsData([]);
  //     }
  //   };
  //   fetchcases();
  // };

  const onhoverbuttonclick = (caseid) => {
    navigate("/Incident/Case_Details", {
      state: { CaseID: caseid }, // Pass the case ID as a parameter
    });
   // console.log("Navigating to Case Details with ID:", caseid);
  }

  return (
    <div className={GlobalStyle.fontPoppins}>
      <h1 className={GlobalStyle.headingLarge}>
        Requests from Recovery Officer
      </h1>
      <div className="flex items-center gap-2 justify-end ">
        {/* <span className={GlobalStyle.headingMedium}>
          Request Count : {count}
        </span> */}
        <div className={GlobalStyle.countBarMainBox}>
              {/* <span>Request Count</span> */}
              <p className={GlobalStyle.countBarMainTopic}> {count}</p>
            </div>

        {/* <button className={GlobalStyle.buttonPrimary} >
          Show All
        </button> */}
      </div>
      {/* Filter Section */}
        <div className=" flex justify-end">
          <div className={`${GlobalStyle.cardContainer} w-[75vw] flex justify-end gap-4 items-center mb-8 mt-8`}>
            <div className="flex items-center gap-2">
              {/* <span className={GlobalStyle.headingMedium}>Request Type:</span> */}
              <select 
              className= {GlobalStyle.selectBox}
              style={{ color: selectedBand === "" ? "gray" : "black" }}
              value={drcNames.find(item => item.key === selectedBand)?.value || ""}
              onChange={(e) => {
                const selectedValue = e.target.value;
                const selected = drcNames.find(item => item.value === selectedValue);
                if (selected) {
                  setSelectedBand(selected.key); // or setSelectedBand(selected)
                }
                  else {
                  setSelectedBand(""); // fallback
                }
              }}
              >
                <option value="" hidden > Drc </option>
                {/* <option value="7"> Drc 7 </option> */}
                  {drcNames.map(({ key, value }) => (
                    <option key={key} value={value} style={{ color: "black" }}>
                      {value}
                    </option>
                  ))}
              </select>



              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className={GlobalStyle.selectBox}
                style={{ color: requestType === "" ? "gray" : "black" }}
              >
                <option value="" hidden>
                Request Type
                </option>
                <option value="Mediation board forward request letter" style={{ color: "black" }}>
                  Mediation board forward request letter
                </option>
                <option value="Negotiation Settlement plan Request" style={{ color: "black" }}>
                  Negotiation Settlement plan Request
                </option>
                <option value="Negotiation period extend Request" style={{ color: "black" }}>
                  Negotiation period extend Request
                </option>
                <option value="Negotiation customer further information Request" style={{ color: "black" }}>
                  Negotiation customer further information Request
                </option>
                <option value="Negotiation Customer request service" style={{ color: "black" }}>
                  Negotiation Customer request service
                </option>
                <option value="Mediation Board Settlement plan Request" style={{ color: "black" }}>
                  Mediation Board Settlement plan Request
                </option>
                <option value="Mediation Board period extend Request" style={{ color: "black" }}>
                  Mediation Board period extend Request
                </option>
                <option value="Mediation Board customer further information request" style={{ color: "black" }}>
                  Mediation Board customer further information request
                </option>
                <option value="Mediation Board Customer request service" style={{ color: "black" }}>
                  Mediation Board Customer request service
                </option>
              </select>
            </div>

            {/* <div className="flex items-center gap-2">
              <span className={GlobalStyle.headingMedium}> Approved:</span>
              <select
                value={approved}
                onChange={(e) => setApproved(e.target.value)}
                className={GlobalStyle.selectBox}
                style={{ color: approved === "" ? "gray" : "black" }}
              >
                <option value="" hidden>
                  Select 
                </option>
                <option value="Approve" style={{ color: "black" }}>Approve</option>
                <option value="Reject" style={{ color: "black" }}>Reject</option>
              </select>
            </div> */}

            <div className={GlobalStyle.datePickerContainer}>
              <span className={GlobalStyle.dataPickerDate}>Date </span>
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
            </div>
            {error && <span className={GlobalStyle.errorText}>{error}</span>}
            <button
              className={GlobalStyle.buttonPrimary}
              onClick={onfilterbuttonclick} // Reset to first page when filter is applied
            >
              Filter
            </button>
            <button className={GlobalStyle.buttonRemove}  onClick={handleclearbutton} >
                        Clear 
                    </button>
          </div>
      </div>

      {/* Table Section */}
      <div className="flex flex-col">
        {/* Search Bar Section */}
        <div className="mb-4 flex justify-start">
          <div className={`${GlobalStyle.searchBarContainer} `}>
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

        {/* Table Section */}
        
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Case ID
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Status
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Request Status
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Amount
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Validity Period
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  DRC
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Request Type
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Requested date
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}>
                  Approved
                </th>
                <th scope="col" className={GlobalStyle.tableHeader}></th>
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
                  <td className={GlobalStyle.tableData}>
                    <button 
                      onClick={() => onhoverbuttonclick(row.case_id)}
                      onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"} 
                      onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"} >

                          {row.case_id}

                    </button>
                    {/* <a
                      href={`#${row.case_id}`}
                      className="hover:underline"
                    >
                      {row.case_id}
                    </a> */}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.case_current_status}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.User_Interaction_Status}
                  </td>
                  <td className={GlobalStyle.tableCurrency}>
                    {row.current_arrears_amount ?? ""}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.Validity_Period
                      ? row.Validity_Period.split(" - ")
                          .map((date) =>
                            new Date(date.split("T")[0]).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          )
                          .join(" - ")
                      : "N/A"}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.drc_id ?? ""}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.User_Interaction_Type}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {new Date(row.CreateDTM).toLocaleDateString("en-GB")}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.Request_Accept}
                  </td>
                  <td
                    className={`${GlobalStyle.tableData} text-center px-6 py-4`}
                  >
                    <button
                      className={`${GlobalStyle.buttonPrimary} `}
                      onClick={() =>
                        navi(
                          row.case_id,
                          row.User_Interaction_Type,
                          row.delegate_user_id,
                          row.Interaction_Log_ID,
                          row.Interaction_ID
                        )
                      }
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan="10" className= {GlobalStyle.tableData} style={{ textAlign: 'center' }}> 
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Buttons */}
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

export default RecoveryOfficerRequests;
