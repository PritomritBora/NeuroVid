from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.api import videos, analysis, search
from app.database import init_db

app = FastAPI(title="AI Video Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database
@app.on_event("startup")
async def startup_event():
    init_db()

app.include_router(videos.router, prefix="/api/videos", tags=["videos"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])
app.include_router(search.router, prefix="/api/search", tags=["search"])

@app.get("/")
def root():
    return {"message": "AI Video Intelligence Platform API"}

@app.get("/health")
def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
