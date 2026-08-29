import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import BedCapacity from "./pages/BedCapacity";
import PatientFlow from "./pages/PatientFlow";
import Appointment from "./pages/Appointment";
import DiagnosticTurnaround from "./pages/DiagnosticTurnaround";
import GhostBedAuditor from "./pages/GhostBedAuditor";
import DiscrepancyLedger from "./pages/DiscrepancyLedger";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bed-capacity" element={<BedCapacity />} />
        <Route path="/patient-flow" element={<PatientFlow />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/diagnostic-turnaround" element={<DiagnosticTurnaround />} />
        <Route path="/ghost-bed-auditor" element={<GhostBedAuditor />} />
        <Route path="/discrepancy-ledger" element={<DiscrepancyLedger />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
