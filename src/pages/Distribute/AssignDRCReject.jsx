/* Purpose: This template is used for the 1.A.12 - Assign DRC page.
Created Date: 2025-01-07
Created By: Geeth (eshaneperera@gmail.com)
Last Modified Date: 2025-01-07
Modified By: Geeth(eshaneperera@gmail.com)
Version: node 20
ui number : 1.A.12
Dependencies: tailwind css
Related Files: (routes)
Notes: This page includes a case count bar, filter , table and a pie chart  */

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";


import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Importing GlobalStyle
import { FaSearch } from "react-icons/fa";
import {
  fetchAllArrearsBands,
  count_cases_rulebase_and_arrears_band,
  Case_Distribution_Among_Agents,
  List_Rejected_Batch_Summary_Case_Distribution_Batch_Id
} from "/src/services/case/CaseServices.js";
import { getLoggedUserId } from "/src/services/auth/authService.js";
import { Active_DRC_Details } from "/src/services/drc/Drc.js";
import Minus from "/src/assets/images/distribution/minorc.png";

import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";
import Chart from "/src/pages/Chart.jsx";
import { FaArrowLeft } from "react-icons/fa";

import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";



const AssignDRCReject = () => {
  const [searchQuery, setSearchQuery] = useState(""); // Usestate for search query
  const [editMode, setEditMode] = useState(null); // Usestate for edit mode
  const [arrearsBands, setArrearsBands] = useState([]); // Usestate for arrears bands
  const [selectedBand, setSelectedBand] = useState(""); // Usestate for selected band
  const [bandsAndCounts, setBandsAndCounts] = useState({}); // Usestate for bands and counts
  const [drcNames, setDrcNames] = useState([]); // Usestate for DRC names
  const [total, setTotal] = useState(0); // Usestate for total count
  const [arrearsbandTotal, setArrearsbandTotal] = useState(0); // Usestate for arrears band total
  const location = useLocation(); // Using useLocation to get the state from the previous page
  const navigate = useNavigate(); // Using useNavigate for routing
  const [selectedBandKey, setSelectedBandKey] = useState(null); // Usestate for selected band key
  const [showPopup, setShowPopup] = useState(false); // Usestate for showing the popup
  const { serviceType } = location.state || {};

  const [drcData, setDrcData] = useState([]); // Usestate for DRC data
  const [newEntry, setNewEntry] = useState({ // Usestate for new entry
    drc: "",
    casesAmount: "",
    drcNames: "",
  });
  const [rejectedDRCData, setRejectedDRCData] = useState(null); // Usestate for rejected DRC data
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons

  const case_distribution_batch_id = 26; // Hardcoded case distribution batch ID for testing

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
    fetchRejectedBatchSummary(); // Fetch rejected batch summary on component mount
  }, []);

  useEffect(() => {
    setSelectedBand(rejectedDRCData?.current_arrears_band || "");
    setArrearsbandTotal(rejectedDRCData?.rulebase_count || 0); // Set the arrears band total from the rejected DRC data
  }, [rejectedDRCData])

  console.log("Arrears Band:", selectedBand); // Log the user role for debugging
  console.log("Arrears Band Total:", arrearsbandTotal); // Log the arrears band total for debugging
  // Fetch rejected batch summary data
  const fetchRejectedBatchSummary = async () => {
    try {
      const response = await List_Rejected_Batch_Summary_Case_Distribution_Batch_Id(case_distribution_batch_id);
      if (response) {
        setRejectedDRCData(response);
        console.log("Rejected DRC Data:", response);
      } else {
        console.error("No data found for the given batch ID.");
      }
    } catch (error) {
      console.error("Error fetching rejected batch summary:", error);
    }
  }

  //fetch all arrears bands
  useEffect(() => {
    const fetchArrearsBands = async () => {
      try {
        const bands = await fetchAllArrearsBands();
        setArrearsBands(bands);
      } catch (error) {
        console.error("Error fetching arrears bands:", error);
      }
    };
    fetchArrearsBands();
  }, []);

  //fetch all drc names
  useEffect(() => {
    const fetchDRCNames = async () => {
      try {
        const Names = await Active_DRC_Details();
        console.log("DRC Names:", Names);
        setDrcNames(Names);

      } catch (error) {
        console.error("Error fetching drc names:", error);
      }
    };
    fetchDRCNames();
  }, []);

  //fetch count cases rulebase and arrears band
  useEffect(() => {
    const displayData = async () => {
      const effectiveServiceType = serviceType; // Use "PEO TV" as default
      //  console.log("Service Type:", serviceType);
      //   console.log("Effective Service Type:", effectiveServiceType);
      try {
        const drcDetails = await count_cases_rulebase_and_arrears_band(
          effectiveServiceType
        );
        const { total, bandsAndCounts } = drcDetails;

        setTotal(total);
        setBandsAndCounts(bandsAndCounts);
        //  console.log("bandsAndCounts:", bandsAndCounts);
      } catch (error) {
        console.error("Failed to fetch and display data:", error);
      }
    };

    displayData();
  }, [serviceType]);

  //search fuction
  const filteredSearchData = drcData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Function to handle adding a new entry
  const handleAdd = () => {
    const { drc, drckey, casesAmount } = newEntry;
    // console.log("New Entry:", newEntry);
    const numericCasesAmount = parseInt(casesAmount, 10);

    if (totalDistributedAmount + numericCasesAmount > arrearsbandTotal) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text: `The total distributed cases (${totalDistributedAmount + numericCasesAmount
          }) exceeds the limit of the Total count ${arrearsbandTotal}. Please adjust the entered number of cases.`,
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (totalDistributedAmount >= arrearsbandTotal) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Cannot Add More, The total Count and The selected count are equal.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (drc && numericCasesAmount) {
      setDrcData([
        ...drcData,
        { id: drcData.length + 1, name: drc, amount: parseFloat(casesAmount), drckey: drckey },
      ]);
      setNewEntry({ drc: "", casesAmount: "" }); // Clear inputs
    }
  };

  // Function to handle removing an entry
  const handleRemove = (name) => {
    const updatedData = filteredSearchData.filter((drc) => drc.name !== name);
    setDrcData(updatedData);
  };

  const totalDistributedAmount = drcData.reduce(
    (total, drc) => total + parseFloat(drc.amount),
    0
  );

  // Function to handle changes in the arrears band dropdown
  const handleArrearsBandChange = (e) => {
    const selectedBand = e.target.value;
    // console.log("Selected Band:", selectedBand);
    setSelectedBand(selectedBand);

    const selectedBandCount = bandsAndCounts[selectedBand];
    setArrearsbandTotal(selectedBandCount ?? 0);

    const band = arrearsBands.find((band) => band.value === selectedBand);
    if (band) {
      setSelectedBandKey(band.key);
      // console.log("Selected Band Key:", band.key);
    }
  };


  // Function to handle proceeding with the selected DRCs
  const handleProceed = async () => {
    const userId = await getLoggedUserId();

    const drcList = filteredSearchData.map((drc) => ({
      DRC: String(drc.name),
      DRC_Id: Number(drc.drckey),
      Count: Number(drc.amount),
    }));

    const requestData = {
      drc_commision_rule: serviceType,
      current_arrears_band: selectedBandKey,
      drc_list: drcList,
      created_by: userId,
    };

    // console.log("Request Data:", requestData);

    try {
      const response = await Case_Distribution_Among_Agents(requestData); // Use 'await' here
      // console.log("Response:", response);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data sent successfully.",
        confirmButtonColor: "#28a745",
      }).then(() => {
        navigate("/pages/Distribute/AssignedDRCSummary");
      });
    } catch (error) {
      console.error("Error in sending the data:", error);

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

  // Function to handle changes in the DRC dropdown
  const handlepiechart1 = () => {
    setShowPopup(true); // Open chart popup
  };

  // Function to handle changes in the DRC dropdown
  const handlepiechart2 = () => {
    setShowPopup(true); // Open chart popup
  }

  // Function to handle back button click
  const handlebackbuttonClick = () => {
    navigate("/pages/Distribute/DistributionPreparationBulkUpload"); // Navigate back to the previous page
  };

  return (
    <div className={`${GlobalStyle.fontPoppins} flex flex-col `}>
      {/* Main Content */}
      <div className="flex-1 p-10">
        {/* Assign DRC Heading */}
        <h1 className={`${GlobalStyle.headingLarge}`}>Assign DRC</h1>

        <h3 className={`${GlobalStyle.headingMedium} mb-5`}>
          Rejected Batch ID: {case_distribution_batch_id}
        </h3>

        <h3 className={`${GlobalStyle.headingMedium} mb-5`}>
          DRC Commission Rule: {rejectedDRCData?.drc_commision_rule || "N/A"}
        </h3>

        {/* Rejected DRC Table */}
        <h3 className={`${GlobalStyle.countBarTopic} mb-5`}>
          Rejected Batch Summary:
        </h3>
        <div className="flex justify-center items-center">
          <div className="flex flex-col w-full">
            <div className={`${GlobalStyle.tableContainer} overflow-x-auto w-full`}>
              <table
                className={`${GlobalStyle.table}`}
                aria-labelledby="drc-table"
              >
                <thead className={`${GlobalStyle.thead}`}>
                  <tr>
                    <th
                      className={`${GlobalStyle.tableHeader} text-center`}
                    ></th>
                    <th
                      scope="col"
                      className={`${GlobalStyle.tableHeader}`}
                      aria-label="DRC Name"
                    >
                      DRC Name
                    </th>
                    <th
                      scope="col"
                      className={`${GlobalStyle.tableHeader}`}
                      aria-label="Distributed Amount (LKR)"
                    >
                      Distributed Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rejectedDRCData?.rejected_drc_summary.length > 0 ? (
                    rejectedDRCData.rejected_drc_summary.map((drc, index) => (
                      <tr
                        key={drc.drc_id}
                        className={
                          index % 2 === 0
                            ? GlobalStyle.tableRowEven
                            : GlobalStyle.tableRowOdd
                        }
                        aria-rowindex={drc.drc_id}
                      >
                        <td className="px-6 py-4 text-center">
                          <div>
                            <span
                              style={{ cursor: "default", color: "red", fontSize: "1.2rem" }}
                              data-tooltip-id="reject"
                            >
                              ❌
                            </span>
                          </div>
                          <Tooltip id="reject" place="bottom" content="Rejected" />
                        </td>
                        <td className={GlobalStyle.tableData}>{drc.drc}</td>
                        <td className={GlobalStyle.tableData}>
                          {drc.rulebase_count}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className={`${GlobalStyle.tableData} text-center`}>
                        No data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* First Row */}
        <div className="relative">
          <div className="flex justify-between items-center my-8 space-x-4 gap-4 flex-col sm:flex-row sm:items-center">
            <div>
              <div>
                {["admin", "superadmin", "slt"].includes(userRole) && (
                  <button className={`${GlobalStyle.buttonPrimary} h-10 mr-5 mt-2 w-full sm:w-auto `} onClick={handlepiechart1}>
                    DRC Summary
                  </button>
                )}
              </div>
              <Chart showPopup={showPopup} setShowPopup={setShowPopup} />
            </div>
            <div className="flex gap-4">
              <div
                className={`${GlobalStyle.countBarMainBox} flex items-center`}
                style={{ width: "160px", textAlign: "center" }}
              >
                Total Count: {rejectedDRCData?.rulebase_count || 0}
              </div>
              <div
                className={`${GlobalStyle.countBarMainBox}flex items-center`}
                style={{ width: "160px", textAlign: "center" }}
              >
                Selected Count: {totalDistributedAmount}

              </div>
            </div>
          </div>
          <div className={`flex justify-end items-center my-5 lg:flex-row flex-col lg:items-center`}>
            <div className={`${GlobalStyle.cardContainer} w-[50vw] flex flex-wrap justify-end items-center gap-4`}>

              {/* DRC Dropdown */}
              <select
                className={`${GlobalStyle.selectBox} w-full sm:w-auto`}
                value={selectedBand}
                onChange={handleArrearsBandChange}
                disabled={selectedBand}
              >
                <option value="" hidden>
                  Arrears Band
                </option>
                {arrearsBands.map(({ key, value }) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
              <select
                className={`${GlobalStyle.selectBox}  w-full sm:w-44`}
                value={newEntry.drc}
                onChange={(e) => {
                  const selectedDRC = drcNames.find((drc) => drc.value === e.target.value);
                  setNewEntry({
                    ...newEntry,
                    drckey: selectedDRC.key,
                    drc: selectedDRC.value
                  });
                }}
              >
                <option value="" hidden>
                  DRC
                </option>
                {drcNames.map(({ key, value }) => (
                  <option key={key} value={value}>
                    {value}
                  </option>
                ))}
              </select>

              {/* Input for "+ cases" */}
              <input
                type="number"
                placeholder="+ cases "
                className="py-1 px-5 w-44 border-2 border-[#0056A2] rounded-lg bg-[#057DE8] bg-opacity-10"
                min="1"
                max={arrearsbandTotal}
                value={newEntry.casesAmount}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, casesAmount: e.target.value })
                }
              />

              {/* Add Button */}
              <div>
                {["admin", "superadmin", "slt"].includes(userRole) && (
                  <button
                    className={`${GlobalStyle.buttonPrimary}  w-[135px]`}
                    onClick={handleAdd}
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Table */}
            <div className="flex flex-col w-full">
              <div className={`${GlobalStyle.tableContainer} overflow-x-auto w-full`}>
                <table
                  className={`${GlobalStyle.table}`}
                  aria-labelledby="drc-table"
                >
                  <thead className={`${GlobalStyle.thead}`}>
                    <tr>
                      <th
                        scope="col"
                        className={`${GlobalStyle.tableHeader}`}
                        aria-label="DRC Name"
                      >
                        DRC Name
                      </th>
                      <th
                        scope="col"
                        className={`${GlobalStyle.tableHeader}`}
                        aria-label="Distributed Amount (LKR)"
                      >
                        Distributed Amount
                      </th>
                      <th
                        className={`${GlobalStyle.tableHeader} text-center`}
                      ></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSearchData.length > 0 ? (
                      filteredSearchData.map((drc, index) => (
                        <tr
                          key={drc.id}
                          className={
                            index % 2 === 0
                              ? GlobalStyle.tableRowEven
                              : GlobalStyle.tableRowOdd
                          }
                          aria-rowindex={drc.id}
                        >
                          <td className={GlobalStyle.tableData}>{drc.name}</td>
                          <td className={GlobalStyle.tableData}>
                            {drc.amount}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div>
                              {["admin", "superadmin", "slt"].includes(userRole) && (
                                <button onClick={() => handleRemove(drc.name)}>

                                  <img src={Minus} width={20} height={15} alt="Delete" data-tooltip-id="delete" />
                                </button>
                              )}
                            </div>
                            <Tooltip id="delete" place="bottom" content="Remove" />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-6 text-center">
                          No data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Proceed Button */}
          <div className="text-right">
            <div>
              {["admin", "superadmin", "slt"].includes(userRole) && (
                <button
                  onClick={handleProceed}
                  className={`${GlobalStyle.buttonPrimary} mt-5`}
                  disabled={totalDistributedAmount !== arrearsbandTotal}
                >
                  Proceed
                </button>
              )}
            </div>
          </div>
          {/* Back Button */}
          <div className="flex justify-start items-center w-full mt-5  ">
            <button
              className={`${GlobalStyle.buttonPrimary} `}
              onClick={handlebackbuttonClick}
            >
              <FaArrowLeft className="mr-2" />

            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignDRCReject;
