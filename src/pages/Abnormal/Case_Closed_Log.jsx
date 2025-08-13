
 import { useState, useEffect, useRef } from "react";
 import GlobalStyle from "../../assets/prototype/GlobalStyle";
 import { FaSearch, FaArrowLeft, FaArrowRight, FaDownload } from "react-icons/fa";
 import DatePicker from "react-datepicker";
 import "react-datepicker/dist/react-datepicker.css";
 import { useNavigate } from "react-router-dom";
 
 import { listAllCaseClosedLog } from "../../services/Abnormal/AbnormalServices";
 import Swal from 'sweetalert2';
 import { Tooltip } from "react-tooltip";
 import {Create_Task_For_Downloard_Case_Closed_List} from "../../services/Abnormal/AbnormalServices";
 
 import { getLoggedUserId } from "../../services/auth/authService";

 import { jwtDecode } from "jwt-decode";
 import { refreshAccessToken } from "../../services/auth/authService";
 
 import { List_All_Active_RTOMs } from "../../services/RTOM/Rtom";


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

 const Case_Closed_Log = () => {
   
   const [rtomList, setRtomList] = useState([]);
   const [rtom, setRtom] = useState("");
   const [fromDate, setFromDate] = useState(null);
   const [toDate, setToDate] = useState(null);
   const [searchQuery, setSearchQuery] = useState("");
   const [caseId, setCaseId] = useState("");
//    const [status, setStatus] = useState("");
   const [phase, setPhase] = useState("");
   const [accountNo, setAccountNo] = useState("");
   const [searchBy, setSearchBy] = useState("case_id"); 
   const [filteredData, setFilteredData] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isCreatingTask, setIsCreatingTask] = useState(false);  
   const [userRole, setUserRole] = useState(null);  
 
   // Pagination state
   const [currentPage, setCurrentPage] = useState(1);
   const [maxCurrentPage, setMaxCurrentPage] = useState(0);
   const [totalPages, setTotalPages] = useState(0);
 
   const [isMoreDataAvailable, setIsMoreDataAvailable] = useState(true);  
   const rowsPerPage = 10; 
 
    
   // const maxPages = Math.ceil(filteredDataBySearch.length / rowsPerPage);
   const startIndex = (currentPage - 1) * rowsPerPage;
   const endIndex = startIndex + rowsPerPage;
   const paginatedData = filteredData.slice(startIndex, endIndex);
   const hasMounted = useRef(false);
   const [committedFilters, setCommittedFilters] = useState({
    rtom:"",
    accountNo: "",
     phase: "",
    fromDate: null,
     toDate: null
   });
 
   
   useEffect(() => {

 
        const fetchRTOM = async () => {
          try {
            const rtom = await List_All_Active_RTOMs();
            setRtomList(rtom);
          } catch (error) {
            setRtomList([]);
          }
        };
    
        fetchRTOM();

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
   };
 
  
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
           className="w-7 h-7"
           data-tooltip-id={tooltipId}  
         />
          
         <Tooltip id={tooltipId} place="bottom" effect="solid">
           {`${status}`}  
         </Tooltip>
       </div>
     );
   };
 
   

   

   const navigate = useNavigate();
 
   const handlestartdatechange = (date) => {
     setFromDate(date);
     
   };
 
   const handleenddatechange = (date) => {
     setToDate(date);
  
   };
 
