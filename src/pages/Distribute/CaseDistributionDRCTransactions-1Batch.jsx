/*Purpose: This template is used for the 1.A.13.1 - Case Distribution For DRC Transactions - 1 Batch UI
Created Date: 2025-01-07
Created By: Chamithu (chamithujayathilaka2003@gmail.com)
Last Modified Date: 2025-01-23
Version: node 20
ui number : 1.A.13.1
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the codes */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch ,FaArrowLeft , FaDownload} from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import {
  List_all_transaction_seq_of_batch_id,
  Create_Task_For_case_distribution_transaction,
} from "/src/services/case/CaseServices.js";
import open from "/src/assets/images/distribution/more_info.png";
import { getLoggedUserId } from "/src/services/auth/authService.js";
import Swal from "sweetalert2";
import { Tooltip } from "react-tooltip";
import { HiDotsCircleHorizontal } from "react-icons/hi";

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

export default function CaseDistributionDRCTransactions1Batch() {
  const navigate = useNavigate(); // Initialize navigate for routing
  const location = useLocation(); // Get the location object
  const { BatchID } = location.state || {}; // Extract BatchID from location state
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [transaction, setTransaction] = useState([]); // State for transaction data
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

  // Fetch transaction data when the component mounts or BatchID changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = { case_distribution_batch_id: BatchID  };
        const response = await List_all_transaction_seq_of_batch_id(data);
      //  console.log("Response", response);
        if (response.status === "success") {
          setTransaction(response.data || []); // Ensure `data` is always an array
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
    fetchData();
  }, [BatchID]);


  // Function to handle the button click
  const handleonclick = async () => {

    


    const userId = await getLoggedUserId();

    const payload = {
      case_distribution_batch_id: BatchID ,
      Created_By: userId,
    };

   // console.log("Payload", payload);
    try {
      const response = await Create_Task_For_case_distribution_transaction(
        payload
      );
     // console.log("Response", response);

      if (response.status === "success") {
      //  console.log("Task created successfully");
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Task created successfully",
          confirmButtonColor: "#28a745",
        });
      } else {
        console.error(
          "Error in API response:",
          response.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error(
        "Error creating task for case distribution transaction:",
        error.response?.data || error.message
      );

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred. Please try again.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonColor: "#d33",
      });
    }
  };

  // Function to handle the icon click and navigate to the assigned DRC summary page
  const handleoniconclick = () => {
    navigate("/pages/Distribute/AssignedDRCSummary");
  };

  // Function to handle the table icon click and navigate to the case distribution DRC transactions page
  const handletableiconclick = (Batchseq) => {
    navigate("/pages/Distribute/CaseDistributionDRCTransactions-(1Batch)", {
      state: { BatchID, Batchseq },
    });
  };

  const batchSeqDetails = transaction[0]?.batch_details || [];

  //search function
  const filteredData = batchSeqDetails.filter((row) =>
    Object.values(row)
      .join("")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className={GlobalStyle.headingLarge}>Distribution Summary</h1>
      </div>

      {/* Card Section */}
      {transaction.length > 0 && transaction[0] && (
        <div className="flex flex-col items-center justify-center mb-4">
        <div className={`${GlobalStyle.cardContainer} w-full max-w-lg`}>
          <table >
          <colgroup>
            <col  />
            <col style={{ width: "20px" }} />
            <col />
            
          </colgroup>
            <tbody>
              <tr>
                <td className="py-2"><strong>Batch ID  </strong></td>
                <td className="py-2"> <strong> : </strong> </td>
                <td className="py-2">  {transaction[0]?.case_distribution_batch_id || "N/A"}</td>
              </tr>
              <tr>
                <td className="py-2"><strong>DRC Commission Rule  </strong></td>
                <td className="py-2"> <strong> : </strong></td>
                <td className="py-2">  {transaction[0]?.drc_commision_rule || "N/A"}</td>
              </tr>
              <tr>
                <td className="py-2"><strong>Arrears Band  </strong></td>
                <td className="py-2"> <strong> : </strong> </td>
                <td className="py-2">  {transaction[0]?.current_arrears_band || "N/A"}</td>
              </tr>
              <tr>
                <td className="py-2"><strong>Case Count </strong></td>
                <td className="py-2"> <strong> : </strong> </td>
                <td className="py-2">  {transaction[0]?.inspected_count || "N/A"}</td>
              </tr>
              <tr>
                <td className="py-2"><strong>Captured Count </strong></td>
                <td className="py-2"> <strong> : </strong> </td>
                <td className="py-2">  {transaction[0]?.captured_count || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
        
      )}
      {/* Table Section */}
      <div className="flex flex-col">
        {/* Search Bar Section */}
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
        <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th className={GlobalStyle.tableHeader}>Batch Seq</th>
                
                <th className={GlobalStyle.tableHeader}>Action Type</th>
                <th className={GlobalStyle.tableHeader}>Case Count</th>
                {/* <th className={GlobalStyle.tableHeader}>Total Arrears</th> */}
                <th className={GlobalStyle.tableHeader}>Created DTM</th> 
                <th className={GlobalStyle.tableHeader}></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                <tr
                  key={item.batch_seq}
                  className={
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
                >
                  <td className={GlobalStyle.tableData}>{item.batch_seq}</td>
                  
                  <td className={GlobalStyle.tableData}>{item.action_type}</td>
                  <td className={GlobalStyle.tableData}>
                    {item.batch_case_count}
                  </td>
                  {/* <td className={GlobalStyle.tableData}>
                    {item.batch_seq_rulebase_arrears_sum}
                  </td> */}
                  <td className={GlobalStyle.tableData}>
                    {new Date(item.created_on).toLocaleString('en-GB', {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric", // Ensures two-digit year (YY)
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true, // Keeps AM/PM format
                      })}
                  </td>
                  <td className={GlobalStyle.tableData}
                  
                    style={{ display: "flex", justifyContent: "center" }}>

                  <div>
                    {["admin", "superadmin", "slt"].includes(userRole) && (
                       <button 
                        data-tooltip-id="my-tooltip"
                       onClick={() => handletableiconclick(item.batch_seq) }
                       
                     >
                       {/* <img
                           src= {open}
                           data-tooltip-id="my-tooltip"
           
                         ></img> */}
                         <HiDotsCircleHorizontal size={25} color="#000"  />
                       <Tooltip id="my-tooltip" place="bottom" content="More Info" />
                       {/* <svg
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
                       </svg> */}
                       
                     </button>
                    )}
                </div>
                   
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                  {/* No data found message */}
                  No data found
                </td>
              </tr>
            )}
            
            </tbody>
          </table>
        </div>
      </div>
      {filteredData.length > 0 && ( 
        <div className="flex justify-end">
          <div>
                    {["admin", "superadmin", "slt"].includes(userRole) && (
                      <button
                      onClick={handleonclick}
                      className={`${GlobalStyle.buttonPrimary} h-[35px] mt-[30px] flex items-center `}
                    >
                      <FaDownload className="mr-2" />
                      Create task and let me know
                    </button>
                    )}
                </div>
          {/* <button
            onClick={handleonclick}
            className={`${GlobalStyle.buttonPrimary} h-[35px] mt-[30px] flex items-center `}
          >
            <FaDownload className="mr-2" />
            Create task and let me know
          </button> */}
        </div>
         )}  
        
        {/* Button on the left */}
        <div className="flex justify-start mt-4">
        <button className= {GlobalStyle.buttonPrimary} onClick={handleoniconclick}>
        <FaArrowLeft className="mr-2" />
        </button>
        </div>
        
        {/* Button on the right */}
       
    </div>
  );
}
