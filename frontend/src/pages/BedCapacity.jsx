import { useState } from "react";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import WardMatrix from "../components/dashboard/WardMatrix";
import DischargeFlow from "../components/dashboard/DischargeFlow";
import KpiRibbon from "../components/dashboard/KpiRibbon";

import "../styles/layout.css";
import "../styles/dashboard.css";

function BedCapacity() {
  return (
    <div className="app-shell">
      <Header />

      <div className="app-body">
        <Sidebar />

        <main className="dashboard-content">
          <div className="workspace-header" style={{ flexWrap: "wrap", gap: "12px" }}>
            <div>
              <span className="workspace-kicker">
                OPERATIONS / RECONCILIATION & CENSUS
              </span>
              <h1>Bed Capacity & Census Truth</h1>
            </div>

            <div className="workspace-meta">
              <span>LAST CENSUS AUDIT</span>
              <strong>Just now (Live HL7 Sync)</strong>
            </div>
          </div>

          <KpiRibbon />

          <div className="operations-grid">
            <WardMatrix />
            <DischargeFlow />
          </div>
        </main>
      </div>
    </div>
  );
}

export default BedCapacity;
