/*Purpose: 
Created Date: 2025.01.22
Created By: Buthmi Mithara
Last Modified Date: 2025.01.24
Modified By:Nadali Linara
            Lasandi Randini (randini-im20057@stu.kln.ac.lk)
Version: node 11
ui number : 1.7.3
Dependencies: tailwind css
Related Files: 
Notes: 
*/

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaArrowLeft, FaArrowRight, FaSearch, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import Open_CPE_Collect from "../../assets/images/incidents/Only_CPE_Collect.png";
import {
  List_Incidents_CPE_Collect,
  Forward_CPE_Collect,
} from "../../services/Incidents/incidentService";
import {Create_Task_for_Forward_CPECollect,Open_Task_Count_Forward_CPE_Collect} from "../../services/task/taskService.js";
//import {Create_Task} from "../../services/task/taskService.js";
import {Create_Task} from "../../services/task/taskIncidentService.js";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";
import { getLoggedUserId } from "../../services/auth/authService.js";

export default function CollectOnlyCPECollect() {
  const [fromDate, setFromDate] = useState(null); // Usestate for From Date
  const [toDate, setToDate] = useState(null); // Usestate for To Date
  const [error, setError] = useState(""); // Usestate for Error
  const [selectAllData, setSelectAllData] = useState(false); // Usestate for Select All Data
  const [selectedRows, setSelectedRows] = useState([]); // Usestate for Selected Rows
  const [searchQuery, setSearchQuery] = useState(""); // Usestate for Search Query
  const [currentPage, setCurrentPage] = useState(0); // Usestate for Current Page
  const [selectedSource, setSelectedSource] = useState(""); // Usestate for Selected Source
  const [tableData, setTableData] = useState([]); // Usestate for Table Data
  const [isloading, setIsLoading] = useState(true); // Usestate for Loading
  const [filteredData, setFilteredData] = useState(tableData); // Usestate for Filtered Data
  const rowsPerPage = 7; // Number of rows per page
  const navigate = useNavigate();
  const [isCreatingTask, setIsCreatingTask] = useState(false); // Usestate for Creating Task

  const [userRole, setUserRole] = useState(null); // Role-Based Buttons

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

  // Function to fetch incident    
  const fetchData = async () => {
    try {
      const filters = {
        Source_Type: selectedSource,
        FromDate: fromDate,
        ToDate: toDate,
      };
      setIsLoading(true);
      const response = await List_Incidents_CPE_Collect(filters);
      if (response.data.length === 0) {
        Swal.fire({
          title: "No Data Found",
          text: "No incidents found for the selected filters.",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#f1c40f",
        });
        setTableData([]);
        setFilteredData([]);
        setIsLoading(false);
        return;
      }
      const formattedData = response?.data.map((item) => {
        const createdDateStr =
          typeof item.Created_Dtm === "string"
            ? item.Created_Dtm.replace(" ", "T")
            : item.Created_Dtm;
        const createdDate = createdDateStr ? new Date(createdDateStr) : null;

        return {
          id: item.Incident_Id || "",
          
          Incident_direction :item.Incident_direction || "",
          drc_commision_rule:item.drc_commision_rule||"",
          account_num: item.Account_Num || "",
          Arrears: item.Arrears || "",
          action: item.Actions || "",
          source_type: item?.Source_Type || "",
          created_dtm: createdDate instanceof Date && !isNaN(createdDate)
            ? createdDate.toLocaleString("en-GB") || ""
            : "",
        };
      });

      setTableData(formattedData);
      setFilteredData(formattedData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle the creation of a task for download button
  const handleCreateTaskForDownload = async () => {
    if (!selectedSource && !fromDate && !toDate) {
      Swal.fire({
        title: "Warning",
        text: "Please select a Source Type or provide a date range before creating a task.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f1c40f"
      });
      return;
    }

    if (!fromDate && !toDate) {
      Swal.fire({
        title: "Warning",
        text: "Please select a date range before creating a task.",
        icon: "warning",
        confirmButtonText: "OK",
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

    const confirmation = await Swal.fire({
      title: "Confirm Task Creation",
      text: "Are you sure you want to create this task?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, create it!",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancel",
    });

    if (!confirmation.isConfirmed) return;

    try {
      setIsCreatingTask(true);
      const response = await Create_Task({
        Source_Type: selectedSource,
        FromDate: fromDate,
        ToDate: toDate,
      });

      if (response.status === 201) {
        Swal.fire({
          title: "Success",
          text: "Task ID: " + response.data.Task_Id,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#28a745",
        });
      }
    } catch {
      Swal.fire({
        title: "Error",
        text: "Error creating task",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsCreatingTask(false);
    }
  };

  // Function to handle the proceed button click
  const handleProceed = async (Incident_Id) => {
    if (!selectedRows.includes(Incident_Id) && !Incident_Id) {
      Swal.fire({
        title: "Warning",
        text: "Row not selected",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to proceed with this action?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Proceed",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#28a745",
      cancelButtonText: "No",
    });

    if (!confirmResult.isConfirmed) {
      return;
    }
    try {
      const openTaskCount = await Open_Task_Count_Forward_CPE_Collect();
      if (openTaskCount > 0) {
        Swal.fire({
          title: "Action Blocked",
          text: "A task is already in progress.",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#f1c40f",
        });
        return;
      }
      const response = await Forward_CPE_Collect(Incident_Id);
      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#28a745",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
        }).then((result) => {
          if (result.isConfirmed) {
            setCurrentPage(0);
            setSelectedRows([]);
            setSelectAllData(false);
            fetchData();
          }
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Function to handle the creation of a task for selected rows
  const handleCreate = async () => {
    if (selectedRows.length === 0) {
      Swal.fire({
        title: "Warning",
        text: "No rows selected. Please select at least one incident.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    try {
      const openTaskCount = await Open_Task_Count_Forward_CPE_Collect();
      if (openTaskCount > 0) {
        Swal.fire({
          title: "Action Blocked",
          text: "A task is already in progress.",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#f1c40f",
        });
        return;
      }

      if (selectedRows.length > 5) {
        const confirmCreateTask = await Swal.fire({
          title: "Create Task?",
          text: "You have selected more than 5 incidents. Do you want to create a task instead?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, Create Task",
          cancelButtonColor: "#d33",
          confirmButtonColor: "#28a745",
          cancelButtonText: "Cancel",
        });

        if (!confirmCreateTask.isConfirmed) return;

        const userId = await getLoggedUserId();

        const parameters = {
          Proceed_Dtm: new Date(),
          Proceed_By: userId
        };
        const response = await Create_Task_for_Forward_CPECollect(parameters);

        if (response.status === 201) {
          Swal.fire({
            title: "Success",
            text: "Task successfully created for forwarding Collect CPE Only incidents.",
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#28a745",
          });
        }
        setSelectedRows([]);
        setSelectAllData(false);
      } else {
        const confirmProceed = await Swal.fire({
          title: "Proceed?",
          text: `You have selected ${selectedRows.length} incidents. Do you want to proceed?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, Proceed",
          cancelButtonColor: "#d33",
          confirmButtonColor: "#28a745",
          cancelButtonText: "Cancel",
        });

        if (!confirmProceed.isConfirmed) return;

        for (const row of selectedRows) {
          await Forward_CPE_Collect(row);
        }

        Swal.fire({
          title: "Success",
          text: "Successfully forwarded the selected Collect CPE Only incidents.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#28a745",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
        }).then((result) => {
          if (result.isConfirmed) {
            setCurrentPage(0);
            setSelectedRows([]);
            setSelectAllData(false);
            fetchData();
          }
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "An error occurred while processing your request.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
      console.error("Error:", error);
    }
  };

  // Function to handle the date change for From Date
  const handleFromDateChange = (date) => {
    if (toDate && date > toDate) {
      Swal.fire({
        title: "Error",
        text: "The 'From' date cannot be later than the 'To' date.",
        icon: "error",
        confirmButtonColor: "#f1c40f",
      });
    } else if (toDate) {
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

  // Function to handle the date change for To Date
  const handleToDateChange = (date) => {
    if (fromDate && date < fromDate) {
      Swal.fire({
        title: "Warning",
        text: "To date should be greater than or equal to From date",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f",  
      });
    } else if (fromDate) {
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

  // Function to handle the search query change
  useEffect(() => {
    setFilteredData(
      tableData.filter((row) =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
    setCurrentPage(0); // Reset to first page when search query changes
  }, [searchQuery, tableData]);

  const pages = Math.ceil(filteredData.length / rowsPerPage);

  // Function to handle the previous page button click
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to handle the next page button click
  const handleNextPage = () => {
    if (currentPage < pages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const startIndex = currentPage * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Function to handle the checkbox change for each row
  const handleRowCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Function to handle the select all checkbox change
  const handleSelectAllDataChange = () => {
    if (selectAllData) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map((row) => row.id));
    }
    setSelectAllData(!selectAllData);
  };

  // Function to handle the filter button click
  const handleFilterClick = () => {
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    if (!selectedSource && !from && !to) {
      Swal.fire({
        title: "Missing Filters",
        text: "Please select a Source Type or provide both From Date and To Date.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    if ((from && !to) || (!from && to)) {
      Swal.fire({
        title: "Incomplete Date Range",
        text: "Both From Date and To Date must be selected together.",
        icon: "warning",
        confirmButtonText: "OK",
        confirmButtonColor: "#f1c40f",
      });
      return;
    }

    if (selectedSource || (from && to)) {
      if (from && to) {
        const monthDiff =
          (to.getFullYear() - from.getFullYear()) * 12 +
          (to.getMonth() - from.getMonth());

        if (
          monthDiff > 1 ||
          (monthDiff === 1 && to.getDate() > from.getDate())
        ) {
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
                toDate: toDate,
              });
            }
          });
          return;
        }
      }
      setCurrentPage(0);
      setSearchQuery("");
      fetchData();
    }
  };

  // Function to handle the clear filter button click
  const handleclearfilter = () => {
    setFromDate(null);
    setToDate(null);
    setSelectedSource("");
    setSearchQuery("");
    setSelectAllData(false);
    setSelectedRows([]);
    setCurrentPage(0);
  }

  useEffect(() => {
    if (fromDate === null && toDate === null && selectedSource === "") {
      fetchData();
    }
  }, [fromDate, toDate, selectedSource]);

  // display loading animation when data is loading
  if (isloading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={GlobalStyle.fontPoppins}>
      {isloading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className={GlobalStyle.fontPoppins}>
          <div className="flex justify-between items-center w-full">
            <h1 className={`${GlobalStyle.headingLarge} mb-6`}>
              Incidents for Distribute to Collect Only CPE
            </h1>
          </div>
          
          <div className="flex justify-end items-center w-full mb-4">
            {paginatedData.length > 0 && (
              <div>
                {["admin", "superadmin", "slt"].includes(userRole) && (
                  <button
                    className={`${GlobalStyle.buttonPrimary} flex items-center ${isCreatingTask ? 'opacity-50' : ''}`}
                    disabled={isCreatingTask}
                    onClick={() => {
                      handleCreateTaskForDownload({
                        source_type: selectedSource,
                        fromDate: fromDate,
                        toDate: toDate,
                      });
                    }}
                  >
                    {!isCreatingTask && <FaDownload style={{ marginRight: '8px' }} />}
                    {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'}
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <div className={`${GlobalStyle.cardContainer} w-full items-center md:w-[75vw] mb-8 mt-8`}>
              <div className="flex gap-4 justify-end flex-wrap">
                <div className="flex flex-wrap items-center gap-4 sm:w-auto sm:flex-row sm:items-center">
                  <label>Source:</label>
                  <select
                    className={GlobalStyle.inputText}
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

                <label className="mt-1">Date:</label>
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

                <div>
                  {["admin", "superadmin", "slt"].includes(userRole) && (
                    <button
                      className={`${GlobalStyle.buttonRemove} w-full sm:w-auto`}
                      onClick={handleclearfilter}>
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            {/* Updated Search Section */}
            <div className="mb-4 flex justify-start">
              <div className={GlobalStyle.searchBarContainer}>
                <input
                  type="text"
                  placeholder=""
                  value={searchQuery}
                  onChange={(e) => {
                    setCurrentPage(0); // Reset to first page on search
                    setSearchQuery(e.target.value);
                  }}
                  className={GlobalStyle.inputSearch}
                />
                <FaSearch className={GlobalStyle.searchBarIcon} />
              </div>
            </div>
            
            {/* Table Section */}
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
                      Amount
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Action
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}>
                      Source Type
                    </th>
                    <th scope="col" className={GlobalStyle.tableHeader}></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData?.map((row, index) => (
                    <tr
                      key={index}
                      className={`${index % 2 === 0
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
                        {row.drc_commision_rule}
                      </td>

                      <td className={GlobalStyle.tableData}>
                        {row.account_num}
                      </td>
                      <td className={GlobalStyle.tableCurrency}>
  {typeof row.Arrears === 'number'
    ? row.Arrears.toLocaleString("en-LK", {
        style: "currency",
        currency: "LKR",
      })
    : ""}
</td>
                      <td className={GlobalStyle.tableData}>{row.action}</td>
                      <td className={GlobalStyle.tableData}>
                        {row.source_type}
                      </td>
                      <td className={`${GlobalStyle.tableData} text-center px-6 py-4`}>
                        <div>
                          {["admin", "superadmin", "slt"].includes(userRole) && (
                            <button
                              className={`${GlobalStyle.buttonPrimary} mx-auto`}
                              onClick={() => {
                                handleProceed(row.id);
                              }}
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

          {/* Pagination Section */}
          {tableData.length > rowsPerPage && (
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
          
          {/* Back Button Section */}
          <div className="flex justify-start items-center w-full mt-4 mb-4">
            <button
              className={`${GlobalStyle.buttonPrimary}`}
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft className="mr-2 mt" />
            </button>
          </div>
          
          {/* Select All Data and proceed button Section */}
          <div className="flex justify-end items-center w-full">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded-lg"
                checked={
                  selectAllData ||
                  tableData.every((row) => selectedRows.includes(row.id))
                }
                onChange={handleSelectAllDataChange}
              />
              Select All Data
            </label>

            <div>
              {["admin", "superadmin", "slt"].includes(userRole) && (
                <button
                  className={`${GlobalStyle.buttonPrimary} ml-4`}
                  onClick={handleCreate}
                >
                  Proceed
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}