#!/bin/bash

echo "🎬 Setting up AI Video Intelligence Platform..."

# Create backend .env if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "Creating backend/.env file..."
    cp backend/.env.example backend/.env
fi

# Create frontend .env if it doesn't exist
if [ ! -f frontend/.env ]; then
    echo "Creating frontend/.env file..."
    cp frontend/.env.example frontend/.env
fi

# Start Docker services
echo "🐳 Starting Docker services (PostgreSQL + Qdrant)..."
docker-compose up -d db qdrant

echo "⏳ Waiting for services to be ready..."
sleep 10

# Backend setup
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Initialize database
echo "🗄️ Initializing database..."
python init_db.py

cd ..

# Frontend setup
echo "🎨 Setting up frontend..."
cd frontend

# Install dependencies
echo "📦 Installing Node dependencies..."
npm install

cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "Option 1 - Manual (recommended for development):"
echo "  Terminal 1: cd backend && source venv/bin/activate && python main.py"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
echo "Option 2 - Docker Compose:"
echo "  docker-compose up"
echo ""
echo "Access the application at: http://localhost:5173"
echo "API documentation at: http://localhost:8000/docs"
