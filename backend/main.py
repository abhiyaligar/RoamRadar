from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api.routes import auth, users, trips, stops, activities, shared

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
app.include_router(trips.router, prefix="/api/v1/trips", tags=["trips"])
app.include_router(stops.router, prefix="/api/v1/stops", tags=["stops"])
app.include_router(activities.router, prefix="/api/v1/activities", tags=["activities"])
app.include_router(shared.router, prefix="/api/v1/shared", tags=["shared"])

@app.get("/")
def root():
    return {"message": "Welcome to the RoamRadar API"}
