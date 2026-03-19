# Quick Start Guide

Get your AI Video Intelligence Platform running in 5 minutes!

## Prerequisites

Make sure you have installed:
- Python 3.10+ (`python3 --version`)
- Node.js 18+ (`node --version`)
- Docker & Docker Compose (`docker --version`)
- FFmpeg (`ffmpeg -version`)

## Installation

### 1. Run Setup Script

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Create environment files
- Start PostgreSQL and Qdrant in Docker
- Set up Python virtual environment
- Install all dependencies
- Initialize the database

### 2. Start the Application

**Option A: Manual (Recommended for Development)**

Open two terminal windows:

Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Option B: Docker Compose (All-in-One)**

```bash
docker-compose up
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## First Steps

1. Click "Get Started" on the landing page
2. Upload a video file (MP4, AVI, MOV, MKV)
3. Wait for processing (transcription, scene detection)
4. Try semantic search: "Find happy moments"
5. Click on timeline events to navigate
6. Run AI analysis for object detection and emotions

## Troubleshooting

### Database Connection Error
```bash
# Restart database
docker-compose restart db

# Check if running
docker-compose ps
```

### Port Already in Use
```bash
# Check what's using port 8000
lsof -i :8000

# Or change port in backend/main.py
uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Whisper Model Download Fails
```bash
# Pre-download model
cd backend
source venv/bin/activate
python -c "import whisper; whisper.load_model('base')"
```

### Out of Memory
Edit `backend/.env`:
```env
WHISPER_MODEL=tiny  # Use smaller model
```

## Configuration

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/videodb
QDRANT_HOST=localhost
QDRANT_PORT=6333
WHISPER_MODEL=base  # Options: tiny, base, small, medium, large
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## Model Options

### Whisper Models (Speed vs Accuracy)
- `tiny` - Fastest, lowest accuracy (~1GB RAM)
- `base` - Good balance (~1GB RAM) **[Recommended]**
- `small` - Better accuracy (~2GB RAM)
- `medium` - High accuracy (~5GB RAM)
- `large` - Best accuracy (~10GB RAM)

## What Gets Processed?

When you upload a video, the system automatically:

1. **Extracts keyframes** every 2 seconds
2. **Transcribes audio** with word-level timestamps
3. **Detects scenes** and generates keyframes
4. **Indexes content** for semantic search

Then you can manually run:
- **Object detection** (YOLOv5 - 80+ object classes)
- **Emotion analysis** (7 emotion categories)

## Performance Tips

### For Faster Processing
1. Use smaller Whisper model (`tiny` or `base`)
2. Reduce frame extraction interval in code
3. Use GPU if available (automatic with CUDA)

### For Better Accuracy
1. Use larger Whisper model (`medium` or `large`)
2. Increase frame extraction frequency
3. Process shorter video clips

## Next Steps

- Read [FEATURES.md](FEATURES.md) for full feature list
- Check [API.md](API.md) for API documentation
- See [DEVELOPMENT.md](DEVELOPMENT.md) for development guide
- Review [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for architecture

## Support

Having issues? Check:
1. All services are running: `docker-compose ps`
2. Backend logs: Check terminal or `docker-compose logs backend`
3. Database is accessible: `docker-compose exec db psql -U user -d videodb`
4. Qdrant is running: `curl http://localhost:6333/collections`

## Stopping the Application

```bash
# Stop Docker services
docker-compose down

# Or just Ctrl+C in terminal windows
```

---

**Ready to analyze videos with AI!** 🎬🤖
