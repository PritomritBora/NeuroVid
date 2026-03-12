# Quick Start Guide

Get the AI Video Intelligence Platform running in 5 minutes!

## Option 1: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up

# Access the app
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000/docs
```

That's it! The platform is ready to use.

## Option 2: Manual Setup

### 1. Start Database Services

```bash
docker-compose up -d db qdrant
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run server
python main.py
```

Backend will be available at http://localhost:8000

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend will be available at http://localhost:5173

## First Steps

1. **Upload a Video**
   - Open http://localhost:5173
   - Drag and drop a video file (MP4, AVI, MOV)
   - Wait for processing to complete (~1-2 minutes for a 5-minute video)

2. **Explore Features**
   - **Search**: Try "show me scenes with people talking"
   - **Timeline**: Click events to jump to specific moments
   - **Transcript**: View synchronized captions
   - **Analysis**: Click "Run Analysis" for AI insights

## Testing the API

```bash
# Check health
curl http://localhost:8000/health

# View API documentation
open http://localhost:8000/docs
```

## Sample Queries

Once your video is processed, try these semantic searches:

- "Find moments where someone is smiling"
- "Show me the introduction"
- "When is the product demonstration?"
- "Find scenes with music"
- "Show me outdoor scenes"

## Troubleshooting

**Port already in use?**
```bash
# Change ports in docker-compose.yml
# Backend: 8000 -> 8001
# Frontend: 5173 -> 3000
```

**Models downloading slowly?**
```bash
# Pre-download Whisper model
python -c "import whisper; whisper.load_model('base')"
```

**Database connection error?**
```bash
# Check services are running
docker-compose ps

# Restart services
docker-compose restart
```

## Next Steps

- Read the full [README.md](README.md) for advanced features
- Check [API documentation](http://localhost:8000/docs)
- Customize models in `backend/app/config.py`
- Explore the codebase structure

## Performance Tips

- Use `WHISPER_MODEL=tiny` for faster transcription
- Reduce frame extraction interval for faster processing
- Use GPU for 10x faster object detection
- Scale with Docker replicas for multiple users

Enjoy exploring your videos with AI! 🎬✨
