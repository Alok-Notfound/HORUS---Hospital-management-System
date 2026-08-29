import os
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import init_database

from routers.dashboard import router as dashboard_router
from routers.ai_insight import router as ai_router
from routers.patient_flow import router as patient_flow_router
from routers.appointments import router as appointments_router
from routers.diagnostics import router as diagnostics_router
from routers.ghost_beds import router as ghost_beds_router
from routers.pharmacy import router as pharmacy_router
from routers.auth_profile import router as auth_profile_router

# Initialize SQLite database on startup
init_database()

app = FastAPI(
    title="HORUS Hospital Operations Platform",
    description="Unified Full-Stack System for Hospital Intelligence, Flow Management, and Auditing",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(dashboard_router)
app.include_router(ai_router)
app.include_router(patient_flow_router)
app.include_router(appointments_router)
app.include_router(diagnostics_router)
app.include_router(ghost_beds_router)
app.include_router(pharmacy_router)
app.include_router(auth_profile_router)


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "HORUS Unified Server",
        "version": "1.0.0"
    }


# Path to frontend production build
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST = os.path.join(os.path.dirname(BASE_DIR), "frontend", "dist")

# Mount static assets folder
assets_dir = os.path.join(FRONTEND_DIST, "assets")
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")


# SPA Catch-All Route: Serves the React frontend for all client-side routes
@app.get("/{full_path:path}")
async def serve_spa(request: Request, full_path: str):
    # If file exists in dist (e.g. favicon.svg, icons.svg)
    file_path = os.path.join(FRONTEND_DIST, full_path)
    if full_path and os.path.isfile(file_path):
        return FileResponse(file_path)
    # Default to index.html for React Router DOM pushState routing
    index_path = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {
        "message": "HORUS API Engine is running. Frontend build not found in frontend/dist. Please run 'npm run build' in frontend folder."
    }


if __name__ == "__main__":
    print("==========================================================")
    print("  HORUS is live at: http://localhost:5000")
    print("  Interactive Swagger Docs: http://localhost:5000/docs")
    print("==========================================================")
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=False)
