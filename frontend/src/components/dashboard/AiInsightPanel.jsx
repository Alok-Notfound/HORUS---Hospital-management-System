import { useState } from "react";
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  X,
  Zap,
  Activity,
  BedDouble,
  FileCheck2,
  RefreshCw,
  Clock3,
  ShieldCheck,
  Send
} from "lucide-react";

function AiInsightPanel() {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSweeping, setIsSweeping] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Interactive AI findings state
  const [findings, setFindings] = useState([
    {
      id: "AI-F01",
      category: "ICU CAPACITY PREDICTION",
      title: "Critical ICU Bed Bottleneck Surge (96% Elev.)",
      description: "Emergency Trauma intake projects +4 ICU admissions within 3 hours. Current ICU capacity is 93.3% (56/60 beds). Step-down transfer required.",
      severity: "critical",
      actionLabel: "Transfer 2 Stabilized Patients to Step-Down (Ward 2C)",
      resolved: false,
      timestamp: "Just now"
    },
    {
      id: "AI-F02",
      category: "EHR RECONCILIATION FLAG",
      title: "3 Ghost Beds Detected in Ward 4B",
      description: "Pressure sensor telemetry indicates Beds MED-04, MED-12, PED-08 are physically empty for >45 min despite EHR 'Occupied' flag.",
      severity: "warning",
      actionLabel: "Auto-Reconcile 3 Ghost Beds to EHR",
      resolved: false,
      timestamp: "2m ago"
    },
    {
      id: "AI-F03",
      category: "DIAGNOSTIC SLA WARNING",
      title: "ER STAT Troponin-I Delay Risk",
      description: "Cardiac panel queue in ER laboratory approaching 14-min SLA breach threshold due to analyzer batching.",
      severity: "alert",
      actionLabel: "Route to Secondary STAT Analyzer",
      resolved: false,
      timestamp: "6m ago"
    },
    {
      id: "AI-F04",
      category: "PHARMACY INVENTORY RISK",
      title: "Meropenem 1g IV Low Stock Projection",
      description: "ICU sepsis cohort consuming Meropenem at 3.2x normal velocity. Stock projected to deplete in 18 hours.",
      severity: "info",
      actionLabel: "Dispatch Emergency Pharmacy Purchase Order",
      resolved: false,
      timestamp: "12m ago"
    }
  ]);

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  }

  function handleExecuteFinding(id) {
    setFindings((current) =>
      current.map((item) =>
        item.id === id ? { ...item, resolved: true } : item
      )
    );
    const item = findings.find((f) => f.id === id);
    showToast(`AI Action Executed: "${item?.actionLabel || "Action Completed"}"`);
  }

  function runAiSweep() {
    setIsSweeping(true);
    setTimeout(() => {
      setIsSweeping(false);
      showToast("AI Clinical Intelligence Sweep complete: 4 Telemetry vectors verified!");
    }, 900);
  }

  const activeCount = findings.filter((f) => !f.resolved).length;

  return (
    <>
      <section className="ai-panel">
        <div className="ai-panel-content">
          <div className="ai-heading">
            <div className="ai-icon" style={{ background: "rgba(255, 255, 255, 0.15)", border: "1px solid rgba(255, 255, 255, 0.3)" }}>
              <img
                src="/logo.png"
                alt="HORUS Logo"
                style={{ width: "28px", height: "28px", objectFit: "contain", borderRadius: "50%", display: "block" }}
              />
            </div>

            <div>
              <span>AI-POWERED RECONCILIATION</span>
              <h2>AI Intelligence Center</h2>
            </div>
          </div>

          <div className="ai-insights">
            <div className="ai-insight">
              <span className="ai-insight-label">LIVE ICU RISK</span>
              <strong>96% Elev.</strong>
              <small>Trauma Flow</small>
            </div>

            <div className="ai-divider" />

            <div className="ai-insight">
              <span className="ai-insight-label">DATA FLAGS</span>
              <strong>{activeCount > 0 ? "3" : "0"}</strong>
              <small>{activeCount > 0 ? "Ward 4B" : "All Reconciled"}</small>
            </div>

            <div className="ai-divider" />

            <div className="ai-insight">
              <span className="ai-insight-label">RECOMMENDATION</span>
              <strong>{activeCount}</strong>
              <small>{activeCount > 0 ? "Step-downs recommended" : "All Actions Executed"}</small>
            </div>
          </div>

          <button
            className="ai-action"
            type="button"
            onClick={() => setModalOpen(true)}
            style={{ cursor: "pointer" }}
          >
            Review AI Findings
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* AI FINDINGS MODAL */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "grid",
            placeItems: "center",
            zIndex: 9999,
            padding: "20px"
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "760px",
              background: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {/* TOAST INSIDE MODAL */}
            {toastMsg && (
              <div style={{
                position: "fixed",
                bottom: "24px",
                right: "24px",
                zIndex: 10000,
                background: "#0f172a",
                color: "#ffffff",
                padding: "12px 20px",
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

            {/* MODAL HEADER */}
            <div style={{
              padding: "18px 24px",
              borderBottom: "1px solid #e2e8f0",
              background: "#00288e",
              color: "#ffffff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src="/logo.png"
                  alt="HORUS"
                  style={{ width: "36px", height: "36px", objectFit: "contain", borderRadius: "50%", background: "#ffffff", padding: "1px" }}
                />
                <div>
                  <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.08em", color: "rgba(255,255,255,0.75)", textTransform: "uppercase", display: "block" }}>
                    HORUS CLINICAL DECISION SUPPORT
                  </span>
                  <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff", margin: 0 }}>
                    AI Intelligence Findings &amp; Live Recommendations
                  </h2>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button
                  type="button"
                  onClick={runAiSweep}
                  disabled={isSweeping}
                  style={{
                    height: "32px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "0 12px",
                    borderRadius: "6px",
                    border: "1px solid rgba(255,255,255,0.3)",
                    background: "rgba(255,255,255,0.15)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: isSweeping ? "not-allowed" : "pointer"
                  }}
                >
                  <RefreshCw size={13} style={{ transition: "transform 0.5s", transform: isSweeping ? "rotate(360deg)" : "none" }} />
                  {isSweeping ? "Running Sweep..." : "Run AI Sweep"}
                </button>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ background: "none", border: "none", color: "#ffffff", cursor: "pointer", padding: "4px" }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* MODAL BODY */}
            <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                <div style={{ padding: "12px", borderRadius: "8px", background: "#fef2f2", border: "1px solid #fecaca" }}>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: "#991b1b" }}>CRITICAL RISKS</span>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#b91c1c", marginTop: "2px" }}>1 Active</div>
                </div>
                <div style={{ padding: "12px", borderRadius: "8px", background: "#fffbeb", border: "1px solid #fef3c7" }}>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: "#92400e" }}>DATA DISCREPANCIES</span>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#d97706", marginTop: "2px" }}>3 Detected</div>
                </div>
                <div style={{ padding: "12px", borderRadius: "8px", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <span style={{ fontSize: "10px", fontWeight: "700", color: "#166534" }}>AI CONFIDENCE SCORE</span>
                  <div style={{ fontSize: "20px", fontWeight: "700", color: "#15803d", marginTop: "2px" }}>98.6%</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {findings.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: "16px",
                      borderRadius: "8px",
                      border: item.resolved ? "1px solid #e2e8f0" : item.severity === "critical" ? "1px solid #fca5a5" : item.severity === "warning" ? "1px solid #fde68a" : "1px solid #cbd5e1",
                      background: item.resolved ? "#f8fafc" : "#ffffff",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      opacity: item.resolved ? 0.75 : 1
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{
                          fontSize: "9px",
                          fontWeight: "700",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          textTransform: "uppercase",
                          background: item.severity === "critical" ? "#fee2e2" : item.severity === "warning" ? "#fef3c7" : "#e0f2fe",
                          color: item.severity === "critical" ? "#b91c1c" : item.severity === "warning" ? "#b45309" : "#0369a1"
                        }}>
                          {item.category}
                        </span>
                        <span style={{ fontSize: "11px", color: "#64748b" }}>{item.timestamp}</span>
                      </div>

                      {item.resolved ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "700", color: "#15803d" }}>
                          <CheckCircle2 size={13} /> Action Resolved
                        </span>
                      ) : (
                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#b91c1c" }}>
                          Pending Review
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px 0" }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: "12px", color: "#475569", lineHeight: "18px", margin: "0 0 12px 0" }}>
                      {item.description}
                    </p>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                      {!item.resolved && (
                        <button
                          type="button"
                          onClick={() => handleExecuteFinding(item.id)}
                          style={{
                            padding: "6px 14px",
                            borderRadius: "5px",
                            border: "none",
                            background: item.severity === "critical" ? "#b91c1c" : "#00288e",
                            color: "#ffffff",
                            fontSize: "11px",
                            fontWeight: "700",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                        >
                          <Zap size={13} />
                          {item.actionLabel}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div style={{
              padding: "14px 24px",
              borderTop: "1px solid #e2e8f0",
              background: "#f8fafc",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{ fontSize: "11px", color: "#64748b" }}>
                Zero-Loss AI Engine active • Continuous 3-minute neural reconciliation sweep
              </span>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#334155",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AiInsightPanel;
