from fastapi import APIRouter
from database import get_db_connection

router = APIRouter(prefix="/api/diagnostics", tags=["Diagnostic Turnaround"])


@router.get("/metrics")
def get_diagnostic_metrics():
    return [
        {"title": "Avg Lab TAT", "value": "2.1", "unit": "hrs", "change": "0.4h", "detail": "vs Target: 2.5 hrs", "type": "good", "icon": "Beaker"},
        {"title": "Imaging TAT", "value": "3.4", "unit": "hrs", "change": "0.6h", "detail": "vs Target: 4.0 hrs", "type": "good", "icon": "Activity"},
        {"title": "Critical Result Alerts", "value": "3", "unit": "", "change": "Active", "detail": "Avg Response: 12m", "type": "alert", "icon": "AlertTriangle"},
        {"title": "SLA Compliance", "value": "94.2", "unit": "%", "change": "", "detail": "Target: 95%", "type": "compliance", "icon": "CheckCircle2"}
    ]


@router.get("/heatmap")
def get_diagnostic_heatmap():
    return [
        {
            "department": "ER",
            "values": [
                {"value": "0.8", "level": "low"},
                {"value": "2.5", "level": "medium"},
                {"value": "4.2", "level": "high"},
                {"value": "0.5", "level": "low"}
            ]
        },
        {
            "department": "ICU",
            "values": [
                {"value": "1.1", "level": "low"},
                {"value": "-", "level": "empty"},
                {"value": "2.8", "level": "medium"},
                {"value": "0.9", "level": "low"}
            ]
        },
        {
            "department": "Oncol",
            "values": [
                {"value": "2.1", "level": "medium"},
                {"value": "5.1", "level": "critical"},
                {"value": "3.0", "level": "medium"},
                {"value": "1.2", "level": "low"}
            ]
        },
        {
            "department": "Cardio",
            "values": [
                {"value": "1.5", "level": "low"},
                {"value": "3.2", "level": "medium"},
                {"value": "2.5", "level": "medium"},
                {"value": "1.0", "level": "low"}
            ]
        }
    ]


@router.get("/queue")
def get_diagnostic_queue():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
        SELECT 
            pd.patient_diagnostic_id,
            pd.test_date,
            pd.result_status,
            t.test_name,
            t.test_category
        FROM patient_diagnostics pd
        LEFT JOIN diagnostic_tests t ON pd.test_id = t.test_id
        LIMIT 10
        """)
        rows = cursor.fetchall()
        conn.close()

        queue = []
        for r in rows:
            queue.append({
                "id": f"PT-{r['patient_diagnostic_id'] + 88300}",
                "test": r["test_name"] or "CBC & Metabolic Panel",
                "category": r["test_category"] or "Biochemistry",
                "ordered": r["test_date"],
                "status": r["result_status"] or "Normal"
            })
        return queue
    except Exception:
        if conn:
            conn.close()
        return [
            {"id": "PT-88392", "test": "Cardiac Troponin I", "category": "Biochemistry", "ordered": "08:15 AM", "status": "Critical"},
            {"id": "PT-88393", "test": "Chest X-Ray (AP)", "category": "Radiology", "ordered": "08:30 AM", "status": "Normal"},
            {"id": "PT-88394", "test": "Brain CT Angiography", "category": "Radiology", "ordered": "08:45 AM", "status": "Pending"}
        ]
