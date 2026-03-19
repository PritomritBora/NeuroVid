import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config'

interface Props {
  videoId: string
  onTimelineClick: (time: number) => void
  refreshTrigger?: number
  highlightedTimestamps?: number[]
}

const Timeline: React.FC<Props> = ({ videoId, onTimelineClick, refreshTrigger, highlightedTimestamps = [] }) => {
  const [timeline, setTimeline] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTimeline = async () => {
    console.log('Timeline: Fetching timeline data for video', videoId)
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/api/videos/${videoId}/timeline`)
      console.log('Timeline: Received data', res.data.timeline?.length, 'events')
      setTimeline(res.data.timeline)
    } catch (err) {
      console.error('Failed to fetch timeline:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('Timeline: useEffect triggered, refreshTrigger=', refreshTrigger)
    fetchTimeline()
  }, [videoId, refreshTrigger])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getEventIcon = (type: string) => {
    switch(type) {
      case 'scene': return '🎬'
      case 'transcript': return '💬'
      case 'object': return '🎯'
      default: return '📍'
    }
  }

  const isHighlighted = (timestamp: number) => {
    // Check if this timestamp is close to any highlighted timestamp (within 2 seconds)
    return highlightedTimestamps.some(ht => Math.abs(ht - timestamp) < 2)
  }

  return (
    <div className="panel timeline-panel">
      <div className="timeline-header">
        <h3>⏱️ Interactive Timeline</h3>
        <button 
          className="refresh-btn" 
          onClick={fetchTimeline}
          disabled={loading}
          title="Refresh timeline"
        >
          {loading ? '⟳' : '↻'}
        </button>
      </div>
      <div className="timeline-container">
        {timeline.length === 0 ? (
          <p className="empty-state">
            {loading ? 'Loading timeline...' : 'Timeline will appear after analysis...'}
          </p>
        ) : (
          <div className="timeline-track">
            {timeline.map((event, idx) => (
              <div 
                key={idx} 
                className={`timeline-segment ${isHighlighted(event.timestamp) ? 'highlighted' : ''}`}
                onClick={() => {
                  console.log('Timeline clicked:', event.timestamp, 'Event:', event)
                  onTimelineClick(event.timestamp)
                }}
                title={`${formatTime(event.timestamp)} - ${event.description}`}
              >
                <div className="segment-icon">{getEventIcon(event.type)}</div>
                <div className="segment-time">{formatTime(event.timestamp)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style>{`
        .timeline-panel {
          background: #1a1f2e;
          border-radius: 0;
          overflow: hidden;
          max-height: none;
          padding: 16px;
        }
        
        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .timeline-panel h3 {
          color: #9ca3af !important;
          opacity: 1 !important;
          margin: 0;
        }
        
        .refresh-btn {
          background: transparent;
          border: 1px solid #374151;
          color: #9ca3af;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.2s;
        }
        
        .refresh-btn:hover:not(:disabled) {
          background: #374151;
          color: #0ea5e9;
          border-color: #0ea5e9;
        }
        
        .refresh-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .timeline-container {
          margin-top: 0;
        }
        
        .timeline-track {
          display: flex;
          gap: 4px;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 8px 0;
          min-height: 80px;
          align-items: flex-end;
        }
        
        .timeline-track::-webkit-scrollbar {
          height: 6px;
        }
        
        .timeline-track::-webkit-scrollbar-track {
          background: #0f1419;
          border-radius: 3px;
        }
        
        .timeline-track::-webkit-scrollbar-thumb {
          background: #4a5568;
          border-radius: 3px;
        }
        
        .timeline-track::-webkit-scrollbar-thumb:hover {
          background: #0ea5e9;
        }
        
        .timeline-segment {
          flex-shrink: 0;
          width: 80px;
          height: 60px;
          background: linear-gradient(180deg, #1e3a5f 0%, #0f1419 100%);
          border: 2px solid #2d3748;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          position: relative;
        }
        
        .timeline-segment:hover {
          border-color: #0ea5e9;
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
          background: linear-gradient(180deg, #2563eb 0%, #1e3a5f 100%);
        }
        
        .timeline-segment.highlighted {
          background: linear-gradient(180deg, #fbbf24 0%, #f59e0b 100%);
          border: 2px solid #fbbf24;
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
          animation: pulse 2s ease-in-out infinite;
        }
        
        .timeline-segment.highlighted .segment-time {
          color: #78350f;
        }
        
        .timeline-segment.highlighted:hover {
          background: linear-gradient(180deg, #fcd34d 0%, #fbbf24 100%);
          border-color: #fcd34d;
          box-shadow: 0 4px 20px rgba(251, 191, 36, 0.6);
        }
        
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
          }
          50% {
            box-shadow: 0 0 30px rgba(251, 191, 36, 0.8);
          }
        }
        
        .segment-icon {
          font-size: 1.3rem;
          opacity: 0.9;
        }
        
        .segment-time {
          color: #0ea5e9;
          font-weight: 700;
          font-size: 0.7rem;
          font-family: 'Courier New', monospace;
        }
        
        .empty-state {
          color: #6b7280;
          text-align: center;
          padding: 20px;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  )
}

export default Timeline
