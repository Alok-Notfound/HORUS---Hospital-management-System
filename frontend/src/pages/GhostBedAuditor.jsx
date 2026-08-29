import {
  AlertTriangle,
  CheckSquare,
  Clock3,
  Info,
  Play,
  TrendingDown,
  TrendingUp,
  Wallet,
  Search,
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { useMemo, useState, useEffect } from "react";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { initialGhostBedsData } from "../services/ghostBedsData";

import "../styles/layout.css";
import "../styles/ghost-bed-auditor.css";

const metrics = [
  {
    title: "TOTAL DISCREPANCIES",
    value: "8",
    suffix: "Active",
    change: "+2 since last shift",
    icon: AlertTriangle,
    accent: "error",
    trend: "up",
  },
  {
    title: "AUDIT ACCURACY",
    value: "98.2",
    suffix: "%",
    change: "+0.4% MoM",
    icon: CheckSquare,
    accent: "secondary",
    trend: "up",
  },
  {
    title: "REVENUE LEAKAGE IMPACT",
    value: "$14.2",
    suffix: "k",
    change: "Est. current shift",
    icon: Wallet,
    accent: "tertiary",
    trend: "info",
  },
  {
    title: "AVG. RECONCILIATION TIME",
    value: "18",
    suffix: "min",
    change: "-2 min faster",
    icon: Clock3,
    accent: "primary",
    trend: "down",
  },
];

function getResult(bed) {
  if (
    bed.system === "Occupied" &&
    bed.physical === "Empty"
  ) {
    return "Ghost Bed";
  }

  if (bed.system !== bed.physical) {
    return "Mismatch";
  }

  return "Matched";
}

function GhostBedAuditor() {
  const [beds, setBeds] = useState(initialGhostBedsData);
  const [search, setSearch] = useState("");
  const [ward, setWard] = useState("All");
  const [resultFilter, setResultFilter] = useState("All");
  const [sweeping, setSweeping] = useState(false);
  const [lastSyncSeconds, setLastSyncSeconds] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Auto-Sync heartbeat every second
  useEffect(() => {
    const timer = setInterval(() => {
      setLastSyncSeconds((s) => (s >= 15 ? 0 : s + 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculatedMetrics = useMemo(() => {
    const discrepancies = beds.filter(
      (bed) => getResult(bed) !== "Matched"
    ).length;

    const matched = beds.filter(
      (bed) => getResult(bed) === "Matched"
    ).length;

    const accuracy =
      beds.length === 0
        ? 0
        : ((matched / beds.length) * 100).toFixed(1);

    return {
      discrepancies,
      accuracy,
    };
  }, [beds]);

  const wards = [
    "All",
    ...new Set(beds.map((bed) => bed.ward)),
  ];

  const filteredBeds = useMemo(() => {
    return beds.filter((bed) => {
      const result = getResult(bed);

      const searchMatch =
        !search ||
        bed.bed.toLowerCase().includes(search.toLowerCase()) ||
        bed.ward.toLowerCase().includes(search.toLowerCase()) ||
        bed.patient.toLowerCase().includes(search.toLowerCase());

      const wardMatch =
        ward === "All" || bed.ward === ward;

      const resultMatch =
        resultFilter === "All" ||
        result === resultFilter;

      return searchMatch && wardMatch && resultMatch;
    });
  }, [beds, search, ward, resultFilter]);

  const totalPages = Math.ceil(filteredBeds.length / pageSize) || 1;
  const paginatedBeds = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBeds.slice(start, start + pageSize);
  }, [filteredBeds, currentPage, pageSize]);

  function initiateSweep() {
    setSweeping(true);
    setLastSyncSeconds(0);

    setTimeout(() => {
      setBeds((current) =>
        current.map((bed) => ({
          ...bed,
          verified: "Just now",
        }))
      );
      setSweeping(false);
    }, 700);
  }

  function verifyBed(id) {
    setBeds((current) =>
      current.map((bed) =>
        bed.id === id
          ? {
              ...bed,
              verified: "Just now",
            }
          : bed
      )
    );
  }

  function reconcileBed(id) {
    setBeds((current) =>
      current.map((bed) =>
        bed.id === id
          ? {
              ...bed,
              system: bed.physical,
              verified: "Just now",
            }
          : bed
      )
    );
  }

  return (
    <div className="app-shell">
      <Header />

      <div className="app-body">
        <Sidebar />

        <main className="dashboard-content ghost-bed-page">

          {/* PAGE HEADER */}
          <section className="ghost-page-header">
            <div>
              <span className="ghost-kicker">
                OPERATIONS / RECONCILIATION
              </span>

              <h1>Ghost Bed Auditor</h1>
            </div>

            <div className="ghost-page-actions">
              <span className="live-sync">
                <i />
                LIVE SYNC: {sweeping ? "RUNNING" : `${lastSyncSeconds} SEC AGO`}
              </span>

              <button
                className="sweep-button"
                type="button"
                onClick={initiateSweep}
                disabled={sweeping}
              >
                <Play size={16} />
                {sweeping
                  ? "Running Sweep..."
                  : "Initiate Sweep"}
              </button>
            </div>
          </section>

          {/* KPI METRICS */}
          <section className="ghost-metrics">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              let value = metric.value;

              if (metric.title === "TOTAL DISCREPANCIES") {
                value = calculatedMetrics.discrepancies;
              }

              if (metric.title === "AUDIT ACCURACY") {
                value = calculatedMetrics.accuracy;
              }

              return (
                <article
                  className={`ghost-metric-card ${metric.accent}`}
                  key={metric.title}
                >
                  <div className="ghost-accent" />

                  <div className="ghost-metric-top">
                    <span>{metric.title}</span>
                    <Icon size={18} />
                  </div>

                  <div className="ghost-metric-value">
                    <strong>{value}</strong>
                    <span>{metric.suffix}</span>
                  </div>

                  <div
                    className={`ghost-metric-change ${metric.trend}`}
                  >
                    {metric.trend === "up" && (
                      <TrendingUp size={15} />
                    )}

                    {metric.trend === "down" && (
                      <TrendingDown size={15} />
                    )}

                    {metric.trend === "info" && (
                      <Info size={15} />
                    )}

                    <span>{metric.change}</span>
                  </div>
                </article>
              );
            })}
          </section>

          {/* RECONCILIATION WORKSPACE */}
          <section className="ghost-workspace">
            <div className="ghost-workspace-header">
              <div>
                <span>RECONCILIATION WORKSPACE</span>
                <h2>Physical vs. EHR Bed Status</h2>
              </div>

              <div className="ghost-workspace-count">
                {filteredBeds.length} Records
              </div>
            </div>

            {/* FILTER BAR */}
            <div className="ghost-filter-bar">
              <div className="ghost-search">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Search bed, ward or patient..."
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <select
                value={ward}
                onChange={(event) => {
                  setWard(event.target.value);
                  setCurrentPage(1);
                }}
              >
                {wards.map((item) => (
                  <option key={item} value={item}>
                    {item === "All"
                      ? "All Wards"
                      : item}
                  </option>
                ))}
              </select>

              <select
                value={resultFilter}
                onChange={(event) => {
                  setResultFilter(event.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Results ({beds.length})</option>
                <option value="Ghost Bed">Ghost Beds</option>
                <option value="Mismatch">Mismatches</option>
                <option value="Matched">Matched</option>
              </select>
            </div>

            {/* TABLE */}
            <div className="ghost-table-wrapper">
              <table className="ghost-table">
                <thead>
                  <tr>
                    <th>WARD</th>
                    <th>BED</th>
                    <th>PATIENT</th>
                    <th>EHR STATUS</th>
                    <th>PHYSICAL</th>
                    <th>RESULT</th>
                    <th>VERIFIED</th>
                    <th style={{ textAlign: "right" }}>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedBeds.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="ghost-empty"
                      >
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    paginatedBeds.map((bed) => {
                      const result = getResult(bed);

                      return (
                        <tr key={bed.id}>
                          <td>
                            <strong>{bed.ward}</strong>
                          </td>

                          <td>
                            <span className="ghost-bed-number">
                              {bed.bed}
                            </span>
                          </td>

                          <td>{bed.patient}</td>

                          <td>
                            <span
                              className={`ghost-status ${
                                bed.system === "Occupied"
                                  ? "occupied"
                                  : "empty"
                              }`}
                            >
                              <i />
                              {bed.system}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`ghost-status ${
                                bed.physical === "Occupied"
                                  ? "occupied"
                                  : "empty"
                              }`}
                            >
                              <i />
                              {bed.physical}
                            </span>
                          </td>

                          <td>
                            {result === "Ghost Bed" && (
                              <span className="ghost-result ghost">
                                <AlertTriangle size={13} />
                                Ghost Bed
                              </span>
                            )}

                            {result === "Mismatch" && (
                              <span className="ghost-result mismatch">
                                <AlertTriangle size={13} />
                                Mismatch
                              </span>
                            )}

                            {result === "Matched" && (
                              <span className="ghost-result matched">
                                <CheckSquare size={13} />
                                Matched
                              </span>
                            )}
                          </td>

                          <td>
                            <span className="ghost-verified">
                              {bed.verified}
                            </span>
                          </td>

                          <td>
                            <div className="ghost-actions" style={{ justifyContent: "flex-end" }}>
                              <button
                                className="verify-button"
                                type="button"
                                onClick={() => verifyBed(bed.id)}
                              >
                                Verify
                              </button>

                              {result !== "Matched" && (
                                <button
                                  className="reconcile-button"
                                  type="button"
                                  onClick={() => reconcileBed(bed.id)}
                                >
                                  Reconcile
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION FOOTER */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 18px",
              background: "#f7f9fb",
              borderTop: "1px solid #c4c5d5",
              fontSize: "12px",
              color: "#444653"
            }}>
              <div>
                Showing {Math.min((currentPage - 1) * pageSize + 1, filteredBeds.length)} – {Math.min(currentPage * pageSize, filteredBeds.length)} of {filteredBeds.length} records
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
          </section>
        </main>
      </div>
    </div>
  );
}

export default GhostBedAuditor;
