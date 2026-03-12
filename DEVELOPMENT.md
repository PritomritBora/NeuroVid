# Development Guide

## Setup Development Environment

### 1. Install Prerequisites

```bash
# Python 3.10+
python3 --version

# Node.js 18+
node --version

# Docker
docker --version
docker-compose --version

# FFmpeg (for video processing)
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### 2. Clone and Setup

```bash
git clone <repository-url>
cd ai-video-intelligence

# Run automated setup
chmod +x setup.sh
./setup.sh
```

### 3. Install Development Tools

```bash
# Backend
cd backend
source venv/bin/activate
pip install -r requirements-dev.txt

# Frontend
cd frontend
npm install
```

## Development Workflow

### Backend Development

```bash
cd backend
source venv/bin/activate

# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest

# Format code
black app/

# Lint
flake8 app/

# Type checking
mypy app/
```

### Frontend Development

```bash
cd frontend

# Run dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit
```

## Project Structure

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed architecture.

## Adding New Features

### 1. Add New API Endpoint

**backend/app/api/videos.py**
```python
@router.get("/{video_id}/new-feature")
async def new_feature(video_id: str, db: Session = Depends(get_db)):
    """Your new feature"""
    # Implementation
    return {"result": "data"}
```

### 2. Add New Service

**backend/app/services/new_service.py**
```python
class NewService:
    def __init__(self):
        pass
    
    async def process(self, video_id: str, db: Session):
        # Implementation
        pass
```

### 3. Add Database Model

**backend/app/models/database.py**
```python
class NewModel(Base):
    __tablename__ = "new_table"
    
    id = Column(Integer, primary_key=True)
    video_id = Column(String, ForeignKey("videos.id"))
    # Add fields
```

Then create migration:
```bash
# Initialize Alembic (first time only)
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Add new model"

# Apply migration
alembic upgrade head
```

### 4. Add Frontend Component

**frontend/src/components/NewComponent.tsx**
```typescript
import React from 'react'

interface Props {
  videoId: string
}

const NewComponent: React.FC<Props> = ({ videoId }) => {
  return (
    <div className="panel">
      <h3>New Feature</h3>
      {/* Implementation */}
    </div>
  )
}

export default NewComponent
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run specific test
pytest tests/test_video_processor.py

# With coverage
pytest --cov=app tests/
```

### Frontend Tests

```bash
cd frontend

# Add testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm test
```

### API Testing

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test upload (replace with actual video file)
curl -X POST http://localhost:8000/api/videos/upload \
  -F "file=@test_video.mp4"

# Run test script
python backend/test_api.py
```

## Debugging

### Backend Debugging

**VS Code launch.json**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": ["main:app", "--reload"],
      "cwd": "${workspaceFolder}/backend",
      "env": {
        "PYTHONPATH": "${workspaceFolder}/backend"
      }
    }
  ]
}
```

**Add breakpoints**
```python
import pdb; pdb.set_trace()  # Python debugger
```

### Frontend Debugging

- Use React DevTools browser extension
- Use browser console for logs
- Add `debugger;` statements in TypeScript

### Database Debugging

```bash
# Connect to PostgreSQL
docker-compose exec db psql -U user -d videodb

# List tables
\dt

# Query videos
SELECT * FROM videos;

# Check Qdrant
curl http://localhost:6333/collections
```

## Performance Optimization

### Backend

1. **Use GPU for ML models**
```python
# In scene_detector.py
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')
if torch.cuda.is_available():
    model = model.cuda()
```

2. **Batch processing**
```python
# Process multiple frames at once
results = model(frame_batch)
```

3. **Caching**
```python
from functools import lru_cache

@lru_cache(maxsize=100)
def expensive_operation(video_id: str):
    # Cached result
    pass
```

### Frontend

1. **Lazy loading**
```typescript
const AnalysisPanel = React.lazy(() => import('./components/AnalysisPanel'))
```

2. **Memoization**
```typescript
const MemoizedComponent = React.memo(Component)
```

3. **Virtual scrolling** for long lists

## Common Issues

### Issue: Whisper model download fails

**Solution:**
```bash
# Pre-download models
python -c "import whisper; whisper.load_model('base')"

# Or use smaller model
export WHISPER_MODEL=tiny
```

### Issue: Out of memory during processing

**Solution:**
```python
# Reduce frame extraction interval
await self.extract_keyframes(video_id, video_path, db, interval=5)  # 5 seconds

# Use smaller Whisper model
WHISPER_MODEL=tiny
```

### Issue: YOLO not detecting objects

**Solution:**
```bash
# Clear cache and reload
rm -rf ~/.cache/torch/hub/
python -c "import torch; torch.hub.load('ultralytics/yolov5', 'yolov5s', force_reload=True)"
```

### Issue: Database connection error

**Solution:**
```bash
# Check services
docker-compose ps

# Restart database
docker-compose restart db

# Check logs
docker-compose logs db
```

## Code Style

### Python (PEP 8)
- Use Black for formatting
- Max line length: 100
- Use type hints
- Docstrings for all functions

### TypeScript
- Use Prettier for formatting
- Functional components with hooks
- Props interface for all components
- Descriptive variable names

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

**Commit message format:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

## Deployment

### Docker Production Build

```bash
# Build images
docker-compose build

# Run in production mode
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

**Production .env**
```env
DATABASE_URL=postgresql://user:secure_password@db:5432/videodb
QDRANT_HOST=qdrant
QDRANT_PORT=6333
WHISPER_MODEL=base
ALLOWED_ORIGINS=https://yourdomain.com
```

### Monitoring

Add logging:
```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info(f"Processing video {video_id}")
```

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Whisper Documentation](https://github.com/openai/whisper)
- [YOLOv5 Documentation](https://github.com/ultralytics/yolov5)
- [Qdrant Documentation](https://qdrant.tech/documentation/)

## Getting Help

- Check existing issues
- Read error messages carefully
- Use `docker-compose logs` for debugging
- Test API endpoints with `/docs`
- Check database state with SQL queries

Happy coding! 🚀
