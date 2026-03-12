from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.video_search import VideoSearch

router = APIRouter()
video_search = VideoSearch()

class SearchQuery(BaseModel):
    query: str
    video_id: str

@router.post("/query")
async def search_video(request: SearchQuery):
    """Search video content with natural language query"""
    results = await video_search.query(request.video_id, request.query)
    return {"video_id": request.video_id, "query": request.query, "results": results}
