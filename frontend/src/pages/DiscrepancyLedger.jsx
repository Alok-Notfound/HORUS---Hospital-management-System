import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Package,
  Plus,
  Search,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { initialMedicinesData } from "../services/medicinesData";

import "../styles/layout.css";
import "../styles/discrepancy-ledger.css";

const emptyMedicine = {
  name: "",
  stock: "",
  expiry: "",
  status: "in-stock",
};

function getExpiryState(expiry) {
  const today = new Date();
  const expiryDate = new Date(`${expiry}T00:00:00`);

  if (expiryDate < today) {
    return "expired";
  }

  const daysLeft = Math.ceil(
    (expiryDate - today) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft <= 30) {
    return "soon";
  }

  return "valid";
}

function formatDate(date) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  } catch {
    return date;
  }
}

function DiscrepancyLedger() {
  const [medicines, setMedicines] = useState(initialMedicinesData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [form, setForm] = useState(emptyMedicine);

  const pageSize = 20;

  const filteredMedicines = useMemo(() => {
    return medicines.filter((medicine) => {
      const matchesSearch = medicine.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        medicine.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [medicines, search, statusFilter]);

  const totalPages = Math.ceil(filteredMedicines.length / pageSize) || 1;
  const paginatedMedicines = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMedicines.slice(start, start + pageSize);
  }, [filteredMedicines, currentPage, pageSize]);

  const totalMedicines = medicines.length;

  const inStock = medicines.filter(
    (medicine) => medicine.status === "in-stock" && medicine.stock > 0
  ).length;

  const outOfStock = medicines.filter(
    (medicine) => medicine.status === "out-of-stock" || medicine.stock === 0
  ).length;

  const expiringSoon = medicines.filter(
    (medicine) => getExpiryState(medicine.expiry) === "soon"
  ).length;

  function openAddModal() {
    setEditingMedicine(null);
    setForm(emptyMedicine);
    setModalOpen(true);
  }

  function openEditModal(medicine) {
    setEditingMedicine(medicine);
    setForm({
      name: medicine.name,
      stock: medicine.stock,
      expiry: medicine.expiry,
      status: medicine.status,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingMedicine(null);
    setForm(emptyMedicine);
  }

  function handleStatusChange(status) {
    setForm((current) => ({
      ...current,
      status,
      stock: status === "out-of-stock" ? 0 : current.stock,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.expiry) {
      return;
    }

    const stock =
      form.status === "out-of-stock"
        ? 0
        : Number(form.stock) || 0;

    if (editingMedicine) {
      setMedicines((current) =>
        current.map((medicine) =>
          medicine.id === editingMedicine.id
            ? {
                ...medicine,
                name: form.name.trim(),
                stock,
                expiry: form.expiry,
                status: form.status,
              }
            : medicine
        )
      );
    } else {
      setMedicines((current) => [
        {
          id: Date.now(),
          name: form.name.trim(),
          stock,
          expiry: form.expiry,
          status: form.status,
        },
        ...current
      ]);
    }

    closeModal();
  }

  function deleteMedicine(id) {
    if (window.confirm("Remove this medicine from the pharmacy ledger?")) {
      setMedicines((current) =>
        current.filter((medicine) => medicine.id !== id)
      );
    }
  }

  return (
    <div className="app-shell">
      <Header />

      <div className="app-body">
        <Sidebar />

        <main className="dashboard-content ledger-page">
          <section className="ledger-heading">
            <div>
              <span>PHARMACY / INVENTORY RECONCILIATION</span>
              <h1>Discrepancy Ledger</h1>
              
            </div>

            <button
              type="button"
              className="add-medicine-button"
              onClick={openAddModal}
            >
              <Plus size={16} />
              Add Medicine
            </button>
          </section>

          <section className="ledger-metrics">
            <article className="ledger-metric" onClick={() => { setStatusFilter("all"); setCurrentPage(1); }} style={{ cursor: "pointer" }}>
              <div className="ledger-metric-icon blue">
                <Package size={18} />
              </div>
              <div>
                <span>Total Formulations</span>
                <strong>{totalMedicines}</strong>
              </div>
            </article>

            <article className="ledger-metric" onClick={() => { setStatusFilter("in-stock"); setCurrentPage(1); }} style={{ cursor: "pointer" }}>
              <div className="ledger-metric-icon green">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <span>In Stock</span>
                <strong>{inStock}</strong>
              </div>
            </article>

            <article className="ledger-metric" onClick={() => { setStatusFilter("out-of-stock"); setCurrentPage(1); }} style={{ cursor: "pointer" }}>
              <div className="ledger-metric-icon red">
                <AlertTriangle size={18} />
              </div>
              <div>
                <span>Out of Stock</span>
                <strong>{outOfStock}</strong>
              </div>
            </article>

            <article className="ledger-metric">
              <div className="ledger-metric-icon orange">
                <CalendarDays size={18} />
              </div>
              <div>
                <span>Expiring Soon</span>
                <strong>{expiringSoon}</strong>
              </div>
            </article>
          </section>

          <section className="ledger-card">
            <div className="ledger-toolbar">
              <div>
                <span>MEDICINE INVENTORY (400 FORMULATIONS)</span>
                <h2>Current Stock Reconciliation</h2>
              </div>

              <div className="ledger-controls">
                <div className="ledger-search">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search medicine brand, generic name..."
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Status ({totalMedicines})</option>
                  <option value="in-stock">In Stock ({inStock})</option>
                  <option value="out-of-stock">Out of Stock ({outOfStock})</option>
                </select>
              </div>
            </div>

            <div className="ledger-table-wrapper">
              <table className="ledger-table">
                <thead>
                  <tr>
                    <th>MEDICINE NAME</th>
                    <th>STOCK STATUS</th>
                    <th>EXPIRY DATE</th>
                    <th style={{ textAlign: "right" }}>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedMedicines.map((medicine) => {
                    const expiryState = getExpiryState(medicine.expiry);

                    return (
                      <tr key={medicine.id}>
                        <td>
                          <div className="medicine-name">
                            <div className="medicine-icon">
                              <Package size={15} />
                            </div>
                            <strong>{medicine.name}</strong>
                          </div>
                        </td>

                        <td>
                          <div className={`stock-status ${medicine.status}`}>
                            <span>
                              <i />
                              {medicine.status === "in-stock"
                                ? "IN STOCK"
                                : "OUT OF STOCK"}
                            </span>
                            <small>
                              {medicine.stock.toLocaleString("en-IN")} units
                            </small>
                          </div>
                        </td>

                        <td>
                          <div className={`expiry-cell ${expiryState}`}>
                            <strong>{formatDate(medicine.expiry)}</strong>
                            {expiryState === "soon" && (
                              <small>
                                <AlertTriangle size={11} />
                                Expiring soon
                              </small>
                            )}
                            {expiryState === "expired" && (
                              <small>
                                <AlertTriangle size={11} />
                                Expired
                              </small>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="ledger-actions" style={{ justifyContent: "flex-end" }}>
                            <button
                              type="button"
                              title="Edit medicine"
                              onClick={() => openEditModal(medicine)}
                            >
                              <Edit3 size={15} />
                            </button>

                            <button
                              type="button"
                              title="Delete medicine"
                              onClick={() => deleteMedicine(medicine.id)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredMedicines.length === 0 && (
                <div className="ledger-empty">
                  <Package size={28} />
                  <strong>No medicines found</strong>
                  <span>Try changing the search or status filter.</span>
                </div>
              )}
            </div>

            {/* PAGINATION FOOTER */}
            <div className="ledger-footer" style={{
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
                Showing {Math.min((currentPage - 1) * pageSize + 1, filteredMedicines.length)} – {Math.min(currentPage * pageSize, filteredMedicines.length)} of {filteredMedicines.length} medicines
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

          {modalOpen && (
            <div
              className="medicine-modal-overlay"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  closeModal();
                }
              }}
            >
              <div className="medicine-modal">
                <div className="medicine-modal-header">
                  <div>
                    <span>INVENTORY MANAGEMENT</span>
                    <h2>{editingMedicine ? "Edit Medicine" : "Add Medicine"}</h2>
                  </div>

                  <button type="button" onClick={closeModal}>
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="form-field">
                    <label htmlFor="medicine-name">Medicine Name</label>
                    <input
                      id="medicine-name"
                      type="text"
                      placeholder="e.g. Paracetamol 500mg"
                      value={form.name}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          name: event.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="medicine-stock">Current Stock</label>
                      <input
                        id="medicine-stock"
                        type="number"
                        min="0"
                        placeholder="e.g. 1000"
                        value={form.stock}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            stock: event.target.value,
                          })
                        }
                        disabled={form.status === "out-of-stock"}
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="medicine-expiry">Expiry Date</label>
                      <input
                        id="medicine-expiry"
                        type="date"
                        value={form.expiry}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            expiry: event.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Status</label>
                    <div className="status-radio-group">
                      <label className="status-radio">
                        <input
                          type="radio"
                          name="status"
                          value="in-stock"
                          checked={form.status === "in-stock"}
                          onChange={() => handleStatusChange("in-stock")}
                        />
                        <span>In Stock</span>
                      </label>

                      <label className="status-radio">
                        <input
                          type="radio"
                          name="status"
                          value="out-of-stock"
                          checked={form.status === "out-of-stock"}
                          onChange={() => handleStatusChange("out-of-stock")}
                        />
                        <span>Out of Stock</span>
                      </label>
                    </div>
                  </div>

                  <div className="medicine-modal-actions">
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="save-button">
                      {editingMedicine ? "Save Changes" : "Add to Ledger"}
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

export default DiscrepancyLedger;
