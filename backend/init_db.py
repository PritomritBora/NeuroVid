#!/usr/bin/env python3
"""
Database initialization script
Run this to create all database tables
"""
from app.database import engine, Base
from app.models.database import Video, Frame, Transcript, Scene, Detection

def init_database():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")

if __name__ == "__main__":
    init_database()
