import { useMemo, useState } from "react";
import { AlertTriangle, Check, Download, Filter, Search, Calendar, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { initialWardCensusData } from "../../services/wardCensusData";

function StatusBadge({ status }) {
  if (status === "Reconciled") {
    return (
      <span className="matrix-status status-reconciled">
        <Check size={11} />
        Reconciled
      </span>
    );
  }

  if (status === "Imputed") {
    return (
      <span className="matrix-status status-imputed">
        <AlertTriangle size={11} />
        Imputed
      </span>
    );
  }

  return (
    <span className="matrix-status status-audit">
      <AlertTriangle size={11} />
      Audit Req
    </span>
  );
}

function WardMatrix() {
  const [records, setRecords] = useState(initialWardCensusData);
  const [selectedDate, setSelectedDate] = useState("2026-08-29 (Today)");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMsg, setToastMsg] = useState(null);

  const pageSize = 14;

  const dateOptions = [
    "All Dates",
    ...new Set(initialWardCensusData.map((r) => r.date))
  ];

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  }

  const filteredWards = useMemo(() => {
    return records.filter((r) => {
      const matchDate = selectedDate === "All Dates" || r.date === selectedDate;
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      const matchSearch =
        !search ||
        r.ward.toLowerCase().includes(search.toLowerCase()) ||
        r.nurse.toLowerCase().includes(search.toLowerCase());

      return matchDate && matchStatus && matchSearch;
    });
  }, [records, selectedDate, statusFilter, search]);

  const totalPages = Math.ceil(filteredWards.length / pageSize) || 1;
  const paginatedWards = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredWards.slice(start, start + pageSize);
  }, [filteredWards, currentPage, pageSize]);

  function reconcileWard(id, wardName) {
    setRecords((current) =>
      current.map((r) =>
        r.id === id
          ? {
              ...r,
              manual: r.his,
              delta: 0,
              status: "Reconciled",
            }
          : r
      )
    );
    showToast(`Reconciled census for ${wardName}!`);
  }

  function exportToCSV() {
    const headers = ["ID,Date,Ward,Capacity,Occupancy,HIS_Census,Manual_Sheet,Delta,Status,Duty_Nurse\n"];
    const rows = filteredWards.map(
      (r) =>
        `"${r.id}","${r.date}","${r.ward}","${r.capacity}","${r.occupancy}","${r.his}","${r.manual}","${r.delta}","${r.status}","${r.nurse}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows.join("\n")).join("");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hospital_ward_census_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Exported Census CSV Report successfully!");
  }

  return (
    <section className="matrix-section">
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
          fontSize: "0.85rem",
          fontWeight: "600"
        }}>
          <CheckCircle2 size={16} color="#10b981" />
          {toastMsg}
        </div>
      )}

      <div className="matrix-header" style={{ flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2>Interactive Bed Capacity & Census Truth</h2>
          <span style={{ fontSize: "11px", color: "#757684", fontWeight: "600" }}>
            Date-wise & Ward-wise real-time census reconciliation ({filteredWards.length} total records)
          </span>
        </div>

        <div className="matrix-actions" style={{ flexWrap: "wrap", gap: "8px" }}>
          {/* DATE SELECTOR */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
            <Calendar size={13} color="#475569" />
            <select
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setCurrentPage(1); }}
              style={{ background: "transparent", border: "none", fontSize: "11px", fontWeight: "700", color: "#1e293b", cursor: "pointer" }}
            >
              {dateOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* STATUS FILTER */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
            <Filter size={13} color="#475569" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              style={{ background: "transparent", border: "none", fontSize: "11px", fontWeight: "700", color: "#1e293b", cursor: "pointer" }}
            >
              <option value="All">Status: All</option>
              <option value="Reconciled">Reconciled</option>
              <option value="Imputed">Imputed</option>
              <option value="Audit Req">Audit Req</option>
            </select>
          </div>

          {/* EXPORT BUTTON */}
          <button type="button" onClick={exportToCSV} style={{ cursor: "pointer" }}>
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="matrix-table-wrapper">
        <table className="matrix-table">
          <thead>
            <tr>
              <th>DATE</th>
              <th>WARD</th>
              <th className="text-right">CAPACITY</th>
              <th className="text-right">OCC %</th>
              <th className="text-right">HIS CENSUS</th>
              <th className="text-right">MANUAL SHEET</th>
              <th className="text-center">DELTA</th>
              <th>STATUS</th>
              <th style={{ textAlign: "right" }}>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {paginatedWards.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ padding: "30px", textAlign: "center", color: "#757684" }}>
                  No ward census records found for selected date and filter.
                </td>
              </tr>
            ) : (
              paginatedWards.map((w) => (
                <tr key={w.id}>
                  <td style={{ fontSize: "11px", color: "#64748b", fontWeight: "600", whiteSpace: "nowrap" }}>
                    {w.date.replace(" (Today)", "").replace(" (Yesterday)", "")}
                  </td>

                  <td className="ward-cell">
                    <strong>{w.ward}</strong>
                    <small style={{ display: "block", fontSize: "10px", color: "#94a3b8" }}>{w.nurse}</small>
                  </td>

                  <td className="text-right">{w.capacity}</td>

                  <td className="text-right">{w.occupancy}</td>

                  <td className={`text-right ${w.delta !== 0 ? "cell-alert" : ""}`}>
                    {w.his}
                  </td>

                  <td className={`text-right ${w.delta !== 0 ? "cell-alert" : ""}`}>
                    {w.manual}
                  </td>

                  <td className={`text-center ${w.delta !== 0 ? "delta-alert" : "delta-normal"}`}>
                    {w.delta > 0 ? "+" : ""}
                    {w.delta}
                  </td>

                  <td>
                    <StatusBadge status={w.status} />
                  </td>

                  <td style={{ textAlign: "right" }}>
                    {w.delta !== 0 ? (
                      <button
                        type="button"
                        onClick={() => reconcileWard(w.id, w.ward)}
                        style={{
                          padding: "3px 8px",
                          borderRadius: "4px",
                          border: "none",
                          background: "#00288e",
                          color: "#ffffff",
                          fontSize: "10px",
                          fontWeight: "700",
                          cursor: "pointer"
                        }}
                      >
                        Reconcile
                      </button>
                    ) : (
                      <span style={{ color: "#18733c", fontSize: "11px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                        <Check size={11} /> OK
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        background: "#f7f9fb",
        borderTop: "1px solid #c4c5d5",
        fontSize: "12px",
        color: "#444653",
        flexWrap: "wrap",
        gap: "10px"
      }}>
        <div>
          Showing {Math.min((currentPage - 1) * pageSize + 1, filteredWards.length)} – {Math.min(currentPage * pageSize, filteredWards.length)} of {filteredWards.length} records ({selectedDate})
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
  );
}

export default WardMatrix;
