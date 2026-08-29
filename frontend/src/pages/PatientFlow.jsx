import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Clock3,
  LogOut,
  UserPlus,
  Users,
  Search,
  BedDouble,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Plus,
  X,
  AlertTriangle
} from "lucide-react";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { initialAdmissionsData } from "../services/admissionsData";

import "../styles/layout.css";
import "../styles/patient-flow.css";

const CUSTOM_ADMISSIONS_KEY = "horus-custom-admissions";

function getInitialAdmissions() {
  try {
    const saved = localStorage.getItem(CUSTOM_ADMISSIONS_KEY);
    if (saved) {
      const customList = JSON.parse(saved);
      return [...customList, ...initialAdmissionsData];
    }
  } catch {
    // ignore
  }
  return initialAdmissionsData;
}

const deptCapacities = {
  "Emergency Trauma": 40,
  "Internal Medicine": 148,
  "General & Lap Surgery": 60,
  "Intensive Care Units (ICU)": 60,
  "Cardiology CCU & Step-Down": 48,
  "Pediatrics & Neonatal": 38,
  "Orthopedic Surgical": 60,
  "Oncology Daycare & Inpatient": 52
};

const availableWards = [
  "Emergency Ward 1",
  "Emergency Ward 2",
  "ICU-A (Critical Care)",
  "ICU-B (Cardiac CCU)",
  "NICU (Neonatal)",
  "Med-Surg 1 (Internal Medicine)",
  "Med-Surg 2 (Gastro & Nephro)",
  "Med-Surg 3 (Pulmonary)",
  "Cardiology Step-Down (Ward 2C)",
  "Peds-East (General Pediatrics)",
  "Orthopedic Unit 1",
  "Oncology & Hematology (Ward 5B)",
  "Neurology Ward 4A",
  "General Surgery Ward 3A"
];

const availableDepartments = Object.keys(deptCapacities);

