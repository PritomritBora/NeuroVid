# 🎬 START HERE - AI Video Intelligence Platform

Welcome! This is your complete guide to getting started.

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Test your environment
./test_setup.sh

# 2. Install everything
./setup.sh

# 3. Start backend (Terminal 1)
cd backend && source venv/bin/activate && python main.py

# 4. Start frontend (Terminal 2)
cd frontend && npm run dev

# 5. Open http://localhost:5173 🎉
```

## 📚 Documentation Guide

### New User? Start Here:
1. **[START_HERE.md](START_HERE.md)** ← You are here!
2. **[QUICKSTART.md](QUICKSTART.md)** - Detailed setup instructions
3. **[FEATURES.md](FEATURES.md)** - What can this platform do?

### Having Issues?
4. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Solutions to common problems
5. **[FIXES_APPLIED.md](FIXES_APPLIED.md)** - What was fixed to make this work

### Developer?
6. **[DEVELOPMENT.md](DEVELOPMENT.md)** - Development guide
7. **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Architecture overview
8. **[API.md](API.md)** - API documentation

### Deploying?
9. **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Production deployment guide
10. **[CHANGELOG.md](CHANGELOG.md)** - Version history

## 🎯 What This Platform Does

Transform videos into intelligent, searchable content:

- 🗣️ **Transcribe** videos automatically (99 languages)
- 🎬 **Detect scenes** and extract keyframes
- 🎯 **Identify objects** in video frames (80+ classes)
- 😊 **Analyze emotions** from speech
- 🔍 **Search** using natural language
- ⏱️ **Navigate** with interactive timeline

## ✅ Prerequisites

Before starting, make sure you have:

- [ ] Python 3.10+ installed
- [ ] Node.js 18+ installed
- [ ] Docker & Docker Compose installed
- [ ] FFmpeg installed
- [ ] At least 4GB RAM available
- [ ] At least 10GB disk space free

**Check with:** `./test_setup.sh`

## 📖 Step-by-Step Guide

### Step 1: Verify Environment

```bash
chmod +x test_setup.sh
./test_setup.sh
```

This checks if you have all prerequisites installed.

### Step 2: Run Setup

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

**Time:** ~5-10 minutes (depending on internet speed)

### Step 3: Start Backend

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
✅ Database initialized successfully
```

### Step 4: Start Frontend

Open a **new terminal**:

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.0.11  ready in 500 ms
➜  Local:   http://localhost:5173/
```

### Step 5: Use the Application

1. Open http://localhost:5173 in your browser
2. Click "Get Started"
3. Upload a video file (MP4, AVI, MOV, MKV)
4. Wait for processing (1-5 minutes depending on video length)
5. Explore features:
   - View transcript
   - Try semantic search
   - Navigate timeline
   - Run AI analysis

## 🎓 First Video Tutorial

### Upload Your First Video

1. **Click "Get Started"** on landing page
2. **Drag and drop** a video or click to browse
3. **Wait for upload** - progress bar shows status
4. **Processing starts automatically**:
   - Extracting keyframes
   - Transcribing audio
   - Detecting scenes
   - Indexing for search

### Try Semantic Search

Once processing completes:

```
"Find happy moments"
"Show me scenes with a guitar"
"When is the product demonstration?"
```

The AI understands natural language!

### Navigate Timeline

- Click any timeline event to jump to that moment
- Events show scenes, transcript highlights, and detected objects
- Video player syncs automatically

### Run AI Analysis

Click "Run Analysis" to:
- Detect all objects in video
- Analyze emotions throughout
- Get comprehensive statistics

## 🔧 Configuration

### Adjust Processing Speed

Edit `backend/.env`:

```env
# Faster but less accurate
WHISPER_MODEL=tiny

# Balanced (recommended)
WHISPER_MODEL=base

# Slower but more accurate
WHISPER_MODEL=medium
```

### Change Upload Size Limit

Edit `backend/.env`:

```env
MAX_UPLOAD_SIZE=524288000  # 500MB in bytes
```

### Configure CORS

Edit `backend/.env`:

```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 🐛 Common Issues

### "Database connection refused"

```bash
docker-compose restart db
sleep 5
cd backend && python init_db.py
```

### "Port 8000 already in use"

```bash
lsof -ti:8000 | xargs kill -9
```

### "Whisper model download fails"

```bash
cd backend && source venv/bin/activate
python -c "import whisper; whisper.load_model('base')"
```

**More solutions:** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## 📊 System Requirements

### Minimum
- 4GB RAM
- 2 CPU cores
- 10GB disk space
- No GPU required (but slower)

### Recommended
- 8GB RAM
- 4 CPU cores
- 50GB disk space
- GPU with CUDA support

### For Production
- 16GB RAM
- 8 CPU cores
- 100GB+ disk space
- GPU highly recommended

## 🎯 What to Do Next

### Explore Features
- Upload different types of videos
- Try various search queries
- Experiment with AI analysis
- Test timeline navigation

### Customize
- Update landing page branding
- Adjust model sizes for your hardware
- Configure upload limits
- Set up monitoring

### Deploy
- Review [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- Set up production environment
- Configure security settings
- Enable HTTPS

## 🆘 Getting Help

### Self-Help Resources
1. Run `./test_setup.sh` for diagnostics
2. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. Review error messages in terminal
4. Check Docker logs: `docker-compose logs`

### Verify Services
```bash
# Check all services
docker-compose ps

# Test backend
curl http://localhost:8000/health

# Test Qdrant
curl http://localhost:6333/collections

# Test database
docker-compose exec db psql -U user -d videodb -c "SELECT 1"
```

## 🎉 Success Checklist

You're ready when:

- [ ] `./test_setup.sh` shows all green checkmarks
- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] You can upload a video
- [ ] Processing completes successfully
- [ ] Search returns results
- [ ] Timeline is interactive
- [ ] Video playback works

## 📞 Support

If you're stuck:

1. **Check diagnostics**: `./test_setup.sh`
2. **Read troubleshooting**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. **Review logs**: Terminal output or `docker-compose logs`
4. **Verify setup**: All steps completed correctly

## 🚀 Ready to Go!

You now have a fully functional AI Video Intelligence Platform!

**Next steps:**
- Upload your first video
- Explore all features
- Read [FEATURES.md](FEATURES.md) for capabilities
- Check [DEVELOPMENT.md](DEVELOPMENT.md) if you want to customize

---

**Happy analyzing!** 🎬🤖

*Need more details? See [QUICKSTART.md](QUICKSTART.md)*
