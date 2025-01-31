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

    </Routes>
  );
};

export default Routers;
