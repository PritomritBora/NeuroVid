# AI Video Intelligence Platform

A multimodal AI system for video analysis, summarization, and intelligent querying.

## Features

- **Video Summarization**: Scene-level and full video summaries with highlight reel generation
- **Object & Event Detection**: Identify people, objects, and actions using YOLO/ViT
- **Speech-to-Text**: Automatic transcription and subtitle generation with Whisper
- **Emotion Analysis**: Detect emotional tone across video timeline
- **Intelligent Search**: Query videos with natural language
- **Interactive Timeline**: Visual storyboard with key events and navigation
- **Multimodal RAG**: Query across video, transcript, and metadata

## Architecture

```
Video Upload → Frame Extraction → Vision Models → Audio Models → 
Embedding & Indexing → LLM Processing → Interactive UI
```

## Tech Stack

- **Backend**: FastAPI, PyTorch, OpenCV, Whisper, Transformers
- **Frontend**: React, TypeScript, Video.js
- **Storage**: PostgreSQL, Vector DB (Qdrant/Pinecone)
- **ML Models**: YOLO, ViT, Whisper, GPT-4/LLaMA

## Quick Start

```bash
# Backend
cd backend
pip install -r requirements.txt
python main.py

# Frontend
cd frontend
npm install
npm run dev
```

## API Endpoints

- `POST /api/videos/upload` - Upload video
- `GET /api/videos/{id}/summary` - Get video summary
- `POST /api/videos/{id}/query` - Query video content
- `GET /api/videos/{id}/transcript` - Get transcript
- `GET /api/videos/{id}/timeline` - Get interactive timeline
