import { Routes, Route } from "react-router-dom";

import Login from "../components/Login";
import Register from "../components/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import Unauthorized from "../components/Unauthorized";
import CreateTask from "../pages/createTasks";
import UserProfile from "../pages/userProfile";

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



//DISTRIBUTION
import OpenIncident from "../pages/Distribution/OpenIncident";
import CollectOnlyCPECollect from "../pages/Distribution/CollectOnlyCPECollect";
import DirectLODSendingIncident from "../pages/Distribution/DirectLODSendingIncident";
import RejectIncident from "../pages/Distribution/RejectIncident";
import RejectIncidentlog from "../pages/Distribution/RejectIncidentlog";
import FilteredIncidents from "../pages/Distribution/FilteredIncidents";

{/* Distribute Imports */ }
import AssignDRC from "../pages/Distribute/AssignDRC";
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
const Routers = () => {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/create-task" element={<CreateTask />} />
      <Route path="/user-profile" element={<UserProfile />} />


      {/* Prototype Routes */}
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} allowedRoles={['superadmin']} />} />
      <Route path="/prototypeA" element={<ProtectedRoute element={<PrototypeA />} allowedRoles={['superadmin']} />} />
      <Route path="/prototypeB" element={<ProtectedRoute element={<PrototypeB />} allowedRoles={['superadmin']} />} />
      <Route path="/prototypeC" element={<ProtectedRoute element={<PrototypeC />} allowedRoles={['superadmin']} />} />

      <Route path="/additional_request_log" element={<ProtectedRoute element={<RecoveryOfficerRequests />} allowedRoles={['superadmin']} />} />
      <Route path="/drc/mediation-board" element={<ProtectedRoute element={<ForwardMediationBoard />} allowedRoles={['superadmin']} />} />
      <Route path="/drc/period-extension" element={<ProtectedRoute element={<ValidityPeriodExtension />} allowedRoles={['superadmin']} />} />
      <Route path="/drs/logs/reuest-response-logs" element={<ProtectedRoute element={<RequestResponseLog />} allowedRoles={['superadmin']} />} />



      {/* //DISTRIBUTION */}
      <Route path="/Distribution/open-incident" element={<OpenIncident />} />
      <Route path="/Distribution/collect-only-cpe-collect" element={<CollectOnlyCPECollect />} />
      <Route path="/Distribution/direct-lod-sending-incident" element={<DirectLODSendingIncident />} />
      <Route path="/Distribution/reject-incident" element={<RejectIncident />} />
      <Route path="/Distribution/reject-incident-log" element={<RejectIncidentlog />} />
      <Route path="/Distribution/filtered-incident" element={<ProtectedRoute element={<FilteredIncidents />} allowedRoles={['superadmin']} />} />





      {/* Distribute Routes */}
      <Route path="/pages/Distribute/AssignDRC" element={<ProtectedRoute element={<AssignDRC />} allowedRoles={['superadmin']} />} />
      <Route path="/pages/Distribute/AssignDRCForCollectCPE" element={<ProtectedRoute element={<AssignDRCForCollectCPE />} allowedRoles={['superadmin']} />} />
      <Route path="/pages/Distribute/AssignedDRCSummary" element={<ProtectedRoute element={<AssignedDRCSummary />} allowedRoles={['superadmin']} />} />
      <Route path="/pages/Distribute/AssignedDRCSummaryCollectCPE" element={<ProtectedRoute element={<AssignedDRCSummaryCollectCPE />} allowedRoles={['superadmin']} />} />
      <Route path="/pages/Distribute/DistributionPreparationBulkUpload" element={<ProtectedRoute element={<DistributionPreparationBulkUpload />} allowedRoles={['superadmin']} />} />
      <Route path="/pages/Distribute/DistributionPreparationOnlyCPECollect" element={<ProtectedRoute element={<DistributionPreparationOnlyCPECollect />} allowedRoles={['superadmin']} />} />
      <Route path="/pages/Distribute/DRCAssignManagerApproval" element={<ProtectedRoute element={<DRCAssignManagerApproval />} allowedRoles={['superadmin']} />} />
      <Route path="/pages/Distribute/DistributeDummy" element={<ProtectedRoute element={<DistributeDummy />} allowedRoles={['superadmin']} />} />
      <Route path="/pages/Distribute/CaseDistributionDRCTransactions-1Batch" element={<ProtectedRoute element={<CaseDistributionDRCTransactions1Batch />} allowedRoles={['superadmin']} />} />
      <Route path="/pages/Distribute/CaseDistributionDRCSummary" element={<ProtectedRoute element={<CaseDistributionDRCSummary />} allowedRoles={['superadmin']} />} />
      <Route path="/pages/Distribute/AmendAssignedDRC" element={<ProtectedRoute element={<AmendAssignedDRC />} allowedRoles={['superadmin']} />} />
      <Route path="/pages/Distribute/CaseDistributionDRCSummarywithRTOM" element={<ProtectedRoute element={<CaseDistributionDRCSummarywithRTOM />} allowedRoles={['superadmin']} />} />

      <Route path="/pages/Distribute/CaseDistributionDRCTransactions-(1Batch)" element={<ProtectedRoute element={<CaseDistributionDRCTransactionsBatch />} allowedRoles={['superadmin']} />} />

      <Route path="/pages/Distribute/ReAssignDRC" element={<ReAssignDRC />} />
      <Route path="/pages/Distribute/AssignDRCCaseList" element={<AssignDRCCaseList />} />
      {/* //INCIDENT */}
      <Route path="/Incident/Incident_List" element={<ProtectedRoute element={<Incident_List />} allowedRoles={['superadmin']} />} />
      <Route path="/incident/register" element={<ProtectedRoute element={<Incident_Register_Individual />} allowedRoles={['superadmin']} />} />
      <Route path="/incident/register-bulk" element={<ProtectedRoute element={<Incident_Register_Bulk_Upload />} allowedRoles={['superadmin']} />} />
      <Route path="/incident/upload-log" element={<ProtectedRoute element={<SupBulkUploadLog />} allowedRoles={['superadmin']} />} />





    </Routes>
  );
};

export default Routers;
