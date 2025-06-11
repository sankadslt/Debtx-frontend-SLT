/*Purpose: 
Created Date: 2025-01-09
Created By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Last Modified Date: 2025-01-09
Modified By: Dilmith Siriwardena (jtdsiriwardena@gmail.com)
Version: React v18
ui number : 0.1
Dependencies: Tailwind CSS
Related Files: 
Notes: This template uses Tailwind CSS */

import { useEffect, useState } from 'react';
import GlobalStyle from "../../assets/prototype/GlobalStyle";
import { FaSearch, FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa";
import Swal from "sweetalert2";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { GetFilteredCaseLists, getCaseStatusList } from "../../services/case/CaseServices";
import { fetchAllArrearsBands } from '../../services/case/CaseServices';
import { List_All_Active_RTOMs } from "../../services/RTOM/Rtom";
import { Active_DRC_Details } from '../../services/drc/Drc';
import { getActiveServiceDetails } from "../../services/drc/Drc";
import { jwtDecode } from "jwt-decode";
import { refreshAccessToken } from "../../services/auth/authService";
import { Tooltip } from "react-tooltip";
import Pending_Assign_Agent_Approval from "/src/assets/images/distribution/Pending_Assign_Agent_Approval.png";
import Open_Assign_Agent from "/src/assets/images/distribution/Open_Assign_Agent.png";
import Open_With_Agent from "/src/assets/images/distribution/Open_With_Agent.png";
import RO_Negotiation from "/src/assets/images/Negotiation/RO_Negotiation.png";
import RO_Settle_Pending from "/src/assets/images/Negotiation/RO_Settle_Pending.png";
import RO_Settle_Open_Pending from "/src/assets/images/Negotiation/RO_Settle_Open_Pending.png";
import RO_Settle_Active from "/src/assets/images/Negotiation/RO_Settle_Active.png";
import RO_Negotiation_extend_pending from "/src/assets/images/Negotiation/RO Negotiation extend pending.png";
import RO_Negotiation_extended from "/src/assets/images/Negotiation/RO Negotiation extended.png";
import RO_Negotiation_FMB_Pending from "/src/assets/images/Negotiation/RO_Negotiation_FMB_Pending.png";
import Forward_To_Mediation_Board from "/src/assets/images/Mediation_Board/Forward_To_Mediation_Board.png";
import MB_Negotiation from "/src/assets/images/Mediation_Board/MB_Negotiation.png";
import MB_Request_Customer_Info from "/src/assets/images/Mediation_Board/MB Request Customer-Info.png";
import MB_Handover_Customer_Info from "/src/assets/images/Mediation_Board/MB Handover Customer-Info.png";
import MB_Settle_Pending from "/src/assets/images/Mediation_Board/MB Settle Pending.png";
import MB_Settle_Open_Pending from "/src/assets/images/Mediation_Board/MB Settle Open Pending.png";
import MB_Settle_Active from "/src/assets/images/Mediation_Board/MB Settle Active.png";
import MB_Fail_with_Pending_Non_Settlement from "/src/assets/images/Mediation_Board/MB Fail with Pending Non Settlement.png";
import MB_Fail_with_non_settlement from "/src/assets/images/Mediation_Board/MB Fail with non settlement.png";
import Pending_FTL_LOD from "/src/assets/images/LOD/Pending_FTL_LOD.png";
import Initial_FTL_LOD from "/src/assets/images/LOD/Initial_FTL_LOD.png";
import FTL_LOD_Settle_Pending from "/src/assets/images/LOD/FTL_LOD_Settle_Pending.png";
import FTL_LOD_Settle_Open_Pending from "/src/assets/images/LOD/FTL_LOD_Settle_Open_Pending.png";
import FTL_LOD_Settle_Active from "/src/assets/images/LOD/FTL_LOD_Settle_Active.png";
import LIT_Prescribed from "/src/assets/images/LOD/LIT_Prescribed.png";

const Case_List = () => {
  // State Variables
  const [rtomList, setRtomList] = useState([]);
  const [rtom, setRtom] = useState("");
  const [activeDRC, setActiveDRC] = useState([]);
  const [selectedDRC, setSelectedDRC] = useState("");
  const [arrearsBand, setArrearsBand] = useState([]);
  const [selectedBand, setSelectedBand] = useState("");
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [caseStatusList, setCaseStatusList] = useState([]);
  const [selectedCaseStatus, setSelectedCaseStatus] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchBy, setSearchBy] = useState("case_id");
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const [userRole, setUserRole] = useState(null); // Role-Based Buttons
  const rowsPerPage = 10;

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  //Decide the icon path based on the status
  const getStatusIcon = (status) => {
    switch (status) {
      case "Open Assign Agent":
        return Open_Assign_Agent;
      case "Open With Agent":
      case "Open with Agent":
        return Open_With_Agent;
      case "Pending Assign Agent Approval":
        return Pending_Assign_Agent_Approval;
      case "RO Negotiation":
        return RO_Negotiation;
      case "Negotiation Settle Pending":
        return RO_Settle_Pending;
      case "Negotiation Settle Open-Pending":
        return RO_Settle_Open_Pending;
      case "Negotiation Settle Active":
        return RO_Settle_Active;
      case "RO Negotiation Extension Pending":
        return RO_Negotiation_extend_pending;
      case "RO Negotiation Extended":
        return RO_Negotiation_extended;
      case "RO Negotiation FMB Pending":
        return RO_Negotiation_FMB_Pending;
      case "Forward to Mediation Board":
        return Forward_To_Mediation_Board;
      case "MB Negotiation":
      case "MB Negotiaion":
        return MB_Negotiation;
      case "MB Request Customer-Info":
        return MB_Request_Customer_Info;
      case "MB Handover Customer-Info":
        return MB_Handover_Customer_Info;
      case "MB Settle Pending":
        return MB_Settle_Pending;
      case "MB Settle Open-Pending":
        return MB_Settle_Open_Pending;
      case "MB Settle Active":
        return MB_Settle_Active;
      case "MB Fail with Pending Non-Settlement":
        return MB_Fail_with_Pending_Non_Settlement;
      case "MB Fail with Non-Settlementt":
        return MB_Fail_with_non_settlement;
      case "Pending FTL LOD":
        return Pending_FTL_LOD;
      case "Initial FTL LOD":
        return Initial_FTL_LOD;
      case "FTL LOD Settle Pending":
        return FTL_LOD_Settle_Pending;
      case "FTL LOD Settle Open-Pending":
        return FTL_LOD_Settle_Open_Pending;
      case "FTL LOD Settle Active":
        return FTL_LOD_Settle_Active;
      case "LIT Prescribed":
        return LIT_Prescribed;
      default:
        return "";
    }
  };

  //render status icon with tooltip
  const renderStatusIcon = (status, index) => {
    console.log("Status received:", status);
    const iconPath = getStatusIcon(status);

    if (!iconPath) {
      return <span>{status}</span>;
    }

    const tooltipId = `tooltip-${status.replace(/\s+/g, "-")}-${index}`;

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

  // Initial data fetch
  useEffect(() => {
    // Fetch RTOM
    const fetchRTOM = async () => {
      try {
        const rtom = await List_All_Active_RTOMs();
        setRtomList(rtom);
      } catch (error) {
        console.error("Error fetching rtom:", error);
      }
    };

    // Fetch DRC names
    const fetchActiveDRCs = async () => {
      try {
        const drcs = await Active_DRC_Details();
        setActiveDRC(drcs);
      } catch (error) {
        console.error("Error fetching drcs:", error);
      }
    };

    // Fetch arrears bands
    const fetchArrearsBands = async () => {
      try {
        const bands = await fetchAllArrearsBands();
        setArrearsBand(bands);
      } catch (error) {
        console.error("Error fetching arrears bands:", error);
      }
    };

    // Fetch status
    const fetchCaseStatusList = async () => {
      try {
        const statuses = await getCaseStatusList();
        setCaseStatusList(statuses);
      } catch (error) {
        console.error("Error fetching case statuses:", error);
      }
    };

    // Fetch service types
    const fetchServiceTypes = async () => {
      try {
        const services = await getActiveServiceDetails();
        // Transform the data to match what the dropdown expects
        const transformedServices = services.map(service => ({
          id: service.service_id,    // using service_id as the id
          value: service.service_type  // using service_type as the display value
        }));
        setServiceTypes(transformedServices);
        console.log("Transformed services:", transformedServices); // For debugging
      } catch (error) {
        console.error("Error fetching service types:", error);
      }
    };

    fetchRTOM();
    fetchActiveDRCs();
    fetchArrearsBands();
    fetchCaseStatusList();
    fetchServiceTypes();

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

  // Filter data from API 
  // const handleFilter = async () => {
  //   try {
  //     if (!rtom && !selectedDRC && !selectedBand && !selectedCaseStatus && !selectedServiceType && !fromDate && !toDate) {
  //       Swal.fire({
  //         title: "Warning",
  //         text: "No filter is selected. Please, select a filter.",
  //         icon: "warning",
  //         allowOutsideClick: false,
  //         allowEscapeKey: false,
  //         confirmButtonColor: "#f1c40f"
  //       });
  //       setToDate(null);
  //       setFromDate(null);
  //       return;
  //     }

  //     if ((fromDate && !toDate) || (!fromDate && toDate)) {
  //       Swal.fire({
  //         title: "Warning",
  //         text: "Both From Date and To Date must be selected.",
  //         icon: "warning",
  //         allowOutsideClick: false,
  //         allowEscapeKey: false,
  //         confirmButtonColor: "#f1c40f"
  //       });
  //       setToDate(null);
  //       setFromDate(null);
  //       return;
  //     }

  //     const payload = {
  //       case_current_status: selectedCaseStatus,
  //       From_DAT: fromDate ? fromDate.toISOString().split('T')[0] : null,
  //       TO_DAT: toDate ? toDate.toISOString().split('T')[0] : null,
  //       RTOM: rtom,
  //       DRC: selectedDRC,
  //       arrears_band: selectedBand,
  //       service_type: selectedServiceType,
  //       pages: currentPage
  //     };

  //     setIsLoading(true);

  //     const response = await GetFilteredCaseLists(payload);
  //     if (response && response.data && response.status === "success") {

  //       // Append the new data to the existing data
  //       setFilteredData((prevData) => [...prevData, ...response.data]);
  //       if (response.data.length === 0) {
  //         setIsMoreDataAvailable(false); // No more data available
  //         if (currentPage === 1) {
  //           Swal.fire({
  //             title: "No Results",
  //             text: "No matching data found for the selected filters.",
  //             icon: "warning",
  //             allowOutsideClick: false,
  //             allowEscapeKey: false,
  //             confirmButtonColor: "#f1c40f"
  //           });
  //         }
  //       } else {
  //         const maxData = currentPage === 1 ? 10 : 30;
  //         if (response.data.length < maxData) {
  //           setIsMoreDataAvailable(false); // More data available
  //         }
  //       }
  //     } else {
  //       Swal.fire({
  //         title: "Error",
  //         text: "No valid Settlement data found in response.",
  //         icon: "error",
  //         confirmButtonColor: "#d33"
  //       });
  //       setFilteredData([]);
  //     }
  //   } catch (error) {
  //     Swal.fire({
  //       title: "Error",
  //       text: error.message || "Failed to fetch data.",
  //       icon: "error",
  //       confirmButtonText: "OK",
  //       confirmButtonColor: "#d33"
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const filterValidation = () => {
    if (!rtom && !selectedDRC && !selectedBand && !selectedCaseStatus && !selectedServiceType && !fromDate && !toDate) {
      Swal.fire({
        title: "Warning",
        text: "No filter is selected. Please, select a filter.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f"
      });
      setToDate(null);
      setFromDate(null);
      return false;
    }

    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      Swal.fire({
        title: "Warning",
        text: "Both From Date and To Date must be selected.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f"
      });
      setToDate(null);
      setFromDate(null);
      return false;
    }

    return true;
  }

  const CallAPI = async () => {
    try {
      const payload = {
        case_current_status: selectedCaseStatus,
        From_DAT: fromDate ? fromDate.toISOString().split('T')[0] : null,
        TO_DAT: toDate ? toDate.toISOString().split('T')[0] : null,
        RTOM: rtom,
        DRC: selectedDRC,
        arrears_band: selectedBand,
        service_type: selectedServiceType,
        pages: currentPage
      };

      setIsLoading(true);

      const response = await GetFilteredCaseLists(payload);
      if (response && response.data && response.status === "success") {

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
              allowEscapeKey: false,
              confirmButtonColor: "#f1c40f"
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
          icon: "error",
          confirmButtonColor: "#d33"
        });
        setFilteredData([]);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to fetch data.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlestartdatechange = (date) => {
    setFromDate(date);
    validateDates(date, toDate);
  };

  const handleenddatechange = (date) => {
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
          confirmButtonColor: "#f1c40f",
        });
        setFromDate(null);
        setToDate(null);
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (isFilterApplied && isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage); // Update max current page
      handleFilter(); // Call the function whenever currentPage changes
    }
  }, [currentPage]);

  // Handle filter button click
  const handleFilterButton = () => {
    setFilteredData([]);
    setIsMoreDataAvailable(true);
    setTotalPages(0); // Reset total pages
    setMaxCurrentPage(0);
    const isValid = filterValidation();
    if (!isValid) {
      return; // If validation fails, do not proceed
    } else {
      if (currentPage === 1) {
        CallAPI();
      } else {
        setCurrentPage(1);
      }
      setIsFilterApplied(true);
    }
  }

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
    setRtom("");
    setSelectedDRC("");
    setSelectedBand("");
    setSelectedServiceType("");
    setSelectedCaseStatus("");
    setFromDate(null);
    setToDate(null);
    setSearchQuery("");
    setCurrentPage(1);
    setIsFilterApplied(false);
    setTotalPages(0); // Reset total pages
    setFilteredData([]); // Clear filtered data
  };

  const handleCreateTask = () => {
    console.log("Create task button clicked");
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
      <h1 className={GlobalStyle.headingLarge + " mb-6"}>Case List</h1>

      <div className="flex justify-end">
        <div className={`${GlobalStyle.cardContainer} w-full`}>
          <div className="flex flex-wrap items-center justify-end w-full space-x-4 space-y-3">

            <select
              value={rtom}
              onChange={(e) => setRtom(e.target.value)}
              className={`${GlobalStyle.selectBox} mt-3`}
              style={{ color: rtom === "" ? "gray" : "black" }}
            >
              <option value="" hidden>RTOM</option>
              {rtomList.map((rtom) => (
                <option key={rtom.rtom_id} value={rtom.rtom} style={{ color: "black" }}>
                  {rtom.rtom}
                </option>
              ))}
            </select>

            <select
              value={selectedDRC}
              onChange={(e) => setSelectedDRC(e.target.value)}
              className={`${GlobalStyle.selectBox} mt-3`}
              style={{ color: selectedDRC === "" ? "gray" : "black" }}
            >
              <option value="" hidden>DRC</option>
              {activeDRC.map((drc) => (
                <option key={drc.key} value={drc.id.toString()} style={{ color: "black" }}>
                  {drc.value}
                </option>
              ))}
            </select>

            <select
              value={selectedBand}
              onChange={(e) => setSelectedBand(e.target.value)}
              className={`${GlobalStyle.selectBox} mt-3`}
              style={{ color: selectedBand === "" ? "gray" : "black" }}
            >
              <option value="" hidden>Arrears Band</option>
              {arrearsBand.map(({ key, value }) => (
                <option key={key} value={key} style={{ color: "black" }}>
                  {value}
                </option>
              ))}
            </select>

            <select
              value={selectedCaseStatus}
              onChange={(e) => setSelectedCaseStatus(e.target.value)}
              className={`${GlobalStyle.selectBox} mt-3`}
              style={{ color: selectedCaseStatus === "" ? "gray" : "black" }}
            >
              <option value="" hidden>Case Status</option>
              {caseStatusList.map(({ key, value }) => (
                <option key={key} value={value} style={{ color: "black" }}>
                  {value}
                </option>
              ))}
            </select>

            <select
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              className={`${GlobalStyle.selectBox} mt-3`}
              style={{ color: selectedServiceType === "" ? "gray" : "black" }}
            >
              <option value="" hidden>Service Type</option>
              {serviceTypes.map((service) => (
                <option key={service.id} value={service.id} style={{ color: "black" }}>
                  {service.value}
                </option>
              ))}
            </select>

            {/* <div className="flex flex-wrap items-center justify-end space-x-3 w-full mt-2"> */}
            <label className={GlobalStyle.dataPickerDate}>Date:</label>

            <DatePicker
              selected={fromDate}
              onChange={handlestartdatechange}
              dateFormat="dd/MM/yyyy"
              placeholderText="From"
              className={`${GlobalStyle.inputText} w-full sm:w-auto`}
            />

            <DatePicker
              selected={toDate}
              onChange={handleenddatechange}
              dateFormat="dd/MM/yyyy"
              placeholderText="To"
              className={`${GlobalStyle.inputText} w-full sm:w-auto`}
            />

            {["admin", "superadmin", "slt"].includes(userRole) && (
              <button
                className={`${GlobalStyle.buttonPrimary} w-full sm:w-auto`}
                onClick={handleFilterButton}
              >
                Filter
              </button>
            )}

            {["admin", "superadmin", "slt"].includes(userRole) && (
              <button
                className={`${GlobalStyle.buttonRemove} w-full sm:w-auto`}
                onClick={handleClear}
              >
                Clear
              </button>
            )}
            {/* </div> */}
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center">
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
              <th scope="col" className={GlobalStyle.tableHeader}>
                ID
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Status
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Account No.
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Service Type
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Amount
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Agent
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                RTOM
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Created Date
              </th>
              <th scope="col" className={GlobalStyle.tableHeader}>
                Last Paid Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.length > 0 ? (
              filteredDataBySearch.map((row, index) => {
                const createdDate = row.createddtm
                //   ? new Date(row.createddtm).toLocaleDateString()
                //   : '';

                // const lastPaidDate = row.lastpaymentdate
                //   ? new Date(row.lastpaymentdate).toLocaleDateString()
                //   : '';

                return (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? GlobalStyle.tableRowEven
                        : GlobalStyle.tableRowOdd
                    }
                  >
                    <td className={GlobalStyle.tableData}>{row.caseid || "N/A"}</td>
                    {/* <td className={GlobalStyle.tableData}>{row.casecurrentstatus || "N/A"}</td> */}
                    <td className={`${GlobalStyle.tableData} flex items-center justify-center`}>
                      {renderStatusIcon(row.casecurrentstatus || "N/A")}</td>
                    <td className={GlobalStyle.tableData}>{row.accountno || "N/A"}</td>
                    <td className={GlobalStyle.tableData}>{row.servicetype || "N/A"}</td>
                    <td className={GlobalStyle.tableCurrency}>{row.amount.toLocaleString("en-LK", {
                      style: "currency",
                      currency: "LKR",
                    }
                    )}</td>
                    <td className={GlobalStyle.tableData}>{row.Agent || "N/A"}</td>
                    <td className={GlobalStyle.tableData}>{row.rtom || "N/A"}</td>
                    <td className={GlobalStyle.tableData}>{row.Created_On &&
                      new Date(row.Created_On).toLocaleString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",

                        hour12: true,
                      })}</td>
                    <td className={GlobalStyle.tableData}>{row.Lastpaymentdate &&
                      new Date(row.Lastpaymentdate).toLocaleString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",

                        hour12: true,
                      })}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className={GlobalStyle.tableData + " text-center"}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredData.length !== 0 && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed" : ""}`}
          >
            <FaArrowLeft />
          </button>
          <span className={`${GlobalStyle.pageIndicator} mx-4`}>
            Page {currentPage}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`${GlobalStyle.navButton} ${currentPage === totalPages ? "cursor-not-allowed" : ""}`}
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      <div className="flex justify-end mt-6">
        {["admin", "superadmin", "slt"].includes(userRole) && filteredData.length !== 0 && (
          <button
            // onClick={HandleCreateTaskDownloadSettlementList}
            // className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? 'opacity-50' : ''}`}
            // disabled={isCreatingTask}
            className={GlobalStyle.buttonPrimary}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {/* {!isCreatingTask && <FaDownload style={{ marginRight: '8px' }} />}
            {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'} */}
            <FaDownload style={{ marginRight: '8px' }} />
            Create Task and let me know
          </button>
        )}
      </div>
    </div>
  );
};

export default Case_List;