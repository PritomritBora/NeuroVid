import React from 'react'

interface Props {
  videoId: string
}

const VideoPlayer: React.FC<Props> = ({ videoId }) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <video controls style={{ width: '100%', maxHeight: '500px' }}>
        <source src={`http://localhost:8000/api/videos/${videoId}/stream`} />
      </video>
    </div>
  )
}

export default VideoPlayer
