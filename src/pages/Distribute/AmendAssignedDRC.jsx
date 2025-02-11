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
import { FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import Minorbw from "../../assets/images/minorbw.png";
import Plusbw from "../../assets/images/plusbw.png";
import Minorc from "../../assets/images/minorc.png";
import Plusc from "../../assets/images/plusc.png";
import {
  List_all_transaction_seq_of_batch_id,
  Case_Distribution_Details_With_Drc_Rtom_ByBatchId,
  Exchange_DRC_RTOM_Cases
} from "/src/services/case/CaseServices.js";

export default function AmendAssignedDRC() {
  const navigate = useNavigate();
  const location = useLocation();
  const { BatchID } = location.state || {};
  const [searchQuery, setSearchQuery] = useState("");
  const [cpeData, setCpeData] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const [newEntry, setNewEntry] = useState({
    DRC1: "",
    DRC2: "",
    RTOM: "",
    Count: "",
  });
  console.log("BatchID", BatchID);

  const [drcData, setdrcData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = { case_distribution_batch_id: BatchID || 2 };
        console.log("Data", data);
        const response = await List_all_transaction_seq_of_batch_id(data);
        console.log("Response", response);
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

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = { case_distribution_batch_id: BatchID || 208 };
        console.log("Data", data);
        const response =
          await Case_Distribution_Details_With_Drc_Rtom_ByBatchId(data);
        console.log("Retrival", response);
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

  const handleonclick = async() => {
    
    const drc_list = cpeData.map((item) => ({
            plus_drc_id: Number(item.DRC2), // Ensure this is a number
            plus_drc: "Drc A",
            plus_rulebase_count: Number(item.DRC1Count), // Ensure this is a number
            minus_drc_id: Number(item.DRC1), // Ensure this is a number
            minus_drc: "Drc B",
            minus_rulebase_count: Number(item.DRC2Count), // Ensure this is a number
            rtom: item.RTOM,
        }));
    console.log("DRC List", drc_list);
    const payload = {
        case_distribution_batch_id: BatchID || 1,
        drc_list: drc_list,
        created_by: "sys",
        };
    console.log("Payload", payload);

    try {
        const response = await Exchange_DRC_RTOM_Cases(payload);
        if (response.status === "success") {
            console.log("Success", response);
            setCpeData([]); // Clear table data after successful submission
            
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
    }
  };

  const handledeleteclick = (RTOM, DRC1, DRC2) => {
    setCpeData(
      cpeData.filter(
        (item) =>
          !(item.RTOM === RTOM && item.DRC1 === DRC1 && item.DRC2 === DRC2)
      )
    ); // Remove selected entry
  };

  const handleaddclick = () => {
    if (!newEntry.RTOM || !newEntry.DRC1 || !newEntry.Count || !newEntry.DRC2) {
      alert("Please fill all fields before adding.");
      return;
    } 
    
    if (parseInt(newEntry.Count, 10) > assignedCaseCount) {
        alert("Entered case count cannot be greater than the assigned case count.");
        return;
      }
      
    const entry = {
      RTOM: newEntry.RTOM,
      DRC1: newEntry.DRC1, 
      DRC1Count: newEntry.Count,
      DRC2: newEntry.DRC2,
      DRC2Count: newEntry.Count,
    };

    setCpeData([...cpeData, entry]); // Add new entry to table data

    // Clear input fields after adding
    setNewEntry({ RTOM: "", DRC1: "", Count: "", DRC2: "" });
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
        item.drc_id == newEntry.DRC1 && item.rtom == newEntry.RTOM
    )
    .reduce((total, item) => total + item.case_count, 0) || 0;


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
        <div className={`${GlobalStyle.cardContainer}`}>
          <p className="mb-2">
            <strong>Batch ID: </strong>{" "}
            {transaction[0]?.case_distribution_batch_id || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Create DTM: </strong>{" "}
            {transaction[0]?.created_dtm
              ? new Date(transaction[0].created_dtm).toISOString().split("T")[0]
              : "N/A"}
          </p>
          <p className="mb-2">
            <strong>DRC Commission Rule: </strong>{" "}
            {transaction[0]?.drc_commision_rule || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Arrears Band: </strong>{" "}
            {transaction[0]?.current_arrears_band || "N/A"}
          </p>

          <p className="mb-2">
            <strong>Case Count: </strong>{" "}
            {transaction[0]?.rulebase_count || "N/A"}
          </p>
          <p className="mb-2">
            <strong>Total Arrears Amount: </strong>{" "}
            {transaction[0]?.rulebase_arrears_sum || "N/A"}
          </p>
        </div>
      </div>

      {/* case count Bar */}
      <div className={`${GlobalStyle.miniCaseCountBar} `}>
        <div className="flex px-3 py-2 items-center  gap-10 ">
          <img src={Minorc} alt="Icon" className="w-[20px] h-[20px] " />
          {/* dropdown */}
          <div className="flex gap-10">
            <select
              className={GlobalStyle.selectBox}
              value={newEntry.DRC1}
              onChange={(e) =>
                setNewEntry({ ...newEntry, DRC1: e.target.value })
              }
            >
              <option value="" hidden>
                DRC
              </option>
              {drcData.map((item) => (
                <option key={item.drc_id} value={item.drc_id}>
                  {`${item.drc_name}`}
                </option>
              ))}
            </select>
          </div>
          {/* dropdown */}
          <div className="flex gap-10">
            <select
              className={GlobalStyle.selectBox}
              value={newEntry.RTOM}
              onChange={(e) =>
                setNewEntry({ ...newEntry, RTOM: e.target.value })
              }
              disabled={!newEntry.DRC1}
            >
              <option value="" hidden>
                RTOM
              </option>
              {drcData
                .filter((item) => item.drc_id == newEntry.DRC1)
                .map((item) => (
                  <option key={item.rtom} value={item.rtom}>
                    {`${item.rtom}`}
                  </option>
                ))}
            </select>
          </div>
          {/* textbox */}
          <div className="flex gap-7">
            <h1 className={GlobalStyle.headingMedium}>
              Assigned case count:{assignedCaseCount}
              
            </h1>
            <input
              type="number"
              placeholder="Enter case count"
              className={GlobalStyle.inputText}
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
              onChange={(e) =>
                setNewEntry({ ...newEntry, DRC2: e.target.value })
              }
            >
              <option value="" hidden>
                DRC
              </option>
              {drcData.map((item) => (
                <option key={item.drc_id} value={item.drc_id}>
                  {`${item.drc_name}`}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* button */}
        <div className="flex justify-end mr-5">
          <button
            onClick={handleaddclick}
            className={`${GlobalStyle.buttonPrimary} w-[80px] h-[35px]`}
            
            
          >
            Add
          </button>
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
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th className={GlobalStyle.tableHeader}>RTOM</th>
                <th className={GlobalStyle.tableHeader}>DRC 1</th>
                <th
                  className={`${GlobalStyle.tableHeader} flex justify-center items-center`}
                >
                  <img
                    src={Minorbw}
                    alt="Icon"
                    className="w-[20px] h-[20px] "
                  />
                </th>
                <th className={GlobalStyle.tableHeader}>DRC 2</th>
                <th
                  className={`${GlobalStyle.tableHeader} flex justify-center items-center`}
                >
                  <img src={Plusbw} alt="Icon" className="w-[20px] h-[20px] " />
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
                      <button
                        onClick={() =>
                          handledeleteclick(item.RTOM, item.DRC1, item.DRC2)
                        }
                        className={`${GlobalStyle.buttonPrimary}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={GlobalStyle.tableData}>
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
        <button
          onClick={handleonclick}
          className={`${GlobalStyle.buttonPrimary} h-[35px] mt-[30px]`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
