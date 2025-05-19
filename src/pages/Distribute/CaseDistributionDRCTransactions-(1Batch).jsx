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
import minus from "/src/assets/images/distribution/minorbw.png";
import plus from "/src/assets/images/distribution/plusbw.png";
import Swal from "sweetalert2";

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";

export default function CaseDistributionDRCTransactions1Batch() {
  const navigate = useNavigate(); // usestate for routing
  const location = useLocation(); // usestate for routing
  const { BatchID, Batchseq } = location.state || {}; // Get BatchID and Batchseq from location state
  // console.log("BatchID", BatchID); 
  // console.log("Batchseq", Batchseq);
  const [searchQuery, setSearchQuery] = useState(""); // usestate for search query
  const [transactions, setTransactions] = useState([]); // usestate for transactions
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

  // UseEffect to fetch data from the API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = {
          case_distribution_batch_id: BatchID ,
          batch_seq: Batchseq ,
        };
       // console.log("This is the payloadData", data);
        const response = await list_distribution_array_of_a_transaction(data);
        

        if (response.status === "success") {
          setTransactions(response.data);
         // console.log("Response", response);
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
      case_distribution_batch_id: BatchID ,
      batch_seq: Batchseq ,
      Created_By: userId,
    };
    //console.log("Payload", payload);
    try {
      const response =
        await Create_Task_For_case_distribution_transaction_array(payload);
     // console.log("Response", response);

      if (response.status === "success") {
       // console.log("Task created successfully");

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
  // Function to handle icon click and navigate to the respective page
  const handleoniconclick = () => {
    navigate("/pages/Distribute/CaseDistributionDRCTransactions-1Batch", {
      state: { BatchID: BatchID},
    });
  };

  const batchSeqDetails = transactions[0]?.batch_seq_details || [];
  const allDistributions = batchSeqDetails.flatMap(
    (batch) => batch.array_of_distributions || []
  );

  //console.log("allDistributions", allDistributions);
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
          <table>
            <colgroup>
              <col  />
              <col style={{ width: "20px" }} />
              <col />
              
            </colgroup>
            <tbody>
              <tr>
                  <td className="py-2"><strong>Batch ID  </strong></td>
                  <td className="py-2"><strong> : </strong> </td>
                  <td className="py-2"> {transactions[0]?.case_distribution_batch_id || "N/A"}</td>
              </tr>
              <tr>
                  <td className="py-2"><strong>DRC Commission Rule</strong></td>
                  <td className="py-2"> <strong> : </strong> </td>
                  <td className="py-2"> {transactions[0]?.drc_commision_rule || "N/A"}</td>
              </tr>
              <tr>
                  <td className="py-2"><strong>Arrears Band</strong></td>
                  <td className="py-2"> <strong> : </strong> </td>
                  <td className="py-2"> {transactions[0]?.current_arrears_band || "N/A"}</td>
              </tr>
              <tr>
                  <td className="py-2"><strong>Case Count</strong></td>
                  <td className="py-2"> <strong> : </strong> </td>
                  <td className="py-2"> {transactions[0]?.rulebase_count || "N/A"}</td>
              </tr>

            </tbody>  

          </table>
         
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
        {/* <div className={GlobalStyle.tableContainer}>
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
                     
                      No data found
                    </td>
                  </tr>
                )}

            </tbody>
          </table>
        </div> */}

        { Batchseq === 1 ? (
          <div className="flex items-center justify-center mb-4">
              <div className={GlobalStyle.cardContainer}>
                <table className={GlobalStyle.table}>
                  <thead className={GlobalStyle.thead}>
                    <tr>
                      <th scope="col" className={GlobalStyle.tableHeader}>
                        DRC
                      </th>
                      <th scope="col" className={GlobalStyle.tableHeader}>
                        Distribution Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item, index) => (
                        <tr
                          //key={item.date}
                          key={`${item.date}-${index}`}
                          className={
                            index % 2 === 0
                              ? GlobalStyle.tableRowEven
                              : GlobalStyle.tableRowOdd
                          }
                        >
                          <td className={GlobalStyle.tableData}>{item.drc}</td>
                          <td className={GlobalStyle.tableData}>
                            {item.rulebase_count}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                          No data found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div> 
          </div>
        ) : (
          <div className={GlobalStyle.tableContainer}>
            <table className={GlobalStyle.table}>
              <thead className={GlobalStyle.thead}>
                <tr>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    RTOM
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    DRC 1
                  </th>
                  <th scope="col" className={`${GlobalStyle.tableHeader} flex justify-center items-center`}>
                    <img src={minus} width={17} height={17} alt="Min" />
                  </th>
                  <th scope="col" className={GlobalStyle.tableHeader}>
                    DRC 2
                  </th>
                  <th scope="col" className={`${GlobalStyle.tableHeader} flex justify-center items-center`}>
                    <img src={plus} width={17} height={17} alt="Plus" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((
                    item,
                    index
                  ) => (
                    <tr
                      // key={item.date}
                      key={`${item.date}-${index}`}
                      className={
                        index % 2 === 0
                          ? GlobalStyle.tableRowEven
                          : GlobalStyle.tableRowOdd
                      }
                    >
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={GlobalStyle.tableData} style={{ textAlign: "center" }}>
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Button */}
      { filteredData.length > 0 && (
      <div className="flex justify-end">
        {/* Button on the right */}

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
      
      <div className="flex justify-start mt-2">
      <button className={GlobalStyle.buttonPrimary} onClick={handleoniconclick}>
        <FaArrowLeft className="mr-2" />
        </button>
      </div>
      
    </div>
          
  );
}
