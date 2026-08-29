from fastapi import APIRouter
from database import get_db_connection

router = APIRouter(prefix="/api/patient-flow", tags=["Patient Flow"])


@router.get("/overview")
def get_patient_flow_overview():
    return {
        "flowData": [
            {"label": "Admissions", "value": "14", "change": "+12.4%", "trend": "up", "icon": "UserPlus"},
            {"label": "Discharges", "value": "9", "change": "+4.8%", "trend": "up", "icon": "LogOut"},
            {"label": "Net Patient Flow", "value": "+5", "change": "Today", "trend": "up", "icon": "Users"},
            {"label": "Average Wait", "value": "24", "unit": "min", "change": "-6.3%", "trend": "down", "icon": "Clock3"}
        ],
        "departments": [
            {"name": "Emergency", "current": 38, "capacity": 42, "percentage": 90},
            {"name": "Medical", "current": 74, "capacity": 88, "percentage": 84},
            {"name": "Surgical", "current": 51, "capacity": 64, "percentage": 80},
            {"name": "ICU", "current": 23, "capacity": 24, "percentage": 96}
        ],
        "lastUpdated": "2 min ago"
    }
