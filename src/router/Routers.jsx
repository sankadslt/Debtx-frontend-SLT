import { Routes, Route } from "react-router-dom";

import Login from "../components/Login";
import Register from "../components/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import Unauthorized from "../components/Unauthorized";
import CreateTask from "../pages/createTasks";
import UserProfile from "../pages/userProfile";
import Chart from "../pages/Chart";

import Dashboard from "../pages/Dashboard";
import PrototypeA from "../assets/prototype/prototypeA";
import PrototypeB from "../assets/prototype/prototypeB";
import PrototypeC from "../assets/prototype/prototypeC";

import RecoveryOfficerRequests from "../pages/Request/additiional_request_log";
import ForwardMediationBoard from "../pages/Request/ForwardMediationBoard";
import ValidityPeriodExtension from "../pages/Request/ValidityPeriodExtension";
import RequestResponseLog from "../pages/Request/RequestResponseLog";

import Incident_List from "../pages/Incident/Incident_List";
import Incident_Register_Individual from "../pages/Incident/Incident_Register_Individual";
import Incident_Register_Bulk_Upload from "../pages/Incident/Incident_Register_Bulk_Upload";
import SupBulkUploadLog from "../pages/Incident/sup_bulk_upload_LOG";
import Incident_File_Download from "../pages/Incident/Incident_File_Download";

//import for the case details page
import CaseDetails from "../pages/Incident/Case_Details";
import Case_List from "../pages/Incident/Case_List";

//DISTRIBUTION
import OpenIncident from "../pages/Distribution/OpenIncident";
import CollectOnlyCPECollect from "../pages/Distribution/CollectOnlyCPECollect";
import DirectLODSendingIncident from "../pages/Distribution/DirectLODSendingIncident";
import RejectIncident from "../pages/Distribution/RejectIncident";
import RejectIncidentlog from "../pages/Distribution/RejectIncidentlog";
import FilteredIncidents from "../pages/Distribution/FilteredIncidents";

{
  /* Distribute Imports */
}
import AssignDRC from "../pages/Distribute/AssignDRC";
import AssignDRCReject from "../pages/Distribute/AssignDRCReject";
import AssignDRCForCollectCPE from "../pages/Distribute/AssignDRCForCollectCPE";
import AssignedDRCSummary from "../pages/Distribute/CaseDistributionDRCTransactions";
import AssignedDRCSummaryCollectCPE from "../pages/Distribute/AssignedDRCSummaryCollectCPE";
import DistributionPreparationBulkUpload from "../pages/Distribute/DistributionPreparationBulkUpload";
import DistributionPreparationOnlyCPECollect from "../pages/Distribute/DistributionPreparationOnlyCPECollect";
import DRCAssignManagerApproval from "../pages/Distribute/DRCAssignManagerApproval";
import DistributeDummy from "../pages/Distribute/DistributeDummy";
import CaseDistributionDRCTransactions1Batch from "../pages/Distribute/CaseDistributionDRCTransactions-1Batch";
import CaseDistributionDRCTransactionsBatch from "../pages/Distribute/CaseDistributionDRCTransactions-(1Batch)";
import CaseDistributionDRCSummary from "../pages/Distribute/CaseDistributionDRCSummary";
import CaseDistributionDRCSummarywithRTOM from "../pages/Distribute/CaseDistributionDRCSummarywithRTOM";
import AmendAssignedDRC from "../pages/Distribute/AmendAssignedDRC";
import ReAssignDRC from "../pages/Distribute/ReAssignDRC";
import AssignDRCCaseList from "../pages/Distribute/AssignDRCCaseList";
import DRCAssignManagerApproval2 from "../pages/Distribute/DRCAssignManagerApproval2";
import DRCAssignManagerApproval3 from "../pages/Distribute/DRCAssignManagerApproval3";

//MEDIATION BOARD
import MediationBoardCaseList from "../pages/Mediation_Board/MediationBoardCaseList";
import MediationBoardResponse from "../pages/Mediation_Board/MediationBoardResponse";

//MONEY TRANSACTION
import PaymentDetails from "../pages/Money_Transaction/PaymentDetails";

//Commission
import CommissionCaseList from "../pages/Commission/Commission_List";
//Settlement
import MonitorSettlement from "../pages/Settlement/MonitorSettlement";
// import MoneyTransactions from "../pages/Settlement/MoneyTransaction";

