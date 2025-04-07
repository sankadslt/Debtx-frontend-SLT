/*Purpose: This template is used for the 1.A.14 - Case Distribution DRC Summary
Created Date: 2025-01-25
Created By: Udana (udanarajanayaka220@gmail.com)
Version: node 20
ui number : 1.A.14
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the codes */

import { useState , useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch , FaArrowLeft , FaDownload} from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { Active_DRC_Details } from "/src/services/drc/Drc.js";
import {List_Case_Distribution_Details , Create_Task_For_case_distribution_drc_summery} from "/src/services/case/CaseServices.js";
import {getLoggedUserId} from "/src/services/auth/authService.js";
import Swal from "sweetalert2";

const CaseDistributionDRCSummary = () => {


  // State for filters and table
  const [selectedDRC, setSelectedDRC] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDRCKey, setSelectedDRCKey] = useState("");
  const [drcNames, setDrcNames] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const batchId = location.state?.BatchID;



  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  // Filtering the data based on search query
  const filteredDataBySearch = Array.isArray(filteredData)? filteredData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )
  : [];

  // Apply pagination to the search-filtered data
  const currentData = filteredDataBySearch.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

   useEffect(() => {
      const fetchDRCNames = async () => {
        try {
          const Names = await Active_DRC_Details();
          setDrcNames(Names);
        } catch (error) {
          console.error("Error fetching drc names:", error);
        }
      };
      fetchDRCNames();
    });


  // Modified handleDRCChange to only update state without filtering
  const handleDRCChange = (e) =>  {
    const selectedValue = e.target.value;
  
    // Find the corresponding key from drcNames
    const selectedDRCObject = drcNames.find(({ value }) => value === selectedValue);
    
    if (selectedDRCObject) {
      const selectedKey = selectedDRCObject.id;
      
      // Store both value and key in state (if needed)
      setSelectedDRC(selectedValue);
      setSelectedDRCKey(selectedKey);
  
      console.log("Selected DRC: ", selectedValue);
      console.log("Selected DRC ID: ", selectedKey);
    }
  };

  useEffect(() => {
    const payload = {
      case_distribution_batch_id: batchId || "2",
    };
    const fetchFilteredData = async () => {
      try {
        const filteredData = await List_Case_Distribution_Details(payload);
        setFilteredData(filteredData);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
        setFilteredData([]);
      }
    }
    fetchFilteredData();
  }, [batchId]);

  // Handle filter action - all filtering happens here
  const handleFilter = () => {
    const payload = {
      case_distribution_batch_id: batchId || "2",
      drc_id: selectedDRCKey,
    };
    console.log("Filter payload: ", payload);
    const fetchFilteredData = async () => {
      try {
        const filteredData = await List_Case_Distribution_Details(payload);
        setFilteredData(filteredData);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
        setFilteredData([]);
      }
    }
    fetchFilteredData();
  };

  // Handle clear filters action
  const handleclearfilters = () => {
    
    setSelectedDRC("");
    setSelectedDRCKey("");
    setSearchQuery("");
    const payload = {
      case_distribution_batch_id: batchId || "2",
    };
    console.log("Clear filters payload: ", payload);
    const fetchFilteredData = async () => {
      try {
        const filteredData = await List_Case_Distribution_Details(payload);
        setFilteredData(filteredData);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
        setFilteredData([]);
      }
    }
    fetchFilteredData();
  };


  // Handle create task action
  const handleCreateTask = async () => {
    const userId = await getLoggedUserId();
    const payload = {
      drc_id: selectedDRCKey,
      Created_By: userId,
      case_distribution_batch_id : batchId,
    };
    console.log("Create task payload: ", payload);
    if (!selectedDRCKey) {
      Swal.fire({
                icon: "error",
                title: "Error",
                text: "Select a DRC to create a task",
                confirmButtonColor: "#d33",
              });
          return;

    } 
    const createTask = async () => {
      try {
        const response = await Create_Task_For_case_distribution_drc_summery(payload);
        console.log("Create task response: ", response);
        Swal.fire({
            icon: "success",
            title: "Success",
            text: "Data sent successfully.",
          confirmButtonColor: "#28a745",
        });
      } catch (error) {
        console.error("Error creating task:", error);

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
    createTask();
  };

  const handleonbuttonclicked = ( drc_name , drc_id ) => {
    navigate("/pages/Distribute/CaseDistributionDRCSummarywithRTOM", {
      state:  {BatchID: batchId || "2" , DRCName: drc_name , DRCID: drc_id},
      
  });
    console.log("Name: ", drc_name);
    console.log("ID: ", drc_id);
    console.log("Batch ID: ", batchId);

  };


  const handleonbacknuttonclick = () => {
    navigate("/pages/Distribute/AssignedDRCSummary", {
  });
  }



  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Distributed DRC Summary </h1>
      <h2 className={GlobalStyle.headingMedium}>Batch - {batchId || "Undefined"} </h2>

      {/* Filter Section */}
      <div className="flex justify-end">
            <div className={`${GlobalStyle.cardContainer}  w-[30vw] flex px-3 py-2 items-center justify-end gap-4 mt-20 mb-4 `}>
              {/* DRC Select Dropdown */}
              <select
                className={GlobalStyle.selectBox}
                value={selectedDRC} 
                onChange={handleDRCChange}
                style={{ color: selectedDRC === "" ? "gray" : "black" }}
              > 
                <option value="" hidden>
                      DRC
                    </option>
                    {drcNames.map(({ key, value }) => (
                      <option key={key} value={value} style={{ color: "black" }}>
                        {value}
                      </option>
                    ))}
                
              </select>

              {/* Filter Button */}
              <button
                onClick={handleFilter}
                className={`${GlobalStyle.buttonPrimary}`}
              >
                Filter
              </button>

              {/* Reset Button */}
              <button className={`${GlobalStyle.buttonRemove} h-[35px] `} onClick={handleclearfilters}  >
                            Clear 
              </button>
            </div>
        </div>

        {/* Search Section */}
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

      {/* Table Section */}
      <div className={GlobalStyle.tableContainer}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              
              <th className={GlobalStyle.tableHeader}>DRC</th>
              <th className={GlobalStyle.tableHeader}>Count</th>
              <th className={GlobalStyle.tableHeader}>Total Arreas</th>
              <th className={GlobalStyle.tableHeader}>Created dtm</th>
              <th className={GlobalStyle.tableHeader}>Proceed On</th>
              
              <th className={GlobalStyle.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {currentData.length >0?  (
              currentData.map((item, index) => (
                <tr
                  key={item.caseId}
                  className={
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
                >
                  
                  <td className={GlobalStyle.tableData}>{item.drc_name}</td>
                  <td className={GlobalStyle.tableData}>{item.case_count}</td>
                  <td className={GlobalStyle.tableCurrency}>{item.tot_arrease}</td>
                  <td className={GlobalStyle.tableData}>{new Date (item.created_dtm).toLocaleString('en-GB', 
                  {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric", // Ensures two-digit year (YY)
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true, // Keeps AM/PM format
                      })}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {item.proceed_on ? new Date(item.proceed_on).toLocaleDateString('en-GB') : ""}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => handleonbuttonclicked(item.drc_name, item.drc_id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={26}
                        height={29}
                        fill="none"
                      >
                        <path
                          fill="#000"
                          fillRule="evenodd"
                          d="M13 .32c7.18 0 13 5.821 13 13 0 7.18-5.82 13-13 13s-13-5.82-13-13c0-7.179 5.82-13 13-13Zm5.85 11.05a1.95 1.95 0 1 0 0 3.901 1.95 1.95 0 0 0 0-3.9Zm-5.85 0a1.95 1.95 0 1 0 0 3.901 1.95 1.95 0 0 0 0-3.9Zm-5.85 0a1.95 1.95 0 1 0 0 3.901 1.95 1.95 0 0 0 0-3.9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))): (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', verticalAlign: 'middle' }} className={GlobalStyle.tableData}>
                    No data found
                  </td>
                </tr>
            )
            }
            
          </tbody>
        </table>
      </div>
      <br></br>

      {/* Button */}
      <div className="flex justify-between">
        <br></br>
        {/* Right-aligned button */}
        <button
          onClick={handleCreateTask}
          className={`${GlobalStyle.buttonPrimary} flex items-center `} // Same style as Approve button
        >
          <FaDownload className="mr-2" />
          Create Task and Let Me Know
        </button>
      </div>
      {/* Button on the left */}
      <button className={GlobalStyle.buttonPrimary} onClick={handleonbacknuttonclick}>
         <FaArrowLeft className="mr-2" />
      </button>
    </div>
  );
};

export default CaseDistributionDRCSummary;
