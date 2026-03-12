from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class VideoUploadResponse(BaseModel):
    video_id: str
    status: str

class VideoResponse(BaseModel):
    video_id: str
    filename: str
    status: str
    duration: Optional[float] = None
    created_at: datetime

class Scene(BaseModel):
    start_time: float
    end_time: float
    summary: str
    keyframe_url: Optional[str] = None

class EmotionData(BaseModel):
    timestamp: float
    emotion: str
    confidence: float

class EmotionAnalysisResponse(BaseModel):
    video_id: str
    emotions: List[EmotionData]

class SearchResult(BaseModel):
    timestamp: float
    clip_url: str
    relevance_score: float
    description: str
