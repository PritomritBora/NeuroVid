from typing import List, Dict
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer
from sqlalchemy.orm import Session
import uuid

from ..models.database import Video, Frame, Transcript
from ..config import settings

class VideoSearch:
    def __init__(self):
        self.client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
        self.encoder = SentenceTransformer(settings.EMBEDDING_MODEL)
        self.collection_name = "video_embeddings"
        self._ensure_collection()
    
    def _ensure_collection(self):
        """Create Qdrant collection if it doesn't exist"""
        try:
            collections = self.client.get_collections().collections
            if not any(c.name == self.collection_name for c in collections):
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=384, distance=Distance.COSINE)
                )
        except Exception as e:
            print(f"Error creating collection: {e}")
    
    async def index_video(self, video_id: str, db: Session):
        """Index video frames and transcript into vector database"""
        # Refresh session to see latest data
        db.expire_all()
        
        # Index transcript segments
        transcripts = db.query(Transcript).filter(Transcript.video_id == video_id).all()
        
        print(f"Found {len(transcripts)} transcripts to index for video {video_id}")
        
        points = []
        for transcript in transcripts:
            embedding = self.encoder.encode(transcript.text).tolist()
            point_id = str(uuid.uuid4())
            
            points.append(PointStruct(
                id=point_id,
                vector=embedding,
                payload={
                    "video_id": video_id,
                    "type": "transcript",
                    "timestamp": transcript.start_time,
                    "text": transcript.text,
                    "start_time": transcript.start_time,
                    "end_time": transcript.end_time
                }
            ))
            
            # Update transcript with embedding ID
            transcript.embedding_id = point_id
        
        # Index frames (using OCR or image captions if available)
        # For now, we'll skip frame embeddings to keep it simple
        
        if points:
            self.client.upsert(
                collection_name=self.collection_name,
                points=points
            )
            db.commit()
            print(f"✅ Successfully indexed {len(points)} embeddings for video {video_id}")
        else:
            print(f"⚠️ No transcripts found to index for video {video_id}")
    
    async def query(self, video_id: str, query: str, db: Session, limit: int = 5) -> List[Dict]:
        """Search video content with natural language query"""
        # Encode query
        query_vector = self.encoder.encode(query).tolist()
        
        # Search in Qdrant
        search_results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            query_filter={
                "must": [
                    {"key": "video_id", "match": {"value": video_id}}
                ]
            },
            limit=limit
        )
        
        results = []
        for hit in search_results:
            results.append({
                "timestamp": hit.payload.get("timestamp", 0),
                "type": hit.payload.get("type", "unknown"),
                "text": hit.payload.get("text", ""),
                "relevance_score": hit.score,
                "start_time": hit.payload.get("start_time", 0),
                "end_time": hit.payload.get("end_time", 0)
            })
        
        return results