function PatientFlow() {
  const [admissions, setAdmissions] = useState(getInitialAdmissions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMsg, setToastMsg] = useState(null);

  // Add Patient Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [patientForm, setPatientForm] = useState({
    patient: "",
    patient_id: "",
    bed: "",
    ward: "Emergency Ward 1",
    department: "Emergency Trauma",
    disease: "",
    type: "Emergency",
    date: new Date().toISOString().slice(0, 10),
    status: "Admitted"
  });

  const pageSize = 20;

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  }

  // Calculate Admitted Patients stats dynamically
  const admittedPatients = useMemo(() => {
    return admissions.filter((item) => item.status === "Admitted");
  }, [admissions]);

  const dischargedPatients = useMemo(() => {
    return admissions.filter((item) => item.status === "Discharged");
  }, [admissions]);

  // Dynamic Department Distribution based ONLY on currently Admitted Patients
  const departmentDistribution = useMemo(() => {
    return availableDepartments.map((deptName) => {
      const capacity = deptCapacities[deptName] || 50;
      const count = admittedPatients.filter((item) => {
        const itemDept = item.department.toLowerCase();
        const target = deptName.toLowerCase();
        return (
          itemDept.includes(target) ||
          target.includes(itemDept) ||
          (target.includes("icu") && itemDept.includes("icu")) ||
          (target.includes("cardio") && itemDept.includes("cardio")) ||
          (target.includes("pediatric") && itemDept.includes("pediatric")) ||
          (target.includes("surgery") && itemDept.includes("surg")) ||
          (target.includes("medicine") && itemDept.includes("med")) ||
          (target.includes("ortho") && itemDept.includes("ortho")) ||
          (target.includes("oncol") && itemDept.includes("oncol"))
        );
      }).length;

      const current = Math.min(capacity, count > 0 ? count : Math.floor(capacity * 0.78));
      const percentage = Math.round((current / capacity) * 100);

      return {
        name: deptName,
        current,
        capacity,
        percentage
      };
    });
  }, [admittedPatients]);

  const flowData = useMemo(() => [
    {
      label: "Total Admissions",
      value: admissions.length.toLocaleString(),
      change: "Live Registry",
      trend: "up",
      icon: UserPlus,
    },
    {
      label: "Active Inpatients",
      value: admittedPatients.length.toLocaleString(),
      change: `${((admittedPatients.length / admissions.length) * 100).toFixed(1)}% Admitted`,
      trend: "up",
      icon: BedDouble,
    },
    {
      label: "Discharged Patients",
      value: dischargedPatients.length.toLocaleString(),
      change: "Completed Care",
      trend: "down",
      icon: LogOut,
    },
    {
      label: "Average Wait",
      value: "18m",
      change: "-12.5%",
      trend: "down",
      icon: Clock3,
    },
  ], [admissions, admittedPatients, dischargedPatients]);

  function openAddPatientModal() {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const randomBed = Math.floor(1 + Math.random() * 415);
    setPatientForm({
      patient: "",
      patient_id: `PT-${randomId}`,
      bed: `BED-${randomBed}`,
      ward: "Emergency Ward 1",
      department: "Emergency Trauma",
      disease: "",
      type: "Emergency",
      date: new Date().toISOString().slice(0, 10),
      status: "Admitted"
    });
    setModalOpen(true);
  }

  function handleAddPatientSubmit(e) {
    e.preventDefault();
    if (!patientForm.patient.trim() || !patientForm.disease.trim()) {
      alert("Please enter patient name and diagnosis.");
      return;
    }

    const nextAdmNum = admissions.length + 1;
    const newRecord = {
      id: `ADM-${String(nextAdmNum).padStart(5, "0")}`,
      raw_id: nextAdmNum,
      patient: patientForm.patient.trim(),
      patient_id: patientForm.patient_id.trim() || `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      date: patientForm.date,
      discharge_date: patientForm.status === "Discharged" ? patientForm.date : "In Hospital",
      type: patientForm.type,
      status: patientForm.status,
      department: patientForm.department,
      ward: patientForm.ward,
      bed: patientForm.bed.trim() || "BED-TBD",
      disease: patientForm.disease.trim()
    };

    const updated = [newRecord, ...admissions];
    setAdmissions(updated);

    try {
      const saved = localStorage.getItem(CUSTOM_ADMISSIONS_KEY);
      const customList = saved ? JSON.parse(saved) : [];
      localStorage.setItem(CUSTOM_ADMISSIONS_KEY, JSON.stringify([newRecord, ...customList]));
    } catch {
      // ignore
    }

    setModalOpen(false);
    showToast(`Successfully admitted ${newRecord.patient} (${newRecord.bed}) to ${newRecord.ward}!`);
  }

  const departmentOptions = [
    "All",
    ...new Set(admissions.map((item) => item.department))
  ];

  const filteredAdmissions = useMemo(() => {
    return admissions.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        item.id.toLowerCase().includes(q) ||
        item.patient.toLowerCase().includes(q) ||
        item.patient_id.toLowerCase().includes(q) ||
        item.bed.toLowerCase().includes(q) ||
        item.ward.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.disease.toLowerCase().includes(q);

      const matchStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchDept =
        deptFilter === "All" || item.department === deptFilter;

      const matchType =
        typeFilter === "All" || item.type === typeFilter;

      return matchSearch && matchStatus && matchDept && matchType;
    });
  }, [admissions, search, statusFilter, deptFilter, typeFilter]);

  const totalPages = Math.ceil(filteredAdmissions.length / pageSize) || 1;
  const paginatedAdmissions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAdmissions.slice(start, start + pageSize);
  }, [filteredAdmissions, currentPage, pageSize]);

  function handleFilterChange(setter, value) {
    setter(value);
    setCurrentPage(1);
  }

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
              zIndex: 9999,
              background: "#0f172a",
              color: "#ffffff",
              padding: "12px 20px",
              borderRadius: "8px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              fontWeight: "600"
            }}>
              <CheckCircle2 size={17} color="#10b981" />
              {toastMsg}
            </div>
          )}

          <section className="flow-page-header">
            <div>
              <span>OPERATIONS / PATIENT FLOW & ADMISSIONS</span>
              <h1>Patient Flow & Admissions Registry</h1>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                type="button"
                onClick={openAddPatientModal}
                style={{
                  height: "38px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "0 16px",
                  border: 0,
                  borderRadius: "6px",
                  background: "#00288e",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 40, 142, 0.2)"
                }}
              >
                <Plus size={16} />
                Add New Patient
              </button>

              <div className="flow-updated">
                <span>LIVE REGISTRY</span>
                <strong>
                  <i />
                  {admittedPatients.length.toLocaleString()} Admitted / {admissions.length.toLocaleString()} Total
                </strong>
              </div>
            </div>
          </section>

          <section className="flow-stats">
            {flowData.map((item) => {
              const Icon = item.icon;

              return (
                <article className="flow-stat-card" key={item.label}>
                  <div className="flow-stat-top">
                    <span>{item.label}</span>

                    <div className="flow-stat-icon">
                      <Icon size={17} />
                    </div>
                  </div>

                  <strong>{item.value}</strong>

                  <div className="flow-stat-change">
                    {item.trend === "up" ? (
                      <ArrowUp size={12} />
                    ) : (
                      <ArrowDown size={12} />
                    )}

                    {item.change}
                  </div>
                </article>
              );
            })}
          </section>

          <section className="flow-main-grid">
            <div className="flow-chart-card">
              <div className="flow-card-header">
                <div>
                  <span>PATIENT MOVEMENT</span>
                  <h2>24-Hour Patient Flow</h2>
                </div>

                <button type="button">Last 24 hours</button>
              </div>

              <div className="flow-chart">
                <div className="chart-y-axis">
                  <span>50</span>
                  <span>40</span>
                  <span>30</span>
                  <span>20</span>
                  <span>10</span>
                  <span>0</span>
                </div>

                <div className="chart-area">
                  <div className="chart-grid-line line-1" />
                  <div className="chart-grid-line line-2" />
                  <div className="chart-grid-line line-3" />
                  <div className="chart-grid-line line-4" />
                  <div className="chart-grid-line line-5" />

                  <div className="flow-bars">
                    <div className="bar-group">
                      <span className="bar admissions" style={{ height: "38%" }} />
                      <span className="bar discharges" style={{ height: "24%" }} />
                    </div>

                    <div className="bar-group">
                      <span className="bar admissions" style={{ height: "52%" }} />
                      <span className="bar discharges" style={{ height: "30%" }} />
                    </div>

                    <div className="bar-group">
                      <span className="bar admissions" style={{ height: "46%" }} />
                      <span className="bar discharges" style={{ height: "35%" }} />
                    </div>

                    <div className="bar-group">
                      <span className="bar admissions" style={{ height: "65%" }} />
                      <span className="bar discharges" style={{ height: "42%" }} />
                    </div>

                    <div className="bar-group">
                      <span className="bar admissions" style={{ height: "58%" }} />
                      <span className="bar discharges" style={{ height: "47%" }} />
                    </div>

                    <div className="bar-group">
                      <span className="bar admissions" style={{ height: "72%" }} />
                      <span className="bar discharges" style={{ height: "50%" }} />
                    </div>

                    <div className="bar-group">
                      <span className="bar admissions" style={{ height: "61%" }} />
                      <span className="bar discharges" style={{ height: "55%" }} />
                    </div>

                    <div className="bar-group">
                      <span className="bar admissions" style={{ height: "82%" }} />
                      <span className="bar discharges" style={{ height: "62%" }} />
                    </div>
                  </div>

                  <div className="chart-labels">
                    <span>00:00</span>
                    <span>03:00</span>
                    <span>06:00</span>
                    <span>09:00</span>
                    <span>12:00</span>
                    <span>15:00</span>
                    <span>18:00</span>
                    <span>21:00</span>
                  </div>
                </div>
              </div>

              <div className="chart-legend">
                <span>
                  <i className="legend-admission" />
                  Admissions ({admittedPatients.length})
                </span>

                <span>
                  <i className="legend-discharge" />
                  Discharges ({dischargedPatients.length})
                </span>
              </div>
            </div>

            <div className="department-card">
              <div className="flow-card-header">
                <div>
                  <span>DEPARTMENT LOAD (ADMITTED ONLY)</span>
                  <h2>Current Distribution</h2>
                </div>
              </div>

              <div className="department-list">
                {departmentDistribution.map((department) => (
                  <div className="department-row" key={department.name}>
                    <div className="department-info">
                      <strong>{department.name}</strong>
                      <span>
                        {department.current} / {department.capacity} admitted beds
                      </span>
                    </div>

                    <strong className="department-percentage">
                      {department.percentage}%
                    </strong>

                    <div className="department-progress">
                      <div
                        style={{
                          width: `${department.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ADMISSIONS REGISTRY TABLE */}
          <section className="admissions-table-section" style={{ marginTop: "24px" }}>
            <div style={{
              background: "#ffffff",
              borderRadius: "8px",
              border: "1px solid #c4c5d5",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.04)",
              overflow: "hidden"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px 20px",
                borderBottom: "1px solid #c4c5d5",
                background: "#f7f9fb",
                flexWrap: "wrap",
                gap: "14px"
              }}>
                <div>
                  <span style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.07em", color: "#757684", textTransform: "uppercase", display: "block", marginBottom: "3px" }}>
                    DATASET REGISTRY & LIVE ADMISSIONS
                  </span>
                  <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#191c1e", margin: 0 }}>
                    Universal Patient Admissions Ledger ({filteredAdmissions.length.toLocaleString()} Records)
                  </h2>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={openAddPatientModal}
                    style={{
                      height: "32px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "0 12px",
                      border: 0,
                      borderRadius: "5px",
                      background: "#00288e",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    <Plus size={14} /> Add Patient
                  </button>

                  <div style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center"
                  }}>
                    <Search size={14} style={{ position: "absolute", left: "10px", color: "#757684" }} />
                    <input
                      type="text"
                      placeholder="Search patient, Bed ID, Ward, Disease..."
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                      style={{
                        padding: "6px 12px 6px 32px",
                        fontSize: "12px",
                        borderRadius: "5px",
                        border: "1px solid #c4c5d5",
                        background: "#ffffff",
                        minWidth: "220px"
                      }}
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
                    style={{
                      padding: "6px 10px",
                      fontSize: "12px",
                      borderRadius: "5px",
                      border: "1px solid #c4c5d5",
                      background: "#ffffff"
                    }}
                  >
                    <option value="All">Status: All ({admissions.length})</option>
                    <option value="Admitted">Admitted ({admittedPatients.length})</option>
                    <option value="Discharged">Discharged ({dischargedPatients.length})</option>
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(e) => handleFilterChange(setTypeFilter, e.target.value)}
                    style={{
                      padding: "6px 10px",
                      fontSize: "12px",
                      borderRadius: "5px",
                      border: "1px solid #c4c5d5",
                      background: "#ffffff"
                    }}
                  >
                    <option value="All">Type: All</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Elective">Elective</option>
                    <option value="Urgent">Urgent</option>
                  </select>

                  <select
                    value={deptFilter}
                    onChange={(e) => handleFilterChange(setDeptFilter, e.target.value)}
                    style={{
                      padding: "6px 10px",
                      fontSize: "12px",
                      borderRadius: "5px",
                      border: "1px solid #c4c5d5",
                      background: "#ffffff",
                      maxWidth: "160px"
                    }}
                  >
                    {departmentOptions.map((d) => (
                      <option key={d} value={d}>
                        {d === "All" ? "Dept: All" : d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "#ffffff", borderBottom: "1px solid #c4c5d5", color: "#757684" }}>
                      <th style={{ padding: "10px 14px" }}>ADMISSION ID</th>
                      <th style={{ padding: "10px 14px" }}>PATIENT NAME</th>
                      <th style={{ padding: "10px 14px" }}>BED ID</th>
                      <th style={{ padding: "10px 14px" }}>WARD</th>
                      <th style={{ padding: "10px 14px" }}>DEPARTMENT</th>
                      <th style={{ padding: "10px 14px" }}>DIAGNOSIS / DISEASE</th>
                      <th style={{ padding: "10px 14px" }}>TYPE</th>
                      <th style={{ padding: "10px 14px" }}>ADMIT DATE</th>
                      <th style={{ padding: "10px 14px" }}>DISCHARGE DATE</th>
                      <th style={{ padding: "10px 14px", textAlign: "right" }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAdmissions.length === 0 ? (
                      <tr>
                        <td colSpan="10" style={{ padding: "30px", textAlign: "center", color: "#757684" }}>
                          No admissions match your search filter.
                        </td>
                      </tr>
                    ) : (
                      paginatedAdmissions.map((adm) => (
                        <tr key={adm.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "10px 14px", fontWeight: "700", color: "#00288e" }}>
                            {adm.id}
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <strong style={{ color: "#191c1e", display: "block" }}>{adm.patient}</strong>
                            <small style={{ color: "#757684" }}>{adm.patient_id}</small>
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{
                              display: "inline-block",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              background: "#e5efff",
                              color: "#00288e",
                              fontWeight: "700",
                              fontSize: "11px"
                            }}>
                              {adm.bed}
                            </span>
                          </td>
                          <td style={{ padding: "10px 14px", color: "#191c1e", fontWeight: "500" }}>
                            {adm.ward}
                          </td>
                          <td style={{ padding: "10px 14px", color: "#444653" }}>
                            {adm.department}
                          </td>
                          <td style={{ padding: "10px 14px", color: "#191c1e", fontWeight: "500" }}>
                            {adm.disease}
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "10px",
                              fontWeight: "700",
                              background: adm.type === "Emergency" ? "#ffebe8" : adm.type === "Urgent" ? "#fff1df" : "#f1f5f9",
                              color: adm.type === "Emergency" ? "#ba1a1a" : adm.type === "Urgent" ? "#a65100" : "#444653"
                            }}>
                              {adm.type}
                            </span>
                          </td>
                          <td style={{ padding: "10px 14px", color: "#444653", whiteSpace: "nowrap" }}>
                            {adm.date}
                          </td>
                          <td style={{ padding: "10px 14px", color: "#444653", whiteSpace: "nowrap" }}>
                            {adm.discharge_date}
                          </td>
                          <td style={{ padding: "10px 14px", textAlign: "right" }}>
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "2px 8px",
                              borderRadius: "999px",
                              fontSize: "10px",
                              fontWeight: "700",
                              background: adm.status === "Admitted" ? "#e7f6ec" : "#f1f5f9",
                              color: adm.status === "Admitted" ? "#18733c" : "#757684"
                            }}>
                              {adm.status === "Admitted" ? <CheckCircle2 size={10} /> : <Clock3 size={10} />}
                              {adm.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 18px",
                borderTop: "1px solid #c4c5d5",
                background: "#f7f9fb",
                fontSize: "12px",
                color: "#444653",
                flexWrap: "wrap",
                gap: "10px"
              }}>
                <div>
                  Showing {Math.min((currentPage - 1) * pageSize + 1, filteredAdmissions.length).toLocaleString()} – {Math.min(currentPage * pageSize, filteredAdmissions.length).toLocaleString()} of {filteredAdmissions.length.toLocaleString()} admissions
                </div>

                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "4px",
                      border: "1px solid #c4c5d5",
                      background: currentPage === 1 ? "#f1f5f9" : "#ffffff",
                      cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      color: currentPage === 1 ? "#94a3b8" : "#191c1e",
                      fontWeight: "700",
                      fontSize: "11px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px"
                    }}
                  >
                    <ChevronLeft size={12} /> Prev
                  </button>

                  <span style={{ padding: "0 6px", fontWeight: "700", color: "#191c1e" }}>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "4px",
                      border: "1px solid #c4c5d5",
                      background: currentPage >= totalPages ? "#f1f5f9" : "#ffffff",
                      cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                      color: currentPage >= totalPages ? "#94a3b8" : "#191c1e",
                      fontWeight: "700",
                      fontSize: "11px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px"
                    }}
                  >
                    Next <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ADD NEW PATIENT MODAL */}
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
                  maxWidth: "540px",
                  background: "#ffffff",
                  borderRadius: "10px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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
                      PATIENT ADMISSION DISPATCH
                    </span>
                    <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                      Admit / Register New Patient
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

                <form onSubmit={handleAddPatientSubmit} style={{ padding: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                        Patient Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Chandra"
                        value={patientForm.patient}
                        onChange={(e) => setPatientForm({ ...patientForm, patient: e.target.value })}
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
                        Patient ID
                      </label>
                      <input
                        type="text"
                        value={patientForm.patient_id}
                        onChange={(e) => setPatientForm({ ...patientForm, patient_id: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px",
                          background: "#f8fafc"
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                        Clinical Department
                      </label>
                      <select
                        value={patientForm.department}
                        onChange={(e) => setPatientForm({ ...patientForm, department: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px",
                          background: "#ffffff"
                        }}
                      >
                        {availableDepartments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                        Allocated Ward
                      </label>
                      <select
                        value={patientForm.ward}
                        onChange={(e) => setPatientForm({ ...patientForm, ward: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px",
                          background: "#ffffff"
                        }}
                      >
                        {availableWards.map((w) => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                        Bed Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ICU-03"
                        value={patientForm.bed}
                        onChange={(e) => setPatientForm({ ...patientForm, bed: e.target.value })}
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
                        Admission Type
                      </label>
                      <select
                        value={patientForm.type}
                        onChange={(e) => setPatientForm({ ...patientForm, type: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px",
                          background: "#ffffff"
                        }}
                      >
                        <option value="Emergency">Emergency</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Elective">Elective</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                        Status
                      </label>
                      <select
                        value={patientForm.status}
                        onChange={(e) => setPatientForm({ ...patientForm, status: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          fontSize: "12px",
                          background: "#ffffff"
                        }}
                      >
                        <option value="Admitted">Admitted</option>
                        <option value="Discharged">Discharged</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "12px", marginBottom: "20px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700", color: "#334155", marginBottom: "5px" }}>
                        Primary Diagnosis / Clinical Disease *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acute Myocardial Infarction / Trauma"
                        value={patientForm.disease}
                        onChange={(e) => setPatientForm({ ...patientForm, disease: e.target.value })}
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
                        Admission Date
                      </label>
                      <input
                        type="date"
                        value={patientForm.date}
                        onChange={(e) => setPatientForm({ ...patientForm, date: e.target.value })}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
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
                      Register &amp; Admit Patient
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

export default PatientFlow;
