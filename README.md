# AI Video Intelligence Platform

A production-ready multimodal AI system for advanced video analysis, transcription, object detection, and intelligent semantic search.

---

## 👋 New Here?

**→ Start with [START_HERE.md](START_HERE.md) for a complete beginner's guide**

---

## 🚀 Quick Start

**Get started in 5 minutes!** See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.

```bash
# 1. Run setup
chmod +x setup.sh
./setup.sh

# 2. Start backend
cd backend && source venv/bin/activate && python main.py

# 3. Start frontend (in new terminal)
cd frontend && npm run dev

# 4. Open http://localhost:5173
```

## ✨ What Can It Do?

- 🗣️ **Speech-to-Text**: Automatic transcription with Whisper AI (99 languages)
- 🎬 **Scene Detection**: Automatic segmentation with keyframe extraction
- 🎯 **Object Detection**: Real-time recognition using YOLOv5 (80+ classes)
- 😊 **Emotion Analysis**: Sentiment detection from transcript text
- 🔍 **Semantic Search**: Natural language queries across video content
- ⏱️ **Interactive Timeline**: Visual navigation with synchronized playback
- 📊 **AI Dashboard**: Comprehensive insights and statistics

## 🚀 Features

### Core Capabilities
- **🎥 Video Processing Pipeline**: Automated frame extraction and metadata analysis
- **🗣️ Speech-to-Text**: High-accuracy transcription with Whisper AI and word-level timestamps
- **🎬 Scene Detection**: Automatic scene segmentation with keyframe extraction
- **🎯 Object Detection**: Real-time object and action recognition using YOLOv5
- **😊 Emotion Analysis**: Sentiment and emotion detection from transcript text
- **🔍 Semantic Search**: Natural language queries across video content using vector embeddings
- **⏱️ Interactive Timeline**: Visual navigation with scenes, objects, and transcript highlights
- **📊 AI Analysis Dashboard**: Comprehensive insights and statistics

### Technical Features
- **Vector Database**: Qdrant integration for fast semantic search
- **Multimodal RAG**: Query across video frames, audio transcripts, and metadata
- **Real-time Processing**: Async pipeline for background video processing
- **RESTful API**: Complete FastAPI backend with OpenAPI documentation
- **Modern UI**: React + TypeScript frontend with drag-and-drop upload
- **Database Persistence**: PostgreSQL with SQLAlchemy ORM
- **Docker Support**: Full containerization with Docker Compose

## 🏗️ Architecture

```
┌─────────────┐
│ Video Upload│
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│   Video Processing Pipeline         │
├─────────────────────────────────────┤
│ • Frame Extraction (2s intervals)   │
│ • Audio Extraction (MoviePy)        │
│ • Whisper Transcription             │
│ • Scene Detection (PySceneDetect)   │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   AI Analysis Layer                 │
├─────────────────────────────────────┤
│ • YOLOv5 Object Detection           │
│ • Emotion Classification            │
│ • Sentence Embeddings               │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   Storage & Indexing                │
├─────────────────────────────────────┤
│ • PostgreSQL (Metadata)             │
│ • Qdrant (Vector Embeddings)        │
│ • File System (Videos/Frames)       │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│   Interactive UI                    │
├─────────────────────────────────────┤
│ • Video Player with Sync            │
│ • Semantic Search                   │
│ • Timeline Navigation               │
│ • Transcript View                   │
│ • Analysis Dashboard                │
└─────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.109
- **ML/AI**: 
  - PyTorch 2.1
  - OpenAI Whisper (Speech-to-Text)
  - YOLOv5 (Object Detection)
  - Transformers (Emotion Analysis)
  - Sentence-Transformers (Embeddings)
- **Video Processing**: OpenCV, MoviePy, PySceneDetect
- **Database**: PostgreSQL, SQLAlchemy
- **Vector DB**: Qdrant
- **Server**: Uvicorn

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **HTTP Client**: Axios
- **Styling**: CSS3 with modern gradients and glassmorphism

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Database**: PostgreSQL 15
- **Vector Store**: Qdrant (latest)

## 📦 Installation

### Prerequisites
- Python 3.10+ (`python3 --version`)
- Node.js 18+ (`node --version`)
- Docker & Docker Compose (`docker --version`)
- FFmpeg (`ffmpeg -version`)

### Quick Start

```bash
# 1. Clone repository
git clone <repository-url>
cd ai-video-intelligence

# 2. Run setup script
chmod +x setup.sh
./setup.sh

