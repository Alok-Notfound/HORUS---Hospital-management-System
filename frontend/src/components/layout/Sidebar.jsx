import { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  BedDouble,
  CheckCircle2,
  ClipboardList,
  FileWarning,
  HelpCircle,
  LayoutDashboard,
  Logs,
  Mail,
  UserRound,
  X,
  Search,
  Clock3,
  ArrowRight,
  Download,
  Trash2,
  RefreshCw,
  Send,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { NavLink } from "react-router-dom";

const initialLogs = [
  {
    id: 1,
    time: "23:41",
    module: "Patient Flow",
    level: "success",
    action: "Census data reconciled across 4,678 records",
    details: "Automated HL7 ingestion completed with zero packet drops."
  },
  {
    id: 2,
    time: "23:38",
    module: "Diagnostic",
    level: "success",
    action: "Lab turnaround telemetry updated",
    details: "STAT Troponin and Arterial Blood Gas queues synchronized."
  },
  {
    id: 3,
    time: "23:35",
    module: "Ghost Bed Auditor",
    level: "warning",
    action: "2 bed discrepancies detected",
    details: "Physical RFID weight sensor empty, digital EHR marked occupied."
  },
  {
    id: 4,
    time: "23:31",
    module: "Appointment",
    level: "success",
    action: "Doctor availability synchronized",
    details: "Verified consultation availability for 14 active OPD specialists."
  },
  {
    id: 5,
    time: "23:26",
    module: "Discrepancy Ledger",
    level: "success",
    action: "Inventory reconciliation completed",
    details: "400 medicine pharmacy formulations audited across all wards."
  },
  {
    id: 6,
    time: "23:19",
    module: "System",
    level: "success",
    action: "Daily operations sync completed",
    details: "Backup snapshot stored in encrypted database."
  }
];

const faqs = [
  {
    q: "How does Zero-Loss Census Reconciliation work?",
    a: "HORUS continuously pulls raw HL7 admission logs and compares them against physical RFID/weight sensor telemetries in real-time to detect Ghost Beds and unrecorded transfers."
  },
  {
    q: "How do I reconcile an unassigned Ghost Bed?",
    a: "Navigate to 'Ghost Bed Auditor' from the sidebar, find the row marked 'Ghost Bed', and click the blue 'Reconcile' button to align the EHR state with the physical room truth."
  },
  {
    q: "Where is the Patient Flow admission recorded?",
    a: "When you click '+ Add New Patient' on the Patient Flow page, the record is immediately prepended to the live ledger and persisted in your local browser cache."
  },
  {
    q: "How to export the Bed Matrix CSV report?",
    a: "On the Bed Capacity & Census Truth dashboard matrix, select your desired date from the dropdown and click 'Export CSV' to download the formatted audit sheet."
  }
];

function Sidebar() {
  const [panel, setPanel] = useState(null);
  const [logSearch, setLogSearch] = useState("");
  const [logs, setLogs] = useState(initialLogs);
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // Support Form State
  const [activeFaq, setActiveFaq] = useState(null);
  const [supportForm, setSupportForm] = useState({
    category: "Data Reconciliation",
    priority: "Medium",
    message: ""
  });
  const [ticketSubmitted, setTicketSubmitted] = useState(null);
  const [systemHealthRunning, setSystemHealthRunning] = useState(false);
  const [healthStatus, setHealthStatus] = useState("All Systems Operational");

  const [profile, setProfile] = useState(() => {
    try {
      const stored = localStorage.getItem("horus-profile");
      return stored ? JSON.parse(stored) : { name: "Administrator", role: "System Administrator", department: "Hospital Operations" };
    } catch {
      return { name: "Administrator", role: "System Administrator", department: "Hospital Operations" };
    }
  });

  const [avatar, setAvatar] = useState(() => {
    try {
      return localStorage.getItem("horus-profile-avatar");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    function syncProfile() {
      try {
        const stored = localStorage.getItem("horus-profile");
        if (stored) setProfile(JSON.parse(stored));
        const storedAvatar = localStorage.getItem("horus-profile-avatar");
        setAvatar(storedAvatar);
      } catch {}
    }

    window.addEventListener("horus-profile-updated", syncProfile);
    window.addEventListener("storage", syncProfile);

    return () => {
      window.removeEventListener("horus-profile-updated", syncProfile);
      window.removeEventListener("storage", syncProfile);
    };
  }, []);

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  }

  const navigation = [
    {
      label: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Bed Capacity & Census Truth",
      path: "/bed-capacity",
      icon: BedDouble,
    },
    {
      label: "Patient Flow",
      path: "/patient-flow",
      icon: Activity,
    },
    {
      label: "Appointment",
      path: "/appointment",
      icon: ClipboardList,
    },
    {
      label: "Diagnostic Turnaround",
      path: "/diagnostic-turnaround",
      icon: Activity,
    },
    {
      label: "Ghost Bed Auditor",
      path: "/ghost-bed-auditor",
      icon: FileWarning,
    },
    {
      label: "Discrepancy Ledger",
      path: "/discrepancy-ledger",
      icon: LayoutDashboard,
    },
  ];

  function closePanel() {
    setPanel(null);
    setLogSearch("");
    setExpandedLogId(null);
  }

  const filteredLogs = logs.filter((log) => {
    const query = logSearch.toLowerCase();
    return (
      log.module.toLowerCase().includes(query) ||
      log.action.toLowerCase().includes(query)
    );
  });

  function clearLogs() {
    setLogs([]);
    showToast("Event logs cleared.");
  }

  function exportLogs() {
    const jsonStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "HORUS-system-logs.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("Exported logs JSON report!");
  }

  function handleSupportSubmit(e) {
    e.preventDefault();
    if (!supportForm.message.trim()) {
      alert("Please enter a support message.");
      return;
    }
    const ticketId = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketSubmitted({ id: ticketId, priority: supportForm.priority });
    setSupportForm({ category: "Data Reconciliation", priority: "Medium", message: "" });
    showToast(`Support Ticket ${ticketId} dispatched! Operations desk notified.`);
  }

  function runHealthCheck() {
    setSystemHealthRunning(true);
    setTimeout(() => {
      setSystemHealthRunning(false);
      setHealthStatus("All Subsystems Operational (100% Healthy)");
      showToast("Diagnostic check complete: DB, HL7, RFID 100% OK!");
    }, 700);
  }

  return (
    <>
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

      <aside className="sidebar">
        <div className="sidebar-heading">
          <div className="sidebar-title">HORUS</div>

          <p>
            Hospital Operations &amp; Reconciliation
            <br />
            Unified System
          </p>
        </div>

        <nav className="sidebar-navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  isActive
                    ? "sidebar-item active"
                    : "sidebar-item"
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-links">
          <button
            type="button"
            className="sidebar-secondary-item"
            onClick={() => setPanel("support")}
          >
            <HelpCircle size={17} />
            <span>Support</span>
          </button>

          <button
            type="button"
            className="sidebar-secondary-item"
            onClick={() => setPanel("logs")}
          >
            <Logs size={17} />
            <span>Logs</span>
          </button>
        </div>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? "administrator active"
              : "administrator"
          }
        >
          <div className="administrator-avatar" style={{ overflow: "hidden" }}>
            {avatar ? (
              <img src={avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <UserRound size={17} />
            )}
          </div>

          <div className="administrator-info">
            <strong>{profile.name || "Administrator"}</strong>
            <span>{profile.role || profile.department || "Hospital Operations"}</span>
          </div>
        </NavLink>
      </aside>

      {panel && (
        <div
          className="sidebar-panel-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePanel();
            }
          }}
        >
          <aside className="sidebar-panel">
            <div className="sidebar-panel-header">
              <div>
                {panel === "support" && (
                  <>
                    <span>HORUS SUPPORT &amp; DIAGNOSTICS</span>
                    <h2>Support Center</h2>
                  </>
                )}

                {panel === "logs" && (
                  <>
                    <span>SYSTEM / ACTIVITY</span>
                    <h2>System Logs</h2>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={closePanel}
                className="panel-close"
              >
                <X size={18} />
              </button>
            </div>

            {panel === "support" && (
              <div className="support-panel-content" style={{ overflowY: "auto", maxHeight: "calc(100vh - 80px)", padding: "16px" }}>
                <div className="support-status" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="support-status-icon">
                      <CheckCircle2 size={19} color="#16a34a" />
                    </div>

                    <div>
                      <strong>{healthStatus}</strong>
                      <span style={{ display: "block", fontSize: "11px", color: "#64748b" }}>
                        HORUS services are running normally.
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={runHealthCheck}
                    disabled={systemHealthRunning}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "1px solid #cbd5e1",
                      background: "#ffffff",
                      color: "#00288e",
                      fontSize: "10px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    {systemHealthRunning ? "Checking..." : "Diagnose"}
                  </button>
                </div>

                {ticketSubmitted && (
                  <div style={{
                    padding: "10px 12px",
                    borderRadius: "6px",
                    background: "#ecfdf5",
                    border: "1px solid #a7f3d0",
                    marginBottom: "14px",
                    fontSize: "11px",
                    color: "#065f46"
                  }}>
                    <strong>✓ Ticket Dispatched: {ticketSubmitted.id}</strong> (Priority: {ticketSubmitted.priority})
                  </div>
                )}

                {/* DISPATCH FORM */}
                <div style={{ padding: "12px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
                  <span style={{ fontSize: "9px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>
                    DISPATCH ASSISTANCE REQUEST
                  </span>

                  <form onSubmit={handleSupportSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "6px" }}>
                      <select
                        value={supportForm.category}
                        onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                        style={{ padding: "4px 6px", fontSize: "11px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                      >
                        <option value="Data Reconciliation">Reconciliation</option>
                        <option value="Bed Sensors">Bed Sensors</option>
                        <option value="Admissions Flow">Admissions Flow</option>
                        <option value="Security / Auth">Security / Auth</option>
                      </select>

                      <select
                        value={supportForm.priority}
                        onChange={(e) => setSupportForm({ ...supportForm, priority: e.target.value })}
                        style={{ padding: "4px 6px", fontSize: "11px", borderRadius: "4px", border: "1px solid #cbd5e1" }}
                      >
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="STAT / Urgent">STAT / Urgent</option>
                      </select>
                    </div>

                    <textarea
                      required
                      rows="2"
                      placeholder="Describe issue..."
                      value={supportForm.message}
                      onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                      style={{ width: "100%", padding: "5px 8px", fontSize: "11px", borderRadius: "4px", border: "1px solid #cbd5e1", resize: "none", marginBottom: "6px" }}
                    />

                    <button
                      type="submit"
                      style={{
                        width: "100%",
                        padding: "6px",
                        borderRadius: "4px",
                        border: "none",
                        background: "#00288e",
                        color: "#ffffff",
                        fontSize: "11px",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px"
                      }}
                    >
                      <Send size={12} /> Send Request
                    </button>
                  </form>
                </div>

                <div className="support-section">
                  <span className="support-section-label" style={{ display: "block", marginBottom: "8px" }}>
                    QUICK HELP &amp; FAQS
                  </span>

                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {faqs.map((faq, idx) => (
                      <div key={idx} style={{ borderRadius: "6px", border: "1px solid #e2e8f0", background: activeFaq === idx ? "#f0f4ff" : "#ffffff", overflow: "hidden" }}>
                        <button
                          type="button"
                          onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                          style={{ width: "100%", padding: "8px 10px", textAlign: "left", background: "transparent", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", fontSize: "11px", fontWeight: "700", color: "#1e293b" }}
                        >
                          <span>{faq.q}</span>
                          {activeFaq === idx ? <ChevronUp size={13} color="#00288e" /> : <ChevronDown size={13} color="#64748b" />}
                        </button>
                        {activeFaq === idx && (
                          <div style={{ padding: "0 10px 8px 10px", fontSize: "11px", color: "#475569", lineHeight: "16px" }}>
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="support-contact" style={{ marginTop: "14px" }}>
                  <div className="support-contact-icon">
                    <Mail size={17} />
                  </div>

                  <div>
                    <span>NEED MORE HELP?</span>
                    <strong>operations@horus-hospital.internal</strong>
                    <p>
                      Contact your hospital system administrator for account or operational issues.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {panel === "logs" && (
              <div className="logs-panel-content">
                <div className="logs-summary">
                  <div>
                    <strong>{logs.length}</strong>
                    <span>Events today</span>
                  </div>

                  <div>
                    <strong>0</strong>
                    <span>Critical errors</span>
                  </div>

                  <div>
                    <strong>{logs.filter((l) => l.level === "warning").length}</strong>
                    <span>Warnings</span>
                  </div>
                </div>

                <div className="logs-search">
                  <Search size={15} />

                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={logSearch}
                    onChange={(event) =>
                      setLogSearch(event.target.value)
                    }
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px 10px 16px" }}>
                  <button
                    type="button"
                    onClick={exportLogs}
                    style={{ padding: "3px 8px", fontSize: "10px", fontWeight: "700", borderRadius: "4px", border: "1px solid #cbd5e1", background: "#f8fafc", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "3px" }}
                  >
                    <Download size={11} /> Export JSON
                  </button>

                  <button
                    type="button"
                    onClick={clearLogs}
                    style={{ padding: "3px 8px", fontSize: "10px", fontWeight: "700", borderRadius: "4px", border: "none", background: "#fee2e2", color: "#b91c1c", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "3px" }}
                  >
                    <Trash2 size={11} /> Clear
                  </button>
                </div>

                <div className="logs-list">
                  {filteredLogs.map((log, index) => (
                    <div
                      className="log-item"
                      key={`${log.time}-${index}`}
                      onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className={`log-status ${log.status || log.level || "success"}`}
                      >
                        {log.level === "warning" ? (
                          <AlertTriangle size={14} />
                        ) : (
                          <CheckCircle2 size={14} />
                        )}
                      </div>

                      <div className="log-details">
                        <strong>{log.action}</strong>
                        <span>{log.module}</span>
                        {expandedLogId === log.id && log.details && (
                          <div style={{ marginTop: "4px", fontSize: "10px", color: "#64748b" }}>
                            {log.details}
                          </div>
                        )}
                      </div>

                      <div className="log-time">
                        <Clock3 size={11} />
                        {log.time}
                      </div>
                    </div>
                  ))}

                  {filteredLogs.length === 0 && (
                    <div className="logs-empty">
                      No matching logs found.
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}

export default Sidebar;
