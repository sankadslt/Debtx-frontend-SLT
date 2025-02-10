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
import { FaSearch } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import {
  List_all_transaction_seq_of_batch_id,
  Create_Task_For_case_distribution_transaction,
} from "/src/services/case/CaseServices.js";

export default function CaseDistributionDRCTransactions1Batch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { BatchID } = location.state || {};
  const [searchQuery, setSearchQuery] = useState("");
  const [transaction, setTransaction] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = { case_distribution_batch_id: BatchID || "2" };
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

  const handleonclick = () => {
    const payload = {
      case_distribution_batch_id: BatchID || "2",
      Created_By: "Sys",
    };
    try {
      const response = Create_Task_For_case_distribution_transaction(payload);
      console.log("Response", response);
      if (response.status === "success") {
        console.log("Task created successfully");
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
    }
  };

  const handleoniconclick = () => {
    navigate("/pages/Distribute/AssignedDRCSummary");
  };

  const batchSeqDetails = transaction[0]?.batch_seq_details || [];

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
          <div className={`${GlobalStyle.cardContainer}`}>
            <p className="mb-2">
              <strong>Batch ID:</strong>{" "}
              {transaction[0]?.case_distribution_batch_id || "N/A"}
            </p>
            <p className="mb-2">
              <strong>DRC Commission Rule:</strong>{" "}
              {transaction[0]?.drc_commision_rule || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Arrears Band:</strong>{" "}
              {transaction[0]?.current_arrears_band || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Case Count:</strong>{" "}
              {transaction[0]?.rulebase_count || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Total Arrears Amount:</strong>{" "}
              {transaction[0]?.rulebase_arrears_sum || "N/A"}
            </p>
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
        <div className={GlobalStyle.tableContainer}>
          <table className={GlobalStyle.table}>
            <thead className={GlobalStyle.thead}>
              <tr>
                <th className={GlobalStyle.tableHeader}>Batch Seq.</th>
                <th className={GlobalStyle.tableHeader}>Created DTM</th>
                <th className={GlobalStyle.tableHeader}>Action Type</th>
                <th className={GlobalStyle.tableHeader}>Case Count</th>
                <th className={GlobalStyle.tableHeader}>Total Arrears</th>
                <th className={GlobalStyle.tableHeader}></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  key={item.batch_seq}
                  className={
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
                >
                  <td className={GlobalStyle.tableData}>{item.batch_seq}</td>
                  <td className={GlobalStyle.tableData}>
                    {new Date(item.created_dtm).toLocaleDateString()}
                  </td>
                  <td className={GlobalStyle.tableData}>{item.action_type}</td>
                  <td className={GlobalStyle.tableData}>
                    {item.batch_seq_rulebase_count}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {item.batch_seq_rulebase_arrears_sum}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    <button>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-between">
        {/* Button on the left */}
        <button className={` h-[35px] mt-[40px]`} onClick={handleoniconclick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={65}
            height={65}
            fill="none"
          >
            <circle
              cx={32.5}
              cy={32.5}
              r={32.45}
              fill="#B3CCE3"
              stroke="#58120E"
              strokeWidth={0.1}
              transform="rotate(-90 32.5 32.5)"
            />
            <path
              fill="#001120"
              d="m36.46 32.051 10.386-10.384-3.064-3.064-13.448 13.448L43.782 45.5l3.064-3.064L36.46 32.051Z"
            />
            <path
              fill="#001120"
              d="m23.46 32.051 10.386-10.384-3.064-3.064-13.448 13.448L30.782 45.5l3.064-3.064L23.46 32.051Z"
            />
          </svg>
        </button>

        {/* Button on the right */}
        <button
          onClick={handleonclick}
          className={`${GlobalStyle.buttonPrimary} h-[35px] mt-[30px]`}
        >
          Create task and let me know
        </button>
      </div>
    </div>
  );
}
