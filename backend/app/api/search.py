from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from ..services.video_search import VideoSearch
from ..database import get_db

router = APIRouter()
video_search = VideoSearch()

class SearchQuery(BaseModel):
    query: str
    video_id: str

@router.post("/query")
async def search_video(request: SearchQuery, db: Session = Depends(get_db)):
    """Search video content with natural language query"""
    results = await video_search.query(request.video_id, request.query, db)
    return {"video_id": request.video_id, "query": request.query, "results": results}
