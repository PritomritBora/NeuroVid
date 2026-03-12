from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Optional
import shutil
from pathlib import Path

from ..services.video_processor import VideoProcessor
from ..models.schemas import VideoResponse, VideoUploadResponse

router = APIRouter()
video_processor = VideoProcessor()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload", response_model=VideoUploadResponse)
async def upload_video(file: UploadFile = File(...)):
    """Upload a video file for processing"""
    try:
        video_path = UPLOAD_DIR / file.filename
        with video_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        video_id = await video_processor.process_upload(str(video_path))
        return VideoUploadResponse(video_id=video_id, status="processing")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{video_id}", response_model=VideoResponse)
async def get_video(video_id: str):
    """Get video metadata and processing status"""
    video = await video_processor.get_video(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video

@router.get("/{video_id}/summary")
async def get_summary(video_id: str, summary_type: str = "full"):
    """Get video summary (scene-level or full)"""
    summary = await video_processor.generate_summary(video_id, summary_type)
    return {"video_id": video_id, "summary": summary, "type": summary_type}

@router.get("/{video_id}/transcript")
async def get_transcript(video_id: str):
    """Get video transcript with timestamps"""
    transcript = await video_processor.get_transcript(video_id)
    return {"video_id": video_id, "transcript": transcript}

@router.get("/{video_id}/timeline")
async def get_timeline(video_id: str):
    """Get interactive timeline with key events"""
    timeline = await video_processor.generate_timeline(video_id)
    return {"video_id": video_id, "timeline": timeline}
