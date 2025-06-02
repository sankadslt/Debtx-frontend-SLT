/* Purpose: This template is used for the 2.17 - Mediation Board case list .
Created Date: 2025-02-27
Created By: sakumini (sakuminic@gmail.com)
Modified By: Buthmi mithara (buthmimithara1234@gmail.com)
Modified By: Janani Kumrasiri (tgjkk001@gmail.com)
Version: node 20
ui number : 2.17
Dependencies: tailwind css
Related Files: (routes)
Notes:The following page conatins the code for the Mediation Board case list Screen */

import { useState, useEffect } from "react";
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { commission_type_cases_count } from "../../services/commission/commissionService";
import { Active_DRC_Details } from "../../services/drc/Drc";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { List_All_DRCs_Mediation_Board_Cases } from "../../services/case/CaseServices";
import { RTOM_Details } from "../../services/RTOM/Rtom";
import { Tooltip } from "react-tooltip";
import Forward_To_Mediation_Board from "/src/assets/images/Mediation_Board/Forward_To_Mediation_Board.png";
import MB_Negotiation from "/src/assets/images/Mediation_Board/MB_Negotiation.png";
import MB_Request_Customer_Info from "/src/assets/images/Mediation_Board/MB Request Customer-Info.png";
import MB_Handover_Customer_Info from "/src/assets/images/Mediation_Board/MB Handover Customer-Info.png";
import MB_Settle_Pending from "/src/assets/images/Mediation_Board/MB Settle Pending.png";
import MB_Settle_Open_Pending from "/src/assets/images/Mediation_Board/MB Settle Open Pending.png";
import MB_Fail_with_Pending_Non_Settlement from "/src/assets/images/Mediation_Board/MB Fail with Pending Non Settlement.png";

