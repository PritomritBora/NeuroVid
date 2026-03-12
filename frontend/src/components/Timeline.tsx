import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface Props {
  videoId: string
}

const Timeline: React.FC<Props> = ({ videoId }) => {
  const [timeline, setTimeline] = useState<any[]>([])

  useEffect(() => {
    axios.get(`http://localhost:8000/api/videos/${videoId}/timeline`)
      .then(res => setTimeline(res.data.timeline))
      .catch(err => console.error(err))
  }, [videoId])

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Interactive Timeline</h3>
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
        {timeline.map((event, idx) => (
          <div key={idx} style={{ border: '1px solid #ddd', padding: '10px', minWidth: '150px' }}>
            <p>{event.timestamp}s</p>
            <p>{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Timeline