//Litigation
import { Litigation_List } from "../pages/Litigation/Litigation_List";
import { Litigation_Documentation } from "../pages/Litigation/Litigation_Documentation";
import { Litigation_Submission_Document_Summary } from "../pages/Litigation/Litigation_Submission_Document_Summary";
import { Litigation_Submission } from "../pages/Litigation/Litigation_Submission";
import { Litigation_Court_Details_Update } from "../pages/Litigation/Litigation_Court_Details_Update";
import { Litigation_Case_Details } from "../pages/Litigation/Litigation_Case_Details";

//SettlementPlan
import CreateSettlementPlan from "../pages/CreateSettlement/CreateSettlementPlan";
import { Change_Litigation_Submission_Document_Summary } from "../pages/Litigation/Change_Litigation_Submission_Document_Summary";

//LOD
import Digital_Signature_LOD from "../pages/LOD/Digital_Signature_LOD";
import LOD_Log from "../pages/LOD/LODLog";
import FinalReminderList from "../pages/LOD/FinalReminderList";
import CustomerResponse from "../pages/LOD/CustomerResponse";
import CustomerResponseReview from "../pages/LOD/CustomerResponseReview";
import Final_Reminder_LOD_Hold_List from "../pages/LOD/FinalReminderLODHoldList";
import SettlementPreview from "../pages/Settlement/SettlementPreview";
import PaymentPreview from "../pages/Money_Transaction/PaymentPreview";
import CommissionPreview from "../pages/Commission/Commission_Details";

// DRC
import Add_DRC from "../pages/DRC/Add_DRC";
import DRCList from "../pages/DRC/DRCList";
import DRCInfo from "../pages/DRC/DRCInfo";
import DRCDetails from "../pages/DRC/DRCDetails";
import DRCInfoEdit from "../pages/DRC/DRCInfoEdit";
import DrcAgreement from "../pages/DRC/DrcAgreement";

//Rtom

import RtomList from "../pages/Rtom/RtomList";
import RtomInfo from "../pages/Rtom/Rtominfo";
import AddRtom from "../pages/Rtom/AddRtom";
import RtomInfoEdit from "../pages/Rtom/RtomInfoEdit";
import RtomInfoEnd from "../pages/Rtom/RtomInfoEnd";
import ListofServicetype from "../pages/Rtom/ListofServicetype";
import RtomInfoNew from "../pages/Rtom/RtomInfoNew";

//USER
import UserList from "../pages/User/UserList";
import UserInfo from "../pages/User/UserInfo";
import SignUp from "../pages/User/SignUp";
import UserApproval from "../pages/User/UserApproval";

//RO
import ROList from "../pages/Recovery_Officer/ROList";
import ServiceTypeList from "../pages/Service/ServiceTypeList";

//TASKS
import ListAllTasks from "../pages/Task/ListAllTasks";

