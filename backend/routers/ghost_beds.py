from fastapi import APIRouter
from pydantic import BaseModel
from database import get_db_connection

router = APIRouter(prefix="/api/ghost-beds", tags=["Ghost Bed Auditor"])


class ReconcileRequest(BaseModel):
    bed_id: int


@router.get("/list")
def get_ghost_beds():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM ghost_bed_audits ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": r["id"],
            "ward": r["ward"],
            "bed": r["bed"],
            "patient": r["patient"],
            "system": r["system_status"],
            "physical": r["physical_status"],
            "verified": r["verified"]
        }
        for r in rows
    ]


@router.post("/reconcile")
def reconcile_bed(req: ReconcileRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Reconcile system status to match physical status
    cursor.execute("SELECT * FROM ghost_bed_audits WHERE id = ?", (req.bed_id,))
    row = cursor.fetchone()
    if row:
        phys = row["physical_status"]
        cursor.execute("UPDATE ghost_bed_audits SET system_status = ? WHERE id = ?", (phys, req.bed_id))
        conn.commit()

    conn.close()
    return {"success": True, "reconciled_id": req.bed_id}
