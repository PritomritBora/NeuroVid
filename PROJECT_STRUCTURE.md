# Project Structure

```
ai-video-intelligence/
├── backend/                          # FastAPI Backend
│   ├── app/
│   │   ├── api/                      # API Routes
│   │   │   ├── videos.py            # Video upload, streaming, metadata
│   │   │   ├── analysis.py          # Scene, object, emotion detection
│   │   │   └── search.py            # Semantic search endpoints
│   │   ├── services/                 # Business Logic
│   │   │   ├── video_processor.py   # Frame extraction, transcription
│   │   │   ├── scene_detector.py    # Scene detection, YOLO integration
│   │   │   ├── emotion_analyzer.py  # Emotion classification
│   │   │   └── video_search.py      # Vector search with Qdrant
│   │   ├── models/                   # Data Models
│   │   │   ├── database.py          # SQLAlchemy ORM models
│   │   │   └── schemas.py           # Pydantic request/response schemas
│   │   ├── config.py                 # Configuration settings
│   │   └── database.py               # Database connection
│   ├── main.py                       # Application entry point
│   ├── requirements.txt              # Python dependencies
│   ├── requirements-dev.txt          # Development dependencies
│   ├── Dockerfile                    # Docker image definition
│   ├── .env.example                  # Environment variables template
│   └── test_api.py                   # API tests
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/               # React Components
│   │   │   ├── VideoUpload.tsx      # Drag-and-drop upload
│   │   │   ├── VideoPlayer.tsx      # Synchronized video player
│   │   │   ├── SearchBar.tsx        # Semantic search interface
│   │   │   ├── Timeline.tsx         # Interactive timeline
│   │   │   ├── TranscriptView.tsx   # Scrolling transcript
│   │   │   └── AnalysisPanel.tsx    # AI analysis dashboard
│   │   ├── App.tsx                   # Main application
│   │   ├── App.css                   # Application styles
│   │   ├── index.css                 # Global styles
│   │   └── main.tsx                  # Entry point
│   ├── package.json                  # Node dependencies
│   ├── tsconfig.json                 # TypeScript config
│   ├── vite.config.ts                # Vite build config
│   └── Dockerfile                    # Docker image definition
│
├── docker-compose.yml                # Multi-container orchestration
├── setup.sh                          # Automated setup script
├── .gitignore                        # Git ignore rules
├── README.md                         # Main documentation
├── QUICKSTART.md                     # Quick start guide
└── PROJECT_STRUCTURE.md              # This file

# Data Directories (Created at Runtime)
backend/
├── uploads/                          # Uploaded video files
├── frames/                           # Extracted keyframes
│   └── {video_id}/
│       ├── frame_000000.jpg
│       ├── frame_000001.jpg
│       └── scenes/
│           └── scene_001.jpg
└── audio/                            # Extracted audio files
    └── {video_id}.mp3
```

## Key Components

### Backend Services

**VideoProcessor** (`video_processor.py`)
- Extracts video metadata (duration, FPS, resolution)
- Extracts keyframes at regular intervals
- Extracts and transcribes audio with Whisper
- Generates summaries and timelines
- Manages background processing pipeline

**SceneDetector** (`scene_detector.py`)
- Detects scene changes using PySceneDetect
- Extracts keyframes for each scene
- Runs YOLOv5 object detection on frames
- Stores detection results in database

**EmotionAnalyzer** (`emotion_analyzer.py`)
- Analyzes sentiment from transcript text
- Uses transformer-based emotion classifier
- Tracks emotions across video timeline

**VideoSearch** (`video_search.py`)
- Embeds transcript segments using sentence-transformers
- Stores embeddings in Qdrant vector database
- Performs semantic similarity search
- Returns relevant timestamps with scores

### Database Models

**Video**
- Core video metadata
- Processing status tracking
- Relationships to frames, transcript, scenes

**Frame**
- Extracted keyframe information
- Timestamp and file path
- Link to vector embeddings

**Transcript**
- Speech-to-text segments
- Start/end timestamps
- Confidence scores
- Vector embeddings for search

**Scene**
- Scene boundaries
- Keyframe references
- AI-generated summaries

**Detection**
- Object/emotion detections
- Bounding boxes
- Confidence scores
- Timestamps

### Frontend Components

**VideoUpload**
- Drag-and-drop interface
- File validation
- Upload progress tracking

**VideoPlayer**
- HTML5 video player
- Time synchronization
- Playback controls

**SearchBar**
- Natural language query input
- Results display with relevance scores
- Click-to-seek functionality

**Timeline**
- Visual event timeline
- Scene markers
- Transcript highlights
- Interactive navigation

**TranscriptView**
- Auto-scrolling transcript
- Timestamp synchronization
- Click-to-seek
- Confidence indicators

**AnalysisPanel**
- Trigger AI analysis
- Display detected objects
- Show emotion distribution
- Scene statistics

## Data Flow

1. **Upload**: User uploads video → Saved to `uploads/`
2. **Processing**: 
   - Extract frames → `frames/{video_id}/`
   - Extract audio → `audio/{video_id}.mp3`
   - Transcribe → Database + Qdrant
3. **Analysis**:
   - Scene detection → Database
   - Object detection → Database
   - Emotion analysis → Database
4. **Search**: Query → Qdrant → Ranked results
5. **Display**: Frontend fetches data via API

## Technology Decisions

### Why FastAPI?
- Async support for concurrent processing
- Automatic API documentation
- Type safety with Pydantic
- High performance

### Why Qdrant?
- Fast vector similarity search
- Easy Docker deployment
- Good Python client
- Scalable

### Why Whisper?
- State-of-the-art accuracy
- Multi-language support
- Word-level timestamps
- Open source

### Why YOLOv5?
- Real-time performance
- Pre-trained on 80 classes
- Easy PyTorch integration
- Good accuracy/speed tradeoff

### Why React + TypeScript?
- Component reusability
- Type safety
- Large ecosystem
- Modern developer experience

## Scaling Considerations

**Horizontal Scaling**
- Run multiple backend instances behind load balancer
- Shared PostgreSQL and Qdrant instances
- Distributed file storage (S3, MinIO)

**Performance Optimization**
- Use GPU for ML inference (10x speedup)
- Cache embeddings
- Batch processing for multiple videos
- CDN for video streaming

**Production Deployment**
- Use production WSGI server (Gunicorn)
- Enable HTTPS
- Add authentication/authorization
- Implement rate limiting
- Set up monitoring (Prometheus, Grafana)

## Future Enhancements

- [ ] Real-time video streaming analysis
- [ ] Multi-video comparison
- [ ] Custom model training
- [ ] Export reports (PDF, JSON)
- [ ] Collaborative annotations
- [ ] Mobile app
- [ ] Cloud deployment templates
- [ ] Kubernetes manifests
