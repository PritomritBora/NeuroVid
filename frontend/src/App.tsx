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
  const [videoId, setVideoId] = useState<string | null>(() => {
    // Load video ID from localStorage on mount
    return localStorage.getItem('currentVideoId')
  })
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [showApp, setShowApp] = useState<boolean>(() => {
    // If we have a video ID, show the app directly
    return !!localStorage.getItem('currentVideoId')
  })
  const [timelineRefreshTrigger, setTimelineRefreshTrigger] = useState<number>(0)

  // Save video ID to localStorage when it changes
  const handleVideoIdChange = (id: string | null) => {
    setVideoId(id)
    if (id) {
      localStorage.setItem('currentVideoId', id)
    } else {
      localStorage.removeItem('currentVideoId')
    }
  }

  const handleTimeChange = (time: number) => {
    console.log('App: Setting currentTime to', time)
    setCurrentTime(time)
  }

  const handleAnalysisComplete = () => {
    console.log('Analysis complete callback received, refreshing timeline')
    setTimelineRefreshTrigger(prev => prev + 1)
  }

  if (!showApp) {
    return <LandingPage onGetStarted={() => setShowApp(true)} />
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>🎬 NeuroVid</h1>
          {videoId && (
            <button className="new-video-btn" onClick={() => handleVideoIdChange(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              New Video
            </button>
          )}
        </div>
      </header>
      
      {!videoId ? (
        <VideoUpload onUploadSuccess={handleVideoIdChange} />
      ) : (
        <div className="editor-layout">
          {/* Left Sidebar - Search & Analysis */}
          <div className="left-sidebar">
            <SearchBar videoId={videoId} onResultClick={handleTimeChange} />
            <AnalysisPanel videoId={videoId} onAnalysisComplete={handleAnalysisComplete} />
          </div>
          
          {/* Center - Video Player (Fixed) */}
          <div className="center-panel">
            <VideoPlayer videoId={videoId} currentTime={currentTime} onTimeUpdate={handleTimeChange} />
            <Timeline videoId={videoId} onTimelineClick={handleTimeChange} refreshTrigger={timelineRefreshTrigger} />
          </div>
          
          {/* Right Sidebar - Transcript */}
          <div className="right-sidebar">
            <TranscriptView videoId={videoId} currentTime={currentTime} onTranscriptClick={handleTimeChange} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
