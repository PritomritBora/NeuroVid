# API Documentation

Base URL: `http://localhost:8000`

Interactive docs available at: `http://localhost:8000/docs`

## Authentication

Currently no authentication required. Add JWT/OAuth in production.

## Endpoints

### Health & Status

#### GET /health
Check API health status

**Response:**
```json
{
  "status": "healthy"
}
```

#### GET /
Root endpoint with API info

**Response:**
```json
{
  "message": "AI Video Intelligence Platform API"
}
```

---

### Videos

#### POST /api/videos/upload
Upload a video file for processing

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (video file)

**Response:**
```json
{
  "video_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing"
}
```

**Status Codes:**
- 200: Success
- 500: Upload failed

---

#### GET /api/videos/{video_id}
Get video metadata and processing status

**Parameters:**
- `video_id` (path): Video UUID

**Response:**
```json
{
  "video_id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "sample.mp4",
  "status": "completed",
  "duration": 120.5,
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Status Values:**
- `processing`: Video is being analyzed
- `completed`: Processing finished
- `failed`: Processing error

---

#### GET /api/videos/{video_id}/stream
Stream video file

**Parameters:**
- `video_id` (path): Video UUID

**Response:**
- Content-Type: `video/mp4`
- Binary video stream

---

#### GET /api/videos/{video_id}/summary
Get AI-generated video summary

**Parameters:**
- `video_id` (path): Video UUID
- `summary_type` (query, optional): `brief` or `full` (default: `full`)

**Response:**
```json
{
  "video_id": "550e8400-e29b-41d4-a716-446655440000",
  "summary": "This video shows a product demonstration...",
  "type": "full"
}
```

---

#### GET /api/videos/{video_id}/transcript
Get full video transcript with timestamps

**Parameters:**
- `video_id` (path): Video UUID

**Response:**
```json
{
  "video_id": "550e8400-e29b-41d4-a716-446655440000",
  "transcript": [
    {
      "start_time": 0.0,
      "end_time": 3.5,
      "text": "Welcome to our product demo",
      "confidence": 0.95
    },
    {
      "start_time": 3.5,
      "end_time": 7.2,
      "text": "Today we'll show you the key features",
      "confidence": 0.92
    }
  ]
}
```

---

#### GET /api/videos/{video_id}/timeline
Get interactive timeline with key events

**Parameters:**
- `video_id` (path): Video UUID

**Response:**
```json
{
  "video_id": "550e8400-e29b-41d4-a716-446655440000",
  "timeline": [
    {
      "timestamp": 0.0,
      "type": "scene",
      "description": "Scene 1",
      "keyframe": "/frames/video_id/scenes/scene_001.jpg"
    },
    {
      "timestamp": 2.5,
      "type": "transcript",
      "description": "Welcome to our product demo"
    }
  ]
}
```

**Event Types:**
- `scene`: Scene change detected
- `transcript`: Transcript segment
- `object`: Object detection
- `emotion`: Emotion detected

---

### Analysis

#### GET /api/analysis/{video_id}/scenes
Detect scenes and extract keyframes

**Parameters:**
- `video_id` (path): Video UUID

**Response:**
```json
{
  "video_id": "550e8400-e29b-41d4-a716-446655440000",
  "scenes": [
    {
      "start_time": 0.0,
      "end_time": 15.3,
      "duration": 15.3,
      "keyframe": "/frames/video_id/scenes/scene_000.jpg"
    },
    {
      "start_time": 15.3,
      "end_time": 32.1,
      "duration": 16.8,
      "keyframe": "/frames/video_id/scenes/scene_001.jpg"
    }
  ]
}
```

---

#### GET /api/analysis/{video_id}/objects
Detect objects and actions in video

**Parameters:**
- `video_id` (path): Video UUID

**Response:**
```json
{
  "video_id": "550e8400-e29b-41d4-a716-446655440000",
  "objects": [
    {
      "timestamp": 2.0,
      "label": "person",
      "confidence": 0.95
    },
    {
      "timestamp": 2.0,
      "label": "laptop",
      "confidence": 0.87
    },
    {
      "timestamp": 5.5,
      "label": "cell phone",
      "confidence": 0.82
    }
  ]
}
```

**Detected Object Classes (80 total):**
- People: person
- Vehicles: car, truck, bus, motorcycle, bicycle
- Animals: dog, cat, bird, horse
- Electronics: laptop, cell phone, tv, keyboard, mouse
- Furniture: chair, couch, bed, dining table
- And 60+ more...

---

#### GET /api/analysis/{video_id}/emotions
Analyze emotions throughout video

**Parameters:**
- `video_id` (path): Video UUID

**Response:**
```json
{
  "video_id": "550e8400-e29b-41d4-a716-446655440000",
  "emotions": [
    {
      "timestamp": 0.0,
      "emotion": "joy",
      "confidence": 0.85
    },
    {
      "timestamp": 15.5,
      "emotion": "neutral",
      "confidence": 0.72
    },
    {
      "timestamp": 30.2,
      "emotion": "surprise",
      "confidence": 0.68
    }
  ]
}
```

**Emotion Labels:**
- joy
- sadness
- anger
- fear
- surprise
- disgust
- neutral

---

### Search

#### POST /api/search/query
Semantic search across video content

**Request Body:**
```json
{
  "video_id": "550e8400-e29b-41d4-a716-446655440000",
  "query": "show me scenes with a guitar"
}
```

**Response:**
```json
{
  "video_id": "550e8400-e29b-41d4-a716-446655440000",
  "query": "show me scenes with a guitar",
  "results": [
    {
      "timestamp": 45.2,
      "type": "transcript",
      "text": "Here's how to play the guitar",
      "relevance_score": 0.89,
      "start_time": 45.2,
      "end_time": 48.5
    },
    {
      "timestamp": 120.5,
      "type": "transcript",
      "text": "The guitar sounds amazing",
      "relevance_score": 0.76,
      "start_time": 120.5,
      "end_time": 123.1
    }
  ]
}
```

**Query Examples:**
- "Find moments where someone is smiling"
- "Show me the introduction"
- "When is the product demonstration?"
- "Find scenes with music"
- "Show me outdoor scenes"

---

## Error Responses

All endpoints may return error responses:

**404 Not Found:**
```json
{
  "detail": "Video not found"
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Processing failed: [error message]"
}
```

---

## Rate Limiting

Currently no rate limiting. Implement in production:
- 100 requests per minute per IP
- 10 uploads per hour per IP

---

## Webhooks (Future)

Subscribe to processing events:

```json
POST /api/webhooks/subscribe
{
  "url": "https://your-app.com/webhook",
  "events": ["video.completed", "video.failed"]
}
```

---

## SDK Examples

### Python

```python
import requests

