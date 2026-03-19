import React, { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config'

interface Props {
  onUploadSuccess: (videoId: string) => void
}

const VideoUpload: React.FC<Props> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleUpload = async (file: File) => {
    setUploading(true)
    setProgress(0)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${API_URL}/api/videos/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
          setProgress(percentCompleted)
        }
      })
      onUploadSuccess(response.data.video_id)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('video/')) {
      handleUpload(file)
    } else {
      alert('Please upload a video file')
    }
  }

  return (
    <div className="upload-container">
      <div 
        className={`upload-box ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          <div className="upload-icon-wrapper">
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 18C4.23858 18 2 15.7614 2 13C2 10.2386 4.23858 8 7 8C7.33333 5.33333 9.66667 2 14 2C18.3333 2 20.6667 5.33333 21 8C23.7614 8 26 10.2386 26 13C26 15.7614 23.7614 18 21 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 12V22M12 12L9 15M12 12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h2>Upload Your Video</h2>
          <p className="upload-subtitle">Drag and drop or click to browse</p>
          
          <div className="supported-formats">
            <span className="format-badge">MP4</span>
            <span className="format-badge">AVI</span>
            <span className="format-badge">MOV</span>
            <span className="format-badge">MKV</span>
          </div>
          
          <input 
            type="file" 
            accept="video/*" 
            onChange={handleFileInput} 
            disabled={uploading}
            id="file-input"
            style={{ display: 'none' }}
          />
          
          {!uploading ? (
            <label htmlFor="file-input" className="upload-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Choose File
            </label>
          ) : (
            <div className="upload-progress">
              <div className="progress-ring">
                <svg className="progress-svg" viewBox="0 0 100 100">
                  <circle className="progress-bg" cx="50" cy="50" r="45"/>
                  <circle 
                    className="progress-bar" 
                    cx="50" 
                    cy="50" 
                    r="45"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 45}`,
                      strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}`
                    }}
                  />
                </svg>
                <div className="progress-text">{progress}%</div>
              </div>
              <p className="upload-status">Uploading your video...</p>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        .upload-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
          padding: 40px 20px;
          animation: fadeIn 0.6s ease;
        }
        
        .upload-box {
          background: #ffffff;
          border: 3px dashed #cbd5e1;
          border-radius: 32px;
          padding: 70px 50px;
          max-width: 650px;
          width: 100%;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.02),
            0 12px 24px rgba(0, 0, 0, 0.04);
        }
        
        .upload-box::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.05) 0%, transparent 70%);
          animation: rotate 20s linear infinite;
          opacity: 0;
          transition: opacity 0.4s;
        }
        
        .upload-box:hover::before {
          opacity: 1;
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .upload-box.drag-active {
          border-color: #0ea5e9;
          background: #f0f9ff;
          transform: scale(1.02);
          box-shadow: 
            0 8px 12px rgba(14, 165, 233, 0.1),
            0 20px 40px rgba(14, 165, 233, 0.15);
        }
        
        .upload-box.uploading {
          pointer-events: none;
        }
        
        .upload-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }
        
        .upload-icon-wrapper {
          width: 140px;
          height: 140px;
          margin: 0 auto 35px;
          background: linear-gradient(135deg, #f0f9ff 0%, #fce7f3 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: float 3s ease-in-out infinite;
          box-shadow: 0 8px 24px rgba(14, 165, 233, 0.15);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        
        .upload-icon {
          width: 70px;
          height: 70px;
          color: #0ea5e9;
        }
        
        .upload-box h2 {
          color: #1a202c;
          margin-bottom: 14px;
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        
        .upload-subtitle {
          color: #64748b;
          margin-bottom: 35px;
          font-size: 1.15rem;
          font-weight: 500;
        }
        
        .supported-formats {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 35px;
        }
        
        .format-badge {
          padding: 8px 18px;
          background: linear-gradient(135deg, #f0f9ff 0%, #fce7f3 100%);
          border: 2px solid #e0f2fe;
          border-radius: 24px;
          font-size: 0.9rem;
          color: #0ea5e9;
          font-weight: 700;
          transition: all 0.3s;
        }
        
        .format-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
        }
        
        .upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 48px;
          background: linear-gradient(135deg, #0ea5e9 0%, #ec4899 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 1.15rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3);
        }
        
        .upload-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(14, 165, 233, 0.4);
        }
        
        .upload-btn:active {
          transform: translateY(-1px);
        }
        
        .upload-progress {
          margin-top: 25px;
        }
        
        .progress-ring {
          position: relative;
          width: 130px;
          height: 130px;
          margin: 0 auto 25px;
        }
        
        .progress-svg {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        
        .progress-bg {
          fill: none;
          stroke: #e2e8f0;
          stroke-width: 10;
        }
        
        .progress-bar {
          fill: none;
          stroke: url(#gradient);
          stroke-width: 10;
          stroke-linecap: round;
          transition: stroke-dashoffset 0.3s ease;
        }
        
        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 1.8rem;
          font-weight: 800;
          color: #1a202c;
        }
        
        .upload-status {
          color: #64748b;
          font-size: 1.05rem;
          font-weight: 500;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        .processing-spinner {
          width: 130px;
          height: 130px;
          margin: 0 auto 25px;
        }
        
        .spinner-svg {
          width: 100%;
          height: 100%;
          animation: rotate 2s linear infinite;
        }
        
        .spinner-circle {
          fill: none;
          stroke: url(#gradient);
          stroke-width: 4;
          stroke-linecap: round;
          stroke-dasharray: 1, 200;
          stroke-dashoffset: 0;
          animation: dash 1.5s ease-in-out infinite;
        }
        
        @keyframes dash {
          0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 100, 200;
            stroke-dashoffset: -35;
          }
          100% {
            stroke-dasharray: 100, 200;
            stroke-dashoffset: -125;
          }
        }
        
        .processing-note {
          color: #94a3b8;
          font-size: 0.9rem;
          margin-top: 8px;
          font-style: italic;
        }
      `}</style>
      
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export default VideoUpload
