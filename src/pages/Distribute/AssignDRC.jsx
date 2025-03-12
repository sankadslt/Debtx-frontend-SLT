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
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import GlobalStyle from "../../assets/prototype/GlobalStyle.jsx"; // Importing GlobalStyle
import { FaSearch } from "react-icons/fa";
import {
  fetchAllArrearsBands,
  count_cases_rulebase_and_arrears_band,
  Case_Distribution_Among_Agents,
} from "/src/services/case/CaseServices.js";
import {getLoggedUserId} from "/src/services/auth/authService.js";
import { Active_DRC_Details } from "/src/services/drc/Drc.js";
import Swal from "sweetalert2";
import Chart from "/src/pages/Chart.jsx";



const AssignDRC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [arrearsBands, setArrearsBands] = useState([]);
  const [selectedBand, setSelectedBand] = useState("");
  const [bandsAndCounts, setBandsAndCounts] = useState({});
  const [drcNames, setDrcNames] = useState([]);
  const [total, setTotal] = useState(0);
  const [arrearsbandTotal, setArrearsbandTotal] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedBandKey, setSelectedBandKey] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const { serviceType } = location.state || {};

  const [drcData, setDrcData] = useState([]);
  const [newEntry, setNewEntry] = useState({
    drc: "",
    casesAmount: "",
    drcNames: "",
  });

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
        setDrcNames(Names);
        
      } catch (error) {
        console.error("Error fetching drc names:", error);
      }
    };
    fetchDRCNames();
  });

  

  //fetch count cases rulebase and arrears band
  useEffect(() => {
    const displayData = async () => {
      const effectiveServiceType = serviceType || "PEO TV"; // Use "PEO TV" as default
      console.log("Service Type:", serviceType);
      console.log("Effective Service Type:", effectiveServiceType);
      try {
        const drcDetails = await count_cases_rulebase_and_arrears_band(
          effectiveServiceType
        );
        const { total, bandsAndCounts } = drcDetails;

        setTotal(total);
        setBandsAndCounts(bandsAndCounts);
        console.log("bandsAndCounts:", bandsAndCounts);
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


  const handleAdd = () => {
    const { drc, drckey, casesAmount } = newEntry;
    console.log("New Entry:", newEntry);
    const numericCasesAmount = parseInt(casesAmount, 10);

    if (totalDistributedAmount + numericCasesAmount > arrearsbandTotal) {
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `The total distributed cases (${
          totalDistributedAmount + numericCasesAmount
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
      setNewEntry({ drc: "", casesAmount: ""  }); // Clear inputs
    }
  };

  const handleRemove = (name) => {
    const updatedData = filteredSearchData.filter((drc) => drc.name !== name);
    setDrcData(updatedData);
  };

  const totalDistributedAmount = drcData.reduce(
    (total, drc) => total + parseFloat(drc.amount),
    0
  );

  const handleArrearsBandChange = (e) => {
    const selectedBand = e.target.value;
    console.log("Selected Band:", selectedBand);
    setSelectedBand(selectedBand);

    const selectedBandCount = bandsAndCounts[selectedBand];
    setArrearsbandTotal(selectedBandCount ?? 0);

    const band = arrearsBands.find((band) => band.value === selectedBand);
    if (band) {
      setSelectedBandKey(band.key);
      console.log("Selected Band Key:", band.key);
    }
  };
  

  const handleProceed = async () => {
    const userId = await getLoggedUserId();

    const drcList = filteredSearchData.map((drc) => ({
      DRC: String(drc.name),
      DRC_Id: Number(drc.drckey),
      Count: Number(drc.amount),
    }));

    const requestData = {
      drc_commision_rule: serviceType || "PEO TV",
      current_arrears_band: selectedBandKey,
      drc_list: drcList,
      created_by: userId,
    };

    console.log("Request Data:", requestData);

    try {
      const response = await Case_Distribution_Among_Agents(requestData); // Use 'await' here
      console.log("Response:", response);

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

  const handlepiechart1 = () => {
    setShowPopup(true); // Open chart popup
  };

  const handlepiechart2 = () => {
    setShowPopup(true); // Open chart popup
  }
  
  return (
    <div className={`${GlobalStyle.fontPoppins} flex flex-col `}>
      {/* Main Content */}
      <div className="flex-1 p-10">
        {/* Assign DRC Heading */}
        <h1 className={`${GlobalStyle.headingLarge}`}>Assign DRC</h1>

        <h3 className={`${GlobalStyle.headingMedium} mb-5`}>
          Service Type: {serviceType || "PEO-TV"}
        </h3>

        {/* Pending Cases */}
        <div className={`${GlobalStyle.caseCountBar}`}>
          <div className="flex">
            <span className={GlobalStyle.countBarTopic}>Pending Cases</span>
          </div>
          <div className={GlobalStyle.countBarSubTopicContainer}>
            <div className={GlobalStyle.countBarMainBox}>
              <span>Total:</span>
              <p className={GlobalStyle.countBarMainTopic}>{total}</p>
            </div>
            {/* Dynamically render bands and counts */}
            {Object.entries(bandsAndCounts).map(([band, count]) => (
              <div key={band} className={GlobalStyle.countBarSubBox}>
                <span>{band}</span>
                <p className={GlobalStyle.countBarSubTopic}>{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Service Type and Table */}
        <div className="relative">
          <div className="flex items-center my-10 space-x-4">
            {/* Arrears Band Dropdown */}
            <select
              className={`${GlobalStyle.selectBox}`}
              value={selectedBand}
              onChange={handleArrearsBandChange}
              disabled={totalDistributedAmount > 0}
            >
              <option value="" hidden>
                Arrears Band
              </option>
              {arrearsBands.map(({ key, value }) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <div
              className={`${GlobalStyle.countBarMainBox}`}
              style={{ width: "160px", textAlign: "center" }}
            >
              Total Count: {arrearsbandTotal}
            </div>
          </div>
          <div className="flex items-center my-10 space-x-4">
            {/* DRC Dropdown */}
            <select
              className={`${GlobalStyle.selectBox}`}
              value={newEntry.drc}
              onChange={(e) =>{
                const selectedDRC = drcNames.find((drc) => drc.value === e.target.value);
                setNewEntry({ ...newEntry, 
                  drckey: selectedDRC.key,
                  drc: selectedDRC.value });
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
              placeholder="+ cases"
              className="py-1 px-4 w-32 border-2 border-[#0056A2] rounded-lg bg-[#057DE8] bg-opacity-10"
              min="1"
              max={arrearsbandTotal}
              value={newEntry.casesAmount}
              onChange={(e) =>
                setNewEntry({ ...newEntry, casesAmount: e.target.value })
              }
            />

            {/* Add Button */}
           
            <button
              className={`${GlobalStyle.buttonPrimary} w-[135px]`}
              onClick={handleAdd}
            >
              Add
            </button>
            
          </div>
          <div
            className={`${GlobalStyle.countBarMainBox}flex items-center my-10 `}
            style={{ width: "160px", textAlign: "center" }}
          >
            Selected Count: {totalDistributedAmount}
          </div>

          <div className="flex">
            {/* Table */}
            <div className="flex flex-col w-2/3">
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
              </div>{" "}
              <div className={`${GlobalStyle.tableContainer} `}>
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
                            <button onClick={() => handleRemove(drc.name)}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={28}
                                height={29}
                                fill="none"
                              >
                                <path
                                  fill="#000"
                                  fillRule="evenodd"
                                  d="M14 28.5a14 14 0 1 0 0-28 14 14 0 0 0 0 28ZM6.222 16.056h15.556v-3.112H6.222v3.112Z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
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

            {/* Pie Chart Buttons */}
            <div>
            <button  className={`${GlobalStyle.buttonPrimary} h-10 mr-5 ml-5 `} onClick={handlepiechart1}>
               Pie Chart 1
            </button>
             <Chart showPopup={showPopup} setShowPopup={setShowPopup} />
            </div>
            <div>
            <button className={`${GlobalStyle.buttonPrimary} h-10`} onClick={handlepiechart2}>
               Pie Chart 2
            </button>
            <Chart showPopup={showPopup} setShowPopup={setShowPopup} />
            </div>
            
          </div>

          {/* Proceed Button */}
          <div className="text-right">
            <button
              onClick={handleProceed}
              className={`${GlobalStyle.buttonPrimary}`}
              disabled={totalDistributedAmount !== arrearsbandTotal}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignDRC;
