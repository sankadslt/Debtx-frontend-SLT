/*Purpose: This template is used for the 1.A.13.2 - Case Distribution For DRC Transactions - 1 Batch UI
Created Date: 2025-02-10
Created By: Chamithu (chamithujayathilaka2003@gmail.com)
Last Modified Date: 2025-02-10
Version: node 20
ui number : 1.A.13.2
Dependencies: tailwind css
Related Files: (routes)
Notes: The following page conatins the codes */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSearch , FaDownload , FaArrowLeft } from "react-icons/fa";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx";
import {
  list_distribution_array_of_a_transaction,
  Create_Task_For_case_distribution_transaction_array,
} from "/src/services/case/CaseServices.js";
import {getLoggedUserId} from "/src/services/auth/authService.js";
import minus from "/src/assets/images/minorbw.png";
import plus from "/src/assets/images/plusbw.png";
import Swal from "sweetalert2";

export default function CaseDistributionDRCTransactions1Batch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { BatchID, Batchseq } = location.state || {};
  console.log("BatchID", BatchID);
  console.log("Batchseq", Batchseq);
  const [searchQuery, setSearchQuery] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = {
          case_distribution_batch_id: BatchID || 1,
          batch_seq: Batchseq || 2,
        };
        console.log("This is the payloadData", data);
        const response = await list_distribution_array_of_a_transaction(data);
        

        if (response.status === "success") {
          setTransactions(response.data);
          console.log("Response", response);
        } else {
          setError("No data found.");
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to fetch data.");
      }
    };

    fetchTransactions();
  }, [BatchID, Batchseq]);

  const handleonclick = async () => {
    const userId = await getLoggedUserId();

    const payload = {
      case_distribution_batch_id: BatchID || 2,
      batch_seq: Batchseq || 2,
      Created_By: userId,
    };
    console.log("Payload", payload);
    try {
      const response =
        await Create_Task_For_case_distribution_transaction_array(payload);
      console.log("Response", response);

      if (response.status === "success") {
        console.log("Task created successfully");

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

  const handleoniconclick = () => {
    navigate("/pages/Distribute/CaseDistributionDRCTransactions-1Batch", {
      state: { BatchID: BatchID},
    });
  };

  const batchSeqDetails = transactions[0]?.batch_seq_details || [];
  const allDistributions = batchSeqDetails.flatMap(
    (batch) => batch.array_of_distributions || []
  );

  console.log("allDistributions", allDistributions);
  //search function
  const filteredData = allDistributions.filter((row) =>
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
      <div className="flex flex-col items-center justify-center mb-4">
        <div className={`${GlobalStyle.cardContainer}`}>
          <p className="mb-2">
          <strong>Batch ID:</strong> {transactions[0]?.case_distribution_batch_id || "N/A"}
          </p>

          <p className="mb-2">
          <strong>DRC Commission Rule:</strong> {transactions[0]?.drc_commision_rule || "N/A"}
          </p>
          <p className="mb-2">
          <strong>Arrears Band:</strong> {transactions[0]?.current_arrears_band || "N/A"}
          </p>

          <p className="mb-2">
          <strong>Case Count:</strong> {transactions[0]?.rulebase_count|| "N/A"}
          </p>

          {/* <p className="mb-2">
          <strong>Total Arrears Amount:</strong> {transactions[0]?.rulebase_arrears_sum || "N/A"}
          </p> */}

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
                {Batchseq === 1 ? (
                  <>
                    <th className={GlobalStyle.tableHeader}>DRC</th>
                    <th className={GlobalStyle.tableHeader}>
                      Distribution Amount
                    </th>
                  </>
                ) : (
                  <>
                    <th className={GlobalStyle.tableHeader}>RTOM</th>
                    <th className={GlobalStyle.tableHeader}>DRC 1</th>
                    <th
                      className={`${GlobalStyle.tableHeader} flex justify-center items-center`}
                    >
                      <img src={minus} width={17} height={17} alt="Min" />
                    </th>
                    <th className={GlobalStyle.tableHeader}>DRC 2</th>
                    <th
                      className={`${GlobalStyle.tableHeader} flex justify-center items-center`}
                    >
                      <img src={plus} width={17} height={17} alt="Plus" />
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
            {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr
                      key={item.date}
                      className={
                        index % 2 === 0
                          ? GlobalStyle.tableRowEven
                          : GlobalStyle.tableRowOdd
                      }
                    >
                      {Batchseq === 1 ? (
                        <>
                          <td className={GlobalStyle.tableData}>{item.drc}</td>
                          <td className={GlobalStyle.tableData}>
                            {item.rulebase_count}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className={GlobalStyle.tableData}>{item.rtom}</td>
                          <td className={GlobalStyle.tableData}>
                            {item.minus_drc}
                          </td>
                          <td className={GlobalStyle.tableData}>
                            {item.minus_rulebase_count}
                          </td>
                          <td className={GlobalStyle.tableData}>{item.plus_drc}</td>
                          <td className={GlobalStyle.tableData}>
                            {item.plus_rulebase_count}
                          </td>
                        </>
                      )}
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
      {/* Button */}

      <div className="flex justify-end">
        {/* Button on the right */}
        <button
          onClick={handleonclick}
          className={`${GlobalStyle.buttonPrimary} h-[35px] mt-[30px] flex items-center `}
        >
          <FaDownload className="mr-2" />
          Create task and let me know
        </button>
      </div>
      
      <div className="flex justify-start mt-">
      <button className={GlobalStyle.buttonPrimary} onClick={handleoniconclick}>
        <FaArrowLeft className="mr-2" />
        </button>
      </div>
      
    </div>
  );
}
