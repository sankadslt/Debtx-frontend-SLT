
/*
Purpose: 
Created Date: 2025.01.22
Created By: K.K.C sakumini
Last Modified Date: 2025.01.23
Modified By:Buthmi Mithara
Version: node 11
ui number : 1.9
Dependencies: tailwind css
Related Files: 
Notes: 

*/

import React, { useState, useEffect} from "react";
import DatePicker from "react-datepicker";
import { FaArrowLeft, FaArrowRight, FaSearch , FaDownload } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import Direct_LOD from "../../assets/images/incidents/Direct_LOD.png";
import { List_incidents_Direct_LOD, Create_Task_Download_Direct_LOD_Sending, Forward_Direct_LOD, Create_Task_Forward_Direct_LOD, Open_Task_Count_Forward_Direct_LOD } from "../../services/distribution/distributionService.js";
import Swal from "sweetalert2";
import  { Tooltip } from "react-tooltip";

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

export default function DirectLODSendingIncident() {
  // Table data exactly matching the image
  // const tableData = [
  //   {
  //     id: "RC001",
  //     status: "Direct LOD",
  //     account_no: "0115678",
  //     amount: "1500",
  //     source_type: "Pilot - Suspended",
  //   },
  //   {
  //     id: "RC002",
  //     status: "Direct LOD",
  //     account_no: "8765946",
  //     amount: "590",
  //     source_type: "Special",
  //   },
  //   {
  //     id: "RC003",
  //     status: "Direct LOD",
  //     account_no: "3754918",
  //     amount: "900",
  //     source_type: "Product Terminate",
  //   },
  // ];

  // Filter state
  const [fromDate, setFromDate] = useState(null); // usestate for date picker
  const [toDate, setToDate] = useState(null); // usestate for date picker
  const [error, setError] = useState(""); //usestate for error message
  const [selectAllData, setSelectAllData] = useState(false); // usestate for select all checkbox
  const [selectedRows, setSelectedRows] = useState([]); // usestate for selected rows
  const [searchQuery, setSearchQuery] = useState(""); // usestate for search query
  const [currentPage, setCurrentPage] = useState(0); // usestate for current page
  const [selectedSource, setSelectedSource] = useState(""); // usestate for selected source type
  const [tableData, setTableData] = useState([]); // usestate for table data
  const [isloading, setIsLoading] = useState(true); // usestate for loading state
  const [filteredData, setFilteredData] = useState(tableData); // usestate for filtered data
  const navigate = useNavigate(); // Initialize navigate for routing

  const [userRole, setUserRole] = useState(null); // Role-Based Buttons

  const rowsPerPage = 7; // Number of rows per page


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

  // Function to fetch incident counts
  const fetchData = async () => {
    try {
      const filters= {
        Source_Type:selectedSource,
        FromDate:fromDate,
        ToDate:toDate
      }

      const response = await List_incidents_Direct_LOD(filters);
      const formattedData = response?.data.map((item) => {
        
        const createdDateStr = typeof item.Created_Dtm === "string" ? item.Created_Dtm.replace(" ", "T") : item.Created_Dtm;
        const createdDate = createdDateStr ? new Date(createdDateStr) : null;
        
        return {
          id: item.Incident_Id || "N/A",
          status: item.Incident_Status || "N/A",
          account_no: item.Account_Num || "N/A",
          amount: item.Arrears || "N/A",
          source_type: item?.Source_Type || "N/A",
          created_dtm: isNaN(createdDate) ? "N/A" : createdDate.toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric", // Ensures two-digit year (YY)
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true, // Keeps AM/PM format
          }),
        };
      });
      setTableData(formattedData);
      setIsLoading(false);
    } catch (error){
      console.log(error)
      //setError("Failed to fetch DRC details. Please try again later.");
      setIsLoading(false);
    }
  };

  // Fetch data when the component mounts or when filters change
  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle the creation of a task for downloading
  const handleCreateTaskForDownload = async({source_type, fromDate, toDate}) => {
    if (filteredData.length === 0) {
      Swal.fire({
        title: "Warning",
        text: "No records to download.",
        icon: "warning",
        confirmButtonText: "OK",
         confirmButtonColor: "#f1c40f"
      });
      return;
    }

    

    if(!source_type && !fromDate && !toDate){
      Swal.fire({
        title: 'Warning',
        text: 'Missing Parameters',
        icon: 'warning',
        confirmButtonText: 'OK',
         confirmButtonColor: "#f1c40f"
      });
      return;
    }

    if (!fromDate && !toDate ) {
      Swal.fire({
        title: 'Warning',
        text: 'Please select a date range',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: "#f1c40f"
      });
      return;
    }

    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      Swal.fire({
        title: "Incomplete Date Range",
        text: "Both From Date and To Date must be selected together.",
        icon: "warning",
        confirmButtonText: "OK",
         confirmButtonColor: "#f1c40f"
      });
      return;
    } 
    try{
      const filteredParams = {
        Source_Type:source_type,
        FromDate:fromDate,
        ToDate:toDate
      }
      const response = await Create_Task_Download_Direct_LOD_Sending(filteredParams);
      if(response.status===201){
        Swal.fire({ 
          title: 'Success',
          text: 'Task successfully created',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: "#28a745"
        });
      }
    }catch(error){
      Swal.fire({
        title: 'Error',
        text: 'Error creating task',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: "#d33"

      });
    }
  };

  // Function to handle the "Proceed" button click
  const handleProceed = async (Incident_Id) => {
    try {
    if (!selectedRows.includes(Incident_Id)) {
      Swal.fire({
        title: "Warning",
        text: "Row not selected",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f1c40f"
      });
      return;
    }

    const result = await Swal.fire({
      title: "Confirm",
      text: "Are you sure you need to convert the incident as a Direct LOD case?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Proceed",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancel",
    });
    
    if (result.isConfirmed) {
      const openTaskCount = await Open_Task_Count_Forward_Direct_LOD();
      if (openTaskCount > 0) {
        Swal.fire({
          title: "Action Blocked",
          text: "A task is already in progress.",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#f1c40f"
        });
        return;
      }
      const response = await Forward_Direct_LOD(Incident_Id);
      if (response.status === 201) {
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#28a745"
        });
        fetchData();
      }
    }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33"
      });
    }
  };
  
  // Function to handle the creation of a task for forwarding
  const handleCreate = async () => {
    try {
      if (selectedRows.length === 0) {
        Swal.fire({
          title: "Warning",
          text: "No record selected.",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#f1c40f"
        });
        return;
      }
      const result = await Swal.fire({
        title: "Confirm",
        text: `Are you sure you want to convert ${selectedRows.length} selected incidents as Direct LOD cases?`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Create Task",
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const openTaskCount = await Open_Task_Count_Forward_Direct_LOD();
        if (openTaskCount > 0) {
          Swal.fire({
            title: "Action Blocked",
            text: "A task is already in progress.",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#f1c40f"
          });
          return;
        }
        if ( selectedRows.length > 5) {
          const confirmTask = await Swal.fire({
              title: "Info",
              text: "More than 5 records selected. Do you want to create a task instead?",
              icon: "info",
              showCancelButton: true,
              confirmButtonText: "Create Task",
              cancelButtonText: "Cancel",
              confirmButtonColor: "#28a745",
              cancelButtonColor: "#d33"
            });

        if (!confirmTask.isConfirmed) return;
          

          const parameters = {
            Status: "Direct LOD",
           // Inncident_Ids: selectedRows,
           Created_Date : new Date().toISOString().split("T")[0],

          };
    
          const response = await Create_Task_Forward_Direct_LOD(parameters);
          if (response.status === 201) {
            Swal.fire({
              title: "Success",
              text: "Successfully created task to forward the direct LOD incidents",
              icon: "success",
              confirmButtonText: "OK",
              confirmButtonColor: "#28a745"
            });
          }
        } else {
          
          for (const row of selectedRows) {
            await Forward_Direct_LOD(row); 
          }

          Swal.fire({
            title: "Success",
            text: "Successfully forwarded the direct LOD incidents",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#28a745"
          });
    
          fetchData();
        }
      }

    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Internal server error",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33"
      });
    }
  };
  
  // validation for date
  const handleFromDateChange = (date) => {
    if (toDate && date > toDate) {
      
       Swal.fire({
                            title: "Error",
                            text: "The 'From' date cannot be later than the 'To' date.",
                            icon: "error",
                            confirmButtonColor: "#f1c40f",
                        });;
    } else if (toDate){
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
    }
    else {
      setError("");
      setFromDate(date);
    }
  };



  // validation for date
  const handleToDateChange = (date) => {
    if (fromDate && date < fromDate) {
      
      Swal.fire({
                            title: "Error",
                            text: "The 'To' date cannot be earlier than the 'From' date.",
                            icon: "error",
                            confirmButtonColor: "#f1c40f",
                        });
    }  else if (fromDate) {
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
    }
    else {
      setError("");
      setToDate(date);
    }
  };

  //search fuction
  useEffect(() => {
    setFilteredData(
      tableData.filter((row) =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, tableData]);

  // Calculate total pages
  const pages = Math.ceil(filteredData.length / rowsPerPage);

  // Handle pagination
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

  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Handle row checkbox change
  const handleRowCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handle select all checkbox change
  const handleSelectAllDataChange = () => {
    if (selectAllData) {
      setSelectedRows([]); // Clear all selections
    } else {
      setSelectedRows(filteredData.map((row) => row.id)); // Select all visible rows
    }
    setSelectAllData(!selectAllData);
  };

  // Handle filter button click
  const handleFilterClick = () => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    
    if (!selectedSource && !from && !to) {
      Swal.fire({
        title: "Missing Filters",
        text: "Please select a Source Type or provide both From Date and To Date.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f1c40f"
      });
      return;
    }
  
    if ((from && !to) || (!from && to)) {
      Swal.fire({
        title: "Incomplete Date Range",
        text: "Both From Date and To Date must be selected together.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f1c40f"
      });
      return;
    }
  
    if (selectedSource || (from && to)) {
      if (from && to) {
        const monthDiff = (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth());
  
        if (monthDiff > 1 || (monthDiff === 1 && to.getDate() > from.getDate())) {
          Swal.fire({
            title: "Long Date Range",
            text: "The selected date range exceeds one month. Consider creating a task instead.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Create Task",
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancel",
          }).then((result) => {
            if (result.isConfirmed) {
              handleCreateTaskForDownload({
                source_type: selectedSource, 
                fromDate: fromDate, 
                toDate: toDate
              })
            } 
          });
          return;
        }
      }
      fetchData(); 
      setSearchQuery("")
    }
  };
  
  // Function to handle filter clear
  const handlefilterclear = async () => {
    setFromDate(null);
    setToDate(null);
    setSelectedRows([]);
    setSelectAllData(false);
    setSearchQuery("");
    setSelectedSource("");
};

// This useEffect will automatically reload the initial data when filters are cleared
useEffect(() => {
    if (fromDate === null && toDate === null && selectedSource === "") {
        fetchData();
    }
}, [fromDate, toDate, selectedSource]);
  
  return (

    <div>
       {isloading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
      <div className={GlobalStyle.fontPoppins}>
        <div className="flex justify-between items-center w-full ">
          <h1 className={`${GlobalStyle.headingLarge} mb-6`}>
            Direct LOD sending Incidents
          </h1>
          
        </div>
          
        <div className="flex justify-end items-center w-full mb-4"> 
        {/* <button
            className={`${GlobalStyle.buttonPrimary} flex items-center`}
            onClick={()=>{handleCreateTaskForDownload({
              source_type: selectedSource, 
              fromDate: fromDate, 
              toDate: toDate
            })}}
          >
            <FaDownload className="mr-2" />
            Create task and let me know
          </button> */}
          { paginatedData.length > 0 && (
            <div>
              {["admin", "superadmin", "slt"].includes(userRole) && (
                
                <button
                className={`${GlobalStyle.buttonPrimary} flex items-center`}
                onClick={()=>{handleCreateTaskForDownload({
                  source_type: selectedSource, 
                  fromDate: fromDate, 
                  toDate: toDate
                })}}
              >
                <FaDownload className="mr-2" />
                Create task and let me know
              </button>
              )}
              
          </div>
          )}
        </div>

        {/* Filter Section */}
        <div className="flex justify-end">
        <div className={`${GlobalStyle.cardContainer} w-full items-center md:w-[72vw] mb-8 mt-8`}>
          <div className="flex flex-wrap items-center gap-4 justify-end">
          {/* Source Dropdown */}
          <div className="flex items-center gap-4 sm:w-auto sm:flex-row sm:items-center">
            <label>Source:</label>
            <select
              className={GlobalStyle.selectBox}
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              style={{ color: selectedSource === "" ? "gray" : "black" }}
            >
              <option value="" hidden>Select</option>
              <option value="Pilot - Suspended" style={{ color: "black" }}>Pilot - Suspended</option>
              <option value="Special" style={{ color: "black" }}>Special</option>
              <option value="Product Terminate" style={{ color: "black" }}>Product Terminate</option>
            </select>
          </div>

          {/* Date Picker Section */}
          <div className="flex items-center gap-4 sm:w-auto sm:flex-row sm:items-center">
            <label>Date:</label>
            <DatePicker
              selected={fromDate}
              onChange={handleFromDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="From"
               className={`${GlobalStyle.inputText} w-full sm:w-auto`}
            />
            <DatePicker
              selected={toDate}
              onChange={handleToDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="To"
               className={`${GlobalStyle.inputText} w-full sm:w-auto`}
            />
            {error && <span className={GlobalStyle.errorText}>{error}</span>}
          </div>

          {/* Filter Button */}
          {/* <button
            className={`${GlobalStyle.buttonPrimary} h-[35px]`}
            onClick={handleFilterClick}
          >
            Filter
          </button> */}
          <div>
              {["admin", "superadmin", "slt"].includes(userRole) && (
                <button
                className={`${GlobalStyle.buttonPrimary} h-[35px] w-full sm:w-auto`}
                onClick={handleFilterClick}
              >
                Filter
              </button>
              )}
          </div>
          {/* <button className={GlobalStyle.buttonRemove} onClick={handlefilterclear} >
                        Clear
            </button> */}
            <div>
              {["admin", "superadmin", "slt"].includes(userRole) && (
                <button  className={`${GlobalStyle.buttonRemove}  w-full sm:w-auto`} onClick={handlefilterclear} >
                Clear
                </button>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Table Section */}
        <div className="flex flex-col">
          {/* Search Bar Section */}
          <div className="mb-4 flex justify-start">
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
          <div className={`${GlobalStyle.tableContainer} overflow-x-auto w-full`}>
            <table className={GlobalStyle.table}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th scope="col" className={GlobalStyle.tableHeader}></th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    ID
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Status
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Account No.
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Amount (LKR)
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Source Type
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Created DTM
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
                      <input
                        type="checkbox"
                        className={"rounded-lg"}
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleRowCheckboxChange(row.id)}
                      />
                    </td>
                    <td className={GlobalStyle.tableData}>
                      <a href={`#${row.id}`} className="hover:underline">
                        {row.id}
                      </a>
                    </td>
                    <td className={GlobalStyle.tableData}>
                      <div className="flex justify-center items-center h-full">
                        {row.status.toLowerCase() === "direct lod" && (
                          <div >
                            <img
                              src={Direct_LOD}
                              alt="Direct LOD"
                              className="w-5 h-5"
                              data-tooltip-id="direct-lod-tooltip"
                            />
                          </div>
                        )}
                        <Tooltip
                          id="direct-lod-tooltip"
                          place="bottom"
                          content="Direct LOD"
                          className="tooltip"
                        />
                      </div>
                    </td>

                    <td className={GlobalStyle.tableData}>{row.account_no}</td>
                    <td className={GlobalStyle.tableCurrency}>
                      {new Intl.NumberFormat("en-US").format(row.amount)}
                    </td>

                    <td className={GlobalStyle.tableData}>{row.source_type}</td>
                    <td className={GlobalStyle.tableData}>{row.created_dtm}</td>
                    <td
                      className={`${GlobalStyle.tableData} text-center px-6 py-4`}
                    >
                      {/* <button
                        className={`${GlobalStyle.buttonPrimary} mx-auto`}
                        onClick={()=>{handleProceed(row.id)}}
                      >
                        Proceed
                      </button> */}
                      <div>
                        {["admin", "superadmin", "slt"].includes(userRole) && (
                          <button
                          className={`${GlobalStyle.buttonPrimary} mx-auto`}
                          onClick={()=>{handleProceed(row.id)}}
                        >
                          Proceed
                        </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
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
       <div className="flex justify-start items-center w-full mt-6">
            <button
              className={`${GlobalStyle.buttonPrimary} `} 
              onClick={() => navigate("/Distribution/filtered-incident")}
            >
              <FaArrowLeft className="mr-2" />
            </button>
        </div>

        <div className="flex justify-end items-center w-full">
          {/* Select All Data Checkbox */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded-lg"
              checked={
                selectAllData ||
                filteredData.every((row) => selectedRows.includes(row.id))
              } // Reflect selection state
              onChange={handleSelectAllDataChange}
            />
            Select All Data
          </label>

          {/* <button
            className={`${GlobalStyle.buttonPrimary} ml-4`}
            onClick={handleCreate}
          >
            Create
          </button> */}
          <div>
            {["admin", "superadmin", "slt"].includes(userRole) && (
              <button
              className={`${GlobalStyle.buttonPrimary} ml-4`}
              onClick={handleCreate}
            >
              Create
            </button>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}


