import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config'

interface Props {
  videoId: string
  onTimelineClick: (time: number) => void
}

const Timeline: React.FC<Props> = ({ videoId, onTimelineClick }) => {
  const [timeline, setTimeline] = useState<any[]>([])

  useEffect(() => {
    axios.get(`${API_URL}/api/videos/${videoId}/timeline`)
      .then(res => setTimeline(res.data.timeline))
      .catch(err => console.error(err))
  }, [videoId])

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

  return (
    <div className="panel timeline-panel">
      <h3>⏱️ Interactive Timeline</h3>
      <div className="timeline-container">
        {timeline.length === 0 ? (
          <p className="empty-state">Timeline will appear after processing...</p>
        ) : (
          <div className="timeline-events">
            {timeline.map((event, idx) => (
              <div 
                key={idx} 
                className="timeline-event"
                onClick={() => {
                  console.log('Timeline clicked:', event.timestamp, 'Event:', event)
                  onTimelineClick(event.timestamp)
                }}
              >
                <div className="event-icon">{getEventIcon(event.type)}</div>
                <div className="event-content">
                  <span className="event-time">{formatTime(event.timestamp)}</span>
                  <p className="event-description">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style>{`
        .timeline-panel {
          background: #1a1f2e;
          border-radius: 0;
          overflow-y: auto;
          max-height: none;
        }
        
        .timeline-panel h3 {
          color: #9ca3af !important;
          opacity: 1 !important;
        }
        
        .timeline-container {
          margin-top: 0;
        }
        
        .timeline-events {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .timeline-event {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #0f1419;
          border: 1px solid #2d3748;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .timeline-event:hover {
          background: #2d3748;
          border-color: #0ea5e9;
          transform: translateX(3px);
        }
        
        .event-icon {
          font-size: 1.3rem;
          flex-shrink: 0;
          opacity: 0.8;
        }
        
        .event-content {
          flex: 1;
        }
        
        .event-time {
          color: #0ea5e9;
          font-weight: 600;
          font-size: 0.85rem;
          display: block;
          margin-bottom: 4px;
        }
        
        .event-description {
          color: #9ca3af;
          font-size: 0.85rem;
          line-height: 1.4;
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
