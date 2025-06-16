/*
Purpose: 
Created Date: 2025.01.21
Created By: K.K.C sakumini
Last Modified Date: 2025.01.22
Modified By:K.K.C Sakumini
            Lasandi Randini (randini-im20057@stu.kln.ac.lk) 
Version: node 11
ui number : 1.7.1
Dependencies: tailwind css
Related Files: 
Notes:  
*/

import { useState,useEffect } from "react"; 
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../services/auth/authService";
import { getLoggedUserId } from "../../services/auth/authService";
import { FaSearch, FaArrowLeft, FaArrowRight , FaDownload } from "react-icons/fa";
import {List_Distribution_Ready_Incidents,distribution_ready_incidents_group_by_arrears_band,Create_Case_for_incident} from "../../services/Incidents/incidentService";
import Open_No_Agent from "../../assets/images/incidents/Open_No_Agent.png";
import { Create_Task_for_OpenNoAgent,Create_Task_for_Create_CaseFromIncident , Open_Task_Count_Incident_To_Case} from "../../services/task/taskService";
import Swal from "sweetalert2";
import  { Tooltip } from "react-tooltip";

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";
 
 

export default function OpenIncident() {
  const [searchQuery, setSearchQuery] = useState("");  //  usestate for the Search bar
  const [selectAllData, setSelectAllData] = useState(false); // usestate for the Select all checkbox
  const [data, setData] = useState([]); // usestate for the data
  const [total, setTotal] = useState(0);  // usestate for the total number of incidents
  const [distributionData, setDistributionData] = useState({}); // usestate for the distribution data
  const [ setError] = useState(null); // usestate for the error message
  const [currentPage, setCurrentPage] = useState(0); // usestate for the current page
  const [selectedRows, setSelectedRows] = useState([]); // usestate for the selected rows
  const [isProcessing,setIsProcessing] = useState(false); // usestate for the processing state
const [user, setUser] = useState(null); // usestate for the user data

const [userRole, setUserRole] = useState(null); // Role-Based Buttons
const navigate = useNavigate();

  const rowsPerPage = 7;

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

  // UseEffect to fetch user data and incident data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user_id = await getLoggedUserId();
        setUser(user_id);
        //console.log("User ID:", user_id);
        
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    fetchUser();
    fetchData();
  }, []);

  // Function to fetch data
