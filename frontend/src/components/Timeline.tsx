import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Props {
  videoId: string
  onTimelineClick: (time: number) => void
}

const Timeline: React.FC<Props> = ({ videoId, onTimelineClick }) => {
  const [timeline, setTimeline] = useState<any[]>([])

  useEffect(() => {
    axios.get(`http://localhost:8000/api/videos/${videoId}/timeline`)
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
                onClick={() => onTimelineClick(event.timestamp)}
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
          max-height: 400px;
          overflow-y: auto;
        }
        
        .timeline-container {
          margin-top: 15px;
        }
        
        .timeline-events {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .timeline-event {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .timeline-event:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
        }
        
        .event-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }
        
        .event-content {
          flex: 1;
        }
        
        .event-time {
          color: #667eea;
          font-weight: 600;
          font-size: 0.9rem;
          display: block;
          margin-bottom: 4px;
        }
        
        .event-description {
          color: white;
          font-size: 0.9rem;
          line-height: 1.4;
        }
      `}</style>
    </div>
  )
}

export default Timeline
