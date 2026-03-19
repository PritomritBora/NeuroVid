#!/bin/bash

echo "🧪 Testing AI Video Intelligence Platform Setup..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT installed"
        return 1
    fi
}

# Test version function
test_version() {
    echo -e "${YELLOW}→${NC} $1"
}

echo "Checking prerequisites..."
echo ""

# Check Python
if test_command python3; then
    test_version "$(python3 --version)"
fi

# Check Node
if test_command node; then
    test_version "$(node --version)"
fi

# Check npm
if test_command npm; then
    test_version "$(npm --version)"
fi

# Check Docker
if test_command docker; then
    test_version "$(docker --version)"
fi

# Check Docker Compose
if test_command docker-compose; then
    test_version "$(docker-compose --version)"
fi

# Check FFmpeg
if test_command ffmpeg; then
    test_version "$(ffmpeg -version | head -n 1)"
fi

echo ""
echo "Checking Docker services..."
echo ""

# Check if Docker is running
if docker info &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker daemon is running"
    
    # Check if containers are running
    if docker-compose ps | grep -q "Up"; then
        echo -e "${GREEN}✓${NC} Docker containers are running"
        docker-compose ps
    else
        echo -e "${YELLOW}!${NC} Docker containers are not running"
        echo "  Run: docker-compose up -d"
    fi
else
    echo -e "${RED}✗${NC} Docker daemon is not running"
fi

echo ""
echo "Checking project files..."
echo ""

# Check backend files
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC} backend/.env exists"
else
    echo -e "${YELLOW}!${NC} backend/.env missing (will be created by setup.sh)"
fi

if [ -f "backend/requirements.txt" ]; then
    echo -e "${GREEN}✓${NC} backend/requirements.txt exists"
fi

if [ -d "backend/venv" ]; then
    echo -e "${GREEN}✓${NC} Python virtual environment exists"
else
    echo -e "${YELLOW}!${NC} Python virtual environment not found (will be created by setup.sh)"
fi

# Check frontend files
if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✓${NC} frontend/.env exists"
else
    echo -e "${YELLOW}!${NC} frontend/.env missing (will be created by setup.sh)"
fi

if [ -f "frontend/package.json" ]; then
    echo -e "${GREEN}✓${NC} frontend/package.json exists"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Node modules installed"
else
    echo -e "${YELLOW}!${NC} Node modules not installed (run: cd frontend && npm install)"
fi

echo ""
echo "Testing API endpoints..."
echo ""

# Test backend health
if curl -s http://localhost:8000/health &> /dev/null; then
    echo -e "${GREEN}✓${NC} Backend is running at http://localhost:8000"
else
    echo -e "${YELLOW}!${NC} Backend is not running"
    echo "  Start with: cd backend && source venv/bin/activate && python main.py"
fi

# Test Qdrant
if curl -s http://localhost:6333/collections &> /dev/null; then
    echo -e "${GREEN}✓${NC} Qdrant is running at http://localhost:6333"
else
    echo -e "${YELLOW}!${NC} Qdrant is not running"
    echo "  Start with: docker-compose up -d qdrant"
fi

# Test PostgreSQL
if docker-compose exec -T db psql -U user -d videodb -c "SELECT 1" &> /dev/null; then
    echo -e "${GREEN}✓${NC} PostgreSQL is accessible"
else
    echo -e "${YELLOW}!${NC} PostgreSQL is not accessible"
    echo "  Start with: docker-compose up -d db"
fi

echo ""
echo "Summary:"
echo ""
echo "If you see any issues above, run: ./setup.sh"
echo "Then start the application with:"
echo "  Terminal 1: cd backend && source venv/bin/activate && python main.py"
echo "  Terminal 2: cd frontend && npm run dev"
echo ""
