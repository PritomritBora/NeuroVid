from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import Optional
import shutil
from pathlib import Path
from sqlalchemy.orm import Session

from ..services.video_processor import VideoProcessor
from ..services.video_search import VideoSearch
from ..models.schemas import VideoResponse, VideoUploadResponse
from ..database import get_db
from ..config import settings

router = APIRouter()
video_processor = VideoProcessor()
video_search = VideoSearch()

UPLOAD_DIR = Path(settings.UPLOAD_DIR)
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload", response_model=VideoUploadResponse)
async def upload_video(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload a video file for processing"""
    try:
        video_path = UPLOAD_DIR / file.filename
        with video_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        video_id = await video_processor.process_upload(str(video_path), file.filename, db)
        
        # Index video for search in background thread
        import threading
        def index_in_background():
            from ..database import SessionLocal
            db_new = SessionLocal()
            try:
                import asyncio
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                loop.run_until_complete(video_search.index_video(video_id, db_new))
            finally:
                db_new.close()
        
        thread = threading.Thread(target=index_in_background)
        thread.daemon = True
        thread.start()
        
        return VideoUploadResponse(video_id=video_id, status="processing")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{video_id}", response_model=VideoResponse)
async def get_video(video_id: str, db: Session = Depends(get_db)):
    """Get video metadata and processing status"""
    video = await video_processor.get_video(video_id, db)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    return VideoResponse(
        video_id=video.id,
        filename=video.filename,
        status=video.status,
        duration=video.duration,
        created_at=video.created_at
    )

@router.get("/{video_id}/summary")
async def get_summary(video_id: str, summary_type: str = "full", db: Session = Depends(get_db)):
    """Get video summary (scene-level or full)"""
    summary = await video_processor.generate_summary(video_id, summary_type, db)
    return {"video_id": video_id, "summary": summary, "type": summary_type}

@router.get("/{video_id}/transcript")
async def get_transcript(video_id: str, db: Session = Depends(get_db)):
    """Get video transcript with timestamps"""
    transcript = await video_processor.get_transcript(video_id, db)
    return {"video_id": video_id, "transcript": transcript}

@router.get("/{video_id}/timeline")
async def get_timeline(video_id: str, db: Session = Depends(get_db)):
    """Get interactive timeline with key events"""
    timeline = await video_processor.generate_timeline(video_id, db)
    return {"video_id": video_id, "timeline": timeline}

@router.get("/{video_id}/stream")
async def stream_video(video_id: str, db: Session = Depends(get_db)):
    """Stream video file with range request support for seeking"""
    from fastapi.responses import FileResponse
    from fastapi import Request
    
    video = await video_processor.get_video(video_id, db)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    video_path = Path(video.filepath)
    if not video_path.exists():
        raise HTTPException(status_code=404, detail="Video file not found")
    
    # FileResponse automatically handles range requests for video seeking
    return FileResponse(
        video_path, 
        media_type="video/mp4",
        headers={
            "Accept-Ranges": "bytes",
            "Cache-Control": "no-cache"
        }
    )
