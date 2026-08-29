import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Stethoscope,
  IndianRupee,
} from "lucide-react";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

import "../styles/layout.css";
import "../styles/appointment.css";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MORNING_TIME = "09:00 AM – 01:00 PM";
const EVENING_TIME = "03:00 PM – 07:00 PM";

const GENERAL_CHARGE = 300;
const TATKAL_CHARGE = 500;

function createSchedule() {
  return DAYS.reduce((schedule, day) => {
    schedule[day] = {
      morning: false,
      evening: false,
    };
    return schedule;
  }, {});
}

const initialDoctors = [
  {
    id: 1,
    name: "Dr. Ananya Sharma",
    department: "Cardiology",
    schedule: {
      Monday: { morning: true, evening: false },
      Tuesday: { morning: true, evening: true },
      Wednesday: { morning: false, evening: true },
      Thursday: { morning: true, evening: true },
      Friday: { morning: true, evening: false },
      Saturday: { morning: true, evening: false },
      Sunday: { morning: false, evening: false },
    },
  },
  {
    id: 2,
    name: "Dr. Rajiv Mehta",
    department: "Orthopedics",
    schedule: {
      Monday: { morning: false, evening: true },
      Tuesday: { morning: true, evening: true },
      Wednesday: { morning: true, evening: false },
      Thursday: { morning: true, evening: true },
      Friday: { morning: false, evening: true },
      Saturday: { morning: true, evening: false },
      Sunday: { morning: false, evening: false },
    },
  },
  {
    id: 3,
    name: "Dr. Priya Nair",
    department: "General Medicine",
    schedule: {
      Monday: { morning: true, evening: true },
      Tuesday: { morning: true, evening: false },
      Wednesday: { morning: true, evening: true },
      Thursday: { morning: false, evening: true },
      Friday: { morning: true, evening: true },
      Saturday: { morning: true, evening: false },
      Sunday: { morning: false, evening: false },
    },
  },
  {
    id: 4,
    name: "Dr. Vikram Sethi",
    department: "Neurology",
    schedule: {
      Monday: { morning: true, evening: false },
      Tuesday: { morning: false, evening: true },
      Wednesday: { morning: true, evening: false },
      Thursday: { morning: true, evening: false },
      Friday: { morning: true, evening: true },
      Saturday: { morning: false, evening: false },
      Sunday: { morning: false, evening: false },
    },
  },
  {
    id: 5,
    name: "Dr. Sneha Roy",
    department: "Pediatrics",
    schedule: {
      Monday: { morning: true, evening: true },
      Tuesday: { morning: true, evening: true },
      Wednesday: { morning: true, evening: false },
      Thursday: { morning: true, evening: false },
      Friday: { morning: true, evening: false },
      Saturday: { morning: true, evening: false },
      Sunday: { morning: false, evening: false },
    },
  },
  {
    id: 6,
    name: "Dr. Logan Lata",
    department: "Orthopedic Surgery",
    schedule: {
      Monday: { morning: true, evening: true },
      Tuesday: { morning: true, evening: false },
      Wednesday: { morning: true, evening: true },
      Thursday: { morning: true, evening: false },
      Friday: { morning: true, evening: false },
      Saturday: { morning: false, evening: false },
      Sunday: { morning: false, evening: false },
    },
  },
  {
    id: 7,
    name: "Dr. Mohammed Natarajan",
    department: "Pediatric Neonatology",
    schedule: {
      Monday: { morning: false, evening: true },
      Tuesday: { morning: true, evening: true },
      Wednesday: { morning: false, evening: true },
      Thursday: { morning: true, evening: true },
      Friday: { morning: true, evening: false },
      Saturday: { morning: false, evening: false },
      Sunday: { morning: false, evening: false },
    },
  },
  {
    id: 8,
    name: "Dr. Devika Chandra",
    department: "Neurosurgery",
    schedule: {
      Monday: { morning: true, evening: false },
      Tuesday: { morning: true, evening: false },
      Wednesday: { morning: true, evening: true },
      Thursday: { morning: false, evening: true },
      Friday: { morning: true, evening: false },
      Saturday: { morning: false, evening: false },
      Sunday: { morning: false, evening: false },
    },
  },
  {
    id: 9,
    name: "Dr. Urvashi Raju",
    department: "General & Laparoscopic Surgery",
    schedule: {
      Monday: { morning: true, evening: true },
      Tuesday: { morning: true, evening: true },
      Wednesday: { morning: true, evening: false },
      Thursday: { morning: true, evening: true },
      Friday: { morning: true, evening: true },
      Saturday: { morning: true, evening: false },
      Sunday: { morning: false, evening: false },
    },
  },
  {
    id: 10,
    name: "Dr. Gaurang Jani",
    department: "Interventional Cardiology",
    schedule: {
      Monday: { morning: true, evening: true },
      Tuesday: { morning: false, evening: true },
      Wednesday: { morning: true, evening: false },
      Thursday: { morning: true, evening: true },
      Friday: { morning: false, evening: true },
      Saturday: { morning: true, evening: true },
      Sunday: { morning: false, evening: false },
    },
  },
  {
    id: 11,
    name: "Dr. Arvind Kulkarni",
    department: "Medical Oncology",
    schedule: {
      Monday: { morning: true, evening: false },
      Tuesday: { morning: true, evening: false },
      Wednesday: { morning: false, evening: true },
      Thursday: { morning: true, evening: true },
      Friday: { morning: true, evening: false },
      Saturday: { morning: false, evening: false },
      Sunday: { morning: false, evening: false },
    },
  },
  {
    id: 12,
    name: "Dr. Meenakshi Sundaram",
    department: "Emergency & Critical Care",
    schedule: {
      Monday: { morning: true, evening: true },
      Tuesday: { morning: true, evening: true },
      Wednesday: { morning: true, evening: true },
      Thursday: { morning: true, evening: true },
      Friday: { morning: true, evening: true },
      Saturday: { morning: true, evening: true },
      Sunday: { morning: false, evening: true },
    },
  }
];

