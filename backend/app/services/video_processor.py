import cv2
import uuid
import whisper
import asyncio
from pathlib import Path
from typing import Optional, Dict, List
try:
    from moviepy import VideoFileClip
except ImportError:
    from moviepy.editor import VideoFileClip
from sqlalchemy.orm import Session

from ..models.database import Video, Frame, Transcript
from ..config import settings

class VideoProcessor:
    def __init__(self):
        self.whisper_model = None
        self._ensure_dirs()
    
    def _ensure_dirs(self):
        """Create necessary directories"""
        Path(settings.UPLOAD_DIR).mkdir(exist_ok=True)
        Path(settings.FRAMES_DIR).mkdir(exist_ok=True)
        Path(settings.AUDIO_DIR).mkdir(exist_ok=True)
    
    def _load_whisper(self):
        """Lazy load Whisper model"""
        if self.whisper_model is None:
            self.whisper_model = whisper.load_model(settings.WHISPER_MODEL)
        return self.whisper_model
    
    async def process_upload(self, video_path: str, filename: str, db: Session) -> str:
        """Process uploaded video and extract metadata"""
        video_id = str(uuid.uuid4())
        
        # Extract basic metadata
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        duration = frame_count / fps if fps > 0 else 0
        cap.release()
        
        # Save to database
        video = Video(
            id=video_id,
            filename=filename,
            filepath=video_path,
            duration=duration,
            fps=fps,
            width=width,
            height=height,
            status="processing"
        )
        db.add(video)
        db.commit()
        
        # Trigger async processing in background
        import threading
        thread = threading.Thread(target=self._process_pipeline_sync, args=(video_id, video_path))
        thread.daemon = True
        thread.start()
        
        return video_id
    
    def _process_pipeline_sync(self, video_id: str, video_path: str):
        """Synchronous wrapper for background processing with new DB session"""
        from ..database import SessionLocal
        db = SessionLocal()
        try:
            import asyncio
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            loop.run_until_complete(self._process_pipeline(video_id, video_path, db))
        finally:
            db.close()
    
    async def _process_pipeline(self, video_id: str, video_path: str, db: Session):
        """Background processing pipeline"""
        try:
            # Extract keyframes
            await self.extract_keyframes(video_id, video_path, db)
            
            # Extract and transcribe audio
            await self.transcribe_audio(video_id, video_path, db)
            
            # Update status
            video = db.query(Video).filter(Video.id == video_id).first()
            if video:
                video.status = "completed"
                db.commit()
        except Exception as e:
            print(f"Processing failed for {video_id}: {e}")
            video = db.query(Video).filter(Video.id == video_id).first()
            if video:
                video.status = "failed"
                db.commit()
    
    async def extract_keyframes(self, video_id: str, video_path: str, db: Session, interval: int = 2):
        """Extract keyframes at regular intervals"""
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_interval = int(fps * interval)
        
        frame_dir = Path(settings.FRAMES_DIR) / video_id
        frame_dir.mkdir(exist_ok=True)
        
        frame_count = 0
        saved_count = 0
        
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            if frame_count % frame_interval == 0:
                timestamp = frame_count / fps
                frame_path = frame_dir / f"frame_{saved_count:06d}.jpg"
                cv2.imwrite(str(frame_path), frame)
                
                # Save to database
                db_frame = Frame(
                    video_id=video_id,
                    timestamp=timestamp,
                    frame_path=str(frame_path)
                )
                db.add(db_frame)
                saved_count += 1
            
            frame_count += 1
        
        cap.release()
        db.commit()
        print(f"Extracted {saved_count} keyframes for video {video_id}")
    
    async def transcribe_audio(self, video_id: str, video_path: str, db: Session):
        """Extract audio and transcribe with Whisper"""
        # Extract audio
        audio_path = Path(settings.AUDIO_DIR) / f"{video_id}.mp3"
        video_clip = VideoFileClip(video_path)
        video_clip.audio.write_audiofile(str(audio_path), logger=None)
        video_clip.close()
        
        # Transcribe with Whisper
        model = self._load_whisper()
        result = model.transcribe(str(audio_path), word_timestamps=True)
        
        # Save segments to database
        for segment in result["segments"]:
            transcript = Transcript(
                video_id=video_id,
                start_time=segment["start"],
                end_time=segment["end"],
                text=segment["text"].strip(),
                confidence=segment.get("confidence", 0.0)
            )
            db.add(transcript)
        
        db.commit()
        print(f"Transcribed {len(result['segments'])} segments for video {video_id}")
    
    async def get_video(self, video_id: str, db: Session) -> Optional[Video]:
        """Get video metadata"""
        return db.query(Video).filter(Video.id == video_id).first()
    
    async def get_transcript(self, video_id: str, db: Session) -> List[Dict]:
        """Get video transcript"""
        # Refresh session to see latest data
        db.expire_all()
        
        transcripts = db.query(Transcript).filter(
            Transcript.video_id == video_id
        ).order_by(Transcript.start_time).all()
        
        return [
            {
                "start_time": t.start_time,
                "end_time": t.end_time,
                "text": t.text,
                "confidence": t.confidence
            }
            for t in transcripts
        ]
    
    async def generate_summary(self, video_id: str, summary_type: str, db: Session) -> str:
        """Generate video summary from transcript"""
        transcripts = await self.get_transcript(video_id, db)
        
        if not transcripts:
            return "No transcript available for summary."
        
        full_text = " ".join([t["text"] for t in transcripts])
        
        # Simple extractive summary (first 500 chars)
        # TODO: Integrate with LLM for better summarization
        if summary_type == "brief":
            return full_text[:500] + "..." if len(full_text) > 500 else full_text
        else:
            return full_text
    
    async def generate_timeline(self, video_id: str, db: Session) -> List[Dict]:
        """Generate interactive timeline from scenes and transcript"""
        from ..models.database import Scene
        
        scenes = db.query(Scene).filter(
            Scene.video_id == video_id
        ).order_by(Scene.start_time).all()
        
        timeline = []
        for scene in scenes:
            timeline.append({
                "timestamp": scene.start_time,
                "type": "scene",
                "description": scene.summary or "Scene change",
                "keyframe": scene.keyframe_path
            })
        
        # Add transcript highlights
        transcripts = db.query(Transcript).filter(
            Transcript.video_id == video_id
        ).order_by(Transcript.start_time).limit(10).all()
        
        for t in transcripts:
            timeline.append({
                "timestamp": t.start_time,
                "type": "transcript",
                "description": t.text[:100]
            })
        
        return sorted(timeline, key=lambda x: x["timestamp"])
