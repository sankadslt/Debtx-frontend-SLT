/*
Purpose: 
Created Date: 2025.01.23
Created By: Nadali Linara
Last Modified Date: 2025.01.25
Modified By:Buthmi Mithara
Version: node 11
ui number : 1.7.2
Dependencies: tailwind css
Related Files: 
Notes: 

*/

import DatePicker from "react-datepicker";
import { FaArrowLeft, FaArrowRight, FaSearch , FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Import GlobalStyle
import Reject_Pending from "../../assets/images/incidents/Reject_Pending.png";
import { Create_Task_Download_Pending_Reject, Create_Task_Forward_F1_Filtered, Create_Task_Reject_F1_Filtered, Forward_F1_Filtered, List_F1_filtered_incidents, Open_Task_Count_Forward_F1_Filtered, Open_Task_Count_Reject_F1_Filtered, Reject_F1_Filtered } from "../../services/distribution/distributionService.js";
import Swal from "sweetalert2";
import  { Tooltip } from "react-tooltip";

export default function RejectIncident() {
  const navigate = useNavigate();

  // Filter state
  const [fromDate, setFromDate] = useState(null); //for date
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState(tableData);
  const [selectAllData, setSelectAllData] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);  
  const [selectedSource, setSelectedSource] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
      try {
        const filters= {
          Source_Type:selectedSource,
          FromDate:fromDate,
          ToDate:toDate
        }
        const response = await List_F1_filtered_incidents(filters);
        const formattedData = response?.data.map((item) => {
          
          const createdDateStr = typeof item.Created_Dtm === "string" ? item.Created_Dtm.replace(" ", "T") : item.Created_Dtm;
          const rejectedDateStr = typeof item.Rejected_Dtm === "string" ? item.Rejected_Dtm.replace(" ", "T") : item.Rejected_Dtm;
          const createdDate = createdDateStr ? new Date(createdDateStr) : null;
          const rejectedDate = rejectedDateStr ? new Date(rejectedDateStr) : null;
          return {
            id: item.Incident_Id || "N/A",
            status: "Reject Pending4",
            account_no: item.Account_Num || "N/A",
            filtered_reason: item.Filtered_Reason || "N/A",
            source_type: item?.Source_Type || "N/A",
            rejected_on: isNaN(rejectedDate) ? "N/A" : rejectedDate.toLocaleString() || "N/A",
            created_dtm: isNaN(createdDate) ? "N/A" : createdDate.toLocaleString() || "N/A"
          };
        });
        setTableData(formattedData);
        setIsLoading(false);
      } catch {
        setError("Failed to fetch DRC details. Please try again later.");
        setIsLoading(false);
      }
    };
    
   useEffect(() => {
        fetchData();
    }, []);

  
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
  // Pagination state
  const rowsPerPage = 7;
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

  // Paginated data
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleRowCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((id) => id !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAllDataChange = () => {
    if (selectAllData) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((row) => row.id));
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

  const handleclearFilter = () => {
    setFromDate(null);
    setToDate(null);
    setSelectedSource("");
    fetchData();
  }
    
    

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
        }
        else if ((fromDate && !toDate) || (!fromDate && toDate)) {
          Swal.fire({
            title: "Incomplete Date Range",
            text: "Both From Date and To Date must be selected together.",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#f1c40f"
          });
          return;
        } else{
        try{
          const filteredParams = {
            Source_Type:source_type,
            FromDate:fromDate,
            ToDate:toDate
          }
          const response = await Create_Task_Download_Pending_Reject(filteredParams);
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
        }
    };

  const handleReject= async (Incident_Id)=>{
        if(!selectedRows.includes(Incident_Id)){
          Swal.fire({
            title: 'Warning',
            text: 'Row not selected',
            icon: 'warning',
            confirmButtonText: 'OK',
            confirmButtonColor: "#f1c40f"
          });
          return;
        }

        try{
            const openTaskCount = await Open_Task_Count_Reject_F1_Filtered();
            if (openTaskCount > 0) {
                    Swal.fire({
                      title: "Warning",
                      text: "A task is already in progress.",
                      icon: "warning",
                      confirmButtonText: "OK",
                      confirmButtonColor : "#f1c40f"
                    });
                    return;
            }
            const response = await Reject_F1_Filtered(Incident_Id);
           
            if(response.status===200){
              Swal.fire({ 
                title: 'Success',
                text: response.data.message,
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: "#28a745"
              });
              fetchData();
            }  
        }catch(error){
            Swal.fire({
              title: 'Error',
              text: error.message,
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: "#d33"
            });
        } 
  }

  const handleRejectAll = async()=>{
    
      try{
        if (filteredData.length === 0) {
          Swal.fire({
            title: "Warning",
            text: "No records to reject.",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#f1c40f"
          });
          return;
        }
        const result = await Swal.fire({
          title: "Confirm",
          text: "Are you sure you want to move reject all the Reject pending cases?",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Reject All",
          confirmButtonColor: "#28a745",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancel",
         });

        if (result.isConfirmed) {

            const openTaskCount = await Open_Task_Count_Reject_F1_Filtered();
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
            if(filteredData.length>10){
                const parameters = {
                  Status:"Reject Pending",
                }
                const response = await Create_Task_Reject_F1_Filtered(parameters);
                if(response.status===201){
                  Swal.fire({ 
                    title: 'Success',
                    text: 'Successfully created task to reject F1 filtered incidents',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    confirmButtonColor: "#28a745"
                  });
                }
            }else{
              for (const row of filteredData) {
                await Reject_F1_Filtered(row.id); 
              }
              Swal.fire({ 
                title: 'Success',
                text: "Successfully rejected F1 filtered incidents",
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: "#28a745"
              });
              fetchData();
            }
        }
      }catch(error){
        Swal.fire({
          title: 'Error',
          text: "Internal server error",
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: "#d33"
        });
      }   
    }

    const handleMoveForward = async()=>{
       try{
       if (filteredData.length === 0) {
             Swal.fire({
               title: "Warning",
               text: "No records to move forward.",
               icon: "warning",
               confirmButtonText: "OK",
               confirmButtonColor: "#f1c40f"
             });
             return;
        }
        const result = await Swal.fire({
             title: "Confirm",
             text: ":Are you sure you want to move forward all the Reject pending cases?",
             icon: "info",
             showCancelButton: true,
             confirmButtonText: "Forward",
              confirmButtonColor: "#28a745",
              cancelButtonColor: "#d33",
             cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
          
          const openTaskCount = await Open_Task_Count_Forward_F1_Filtered();
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

          if(filteredData.length>10){
              const parameters = {
                Status:"Reject Pending",
              }
              const response = await Create_Task_Forward_F1_Filtered(parameters);
              if(response.status===201){
                Swal.fire({ 
                  title: 'Success',
                  text: 'Successfully created task to forward F1 filtered incidents',
                  icon: 'success',
                  confirmButtonText: 'OK',
                  confirmButtonColor: "#28a745"
                });
              }
          
          }else{
            for (const row of filteredData) {
              await Forward_F1_Filtered(row.id); 
            }
            Swal.fire({ 
              title: 'Success',
              text: "Successfully forwarded F1 filtered incidents",
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: "#28a745"
            });
            fetchData();
          }
        }
      }catch(error){
        Swal.fire({
          title: 'Error',
          text: error?.message,
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: "#d33"
        });
      }   
    }

  return (
    <div>
       {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
      <div className={GlobalStyle.fontPoppins}>
        <div className="flex justify-between items-center w-full">
          <h1 className={`${GlobalStyle.headingLarge} mb-4`}>
            Pending Reject Incidents
          </h1>
          
        </div>

        <div className="flex justify-end items-center mb-4">
          {paginatedData.length > 0 && (
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

        {/* Filter Section */}
        <div  className="flex justify-end"> 
        <div className= {`${GlobalStyle.cardContainer}  items-center w-[70vw] mb-8 mt-8`}>
          {/* Source Selection */}
          <div className="flex items-center gap-4 justify-end">
          <div className="flex items-center gap-4">
            <label>Source:</label>
            <select
              className={GlobalStyle.selectBox}
              value={selectedSource} 
              onChange={(e) => setSelectedSource(e.target.value)}
              style={{ color: selectedSource === "" ? "gray" : "black" }}
            >
              <option value="" hidden>Select</option>
              <option value="Pilot Suspended" style={{ color: "black" }}>Pilot Suspended</option>
              <option value="Special" style={{ color: "black" }}>Special</option>
              <option value="Product Terminate" style={{ color: "black" }}>Product Terminate</option>
            </select>
          </div>

          {/* Date Picker Section */}
          <div className="flex items-center gap-2 ">
            <div className={GlobalStyle.datePickerContainer}>
              <label className={GlobalStyle.dataPickerDate}>Date:</label>
              <div className="flex gap-2">
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
            </div>
            {error && <span className={GlobalStyle.errorText}>{error}</span>}
          </div>

          {/* Filter Button */}
          <button
            className={`${GlobalStyle.buttonPrimary} h-[35px]`}
            onClick={handleFilterClick}
          >
            Filter
          </button>
          <button className={GlobalStyle.buttonRemove} onClick={handleclearFilter}>
                        Clear
            </button>

          </div>
        </div>
        </div>

        {/* Table Section */}
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
                  <th scope="col" className={GlobalStyle.tableHeader}></th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Id
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Status
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Account No
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Filtered Reason
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Rejected On
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Source Type
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    Created Dtm
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
                    <td className={GlobalStyle.tableData}  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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

                    <td
                      className={`${GlobalStyle.tableData} flex items-center justify-center`}
                    >
                      {row.status === "Reject Pending4" && (
                        <img
                          src={Reject_Pending}
                          alt="Reject Pending"
                          className="w-5 h-5"
                        />
                      )}
                    </td>

                    <td className={GlobalStyle.tableData}>{row.account_no}</td>
                    <td className={GlobalStyle.tableData}>
                      {row.filtered_reason}
                    </td>
                    <td className={GlobalStyle.tableData}>{row.rejected_on}</td>
                    <td className={GlobalStyle.tableData}>{row.source_type}</td>
                    <td className={GlobalStyle.tableData}>{row.created_dtm}</td>
                    <td
                      className={`${GlobalStyle.tableData} text-center px-6 py-4`}
                    >
                      <button
                        className={`${GlobalStyle.buttonPrimary} mx-auto`}
                        onClick={()=>{handleReject(row.id)}}
                      >
                        Reject
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

          <div className="flex justify-end items-center w-full mt-6">
            {/* Select All Data Checkbox */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded-lg"
                checked={selectAllData}
                onChange={handleSelectAllDataChange}
              />
              Select All
            </label>

            <button
              className={`${GlobalStyle.buttonPrimary} ml-4`}
              onClick={handleMoveForward}
            >
              Move Forward
            </button>
            <button
              className={`${GlobalStyle.buttonRemove} ml-4`}
              onClick={handleRejectAll}
            >
              Reject All
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
