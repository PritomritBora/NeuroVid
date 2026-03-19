import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config'

interface Props {
  videoId: string
}

const AnalysisPanel: React.FC<Props> = ({ videoId }) => {
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
      
      setScenes(scenesRes.data.scenes || [])
      setObjects(objectsRes.data.objects || [])
      setEmotions(emotionsRes.data.emotions || [])
      
      console.log('State updated - Scenes:', scenesRes.data.scenes?.length, 'Objects:', objectsRes.data.objects?.length, 'Emotions:', emotionsRes.data.emotions?.length)
    } catch (err) {
      console.error('Analysis failed:', err)
      alert('Analysis failed. Check console for details.')
    } finally {
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
      <h3>🔍 AI Analysis</h3>
      
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
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
        }
        
        .analyze-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
          margin-bottom: 20px;
        }
        
        .analyze-btn:hover:not(:disabled) {
          transform: translateY(-2px);
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
          color: #1a202c;
          margin-bottom: 10px;
          font-size: 1rem;
        }
        
        .analysis-section p {
          color: #64748b;
          margin: 5px 0;
        }
        
        .analysis-list {
          list-style: none;
        }
        
        .analysis-list li {
          display: flex;
          justify-content: space-between;
          padding: 8px 12px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 6px;
          margin-bottom: 6px;
          color: #1a202c;
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
