/*Purpose: This template is used for the 1.A.14.1 - Case Distribution DRC Summary with RTOM
Created Date: 2025-01-28
Created By: Udana (udanarajanayaka220@gmail.com)
Version: node 20
ui number : 1.A.14.1
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the codes */

import { useState , useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch , FaArrowLeft } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import {List_Case_Distribution_Details_With_Rtoms} from "/src/services/case/CaseServices.js";

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

const CaseDistributionDRCSummarywithRTOM = () => {

  // State for filters and table
  const location = useLocation(); // Get the location object from react-router
  const navigate = useNavigate(); // Initialize navigate for routing
  const batchId = location.state?.BatchID; // Get the BatchID from the location state
  const drcname = location.state?.DRCName; // Get the DRCName from the location state
  const drcid = location.state?.DRCID; // Get the DRCID from the location state
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons

  // Filtering the data based on search query
  const filteredDataBySearch = filteredData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

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


  // UseEffect to fetch data from the API  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {  
          case_distribution_batch_id: batchId,
          drc_id: drcid,
        };
        
       // console.log("Fetching data with payload:", payload);
        
        const response = await List_Case_Distribution_Details_With_Rtoms(payload);
        setFilteredData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [batchId, drcid]);
      
// Function to handle back button click  
const handleonbacknuttonclick = () => {
  navigate("/pages/Distribute/CaseDistributionDRCSummary", { state: { BatchID: batchId } });
};
  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Title */}
      <h1 className={GlobalStyle.headingLarge}>Distributed DRC Summary</h1>
      <div className=" py-5 mt-2 ml-10 w-fit ">
        <h2 className={GlobalStyle.headingMedium}>Batch - {batchId }</h2>
        <h2 className={GlobalStyle.headingMedium}>DRC Name - {drcname }</h2>
      </div>

      {/* Search Section */}
      {/* <div className="flex py-2 items-center gap-2 mt-2 mb-4">
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
      </div> */}

      {/* Table Section */}

      {/* <div className="flex items-center justify-center min-h-full ">
          <div className={GlobalStyle.cardContainer}></div> */}
      <div className="flex items-center justify-center min-h-full ">
      <div className={GlobalStyle.cardContainer}>
        <div className="overflow-x-auto">
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>RTOM</th>
              <th className={GlobalStyle.tableHeader}>Case Count</th>
              <th className={GlobalStyle.tableHeader}>Arrears Amount (LKR)</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.length > 0 ? (
              filteredDataBySearch.map((item, index) => (
              <tr
                key={item.caseId}
                className={
                  index % 2 === 0
                    ? GlobalStyle.tableRowEven
                    : GlobalStyle.tableRowOdd
                }
              >
                <td className={GlobalStyle.tableData}>{item.rtom}</td>
                <td className={GlobalStyle.tableData}>{item.case_count}</td>
                <td className={GlobalStyle.tableCurrency}>{item.tot_arrease}</td>
              </tr>
            ))
            ) : (
              <tr>
                <td colSpan="3" className={GlobalStyle.tableData}>
                  No data found
                </td>
              </tr>
            )
          }
          </tbody>
        </table>
        </div>
      </div>
      </div>

      {/* Pagination Section */}
      <br />

      {/* Button */}
    
      
      <button className={GlobalStyle.buttonPrimary} onClick={handleonbacknuttonclick}>
         <FaArrowLeft className="mr-2" />
      </button>
    
    
    </div>
  );
};

export default CaseDistributionDRCSummarywithRTOM;
