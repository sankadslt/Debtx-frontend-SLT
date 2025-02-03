


import { Routes, Route } from "react-router-dom";

import Login from "../components/Login";
import Register from "../components/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import Unauthorized from "../components/Unauthorized";

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

//DISTRIBUTION
import OpenIncident from "../pages/Distribution/OpenIncident";
import CollectOnlyCPECollect from "../pages/Distribution/CollectOnlyCPECollect";
import DirectLODSendingIncident from "../pages/Distribution/DirectLODSendingIncident";
import RejectIncident from "../pages/Distribution/RejectIncident";
import RejectIncidentlog from "../pages/Distribution/RejectIncidentlog";


const Routers = () => {
  return (
    <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized/>} />

      {/* Prototype Routes */}
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} allowedRoles={['superadmin']} />} />
      <Route path="/prototypeA" element={<ProtectedRoute element={<PrototypeA />} allowedRoles={['superadmin']} />} />
      <Route path="/prototypeB" element={<ProtectedRoute element={<PrototypeB />} allowedRoles={['superadmin']} />} />
      <Route path="/prototypeC" element={<ProtectedRoute element={<PrototypeC />} allowedRoles={['superadmin']} />} />

      <Route path="/additional_request_log" element={<ProtectedRoute element={<RecoveryOfficerRequests />} allowedRoles={['superadmin']} />} />
      <Route path="/drc/mediation-board" element={<ProtectedRoute element={<ForwardMediationBoard />} allowedRoles={['superadmin']} />} />
      <Route path="/drc/period-extension" element={<ProtectedRoute element = {<ValidityPeriodExtension/>} allowedRoles={['superadmin']} />} />
      <Route path="/drs/logs/reuest-response-logs" element={<ProtectedRoute element = {<RequestResponseLog/>} allowedRoles={['superadmin']} />}/>


      {/* //DISTRIBUTION */}
      <Route path = "/Distribution/open-incident" element={<OpenIncident />} />
      <Route path = "/Distribution/collect-only-cpe-collect" element={<CollectOnlyCPECollect />} />
      <Route path = "/Distribution/direct-lod-sending-incident" element={<DirectLODSendingIncident />} />
      <Route path = "/Distribution/reject-incident" element={<RejectIncident />} />
      <Route path = "/Distribution/reject-incident-log" element={<RejectIncidentlog />} />


      {/* //INCIDENT */}
      <Route path="/Incident/Incident_List" element={<ProtectedRoute element={<Incident_List />} allowedRoles={['superadmin']} />} />
      <Route path="/incident/register" element={<ProtectedRoute element={<Incident_Register_Individual />} allowedRoles={['superadmin']} />} />
      <Route path="/incident/register-bulk" element={<ProtectedRoute element={<Incident_Register_Bulk_Upload />} allowedRoles={['superadmin']} />} />
        
    </Routes>
  );
};

export default Routers;