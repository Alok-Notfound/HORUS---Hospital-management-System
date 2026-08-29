import { useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Clock3, Sparkles, UserCheck, Zap, X } from "lucide-react";

const initialPatients = [
  {
    id: "PT-1042",
    patient: "Rahul Verma (ICU-04)",
    status: "Blocked",
    description: "Awaiting MRI Brain Results (3 hrs delayed). Bed assignment holding in Step-Down 2C.",
    type: "blocked",
  },
  {
    id: "PT-1088",
    patient: "Sunita Patel (Rm 402)",
    status: "Clearing",
    description: "Transport dispatched. EVS notified for terminal disinfection and bed turnover.",
    type: "clearing",
    progress: 75,
  },
  {
    id: "PT-1095",
    patient: "Amit Joshi (MED-11)",
    status: "Awaiting",
    description: "Pending attending physician sign-off. Post-op discharge summary staged.",
    type: "awaiting",
  },
  {
    id: "PT-1104",
    patient: "Priya Hegde (SUR-08)",
    status: "Blocked",
    description: "Pharmacy discharge counseling pending for anticoagulant medication regiment.",
    type: "blocked",
  }
];

function DischargeFlow() {
  const [patients, setPatients] = useState(initialPatients);
  const [toastMsg, setToastMsg] = useState(null);

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  }

  function handleEscalate(id) {
    setPatients((curr) =>
      curr.map((p) =>
        p.id === id ? { ...p, status: "Clearing", type: "clearing", progress: 50, description: "Escalated to Lab Supervisor. STAT clearance in progress." } : p
      )
    );
    showToast(`Escalated case ${id} to charge nurse & clinical lab supervisor.`);
  }

  function handleSignOff(id) {
    setPatients((curr) =>
      curr.map((p) =>
        p.id === id ? { ...p, status: "Discharged", type: "clearing", progress: 100, description: "Physician sign-off completed. Bed released to inventory." } : p
      )
    );
    showToast(`Physician signed off discharge for ${id}. Bed marked open!`);
  }

  const blockedCount = patients.filter((p) => p.type === "blocked").length;

  return (
    <section className="discharge-section">
      {toastMsg && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 10000,
          background: "#0f172a",
          color: "#ffffff",
          padding: "10px 18px",
          borderRadius: "8px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "12px",
          fontWeight: "600"
        }}>
          <CheckCircle2 size={16} color="#10b981" />
          {toastMsg}
        </div>
      )}

      <div className="discharge-header">
        <div>
          <h2>Live Patient Discharge Flow</h2>
          <span style={{ fontSize: "11px", color: "#757684" }}>Bed turnover &amp; clinical clearing velocity</span>
        </div>

        <span className="blocked-count">{blockedCount} Blocked</span>
      </div>

      <div className="discharge-list">
        {patients.map((patient) => (
          <article
            className={`patient-card patient-${patient.type}`}
            key={patient.id}
          >
            <div className="patient-card-top">
              <div>
                <strong>{patient.id}</strong>
                <span style={{ display: "block", fontSize: "11px", color: "#444653", fontWeight: "600" }}>
                  {patient.patient}
                </span>
              </div>

              <span className={`patient-status ${patient.type}`}>
                {patient.type === "blocked" && (
                  <AlertCircle size={11} />
                )}

                {patient.type === "awaiting" && (
                  <CheckCircle2 size={11} />
                )}

                {patient.status}
              </span>
            </div>

            <p>{patient.description}</p>

            {patient.type === "blocked" && (
              <div className="patient-actions">
                <button
                  type="button"
                  onClick={() => handleEscalate(patient.id)}
                  style={{ cursor: "pointer" }}
                >
                  Escalate STAT
                  <ArrowRight size={12} />
                </button>
              </div>
            )}

            {patient.type === "awaiting" && (
              <div className="patient-actions">
                <button
                  type="button"
                  onClick={() => handleSignOff(patient.id)}
                  style={{
                    cursor: "pointer",
                    background: "#00288e",
                    color: "#ffffff",
                    border: "none",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: "700",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <UserCheck size={12} />
                  Authorize Sign-Off
                </button>
              </div>
            )}

            {patient.type === "clearing" && (
              <div className="patient-progress">
                <div className="progress-track">
                  <div
                    className="progress-value"
                    style={{ width: `${patient.progress}%` }}
                  />
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default DischargeFlow;
