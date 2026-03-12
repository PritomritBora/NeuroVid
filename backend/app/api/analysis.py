from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from ..services.scene_detector import SceneDetector
from ..services.emotion_analyzer import EmotionAnalyzer
from ..models.schemas import EmotionAnalysisResponse
from ..database import get_db

router = APIRouter()
scene_detector = SceneDetector()
emotion_analyzer = EmotionAnalyzer()

@router.get("/{video_id}/scenes")
async def detect_scenes(video_id: str, db: Session = Depends(get_db)):
    """Detect scenes and key events in video"""
    scenes = await scene_detector.detect(video_id, db)
    return {"video_id": video_id, "scenes": scenes}

@router.get("/{video_id}/objects")
async def detect_objects(video_id: str, db: Session = Depends(get_db)):
    """Detect objects and actions in video"""
    objects = await scene_detector.detect_objects(video_id, db)
    return {"video_id": video_id, "objects": objects}

@router.get("/{video_id}/emotions", response_model=EmotionAnalysisResponse)
async def analyze_emotions(video_id: str, db: Session = Depends(get_db)):
    """Analyze emotions throughout video"""
    emotions = await emotion_analyzer.analyze(video_id, db)
    return EmotionAnalysisResponse(video_id=video_id, emotions=emotions)
