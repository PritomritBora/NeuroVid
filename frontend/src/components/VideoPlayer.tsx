import React, { useRef, useEffect, useState } from 'react'
import { API_URL } from '../config'

interface Props {
  videoId: string
  currentTime: number
  onTimeUpdate: (time: number) => void
}

const VideoPlayer: React.FC<Props> = ({ videoId, currentTime, onTimeUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastSeekTime = useRef<number>(0)
  const isSeeking = useRef<boolean>(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [progress, setProgress] = useState(0)

  console.log('VideoPlayer render - currentTime:', currentTime)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      console.log('Video element info:', {
        duration: video.duration,
        seekable: video.seekable.length > 0 ? `0 to ${video.seekable.end(0)}s` : 'not seekable',
        buffered: video.buffered.length > 0 ? `0 to ${video.buffered.end(0)}s` : 'not buffered',
        readyState: video.readyState,
        networkState: video.networkState
      })
    }
  }, [videoId])

  useEffect(() => {
    const video = videoRef.current
    if (!video) {
      console.log('Video ref not ready')
      return
    }

    const timeDiff = Math.abs(video.currentTime - currentTime)
    
    // Only seek if difference is significant and it's a new seek request
    if (timeDiff > 0.5 && currentTime !== lastSeekTime.current) {
      console.log(`Seeking to ${currentTime}s (current: ${video.currentTime}s, readyState: ${video.readyState})`)
      
      const doSeek = () => {
        isSeeking.current = true
        
        const onSeeked = () => {
          console.log(`✅ Seek completed! Now at ${video.currentTime}s, paused: ${video.paused}`)
          isSeeking.current = false
          video.removeEventListener('seeked', onSeeked)
        }
        
        const onSeeking = () => {
          console.log(`🔄 Seeking started, target: ${currentTime}s`)
          video.removeEventListener('seeking', onSeeking)
        }
        
        video.addEventListener('seeking', onSeeking)
        video.addEventListener('seeked', onSeeked)
        
        console.log(`Setting video.currentTime = ${currentTime}`)
        video.currentTime = currentTime
        lastSeekTime.current = currentTime
        
        // Fallback: reset seeking flag after timeout
        setTimeout(() => {
          isSeeking.current = false
        }, 500)
      }
      
      // If video is ready, seek immediately
      if (video.readyState >= 2) {
        doSeek()
      } else {
        // Wait for video to be ready
        console.log('Video not ready, waiting...')
        const onCanPlay = () => {
          doSeek()
          video.removeEventListener('canplay', onCanPlay)
        }
        video.addEventListener('canplay', onCanPlay)
      }
    }
  }, [currentTime])

  const handleTimeUpdate = () => {
    if (videoRef.current && !isSeeking.current) {
      const current = videoRef.current.currentTime
      onTimeUpdate(current)
      setProgress((current / duration) * 100)
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      const newTime = pos * duration
      videoRef.current.currentTime = newTime
      onTimeUpdate(newTime)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="panel video-player-panel">
      <div className="video-wrapper">
        <video 
          key={videoId}
          ref={videoRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.duration)
            }
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="video-player"
          onClick={togglePlayPause}
        >
          <source src={`${API_URL}/api/videos/${videoId}/stream`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Play/Pause Overlay */}
        <div className="play-overlay" onClick={togglePlayPause}>
          {!isPlaying && (
            <div className="play-button">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {/* Custom Controls */}
      <div className="custom-controls">
        <button className="control-btn" onClick={togglePlayPause}>
          {isPlaying ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>
        
        <span className="time-display">{formatTime(currentTime)}</span>
        
        <div className="progress-bar" onClick={handleProgressClick}>
          <div className="progress-filled" style={{ width: `${progress}%` }}></div>
        </div>
        
        <span className="time-display">{formatTime(duration)}</span>
      </div>
      
      <style>{`
        .video-player-panel {
          padding: 0;
          overflow: hidden;
          background: #000;
          border-radius: 0;
          border: none;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 400px;
        }
        
        .video-wrapper {
          position: relative;
          width: 100%;
          flex: 1;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
          min-height: 0;
        }
        
        .video-player {
          width: 100%;
          height: 100%;
          max-height: 100%;
          display: block;
          background: #000;
          object-fit: contain;
        }
        
        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        
        .play-button {
          width: 80px;
          height: 80px;
          background: rgba(14, 165, 233, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: all;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .play-button:hover {
          background: rgba(14, 165, 233, 1);
          transform: scale(1.1);
        }
        
        .custom-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #1a1f2e;
          border-top: 1px solid #2d3748;
          min-height: 60px;
        }
        
        .control-btn {
          width: 40px;
          height: 40px;
          background: #0ea5e9;
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        
        .control-btn:hover {
          background: #0284c7;
          transform: scale(1.05);
        }
        
        .time-display {
          color: #e4e7eb;
          font-size: 0.9rem;
          font-weight: 600;
          min-width: 50px;
          flex-shrink: 0;
        }
        
        .progress-bar {
          flex: 1;
          height: 10px;
          background: #0f1419;
          border-radius: 5px;
          cursor: pointer;
          position: relative;
          overflow: visible;
          border: 2px solid #374151;
          min-width: 100px;
        }
        
        .progress-bar:hover {
          border-color: #0ea5e9;
        }
        
        .progress-filled {
          height: 100%;
          background: linear-gradient(90deg, #0ea5e9 0%, #06b6d4 100%);
          border-radius: 3px;
          transition: width 0.1s linear;
          position: relative;
        }
        
        .progress-filled::after {
          content: '';
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          width: 12px;
          height: 12px;
          background: #0ea5e9;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(14, 165, 233, 0.8);
        }
      `}</style>
    </div>
  )
}

export default VideoPlayer
