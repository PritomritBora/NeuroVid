from typing import List, Dict
from sqlalchemy.orm import Session
from transformers import pipeline
import cv2
from pathlib import Path

from ..models.database import Video, Detection

class EmotionAnalyzer:
    def __init__(self):
        self.emotion_classifier = None
    
    def _load_model(self):
        """Lazy load emotion detection model"""
        if self.emotion_classifier is None:
            try:
                # Use a lightweight emotion classifier
                self.emotion_classifier = pipeline(
                    "text-classification",
                    model="j-hartmann/emotion-english-distilroberta-base",
                    top_k=None
                )
            except Exception as e:
                print(f"Failed to load emotion model: {e}")
                self.emotion_classifier = None
        return self.emotion_classifier
    
    async def analyze(self, video_id: str, db: Session) -> List[Dict]:
        """Analyze emotions from transcript text"""
        model = self._load_model()
        if model is None:
            return []
        
        # Get transcript segments
        from ..models.database import Transcript
        transcripts = db.query(Transcript).filter(
            Transcript.video_id == video_id
        ).order_by(Transcript.start_time).all()
        
        emotions_data = []
        
        for transcript in transcripts[:30]:  # Limit for performance
            if not transcript.text or len(transcript.text.strip()) < 10:
                continue
            
            try:
                # Analyze emotion from text
                results = model(transcript.text[:512])  # Limit text length
                
                if results and len(results[0]) > 0:
                    top_emotion = max(results[0], key=lambda x: x['score'])
                    
                    # Save to database
                    detection = Detection(
                        video_id=video_id,
                        timestamp=transcript.start_time,
                        object_type="emotion",
                        label=top_emotion['label'],
                        confidence=top_emotion['score']
                    )
                    db.add(detection)
                    
                    emotions_data.append({
                        "timestamp": transcript.start_time,
                        "emotion": top_emotion['label'],
                        "confidence": top_emotion['score']
                    })
            except Exception as e:
                print(f"Error analyzing emotion: {e}")
                continue
        
        db.commit()
        return emotions_data