const fetchData = async () => {
  try {
    const response = await List_Distribution_Ready_Incidents();
    setData(response.data);
    console.log("Fetched Data:", response.data);

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

  // Function to handle task creation
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
        confirmButtonColor: "#28a745"
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
        confirmButtonColor: "#d33"
      });
    }
  };
  
  // Function to handle case creation for incidents
 const handleCaseforIncident = async () => {
  if (selectedRows.length === 0) {
    Swal.fire({
      title: "Warning",
      text: "Please select at least one incident.",
      icon: "warning",
      confirmButtonText: "OK",
       confirmButtonColor: "#f1c40f"
    });
    return;
  }

  const confirmResult = await Swal.fire({
    title: "Confirmation",
    text: `Are you sure you want to proceed with ${selectedRows.length} selected cases?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Proceed",
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#d33",
    cancelButtonText: "No",
  });

  if (!confirmResult.isConfirmed) {
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
        confirmButtonColor: "#f1c40f"
      });
      setIsProcessing(false);
      return;
    }

    if (selectedRows.length > 5) {
     
      const taskConfirmResult = await Swal.fire({
        title: "Create Task Confirmation",
        text: `You have selected more than 5 incidents. Do you want to create a task to handle all of them?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Create Task",
        cancelButtonText: "No, Cancel",
        confirmButtonColor: "#28a745",
        cancelButtonColor: "#d33",
      });

      if (!taskConfirmResult.isConfirmed) {
        setIsProcessing(false);
        return;  
      }

      
      const taskParams = {
        //Incident_Status: "Open No Agent",
        Proceed_By: user,
        Proceed_Dtm: new Date(),
      };

      const response = await Create_Task_for_Create_CaseFromIncident(taskParams);
      // console.log("Response from Create_Task:", response);
      Swal.fire({
        title: "Task Created Successfully!",
        text: `Task created to handle incidents.`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#28a745",
      });
    } else {
      
      

      // const response = await Create_Case_for_incident({
      //   Incident_Ids: selectedRows,
      //   Proceed_By: user,
      //  // Proceed_Dtm: new Date().toISOString().split("T")[0],
      // });
      for (const row of selectedRows) {
        await Create_Case_for_incident(row);
      }

      Swal.fire({
        title: "Cases Created Successfully!",
        text: `Successfully created ${response.cases.length} cases.`,
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#28a745",
      });
    }

    setSelectedRows([]);
  } catch (error) {
    // console.error("Error in handleCaseforIncident:", error);
    Swal.fire({
      title: "Error",
      text:  error.message || "Action failed: Another set in progress.",
      icon: "error",
      confirmButtonText: "OK",
      confirmButtonColor: "#d33",
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

  // Function to handle previous and next page navigation
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

  // Function to handle checkbox change for individual rows
  const handleRowCheckboxChange = (Incident_Id) => {
     
    if (selectedRows.includes(Incident_Id)) {
      setSelectedRows(selectedRows.filter((id) => id !== Incident_Id));
    } else {
      setSelectedRows([...selectedRows, Incident_Id]);
    }
  };
  
  // Function to handle select all checkbox change
  const handleSelectAllDataChange = () => {
    if (selectAllData) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((row) => row.Incident_Id));
    }
    setSelectAllData(!selectAllData);
  };

  // Function to handle back navigation
  const handlebacknavigate = () => {
    window.history.back(); // Go back to the previous page
  }
  return (
    <>
      <div className={GlobalStyle.fontPoppins}>
        <div className="flex justify-between items-center w-full">
          <h1 className={`${GlobalStyle.headingLarge} m-0 mb-4`}>
            Incidents Open for Distribution
          </h1>
          
        </div>

        <div className="flex justify-end items-center mb-4">
        {/* <button
          className={`${GlobalStyle.buttonPrimary}   pr-4 flex items-center mb-4`}
         onClick={handleCreateTask}
       
        >
        <FaDownload className="mr-1" />
          Create task and let me know
        </button> */}
        { paginatedData.length > 0 && (
        <div>
            {["admin", "superadmin", "slt"].includes(userRole) && (
               <button
               className={`${GlobalStyle.buttonPrimary}   pr-4 flex items-center mb-4`}
              onClick={handleCreateTask}
            
             >
             <FaDownload className="mr-1" />
               Create task and let me know
             </button>
            )}
        </div>
        )}
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
              <span> 100,000 &lt;</span>
              <p className={GlobalStyle.countBarSubTopic}>{distributionData["AB-100_"] || 0}</p>
            </div>
            <div className={`${GlobalStyle.countBarSubBox} py-2 px-6`}>
              {" "}
              <span> CP_Collect </span>
              <p className={GlobalStyle.countBarSubTopic}>{distributionData["CP_Collect"] || 0}</p>
            </div>
            <div className={`${GlobalStyle.countBarSubBox} py-2 px-6`}>
              {" "}
              <span> &lt; 1000 </span>
              <p className={GlobalStyle.countBarSubTopic}>{distributionData["AB-0_1"] || 0}</p>
            </div>
            <div className={`${GlobalStyle.countBarSubBox} py-2 px-6`}>
              {" "}
              <span> 1000 - 2500 </span>
              <p className={GlobalStyle.countBarSubTopic}>{distributionData["AB-1-2.5"] || 0}</p>
            </div>
            <div className={`${GlobalStyle.countBarSubBox} py-2 px-6`}>
              {" "}
              <span> 2500 - 5000 </span>
              <p className={GlobalStyle.countBarSubTopic}>{distributionData["AB-2.5-5"] || 0}</p>
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

       {/* Table Section */}
      <div className={`${GlobalStyle.tableContainer} overflow-x-auto w-full`}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th className={GlobalStyle.tableHeader}></th>
                <th className={GlobalStyle.tableHeader}>ID</th>
                <th className={GlobalStyle.tableHeader}>Status</th>
                <th className={GlobalStyle.tableHeader}>Account No</th>
                <th className={GlobalStyle.tableHeader}>Action</th>
                <th className={GlobalStyle.tableHeader}>Amount (LKR)</th>
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
                  <td className={GlobalStyle.tableData}  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                        <div data-tooltip-id="incident-tooltip">
                          <img
                            src={Open_No_Agent}
                            alt="open no agent"
                            
                            className="w-5 h-5"
                          />
                        </div>

                      )}
                    </div>
                    <Tooltip id="incident-tooltip" place="bottom" content="Open No Agent" />
                  </td>
                  <td className={GlobalStyle.tableData}>{row.Account_Num}</td>
                  <td className={GlobalStyle.tableData}>{row.Actions}</td>
                  <td className={`${GlobalStyle.tableCurrency}`}>
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

       {/* Pagnation section */}
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
      <div className="flex justify-start items-center w-full mt-4 mb-4">
            <button
              className={`${GlobalStyle.buttonPrimary} `} 
              onClick={ handlebacknavigate}
            >
              <FaArrowLeft className="mr-1" />
            
            </button>
          </div>
        <div className="flex justify-end items-center w-full ">
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded-lg"
              checked={selectAllData}
              onChange={handleSelectAllDataChange}
            />
            Select All
          </label>
          {/* <button
                className={`${GlobalStyle.buttonPrimary} ml-4`}
                onClick={handleCaseforIncident}
                disabled={isProcessing}
                

              >
                Proceed
        </button> */}
        <div>
            {["admin", "superadmin", "slt"].includes(userRole) && (
               <button
                    className={`${GlobalStyle.buttonPrimary} ml-4`}
                    onClick={handleCaseforIncident}
                    disabled={isProcessing}
                    

                  >
                    Proceed
                </button>
            )}
        </div>

        </div>
      </div>
    </>
  );
}
