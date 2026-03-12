import cv2
from typing import List, Dict
from pathlib import Path
from scenedetect import detect, ContentDetector, AdaptiveDetector
from sqlalchemy.orm import Session

from ..models.database import Video, Scene, Detection
from ..config import settings

class SceneDetector:
    def __init__(self):
        self.yolo_model = None
    
    def _load_yolo(self):
        """Lazy load YOLO model"""
        if self.yolo_model is None:
            try:
                import torch
                # Use YOLOv5 from torch hub
                self.yolo_model = torch.hub.load('ultralytics/yolov5', 'yolov5s', pretrained=True)
                self.yolo_model.eval()
            except Exception as e:
                print(f"Failed to load YOLO: {e}")
                self.yolo_model = None
        return self.yolo_model
    
    async def detect(self, video_id: str, db: Session) -> List[Dict]:
        """Detect scenes in video using PySceneDetect"""
        video = db.query(Video).filter(Video.id == video_id).first()
        if not video:
            return []
        
        # Detect scenes
        scene_list = detect(video.filepath, ContentDetector())
        
        # Save scenes to database
        scenes_data = []
        for i, scene in enumerate(scene_list):
            start_time = scene[0].get_seconds()
            end_time = scene[1].get_seconds()
            
            # Extract keyframe from middle of scene
            mid_time = (start_time + end_time) / 2
            keyframe_path = await self._extract_keyframe(video.filepath, video_id, mid_time, i)
            
            scene_obj = Scene(
                video_id=video_id,
                start_time=start_time,
                end_time=end_time,
                summary=f"Scene {i+1}",
                keyframe_path=keyframe_path
            )
            db.add(scene_obj)
            
            scenes_data.append({
                "start_time": start_time,
                "end_time": end_time,
                "duration": end_time - start_time,
                "keyframe": keyframe_path
            })
        
        db.commit()
        return scenes_data
    
    async def _extract_keyframe(self, video_path: str, video_id: str, timestamp: float, scene_idx: int) -> str:
        """Extract a single keyframe at timestamp"""
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_number = int(timestamp * fps)
        
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
        ret, frame = cap.read()
        cap.release()
        
        if ret:
            keyframe_dir = Path(settings.FRAMES_DIR) / video_id / "scenes"
            keyframe_dir.mkdir(parents=True, exist_ok=True)
            keyframe_path = keyframe_dir / f"scene_{scene_idx:03d}.jpg"
            cv2.imwrite(str(keyframe_path), frame)
            return str(keyframe_path)
        
        return ""
    
    async def detect_objects(self, video_id: str, db: Session) -> List[Dict]:
        """Detect objects in video frames using YOLO"""
        model = self._load_yolo()
        if model is None:
            return []
        
        video = db.query(Video).filter(Video.id == video_id).first()
        if not video:
            return []
        
        # Get frames from database
        from ..models.database import Frame
        frames = db.query(Frame).filter(Frame.video_id == video_id).all()
        
        detections_data = []
        
        for frame in frames[:20]:  # Limit to first 20 frames for performance
            if not Path(frame.frame_path).exists():
                continue
            
            # Run YOLO detection
            results = model(frame.frame_path)
            
            # Parse results
            for *box, conf, cls in results.xyxy[0].cpu().numpy():
                label = model.names[int(cls)]
                
                detection = Detection(
                    video_id=video_id,
                    timestamp=frame.timestamp,
                    object_type="object",
                    label=label,
                    confidence=float(conf),
                    bbox={
                        "x1": float(box[0]),
                        "y1": float(box[1]),
                        "x2": float(box[2]),
                        "y2": float(box[3])
                    }
                )
                db.add(detection)
                
                detections_data.append({
                    "timestamp": frame.timestamp,
                    "label": label,
                    "confidence": float(conf)
                })
        
        db.commit()
        return detections_data
