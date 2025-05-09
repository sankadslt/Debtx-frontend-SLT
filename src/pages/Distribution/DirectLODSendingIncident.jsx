
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
  const [fromDate, setFromDate] = useState(null); //for date
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [selectAllData, setSelectAllData] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Changed to 0-based indexing
  const [selectedSource, setSelectedSource] = useState("");
  const [tableData, setTableData] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState(tableData);
  const navigate = useNavigate();

  const rowsPerPage = 7; // Number of rows per page

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

  useEffect(() => {
    fetchData();
  }, []);

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
          title: "Warning",
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
        text: "Are you sure you need to convert all incidents as Direct LOD cases?",
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
            title: "Warning",
            text: "A task is already in progress.",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#f1c40f"
          });
          return;
        }
        if (filteredData.length > 10) {
          const parameters = {
            Status: "Direct LOD",
            Inncident_Ids: selectedRows,
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
        text: "Internal server error",
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
                            confirmButtonColor: "#d33", 
                        });;
    } else {
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
                            confirmButtonColor: "#d33", 
                        });
    } else {
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

  const handleRowCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAllDataChange = () => {
    if (selectAllData) {
      setSelectedRows([]); // Clear all selections
    } else {
      setSelectedRows(filteredData.map((row) => row.id)); // Select all visible rows
    }
    setSelectAllData(!selectAllData);
  };

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
        </div>

        {/* Filter Section */}
        <div className="flex justify-end">
        <div className={`${GlobalStyle.cardContainer}  items-center w-[70vw] mb-8 mt-8`}>
          <div className="flex items-center gap-4 justify-end">
          {/* Source Dropdown */}
          <div className="flex items-center gap-4">
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
          <div className="flex items-center gap-4">
            <label>Date:</label>
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
            {error && <span className={GlobalStyle.errorText}>{error}</span>}
          </div>

          {/* Filter Button */}
          <button
            className={`${GlobalStyle.buttonPrimary} h-[35px]`}
            onClick={handleFilterClick}
          >
            Filter
          </button>
          <button className={GlobalStyle.buttonRemove} onClick={handlefilterclear} >
                        Clear
            </button>
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
          <div className={GlobalStyle.tableContainer}>
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
                    Amount
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
                          <div title="Direct LOD" aria-label="Direct LOD">
                            <img
                              src={Direct_LOD}
                              alt="Direct LOD"
                              className="w-5 h-5"
                            />
                          </div>
                        )}
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
                      <button
                        className={`${GlobalStyle.buttonPrimary} mx-auto`}
                        onClick={()=>{handleProceed(row.id)}}
                      >
                        Proceed
                      </button>
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

          <button
            className={`${GlobalStyle.buttonPrimary} ml-4`}
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </div>
      )}
    </div>
  );
}