function Appointment() {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [selectedDoctorId, setSelectedDoctorId] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [form, setForm] = useState({
    name: "",
    department: "",
    schedule: createSchedule(),
  });

  const selectedDoctor = doctors.find(
    (doctor) => doctor.id === selectedDoctorId
  );

  function openAddDoctor() {
    setEditingDoctor(null);

    setForm({
      name: "",
      department: "",
      schedule: createSchedule(),
    });

    setModalOpen(true);
  }

  function openEditDoctor() {
    if (!selectedDoctor) return;

    setEditingDoctor(selectedDoctor);

    setForm({
      name: selectedDoctor.name,
      department: selectedDoctor.department,
      schedule: JSON.parse(
        JSON.stringify(selectedDoctor.schedule)
      ),
    });

    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingDoctor(null);
  }

  function toggleSchedule(day, session) {
    setForm((current) => ({
      ...current,
      schedule: {
        ...current.schedule,
        [day]: {
          ...current.schedule[day],
          [session]: !current.schedule[day][session],
        },
      },
    }));
  }

  function saveDoctor(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.department.trim()) {
      return;
    }

    if (editingDoctor) {
      setDoctors((current) =>
        current.map((doctor) =>
          doctor.id === editingDoctor.id
            ? {
                ...doctor,
                name: form.name.trim(),
                department: form.department.trim(),
                schedule: form.schedule,
              }
            : doctor
        )
      );
    } else {
      const newDoctor = {
        id: Date.now(),
        name: form.name.trim(),
        department: form.department.trim(),
        schedule: form.schedule,
      };

      setDoctors((current) => [...current, newDoctor]);
      setSelectedDoctorId(newDoctor.id);
    }

    closeModal();
  }

  function removeDoctor() {
    if (!selectedDoctor) return;

    const confirmed = window.confirm(
      `Remove ${selectedDoctor.name}?`
    );

    if (!confirmed) return;

    const remaining = doctors.filter(
      (doctor) => doctor.id !== selectedDoctor.id
    );

    setDoctors(remaining);

    if (remaining.length > 0) {
      setSelectedDoctorId(remaining[0].id);
    }
  }

  const morningDays = selectedDoctor
    ? DAYS.filter(
        (day) => selectedDoctor.schedule[day].morning
      ).length
    : 0;

  const eveningDays = selectedDoctor
    ? DAYS.filter(
        (day) => selectedDoctor.schedule[day].evening
      ).length
    : 0;

  return (
    <div className="app-shell">
      <Header />

      <div className="app-body">
        <Sidebar />

        <main className="dashboard-content appointment-page">

          {/* PAGE HEADER */}
          <section className="appointment-heading">
            <div>
              <span className="page-kicker">
                OPERATIONS / APPOINTMENTS
              </span>

              <h1>Appointment Scheduling</h1>

              
            </div>

            <button
              type="button"
              className="add-doctor-button"
              onClick={openAddDoctor}
            >
              <Plus size={16} />
              Add Doctor
            </button>
          </section>

          {/* DOCTOR SELECTOR */}
          <section className="doctor-selection-card">
            <div className="doctor-selection-heading">
              <span>DOCTOR SELECTION</span>
              <h2>Choose your doctor</h2>
            </div>

            <div className="doctor-select-row">
              <div className="doctor-select-box">
                <Stethoscope size={17} />

                <select
                  value={selectedDoctorId || ""}
                  onChange={(event) =>
                    setSelectedDoctorId(
                      Number(event.target.value)
                    )
                  }
                >
                  {doctors.map((doctor) => (
                    <option
                      key={doctor.id}
                      value={doctor.id}
                    >
                      {doctor.name} — {doctor.department}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDoctor && (
                <div className="doctor-actions">
                  <button
                    type="button"
                    onClick={openEditDoctor}
                  >
                    <Pencil size={14} />
                    Edit Schedule
                  </button>

                  <button
                    type="button"
                    className="remove-doctor"
                    onClick={removeDoctor}
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              )}
            </div>

            {selectedDoctor && (
              <div className="doctor-preview">
                <div className="doctor-preview-avatar">
                  <Stethoscope size={21} />
                </div>

                <div>
                  <strong>{selectedDoctor.name}</strong>
                  <span>
                    {selectedDoctor.department}
                  </span>
                </div>
              </div>
            )}
          </section>

          {selectedDoctor && (
            <>
              {/* APPOINTMENT PREFERENCE */}
              <section className="appointment-preference-card">
                <div className="section-heading">
                  <span>APPOINTMENT PREFERENCE</span>
                  <h2>Consultation Charges</h2>
                </div>

                <div className="preference-options">
                  <div className="preference-option general">
                    <div className="preference-radio">
                      <Check size={13} />
                    </div>

                    <div>
                      <strong>General</strong>
                      <span>Standard appointment</span>
                    </div>

                    <b>₹{GENERAL_CHARGE}</b>
                  </div>

                  <div className="preference-option tatkal">
                    <div className="preference-radio">
                      <Check size={13} />
                    </div>

                    <div>
                      <strong>Tatkal</strong>
                      <span>Priority appointment</span>
                    </div>

                    <b>₹{TATKAL_CHARGE}</b>
                  </div>
                </div>
              </section>

              {/* WEEKLY AVAILABILITY */}
              <section className="doctor-availability-card">
                <div className="availability-header">
                  <div>
                    <span>DOCTOR AVAILABILITY</span>

                    <h2>Weekly Consultation Schedule</h2>
                  </div>

                  <div className="availability-summary">
                    <span>
                      <b>{morningDays}</b> Morning days
                    </span>

                    <span>
                      <b>{eveningDays}</b> Evening days
                    </span>
                  </div>
                </div>

                <div className="availability-table-wrapper">
                  <table className="availability-table">
                    <thead>
                      <tr>
                        <th>DAY</th>

                        <th>
                          <div>Morning</div>
                          <span>{MORNING_TIME}</span>
                        </th>

                        <th>
                          <div>Evening</div>
                          <span>{EVENING_TIME}</span>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {DAYS.map((day) => {
                        const schedule =
                          selectedDoctor.schedule[day];

                        return (
                          <tr key={day}>
                            <td>
                              <strong>{day}</strong>
                            </td>

                            <td>
                              <span
                                className={
                                  schedule.morning
                                    ? "availability-status available"
                                    : "availability-status unavailable"
                                }
                              >
                                <i />

                                {schedule.morning
                                  ? "Available"
                                  : "Not Available"}
                              </span>
                            </td>

                            <td>
                              <span
                                className={
                                  schedule.evening
                                    ? "availability-status available"
                                    : "availability-status unavailable"
                                }
                              >
                                <i />

                                {schedule.evening
                                  ? "Available"
                                  : "Not Available"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ADMIN NOTE */}
              <div className="appointment-admin-note">
                <Stethoscope size={15} />

                <span>
                  Availability is maintained by hospital
                  administration. Consultation timings remain
                  standardized across all doctors.
                </span>
              </div>
            </>
          )}
        </main>
      </div>

      {/* ADD / EDIT DOCTOR MODAL */}
      {modalOpen && (
        <div
          className="appointment-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="appointment-modal">

            <div className="appointment-modal-header">
              <div>
                <span>
                  {editingDoctor
                    ? "EDIT DOCTOR"
                    : "DOCTOR MANAGEMENT"}
                </span>

                <h2>
                  {editingDoctor
                    ? "Edit Doctor Schedule"
                    : "Add Doctor"}
                </h2>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={saveDoctor}>

              <div className="doctor-basic-fields">
                <div className="appointment-field">
                  <label>Doctor Name</label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name: event.target.value,
                      })
                    }
                    placeholder="Enter doctor name"
                    required
                  />
                </div>

                <div className="appointment-field">
                  <label>Department</label>

                  <input
                    type="text"
                    value={form.department}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        department: event.target.value,
                      })
                    }
                    placeholder="Enter department"
                    required
                  />
                </div>
              </div>

              <div className="modal-schedule-section">
                <div className="modal-schedule-heading">
                  <span>WEEKLY AVAILABILITY</span>

                  <strong>
                    Select Morning / Evening availability
                  </strong>
                </div>

                <div className="modal-table-wrapper">
                  <table className="modal-schedule-table">
                    <thead>
                      <tr>
                        <th>DAY</th>

                        <th>
                          Morning
                          <small>{MORNING_TIME}</small>
                        </th>

                        <th>
                          Evening
                          <small>{EVENING_TIME}</small>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {DAYS.map((day) => (
                        <tr key={day}>
                          <td>{day}</td>

                          <td>
                            <button
                              type="button"
                              className={
                                form.schedule[day].morning
                                  ? "session-button selected"
                                  : "session-button"
                              }
                              onClick={() =>
                                toggleSchedule(
                                  day,
                                  "morning"
                                )
                              }
                            >
                              {form.schedule[day].morning ? (
                                <Check size={13} />
                              ) : (
                                <X size={13} />
                              )}

                              {form.schedule[day].morning
                                ? "Available"
                                : "Not Available"}
                            </button>
                          </td>

                          <td>
                            <button
                              type="button"
                              className={
                                form.schedule[day].evening
                                  ? "session-button selected"
                                  : "session-button"
                              }
                              onClick={() =>
                                toggleSchedule(
                                  day,
                                  "evening"
                                )
                              }
                            >
                              {form.schedule[day].evening ? (
                                <Check size={13} />
                              ) : (
                                <X size={13} />
                              )}

                              {form.schedule[day].evening
                                ? "Available"
                                : "Not Available"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="fixed-charge-note">
                <IndianRupee size={14} />

                <span>
                  General ₹{GENERAL_CHARGE} · Tatkal ₹
                  {TATKAL_CHARGE} — fixed for all doctors
                </span>
              </div>

              <div className="appointment-modal-actions">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-save"
                >
                  <Check size={14} />

                  {editingDoctor
                    ? "Save Changes"
                    : "Add Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointment;