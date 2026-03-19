import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config'

interface Props {
  videoId: string
  onAnalysisComplete?: () => void
  onIndexComplete?: () => void
}

const AnalysisPanel: React.FC<Props> = ({ videoId, onAnalysisComplete, onIndexComplete }) => {
  const [scenes, setScenes] = useState<any[]>([])
  const [objects, setObjects] = useState<any[]>([])
  const [emotions, setEmotions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const runAnalysis = async () => {
    setLoading(true)
    try {
      const [scenesRes, objectsRes, emotionsRes] = await Promise.all([
        axios.get(`${API_URL}/api/analysis/${videoId}/scenes`),
        axios.get(`${API_URL}/api/analysis/${videoId}/objects`),
        axios.get(`${API_URL}/api/analysis/${videoId}/emotions`)
      ])
      
      console.log('Scenes:', scenesRes.data)
      console.log('Objects:', objectsRes.data)
      console.log('Emotions:', emotionsRes.data)
      
      const newScenes = scenesRes.data.scenes || []
      const newObjects = objectsRes.data.objects || []
      const newEmotions = emotionsRes.data.emotions || []
      
      console.log('Setting state - Scenes:', newScenes.length, 'Objects:', newObjects.length, 'Emotions:', newEmotions.length)
      
      // Update all state together, then turn off loading
      setScenes(newScenes)
      setObjects(newObjects)
      setEmotions(newEmotions)
      
      // Use setTimeout to ensure state updates have been processed
      setTimeout(async () => {
        setLoading(false)
        console.log('Loading set to false, triggering timeline refresh')
        
        // Auto-index for search after analysis completes
        try {
          console.log('Auto-indexing after analysis...')
          await axios.post(`${API_URL}/api/search/index`, { video_id: videoId })
          console.log('Video indexed successfully after analysis')
          if (onIndexComplete) {
            onIndexComplete()
          }
        } catch (indexErr) {
          console.error('Auto-indexing after analysis failed:', indexErr)
        }
        
        if (onAnalysisComplete) {
          onAnalysisComplete()
        }
      }, 100)
      
    } catch (err) {
      console.error('Analysis failed:', err)
      alert('Analysis failed. Check console for details.')
      setLoading(false)
    }
  }

  const getTopItems = (items: any[], key: string, limit: number = 5) => {
    const counts: Record<string, number> = {}
    items.forEach(item => {
      const label = item[key]
      counts[label] = (counts[label] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
  }

  return (
    <div className="panel analysis-panel">
      <h3>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="currentColor"/>
          <path d="M19 15L19.5 17L21.5 17.5L19.5 18L19 20L18.5 18L16.5 17.5L18.5 17L19 15Z" fill="currentColor"/>
          <path d="M5 4L5.5 6L7.5 6.5L5.5 7L5 9L4.5 7L2.5 6.5L4.5 6L5 4Z" fill="currentColor"/>
        </svg>
        AI Analysis
      </h3>
      
      <button onClick={runAnalysis} disabled={loading} className="analyze-btn">
        {loading ? 'Analyzing...' : 'Run Analysis'}
      </button>
      
      {!loading && scenes.length === 0 && objects.length === 0 && emotions.length === 0 && (
        <div className="empty-state">
          <p>Click "Run Analysis" to detect scenes, objects, and emotions.</p>
          <p style={{fontSize: '0.9rem', marginTop: '10px', opacity: 0.7}}>
            Note: Videos need audio for emotion analysis and clear objects for detection.
          </p>
        </div>
      )}
      
      {scenes.length > 0 && (
        <div className="analysis-section">
          <h4>🎬 Scenes Detected: {scenes.length}</h4>
        </div>
      )}
      
      {scenes.length === 0 && !loading && (objects.length > 0 || emotions.length > 0) && (
        <div className="analysis-section">
          <h4>🎬 Scenes: None detected</h4>
          <p style={{fontSize: '0.85rem', opacity: 0.7}}>Video might be too short or have no scene changes.</p>
        </div>
      )}
      
      {objects.length > 0 && (
        <div className="analysis-section">
          <h4>🎯 Top Objects</h4>
          <ul className="analysis-list">
            {getTopItems(objects, 'label').map(([label, count]) => (
              <li key={label}>
                <span className="label">{label}</span>
                <span className="count">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {objects.length === 0 && !loading && (scenes.length > 0 || emotions.length > 0) && (
        <div className="analysis-section">
          <h4>🎯 Objects: None detected</h4>
          <p style={{fontSize: '0.85rem', opacity: 0.7}}>No recognizable objects found in frames.</p>
        </div>
      )}
      
      {emotions.length > 0 && (
        <div className="analysis-section">
          <h4>😊 Emotions</h4>
          <ul className="analysis-list">
            {getTopItems(emotions, 'emotion').map(([emotion, count]) => (
              <li key={emotion}>
                <span className="label">{emotion}</span>
                <span className="count">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {emotions.length === 0 && !loading && (scenes.length > 0 || objects.length > 0) && (
        <div className="analysis-section">
          <h4>😊 Emotions: None detected</h4>
          <p style={{fontSize: '0.85rem', opacity: 0.7}}>Video has no audio or transcript.</p>
        </div>
      )}
      
      <style>{`
        .analysis-panel {
          background: #1a1f2e;
          backdrop-filter: none;
        }
        
        .analysis-panel h3 {
          color: #9ca3af !important;
          opacity: 1 !important;
        }
        
        .analyze-btn {
          width: 100%;
          padding: 12px;
          background: #0ea5e9;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 20px;
        }
        
        .analyze-btn:hover:not(:disabled) {
          background: #0284c7;
        }
        
        .analyze-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .empty-state {
          text-align: center;
          padding: 20px;
          color: #64748b;
          font-size: 0.95rem;
        }
        
        .analysis-section {
          margin-bottom: 20px;
        }
        
        .analysis-section h4 {
          color: #e4e7eb;
          margin-bottom: 12px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        .analysis-section p {
          color: #6b7280;
          margin: 5px 0;
          font-size: 0.85rem;
        }
        
        .analysis-list {
          list-style: none;
        }
        
        .analysis-list li {
          display: flex;
          justify-content: space-between;
          padding: 10px 12px;
          background: #0f1419;
          border: 1px solid #2d3748;
          border-radius: 6px;
          margin-bottom: 6px;
          color: #e4e7eb;
          font-size: 0.85rem;
        }
        
        .label {
          text-transform: capitalize;
        }
        
        .count {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}

export default AnalysisPanel