useEffect(() => {
     if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
       Swal.fire({
         title: "Warning",
         text: "To date should be greater than or equal to From date",
         icon: "warning",
         allowOutsideClick: false,
         allowEscapeKey: false,
         confirmButtonColor: "#f1c40f"
       });
       setToDate(null);
       setFromDate(null);
       return;
     }
   }, [fromDate, toDate]);
 
   
   const filteredDataBySearch = filteredData.filter((row) =>
     Object.values(row)
       .join(" ")
       .toLowerCase()
       .includes(searchQuery.toLowerCase())
   );
 

   const filterValidations = () => {
     if (!accountNo && !phase  && !fromDate && !toDate  && ! rtom) {
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
   };
 
   
   const callAPI = async (filters) => {
     try {
 
       console.log(currentPage);
 
     
       const payload = {
         
         account_no: filters.accountNo,
         phase: filters.phase,
         
         rtom: filters.rtom,
         from_date: filters.fromDate,
         to_date: filters.toDate, 
         pages: filters.page,
       };
       console.log("Payload sent to API: ", payload);
 
       setIsLoading(true);  
       const response = await listAllCaseClosedLog(payload);
       setIsLoading(false); 
 
     
       if (response) {
        
         if (response.status === 200 && response.data && response.data.data && response.data.data.length > 0) {
           if (currentPage === 1) {
             setFilteredData(response.data.data)
           } else {
             setFilteredData((prevData) => [...prevData, ...response.data.data]);
           }
         }
 
         if (response.status === 204) {
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
           if (response.data.data.length < maxData) {
             setIsMoreDataAvailable(false); 
           }
         }
 
       } else {
         Swal.fire({
           title: "Error",
           text: "No valid case data found in response.",
           icon: "error",
           confirmButtonColor: "#d33"
         });
         setFilteredData([]);
       }
     } catch (error) {
       console.error("Error filtering cases:", error);
       Swal.fire({
         title: "Error",
         text: "Failed to fetch filtered data. Please try again.",
         icon: "error",
         confirmButtonColor: "#d33"
       });
     } finally {
       setIsLoading(false);  
     }
   }
 
   useEffect(() => {
     if (isMoreDataAvailable && currentPage > maxCurrentPage) {
       setMaxCurrentPage(currentPage);  
      
       callAPI({
         ...committedFilters,
         page: currentPage
       });
     }
   }, [currentPage]);
 
   // Handle Pagination
   const handlePrevNext = (direction) => {
     if (direction === "prev" && currentPage > 1) {
       setCurrentPage(currentPage - 1);
       // console.log("Current Page:", currentPage);
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
 
  
   const handleFilterButton = () => {
     setIsMoreDataAvailable(true); 
     setTotalPages(0);  
     setMaxCurrentPage(0); 
     const isValid = filterValidations();  
     if (!isValid) {
       return;  
     } else {
       setCommittedFilters({
         rtom,
         accountNo,
         phase,
         fromDate,
         toDate
       });
       setFilteredData([]); 
       if (currentPage === 1) {
         // callAPI();
         callAPI({
           rtom,
           accountNo,
           phase,
           fromDate,
           toDate,
           page: 1
         });
       } else {
         setCurrentPage(1);
       }
     }
   }
 
   
   const handleClear = () => {
    
     setAccountNo("");
     setPhase("");
     setRtom("");
     setFromDate(null);
     setToDate(null);
     setSearchQuery("");
     setTotalPages(0);  
     setFilteredData([]);  
     setMaxCurrentPage(0);  
     setIsMoreDataAvailable(true);  
      
     setCommittedFilters({
        rtom:"",
        accountNo: "",
        phase: "",
        fromDate: null,
        toDate: null
     });
     if (currentPage != 1) {
       setCurrentPage(1);  
     } else {
       setCurrentPage(0);  
       setTimeout(() => setCurrentPage(1), 0); 
     }
   };
 
   
   const HandleCreateTaskDownloadCaseClosedLog = async () => {
 
     const userData = await getLoggedUserId();  
 
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
       const response = await Create_Task_For_Downloard_Case_Closed_List(userData, phase, rtom, fromDate, toDate, accountNo);
       if (response.status === 200) {
         Swal.fire({
           title: "Task created successfully!",
           text: "Task ID: " + response.data.data.data.Task_Id,
           icon: "success",
           confirmButtonColor: "#28a745"
         });
       }
     } catch (error) {
       Swal.fire({
         title: "Error",
         text: error.message || "Failed to create task.",
         icon: "error",
         confirmButtonColor: "#d33"
       });
     } finally {
       setIsCreatingTask(false);
     }
   };
 

   const naviCaseID = (caseId) => {
    navigate("/Incident/Case_Details", { state: { CaseID: caseId } });
  } 

   useEffect(() => {
     setAccountNo("");
     setCaseId("");
   }, [searchBy]);
 
 
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
       <div className="flex flex-col flex-1">
         <main className="p-6">
           <h1 className={GlobalStyle.headingLarge}>Case Closed Log</h1>
 
           {/* Filters Section */}
           <div className={`${GlobalStyle.cardContainer} w-full mt-6`}>
             <div className="flex flex-wrap items-center justify-end w-full gap-3">
 
               <div className="flex items-center">
               <input
              type="text"
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
              placeholder="Account Number"
              className={`${GlobalStyle.inputText} w-full sm:w-auto`}
              style={{ minWidth: "150px" }}
            />
               </div>
 
               <div className="flex items-center">
                
               </div>
 
               <div className="flex items-center">
                 <select
                   value={phase}
                   onChange={(e) => setPhase(e.target.value)}
                   className={`${GlobalStyle.selectBox}`}
                   style={{ color: phase === "" ? "gray" : "black" }}
                 >
                   <option value="" hidden>Phase</option>
                   <option value="Negotiation" style={{ color: "black" }}>Negotiation</option>
                   <option value="Mediation Board" style={{ color: "black" }}>Mediation Board</option>
                   <option value="Litigation" style={{ color: "black" }}>Litigation</option>
                   <option value="LOD" style={{ color: "black" }}>LOD</option>
                   <option value="WRIT" style={{ color: "black" }}>WRIT</option>
                   <option value="Dispute" style={{ color: "black" }}>Dispute</option>
                 </select>
               </div>
 
               <div className="flex items-center">
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
               </div>
 
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
                   className={`${GlobalStyle.buttonPrimary}  w-full sm:w-auto`}
                   onClick={handleFilterButton}
                 >
                   Filter
                 </button>
               )}
               {["admin", "superadmin", "slt"].includes(userRole) && (
                 <button
                   className={`${GlobalStyle.buttonRemove}  w-full sm:w-auto`}
                   onClick={handleClear}
                 >
                   Clear
                 </button>
               )}
             </div>
           </div>
 
           {/* Search Bar */}
           <div className="mb-4 flex justify-start mt-10">
             <div className={GlobalStyle.searchBarContainer}>
               <input
                 type="text"
                 className={GlobalStyle.inputSearch}
                 value={searchQuery}
                 onChange={(e) => {
                   setCurrentPage(1); // Reset to page 1 on search
                   setSearchQuery(e.target.value)
                 }}
               />
               <FaSearch className={GlobalStyle.searchBarIcon} />
             </div>
           </div>
 
           {/* Table */}
           <div className={`${GlobalStyle.tableContainer} mt-10 overflow-x-auto`}>
             <table className={GlobalStyle.table}>
               <thead className={GlobalStyle.thead}>
                 <tr>
                   <th className={GlobalStyle.tableHeader}>Case ID</th>
                   <th className={GlobalStyle.tableHeader}>Account No</th>
                   <th className={GlobalStyle.tableHeader}>Status</th>
                   <th className={GlobalStyle.tableHeader}>Phase</th>
                   <th className={GlobalStyle.tableHeader}>RTOM</th>
                   <th className={GlobalStyle.tableHeader}>Closed On</th>
                 </tr>
               </thead>

               <tbody>
                 {filteredDataBySearch && filteredDataBySearch.length > 0 ? (
                   filteredDataBySearch.slice(startIndex, endIndex).map((item, index) => (
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
                                    onClick={() => naviCaseID(item.case_id)}
                                  >
                                    {item.case_id || ""}
                       </td>
                       <td className={GlobalStyle.tableData}>{item.account_no || ""}</td>
                       <td className={`${GlobalStyle.tableData} flex items-center justify-center`}>
                      {renderStatusIcon(item.status || "", index)}
                    </td>
               
                       <td className={GlobalStyle.tableData}> {item.phase || ""} </td>
                       <td className={GlobalStyle.tableData}>{item.rtom || ""}</td>
                       <td className={GlobalStyle.tableData}>{item.created_dtm ? new Date(item.created_dtm).toLocaleDateString("en-GB") : ""}</td>
                       
                        
                     </tr>
                   ))
                 ) : (
                   <tr>
                     <td colSpan={9} className={`${GlobalStyle.tableData} text-center`}>No cases available</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
 
           {/* Pagination Section */}
           {filteredDataBySearch.length > 0 && (<div className={GlobalStyle.navButtonContainer}>
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
                   ? currentPage >= Math.ceil(filteredDataBySearch.length / rowsPerPage)
                   : !isMoreDataAvailable && currentPage >= Math.ceil(filteredData.length / rowsPerPage
                   )}
               className={`${GlobalStyle.navButton} ${(searchQuery
                 ? currentPage >= Math.ceil(filteredDataBySearch.length / rowsPerPage)
                 : !isMoreDataAvailable && currentPage >= Math.ceil(filteredData.length / rowsPerPage))
                 ? "cursor-not-allowed"
                 : ""
                 }`}
             >
               <FaArrowRight />
             </button>
           </div>)}
 
           {["admin", "superadmin", "slt"].includes(userRole) && filteredDataBySearch.length > 0 && (
             <button
               onClick={HandleCreateTaskDownloadCaseClosedLog}
               className={`${GlobalStyle.buttonPrimary} ${isCreatingTask ? 'opacity-50' : ''}`}
               disabled={isCreatingTask}
               style={{ display: 'flex', alignItems: 'center' }}
             >
               {!isCreatingTask && <FaDownload style={{ marginRight: '8px' }} />}
               {isCreatingTask ? 'Creating Tasks...' : 'Create task and let me know'}
             </button>
           )}
         </main>
       </div>
     </div>
   );
 };
 
 export default Case_Closed_Log;
 