from sqlalchemy import Column, String, Float, Integer, DateTime, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Video(Base):
    __tablename__ = "videos"
    
    id = Column(String, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    duration = Column(Float)
    fps = Column(Float)
    width = Column(Integer)
    height = Column(Integer)
    status = Column(String, default="processing")  # processing, completed, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    frames = relationship("Frame", back_populates="video", cascade="all, delete-orphan")
    transcript = relationship("Transcript", back_populates="video", cascade="all, delete-orphan")
    scenes = relationship("Scene", back_populates="video", cascade="all, delete-orphan")
    detections = relationship("Detection", back_populates="video", cascade="all, delete-orphan")

class Frame(Base):
    __tablename__ = "frames"
    
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(String, ForeignKey("videos.id"))
    timestamp = Column(Float, nullable=False)
    frame_path = Column(String)
    embedding_id = Column(String)  # Reference to vector DB
    
    video = relationship("Video", back_populates="frames")

class Transcript(Base):
    __tablename__ = "transcripts"
    
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(String, ForeignKey("videos.id"))
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    text = Column(Text, nullable=False)
    confidence = Column(Float)
    embedding_id = Column(String)  # Reference to vector DB
    
    video = relationship("Video", back_populates="transcript")

class Scene(Base):
    __tablename__ = "scenes"
    
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(String, ForeignKey("videos.id"))
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    summary = Column(Text)
    keyframe_path = Column(String)
    
    video = relationship("Video", back_populates="scenes")

class Detection(Base):
    __tablename__ = "detections"
    
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(String, ForeignKey("videos.id"))
    timestamp = Column(Float, nullable=False)
    object_type = Column(String)  # person, object, action, emotion
    label = Column(String, nullable=False)
    confidence = Column(Float)
    bbox = Column(JSON)  # Bounding box coordinates
    
    video = relationship("Video", back_populates="detections")
