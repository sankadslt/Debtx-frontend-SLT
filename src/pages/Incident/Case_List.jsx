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
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
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
import { Create_Task_for_Download_Case_List } from "../../services/task/taskService";
import Incident_Done from "/src/assets/images/incidents/Incident_Done.png";
import Reject_Pending from "/src/assets/images/incidents/Reject_Pending.png";
import Incident_Reject from "/src/assets/images/incidents/Incident_Reject.png";
import Open_No_Agent from "/src/assets/images/incidents/Open_No_Agent.png"; 
import Only_CPE_Collect from "/src/assets/images/incidents/Only_CPE_Collect.png";
import Direct_LOD from "/src/assets/images/incidents/Direct_LOD.png";
import Pending_Assign_Agent from "/src/assets/images/distribution/Pending_Assign_Agent.png";
import Pending_Assign_Agent_Approval from "/src/assets/images/distribution/Pending_Assign_Agent_Approval.png";
import Reject_Assign_Agent_Approval from "/src/assets/images/distribution/Reject Assign Agent Approval .png"; 
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
import Final_Reminder from "/src/assets/images/LOD/Final_Reminder.png";
import Initial_LOD from "/src/assets/images/LOD/Initial_LOD.png";
import LOD_Settle_Pending from "/src/assets/images/LOD/LOD_Settle_Pending.png";
import LOD_Settle_Open_Pending from "/src/assets/images/LOD/LOD_Settle_Open_Pending.png";
import LOD_Settle_Active from "/src/assets/images/LOD/LOD_Settle_Active.png";
import Final_Reminder_Settle_Pending from "/src/assets/images/LOD/Final_Reminder_Settle_Pending.png";
import Final_Reminder_Settle_Open_Pending from "/src/assets/images/LOD/Final_Reminder_Settle_Open_Pending.png";
import Final_Reminder_Settle_Active from "/src/assets/images/LOD/Final_Reminder_Settle_Active.png";
import LOD_Monitoring_Expire from "/src/assets/images/LOD/LOD_Monitoring_Expire.png";
import LD_Hold from "/src/assets/images/LOD/LD_Hold .png";
import Initial_Litigation from "/src/assets/images/litigation/status/Initial_Litigation.png";
import Pending_FTL from "/src/assets/images/litigation/status/Pending FTL .png";
import Forward_To_Litigation from "/src/assets/images/litigation/status/Forward To Litigation .png"; 
import FLU from "/src/assets/images/litigation/status/FLU.png";
import FLA from "/src/assets/images/litigation/status/FLA.png";
import Litigation from "/src/assets/images/litigation/status/Litigation .png";
import Litigation_Settle_Pending from "/src/assets/images/litigation/status/Litigation_Settle_Pending.png";
import Litigation_Settle_Open_Pending from "/src/assets/images/litigation/status/Litigation_Settle_Open_Pending.png";
import Litigation_Settle_Active from "/src/assets/images/litigation/status/Litigation_Settle_Active.png";
import Forward_LOD_Dispute from "/src/assets/images/Settlement/Forward_LOD_Dispute.png";
import Dispute_Settle_Pending from "/src/assets/images/Settlement/Dispute_Settle_Pending.png";
import Dispute_Settle_Open_Pending from "/src/assets/images/Settlement/Dispute_Settle_Open_Pending.png";
import Dispute_Settle_Active from "/src/assets/images/Settlement/Dispute_Settle_Active.png";
import Pending_Forward_to_WRIT from "/src/assets/images/WRIT/Pending_Forward_to_WRIT .png";
import WRIT from "/src/assets/images/WRIT/WRIT.png";
import Forward_To_RE_WRIT from "/src/assets/images/WRIT/Forward_To_RE-WRIT.png";
import RE_WRIT from "/src/assets/images/WRIT/RE-WRIT.png";
import WRIT_Settle_Pending from "/src/assets/images/WRIT/WRIT_Settle_Pending.png";
import WRIT_Settle_Open_Pending from "/src/assets/images/WRIT/WRIT_Settle_Open-Pending.png";
import WRIT_Settle_Active from "/src/assets/images/WRIT/WRIT_Settle_Active.png";
import Re_WRIT_Settle_Pending from "/src/assets/images/WRIT/Re-WRIT_Settle_Pending .png";
import Re_WRIT_Settle_Open_Pending from "/src/assets/images/WRIT/Re-WRIT_Settle_Open-Pending .png";
import Re_WRIT_Settle_Active from "/src/assets/images/WRIT/Re-WRIT_Settle_Active .png";
import Pending_Abandoned from "/src/assets/images/Abnormal/Pending_Abandoned .png"; 
import Abandoned from "/src/assets/images/Abnormal/Abandoned.png";
import Pending_Withdraw from "/src/assets/images/Abnormal/Pending_Withdraw .png";
import Withdraw from "/src/assets/images/Abnormal/Withdraw.png";
import Case_Closed from "/src/assets/images/Stop/Case Closed.png";
import Ready_for_Write_Off from "/src/assets/images/Stop/Ready_for_Write-Off .png";
import Approval_Pending_Write_Off from "/src/assets/images/Stop/Approval Pending Write-Off.png";
import Pending_Write_Off from "/src/assets/images/Stop/Pending Write-Off.png";
import Write_Off from "/src/assets/images/Stop/Write-Off.png";

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
  const [accountNo, setAccountNo] = useState("");
  const [searchBy, setSearchBy] = useState("case_id");
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [maxCurrentPage, setMaxCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const rowsPerPage = 10;
  const hasMounted = useRef(false);
  const navigate = useNavigate(); 
  
  const [committedFilters, setCommittedFilters] = useState({
    rtom: "",
    selectedDRC: "",
    selectedBand: "",
    selectedServiceType: "",
    selectedCaseStatus: "",
    fromDate: null,
    toDate: null,
    accountNo: "",
  });

  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Incident Done":
        return Incident_Done;
      case "Reject Pending":
        return Reject_Pending;
      case "Incident Reject":
        return Incident_Reject;
      case "Open No Agent":
        return Open_No_Agent;
      case "Only CPE Collect":
        return Only_CPE_Collect;
      case "Direct LOD":
        return Direct_LOD;
      case "Pending Assign Agent":
        return Pending_Assign_Agent;
      case "Pending Assign Agent Approval":
        return Pending_Assign_Agent_Approval;
      case "Reject Assign Agent Approval":
        return Reject_Assign_Agent_Approval;
      case "Open Assign Agent":
        return Open_Assign_Agent;
      case "Open With Agent":
        return Open_With_Agent;
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
      case "MB Fail with Non-Settlement":
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
      case "Final Reminder":
        return Final_Reminder;
      case "Initial LOD":
        return Initial_LOD;
      case "LOD Settle Pending":
        return LOD_Settle_Pending;
      case "LOD Settle Open-Pending":
        return LOD_Settle_Open_Pending;
      case "LOD Settle Active":
        return LOD_Settle_Active;
      case "Final Reminder Settle Pending":
        return Final_Reminder_Settle_Pending; 
      case "Final Reminder Settle Open-Pending":
        return Final_Reminder_Settle_Open_Pending;
      case "Final Reminder Settle Active":
        return Final_Reminder_Settle_Active;
      case "LOD Monitoring Expire":
        return LOD_Monitoring_Expire;
      case "LD Hold":
        return LD_Hold; 
      case "Initial Litigation":
        return Initial_Litigation;
      case "Pending FTL":
        return Pending_FTL;
      case "Forward To Litigation":
        return Forward_To_Litigation;
      case "Fail from Legal Unit":
        return FLU;
      case "Fail Legal Action":
        return FLA;
      case "Litigation":
        return Litigation;
      case "Litigation Settle Pending":
        return Litigation_Settle_Pending;
      case "Litigation Settle Open-Pending":
        return Litigation_Settle_Open_Pending;
      case "Litigation Settle Active":
        return Litigation_Settle_Active;
      case "Forward LOD Dispute":
        return Forward_LOD_Dispute;
      case "Dispute Settle Pending":
        return Dispute_Settle_Pending;
      case "Dispute Settle Open-Pending":
        return Dispute_Settle_Open_Pending;
      case "Dispute Settle Active":
        return Dispute_Settle_Active;
      case "Pending Forward to WRIT":
        return Pending_Forward_to_WRIT;
      case "WRIT":
        return WRIT;
      case "Forward to Re-WRIT":
        return Forward_To_RE_WRIT;
      case "Re-WRIT":
        return RE_WRIT;
      case "WRIT Settle Pending":
        return WRIT_Settle_Pending;
      case "WRIT Settle Open-Pending":
        return WRIT_Settle_Open_Pending;
      case "WRIT Settle Active":
        return WRIT_Settle_Active;
      case "Re-WRIT Settle Pending":
        return Re_WRIT_Settle_Pending;
      case "Re-WRIT Settle Open-Pending":
        return Re_WRIT_Settle_Open_Pending;
      case "Re-WRIT Settle Active":
        return Re_WRIT_Settle_Active;
      case "Pending Abandoned":
        return Pending_Abandoned;
      case "Abandoned":
        return Abandoned;
      case "Pending Withdraw":
        return Pending_Withdraw;
      case "Withdraw":
        return Withdraw;
      case "Case Close":
        return Case_Closed;
      case "Ready for Write-Off":
        return Ready_for_Write_Off;
      case "Approval Pending Write-Off":
        return Approval_Pending_Write_Off;
      case "Pending Write-Off":
        return Pending_Write_Off;
      case "Write-Off":
        return Write_Off;
      default:
        return null;
    }
  }

  const renderStatusIcon = (status, index) => {
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
          data-tooltip-id={tooltipId}
        />
        <Tooltip id={tooltipId} place="bottom" effect="solid">
          {status}
        </Tooltip>
      </div>
    );
  };

  useEffect(() => {
    const fetchRTOM = async () => {
      try {
        const rtom = await List_All_Active_RTOMs();
        setRtomList(rtom);
      } catch (error) {
        setRtomList([]);
      }
    };

    const fetchActiveDRCs = async () => {
      try {
        const drcs = await Active_DRC_Details();
        setActiveDRC(drcs);
      } catch (error) {
        setActiveDRC([]);
      }
    };

    const fetchArrearsBands = async () => {
      try {
        const bands = await fetchAllArrearsBands();
        setArrearsBand(bands);
      } catch (error) {
        setArrearsBand([]);
      }
    };

    const fetchCaseStatusList = async () => {
      try {
        const statuses = await getCaseStatusList();
        setCaseStatusList(statuses);
      } catch (error) {
        setCaseStatusList([]);
      }
    };

    const fetchServiceTypes = async () => {
      try {
        const services = await getActiveServiceDetails();
        const transformedServices = services.map(service => ({
          id: service.service_id,
          value: service.service_type
        }));
        setServiceTypes(transformedServices);
      } catch (error) {
        setServiceTypes([]);
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

  const filterValidation = () => {
    if (!rtom && !selectedDRC && !selectedBand && !selectedCaseStatus && !selectedServiceType && !accountNo && !fromDate && !toDate) {
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

  const CallAPI = async (filters) => {
    try {
      const formatDate = (date) => {
        if (!date) return null;
        const offsetDate = new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        );
        return offsetDate.toISOString().split("T")[0];
      };

      const payload = {
        case_current_status: filters.selectedCaseStatus,
        From_DAT: formatDate(filters.fromDate),
        TO_DAT: formatDate(filters.toDate),
        RTOM: filters.rtom,
        DRC: filters.selectedDRC,
        arrears_band: filters.selectedBand,
        service_type: filters.selectedServiceType,
        account_no: filters.accountNo,
        pages: filters.currentPage
      };

      setIsLoading(true);
      const response = await GetFilteredCaseLists(payload);
      setIsLoading(false);

      if (response && response.data && response.status === "success") {
        const newData = response.data;

        if (currentPage === 1) {
          setFilteredData(newData);
        } else {
          setFilteredData((prev) => [...prev, ...newData]);
        }

        if (newData.length === 0) {
          setIsMoreDataAvailable(false);
          if (currentPage === 1) {
            Swal.fire({
              title: "No Results",
              text: "No matching data found for the selected filters.",
              icon: "warning",
              allowOutsideClick: false,
              allowEscapeKey: false,
              confirmButtonColor: "#f1c40f"
            });
          } else if (currentPage === 2) {
            setCurrentPage(1);
          }
        } else {
          const maxData = currentPage === 1 ? 10 : 30;
          if (newData.length < maxData) {
            setIsMoreDataAvailable(false);
          }
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "No valid Case data found in response.",
          icon: "error",
          confirmButtonColor: "#d33"
        });
        setFilteredData([]);
      }
    } catch (error) {
      console.error("API call failed:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch filtered data.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isMoreDataAvailable && currentPage > maxCurrentPage) {
      setMaxCurrentPage(currentPage);
      CallAPI({
        ...committedFilters,
        currentPage: currentPage,
      });
    }
  }, [currentPage]);

  const handlestartdatechange = (date) => {
    setFromDate(date);
  };

  const handleenddatechange = (date) => {
    setToDate(date);
  };

  useEffect(() => {
    if (fromDate && toDate) {
      if (new Date(fromDate) > new Date(toDate)) {
        Swal.fire({
          title: "Warning",
          text: "To date should be greater than or equal to From date",
          icon: "warning",
          allowOutsideClick: false,
          allowEscapeKey: false,
          confirmButtonColor: "#f1c40f",
        });
        setToDate(null);
        setFromDate(null);
        return;
      }
    }
  }, [fromDate, toDate]);

  const handleFilterButton = () => {
    setIsMoreDataAvailable(true);
    setMaxCurrentPage(0);
    const isValid = filterValidation();
    if (!isValid) {
      return;
    } else {
      setCommittedFilters({
        rtom: rtom,
        selectedDRC: selectedDRC,
        selectedBand: selectedBand,
        selectedServiceType: selectedServiceType,
        selectedCaseStatus: selectedCaseStatus,
        fromDate: fromDate,
        toDate: toDate,
        accountNo: accountNo
      });
      setFilteredData([]);

      if (currentPage === 1) {
        CallAPI({
          rtom: rtom,
          selectedDRC: selectedDRC,
          selectedBand: selectedBand,
          selectedServiceType: selectedServiceType,
          selectedCaseStatus: selectedCaseStatus,
          fromDate: fromDate,
          toDate: toDate,
          accountNo: accountNo,
          currentPage: 1
        });
      } else {
        setCurrentPage(1);
      }
    }
  };

  const handlePrevNext = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next") {
      if (isMoreDataAvailable) {
        setCurrentPage(currentPage + 1);
      } else {
        if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
          setCurrentPage(currentPage + 1);
        }
      }
    }
  };

  const handleClear = () => {
    setRtom("");
    setSelectedDRC("");
    setSelectedBand("");
    setSelectedServiceType("");
    setSelectedCaseStatus("");
    setFromDate(null);
    setToDate(null);
    setAccountNo("");
    setSearchQuery("");
    setIsFilterApplied(false);
    setIsMoreDataAvailable(true);
    setMaxCurrentPage(0);
    setFilteredData([]);
    setCommittedFilters({
      rtom: "",
      selectedDRC: "",
      selectedBand: "",
      selectedServiceType: "",
      selectedCaseStatus: "",
      fromDate: null,
      toDate: null,
      accountNo: ""
    });
    if (currentPage != 1) {
      setCurrentPage(1);
    } else {
      setCurrentPage(0);
      setTimeout(() => setCurrentPage(1), 0);
    }
  };

  const HandleCreateTaskDownloadCaseList = async () => {
    if (!fromDate || !toDate) {
      Swal.fire({
        title: "Warning",
        text: "Please select From Date and To Date.",
        icon: "warning",
        allowOutsideClick: false,
        allowEscapeKey: false,
        confirmButtonColor: "#f1c40f"
      });
      return;
    }

    setIsCreatingTask(true);
    try {
      const response = await Create_Task_for_Download_Case_List({
        from_date: fromDate,
        to_date: toDate,
        rtom: rtom,
        drc: selectedDRC,
        arrears_band: selectedBand,
        service_type: selectedServiceType,
        case_status: selectedCaseStatus,
       
      });
       
      Swal.fire({
        icon: "success",
        title: "Task Created Successfully!",
        text: "Task ID: " + response.Task_Id,
        confirmButtonColor: "#28a745",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to create task.",
        icon: "error",
        confirmButtonColor: "#dc3545"
      });
    } finally {
      setIsCreatingTask(false);
    }
  };

  const naviCaseID = (caseId) => {
    navigate("/Incident/Case_Details", { state: { CaseID: caseId } });
  }

  const filteredDataBySearch = filteredData.filter((row) => {
    const searchableValues = [
      row.caseid,
      row.accountno,
      row.customer_name,
      row.servicetype,
      row.casecurrentstatus,
      row.rtom,
      row.drc,
      row.arrears_band,
      new Date(row.Created_On).toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    ];
  
    return searchableValues
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

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
          <div className="flex flex-wrap items-center justify-end w-full gap-3">
          <input
              type="text"
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
              placeholder="Account Number"
              className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              style={{ minWidth: "150px" }}
            />
            <select
              value={rtom}
              onChange={(e) => setRtom(e.target.value)}
              className={`${GlobalStyle.selectBox}`}
              style={{ color: rtom === "" ? "gray" : "black" }}
            >
              <option value="" hidden>Billing Center</option>
              {rtomList.length > 0 ? (
                rtomList.map((rtom) => (
                  <option key={rtom.rtom_id} value={rtom.rtom} style={{ color: "black" }}>
                    {rtom.rtom}
                  </option>
                ))
              ) : (
                <option disabled>No RTOM available</option>
              )}
            </select>

            <select
              value={selectedDRC}
              onChange={(e) => setSelectedDRC(e.target.value)}
              className={`${GlobalStyle.selectBox}`}
              style={{ color: selectedDRC === "" ? "gray" : "black" }}
            >
              <option value="" hidden>DRC</option>
              {activeDRC.length > 0 ? (activeDRC.map((drc) => (
                <option key={drc.key} value={drc.id.toString()} style={{ color: "black" }}>
                  {drc.value}
                </option>
              ))) : (
                <option disabled>No DRC available</option>
              )}
            </select>

            <select
              value={selectedBand}
              onChange={(e) => setSelectedBand(e.target.value)}
              className={`${GlobalStyle.selectBox}`}
              style={{ color: selectedBand === "" ? "gray" : "black" }}
            >
              <option value="" hidden>Arrears Band</option>
              {arrearsBand.length > 0 ? (arrearsBand.map(({ key, value }) => (
                <option key={key} value={key} style={{ color: "black" }}>
                  {value}
                </option>
              ))) : (
                <option disabled>No Arrears Band available</option>
              )}
            </select>

            <select
              value={selectedCaseStatus}
              onChange={(e) => setSelectedCaseStatus(e.target.value)}
              className={`${GlobalStyle.selectBox}`}
              style={{ color: selectedCaseStatus === "" ? "gray" : "black" }}
            >
              <option value="" hidden>Case Status</option>
              {caseStatusList.length > 0 ? (caseStatusList.map(({ key, value }) => (
                <option key={key} value={value} style={{ color: "black" }}>
                  {value}
                </option>
              ))) : (
                <option disabled>No Case Status available</option>
              )}
            </select>

            <select
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              className={`${GlobalStyle.selectBox}`}
              style={{ color: selectedServiceType === "" ? "gray" : "black" }}
            >
              <option value="" hidden>Service Type</option>
              {serviceTypes.length > 0 ? (serviceTypes.map((service) => (
                <option key={service.id} value={service.service_type} style={{ color: "black" }}>
                  {service.value}
                </option>
              ))) : (
                <option disabled>No Service Type available</option>
              )}
            </select>

           

            <label className={GlobalStyle.dataPickerDate}>Date</label>
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
          </div>
        </div>
      </div>

      <div className="mb-4 flex justify-start mt-10">
        <div className={GlobalStyle.searchBarContainer}>
          <input
            type="text"
            className={GlobalStyle.inputSearch}
            value={searchQuery}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchQuery(e.target.value);
            }}
          />
          <FaSearch className={GlobalStyle.searchBarIcon} />
        </div>
      </div>

      <div className={`${GlobalStyle.tableContainer} mt-10 overflow-x-auto`}>
        <table className={GlobalStyle.table}>
          <thead className={GlobalStyle.thead}>
            <tr>
              <th className={GlobalStyle.tableHeader}>Case ID</th>
              <th className={GlobalStyle.tableHeader}>Status</th>
              <th className={GlobalStyle.tableHeader}>Account No</th>
              <th className={GlobalStyle.tableHeader}>Service Type</th>
              <th className={GlobalStyle.tableHeader}>Amount </th>
              <th className={GlobalStyle.tableHeader}>Agent</th>
              <th className={GlobalStyle.tableHeader}>Billing Center</th>
              <th className={GlobalStyle.tableHeader}>Created Date</th>
              <th className={GlobalStyle.tableHeader}>Last Paid Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredDataBySearch.length > 0 ? (
              filteredDataBySearch
                .slice(startIndex, startIndex + rowsPerPage)
                .map((row, index) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0
                        ? GlobalStyle.tableRowEven
                        : GlobalStyle.tableRowOdd
                    }
                  >
                    <td
                      className={`${GlobalStyle.tableData} text-black hover:underline cursor-pointer`}
                      onClick={() => naviCaseID(row.caseid)}
                    >
                      {row.caseid || ""}
                    </td>
                    <td className={`${GlobalStyle.tableData} flex items-center justify-center`}>
                      {renderStatusIcon(row.casecurrentstatus || "", index)}
                    </td>
                    <td className={GlobalStyle.tableData}>{row.accountno || ""}</td>
                    <td className={GlobalStyle.tableData}>{row.servicetype || ""}</td>
                    <td className={GlobalStyle.tableCurrency}>
  {typeof row.amount === 'number'
    ? row.amount.toLocaleString("en-LK", {
        // style: "currency",
        // currency: "LKR",
      })
    : ""}
</td>

                    
                    <td className={GlobalStyle.tableData}>{row.drc_name || ""}</td>
                    <td className={GlobalStyle.tableData}>{row.rtom || ""}</td>
                    <td className={GlobalStyle.tableData}>
                      {row.Created_On &&
                        new Date(row.Created_On).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                    </td>
                    <td className={GlobalStyle.tableData}>
                      {row.Lastpaymentdate &&
                        new Date(row.Lastpaymentdate).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                    </td>
                  </tr>
                ))
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

      {filteredDataBySearch.length > 0 && (
        <div className={GlobalStyle.navButtonContainer}>
          <button
            onClick={() => handlePrevNext("prev")}
            disabled={currentPage <= 1}
            className={`${GlobalStyle.navButton} ${currentPage <= 1 ? "cursor-not-allowed" : ""}`}
          >
            <FaArrowLeft />
          </button>
          <span className={`${GlobalStyle.pageIndicator} mx-4`}>
            Page {currentPage}
          </span>
          <button
            onClick={() => handlePrevNext("next")}
            disabled={
              searchQuery
                ? currentPage >=
                  Math.ceil(filteredDataBySearch.length / rowsPerPage)
                : !isMoreDataAvailable &&
                  currentPage >=
                    Math.ceil(filteredData.length / rowsPerPage)
            }
            className={`${GlobalStyle.navButton} ${
              (
                searchQuery
                  ? currentPage >=
                    Math.ceil(filteredDataBySearch.length / rowsPerPage)
                  : !isMoreDataAvailable &&
                    currentPage >=
                      Math.ceil(filteredData.length / rowsPerPage)
              )
                ? "cursor-not-allowed"
                : ""
            }`}
          >
            <FaArrowRight />
          </button>
        </div>
      )}

      <div className="flex justify-end mt-6">
        {["admin", "superadmin", "slt"].includes(userRole) && filteredData.length !== 0 && (
          <button
            onClick={HandleCreateTaskDownloadCaseList}
            className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? 'opacity-50' : ''}`}
            disabled={isCreatingTask}
            // className={GlobalStyle.buttonPrimary}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            {!isCreatingTask && <FaDownload style={{ marginRight: '8px' }} />}
            {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'}
            {/* <FaDownload style={{ marginRight: '8px' }} /> */}
          </button>
        )}
      </div>
    </div>
  );
};

export default Case_List;
