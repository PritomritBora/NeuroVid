import React, { useState } from 'react'
import VideoUpload from './components/VideoUpload'
import VideoPlayer from './components/VideoPlayer'
import Timeline from './components/Timeline'
import SearchBar from './components/SearchBar'
import TranscriptView from './components/TranscriptView'
import AnalysisPanel from './components/AnalysisPanel'
import LandingPage from './components/LandingPage'
import './App.css'

function App() {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [showApp, setShowApp] = useState<boolean>(false)

  if (!showApp) {
    return <LandingPage onGetStarted={() => setShowApp(true)} />
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>🎬 AI Video Intelligence</h1>
          {videoId && (
            <button className="new-video-btn" onClick={() => setVideoId(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              New Video
            </button>
          )}
        </div>
      </header>
      
      {!videoId ? (
        <VideoUpload onUploadSuccess={setVideoId} />
      ) : (
        <div className="main-content">
          <div className="left-panel">
            <SearchBar videoId={videoId} onResultClick={setCurrentTime} />
            <VideoPlayer videoId={videoId} currentTime={currentTime} onTimeUpdate={setCurrentTime} />
            <Timeline videoId={videoId} onTimelineClick={setCurrentTime} />
          </div>
          
          <div className="right-panel">
            <AnalysisPanel videoId={videoId} />
            <TranscriptView videoId={videoId} currentTime={currentTime} onTranscriptClick={setCurrentTime} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
