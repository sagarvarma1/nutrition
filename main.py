from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, nutrition, profile
from app.database import init_db

app = FastAPI(title="Nutrition Tracker API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(nutrition.router, prefix="/api", tags=["nutrition"])
app.include_router(profile.router, prefix="/api", tags=["profile"])

@app.on_event("startup")
async def startup():
    await init_db()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)