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
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import Open_CPE_Collect from "../../assets/images/Open_CPE_Collect.png";
import {
  List_Incidents_CPE_Collect,
  Forward_CPE_Collect,
} from "../../services/Incidents/incidentService";
import {
  Create_Task,
  Create_Task_for_Forward_CPECollect,
  Open_Task_Count_Forward_CPE_Collect,
} from "../../services/task/taskService.js";
import Swal from "sweetalert2";

export default function CollectOnlyCPECollect() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [error, setError] = useState("");
  const [selectAllData, setSelectAllData] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSource, setSelectedSource] = useState("");
  const [tableData, setTableData] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState(tableData);
  const rowsPerPage = 7;
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const filters = {
        Source_Type: selectedSource,
        FromDate: fromDate,
        ToDate: toDate,
      };
  
      const response = await List_Incidents_CPE_Collect(filters);
      const formattedData = response?.data.map((item) => {
        const createdDateStr =
          typeof item.Created_Dtm === "string"
            ? item.Created_Dtm.replace(" ", "T")
            : item.Created_Dtm;
        const createdDate = createdDateStr ? new Date(createdDateStr) : null;
  
        return {
          id: item.Incident_Id || "N/A",
          status: item.Incident_Status || "N/A",
          account_num: item.Account_Num || "N/A",
          action: item.Actions || "N/A",
          source_type: item?.Source_Type || "N/A",
          created_dtm: isNaN(createdDate)
            ? "N/A"
            : createdDate.toLocaleString() || "N/A",
        };
      });
  
      setTableData(formattedData);
      setFilteredData(formattedData);  
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  
  const handleCreateTaskForDownload = async ({
    source_type,
    fromDate,
    toDate,
  }) => {
    if (!source_type && !fromDate && !toDate) {
      Swal.fire({
        title: "Warning",
        text: "Please select a Source Type or provide a date range before creating a task.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      Swal.fire({
        title: "Incomplete Date Range",
        text: "Both From Date and To Date must be selected together.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const confirmation = await Swal.fire({
      title: "Confirm Task Creation",
      text: "Are you sure you want to create this task?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, create it!",
      cancelButtonText: "Cancel",
    });

    if (!confirmation.isConfirmed) return;

    try {
      const filteredParams = {
        Source_Type: source_type,
        FromDate: fromDate,
        ToDate: toDate,
      };

      const response = await Create_Task(filteredParams);

      if (response.status === 201) {
        Swal.fire({
          title: "Success",
          text: "Task successfully created",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch {
      Swal.fire({
        title: "Error",
        text: "Error creating task",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleProceed = async (Incident_Id) => {
    if (!selectedRows.includes(Incident_Id)) {
      Swal.fire({
        title: "Warning",
        text: "Row not selected",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to proceed with this action?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Proceed",
      cancelButtonText: "No",
    });
  
    if (!confirmResult.isConfirmed) {
      return;
    }
    try {
      const openTaskCount = await Open_Task_Count_Forward_CPE_Collect();
      if (openTaskCount > 0) {
        Swal.fire({
          title: "Warning",
          text: "A task is already in progress.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
      const response = await Forward_CPE_Collect(Incident_Id);
      if (response.status === 201) {
        Swal.fire({
          title: "Success",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        });
        fetchData();
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

 
  const handleCreate = async () => {
    if (selectedRows.length === 0) {
      Swal.fire({
        title: "Warning",
        text: "No rows selected. Please select at least one incident.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
  
    try {
      const openTaskCount = await Open_Task_Count_Forward_CPE_Collect();
      if (openTaskCount > 0) {
        Swal.fire({
          title: "Warning",
          text: "A task is already in progress. Please complete it first.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
  
      if (selectedRows.length > 9) {
       
        const confirmCreateTask = await Swal.fire({
          title: "Create Task?",
          text: "You have selected more than 9 incidents. Do you want to create a task instead?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, Create Task",
          cancelButtonText: "Cancel",
        });
  
        if (!confirmCreateTask.isConfirmed) return;
  
        const parameters = {
          Status: "Open CPE Collect",
          Incident_Ids: selectedRows,
        };
        const response = await Create_Task_for_Forward_CPECollect(parameters);
  
        if (response.status === 201) {
          Swal.fire({
            title: "Success",
            text: "Task successfully created for forwarding Collect CPE Only incidents.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
      } else {
        
        const confirmProceed = await Swal.fire({
          title: "Proceed?",
          text: `You have selected ${selectedRows.length} incidents. Do you want to proceed?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Yes, Proceed",
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
        });
  
        fetchData();
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred while processing your request.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error:", error);
    }
  };
  
  const handleFromDateChange = (date) => {
    if (toDate && date > toDate) {
      setError("The 'From' date cannot be later than the 'To' date.");
    } else {
      setError("");
      setFromDate(date);
    }
  };

  const handleToDateChange = (date) => {
    if (fromDate && date < fromDate) {
      setError("The 'To' date cannot be earlier than the 'From' date.");
    } else {
      setError("");
      setToDate(date);
    }
  };

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
      });
      return;
    }

    if ((from && !to) || (!from && to)) {
      Swal.fire({
        title: "Incomplete Date Range",
        text: "Both From Date and To Date must be selected together.",
        icon: "warning",
        confirmButtonText: "OK",
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

      setSearchQuery("");
      fetchData();
    }
  };

  return (
    <div className={GlobalStyle.fontPoppins}>
      {isloading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className={GlobalStyle.fontPoppins}>
          <div className="flex justify-between items-center w-full">
            <h1 className={`${GlobalStyle.headingLarge} m-0`}>
              Incidents for Distribute to Collect Only CPE
            </h1>
            <button
              className={`${GlobalStyle.buttonPrimary}`}
              onClick={() => {
                handleCreateTaskForDownload({
                  source_type: selectedSource,
                  fromDate: fromDate,
                  toDate: toDate,
                });
              }}
            >
              Create task and let me know
            </button>
          </div>

          <div className="flex justify-end gap-10 my-12 items-center">
            <div className="flex items-center gap-4">
              <label>Source:</label>
              <select
                className={GlobalStyle.inputText}
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Pilot Suspended">Pilot Suspended</option>
                <option value="Special">Special</option>
                <option value="Product Terminate">Product Terminate</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label>Date:</label>
              <DatePicker
                selected={fromDate}
                onChange={handleFromDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/MM/yyyy"
                className={GlobalStyle.inputText}
              />
              <DatePicker
                selected={toDate}
                onChange={handleToDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/MM/yyyy"
                className={GlobalStyle.inputText}
              />
              {error && <span className={GlobalStyle.errorText}>{error}</span>}
            </div>

            <button
              className={`${GlobalStyle.buttonPrimary} h-[35px]`}
              onClick={handleFilterClick}
            >
              Filter
            </button>
          </div>

          <div className="flex flex-col">
            <div className="mb-4 flex justify-start">
              <div className={GlobalStyle.searchBarContainer}>
                <input
                  type="text"
                  placeholder="Search..."
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
                          {row.status === "Open CPE Collect" && (
                            <div
                              title="Open CPE Collect"
                              aria-label="Open CPE Collect"
                            >
                              <img
                                src={Open_CPE_Collect}
                                alt="Open CPE Collect"
                                className="w-5 h-5"
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      <td className={GlobalStyle.tableData}>
                        {row.account_num}
                      </td>

                      <td className={GlobalStyle.tableData}>{row.action}</td>
                      <td className={GlobalStyle.tableData}>
                        {row.source_type}
                      </td>
                      <td
                        className={`${GlobalStyle.tableData} text-center px-6 py-4`}
                      >
                        <button
                          className={`${GlobalStyle.buttonPrimary} mx-auto`}
                          onClick={() => {
                            handleProceed(row.id);
                          }}
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

          <div className="flex justify-start items-center w-full  ">
            <button
              className={`${GlobalStyle.buttonPrimary} `} 
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
          </div>
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

            <button
              className={`${GlobalStyle.buttonPrimary} ml-4`}
              onClick={handleCreate}
            >
              Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
