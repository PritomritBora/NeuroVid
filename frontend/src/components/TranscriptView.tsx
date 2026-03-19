import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config'

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

  const fetchTranscript = () => {
    console.log('Fetching transcript for video:', videoId)
    // Add timestamp to prevent caching
    axios.get(`${API_URL}/api/videos/${videoId}/transcript?t=${Date.now()}`)
      .then(res => {
        console.log('Transcript response:', JSON.stringify(res.data, null, 2))
        console.log('Transcript array:', res.data.transcript)
        console.log('Transcript length:', res.data.transcript?.length)
        setTranscript(res.data.transcript || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Transcript error:', err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchTranscript()
    
    // Poll for transcript if empty (video might still be processing)
    const interval = setInterval(() => {
      if (transcript.length === 0) {
        fetchTranscript()
      } else {
        clearInterval(interval)
      }
    }, 3000) // Check every 3 seconds
    
    return () => clearInterval(interval)
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
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
        }
        
        .transcript-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .transcript-segment {
          padding: 12px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }
        
        .transcript-segment:hover {
          background: rgba(0, 0, 0, 0.1);
          transform: translateX(5px);
        }
        
        .transcript-segment.active {
          background: rgba(102, 126, 234, 0.15);
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
          color: #1a202c;
          line-height: 1.5;
        }
        
        .empty-state {
          text-align: center;
          color: #64748b;
          padding: 40px 20px;
        }
      `}</style>
    </div>
  )
}

export default TranscriptView
