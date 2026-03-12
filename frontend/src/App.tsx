import React, { useState } from 'react'
import VideoUpload from './components/VideoUpload'
import VideoPlayer from './components/VideoPlayer'
import Timeline from './components/Timeline'
import SearchBar from './components/SearchBar'

function App() {
  const [videoId, setVideoId] = useState<string | null>(null)

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>AI Video Intelligence Platform</h1>
      
      {!videoId ? (
        <VideoUpload onUploadSuccess={setVideoId} />
      ) : (
        <>
          <SearchBar videoId={videoId} />
          <VideoPlayer videoId={videoId} />
          <Timeline videoId={videoId} />
        </>
      )}
    </div>
  )
}

export default App
