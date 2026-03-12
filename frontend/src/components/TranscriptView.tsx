import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Props {
  videoId: string
  currentTime: number
  onTranscriptClick: (time: number) => void
}

interface TranscriptSegment {
  start_time: number
  end_time: number
  text: string
  confidence: number
}

const TranscriptView: React.FC<Props> = ({ videoId, currentTime, onTranscriptClick }) => {
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`http://localhost:8000/api/videos/${videoId}/transcript`)
      .then(res => {
        setTranscript(res.data.transcript)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [videoId])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return <div className="panel">Loading transcript...</div>
  }

  return (
    <div className="panel transcript-panel">
      <h3>📝 Transcript</h3>
      <div className="transcript-list">
        {transcript.length === 0 ? (
          <p className="empty-state">No transcript available yet. Processing...</p>
        ) : (
          transcript.map((segment, idx) => (
            <div
              key={idx}
              className={`transcript-segment ${
                currentTime >= segment.start_time && currentTime <= segment.end_time ? 'active' : ''
              }`}
              onClick={() => onTranscriptClick(segment.start_time)}
            >
              <span className="timestamp">{formatTime(segment.start_time)}</span>
              <p className="text">{segment.text}</p>
            </div>
          ))
        )}
      </div>
      
      <style>{`
        .transcript-panel {
          max-height: 600px;
          overflow-y: auto;
        }
        
        .transcript-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .transcript-segment {
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }
        
        .transcript-segment:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }
        
        .transcript-segment.active {
          background: rgba(102, 126, 234, 0.2);
          border-left-color: #667eea;
        }
        
        .timestamp {
          font-size: 0.85rem;
          color: #667eea;
          font-weight: 600;
          display: block;
          margin-bottom: 5px;
        }
        
        .text {
          color: white;
          line-height: 1.5;
        }
        
        .empty-state {
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
          padding: 40px 20px;
        }
      `}</style>
    </div>
  )
}

export default TranscriptView
