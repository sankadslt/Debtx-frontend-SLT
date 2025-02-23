/*
Purpose: 
Created Date: 2025.01.21
Created By: K.K.C sakumini
Last Modified Date: 2025.01.22
Modified By:K.K.C Sakumini
            K.H.Lasandi Randini  
Version: node 11
ui number : 1.7.1
Dependencies: tailwind css
Related Files: 
Notes: 
*/

import { useState,useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";

import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {List_Distribution_Ready_Incidents,distribution_ready_incidents_group_by_arrears_band,Create_Case_for_incident} from "../../services/Incidents/incidentService";
import Open_No_Agent from "../../assets/images/Open_No_Agent.png"
import { Create_Task_for_OpenNoAgent,Create_Task_for_Create_CaseFromIncident , Open_Task_Count_Incident_To_Case} from "../../services/task/taskService";
import Swal from "sweetalert2";

export default function OpenIncident() {
  const [searchQuery, setSearchQuery] = useState(""); 
  const [selectAllData, setSelectAllData] = useState(false);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);  
  const [distributionData, setDistributionData] = useState({});
  const [ setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isProcessing,setIsProcessing] = useState(false); 


  const rowsPerPage = 7;

const fetchData = async () => {
  try {
    const response = await List_Distribution_Ready_Incidents();
    setData(response.data);

    const distributionResponse = await distribution_ready_incidents_group_by_arrears_band();
    setDistributionData(distributionResponse);
    
    const totalCount = Object.values(distributionResponse).reduce(
      (sum, count) => sum + count,
      0
    );
    setTotal(totalCount);
  } catch (error) {
    setError(error.message || "Failed to fetch data.");
  }
};


 useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async () => {
    try {
      const taskParams = {
       
      };
  
    
      const response = await Create_Task_for_OpenNoAgent(taskParams);
  
      Swal.fire({
        title: "Task Created Successfully!",
        text: `Task ID: ${response.Task_Id}`,
        icon: "success",
        confirmButtonText: "OK",
      });
  
     
      setSelectedRows([]);
      const updatedResponse = await List_Distribution_Ready_Incidents();
      setData(updatedResponse.data);
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: `Failed to create task. Error: ${err.message || "Unknown error"}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  
  
  const handleCaseforIncident = async () => {
    if (selectedRows.length === 0) {
      Swal.fire({
        title: "Warning",
        text: "Please select at least one incident.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
  
    setIsProcessing(true);
  
    try {
      const openTaskCount = await Open_Task_Count_Incident_To_Case();
      if (openTaskCount > 0) {
        Swal.fire({
          title: "Action Blocked",
          text: "There are existing open tasks. Please resolve them before proceeding.",
          icon: "warning",
          confirmButtonText: "OK",
        });
        setIsProcessing(false);
        return;
      }
  
      if (selectedRows.length > 10) {
        const taskParams = {
          Incident_Status: "Open No Agent",
        };
  
        const response = await Create_Task_for_Create_CaseFromIncident(taskParams);
        console.log("Response from Create_Task:", response);
        Swal.fire({
          title: "Task Created Successfully!",
          text: `Task created to handle ${selectedRows.length} incidents.`,
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        const response = await Create_Case_for_incident({ Incident_Ids: selectedRows });
  
        Swal.fire({
          title: "Cases Created Successfully!",
          text: `Successfully created ${response.cases.length} cases.`,
          icon: "success",
          confirmButtonText: "OK",
        });
      }
  
      setSelectedRows([]);
    } catch (error) {
      console.error("Error in handleCaseforIncident:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Action failed: Another set in progress.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsProcessing(false);
      await fetchData();  
    }
  };
  
 

  const filteredData = data.filter((row) =>
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
      setSelectedRows(data.map((row) => row.Incident_Id));
    }
    setSelectAllData(!selectAllData);
  };

  return (
    <>
      <div className={GlobalStyle.fontPoppins}>
        <div className="flex justify-between items-center w-full">
          <h1 className={`${GlobalStyle.headingLarge} m-0 mb-4`}>
            Incidents Open for Distribution
          </h1>
          <button
          className={`${GlobalStyle.buttonPrimary} pr-4`}
         onClick={handleCreateTask}
       
        >
          Create task and let me know
        </button>
        </div>

    
        <div className={`${GlobalStyle.caseCountBar}`}>
          <div className="flex mb-2">
            {" "}
            <span className={GlobalStyle.countBarTopic}>
              Open Pending Cases
            </span>
          </div>
          <div className={`${GlobalStyle.countBarSubTopicContainer} gap-4`}>
            {" "}
            <div className={`${GlobalStyle.countBarMainBox} py-2 px-6`}>
              {" "}
              <span>Total:</span>
              <p className={GlobalStyle.countBarMainTopic}>{total}</p>
            </div>
            <div className={`${GlobalStyle.countBarSubBox} py-2 px-6`}>
              {" "}
              <span>5,000 - 10,000</span>
              <p className={GlobalStyle.countBarSubTopic}>{distributionData["AB-5_10"] || 0}</p>
            </div>
            <div className={`${GlobalStyle.countBarSubBox} py-2 px-6`}>
              {" "}
              <span>10,000 - 25,000</span>
              <p className={GlobalStyle.countBarSubTopic}>{distributionData["AB-10_25"] || 0}</p>
            </div>
            <div className={`${GlobalStyle.countBarSubBox} py-2 px-6`}>
              {" "}
              <span>25,000 - 50,000</span>
              <p className={GlobalStyle.countBarSubTopic}>{distributionData["AB-25_50"] || 0}</p>
            </div>
            <div className={`${GlobalStyle.countBarSubBox} py-2 px-6`}>
              {" "}
              <span>50,000 - 100,000</span>
              <p className={GlobalStyle.countBarSubTopic}>{distributionData["AB-50_100"] || 0}</p>
            </div>
            <div className={`${GlobalStyle.countBarSubBox} py-2 px-6`}>
              {" "}
              <span>&gt; 100,000</span>
              <p className={GlobalStyle.countBarSubTopic}>{distributionData["AB-100_"] || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        
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
        <th className={GlobalStyle.tableHeader}></th>
        <th className={GlobalStyle.tableHeader}>ID</th>
        <th className={GlobalStyle.tableHeader}>Status</th>
        <th className={GlobalStyle.tableHeader}>Account No</th>
        <th className={GlobalStyle.tableHeader}>Action</th>
        <th className={GlobalStyle.tableHeader}>Amount</th>
        <th className={GlobalStyle.tableHeader}>Source Type</th>
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
              className="rounded-lg"
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
              {row.Incident_Status === "Open No Agent" && (
                <div title="open no agent" aria-label="open no agent">
                  <img
                    src={Open_No_Agent}
                    alt="open no agent"
                    className="w-5 h-5"
                  />
                </div>
              )}
            </div>
          </td>
          <td className={GlobalStyle.tableData}>{row.Account_Num}</td>
          <td className={GlobalStyle.tableData}>{row.Actions}</td>
          <td className={GlobalStyle.tableData}>
            {new Intl.NumberFormat("en-US").format(row.Arrears)}
          </td>
          <td className={GlobalStyle.tableData}>{row.Source_Type}</td>
        </tr>
      ))}
      {paginatedData.length === 0 && (
        <tr>
          <td colSpan="7" className="text-center py-4">
            No results found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

       
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

        <div className="flex justify-end items-center w-full mt-6">
          
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
  onClick={handleCaseforIncident}
  disabled={isProcessing || selectedRows.length === 0 }
>
  Proceed
</button>

        </div>
      </div>
    </>
  );
}
