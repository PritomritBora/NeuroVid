import React, { useRef, useEffect } from 'react'

interface Props {
  videoId: string
  currentTime: number
  onTimeUpdate: (time: number) => void
}

const VideoPlayer: React.FC<Props> = ({ videoId, currentTime, onTimeUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 1) {
      videoRef.current.currentTime = currentTime
    }
  }, [currentTime])

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime)
    }
  }

  return (
    <div className="panel video-player-panel">
      <div className="video-wrapper">
        <video 
          ref={videoRef}
          controls 
          onTimeUpdate={handleTimeUpdate}
          className="video-player"
        >
          <source src={`http://localhost:8000/api/videos/${videoId}/stream`} />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <style>{`
        .video-player-panel {
          padding: 0;
          overflow: hidden;
          background: rgba(0, 0, 0, 0.4);
        }
        
        .video-wrapper {
          position: relative;
          width: 100%;
          border-radius: 20px;
          overflow: hidden;
          background: #000;
        }
        
        .video-player {
          width: 100%;
          max-height: 600px;
          display: block;
          background: #000;
        }
        
        .video-player::-webkit-media-controls-panel {
          background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
        }
      `}</style>
    </div>
  )
}

export default VideoPlayer
