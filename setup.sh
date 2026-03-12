#!/bin/bash

echo "🎬 Setting up AI Video Intelligence Platform..."

# Create backend .env if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "Creating backend/.env file..."
    cp backend/.env.example backend/.env
fi

# Start Docker services
echo "🐳 Starting Docker services (PostgreSQL + Qdrant)..."
docker-compose up -d db qdrant

echo "⏳ Waiting for services to be ready..."
sleep 5

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
pip install -r requirements.txt

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
echo "  Backend:  cd backend && source venv/bin/activate && python main.py"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "Or use Docker Compose:"
echo "  docker-compose up"
