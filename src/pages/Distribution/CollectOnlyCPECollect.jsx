/*Purpose: 
Created Date: 2025.01.22
Created By: Buthmi Mithara
Last Modified Date: 2025.01.24
Modified By:Nadali Linara
            K.H.Lasandi Randini  
Version: node 11
ui number : 1.7.3
Dependencies: tailwind css
Related Files: 
Notes: 
*/


import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaArrowLeft, FaArrowRight, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import Open_CPE_Collect from "../../assets/images/Open_CPE_Collect.png";
import { List_Incidents_CPE_Collect } from "../../services/Incidents/incidentService";
import { Create_Task } from "../../services/task/taskService.js";
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
  const [setIsLoading] = useState(false); 
  const rowsPerPage = 7;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await List_Incidents_CPE_Collect();
        setTableData(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch incidents.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  });

    const handleFilter = async () => {
      try {
        const filters = {
          Source_Type: selectedSource || null,
          From_Date: fromDate ? fromDate.toISOString().split("T")[0] : null,
          To_Date: toDate ? toDate.toISOString().split("T")[0] : null,
        };
  
        const response = await List_Incidents_CPE_Collect(filters);
        setTableData(response.data); 
        setCurrentPage(0); 
      } catch (err) {
        setError(err.message || "Failed to fetch filtered incidents.");
      }
    };

    
  
    // const handleCreateTask = async () => {
    //   const filteredParams = {
    //     Source_Type: selectedSource || null,
    //     From_Date: fromDate ? fromDate.toISOString().split("T")[0] : null,
    //     To_Date: toDate ? toDate.toISOString().split("T")[0] : null,
    //   };
    
    //   // Check if all parameters are empty
    //   if (!filteredParams.Source_Type && !filteredParams.From_Date && !filteredParams.To_Date) {
    //     setTaskMessage("Please provide at least one filter parameter to create a task.");
    //     return;
    //   }
    
    //   console.log("Filtered Params:", filteredParams);
    
    //   try {
    //     const response = await Create_Task(filteredParams);
    //     console.log("Task Creation Response:", response);
    
    //     if (response?.Task_Id) {
    //       setTaskMessage(`Task created successfully! Task ID: ${response.Task_Id}`);
    //     } else {
    //       throw new Error("Task ID is missing in the response.");
    //     }
    //   } catch (err) {
    //     console.error("Error creating task:", err);
    //     setTaskMessage(
    //       `Failed to create task. Error: ${err.message || "Unknown error"}`
    //     );
    //   }
    // };
      
    // const handleCreateTask = async () => {
    //   const filteredParams = {
    //     Source_Type: selectedSource || null,
    //     From_Date: fromDate ? fromDate.toISOString().split("T")[0] : null,
    //     To_Date: toDate ? toDate.toISOString().split("T")[0] : null,
    //   };
    
    //   if (!filteredParams.Source_Type && !filteredParams.From_Date && !filteredParams.To_Date) {
        
    //     return;
    //   }
    //   console.log("Filtered Params:", filteredParams);
    //   try {
    //     const response = await Create_Task(filteredParams);
    
    //     if (response?.Task_Id) {
    //       Swal.fire({
    //         title: "Task Created Successfully!",
    //         text: `Task ID: ${response.Task_Id}`,
    //         icon: "success",
    //         confirmButtonText: "OK",
    //       });
    //       // Refresh task blocks by re-fetching data
    //       const updatedResponse = await List_Incidents_CPE_Collect();
    //       setTableData(updatedResponse.data);
    //     } else {
    //       throw new Error("Task ID is missing in the response.");
    //     }
    //   } catch (err) {
    //     Swal.fire({
    //       title: "Error",
    //       text: `Failed to create task. Error: ${err.message || "Unknown error"}`,
    //       icon: "error",
    //       confirmButtonText: "OK",
    //     });
    //   }
    // };

    const handleCreateTask = async () => {
      const filteredParams = {
        Source_Type: selectedSource || null,
        From_Date: fromDate ? fromDate.toISOString().split("T")[0] : null,
        To_Date: toDate ? toDate.toISOString().split("T")[0] : null,
      };
    
      if (!filteredParams.Source_Type && !filteredParams.From_Date && !filteredParams.To_Date) {
        Swal.fire({
          title: "Validation Error",
          text: "Please provide at least one filter parameter to create a task.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        return;
      }
    
      try {
        const response = await Create_Task(filteredParams);
    
        if (response?.Task_Id) {
          Swal.fire({
            title: "Task Created Successfully!",
            text: `Task ID: ${response.Task_Id}`,
            icon: "success",
            confirmButtonText: "OK",
          });
    
          // Clear filter states
      setFromDate(null);
      setToDate(null);
      setSelectedSource("");

          // Re-fetch updated task data
          const updatedResponse = await List_Incidents_CPE_Collect();
          setTableData(updatedResponse.data); // Refresh task blocks with new data
        } else {
          throw new Error("Task ID is missing in the response.");
        }
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: `Failed to create task. Error: ${err.message || "Unknown error"}`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };
    
  const filteredData = tableData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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

  const handleRowCheckboxChange = (Incident_Id) => {
    if (selectedRows.includes(Incident_Id)) {
      setSelectedRows(selectedRows.filter((id) => id !== Incident_Id));
    } else {
      setSelectedRows([...selectedRows, Incident_Id]);
    }
  };
  const handleSelectAllDataChange = () => {
    if (selectAllData) {
      setSelectedRows([]);
    } else {
      setSelectedRows(tableData.map((row) => row.Incident_Id));
    }
    setSelectAllData(!selectAllData);
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

 
  return (
    <div className={GlobalStyle.fontPoppins}>
      <div className="flex justify-between items-center w-full gap-4">
      <h1 className={`${GlobalStyle.headingLarge} m-0 pr-4`}>
          Incidents Ready for Distribute to Collect Only CPE
        </h1>
        <button
          className={`${GlobalStyle.buttonPrimary} pr-4`}
         onClick={handleCreateTask}
       
        >
          Create task and let me know
        </button>
      </div>

      {/* Filter Section */}
      <div className="flex justify-end gap-10 my-12 items-center">
        {/* Source Dropdown */}
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

        {/* Date Picker Section */}
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

        {/* Filter Button */}
        <button
          className={`${GlobalStyle.buttonPrimary} h-[35px]`}
          onClick={handleFilter}
        >
          Filter
        </button>
      </div>

      {/* Table Section */}
      <div className="flex flex-col">
        {/* Search Bar Section */}
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
                      checked={selectedRows.includes(row.Incident_Id)}
                      onChange={() => handleRowCheckboxChange(row.Incident_Id)}
                    />
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <a href={`#${row.Incident_Id}`} className="hover:underline">
                      {row.Incident_Id}
                    </a>
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <div className="flex justify-center items-center h-full">
                      {row.Incident_Status === "Open CPE Collect" && (
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

                  <td className={GlobalStyle.tableData}>{row.Account_Num}</td>
                 
                  <td className={GlobalStyle.tableData}>{row.Action}</td>
                  <td className={GlobalStyle.tableData}>{row.Source_Type}</td>
                  <td
                    className={`${GlobalStyle.tableData} text-center px-6 py-4`}
                  >
                    <button
                      className={`${GlobalStyle.buttonPrimary} mx-auto`}
                      onClick={""}
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

      <div className="flex justify-end items-center w-full mt-6">
        {/* Select All Data Checkbox */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded-lg"
            checked={
              selectAllData ||
              tableData.every((row) =>
                selectedRows.includes(row.Incident_Id)
              )
            } // Reflect selection state
            onChange={handleSelectAllDataChange}
          />
          Select All Data
        </label>

        <Link
          className={`${GlobalStyle.buttonPrimary} ml-4`}
          to="/lod/ftllod/ftllod/downloadcreateftllod"
        >
          Proceed
        </Link>
      </div>
    </div>
  );
}