import { useState, useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BedDouble,
  CheckCircle2,
  Clock3,
  Download,
  Flame,
  Gauge,
  HeartPulse,
  LayoutDashboard,
  Layers,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import AiInsightPanel from "../components/dashboard/AiInsightPanel";

import "../styles/layout.css";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [isSweeping, setIsSweeping] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [fastAdmitOpen, setFastAdmitOpen] = useState(false);

  // Fast Admit Form
  const [admitForm, setAdmitForm] = useState({
    patient: "",
    ward: "Emergency Ward 1",
    department: "Emergency Trauma",
    type: "Emergency",
    disease: "Trauma Stabilization"
  });

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  }

  function handleInstantSweep() {
    setIsSweeping(true);
    setTimeout(() => {
      setIsSweeping(false);
      showToast("Hospital-wide RFID telemetry sweep complete: All 27 wards verified!");
    }, 800);
  }

  function handleFastAdmitSubmit(e) {
    e.preventDefault();
    if (!admitForm.patient.trim()) {
      alert("Please enter patient name.");
      return;
    }

    const newRecord = {
      id: `ADM-${Math.floor(10000 + Math.random() * 90000)}`,
      raw_id: Date.now(),
      patient: admitForm.patient.trim(),
      patient_id: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().slice(0, 10),
      discharge_date: "In Hospital",
      type: admitForm.type,
      status: "Admitted",
      department: admitForm.department,
      ward: admitForm.ward,
      bed: `BED-${Math.floor(1 + Math.random() * 415)}`,
      disease: admitForm.disease
    };

    try {
      const saved = localStorage.getItem("horus-custom-admissions");
      const list = saved ? JSON.parse(saved) : [];
      localStorage.setItem("horus-custom-admissions", JSON.stringify([newRecord, ...list]));
    } catch {
      // ignore
    }

    setFastAdmitOpen(false);
    showToast(`Admitted ${newRecord.patient} to ${newRecord.ward} (${newRecord.bed})!`);
  }

  const executiveKpis = [
    {
      title: "HOSPITAL OCCUPANCY",
      value: "88.4%",
      detail: "221 / 250 Total Beds",
      badge: "HIGH OCCUPANCY",
      icon: BedDouble,
      link: "/bed-capacity"
    },
    {
      title: "ACTIVE INPATIENTS",
      value: "2,005",
      detail: "Across 4,678 Records",
      badge: "LIVE EHR SYNC",
      icon: Users,
      link: "/patient-flow"
    },
    {
      title: "NET PATIENT VELOCITY",
      value: "+5",
      detail: "14 In · 9 Out (24h)",
      badge: "NET POSITIVE",
      icon: Gauge,
      link: "/patient-flow"
    },
    {
      title: "AVG LAB STAT TAT",
      value: "2.1h",
      detail: "94.2% SLA Compliance",
      badge: "ON TARGET",
      icon: HeartPulse,
      link: "/diagnostic-turnaround"
    },
    {
      title: "GHOST BED ACCURACY",
      value: "98.2%",
      detail: "160 Beds Telemetry Active",
      badge: "RECONCILED",
      icon: ShieldCheck,
      link: "/ghost-bed-auditor"
    },
    {
      title: "PHARMACY FORMULARY",
      value: "400",
      detail: "280 In Stock · 120 Low",
      badge: "SAFETY BUFFER",
      icon: Layers,
      link: "/discrepancy-ledger"
    }
  ];

  const departmentOverview = [
    { name: "Emergency Trauma", occupied: 38, capacity: 40, percentage: 95, status: "Critical Surge", color: "#b91c1c" },
    { name: "Intensive Care Unit (ICU)", occupied: 56, capacity: 60, percentage: 93, status: "Near Capacity", color: "#dc2626" },
    { name: "General & Lap Surgery", occupied: 51, capacity: 60, percentage: 85, status: "Normal Flow", color: "#0284c7" },
    { name: "Internal Medicine", occupied: 113, capacity: 148, percentage: 76, status: "Stable", color: "#16a34a" },
    { name: "Cardiology CCU", occupied: 44, capacity: 48, percentage: 92, status: "High Demand", color: "#d97706" },
    { name: "Pediatrics & Neonatal", occupied: 29, capacity: 38, percentage: 76, status: "Stable", color: "#16a34a" }
  ];

  const recentAlerts = [
    { time: "11:12 AM", level: "critical", text: "ICU step-down recommendation triggered for 2 stabilized patients." },
    { time: "11:05 AM", level: "warning", text: "Ward 4B pressure sensor detected 3 ghost bed discrepancies." },
    { time: "10:48 AM", level: "info", text: "STAT Troponin test completed in 42 mins (within SLA target)." },
    { time: "10:30 AM", level: "success", text: "Dr. Alok Nath scheduled 12 cardiology consultation appointments." }
  ];

  return (
    <div className="app-shell">
      <Header />

      <div className="app-body">
        <Sidebar />

        <main className="dashboard-content">
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

          {/* WORKSPACE HEADER */}
          <div className="workspace-header" style={{ flexWrap: "wrap", gap: "12px", marginBottom: "16px" }}>
            <div>
              <span className="workspace-kicker">
                COMMAND CENTER / EXECUTIVE DASHBOARD
              </span>
              <h1>Hospital Operations Command Center</h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setFastAdmitOpen(true)}
                style={{
                  height: "36px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "0 14px",
                  borderRadius: "6px",
                  border: "none",
                  background: "#00288e",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 40, 142, 0.2)"
                }}
              >
                <Plus size={14} />
                Fast Admit
              </button>

              <button
                type="button"
                onClick={handleInstantSweep}
                disabled={isSweeping}
                style={{
                  height: "36px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "0 14px",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#1e293b",
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: isSweeping ? "not-allowed" : "pointer"
                }}
              >
                <RefreshCw size={13} style={{ transition: "transform 0.5s", transform: isSweeping ? "rotate(360deg)" : "none" }} />
                {isSweeping ? "Auditing Sensors..." : "Audit Sweep"}
              </button>

              <div className="workspace-meta">
                <span>SYSTEM STATUS</span>
                <strong>All 6 Subsystems Live</strong>
              </div>
            </div>
          </div>

          {/* 6 EXECUTIVE KPI METRICS */}
          <section style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "12px",
            marginBottom: "18px"
          }}>
            {executiveKpis.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={idx}
                  onClick={() => navigate(kpi.link)}
                  style={{
                    padding: "14px 16px",
                    background: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.06em", color: "#64748b", textTransform: "uppercase" }}>
                      {kpi.title}
                    </span>
                    <Icon size={16} color="#00288e" />
                  </div>

                  <strong style={{ fontSize: "24px", color: "#0f172a", display: "block", marginBottom: "2px", fontWeight: "700" }}>
                    {kpi.value}
                  </strong>

                  <div style={{ fontSize: "11px", color: "#475569", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {kpi.detail}
                  </div>
                </div>
              );
            })}
          </section>

          {/* SOLID AI INTELLIGENCE CENTER */}
          <AiInsightPanel />

          {/* MAIN 2-COLUMN DASHBOARD GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "18px", marginTop: "18px" }}>
            {/* LEFT: DEPARTMENT OCCUPANCY & CAPACITY BREAKDOWN */}
            <div style={{
              background: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div>
                  <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.06em", color: "#64748b", textTransform: "uppercase", display: "block" }}>
                    CAPACITY UTILIZATION
                  </span>
                  <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "2px 0 0 0" }}>
                    Clinical Department Bed Load
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/bed-capacity")}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "5px",
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    color: "#00288e",
                    fontSize: "11px",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  View Full Bed Truth ➔
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {departmentOverview.map((dept, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <strong style={{ fontSize: "13px", color: "#1e293b" }}>{dept.name}</strong>
                        <span style={{
                          fontSize: "9px",
                          fontWeight: "700",
                          padding: "1px 6px",
                          borderRadius: "3px",
                          background: dept.percentage >= 90 ? "#fee2e2" : dept.percentage >= 80 ? "#fef3c7" : "#ecfdf5",
                          color: dept.percentage >= 90 ? "#b91c1c" : dept.percentage >= 80 ? "#b45309" : "#166534"
                        }}>
                          {dept.status}
                        </span>
                      </div>

                      <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>
                        {dept.occupied} / {dept.capacity} beds ({dept.percentage}%)
                      </span>
                    </div>

                    <div style={{ height: "7px", background: "#f1f5f9", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ width: `${dept.percentage}%`, height: "100%", background: dept.color, borderRadius: "999px", transition: "width 0.5s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: REAL-TIME CLINICAL ACTIVITY & QUICK LAUNCHERS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* REAL-TIME OPERATIONS FEED */}
              <div style={{
                background: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                padding: "20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                flex: 1
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <div>
                    <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.06em", color: "#64748b", textTransform: "uppercase", display: "block" }}>
                      REAL-TIME AUDIT STREAM
                    </span>
                    <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "2px 0 0 0" }}>
                      Clinical Action Telemetry
                    </h2>
                  </div>

                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {recentAlerts.map((alert, idx) => (
                    <div key={idx} style={{
                      padding: "10px",
                      borderRadius: "6px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start"
                    }}>
                      <span style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", whiteSpace: "nowrap", marginTop: "2px" }}>
                        {alert.time}
                      </span>
                      <p style={{ margin: 0, fontSize: "12px", color: "#334155", lineHeight: "17px" }}>
                        {alert.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* QUICK ACCESS HUB */}
              <div style={{
                background: "#00288e",
                color: "#ffffff",
                borderRadius: "8px",
                padding: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}>
                <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.07em", textTransform: "uppercase", opacity: 0.8 }}>
                  OPERATIONS LAUNCHER
                </span>
                <strong style={{ fontSize: "15px" }}>Zero-Loss Reconciliation Hub</strong>
                <p style={{ fontSize: "11px", opacity: 0.85, margin: "0 0 4px 0", lineHeight: "16px" }}>
                  Reconcile patient admissions, inspect ghost beds, and audit pharmacy stock across 4,678 live hospital records.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => navigate("/patient-flow")}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "5px",
                      border: "none",
                      background: "rgba(255,255,255,0.15)",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: "700",
                      cursor: "pointer",
                      textAlign: "center"
                    }}
                  >
                    Patient Flow ➔
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/ghost-bed-auditor")}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "5px",
                      border: "none",
                      background: "rgba(255,255,255,0.15)",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: "700",
                      cursor: "pointer",
                      textAlign: "center"
                    }}
                  >
                    Ghost Beds ➔
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* FAST ADMIT MODAL */}
          {fastAdmitOpen && (
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
                if (e.target === e.currentTarget) setFastAdmitOpen(false);
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
                  padding: "16px 20px",
                  borderBottom: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.06em", color: "#757684", textTransform: "uppercase", display: "block", marginBottom: "2px" }}>
                      EMERGENCY ADMISSION DISPATCH
                    </span>
                    <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                      Fast Patient Admission
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFastAdmitOpen(false)}
                    style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: "4px" }}
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleFastAdmitSubmit} style={{ padding: "20px" }}>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Mahindra"
                      value={admitForm.patient}
                      onChange={(e) => setAdmitForm({ ...admitForm, patient: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "12px"
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                        Department
                      </label>
                      <select
                        value={admitForm.department}
                        onChange={(e) => setAdmitForm({ ...admitForm, department: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px",
                          background: "#ffffff"
                        }}
                      >
                        <option value="Emergency Trauma">Emergency Trauma</option>
                        <option value="Intensive Care Units (ICU)">ICU Critical Care</option>
                        <option value="Internal Medicine">Internal Medicine</option>
                        <option value="Cardiology CCU & Step-Down">Cardiology CCU</option>
                        <option value="General & Lap Surgery">General Surgery</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                        Ward Destination
                      </label>
                      <select
                        value={admitForm.ward}
                        onChange={(e) => setAdmitForm({ ...admitForm, ward: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px",
                          background: "#ffffff"
                        }}
                      >
                        <option value="Emergency Ward 1">Emergency Ward 1</option>
                        <option value="Emergency Ward 2">Emergency Ward 2</option>
                        <option value="ICU-A (Critical Care)">ICU-A</option>
                        <option value="Med-Surg 1 (Internal Medicine)">Med-Surg 1</option>
                        <option value="Cardiology Step-Down (Ward 2C)">Cardiology 2C</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                      Chief Complaint / Diagnosis
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acute Trauma / Chest Pain"
                      value={admitForm.disease}
                      onChange={(e) => setAdmitForm({ ...admitForm, disease: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        fontSize: "12px"
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
                    <button
                      type="button"
                      onClick={() => setFastAdmitOpen(false)}
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
                      Admit Patient
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

export default Dashboard;
