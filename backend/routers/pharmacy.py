from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_db_connection

router = APIRouter(prefix="/api/pharmacy", tags=["Pharmacy Discrepancy Ledger"])


class MedicineModel(BaseModel):
    name: str
    stock: int
    expiry: str
    status: str


@router.get("/medicines")
def get_medicines():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM pharmacy_ledger ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": r["id"],
            "name": r["name"],
            "stock": r["stock"],
            "expiry": r["expiry"],
            "status": r["status"]
        }
        for r in rows
    ]


@router.post("/medicines")
def add_medicine(med: MedicineModel):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO pharmacy_ledger (name, stock, expiry, status)
    VALUES (?, ?, ?, ?)
    """, (med.name, med.stock, med.expiry, med.status))
    new_id = cursor.lastrowid
    conn.commit()

    cursor.execute("SELECT * FROM pharmacy_ledger WHERE id = ?", (new_id,))
    row = cursor.fetchone()
    conn.close()

    return {
        "id": row["id"],
        "name": row["name"],
        "stock": row["stock"],
        "expiry": row["expiry"],
        "status": row["status"]
    }


@router.put("/medicines/{med_id}")
def update_medicine(med_id: int, med: MedicineModel):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    UPDATE pharmacy_ledger SET
        name = ?, stock = ?, expiry = ?, status = ?
    WHERE id = ?
    """, (med.name, med.stock, med.expiry, med.status, med_id))
    conn.commit()

    cursor.execute("SELECT * FROM pharmacy_ledger WHERE id = ?", (med_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Medicine not found")

    return {
        "id": row["id"],
        "name": row["name"],
        "stock": row["stock"],
        "expiry": row["expiry"],
        "status": row["status"]
    }


@router.delete("/medicines/{med_id}")
def delete_medicine(med_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM pharmacy_ledger WHERE id = ?", (med_id,))
    conn.commit()
    conn.close()
    return {"success": True, "deleted_id": med_id}
