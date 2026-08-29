from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from database import get_db_connection

router = APIRouter(prefix="/api/doctors", tags=["Doctors & Appointments"])


class DoctorScheduleModel(BaseModel):
    name: str
    department: str
    schedule: Dict[str, Dict[str, bool]]


DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def row_to_doctor_dict(row):
    return {
        "id": row["id"],
        "name": row["name"],
        "department": row["department"],
        "schedule": {
            "Monday": {"morning": bool(row["mon_morning"]), "evening": bool(row["mon_evening"])},
            "Tuesday": {"morning": bool(row["tue_morning"]), "evening": bool(row["tue_evening"])},
            "Wednesday": {"morning": bool(row["wed_morning"]), "evening": bool(row["wed_evening"])},
            "Thursday": {"morning": bool(row["thu_morning"]), "evening": bool(row["thu_evening"])},
            "Friday": {"morning": bool(row["fri_morning"]), "evening": bool(row["fri_evening"])},
            "Saturday": {"morning": bool(row["sat_morning"]), "evening": bool(row["sat_evening"])},
            "Sunday": {"morning": bool(row["sun_morning"]), "evening": bool(row["sun_evening"])},
        }
    }


@router.get("")
def list_doctors():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM doctor_schedules ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()
    return [row_to_doctor_dict(r) for r in rows]


@router.post("")
def add_doctor(doc: DoctorScheduleModel):
    conn = get_db_connection()
    cursor = conn.cursor()

    sch = doc.schedule
    mon_m = 1 if sch.get("Monday", {}).get("morning") else 0
    mon_e = 1 if sch.get("Monday", {}).get("evening") else 0
    tue_m = 1 if sch.get("Tuesday", {}).get("morning") else 0
    tue_e = 1 if sch.get("Tuesday", {}).get("evening") else 0
    wed_m = 1 if sch.get("Wednesday", {}).get("morning") else 0
    wed_e = 1 if sch.get("Wednesday", {}).get("evening") else 0
    thu_m = 1 if sch.get("Thursday", {}).get("morning") else 0
    thu_e = 1 if sch.get("Thursday", {}).get("evening") else 0
    fri_m = 1 if sch.get("Friday", {}).get("morning") else 0
    fri_e = 1 if sch.get("Friday", {}).get("evening") else 0
    sat_m = 1 if sch.get("Saturday", {}).get("morning") else 0
    sat_e = 1 if sch.get("Saturday", {}).get("evening") else 0
    sun_m = 1 if sch.get("Sunday", {}).get("morning") else 0
    sun_e = 1 if sch.get("Sunday", {}).get("evening") else 0

    cursor.execute("""
    INSERT INTO doctor_schedules (
        name, department, mon_morning, mon_evening, tue_morning, tue_evening,
        wed_morning, wed_evening, thu_morning, thu_evening,
        fri_morning, fri_evening, sat_morning, sat_evening, sun_morning, sun_evening
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        doc.name, doc.department,
        mon_m, mon_e, tue_m, tue_e, wed_m, wed_e,
        thu_m, thu_e, fri_m, fri_e, sat_m, sat_e, sun_m, sun_e
    ))
    new_id = cursor.lastrowid
    conn.commit()

    cursor.execute("SELECT * FROM doctor_schedules WHERE id = ?", (new_id,))
    row = cursor.fetchone()
    conn.close()
    return row_to_doctor_dict(row)


@router.put("/{doctor_id}")
def update_doctor(doctor_id: int, doc: DoctorScheduleModel):
    conn = get_db_connection()
    cursor = conn.cursor()

    sch = doc.schedule
    mon_m = 1 if sch.get("Monday", {}).get("morning") else 0
    mon_e = 1 if sch.get("Monday", {}).get("evening") else 0
    tue_m = 1 if sch.get("Tuesday", {}).get("morning") else 0
    tue_e = 1 if sch.get("Tuesday", {}).get("evening") else 0
    wed_m = 1 if sch.get("Wednesday", {}).get("morning") else 0
    wed_e = 1 if sch.get("Wednesday", {}).get("evening") else 0
    thu_m = 1 if sch.get("Thursday", {}).get("morning") else 0
    thu_e = 1 if sch.get("Thursday", {}).get("evening") else 0
    fri_m = 1 if sch.get("Friday", {}).get("morning") else 0
    fri_e = 1 if sch.get("Friday", {}).get("evening") else 0
    sat_m = 1 if sch.get("Saturday", {}).get("morning") else 0
    sat_e = 1 if sch.get("Saturday", {}).get("evening") else 0
    sun_m = 1 if sch.get("Sunday", {}).get("morning") else 0
    sun_e = 1 if sch.get("Sunday", {}).get("evening") else 0

    cursor.execute("""
    UPDATE doctor_schedules SET
        name = ?, department = ?,
        mon_morning = ?, mon_evening = ?, tue_morning = ?, tue_evening = ?,
        wed_morning = ?, wed_evening = ?, thu_morning = ?, thu_evening = ?,
        fri_morning = ?, fri_evening = ?, sat_morning = ?, sat_evening = ?,
        sun_morning = ?, sun_evening = ?
    WHERE id = ?
    """, (
        doc.name, doc.department,
        mon_m, mon_e, tue_m, tue_e, wed_m, wed_e,
        thu_m, thu_e, fri_m, fri_e, sat_m, sat_e, sun_m, sun_e,
        doctor_id
    ))
    conn.commit()

    cursor.execute("SELECT * FROM doctor_schedules WHERE id = ?", (doctor_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Doctor not found")

    return row_to_doctor_dict(row)


@router.delete("/{doctor_id}")
def delete_doctor(doctor_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM doctor_schedules WHERE id = ?", (doctor_id,))
    conn.commit()
    conn.close()
    return {"success": True, "deleted_id": doctor_id}