# Upload video
with open('video.mp4', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/api/videos/upload',
        files={'file': f}
    )
    video_id = response.json()['video_id']

# Search
response = requests.post(
    'http://localhost:8000/api/search/query',
    json={
        'video_id': video_id,
        'query': 'find happy moments'
    }
)
results = response.json()['results']
```

### JavaScript

```javascript
// Upload video
const formData = new FormData()
formData.append('file', videoFile)

const uploadResponse = await fetch('http://localhost:8000/api/videos/upload', {
  method: 'POST',
  body: formData
})
const { video_id } = await uploadResponse.json()

// Search
const searchResponse = await fetch('http://localhost:8000/api/search/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    video_id: video_id,
    query: 'find happy moments'
  })
})
const { results } = await searchResponse.json()
```

### cURL

```bash
# Upload
curl -X POST http://localhost:8000/api/videos/upload \
  -F "file=@video.mp4"

# Get transcript
curl http://localhost:8000/api/videos/{video_id}/transcript

# Search
curl -X POST http://localhost:8000/api/search/query \
  -H "Content-Type: application/json" \
  -d '{"video_id": "uuid", "query": "find happy moments"}'
```

---

## Performance

**Typical Processing Times:**
- 5-minute video: 2-3 minutes
- 30-minute video: 10-15 minutes
- 1-hour video: 30-40 minutes

**Factors:**
- Whisper model size (tiny = fastest, large = slowest)
- CPU vs GPU (GPU is 10x faster)
- Video resolution
- Frame extraction interval

**Optimization Tips:**
- Use `WHISPER_MODEL=tiny` for faster transcription
- Enable GPU for ML models
- Reduce frame extraction interval
- Process videos in background queue

---

## Versioning

Current version: v1

Future versions will use URL versioning:
- `/api/v1/videos/upload`
- `/api/v2/videos/upload`

---

For more details, visit the interactive API documentation at:
**http://localhost:8000/docs**
