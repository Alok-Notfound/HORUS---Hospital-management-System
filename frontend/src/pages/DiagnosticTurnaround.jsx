import { useState, useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  Beaker,
  CheckCircle2,
  Clock3,
  Download,
  RefreshCw,
  Search,
  Truck,
  Plus,
  X
} from "lucide-react";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

import "../styles/layout.css";
import "../styles/diagnostic-turnaround.css";

const metrics = [
  {
    title: "Avg Lab TAT",
    value: "2.1",
    unit: "hrs",
    change: "0.4h",
    detail: "vs Target: 2.5 hrs",
    icon: Beaker,
    type: "good",
  },
  {
    title: "Imaging TAT",
    value: "3.4",
    unit: "hrs",
    change: "0.6h",
    detail: "vs Target: 4.0 hrs",
    icon: Activity,
    type: "good",
  },
  {
    title: "Critical Result Alerts",
    value: "3",
    unit: "",
    change: "Active",
    detail: "Avg Response: 12m",
    icon: AlertTriangle,
    type: "alert",
  },
  {
    title: "SLA Compliance",
    value: "94.2",
    unit: "%",
    change: "",
    detail: "Target: 95%",
    icon: CheckCircle2,
    type: "compliance",
  },
];

const heatmap = [
  {
    department: "ER",
    values: [
      { value: "0.8", level: "low" },
      { value: "2.5", level: "medium" },
      { value: "4.2", level: "high" },
      { value: "0.5", level: "low" },
    ],
  },
  {
    department: "ICU",
    values: [
      { value: "1.1", level: "low" },
      { value: "-", level: "empty" },
      { value: "2.8", level: "medium" },
      { value: "0.9", level: "low" },
    ],
  },
  {
    department: "Oncol",
    values: [
      { value: "2.1", level: "medium" },
      { value: "5.1", level: "critical" },
      { value: "3.0", level: "medium" },
      { value: "1.2", level: "low" },
    ],
  },
  {
    department: "Cardio",
    values: [
      { value: "1.5", level: "low" },
      { value: "3.2", level: "medium" },
      { value: "2.5", level: "medium" },
      { value: "1.0", level: "low" },
    ],
  },
];

const initialDiagnostics = [
  {
    id: "PT-88392",
    test: "CT Head w/o Contrast",
    department: "ER",
    status: "Processing",
    statusType: "processing",
    sla: "-14 min",
    slaType: "breached",
  },
  {
    id: "PT-10495",
    test: "MRI Spine",
    department: "Oncology",
    status: "Reporting",
    statusType: "reporting",
    sla: "12 min left",
    slaType: "normal",
  },
  {
    id: "PT-77210",
    test: "CBC Auto Diff",
    department: "ICU",
    status: "Transport",
    statusType: "transport",
    sla: "1h 45m left",
    slaType: "normal",
  },
  {
    id: "PT-55921",
    test: "Chest X-Ray",
    department: "Cardiology",
    status: "Processing",
    statusType: "processing",
    sla: "45 min left",
    slaType: "normal",
  },
  {
    id: "PT-33019",
    test: "Comprehensive Metabolic Panel",
    department: "ER",
    status: "Analyzing",
    statusType: "analyzing",
    sla: "AI Expedited • Est: 15m",
    slaType: "ai",
  },
  {
    id: "PT-44821",
    test: "Troponin-I STAT",
    department: "ER",
    status: "Analyzing",
    statusType: "analyzing",
    sla: "8 min left",
    slaType: "normal",
  },
  {
    id: "PT-19832",
    test: "Arterial Blood Gas (ABG)",
    department: "ICU",
    status: "Processing",
    statusType: "processing",
    sla: "5 min left",
    slaType: "normal",
  },
  {
    id: "PT-62914",
    test: "CT Angiography Chest",
    department: "Cardiology",
    status: "Reporting",
    statusType: "reporting",
    sla: "25 min left",
    slaType: "normal",
  }
];

