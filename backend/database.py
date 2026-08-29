import os
import sqlite3
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(os.path.dirname(BASE_DIR), "data")
DB_PATH = os.path.join(BASE_DIR, "horus.db")


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_database():
    os.makedirs(BASE_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='departments'")
    table_exists = cursor.fetchone()

    if not table_exists:
        print("[Database] Ingesting CSV datasets into SQLite...")

        dep_csv = os.path.join(DATA_DIR, "department.csv")
        if os.path.exists(dep_csv):
            pd.read_csv(dep_csv).to_sql("departments", conn, if_exists="replace", index=False)

        ward_csv = os.path.join(DATA_DIR, "ward.csv")
        if os.path.exists(ward_csv):
            pd.read_csv(ward_csv).to_sql("wards", conn, if_exists="replace", index=False)

        bed_csv = os.path.join(DATA_DIR, "bed.csv")
        if os.path.exists(bed_csv):
            pd.read_csv(bed_csv).to_sql("beds", conn, if_exists="replace", index=False)

        emp_csv = os.path.join(DATA_DIR, "employee.csv")
        if os.path.exists(emp_csv):
            pd.read_csv(emp_csv).to_sql("employees", conn, if_exists="replace", index=False)

        doc_csv = os.path.join(DATA_DIR, "doctor.csv")
        if os.path.exists(doc_csv):
            pd.read_csv(doc_csv).to_sql("doctors", conn, if_exists="replace", index=False)

        diag_test_csv = os.path.join(DATA_DIR, "diagnostic_test.csv")
        if os.path.exists(diag_test_csv):
            pd.read_csv(diag_test_csv).to_sql("diagnostic_tests", conn, if_exists="replace", index=False)

        diag_res_csv = os.path.join(DATA_DIR, "patient_diagnostic.csv")
        if os.path.exists(diag_res_csv):
            pd.read_csv(diag_res_csv).to_sql("patient_diagnostics", conn, if_exists="replace", index=False)

        drug_csv = os.path.join(DATA_DIR, "drug.csv")
        if os.path.exists(drug_csv):
            pd.read_csv(drug_csv).to_sql("drugs", conn, if_exists="replace", index=False)

        drug_inv_csv = os.path.join(DATA_DIR, "drug_inventory.csv")
        if os.path.exists(drug_inv_csv):
            pd.read_csv(drug_inv_csv).to_sql("drug_inventory", conn, if_exists="replace", index=False)

        pat_csv = os.path.join(DATA_DIR, "patient.csv")
        if os.path.exists(pat_csv):
            pd.read_csv(pat_csv).to_sql("patients", conn, if_exists="replace", index=False)

        adm_csv = os.path.join(DATA_DIR, "admission.csv")
        if os.path.exists(adm_csv):
            pd.read_csv(adm_csv).to_sql("admissions", conn, if_exists="replace", index=False)

        dis_csv = os.path.join(DATA_DIR, "disease.csv")
        if os.path.exists(dis_csv):
            pd.read_csv(dis_csv).to_sql("diseases", conn, if_exists="replace", index=False)

        bill_csv = os.path.join(DATA_DIR, "billing.csv")
        if os.path.exists(bill_csv):
            pd.read_csv(bill_csv).to_sql("billing", conn, if_exists="replace", index=False)

        cursor.execute("CREATE INDEX IF NOT EXISTS idx_adm_status ON admissions(admission_status)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_bed_ward ON beds(ward_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_pat_diag_adm ON patient_diagnostics(admission_id)")

    # Doctor Schedules table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS doctor_schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        mon_morning INTEGER DEFAULT 0,
        mon_evening INTEGER DEFAULT 0,
        tue_morning INTEGER DEFAULT 0,
        tue_evening INTEGER DEFAULT 0,
        wed_morning INTEGER DEFAULT 0,
        wed_evening INTEGER DEFAULT 0,
        thu_morning INTEGER DEFAULT 0,
        thu_evening INTEGER DEFAULT 0,
        fri_morning INTEGER DEFAULT 0,
        fri_evening INTEGER DEFAULT 0,
        sat_morning INTEGER DEFAULT 0,
        sat_evening INTEGER DEFAULT 0,
        sun_morning INTEGER DEFAULT 0,
        sun_evening INTEGER DEFAULT 0
    )
    """)

    cursor.execute("SELECT COUNT(*) FROM doctor_schedules")
    if cursor.fetchone()[0] == 0:
        initial_doctors = [
            (1, "Dr. Ananya Sharma", "Cardiology", 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0),
            (2, "Dr. Rajiv Mehta", "Orthopedics", 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0),
            (3, "Dr. Priya Nair", "General Medicine", 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0),
            (4, "Dr. Vikram Sethi", "Neurology", 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0),
            (5, "Dr. Sneha Roy", "Pediatrics", 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0),
        ]
        cursor.executemany("""
        INSERT INTO doctor_schedules (
            id, name, department, mon_morning, mon_evening, tue_morning, tue_evening,
            wed_morning, wed_evening, thu_morning, thu_evening,
            fri_morning, fri_evening, sat_morning, sat_evening, sun_morning, sun_evening
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, initial_doctors)

    # Pharmacy Ledger table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS pharmacy_ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        stock INTEGER NOT NULL,
        expiry TEXT NOT NULL,
        status TEXT NOT NULL
    )
    """)

    cursor.execute("SELECT COUNT(*) FROM pharmacy_ledger")
    if cursor.fetchone()[0] == 0:
        initial_medicines = [
            (1, "Paracetamol 500mg", 3000, "2027-08-12", "in-stock"),
            (2, "Amoxicillin 250mg", 1500, "2026-09-04", "in-stock"),
            (3, "Azithromycin 500mg", 0, "2027-01-19", "out-of-stock"),
            (4, "Cefixime 200mg", 820, "2026-10-18", "in-stock"),
            (5, "Metformin 500mg", 2140, "2028-02-25", "in-stock"),
            (6, "Insulin Glargine", 460, "2026-09-22", "in-stock"),
            (7, "Pantoprazole 40mg", 0, "2027-05-14", "out-of-stock"),
            (8, "Atorvastatin 20mg", 950, "2027-11-30", "in-stock"),
        ]
        cursor.executemany("""
        INSERT INTO pharmacy_ledger (id, name, stock, expiry, status)
        VALUES (?, ?, ?, ?, ?)
        """, initial_medicines)

    # Ghost Bed Audits table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ghost_bed_audits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ward TEXT NOT NULL,
        bed TEXT NOT NULL,
        patient TEXT NOT NULL,
        system_status TEXT NOT NULL,
        physical_status TEXT NOT NULL,
        verified TEXT NOT NULL
    )
    """)

    cursor.execute("SELECT COUNT(*) FROM ghost_bed_audits")
    if cursor.fetchone()[0] == 0:
        initial_beds = [
            (1, "ICU", "ICU-01", "Rahul Kumar", "Occupied", "Occupied", "09:42 AM"),
            (2, "ICU", "ICU-02", "—", "Occupied", "Empty", "09:38 AM"),
            (3, "ICU", "ICU-03", "Priya Singh", "Occupied", "Occupied", "09:35 AM"),
            (4, "Medicine", "MED-11", "Amit Verma", "Occupied", "Occupied", "09:31 AM"),
            (5, "Medicine", "MED-14", "Suresh Das", "Empty", "Occupied", "09:28 AM"),
            (6, "Medicine", "MED-15", "—", "Empty", "Empty", "09:25 AM"),
            (7, "Surgery", "SUR-07", "Neha Gupta", "Occupied", "Occupied", "09:21 AM"),
            (8, "Surgery", "SUR-08", "—", "Empty", "Empty", "09:17 AM"),
            (9, "Pediatrics", "PED-03", "Arjun Singh", "Occupied", "Occupied", "09:12 AM"),
            (10, "Pediatrics", "PED-04", "—", "Occupied", "Empty", "09:08 AM"),
        ]
        cursor.executemany("""
        INSERT INTO ghost_bed_audits (id, ward, bed, patient, system_status, physical_status, verified)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, initial_beds)

    conn.commit()
    conn.close()
    print("[Database] SQLite initialized successfully.")