# 3. Start backend (Terminal 1)
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py

# 4. Start frontend (Terminal 2)
cd frontend
npm run dev

# 5. Open browser
# Frontend: http://localhost:5173
# API Docs: http://localhost:8000/docs
```

**Need help?** See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.

**Having issues?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for solutions.

**Deploying to production?** Review [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md).

### Verify Setup

```bash
# Run diagnostic test
chmod +x test_setup.sh
./test_setup.sh
```

## 🎯 Usage

### 1. Upload Video
- Drag and drop a video file or click to browse
- Supported formats: MP4, AVI, MOV, MKV
- Max size: 500MB

### 2. Automatic Processing
The system automatically:
- Extracts keyframes every 2 seconds
- Transcribes audio with timestamps
- Detects scenes and generates summaries
- Indexes content for semantic search

### 3. Explore Features

**Semantic Search**
```
Query: "Show me scenes with a guitar"
Query: "Find moments where people are laughing"
Query: "When is the product demonstration?"
```

**Timeline Navigation**
- Click any timeline event to jump to that moment
- View scene changes, transcript highlights, and detected objects

**Transcript View**
- Auto-scrolling synchronized transcript
- Click any segment to jump to that timestamp
- Confidence scores for each segment

**AI Analysis**
- Run comprehensive analysis for:
  - Scene detection
  - Object recognition
  - Emotion analysis
- View top detected objects and emotions

## 📡 API Endpoints

### Videos
- `POST /api/videos/upload` - Upload video file
- `GET /api/videos/{id}` - Get video metadata
- `GET /api/videos/{id}/stream` - Stream video
- `GET /api/videos/{id}/summary` - Get AI-generated summary
- `GET /api/videos/{id}/transcript` - Get full transcript
- `GET /api/videos/{id}/timeline` - Get interactive timeline

### Analysis
- `GET /api/analysis/{id}/scenes` - Detect scenes
- `GET /api/analysis/{id}/objects` - Detect objects
- `GET /api/analysis/{id}/emotions` - Analyze emotions

### Search
- `POST /api/search/query` - Semantic search
  ```json
  {
    "video_id": "uuid",
    "query": "natural language query"
  }
  ```

## 🔧 Configuration

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/videodb
QDRANT_HOST=localhost
QDRANT_PORT=6333
WHISPER_MODEL=base  # Options: tiny, base, small, medium, large
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

### Model Selection

**Whisper Models** (accuracy vs speed):
- `tiny` - Fastest, lowest accuracy
- `base` - Good balance (recommended)
- `small` - Better accuracy
- `medium` - High accuracy
- `large` - Best accuracy, slowest

## 🚀 Advanced Features

### Custom Model Integration
Replace YOLOv5 with custom models in `backend/app/services/scene_detector.py`

### LLM Integration
Add GPT-4 or LLaMA for better summarization in `backend/app/services/video_processor.py`

### Real-time Processing
Enable WebSocket support for live processing updates

### Multi-language Support
Whisper supports 99 languages automatically

## 📊 Performance

- **Frame Extraction**: ~100 frames/minute
- **Transcription**: Real-time to 2x speed (depends on model)
- **Object Detection**: ~30 FPS on GPU, ~5 FPS on CPU
- **Search Latency**: <100ms for semantic queries
- **Concurrent Users**: Scales with Docker replicas

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 5 minutes
- **[FEATURES.md](FEATURES.md)** - Complete feature list and roadmap
- **[API.md](API.md)** - API documentation and examples
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development guide and best practices
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Architecture overview
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Production deployment guide
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and changes

## 🐛 Troubleshooting

**Quick diagnostics:**
```bash
./test_setup.sh
```

**Common issues:**

**Issue**: Whisper model download fails
```bash
# Pre-download models
cd backend && source venv/bin/activate
python -c "import whisper; whisper.load_model('base')"
```

**Issue**: Database connection error
```bash
docker-compose restart db
docker-compose ps
```

**Issue**: Out of memory
```bash
# Use smaller model in backend/.env
WHISPER_MODEL=tiny
```

**More help:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for comprehensive solutions.

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- [ ] Facial recognition integration
- [ ] Multi-video comparison
- [ ] Export analysis reports (PDF/JSON)
- [ ] Real-time streaming support
- [ ] Mobile app
- [ ] Cloud deployment guides

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- OpenAI Whisper for speech recognition
- Ultralytics YOLOv5 for object detection
- Qdrant for vector search
- FastAPI and React communities

---

**Built with ❤️ for the AI community**