const MediationBoardCaseList = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [drcNames, setDrcNames] = useState([]);
  const [selectedDrcId, setSelectedDrcId] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [caseId, setCaseId] = useState("");
  const [searchBy, setSearchBy] = useState("case_id");
  const [isLoading, setIsLoading] = useState(false);
  const [caseStatus, setCaseStatus] = useState("");
  const [rtom, setRtom] = useState("");
  const [rtomList, setRtomList] = useState([]);

  const rowsPerPage = 10;

  // Decide the icon path based on the status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Forward to Mediation Board":
        return Forward_To_Mediation_Board;
      case "MB Negotiation":
        return MB_Negotiation;
      case "MB Request Customer-Info":
        return MB_Request_Customer_Info;
      case "MB Handover Customer-Info":
        return MB_Handover_Customer_Info;
      case "MB Settle Pending":
        return MB_Settle_Pending;
      case "MB Settle Open-Pending":
        return MB_Settle_Open_Pending;
      case "MB Fail with Pending Non-Settlement":
        return MB_Fail_with_Pending_Non_Settlement;
      default:
        return "";
    }
  };

  // render status icon with tooltip
  const renderStatusIcon = (status, index) => {
    const iconPath = getStatusIcon(status);

    if (!iconPath) {
      return <span>{status}</span>;
    }

    const tooltipId = `tooltip-${index}`;

    return (
      <div className="flex items-center gap-2">
        <img
          src={iconPath}
          alt={status}
          className="w-6 h-6"
          data-tooltip-id={tooltipId} // Add tooltip ID to image
        />
        {/* Tooltip component */}
        <Tooltip id={tooltipId} place="bottom" effect="solid">
          {status} {/* Tooltip text is the phase and status */}
        </Tooltip>
      </div>
    );
  };

  // initial data fetch
  useEffect(() => {
    // Fetch DRC names
    const fetchDrcNames = async () => {
      try {
        const names = await Active_DRC_Details(); 

        setDrcNames(names);
      } catch (error) {
        console.error("Error fetching DRC names:", error);
      }
    };

    // Fetch RTOM
    const fetchRTOM = async () => {
      try {
        const rtom = await RTOM_Details();

        setRtomList(rtom);
      } catch (error) {
        console.error("Error fetching DRC names:", error);
      }
    };

    setFilteredData([]);
    fetchDrcNames();
    fetchRTOM();
  }, []);

  // Fetch data from API
  const fetchData = async () => {
    try {

      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return offsetDate.toISOString().split('T')[0];
      };

      if (!caseStatus && !rtom && !selectedDrcId && !fromDate && !toDate) {
        Swal.fire({
          title: "Warning",
          text: "No filter is selected. Please, select a filter.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        setToDate(null);
        setFromDate(null);
        return;
      }

      if ((fromDate && !toDate) || (!fromDate && toDate)) {
        Swal.fire({
          title: "Warning",
          text: "Both From Date and To Date must be selected.",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false
        });
        setToDate(null);
        setFromDate(null);
        return;
      }

      const filters = {
        case_status: caseStatus,
        From_DAT: formatDate(fromDate),
        TO_DAT: formatDate(toDate),
        RTOM: rtom,
        DRC_ID: selectedDrcId,
        pages: currentPage,
      };
      // console.log("Filters sent to api:", filters);

      setIsLoading(true);
      const response = await List_All_DRCs_Mediation_Board_Cases(filters);

      if (response && response.data && response.status === "success") {
        // console.log("Valid data received:", response.data);

        // Append the new data to the existing data
        setFilteredData((prevData) => [...prevData, ...response.data]);
        if (response.data.length === 0) {
          setIsMoreDataAvailable(false); // No more data available
          if (currentPage === 1) {
            Swal.fire({
              title: "No Results",
              text: "No matching data found for the selected filters.",
              icon: "warning",
              allowOutsideClick: false,
              allowEscapeKey: false
            });
          }
        } else {
          const maxData = currentPage === 1 ? 10 : 30;
          if (response.data.length < maxData) {
            setIsMoreDataAvailable(false); // More data available
          }
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "No valid Settlement data found in response.",
          icon: "error"
        });
        setFilteredData([]);
      }

    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to fetch data.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFromDateChange = (date) => {
    setFromDate(date);
    validateDates(date, toDate);
  };

  const handleToDateChange = (date) => {
    setToDate(date);
    validateDates(fromDate, date);
  };

  const validateDates = (from, to) => {
    if (from && to) {

      if (from >= to) {
        Swal.fire({
          title: "Warning",
          text: "From date must be before to date",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
        });
        setFromDate(null);
        setToDate(null);
        return false;
      }
      const oneMonthLater = new Date(from);
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

      if (to > oneMonthLater) {
        Swal.fire({
          title: "Warning",
          text: "Date range cannot exceed one month",
          icon: "warning",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
        });
        setFromDate(null);
        setToDate(null);
        return false;
      }
    }

    return true;
  };

  // Validate case ID input preventing non-numeric characters
  const validateCaseId = () => {
    if (searchBy === "case_id" && !/^\d*$/.test(caseId)) {
      Swal.fire({
        title: "Warning",
        text: "Invalid input. Only numbers are allowed for Case ID.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      setCaseId(""); // Clear the invalid input
      return;
    }
  }

  useEffect(() => {
    validateCaseId(); // Validate case ID input
  }, [caseId]);

  useEffect(() => {
    if (isFilterApplied && isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage); // Update max current page
      fetchData(); // Call the function whenever currentPage changes
    }
  }, [currentPage]);

  // Handle filter button click
  const handleFilterButton = () => {
    setFilteredData([]); // Clear previous results
    setIsMoreDataAvailable(true); // Reset more data available state
    setMaxCurrentPage(0); // Reset max current page
    if (currentPage === 1) {
      fetchData();
    } else {
      setCurrentPage(1);
    }
    setIsFilterApplied(true); // Set filter applied state to true
  }

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);
  // console.log("Filtered data:", filteredData);

  // console.log("Paginated data:", paginatedData);

  // Search Section
  const filteredDataBySearch = paginatedData.filter((row) =>
    Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // handle next arrow click
  const handleNextPage = () => {
    if (isMoreDataAvailable) {
      setCurrentPage(currentPage + 1);
    } else {
      const totalPages = Math.ceil(filteredData.length / rowsPerPage);
      setTotalPages(totalPages);
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  // Handle previous arrow click
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle clear button click
  const handleClear = () => {
    setCaseStatus("");
    setRtom("");
    setFromDate(null);
    setToDate(null);
    setSelectedDrcId("");
    setSearchQuery("");
    setCurrentPage(0); // Reset to the first page
    setIsFilterApplied(false); // Reset filter applied state
    setTotalPages(0); // Reset total pages
    setFilteredData([]); // Clear filtered data
  };

  const navigate = useNavigate();

  // Navigate to the case ID page
  const naviCaseID = (caseId) => {
    navigate("", { state: { caseId } });
  }

  // Navigate to the preview page
  const naviPreview = (caseID, DRC_ID) => {
    navigate("/MediationBoard/MediationBoardResponse", { state: { caseID, DRC_ID } });
  };

  // display loading animation when data is loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${GlobalStyle.fontPoppins}`}>
      <h1 className={GlobalStyle.headingLarge + " mb-6"}>Mediation Board Case List</h1>

      <div className={`${GlobalStyle.cardContainer} w-full`}>
        <div className="flex  flex-wrap xl:flex-nowrap items-center justify-end w-full gap-3">

          <div className="flex  flex-wrap items-center">
            <select
              value={caseStatus}
              onChange={(e) => setCaseStatus(e.target.value)}
             className={`${GlobalStyle.selectBox} `}
              style={{ color: caseStatus === "" ? "gray" : "black" }}
            >
              <option value="" hidden>Status</option>
              <option value="Forward to Mediation Board" style={{ color: "black" }}>Forward to Mediation Board</option>
              <option value="MB Negotiation" style={{ color: "black" }}>MB Negotiation</option>
              <option value="MB Request Customer-Info" style={{ color: "black" }}>MB Request Customer-Info</option>
              <option value="MB Handover Customer-Info" style={{ color: "black" }}>MB Handover Customer-Info</option>
              <option value="MB Settle Pending" style={{ color: "black" }}>MB Settle Pending</option>
              <option value="MB Settle Open-Pending" style={{ color: "black" }}>MB Settle Open-Pending</option>
              <option value="MB Fail with Pending Non-Settlement" style={{ color: "black" }}>MB Fail with Pending Non-Settlement</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center">
            <select
              value={selectedDrcId}
              onChange={(e) => setSelectedDrcId(e.target.value)}
              className={`${GlobalStyle.selectBox} `}
              style={{ color: selectedDrcId === "" ? "gray" : "black" }}
            >
              <option value="" hidden>DRC</option>
              {drcNames.map((drc) => (
                <option key={drc.key} value={drc.id.toString()} style={{ color: "black" }}>
                  {drc.value}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap  items-center">
            <select
              value={rtom}
              onChange={(e) => setRtom(e.target.value)}
              className={`${GlobalStyle.selectBox}`}
              style={{ color: rtom === "" ? "gray" : "black" }}
            >
              <option value="" hidden>RTOM</option>
              {Object.values(rtomList).map((rtom) => (
                <option key={rtom.rtom_id} value={rtom.rtom} style={{ color: "black" }}>
                  {rtom.rtom}
                </option>
              ))}
            </select>
          </div>

          {/* <div className="flex items-center"> */}
            <label className={GlobalStyle.dataPickerDate}>Date:</label>
            {/* <div className="flex items-center space-x-2"> */}
              {/* <div className="flex items-center"> */}
                <DatePicker
                  selected={fromDate}
                  onChange={handleFromDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="From"
                  className={`${GlobalStyle.inputText} w-full sm:w-auto`}
                />
              {/* </div> */}

              {/* <div className="flex items-center"> */}
                <DatePicker
                  selected={toDate}
                  onChange={handleToDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="To"
                  className={`${GlobalStyle.inputText} w-full sm:w-auto`}
                />
              {/* </div> */}
            {/* </div> */}
          {/* </div> */}

          <button
            className={`${GlobalStyle.buttonPrimary}  w-full sm:w-auto`}
            onClick={handleFilterButton}
          >
            Filter
          </button>
          <button
             className={`${GlobalStyle.buttonRemove}  w-full sm:w-auto`}
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            className={GlobalStyle.inputSearch}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>
      </div>

       <div className={`${GlobalStyle.tableContainer} overflow-x-auto`}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Status</th>
              <th className={GlobalStyle.tableHeader}>DRC</th>
              <th className={GlobalStyle.tableHeader}>RO Name</th>
              <th className={GlobalStyle.tableHeader}>RTOM</th>
              <th className={GlobalStyle.tableHeader}>Calling Round</th>
              <th className={GlobalStyle.tableHeader}>Created Date</th>
              <th className={GlobalStyle.tableHeader}>Next Calling Date</th>
              <th className={GlobalStyle.tableHeader}></th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.length > 0 ? (
              filteredDataBySearch.map((row, index) => (
                <tr
                  key={index}
                  className={
                    index % 2 === 0
                      ? GlobalStyle.tableRowEven
                      : GlobalStyle.tableRowOdd
                  }
                >
                  <td
                    className={`${GlobalStyle.tableData}  text-black hover:underline cursor-pointer`}
                    onClick={() => naviCaseID(item.case_id)}
                  >
                    {row.case_id}
                  </td>
                  <td className={`${GlobalStyle.tableData} flex items-center justify-center`}>
                    {renderStatusIcon(row.status, index)}
                    </td>
                  <td className={GlobalStyle.tableData}>{row.drc_name}</td>
                  <td className={GlobalStyle.tableData}>{row.ro_name}</td>
                  <td className={GlobalStyle.tableData}>{row.rtom}</td>
                  <td className={GlobalStyle.tableData}>{row.calling_round}</td>
                  <td className={GlobalStyle.tableData}>
                    {row.date &&
                      new Date(row.date).toLocaleString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        // hour: "2-digit",
                        // minute: "2-digit",
                        // second: "2-digit",
                        hour12: true,
                      })}
                  </td>
                  <td className={GlobalStyle.tableData}>
                    {row.next_calling_date &&
                      new Date(row.next_calling_date).toLocaleString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        // hour: "2-digit",
                        // minute: "2-digit",
                        // second: "2-digit",
                        hour12: true,
                      })}
                  </td>
                  <td className={GlobalStyle.tableData + " text-center"}>
                    <button
                      className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={() => naviPreview(row.case_id, row.drc_id)}
                      data-tooltip-id={`tooltip-${row.case_id}`}
                    >
                      !
                    </button>
                    <Tooltip id={`tooltip-${row.case_id}`} place="bottom" effect="solid">
                      <span>More Info</span>
                    </Tooltip>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className= {GlobalStyle.tableData + " text-center"}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {
        filteredData.length != 0 && (
          <div className={GlobalStyle.navButtonContainer}>
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed" : ""}`}
            >
              <FaArrowLeft />
            </button>
            <span>
              Page {currentPage}
            </span>
            <button
              className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""}`}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <FaArrowRight />
            </button>
          </div>
        )
      }
    </div >
  );
};

export default MediationBoardCaseList;
