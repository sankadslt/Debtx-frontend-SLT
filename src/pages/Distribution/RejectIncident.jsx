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
import { FaArrowLeft, FaArrowRight, FaSearch, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Import GlobalStyle
import Reject_Pending from "../../assets/images/incidents/Reject_Pending.png";
import { Create_Task_Forward_F1_Filtered, Create_Task_Reject_F1_Filtered, Forward_F1_Filtered, List_F1_filtered_incidents, Open_Task_Count_Forward_F1_Filtered, Open_Task_Count_Reject_F1_Filtered, Reject_F1_Filtered } from "../../services/distribution/distributionService.js";
//import { Create_Task_Download_Pending_Reject} from "../../services/distribution/distributionService.js";
import { Create_Task_Download_Pending_Reject} from "../../services/task/taskIncidentService.js";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";
import { useRef } from "react";
import { getLoggedUserId } from "../../services/auth/authService";

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

export default function RejectIncident() {
  const navigate = useNavigate();

  // Filter state
  const [fromDate, setFromDate] = useState(null); //for date
  const [toDate, setToDate] = useState(null); //for date
  const [error, setError] = useState(""); //for date
  const [tableData, setTableData] = useState([]); //for table data
  const [filteredData, setFilteredData] = useState(tableData); //for table data
  const [selectAllData, setSelectAllData] = useState(false); //for select all data
  const [selectedRows, setSelectedRows] = useState([]); //for selected rows
  const [searchQuery, setSearchQuery] = useState(""); //for search query
  const [currentPage, setCurrentPage] = useState(0);   //for pagination
  const [selectedSource, setSelectedSource] = useState(""); //for source type
  const [isLoading, setIsLoading] = useState(false); //for loading state
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons
  const clearTriggeredRef = useRef(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false); //for creating task state
  const [isRejecting, setIsRejecting] = useState(false); //for rejecting state

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

  // Fetch data from API
  const fetchData = async () => {
    try {
      const filters = {
        Source_Type: selectedSource,
        FromDate: fromDate,
        ToDate: toDate
      }
      //console.log("Filters:", filters);
      setIsLoading(true);
      const response = await List_F1_filtered_incidents(filters);
      if (response.data.length === 0) {
        Swal.fire({
          title: "No Data Found",
          text: "There are no Reject Pending incidents for the selected filters.",
          icon: "warning",
          confirmButtonColor: "#f1c40f"
        });
        setTableData([]);
        setIsLoading(false);
        return;
      }
      const formattedData = response?.data.map((item) => {

        const createdDateStr = typeof item.Created_Dtm === "string" ? item.Created_Dtm.replace(" ", "T") : item.Created_Dtm;
        const rejectedDateStr = typeof item.Rejected_Dtm === "string" ? item.Rejected_Dtm.replace(" ", "T") : item.Rejected_Dtm;
        const createdDate = createdDateStr ? new Date(createdDateStr) : null;
        const rejectedDate = rejectedDateStr ? new Date(rejectedDateStr) : null;

        return {
          id: item.Incident_Id || "",
          Incident_direction:item.Incident_direction||"",
          drc_commision_rule: item.drc_commision_rule || "",
          account_no: item.Account_Num || "",
          filtered_reason: item.Filtered_Reason || "",
          Arrears: item.Arrears || "",
          source_type: item?.Source_Type || "",
          rejected_on: rejectedDate instanceof Date && !isNaN(rejectedDate) ? rejectedDate.toLocaleString("en-GB") : "",
          created_dtm: createdDate instanceof Date && !isNaN(createdDate) ? createdDate.toLocaleString("en-GB") : ""
        };
      });
      setTableData(formattedData);
      setIsLoading(false);
    } catch {
      setError("Failed to fetch DRC details. Please try again later.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when the component mounts or when filters change 
  useEffect(() => {
    fetchData();
  }, []);


  // validation for date
  const handleFromDateChange = (date) => {
    if (toDate && date > toDate) {
      Swal.fire({
        title: "warning",
        text: "The 'From' date cannot be later than the 'To' date.",
        icon: "warning",
        confirmButtonColor: "#f1c40f"
      });;
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
      setError("");
      setFromDate(date);
    }
  };

  // validation for date
  const handleToDateChange = (date) => {
    if (fromDate && date < fromDate) {
      Swal.fire({
        title: "warning",
        text: "The 'To' date cannot be earlier than the 'From' date.",
        icon: "warning",
        confirmButtonColor: "#f1c40f"
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

  // Pagination functions
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Pagination functions
  const handleNextPage = () => {
    if (currentPage < pages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Paginated data
  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Checkbox functions
  const handleRowCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((id) => id !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Select All Data Checkbox
  const handleSelectAllDataChange = () => {
    if (selectAllData) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((row) => row.id));
    }
    setSelectAllData(!selectAllData);
  };

  // Filter function
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
      setCurrentPage(0); // Reset to first page
      fetchData();
      setSearchQuery("")
    }
  };

  // Clear filter function
  const handleclearFilter = () => {
    setCurrentPage(0); // Reset to first page
    setFromDate(null);
    setToDate(null);
    setSelectedSource("");
    clearTriggeredRef.current = true; // Set flag to indicate clear was triggered
  }

  useEffect(() => {
    if (clearTriggeredRef.current) {
      fetchData();
      clearTriggeredRef.current = false; // Reset for next time
    }
  }, [fromDate, toDate, selectedSource]);

  // Create task for download function
  const handleCreateTaskForDownload = async () => {
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

    if (!selectedSource && !fromDate && !toDate) {
      Swal.fire({
        title: 'Warning',
        text: 'Please select a Source Type or provide a date range before creating a task.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: "#f1c40f"
      });
    } else if (!fromDate && !toDate) {
      Swal.fire({
        title: "Warning",
        text: "Please select a date range.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f1c40f"
      });
      return;
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
    } else {
      try {
        setIsCreatingTask(true); // Set creating task state to true
        const response = await Create_Task_Download_Pending_Reject({
          Source_Type: selectedSource,
          From_Date: fromDate,
          To_Date: toDate
        });
        if (response.status === 201) {
          Swal.fire({
            title: 'Success',
            text: 'Task successfully created',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: "#28a745"
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Error creating task',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: "#d33"
        });
      } finally {
        setIsCreatingTask(false); // Reset creating task state
      }
    }
  };

  // Handle reject function
  const handleReject = async (Incident_Id) => {
    if (!selectedRows.includes(Incident_Id) && !Incident_Id) {
      Swal.fire({
        title: 'Warning',
        text: 'Row not selected',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: "#f1c40f"
      });
      return;
    }

    try {
      setIsRejecting(true); // Set rejecting state to true
      const openTaskCountReject = await Open_Task_Count_Reject_F1_Filtered();
      const openTaskCountForward = await Open_Task_Count_Forward_F1_Filtered();
      if (openTaskCountReject > 0 || openTaskCountForward > 0) {
        Swal.fire({
          title: "Action Blocked",
          text: "A task is already in progress.",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#f1c40f"
        });
        return;
      }
      const response = await Reject_F1_Filtered(Incident_Id);

      if (response.status === 200) {
        Swal.fire({
          title: 'Success',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: "#28a745",
          allowOutsideClick: false,  // Prevent closing by clicking outside
          allowEscapeKey: false,     // Disable closing with the Escape key
          allowEnterKey: false       // Disable dismissing with Enter
        }).then((result) => {
          if (result.isConfirmed) {
            setCurrentPage(0); // Reset to first page
            setSelectedRows([]); // Clear selected rows after rejection
            setSelectAllData(false); // Clear select all checkbox
            fetchData();
          }
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: "#d33"
      });
    } finally {
      setIsRejecting(false); // Reset rejecting state
    }
  }

  // Handle reject all function
  const handleRejectAll = async () => {

    try {
      setIsRejecting(true); // Set rejecting state to true
      if (selectedRows.length === 0) {
        Swal.fire({
          title: "Warning",
          text: "No records selected to reject.",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#f1c40f"
        });
        return;
      }
      const result = await Swal.fire({
        title: "Confirm",
        text: `Are you sure you want to proceed with ${selectedRows.length} selected cases?`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Yes",
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {

        const openTaskCountReject = await Open_Task_Count_Reject_F1_Filtered();
        const openTaskCountForward = await Open_Task_Count_Forward_F1_Filtered();
        if (openTaskCountReject > 0 || openTaskCountForward > 0) {
          Swal.fire({
            title: "Action Blocked",
            text: "A task is already in progress.",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#f1c40f"
          });
          return;
        }
        // if (openTaskCount > 0) {
        //   Swal.fire({
        //     title: "Action Blocked",
        //     text: "A task is already in progress.",
        //     icon: "warning",
        //     confirmButtonText: "OK",
        //     confirmButtonColor: "#f1c40f"
        //   });
        //   return;
        // }
        if (selectedRows.length > 5) { // okkoma silect karala reject all dunnoth hari  // sweet alert add // add the date to the parameaters //condition change
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

          // const today = new Date().toISOString().split("T")[0];
          // Proceed_Dtm: new Date().toISOString(),


          const user = await getLoggedUserId();

          const parameters = {
            Status: "Reject Pending",
            Proceed_Dtm: new Date(),
            Proceed_By: user
          }
          const response = await Create_Task_Reject_F1_Filtered(parameters);
          if (response.status === 201) {
            Swal.fire({
              title: 'Success',
              text: 'Successfully created task to reject the records',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: "#28a745"
            });
          }
        } else {
          // Loop through selected rows and reject each one api call repeat karanawa 
          for (const row of selectedRows) {
            await Reject_F1_Filtered(row);
          }
          // if i send it like this the api call will not be repeated.
          //await Reject_F1_Filtered(selectedRows); // selectedRows = [1, 2, 3, 4]
          Swal.fire({
            title: 'Success',
            text: "Successfully rejected selected records",
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: "#28a745",
            allowOutsideClick: false,  // Prevent closing by clicking outside
            allowEscapeKey: false,     // Disable closing with the Escape key
            allowEnterKey: false       // Disable dismissing with Enter
          }).then((result) => {
            if (result.isConfirmed) {
              setCurrentPage(0); // Reset to first page
              fetchData();
              setSelectedRows([]); // Clear selected rows after rejection
              setSelectAllData(false); // Clear select all checkbox
            }
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || "Internal server error",
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: "#d33"
      });
    } finally {
      setIsRejecting(false); // Reset rejecting state
    }
  }

  // Handle move forward function
  const handleMoveForward = async () => {
    try {
      setIsRejecting(true); // Set rejecting state to true
      if (selectedRows.length === 0) {
        Swal.fire({
          title: "Warning",
          text: "No records selected to forward.",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#f1c40f"
        });
        return;
      }
      const result = await Swal.fire({
        title: "Confirm",
        text: `Are you sure you want to proceed with ${selectedRows.length} selected cases?`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Yes, Forward",
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancel",

      });

      if (result.isConfirmed) {

        const openTaskCountReject = await Open_Task_Count_Reject_F1_Filtered();
        const openTaskCountForward = await Open_Task_Count_Forward_F1_Filtered();
        if (openTaskCountReject > 0 || openTaskCountForward > 0) {
          Swal.fire({
            title: "Action Blocked",
            text: "A task is already in progress.",
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#f1c40f"
          });
          return;
        }

        if (selectedRows.length > 5) {
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

          // const today1 = new Date().toISOString().split("T")[0];
          // Proceed_Dtm: new Date().toISOString(),

          const user = await getLoggedUserId();

          const parameters = {
            Status: "Reject Pending",
            Incident_Forwarded_By: user,
            Incident_Forwarded_On: new Date(),
          }
          const response = await Create_Task_Forward_F1_Filtered(parameters);
          if (response.status === 201) {
            Swal.fire({
              title: 'Success',
              text: 'Successfully created task to forward the records',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: "#28a745"
            });
          }

        } else {

          for (const row of selectedRows) {
            await Forward_F1_Filtered(row);
          }
          Swal.fire({
            title: 'Success',
            text: "Successfully forwarded selected records",
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: "#28a745",
            allowOutsideClick: false,  // Prevent closing by clicking outside
            allowEscapeKey: false,     // Disable closing with the Escape key
            allowEnterKey: false       // Disable dismissing with Enter
          }).then((result) => {
            if (result.isConfirmed) {
              setCurrentPage(0); // Reset to first page
              fetchData();
              setSelectedRows([]); // Clear selected rows after move forward
              setSelectAllData(false); // Clear select all checkbox
            }
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error?.message || "Internal server error",
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: "#d33"
      });
    } finally {
      setIsRejecting(false); // Reset rejecting state
    }
  }

  // display loading animation when data is loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
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
                className={`${GlobalStyle.buttonPrimary} flex items-center ${isCreatingTask ? 'opacity-50' : ''}`}
                onClick={() => {
                  handleCreateTaskForDownload({
                    source_type: selectedSource,
                    fromDate: fromDate,
                    toDate: toDate
                  })
                }}
                disabled={isCreatingTask}
              >
                {!isCreatingTask && <FaDownload style={{ marginRight: '8px' }} />}
                {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'}
              </button>
            )}
          </div>

          {/* Filter Section */}
          <div className="flex justify-end">
            <div className={`${GlobalStyle.cardContainer}  items-center w-full md:w-[70vw] mb-8 mt-8`}>
              {/* Source Selection */}
              <div className="flex flex-wrap items-center gap-4 justify-end">
                <div className="flex items-center gap-4 sm:w-auto sm:flex-row sm:items-center">
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
                <div className="flex items-center gap-2 sm:w-auto  sm:items-center ">
                  {/* <div className={GlobalStyle.datePickerContainer}> */}
                  <label className={`${GlobalStyle.dataPickerDate} `}>Date:</label>
                  <div className="flex flex-wrap gap-2 justify-end">
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
                  </div>
                  {/* </div> */}
                  {/* {error && <span className={GlobalStyle.errorText}>{error}</span>} */}
                </div>

                {/* Filter Button */}
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
                {/* <button
            className={`${GlobalStyle.buttonPrimary} h-[35px]`}
            onClick={handleFilterClick}
          >
            Filter
          </button> */}

                <div>
                  {["admin", "superadmin", "slt"].includes(userRole) && (
                    <button className={`${GlobalStyle.buttonRemove}  w-full sm:w-auto`} onClick={handleclearFilter}>
                      Clear
                    </button>
                  )}
                </div>
                {/* <button className={GlobalStyle.buttonRemove} onClick={handleclearFilter}>
                        Clear
            </button> */}

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
            <div className={`${GlobalStyle.tableContainer} overflow-x-auto w-full`}>
              <table className={GlobalStyle.table}>
                <thead className={GlobalStyle.thead}>
                  <tr>
                    <th scope="col" className={GlobalStyle.tableHeader}></th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Incident ID
                    </th>
                  
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Service Type
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Account No
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Filtered Reason
                    </th>
                    {/* <th scope="col" className={GlobalStyle.tableHeader}>
                      Rejected On
                    </th> */}
                      <th scope="col" className={GlobalStyle.tableHeader}>
                  Amount
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
                      className={`${index % 2 === 0
                        ? "bg-white bg-opacity-75"
                        : "bg-gray-50 bg-opacity-50"
                        } border-b`}
                    >
                      <td className={GlobalStyle.tableData} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                        className= {GlobalStyle.tableData}>{row.drc_commision_rule}</td>

                      <td className={GlobalStyle.tableData}>{row.account_no}</td>
                      <td className={GlobalStyle.tableData}>
                        {row.filtered_reason}
                      </td>
                      {/* <td className={GlobalStyle.tableData}>{row.rejected_on}</td> */}
                       
                      <td className={GlobalStyle.tableCurrency}>
  {typeof row.Arrears === 'number'
    ? row.Arrears.toLocaleString("en-LK", {
        style: "currency",
        currency: "LKR",
      })
    : ""}
</td>
                      <td className={GlobalStyle.tableData}>{row.source_type}</td>
                      <td className={GlobalStyle.tableData}>{row.created_dtm}</td>
                      <td
                        className={`${GlobalStyle.tableData} text-center px-6 py-4`}
                      >
                        <div>
                          {["admin", "superadmin", "slt"].includes(userRole) && (
                            <button
                              className={`${GlobalStyle.buttonPrimary} mx-auto ${isRejecting ? 'opacity-50' : ''}`}
                              onClick={() => { handleReject(row.id) }}
                              disabled={isRejecting}
                            >
                              Reject
                            </button>
                          )}
                        </div>
                        {/* <button
                        className={`${GlobalStyle.buttonPrimary} mx-auto`}
                        onClick={()=>{handleReject(row.id)}}
                      >
                        Reject
                      </button> */}
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

              <div>
                {["admin", "superadmin", "slt"].includes(userRole) && (
                  <button
                    className={`${GlobalStyle.buttonPrimary} ml-4 w-full sm:w-auto ${isRejecting ? 'opacity-50' : ''}`}
                    onClick={handleMoveForward}
                    disable={isRejecting}
                  >
                    Move Forward
                  </button>
                )}
              </div>
              {/* <button
              className={`${GlobalStyle.buttonPrimary} ml-4`}
              onClick={handleMoveForward}
            >
              Move Forward
            </button> */}
              <div>
                {["admin", "superadmin", "slt"].includes(userRole) && (
                  <button
                    className={`${GlobalStyle.buttonRemove} ml-4 w-full sm:w-auto ${isRejecting ? 'opacity-50' : ''}`}
                    onClick={handleRejectAll}
                    disabled={isRejecting}
                  >
                    Reject All
                  </button>
                )}
              </div>
              {/* <button
              className={`${GlobalStyle.buttonRemove} ml-4`}
              onClick={handleRejectAll}
            >
              Reject All
            </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
