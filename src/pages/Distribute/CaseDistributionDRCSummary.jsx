/*Purpose: This template is used for the 1.A.14 - Case Distribution DRC Summary
Created Date: 2025-01-25
Created By: Udana (udanarajanayaka220@gmail.com)
Version: node 20
ui number : 1.A.14
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the codes */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaArrowLeft, FaDownload } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import open from "/src/assets/images/distribution/more_info.png";
import { Active_DRC_Details } from "/src/services/drc/Drc.js";
import { List_Case_Distribution_Details, Create_Task_For_case_distribution_drc_summery, Case_Distribution_Details_With_Drc_Rtom_ByBatchId } from "/src/services/case/CaseServices.js";
import { getLoggedUserId } from "/src/services/auth/authService.js";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";
import { HiDotsCircleHorizontal } from "react-icons/hi";

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

const CaseDistributionDRCSummary = () => {


  // State for filters and table
  const [selectedDRC, setSelectedDRC] = useState(""); // State for selected DRC
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedDRCKey, setSelectedDRCKey] = useState(""); // State for selected DRC key
  const [drcNames, setDrcNames] = useState([]); // State for DRC names
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Initialize navigate for routing
  const [date, setdate] = useState(""); // State for date
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons

  const batchId = location.state?.BatchID; // Get the batch ID from the location state



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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const recordsPerPage = 7;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  // Filtering the data based on search query
  const filteredDataBySearch = Array.isArray(filteredData) ? filteredData.filter((row) =>
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

  // useEffect to fetch DRC names
  // useEffect(() => {
  //   const fetchDRCNames = async () => {
  //     try {
  //       const Names = await Active_DRC_Details();
  //       setDrcNames(Names);
  //     } catch (error) {
  //       console.error("Error fetching drc names:", error);
  //     }
  //   };
  //   fetchDRCNames();
  // });


   // Function to fetch DRC data from the API
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = { case_distribution_batch_id: batchId };
        // console.log("Data", data);
        const response =
          await Case_Distribution_Details_With_Drc_Rtom_ByBatchId(data);
        console.log("Retrival", response);
        console.log("DRC Data:", response.data);

        if (response.status === "success") {
          setDrcNames(response.data || []); // Ensure `data` is always an array
        } else {
          console.error(
            "Error in API response:",
            response.message || "Unknown error"
          );
        }
      } catch (error) {
        console.error(
          "Error fetching case distribution DRC summary:",
          error.response?.data || error.message
        );
      }
    };
    fetchDetails();
  }, [batchId]);

  

  // Modified handleDRCChange to only update state without filtering
  const handleDRCChange = (e) => {
    const selectedValue = e.target.value;

    // Find the corresponding key from drcNames
    const selectedDRCObject = drcNames.find(({ drc_name  }) => drc_name  === selectedValue);

    if (selectedDRCObject) {
      const selectedKey = selectedDRCObject.drc_id;

      // Store both value and key in state (if needed)
      setSelectedDRC(selectedValue);
      setSelectedDRCKey(selectedKey);

      // console.log("Selected DRC: ", selectedValue);
      // console.log("Selected DRC ID: ", selectedKey);
    }
  };

  useEffect(() => {
    const payload = {
      case_distribution_batch_id: batchId,
    };
    const fetchFilteredData = async () => {
      try {
        const filteredData = await List_Case_Distribution_Details(payload);
        const batchData = filteredData.data[0]; // get the first batch object
        setFilteredData(batchData.drc_distribution);

        const date = new Date(batchData.created_dtm).toLocaleString('en-GB', {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric", // Ensures two-digit year (YY)
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true, 
                    }); // Format the date to 'DD/MM/YYYY HH:MM:SS AM/PM'
        setdate(date);

        //console.log ("date" , date);

        //setFilteredData(filteredData.data.drc_distribution);
        console.log("Filtered Data: ", batchData.drc_distribution);
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
      case_distribution_batch_id: batchId,
      drc_id: selectedDRCKey,
    };
    console.log("Filter payload: ", payload);
    const fetchFilteredData = async () => {
      try {
        const filteredData = await List_Case_Distribution_Details(payload);
        const batchData = filteredData.data[0]; // get the first batch object
        setFilteredData(batchData.drc_distribution);
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
      case_distribution_batch_id: batchId,
    };
    // console.log("Clear filters payload: ", payload);
    const fetchFilteredData = async () => {
      try {
        const filteredData = await List_Case_Distribution_Details(payload);
        const batchData = filteredData.data[0]; // get the first batch object
        setFilteredData(batchData.drc_distribution);
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
      case_distribution_batch_id: batchId,
    };
    // console.log("Create task payload: ", payload);
    if (!selectedDRCKey) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please select a DRC before creating a task.",
        confirmButtonColor: "#f1c40f",
      });
      return;

    }
    const createTask = async () => {
      try {
        const response = await Create_Task_For_case_distribution_drc_summery(payload);
        //  console.log("Create task response: ", response);
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

  // Handle button click to navigate to DRC summary page
  const handleonbuttonclicked = (drc_name, drc_id) => {
    navigate("/pages/Distribute/CaseDistributionDRCSummarywithRTOM", {
      state: { BatchID: batchId , DRCName: drc_name, DRCID: drc_id },

    });
    // console.log("Name: ", drc_name);
    // console.log("ID: ", drc_id);
    // console.log("Batch ID: ", batchId);

  };

  // Handle back button click to navigate to the previous page
  const handleonbacknuttonclick = () => {
    navigate("/pages/Distribute/AssignedDRCSummary", {
    });
  }



  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Distributed DRC Summary </h1>
      <h2 className={GlobalStyle.headingMedium}>Batch - {batchId} </h2>

      {/* Filter Section */}
      <div className="flex justify-end">
        <div className={`${GlobalStyle.cardContainer}  w-[30vw] flex px-3  sm:w-[30vw] py-2 items-center justify-end  w-full flex-wrap sm:flex-row gap-4 mt-20 mb-4 `}>
          {/* DRC Select Dropdown */}
          <select
            className={`${GlobalStyle.selectBox} w-full sm:min-w-[150px] sm:w-auto`}
            value={selectedDRC}
            onChange={handleDRCChange}
            style={{ color: selectedDRC === "" ? "gray" : "black" }}
          >
            <option value="" hidden>
              DRC
            </option>
            {drcNames.length > 0 ? (drcNames.map(({ drc_id, drc_name  }) => (
              <option key={drc_id} value={drc_name } style={{ color: "black" }}>
                {drc_name}
              </option>
            ))) : (
              <option value="" disabled style={{ color: "gray" }}>
                No DRCs available
              </option>
            )}

          </select>

          {/* Filter Button */}

          <div>
            {["admin", "superadmin", "slt"].includes(userRole) && (
              <button
                onClick={handleFilter}
                className={`${GlobalStyle.buttonPrimary}  w-full sm:w-auto`}
              >
                Filter
              </button>

            )}
          </div>
          {/* <button
                onClick={handleFilter}
                className={`${GlobalStyle.buttonPrimary}`}
              >
                Filter
              </button> */}

          {/* Reset Button */}
          <div>
            {["admin", "superadmin", "slt"].includes(userRole) && (
              <button className={`${GlobalStyle.buttonRemove} h-[35px]  w-full sm:w-auto`} onClick={handleclearfilters}  >
                Clear
              </button>
            )}
          </div>

          {/* <button className={`${GlobalStyle.buttonRemove} h-[35px] `} onClick={handleclearfilters}  >
                            Clear 
              </button> */}
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
      <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>

              <th className={GlobalStyle.tableHeader}>DRC</th>
              <th className={GlobalStyle.tableHeader}>Count</th>
              <th className={GlobalStyle.tableHeader}>Total Arreas (LKR)</th>
              <th className={GlobalStyle.tableHeader}>Created dtm</th>
              {/* <th className={GlobalStyle.tableHeader}>Proceed On</th> */}

              <th className={GlobalStyle.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr
                  key={`${item.caseId}-${index}`}
                  className={
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
                >

                  <td className={GlobalStyle.tableData}>{item.drc_name}</td>
                  <td className={GlobalStyle.tableData}>{item.total_case_count}</td>
                  <td className={GlobalStyle.tableCurrency}>{item.drc_tot_arrease}</td>
                  <td className={GlobalStyle.tableData}>{date }
                  </td>
                  {/* <td className={GlobalStyle.tableData}>
                    {item.proceed_on ? new Date(item.proceed_on).toLocaleDateString('en-GB') : ""}
                  </td> */}
                  <td className="px-6 py-4 text-center">
                    <div>
                      {["admin", "superadmin", "slt"].includes(userRole) && (
                        <button onClick={() => handleonbuttonclicked(item.drc_name, item.drc_id)} data-tooltip-id="my-tooltip" >
                          {/* <img
                                                src= {open}
                                                data-tooltip-id="my-tooltip"
                                
                                              ></img> */}
                          <HiDotsCircleHorizontal size={25} color="#000" />

                          <Tooltip id="my-tooltip" place="bottom" content="More Info" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))) : (
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
      {currentData.length > 0 && (
        <div className="flex justify-between">
          <br></br>
          {/* Right-aligned button */}
          <div>
            {["admin", "superadmin", "slt"].includes(userRole) && (
              <button
                onClick={handleCreateTask}
                className={`${GlobalStyle.buttonPrimary} flex items-center `} // Same style as Approve button
              >
                <FaDownload className="mr-2" />
                Create Task and Let Me Know
              </button>

            )}
          </div>
          {/* <button
          onClick={handleCreateTask}
          className={`${GlobalStyle.buttonPrimary} flex items-center `} // Same style as Approve button
        >
          <FaDownload className="mr-2" />
          Create Task and Let Me Know
        </button> */}
        </div>
      )}

      {/* Button on the left */}
      <button className={GlobalStyle.buttonPrimary} onClick={handleonbacknuttonclick}>
        <FaArrowLeft className="mr-2" />
      </button>
    </div>
  );
};

export default CaseDistributionDRCSummary;
