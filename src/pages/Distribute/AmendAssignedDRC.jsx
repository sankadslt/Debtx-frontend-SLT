/*Purpose: This template is used for the 1.A.15 - Amend Assigned DRC
Created Date: 2025-01-28
Created By: Malindu (mhssc20@gmail.com)
Last Modified Date: 2025-01-30
Modified By:  Malindu (mhssc20@gmail.com)
Version: node 20
ui number : 1.A.15
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the codes */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch ,FaArrowLeft } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import Minorbw from "../../assets/images/distribution/minorbw.png";
import Plusbw from "../../assets/images/distribution/plusbw.png";
import Minorc from "../../assets/images/distribution/minorc.png";
import Plusc from "../../assets/images/distribution/plusc.png";
import {
  List_all_transaction_seq_of_batch_id,
  Case_Distribution_Details_With_Drc_Rtom_ByBatchId,
  Exchange_DRC_RTOM_Cases
} from "/src/services/case/CaseServices.js";
import {getLoggedUserId} from "/src/services/auth/authService.js";
import Swal from "sweetalert2";

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

export default function AmendAssignedDRC() {
  const navigate = useNavigate(); // Initialize navigate for routing
  const location = useLocation(); // Get the location object from react-router
  const { BatchID } = location.state || {}; // Get the BatchID from the location state
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [cpeData, setCpeData] = useState([]); // State for table data
  const [transaction, setTransaction] = useState([]); // State for transaction data
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons

  const [newEntry, setNewEntry] = useState({
    DRC1: "",
    DRC2: "",
    RTOM: "",
    Count: "",
    
  }); // State for new entry
  //console.log("BatchID", BatchID);
const [drcData, setdrcData] = useState([]); // State for DRC data

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

  // Function to fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = { case_distribution_batch_id: BatchID};
        //console.log("Data", data);
        const response = await List_all_transaction_seq_of_batch_id(data);
        //console.log("Response", response);
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

  // Function to fetch DRC data from the API
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = { case_distribution_batch_id: BatchID };
       // console.log("Data", data);
        const response =
          await Case_Distribution_Details_With_Drc_Rtom_ByBatchId(data);
        //console.log("Retrival", response);
        if (response.status === "success") {
          setdrcData(response.data || []); // Ensure `data` is always an array
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
  }, [BatchID]);

  // Function to fetch DRC data from the API
  const handleonclick = async() => {
    const user_id = await getLoggedUserId();

    const drc_list = cpeData.map((item) => ({
            plus_drc_id: item.DRC2ID  , // Ensure this is a number
            plus_drc: item.DRC2,
            plus_rulebase_count: Number(item.DRC1Count), // Ensure this is a number
            minus_drc_id:  item.DRC1ID, // Ensure this is a number
            minus_drc: item.DRC1,
            minus_rulebase_count: Number(item.DRC2Count), // Ensure this is a number
            rtom: item.RTOM,
        }));
    
    const payload = {
        case_distribution_batch_id: BatchID ,
        drc_list: drc_list,
        created_by: user_id,
        };
    //console.log("Payload", payload);

    try {
        const response = await Exchange_DRC_RTOM_Cases(payload);
        if (response.status === "success") {
            //console.log("Success", response);
            setCpeData([]); // Clear table data after successful submission
            
            Swal.fire({
            icon: "success",
            title: "Success",
            text: "DRC RTOM cases exchanged successfully",
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
            "Error exchanging DRC RTOM cases:",
            error.response?.data || error.message
        );
        const errorMessage = error.response?.data?.message || error.message || "An error occurred. Please try again.";
        Swal.fire({
            icon: "error",
            title: "Error",
            text: errorMessage,
            confirmButtonColor: "#d33",
        });
    }
  };

  // Function to handle delete button click
  const handledeleteclick = (RTOM, DRC1, DRC2) => {
    setCpeData(
      cpeData.filter(
        (item) =>
          !(item.RTOM === RTOM && item.DRC1 === DRC1 && item.DRC2 === DRC2)
      )
    ); // Remove selected entry
  };

  // Function to handle add button click
  const handleaddclick = () => {
    if (!newEntry.RTOM || !newEntry.DRC1 || !newEntry.Count || !newEntry.DRC2) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please fill in all fields.",
        confirmButtonColor: "#ffc107",
      });
      return;
    } 
    
    if (parseInt(newEntry.Count, 10) > assignedCaseCount) {
        
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Entered case count cannot be greater than the assigned case count.",
          confirmButtonColor: "#ffc107",
        });
        return;
      }
      
    const entry = {
      RTOM: newEntry.RTOM,
      DRC1: newEntry.DRC1, 
      DRC1ID: newEntry.selectedDRCID,
      DRC1Count: newEntry.Count,
      DRC2: newEntry.DRC2,
      DRC2ID: newEntry.selectedDRCID2,
      DRC2Count: newEntry.Count,
    };

    
    setCpeData([...cpeData, entry]); // Add new entry to table data

    // Clear input fields after adding
    setNewEntry({ RTOM: "", DRC1: "", Count: "", DRC2: "" , });
  };

  //search function
  const filteredData = cpeData.filter((row) =>
    Object.values(row)
      .join("")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

    const assignedCaseCount = drcData
    .filter(
      (item) =>
        item.drc_name == newEntry.DRC1 && item.rtom == newEntry.RTOM
    )
    .reduce((total, item) => total + item.case_count, 0) || 0;


    //console.log("filteredData", filteredData);

  // Function to handle DRC1 selection change  
  const handleselectchangeDRC1 = (e) => {
    const selectedDRCName = e.target.value;
    const selectedDRCID = drcData.find((item) => item.drc_name === selectedDRCName);
    setNewEntry({ ...newEntry,
       DRC1: selectedDRCName,
       selectedDRCID: selectedDRCID ? selectedDRCID.drc_id : null});
  };

  // Function to handle DRC2 selection change
  const handleselectchangeDRC2 = (e) => {
    const selectedDRCName2 = e.target.value;
    const selectedDRCID2 = drcData.find((item) => item.drc_name === selectedDRCName2);
    setNewEntry({ ...newEntry,
       DRC2: selectedDRCName2,
       selectedDRCID2: selectedDRCID2 ? selectedDRCID2.drc_id : null});
  };

  // Function to handle back button click
  const handleoniconclick = () => {
    navigate("/pages/Distribute/AssignedDRCSummary", );
  }

  return (
    <div className={GlobalStyle.fontPoppins}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className={GlobalStyle.headingLarge}>
          Exchange DRC Assign Pending Cases
        </h1>
      </div>

      {/* Card Section */}
      <div className="flex flex-col items-center justify-center mb-4">
        <div className={`${GlobalStyle.cardContainer} w-full max-w-xl`}>
          <table>
            <tbody>
              <tr>
                <td className="py-2"><strong>Batch ID  </strong></td>
                <td className="py-2"> : </td>
                <td className="py-2"> {transaction[0]?.case_distribution_batch_id || "N/A"}</td>
              </tr>
              <tr>
                <td className="py-2"><strong>Created DTM  </strong></td>
                <td className="py-2"> : </td>
                <td className="py-2"> {transaction[0]?.created_dtm
                  ? new Date(transaction[0].created_dtm).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric", 
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })
                  : "N/A"}
                  </td>
              </tr>
              <tr>
                <td className="py-2"><strong>DRC Commission Rule  </strong></td>
                <td className="py-2"> : </td>
                <td className="py-2"> {transaction[0]?.drc_commision_rule || "N/A"}</td>
              </tr>
              <tr>
                <td className="py-2"><strong>Arrears Band  </strong></td>
                <td className="py-2"> : </td>
                <td className="py-2"> {transaction[0]?.current_arrears_band || "N/A"}</td>
              </tr>
              <tr>
                <td className="py-2"><strong>Case Count  </strong></td>
                <td className="py-2"> : </td>
                <td className="py-2"> {transaction[0]?.rulebase_count || "N/A"}</td>
              </tr>
                  
            </tbody>
          </table>
         
          {/* <p className="mb-2">
            <strong>Total Arrears Amount: </strong>{" "}
            {transaction[0]?.rulebase_arrears_sum || "N/A"}
          </p> */}
        </div>
      </div>

      {/* case count Bar */}
      <div className="flex justify-center items-center w-full">
      <div className={`${GlobalStyle.miniCaseCountBar} w-full max-w-[52rem] `}>
        <div className="flex flex-wrap px-3 py-2 items-center  gap-4 sm:gap-10 ">
          <img src={Minorc} alt="Icon" className="w-[20px] h-[20px] " />
          {/* dropdown */}
          <div className="flex gap-10 flex-wrap">
            <select
              className={GlobalStyle.selectBox}
              value={newEntry.DRC1}
              style={{ color: newEntry.DRC1 === "" ? "gray" : "black" }}
              onChange={handleselectchangeDRC1}
            >
              <option value="" hidden>
                DRC
              </option>
              {[...new Set(drcData.map((item) => item.drc_name))].map((item) => (
               <option key={item} value={item} style={{ color: "black" }}>
                  {`${item}`}
                </option> 
               ))} 
            </select>
            
          </div>
          {/* dropdown */}
          <div className="flex gap-10 flex-wrap">
            <select
              className={GlobalStyle.selectBox}
              value={newEntry.RTOM}
              style={{ color: newEntry.RTOM === "" ? "gray" : "black" }}
              onChange={(e) =>
                setNewEntry({ ...newEntry, RTOM: e.target.value })
              }
              disabled={!newEntry.DRC1}
            >
              <option value="" hidden>
                RTOM
              </option>
              {drcData
                .filter((item) => item.drc_name == newEntry.DRC1)
                .map((item) => (
                  <option key={item.rtom} value={item.rtom} style={{ color: "black" }}>
                    {`${item.rtom}`}
                  </option>
                ))}
            </select>
          </div>
          {/* textbox */}
          <div className="flex gap-7 flex-wrap">
            <h1 className={GlobalStyle.headingMedium}>
              Assigned case count:{assignedCaseCount}
              
            </h1>
            <input
              type="number"
              placeholder="Enter case count"
              className={`${GlobalStyle.inputText} min-w-[120px] w-full sm:w-auto`}
              value={newEntry.Count}
              min="1"
              onChange={(e) =>
                
                setNewEntry({ ...newEntry, Count: e.target.value })
                
              }
            />
          </div>
        </div>
        <div className="flex px-3 py-2 items-center  gap-10 ">
          <img src={Plusc} alt="Icon" className="w-[20px] h-[20px] " />
          {/* dropdown */}
          <div className="flex gap-4">
            <select
              className={GlobalStyle.selectBox}
              value={newEntry.DRC2}
              onChange={handleselectchangeDRC2}
              style={{ color: newEntry.DRC2 === "" ? "gray" : "black" }}
            >
              <option value="" hidden>
                DRC
              </option>
              {[...new Set(drcData.map((item) => item.drc_name))].map((item) => (
               <option key={item} value={item} style={{ color: "black" }}>
                  {`${item}`}
                </option> 
               ))}
            </select>
          </div>
        </div>
        {/* button */}
        <div className="flex justify-end mr-5">

        <div>
                    {["admin", "superadmin", "slt"].includes(userRole) && (
                    <button
                    onClick={handleaddclick}
                    className={`${GlobalStyle.buttonPrimary} w-[80px] h-[35px]`}
                    
                    
                  >
                    Add
                  </button>
                    
                    )}
         </div>
          {/* <button
            onClick={handleaddclick}
            className={`${GlobalStyle.buttonPrimary} w-[80px] h-[35px]`}
            
            
          >
            Add
          </button> */}
        </div>
      </div>
      </div>

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
                <th className={GlobalStyle.tableHeader}>RTOM</th>
                <th className={GlobalStyle.tableHeader}>DRC 1</th>
                <th
                  className={`${GlobalStyle.tableHeader} `}
                >
                  <div className="flex justify-center items-center">
                  <img
                    src={Minorbw}
                    alt="Icon"
                    className="w-[20px] h-[20px] "
                  />
                </div>
                </th>
                <th className={GlobalStyle.tableHeader}>DRC 2</th>
                <th
                  className={`${GlobalStyle.tableHeader}`}
                >
                <div className="flex justify-center items-center">
                  <img src={Plusbw} alt="Icon" className="w-[20px] h-[20px] " />
                </div>
                </th>
                <th className={GlobalStyle.tableHeader}></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={
                      index % 2 === 0
                        ? GlobalStyle.tableRowEven
                        : GlobalStyle.tableRowOdd
                    }
                  >
                    <td className={GlobalStyle.tableData}>{item.RTOM}</td>
                    <td className={GlobalStyle.tableData}>{item.DRC1}</td>
                    <td className={GlobalStyle.tableData}>{item.DRC1Count}</td>
                    <td className={GlobalStyle.tableData}>{item.DRC2}</td>
                    <td className={GlobalStyle.tableData}>{item.DRC2Count}</td>
                    <td className={GlobalStyle.tableData}>
                    <div>
                      {["admin", "superadmin", "slt"].includes(userRole) && (
                      <button
                        onClick={() =>
                          handledeleteclick(item.RTOM, item.DRC1, item.DRC2)
                        }
                        className={`${GlobalStyle.buttonPrimary}`}
                      >
                        Delete
                      </button>
                      )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-end">
        <div>
              {["admin", "superadmin", "slt"].includes(userRole) && (
              <button
              onClick={handleonclick}
              className={`${GlobalStyle.buttonPrimary} h-[35px] mt-[30px]`}
            >
              Submit
            </button>
              
              )}
        </div>
          {/* <button
            onClick={handleonclick}
            className={`${GlobalStyle.buttonPrimary} h-[35px] mt-[30px]`}
          >
            Submit
          </button> */}
      </div>

      <div className="flex justify-start mt-4">
        <button className= {GlobalStyle.buttonPrimary} onClick={handleoniconclick}>
        <FaArrowLeft className="mr-2" />
        </button>
        </div>
    </div>
  );
}
