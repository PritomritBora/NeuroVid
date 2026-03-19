# Troubleshooting Guide

Common issues and solutions for the AI Video Intelligence Platform.

## Quick Diagnostics

Run the test script to check your setup:
```bash
chmod +x test_setup.sh
./test_setup.sh
```

---

## Installation Issues

### Issue: `setup.sh` fails with permission denied

**Solution:**
```bash
chmod +x setup.sh
./setup.sh
```

### Issue: Python version incompatibility

**Error:** `torch 2.1.2 requires Python <3.13`

**Solution:**
Use Python 3.10, 3.11, or 3.12:
```bash
# Check version
python3 --version

# If needed, install specific version (Ubuntu/Debian)
sudo apt install python3.11 python3.11-venv

# Use specific version
python3.11 -m venv backend/venv
```

### Issue: FFmpeg not found

**Solution:**
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

---

## Database Issues

### Issue: Database connection refused

**Error:** `could not connect to server: Connection refused`

**Solution:**
```bash
# Check if PostgreSQL container is running
docker-compose ps

# Start database
docker-compose up -d db

# Wait a few seconds, then test
docker-compose exec db psql -U user -d videodb -c "SELECT 1"
```

### Issue: Database tables not created

**Solution:**
```bash
cd backend
source venv/bin/activate
python init_db.py
```

### Issue: Database password authentication failed

**Solution:**
Check your `.env` file matches docker-compose.yml:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/videodb
```

---

## Backend Issues

### Issue: Port 8000 already in use

**Solution:**
```bash
# Find what's using the port
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or change the port in backend/main.py
uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Issue: Whisper model download fails

**Error:** `Failed to download model`

**Solution:**
```bash
# Pre-download the model
cd backend
source venv/bin/activate
python -c "import whisper; whisper.load_model('base')"

# Or use a smaller model
# Edit backend/.env
WHISPER_MODEL=tiny
```

### Issue: YOLO model not loading

**Error:** `Failed to load YOLO`

**Solution:**
```bash
# Clear torch hub cache
rm -rf ~/.cache/torch/hub/

# Restart backend
cd backend
source venv/bin/activate
python main.py
```

### Issue: Out of memory during processing

**Solution:**
1. Use smaller Whisper model:
```env
# backend/.env
WHISPER_MODEL=tiny
```

2. Reduce frame extraction interval:
```python
# backend/app/services/video_processor.py
await self.extract_keyframes(video_id, video_path, db, interval=5)  # 5 seconds instead of 2
```

3. Process shorter videos or use GPU

---

## Frontend Issues

### Issue: Frontend won't start

**Error:** `Cannot find module`

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: API requests failing with CORS error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Check backend is running: `curl http://localhost:8000/health`
2. Verify CORS settings in `backend/.env`:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```
3. Restart backend

### Issue: Video won't play

**Possible causes:**
1. Video still processing - check status
2. Video format not supported - try MP4
3. Backend not streaming - check backend logs

**Solution:**
```bash
# Check video status
curl http://localhost:8000/api/videos/{video_id}

# Check backend logs for errors
```

---

## Docker Issues

### Issue: Docker daemon not running

**Solution:**
```bash
# macOS/Windows
# Start Docker Desktop

# Linux
sudo systemctl start docker
```

### Issue: Docker Compose version incompatible

**Error:** `version is obsolete`

**Solution:**
```bash
# Update docker-compose.yml version to 3.8 (already done)
# Or install newer docker-compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Issue: Container keeps restarting

**Solution:**
```bash
# Check logs
docker-compose logs backend
docker-compose logs db

# Restart services
docker-compose down
docker-compose up -d
```

---

## Processing Issues

### Issue: Video upload succeeds but processing fails

**Check:**
1. Backend logs for errors
2. Video file is valid
3. Enough disk space
4. FFmpeg is installed

**Solution:**
```bash
# Test FFmpeg
ffmpeg -i your_video.mp4

# Check disk space
df -h

# Check backend logs
docker-compose logs backend
```

### Issue: Transcription takes too long

**Solution:**
Use a smaller Whisper model:
```env
# backend/.env
WHISPER_MODEL=tiny  # Fastest
# or
WHISPER_MODEL=base  # Good balance
```

### Issue: Object detection not finding anything

**Possible causes:**
1. YOLO model not loaded
2. No clear objects in frames
3. Confidence threshold too high

**Solution:**
```bash
# Check backend logs for YOLO errors
# Try with a video that has clear objects (people, cars, etc.)
```

---

## Qdrant Issues

### Issue: Qdrant connection refused

**Solution:**
```bash
# Start Qdrant
docker-compose up -d qdrant

# Test connection
curl http://localhost:6333/collections

# Check logs
docker-compose logs qdrant
```

### Issue: Search returns no results

**Possible causes:**
1. Video not indexed yet
2. Query doesn't match content
3. Qdrant collection not created

**Solution:**
```bash
# Check if collection exists
curl http://localhost:6333/collections

# Re-index video (restart backend to trigger)
```

---

## Performance Issues

### Issue: Processing is very slow

**Solutions:**

1. **Use GPU acceleration** (if available):
   - CUDA will be used automatically if available
   - Check: `python -c "import torch; print(torch.cuda.is_available())"`

2. **Use smaller models**:
```env
WHISPER_MODEL=tiny
```

3. **Reduce frame extraction**:
```python
# backend/app/services/video_processor.py
interval=5  # Extract every 5 seconds instead of 2
```

4. **Process shorter clips**:
   - Split long videos into shorter segments

### Issue: High memory usage

**Solutions:**
1. Use smaller Whisper model (`tiny` or `base`)
2. Reduce concurrent processing
3. Increase system swap space
4. Process videos one at a time

---

## Common Error Messages

### `ModuleNotFoundError: No module named 'app'`

**Solution:**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### `sqlalchemy.exc.OperationalError: could not connect to server`

**Solution:**
```bash
docker-compose up -d db
sleep 5
python init_db.py
```

### `qdrant_client.http.exceptions.UnexpectedResponse`

**Solution:**
```bash
docker-compose restart qdrant
```

### `Error: listen EADDRINUSE: address already in use :::5173`

**Solution:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or change port in vite config
```

---

## Getting Help

If you're still stuck:

1. **Check logs:**
   ```bash
   # Backend logs
   docker-compose logs backend
   
   # Database logs
   docker-compose logs db
   
   # All logs
   docker-compose logs
   ```

2. **Verify services:**
   ```bash
   docker-compose ps
   curl http://localhost:8000/health
   curl http://localhost:6333/collections
   ```

3. **Clean restart:**
   ```bash
   docker-compose down
   docker-compose up -d db qdrant
   cd backend && source venv/bin/activate && python main.py
   cd frontend && npm run dev
   ```

4. **Nuclear option (fresh start):**
   ```bash
   # WARNING: This deletes all data
   docker-compose down -v
   rm -rf backend/venv frontend/node_modules
   ./setup.sh
   ```

---

## Reporting Issues

When reporting issues, please include:
- Operating system and version
- Python version (`python3 --version`)
- Node version (`node --version`)
- Error messages (full stack trace)
- Steps to reproduce
- Output of `./test_setup.sh`

---

**Still having issues?** Check the [DEVELOPMENT.md](DEVELOPMENT.md) guide for more details.
