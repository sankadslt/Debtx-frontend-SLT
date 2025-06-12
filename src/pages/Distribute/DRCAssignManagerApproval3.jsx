/*Purpose: This template is used for the 1.15.2 - DRC Assign Manager Approval 
Created Date: 2025-02-17
Created By: Sanjaya (sanjayaperera80@gmail.com)
Last Modified Date: 2025-02-17
Version: node 20
ui number : 1.15.2
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the codes */

import { useState , useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSearch , FaDownload } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Importing GlobalStyle
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  List_DRC_Assign_Manager_Approval,
  Approve_DRC_Assign_Manager_Approval,
  Reject_DRC_Assign_Manager_Approval,
  Create_task_for_DRC_Assign_Manager_Approval,
} from "../../services/case/CaseServices";
import { getLoggedUserId } from "/src/services/auth/authService.js";
import one from "/src/assets/images/imagefor1.a.13(one).png";
import Swal from "sweetalert2";
import { use } from "react";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";


export default function DRCAssignManagerApproval3() {
  // State for search query and filtered data
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [drcFilter, setDrcFilter] = useState(""); // DRC filter state
  const [ approverstatus , setApproverStatus] = useState(""); // Approver status state]
  const [startDate, setStartDate] = useState(null); // Start date state
  const [endDate, setEndDate] = useState(null); // End date state
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons
  const navigate = useNavigate(); // For navigation
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);

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
        icon: "warning",
        title: "Warning",
        text: "Start date cannot be later than end date.",
        confirmButtonColor: "#f1c40f",
      });
    
    }
    else {
      setStartDate(date);
    if (endDate) checkdatediffrence(date, endDate);
    }

  };

  // Handle end date change
  const handleenddatechange = (date) => {
    if (startDate && date < startDate) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "End date cannot be earlier than start date.",
        confirmButtonColor: "#f1c40f",
      });
      
    }
    else {
      if (startDate) {
        checkdatediffrence(startDate, date);
      }
      setEndDate(date);

    }

  }

  // Fetch data on component mount
  useEffect(() => {
    // Fetch data from the API
    const fetchDRCData = async () => {
      const userId = await getLoggedUserId();
      const payload = {
        approved_deligated_by: userId,
      };
     // console.log("Request Payload:", payload);
      try {
        const response = await List_DRC_Assign_Manager_Approval(payload);
      //  console.log("Response:", response);
        setFilteredData(response);
      } catch (error) {
        console.error("Error fetching DRC assign manager approval:", error);
      }
    };
    fetchDRCData();
  }, []);


    // Function to check date difference and show alert if more than 1 month
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

    // Function to handle API call for creating task when the date range exceeds 1 month
    const handleApicall = async (startDate, endDate) => {
      try {
        const userId = await getLoggedUserId();
        const payload = {
          date_from: startDate.toISOString().split("T")[0], // Format: YYYY-MM-DD
          date_to: endDate.toISOString().split("T")[0],     // Format: YYYY-MM-DD
          Created_By: userId,
        };
    
       // console.log("Filtered Request Payload:", payload);
    
        const data = await Create_task_for_DRC_Assign_Manager_Approval(payload);
       // console.log("Response:", data);
    
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Data sent successfully.",
          confirmButtonColor: "#28a745",
        });

      } catch (error) {
        console.error("Error in sending the data:", error);
    
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
    
      




  // Filter data based on selected filters
  const applyFilters = async () => {
    const payload = {};
    if (drcFilter) {
      payload.approver_type = drcFilter;
    }
    if (approverstatus) {
      payload.approve_status = approverstatus;
    }
    if (startDate) {
      payload.date_from = startDate;
    }
    if (endDate) {
      payload.date_to = endDate;
    }
    const userId = await getLoggedUserId();
    payload.approved_deligated_by = userId;

    //console.log("Filtered Request Data:", payload);

    if ((startDate && !endDate) || (!startDate && endDate)) {
          Swal.fire({
            title: "Error",
            text: "Please select both start and end dates.",
            icon: "error",
            confirmButtonColor: "#f1c40f",
          });
          return;
        }

    try {
      const response = await List_DRC_Assign_Manager_Approval(payload);
     // console.log("Filtered Response Data:", response);
      setFilteredData(response);
    } catch (error) {
      console.error("Error fetching DRC assign manager approval:", error);
    }
  };

  // Clear filters and reset state
  const handlefilterClear = () => {
    setDrcFilter("");
    setStartDate(null);
    setEndDate(null);
    setApproverStatus("");
    
    const filterclear = async () => {
      const userId = await getLoggedUserId();
      const payload = {
        approved_deligated_by: userId,
      };
     // console.log("Request Payload:", payload);
      try {
        const response = await List_DRC_Assign_Manager_Approval(payload);
      //  console.log("Response:", response);
        setFilteredData(response);
      } catch (error) {
        console.error("Error fetching DRC assign manager approval:", error);
      }
    };
    filterclear();
  };

  // Handle pagination
  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Filtering the data based on search query
  const filteredDataBySearch = searchQuery
    ? filteredData.filter((row) =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : currentData;
  //console.log("Filtered Data:", filteredDataBySearch);

  //const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // const handleSelectAll = () => {
  //   setSelectAll(!selectAll);
  //   if (!selectAll) {
  //     // Select all rows in the filtered data
  //     setSelectedRows(
  //       new Set(filteredDataBySearch.map((row) => row.approver_reference))
  //     );
  //   } else {
  //     // Deselect all rows
  //     setSelectedRows(new Set());
  //   }
  // };

  // Function to handle row selection
  const handleRowSelect = (caseid) => {
    const newSelectedRows = new Set(selectedRows);

    if (newSelectedRows.has(caseid)) {
      newSelectedRows.delete(caseid);
    } else {
      if (newSelectedRows.size >= 1) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "You can only select 1 record at a time.",
          confirmButtonColor: "#f1c40f",
        });
        return;
      }
      newSelectedRows.add(caseid);
    }

    setSelectedRows(newSelectedRows);

    // Automatically deselect the "Select All" checkbox if any row is deselected
    // if (newSelectedRows.size !== filteredData.length) {
    //   setSelectAll(false);
    // } else {
    //   setSelectAll(true);
    // }
  };

  // Function to handle approve type change
  const handleOnApproveTypeChange = (e) => {
    setDrcFilter(e.target.value);
  };

  // Function to handle approve button click
  const onApproveButtonClick = async ( ) => {
    const userId = await getLoggedUserId();
    const batchIds = Array.from(selectedRows);
   // console.log("Selected batch IDs:", batchIds);
    if (batchIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select at least one record to approve.",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    const alreadyApproved = batchIds.some((id) => {
      const record = filteredData.find((row) => row.approver_reference === id);
      
      const status = record.approve_status.length > 0 ? record.approve_status[0].status : "";

      return status === "Approve" ;

  });
  //console.log("Already Approved:", alreadyApproved);
    if (alreadyApproved) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Selected record has already been approved.",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    const rejected = batchIds.some((id) => {
      const record = filteredData.find((row) => row.approver_reference === id);

      const status = record.approve_status.length > 0 ? record.approve_status[0].status : "";

      return status === "Reject";

    });
    //console.log("Rejected:", rejected);

    if (rejected) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Selected record has already been rejected.",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }
    
   

      // Show confirmation alert before calling API
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to approve the selected record?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) {
      return;
    }




    const payload = {
      approver_reference: batchIds,
      approved_by: userId,
    };
    //console.log("Approve payload:", payload);
    try {
      const response = await Approve_DRC_Assign_Manager_Approval(payload);
      //console.log("Approve response:", response);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Selected records have been approved successfully.",
        confirmButtonColor: "#28a745",
      });
      //setSelectAll(false);
      setSelectedRows(new Set());
      applyFilters();
    } catch (error) {
      console.error("Error approving batch:", error);
      
      const errorMessage = error?.response?.data?.message || 
                             error?.message || 
                             "An error occurred. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#f1c40f",
      });
    }
  };

  // Function to handle reject button click
  const onRejectButtonClick = async () => {
    const userId = await getLoggedUserId();
    const batchIds = Array.from(selectedRows);
   // console.log("Selected batch IDs:", batchIds);
    if (batchIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select at least one record to reject.",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    const alreadyApproved = batchIds.some((id) => {
      const record = filteredData.find((row) => row.approver_reference === id);

      const status = record.approve_status.length > 0 ? record.approve_status[0].status : "";

      return status === "Approve";

  });
  //console.log("Already Approved:", alreadyApproved);
    if (alreadyApproved) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Selected record has already been approved.",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    const rejected = batchIds.some((id) => {
      const record = filteredData.find((row) => row.approver_reference === id);

      const status = record.approve_status.length > 0 ? record.approve_status[0].status : "";

      return status === "Reject";

    });
    //console.log("Rejected:", rejected);

    if (rejected) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Selected record has already been rejected.",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }
    
      // Show confirmation alert before calling API
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to rejected the selected record?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) {
      return;
    }

    const payload = {
      approver_references: batchIds,
      approved_by: userId,
    };
    //console.log("Approve payload:", payload);
    try {
      const response = await Reject_DRC_Assign_Manager_Approval(payload);
    //  console.log("Approve response:", response);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Selected records have been rejected.",
        confirmButtonColor: "#28a745",
      });
      //setSelectAll(false);
      setSelectedRows(new Set());
      applyFilters();
    } catch (error) {
      console.error("Error approving batch:", error);
      
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

  // Function to handle create task button click
  const onCreateTask = async () => {

    if(!startDate || !endDate) {
          Swal.fire({
            title: "warning",
            text: "Please select both start and end dates.",
            icon: "warning",
            confirmButtonColor: "#f1c40f",
          });
          return;
        }


    const userId = await getLoggedUserId();
    //const batchIds = Array.from(selectedRows);
    //console.log("Selected batch IDs:", batchIds);
    // if (batchIds.length === 0) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Warning",
    //     text: "Please select at least one record .",
    //     confirmButtonColor: "#f1c40f",
    //   });
    //   return;
    // }
    const payload = {
      //approver_references: batchIds, // meka galevva  drop down vala select karana tika yavanna one - check backend
      approver_type: drcFilter,
      date_from: startDate,
      date_to: endDate,
      approver_status: approverstatus,
      Created_By: userId,
    };
    //console.log("Approve payload:", payload);
    try {
      const response = await Create_task_for_DRC_Assign_Manager_Approval(
        payload
      );
      //console.log("Approve response:", response);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data sent successfully.",
        confirmButtonColor: "#28a745",
      });
      //setSelectAll(false);
      setSelectedRows(new Set());
      applyFilters();
    } catch (error) {
      console.error("Error approving batch:", error);
        
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

  // Function to handle table icon click
  const onTableIconClick = (item) => {

    const formattedParameters = Object.entries(item.parameters)
    .map(([key, value]) => `  "${key}": ${JSON.stringify(value)}`)
    .join('\n');

    Swal.fire({
      
      title: "Row Parameters",
      html: `
      <div style="margin-top: -15px; font-size: 15px; color: #000; margin-bottom: 10px;">
        <strong>${item.approver_type}</strong>
      </div>
      <pre style="text-align: center; white-space: pre-wrap;">${formattedParameters}</pre>
    `,
      icon: "info",
      confirmButtonText: "Close",
      confirmButtonColor: "#d33",
      width: "500px",
    });
  };

  // Function to handle hover button click of the table 
  const onhoverbuttonclick = (caseid) => {
    navigate("/Incident/Case_Details", {
      state: { CaseID: caseid }, // Pass the case ID as a parameter
    });
   // console.log("Navigating to Case Details with ID:", caseid);
  }


  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Assigned DRC Summary</h1>
      <div className="flex justify-end ">
        {/* Filter Section */}
        <div  className= {`${GlobalStyle.cardContainer}  w-full mt-6    `}>
            <div className="flex  flex-wrap  justify-end gap-3">
              {" "}
              {/* <div className="flex flex-wrap gap-3 h-[35px] "> */}
                <select
                  className={`${GlobalStyle.selectBox} w-full sm:w-auto`}
                  value={drcFilter}
                  onChange={handleOnApproveTypeChange}
                  style={{ color: drcFilter === "" ? "gray" : "black" }}

                >
                  <option value="" hidden>
                    Select Approve Type
                  </option>
                  <option value="DRC Assign Approval" style={{ color: "black" }}>DRC Assign Approval </option>
                  <option value="DRC Re-Assign Approval" style={{ color: "black" }}>DRC Re-Assign Approval</option>
                  <option value="Case Withdrawal Approval" style={{ color: "black" }}>Case Withdrawal Approval</option>
                  <option value="Case Abandoned Approval" style={{ color: "black" }}>Case Abandoned Approval</option>
                  <option value="Case Write-Off Approval" style={{ color: "black" }}>Case Write-Off Approval</option>
                  <option value="Commission Approval" style={{ color: "black" }}>Commission Approval</option>
                  

                </select>

                <select 
                  className={`${GlobalStyle.selectBox} w-full sm:w-auto`}
                  value={approverstatus}
                  onChange={(e) => setApproverStatus(e.target.value)}
                  style={{ color: approverstatus === "" ? "gray" : "black" }}
                >
                  <option value="" hidden>
                    Select Approve Status
                  </option>
                  <option value="Open" style={{ color: "black" }}>Open</option>
                  <option value="Approve" style={{ color: "black" }}>Approve</option>
                  <option value="Reject" style={{ color: "black" }}>Reject</option>
                  

                </select>




              {/* </div> */}

                  <label className={GlobalStyle.dataPickerDate}  style={{ marginTop: '5px', display: 'block' }}>Date : </label>
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

                <div>
                    {["admin", "superadmin", "slt"].includes(userRole) && (
                        <button
                            onClick={applyFilters}
                            className={`${GlobalStyle.buttonPrimary} h-[35px] w-full sm:w-auto`}
                          >
                            Filter
                      </button>
                    )}
                 </div>
              
              {/* <button
                onClick={applyFilters}
                className={`${GlobalStyle.buttonPrimary} h-[35px] `}
              >
                Filter
              </button> */}

              <div>
                  {["admin", "superadmin", "slt"].includes(userRole) && (
                    <button
                    className={`${GlobalStyle.buttonRemove} h-[35px]  w-full sm:w-auto`}
                    onClick={handlefilterClear}
                    >
                      clear
                    </button>
                  )}
              </div>
              {/* <button
                className={`${GlobalStyle.buttonRemove} h-[35px] `}
                onClick={handlefilterClear}
                >
                  clear
                </button> */}
            </div>
        </div>
      </div>

      {/* Search Section */}

      <div className="flex py-2 items-center justify-start gap-2 mt-2 mb-4">
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

      {/* Table Section */}
       <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>
                {/* <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="mx-auto"
                /> */}
              </th>
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Approve Status</th>
              <th className={GlobalStyle.tableHeader}>Approve Type</th>
              <th className={GlobalStyle.tableHeader}>Approve By</th>
              <th className={GlobalStyle.tableHeader}>Remark</th>
              <th className={GlobalStyle.tableHeader}>Created by</th>
              <th className={GlobalStyle.tableHeader}>Created on</th>
              
              
              
              
              <th className={GlobalStyle.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.length > 0 ? (
              filteredDataBySearch.map((item, index) => (
                <tr
                  key={`${item.drc}-${index}`}
                  className={
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
                >
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(item.approver_reference)}
                      onChange={() => handleRowSelect(item.approver_reference)}
                      className="mx-auto"
                    />
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <button 
                      onClick={() => onhoverbuttonclick(item.approver_reference)}
                      onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"} 
                      onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"} >

                          {item.approver_reference}

                    </button>
                  </td>
                  <td className={GlobalStyle.tableData}>
                  {item.approve_status.length > 0 ? item.approve_status[0].status : "N/A"}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {item.approver_type}
                  </td>
                  <td className={GlobalStyle.tableData}>{item.approved_deligated_by}</td>
                  <td className={GlobalStyle.tableData}>
                    {item.remark.length > 0
                      ? item.remark[item.remark.length - 1].remark
                      : "N/A"}
                  </td>
                  
                  <td className={GlobalStyle.tableData}>{item.created_by}</td>
                  <td className={GlobalStyle.tableData}>
                    {new Date(item.created_on).toLocaleDateString("en-GB")}
                  </td>
                  
                  
                  
                  
                  
                  <td className={GlobalStyle.tableData}>
                    <button onClick={() => onTableIconClick(item)}>

                      <img
                        src={one}
                        width={15}
                        height={15}
                        alt="Summary"
                        data-tooltip-id="my-tooltip"
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      />
                      <Tooltip id="my-tooltip" place="bottom" content="View Parameters" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      { filteredDataBySearch.length > 0 && (
      <div className={GlobalStyle.navButtonContainer}>
        <button
          onClick={() => handlePrevNext("prev")}
          disabled={currentPage === 1}
          className={`${GlobalStyle.navButton} ${
            currentPage === 1 ? "cursor-not-allowed" : ""
          }`}
        >
          <FaArrowLeft />
        </button>
        <span className={`${GlobalStyle.pageIndicator} mx-4`}>
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
      )}

      {/* Select All Data Checkbox and Approve Button */}
      <div className="flex justify-end gap-4 mt-4">
        {/* Select All Data Checkbox */}
        {/* <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded-lg"
            checked={selectAll}
            onChange={handleSelectAll}
          />
          Select All Data
        </label> */}


        {/* Approve Button */}
        
        {/* <button
          onClick={onApproveButtonClick}
          className={GlobalStyle.buttonPrimary}
        >
          Approve
        </button> */}

        <div>
            {["admin", "superadmin", "slt"].includes(userRole) && (
              <button
              onClick={onApproveButtonClick}
              className={GlobalStyle.buttonPrimary}
            >
              Approve
            </button>
            )}
        </div>

        {/* Reject Button */}

        <div>
            {["admin", "superadmin", "slt"].includes(userRole) && (
            <button
              onClick={onRejectButtonClick}
              className={GlobalStyle.buttonRemove}
            >
              Reject
            </button>
            )}
        </div>
        {/* <button
          onClick={onRejectButtonClick}
          className={GlobalStyle.buttonRemove}
        >
          Reject
        </button> */}
      </div>

      {/* Create Task Button */}
      <div>
        { filteredDataBySearch.length > 0 && (
        <div>
            {["admin", "superadmin", "slt"].includes(userRole) && (
            <button onClick={onCreateTask} className={`${GlobalStyle.buttonPrimary} flex items-center `}>
            <FaDownload className="mr-2" />
               Create Task and Let me know
           </button>
            )}
        </div>
        )}

        {/* <button onClick={onCreateTask} className={`${GlobalStyle.buttonPrimary} flex items-center `}>
          <FaDownload className="mr-2" />
          Create Task and Let me know
        </button> */}
      </div>


    </div>
  );
}