//Abnormal
import WithdrawalCaseLog from "../pages/Abnormal/Withdrawal_Case_Log";
 

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/create-task" element={<CreateTask />} />
      <Route path="/user-profile" element={<UserProfile />} />
      <Route path="/chart" element={<Chart />} />

      {/* Prototype Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            element={<Dashboard />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/prototypeA"
        element={
          <ProtectedRoute
            element={<PrototypeA />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/prototypeB"
        element={
          <ProtectedRoute
            element={<PrototypeB />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/prototypeC"
        element={
          <ProtectedRoute
            element={<PrototypeC />}
            allowedRoles={["superadmin"]}
          />
        }
      />

      <Route
        path="/additional_request_log"
        element={
          <ProtectedRoute
            element={<RecoveryOfficerRequests />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/drc/mediation-board"
        element={
          <ProtectedRoute
            element={<ForwardMediationBoard />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/drc/period-extension"
        element={
          <ProtectedRoute
            element={<ValidityPeriodExtension />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/drs/logs/reuest-response-logs"
        element={
          <ProtectedRoute
            element={<RequestResponseLog />}
            allowedRoles={["superadmin"]}
          />
        }
      />

      {/* //DISTRIBUTION */}

      <Route path="/Distribution/open-incident" element={<OpenIncident />} />
      <Route
        path="/Distribution/collect-only-cpe-collect"
        element={<CollectOnlyCPECollect />}
      />
      <Route
        path="/Distribution/direct-lod-sending-incident"
        element={<DirectLODSendingIncident />}
      />
      <Route
        path="/Distribution/reject-incident"
        element={<RejectIncident />}
      />
      <Route
        path="/Distribution/reject-incident-log"
        element={<RejectIncidentlog />}
      />
      <Route
        path="/Distribution/filtered-incident"
        element={
          <ProtectedRoute
            element={<FilteredIncidents />}
            allowedRoles={["superadmin"]}
          />
        }
      />

      {/* Distribute Routes */}
      <Route
        path="/pages/Distribute/AssignDRC"
        element={
          <ProtectedRoute
            element={<AssignDRC />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/AssignDRCReject"
        element={
          <ProtectedRoute
            element={<AssignDRCReject />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/AssignDRCForCollectCPE"
        element={
          <ProtectedRoute
            element={<AssignDRCForCollectCPE />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/AssignedDRCSummary"
        element={
          <ProtectedRoute
            element={<AssignedDRCSummary />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/AssignedDRCSummaryCollectCPE"
        element={
          <ProtectedRoute
            element={<AssignedDRCSummaryCollectCPE />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/DistributionPreparationBulkUpload"
        element={
          <ProtectedRoute
            element={<DistributionPreparationBulkUpload />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/DistributionPreparationOnlyCPECollect"
        element={
          <ProtectedRoute
            element={<DistributionPreparationOnlyCPECollect />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/DRCAssignManagerApproval"
        element={
          <ProtectedRoute
            element={<DRCAssignManagerApproval />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/DistributeDummy"
        element={
          <ProtectedRoute
            element={<DistributeDummy />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/CaseDistributionDRCTransactions-1Batch"
        element={
          <ProtectedRoute
            element={<CaseDistributionDRCTransactions1Batch />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/CaseDistributionDRCSummary"
        element={
          <ProtectedRoute
            element={<CaseDistributionDRCSummary />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/AmendAssignedDRC"
        element={
          <ProtectedRoute
            element={<AmendAssignedDRC />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/CaseDistributionDRCSummarywithRTOM"
        element={
          <ProtectedRoute
            element={<CaseDistributionDRCSummarywithRTOM />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/CaseDistributionDRCTransactions-(1Batch)"
        element={
          <ProtectedRoute
            element={<CaseDistributionDRCTransactionsBatch />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/DRCAssignManagerApproval2"
        element={
          <ProtectedRoute
            element={<DRCAssignManagerApproval2 />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/DRCAssignManagerApproval3"
        element={
          <ProtectedRoute
            element={<DRCAssignManagerApproval3 />}
            allowedRoles={["superadmin"]}
          />
        }
      />

      <Route path="/pages/Distribute/ReAssignDRC" element={<ReAssignDRC />} />
      <Route
        path="/pages/Distribute/AssignDRCCaseList"
        element={<AssignDRCCaseList />}
      />

      {/* //INCIDENT */}
      <Route
        path="/Incident/Incident_List"
        element={
          <ProtectedRoute
            element={<Incident_List />}
            allowedRoles={["superadmin"]}
          />
        }
      />

      {/* Distribute Routes */}
      <Route
        path="/pages/Distribute/AssignDRC"
        element={
          <ProtectedRoute
            element={<AssignDRC />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/AssignDRCForCollectCPE"
        element={
          <ProtectedRoute
            element={<AssignDRCForCollectCPE />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/AssignedDRCSummary"
        element={
          <ProtectedRoute
            element={<AssignedDRCSummary />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/AssignedDRCSummaryCollectCPE"
        element={
          <ProtectedRoute
            element={<AssignedDRCSummaryCollectCPE />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/DistributionPreparationBulkUpload"
        element={
          <ProtectedRoute
            element={<DistributionPreparationBulkUpload />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/DistributionPreparationOnlyCPECollect"
        element={
          <ProtectedRoute
            element={<DistributionPreparationOnlyCPECollect />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/DRCAssignManagerApproval"
        element={
          <ProtectedRoute
            element={<DRCAssignManagerApproval />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/DistributeDummy"
        element={
          <ProtectedRoute
            element={<DistributeDummy />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/CaseDistributionDRCTransactions-1Batch"
        element={
          <ProtectedRoute
            element={<CaseDistributionDRCTransactions1Batch />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/CaseDistributionDRCSummary"
        element={
          <ProtectedRoute
            element={<CaseDistributionDRCSummary />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/AmendAssignedDRC"
        element={
          <ProtectedRoute
            element={<AmendAssignedDRC />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Distribute/CaseDistributionDRCSummarywithRTOM"
        element={
          <ProtectedRoute
            element={<CaseDistributionDRCSummarywithRTOM />}
            allowedRoles={["superadmin"]}
          />
        }
      />

      <Route
        path="/pages/Distribute/CaseDistributionDRCTransactions-(1Batch)"
        element={
          <ProtectedRoute
            element={<CaseDistributionDRCTransactionsBatch />}
            allowedRoles={["superadmin"]}
          />
        }
      />

      <Route path="/pages/Distribute/ReAssignDRC" element={<ReAssignDRC />} />
      <Route
        path="/pages/Distribute/AssignDRCCaseList"
        element={<AssignDRCCaseList />}
      />

      {/* //INCIDENT */}

      <Route
        path="/Incident/Case_Details"
        element={
          <ProtectedRoute
            element={<CaseDetails />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/Incident/Case_List"
        element={
          <ProtectedRoute
            element={<Case_List />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="
		"
        element={
          <ProtectedRoute
            element={<Incident_List />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/incident/register"
        element={
          <ProtectedRoute
            element={<Incident_Register_Individual />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/incident/register-bulk"
        element={
          <ProtectedRoute
            element={<Incident_Register_Bulk_Upload />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/incident/upload-log"
        element={
          <ProtectedRoute
            element={<SupBulkUploadLog />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/incident/Incident_File_Download"
        element={
          <ProtectedRoute
            element={<Incident_File_Download />}
            allowedRoles={["superadmin"]}
          />
        }
      />

      {/* //MEDIATION BOARD */}
      <Route
        path="/MediationBoard/MediationBoardCaseList"
        element={
          <ProtectedRoute
            element={<MediationBoardCaseList />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/MediationBoard/MediationBoardResponse"
        element={
          <ProtectedRoute
            element={<MediationBoardResponse />}
            allowedRoles={["superadmin"]}
          />
        }
      />

      {/* //MONEY TRANSACTIONS */}
      <Route
        path="pages/Money_Transaction/MoneyTransaction"
        element={
          <ProtectedRoute
            element={<PaymentDetails />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Money_Transaction/payment/preview"
        element={
          <ProtectedRoute
            element={<PaymentPreview />}
            allowedRoles={["superadmin"]}
          />
        }
      />

      {/* //COMMISSION */}
      <Route
        path="/Commission/CommissionCaseList"
        element={
          <ProtectedRoute
            element={<CommissionCaseList />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/Commission/preview"
        element={
          <ProtectedRoute
            element={<CommissionPreview />}
            allowedRoles={["superadmin"]}
          />
        }
      />

      {/* //SETTLEMENT */}
      <Route
        path="/pages/Settlement/MonitorSettlement"
        element={
          <ProtectedRoute
            element={<MonitorSettlement />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/lod/ftl-log/preview"
        element={
          <ProtectedRoute
            element={<SettlementPreview />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      {/* <Route path="/pages/Settlement/MoneyTransactions" element={<ProtectedRoute element={<MoneyTransactions />} allowedRoles={['superadmin']} />} /> */}
      {/* //Create SETTLEMENT */}
      <Route
        path="/pages/CreateSettlement/CreateSettlementPlan"
        element={
          <ProtectedRoute
            element={<CreateSettlementPlan />}
            allowedRoles={["superadmin"]}
          />
        }
      />

      {/* Litigation */}
      <Route
        path="/pages/Litigation/Litigation_List"
        element={
          <ProtectedRoute
            element={<Litigation_List />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Litigation/Litigation_Documentation"
        element={
          <ProtectedRoute
            element={<Litigation_Documentation />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Litigation/Litigation_Submission_Document_Summary"
        element={
          <ProtectedRoute
            element={<Litigation_Submission_Document_Summary />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Litigation/Change_Litigation_Submission_Document_Summary"
        element={
          <ProtectedRoute
            element={<Change_Litigation_Submission_Document_Summary />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Litigation/Litigation_Submission"
        element={
          <ProtectedRoute
            element={<Litigation_Submission />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Litigation/Litigation_Court_Details_Update"
        element={
          <ProtectedRoute
            element={<Litigation_Court_Details_Update />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Litigation/Litigation_Case_Details"
        element={
          <ProtectedRoute
            element={<Litigation_Case_Details />}
            allowedRoles={["superadmin"]}
          />
        }
      />

      {/* //LOD */}
      <Route
        path="/pages/LOD/DigitalSignatureLOD"
        element={
          <ProtectedRoute
            element={<Digital_Signature_LOD />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/LOD/LODLog"
        element={
          <ProtectedRoute element={<LOD_Log />} allowedRoles={["superadmin"]} />
        }
      />
      <Route
        path="/pages/LOD/FinalReminderList"
        element={
          <ProtectedRoute
            element={<FinalReminderList />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/LOD/CustomerResponse"
        element={
          <ProtectedRoute
            element={<CustomerResponse />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/LOD/CustomerResponseReview"
        element={
          <ProtectedRoute
            element={<CustomerResponseReview />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/LOD/FinalReminderLODHoldList"
        element={
          <ProtectedRoute
            element={<Final_Reminder_LOD_Hold_List />}
            allowedRoles={["superadmin"]}
          />
        }
      />

      {/* RTOM      */}
      <Route
        path="/pages/Rtom/RtomList"
        element={
          <ProtectedRoute
            element={<RtomList />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Rtom/RtomInfo"
        element={
          <ProtectedRoute
            element={<RtomInfo />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Rtom/RtomInfoEnd/:rtomId"
        element={
          <ProtectedRoute
            element={<RtomInfoEnd />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Rtom/AddRtom"
        element={
          <ProtectedRoute element={<AddRtom />} allowedRoles={["superadmin"]} />
        }
      />
      <Route
        path="/pages/Rtom/ListofServiceType"
        element={
          <ProtectedRoute
            element={<ListofServicetype />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Rtom/RtomInfoEdit/:rtomId"
        element={
          <ProtectedRoute
            element={<RtomInfoEdit />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/Rtom/RtomInfoNew"
        element={
          <ProtectedRoute
            element={<RtomInfoNew />}
            allowedRoles={["superadmin"]}
          />
        }
      />

      {/* //MASTER DRC */}
      <Route
        path="/pages/DRC/Add_DRC"
        element={
          <ProtectedRoute element={<Add_DRC />} allowedRoles={["superadmin"]} />
        }
      />
      <Route
        path="/pages/DRC/DRCList"
        element={
          <ProtectedRoute element={<DRCList />} allowedRoles={["superadmin"]} />
        }
      />
      <Route
        path="/pages/DRC/DRCDetails"
        element={
          <ProtectedRoute
            element={<DRCDetails />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      <Route
        path="/pages/DRC/DRCInfo"
        element={
          <ProtectedRoute element={<DRCInfo />} allowedRoles={["superadmin"]} />
        }
      />
      <Route path="/pages/DRC/DRCInfoEdit" element={<DRCInfoEdit />} />
       
      <Route path="/pages/DRC/DrcAgreement" element={<ProtectedRoute element={<DrcAgreement />} allowedRoles={['superadmin']} />} />

     
      {/* //MASTER DRC
    <Route path="/pages/DRC/Add_DRC" element={<ProtectedRoute element={<Add_DRC />} allowedRoles={['superadmin']} />} />
    <Route path="/pages/DRC/DRCList" element={<ProtectedRoute element={<DRCList />} allowedRoles={['superadmin']} />} />
    <Route path="/pages/DRC/DRCInfo" element={<ProtectedRoute element={<DRCInfo />} allowedRoles={['superadmin']} />} />
    <Route path="/pages/DRC/DRCInfoEdit" element={<DRCInfoEdit />} /> */}

      {/* User */}
      <Route path="/pages/User/UserList" element={<ProtectedRoute element={<UserList />} allowedRoles={['superadmin']} />} />
      <Route path="/pages/User/UserInfo" element={<ProtectedRoute element={<UserInfo />} allowedRoles={['superadmin']} />} />
      <Route path="/pages/User/SignUp" element={<ProtectedRoute element={<SignUp />} allowedRoles={['superadmin']} />} />
	    <Route path="/pages/User/UserApproval" element={<ProtectedRoute element={<UserApproval />} allowedRoles={["superadmin"]} />} />

      {/* RO */}
      <Route
        path="/pages/ro/ro-list"
        element={
          <ProtectedRoute element={<ROList />} allowedRoles={["superadmin"]} />
        }
      />

      {/* Service */}
      <Route
        path="/pages/Service/ServiceTypeList"
        element={
          <ProtectedRoute
            element={<ServiceTypeList />}
            allowedRoles={["superadmin"]}
          />
        }
      />
      {/* Tasks*/}
      <Route
        path="/pages/Task/ListAllTasks"
        element={
          <ProtectedRoute
            element={<ListAllTasks />}
            allowedRoles={["superadmin"]}
          />
        }
      />
        {/* Abnormal*/}
        <Route path="/pages/Abnormal/Withdraw_Case_Log"
     element={<ProtectedRoute
       element={<WithdrawalCaseLog />}
        allowedRoles={['superadmin' ]} />} />


 
 
    </Routes>
  );
};

export default Routers;