function StatusIcon({ type }) {
  if (type === "transport") {
    return <Truck size={13} />;
  }
  if (type === "reporting") {
    return <Clock3 size={13} />;
  }
  if (type === "analyzing") {
    return <Activity size={13} />;
  }
  return <Clock3 size={13} />;
}

function DiagnosticTurnaround() {
  const [diagnostics, setDiagnostics] = useState(() => {
    try {
      const saved = localStorage.getItem("horus-custom-diagnostics");
      if (saved) return [...JSON.parse(saved), ...initialDiagnostics];
    } catch {
      // ignore
    }
    return initialDiagnostics;
  });

  const [search, setSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [queuePage, setQueuePage] = useState(1);
  const pageSize = 5;

  const [form, setForm] = useState({
    id: "",
    test: "",
    department: "ER",
    status: "Processing",
    sla: "30 min left"
  });

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  }

  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast("Diagnostic telemetry & queue refreshed successfully!");
    }, 600);
  }

  function openAddModal() {
    const randomId = Math.floor(10000 + Math.random() * 90000);
    setForm({
      id: `PT-${randomId}`,
      test: "",
      department: "ER",
      status: "Processing",
      sla: "30 min left"
    });
    setModalOpen(true);
  }

  function handleAddTestSubmit(e) {
    e.preventDefault();
    if (!form.test.trim()) {
      alert("Please enter the test type.");
      return;
    }

    const statusTypeMap = {
      Processing: "processing",
      Reporting: "reporting",
      Transport: "transport",
      Analyzing: "analyzing"
    };

    const newTest = {
      id: form.id.trim() || `PT-${Math.floor(10000 + Math.random() * 90000)}`,
      test: form.test.trim(),
      department: form.department,
      status: form.status,
      statusType: statusTypeMap[form.status] || "processing",
      sla: form.sla.trim() || "30 min left",
      slaType: form.sla.toLowerCase().includes("stat") || form.sla.toLowerCase().includes("ai") ? "ai" : "normal"
    };

    const updated = [newTest, ...diagnostics];
    setDiagnostics(updated);

    try {
      const saved = localStorage.getItem("horus-custom-diagnostics");
      const customList = saved ? JSON.parse(saved) : [];
      localStorage.setItem("horus-custom-diagnostics", JSON.stringify([newTest, ...customList]));
    } catch {
      // ignore
    }

    setModalOpen(false);
    showToast(`Added ${newTest.test} for ${newTest.id} to queue!`);
  }

  const filteredDiagnostics = useMemo(() => {
    return diagnostics.filter((item) => {
      const q = search.toLowerCase();
      return (
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.test.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q)
      );
    });
  }, [diagnostics, search]);

  const totalPages = Math.ceil(filteredDiagnostics.length / pageSize) || 1;
  const paginatedQueue = useMemo(() => {
    const start = (queuePage - 1) * pageSize;
    return filteredDiagnostics.slice(start, start + pageSize);
  }, [filteredDiagnostics, queuePage, pageSize]);

  return (
    <div className="app-shell">
      <Header />

      <div className="app-body">
        <Sidebar />

        <main className="dashboard-content diagnostic-page">
          {toastMsg && (
            <div style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              zIndex: 9999,
              background: "#0f172a",
              color: "#ffffff",
              padding: "10px 18px",
              borderRadius: "8px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
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

          <section className="diagnostic-heading">
            <div>
              <span>CLINICAL / DIAGNOSTICS</span>
              <h1>Diagnostic Turnaround</h1>
            </div>

            <div className="diagnostic-actions">
              <button
                type="button"
                onClick={handleRefresh}
                style={{
                  height: "34px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "0 14px",
                  borderRadius: "5px",
                  border: "1px solid #c4c5d5",
                  background: "#ffffff",
                  color: "#191c1e",
                  fontSize: "10px",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                <RefreshCw
                  size={13}
                  style={{
                    transition: "transform 0.5s ease",
                    transform: isRefreshing ? "rotate(360deg)" : "none"
                  }}
                />
                Refresh
              </button>
            </div>
          </section>

          <section className="diagnostic-metrics">
            {metrics.map((metric) => {
              const Icon = metric.icon;

              return (
                <article className="diagnostic-metric" key={metric.title}>
                  <div className="diagnostic-metric-top">
                    <span>{metric.title}</span>

                    <div className={`diagnostic-icon ${metric.type}`}>
                      <Icon size={18} />
                    </div>
                  </div>

                  <div className="diagnostic-value">
                    <strong>{metric.value}</strong>
                    {metric.unit && <span>{metric.unit}</span>}
                  </div>

                  {metric.type === "compliance" ? (
                    <>
                      <div className="sla-progress">
                        <div style={{ width: "94.2%" }} />
                      </div>

                      <div className="metric-target">
                        {metric.detail}
                      </div>
                    </>
                  ) : (
                    <div className="metric-detail">
                      <span
                        className={
                          metric.type === "alert"
                            ? "metric-alert"
                            : "metric-good"
                        }
                      >
                        {metric.change}
                      </span>

                      <span>{metric.detail}</span>
                    </div>
                  )}
                </article>
              );
            })}
          </section>

          <section className="diagnostic-content-grid">
            <div className="diagnostic-left">
              <article className="diagnostic-card heatmap-card">
                <div className="diagnostic-card-header">
                  <div>
                    <div className="card-title-row">
                      <Activity size={17} />
                      <h2>Bottleneck Heatmap</h2>
                    </div>

                    <p>
                      Avg TAT by Dept &amp; Test Type (Hours)
                    </p>
                  </div>

                  <button type="button" className="more-button">
                    •••
                  </button>
                </div>

                <div className="heatmap">
                  <div className="heatmap-row heatmap-heading">
                    <span>Dept</span>
                    <span>CBC</span>
                    <span>MRI</span>
                    <span>CT</span>
                    <span>X-Ray</span>
                  </div>

                  {heatmap.map((row) => (
                    <div className="heatmap-row" key={row.department}>
                      <strong>{row.department}</strong>

                      {row.values.map((cell, index) => (
                        <span
                          className={`heat-cell ${cell.level}`}
                          key={`${row.department}-${index}`}
                        >
                          {cell.value}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </article>

              <article className="diagnostic-card trend-card">
                <div className="diagnostic-card-header">
                  <div>
                    <div className="card-title-row">
                      <Activity size={17} />
                      <h2>24h TAT Trends</h2>
                    </div>
                  </div>

                  <select defaultValue="all">
                    <option value="all">All Depts</option>
                    <option value="er">ER</option>
                  </select>
                </div>

                <div className="trend-chart">
                  <span className="trend-label top">6h</span>
                  <span className="trend-label middle">3h</span>
                  <span className="trend-label bottom">0h</span>

                  <div className="trend-line line-one" />
                  <div className="trend-line line-two" />
                  <div className="trend-line line-three" />

                  <div className="trend-bars">
                    <span style={{ height: "30%" }} />
                    <span style={{ height: "45%" }} />
                    <span style={{ height: "35%" }} />
                    <span style={{ height: "60%" }} />
                    <span className="trend-alert-bar" style={{ height: "80%" }} />
                    <span style={{ height: "50%" }} />
                    <span style={{ height: "40%" }} />
                    <span style={{ height: "25%" }} />
                  </div>

                  <div className="trend-times">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>Now</span>
                  </div>
                </div>
              </article>
            </div>

            <article className="diagnostic-card queue-card">
              <div className="diagnostic-card-header" style={{ flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div className="card-title-row">
                    <Activity size={17} />
                    <h2>Live Diagnostics Queue</h2>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={openAddModal}
                    style={{
                      height: "30px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "0 10px",
                      borderRadius: "5px",
                      border: "none",
                      background: "#00288e",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    <Plus size={13} />
                    Add Diagnostic
                  </button>

                  <div className="queue-search">
                    <Search size={14} />
                    <input
                      placeholder="Search Patient ID, Test..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setQueuePage(1);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="queue-table-wrapper">
                <table className="queue-table">
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Test Type</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>SLA Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedQueue.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ padding: "30px", textAlign: "center", color: "#757684" }}>
                          No diagnostic tests match your search.
                        </td>
                      </tr>
                    ) : (
                      paginatedQueue.map((item, idx) => (
                        <tr
                          key={`${item.id}-${idx}`}
                          className={
                            item.slaType === "breached"
                              ? "queue-critical"
                              : ""
                          }
                        >
                          <td>
                            <div className="patient-id">
                              <span />
                              <strong>{item.id}</strong>
                            </div>
                          </td>

                          <td>{item.test}</td>

                          <td>{item.department}</td>

                          <td>
                            <span className={`queue-status ${item.statusType}`}>
                              <StatusIcon type={item.statusType} />
                              {item.status}
                            </span>
                          </td>

                          <td>
                            <span className={`sla-status ${item.slaType}`}>
                              {item.sla}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="queue-footer">
                <span>
                  Showing {Math.min((queuePage - 1) * pageSize + 1, filteredDiagnostics.length)} – {Math.min(queuePage * pageSize, filteredDiagnostics.length)} of {filteredDiagnostics.length} active diagnostics
                </span>

                <div>
                  <button
                    type="button"
                    disabled={queuePage === 1}
                    onClick={() => setQueuePage((p) => Math.max(1, p - 1))}
                    style={{ cursor: queuePage === 1 ? "not-allowed" : "pointer" }}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    disabled={queuePage >= totalPages}
                    onClick={() => setQueuePage((p) => Math.min(totalPages, p + 1))}
                    style={{ cursor: queuePage >= totalPages ? "not-allowed" : "pointer" }}
                  >
                    ›
                  </button>
                </div>
              </div>
            </article>
          </section>

          {/* ADD DIAGNOSTIC TEST MODAL */}
          {modalOpen && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(15, 23, 42, 0.6)",
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
                  maxWidth: "480px",
                  background: "#ffffff",
                  borderRadius: "10px",
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)",
                  overflow: "hidden"
                }}
              >
                <div style={{
                  padding: "15px 20px",
                  borderBottom: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <span style={{ fontSize: "8px", fontWeight: "700", letterSpacing: "0.06em", color: "#757684", textTransform: "uppercase", display: "block", marginBottom: "2px" }}>
                      LABORATORY & IMAGING ORDER
                    </span>
                    <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                      Add New Diagnostic Test
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleAddTestSubmit} style={{ padding: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                        Patient ID *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PT-94821"
                        value={form.id}
                        onChange={(e) => setForm({ ...form, id: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px"
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                        Ordering Department
                      </label>
                      <select
                        value={form.department}
                        onChange={(e) => setForm({ ...form, department: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px",
                          background: "#ffffff"
                        }}
                      >
                        <option value="ER">ER</option>
                        <option value="ICU">ICU</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Oncology">Oncology</option>
                        <option value="Surgery">Surgery</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                      Diagnostic Test / Panel *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Troponin-I STAT / CT Chest"
                      value={form.test}
                      onChange={(e) => setForm({ ...form, test: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "12px"
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                        Initial Status
                      </label>
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px",
                          background: "#ffffff"
                        }}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Analyzing">Analyzing</option>
                        <option value="Reporting">Reporting</option>
                        <option value="Transport">Transport</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                        SLA Target / Priority
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 30 min left"
                        value={form.sla}
                        onChange={(e) => setForm({ ...form, sla: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        background: "#ffffff",
                        color: "#475569",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      style={{
                        padding: "8px 18px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#00288e",
                        color: "#ffffff",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer"
                      }}
                    >
                      Dispatch Test
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default DiagnosticTurnaround;
