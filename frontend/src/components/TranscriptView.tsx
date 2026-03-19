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
          max-height: none;
          overflow-y: auto;
          background: #1a1f2e;
          backdrop-filter: none;
        }
        
        .transcript-panel h3 {
          color: #9ca3af !important;
          opacity: 1 !important;
        }
        
        .transcript-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .transcript-segment {
          padding: 12px;
          background: #0f1419;
          border: 1px solid #2d3748;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .transcript-segment:hover {
          background: #2d3748;
          border-color: #0ea5e9;
        }
        
        .transcript-segment.active {
          background: #1e3a5f;
          border-color: #0ea5e9;
        }
        
        .timestamp {
          font-size: 0.75rem;
          color: #0ea5e9;
          font-weight: 600;
          display: block;
          margin-bottom: 6px;
        }
        
        .text {
          color: #e4e7eb;
          line-height: 1.6;
          font-size: 0.9rem;
        }
        
        .empty-state {
          text-align: center;
          color: #6b7280;
          padding: 40px 20px;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  )
}

export default TranscriptView
