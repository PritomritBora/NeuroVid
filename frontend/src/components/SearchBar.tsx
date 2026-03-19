import React, { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config'

interface Props {
  videoId: string
  onResultClick: (time: number) => void
}

const SearchBar: React.FC<Props> = ({ videoId, onResultClick }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [indexing, setIndexing] = useState(false)

  const handleIndex = async () => {
    setIndexing(true)
    try {
      await axios.post(`${API_URL}/api/search/index`, { video_id: videoId })
      alert('Video indexed for search! You can now search.')
    } catch (error) {
      console.error('Indexing failed:', error)
      alert('Indexing failed. Make sure Qdrant is running.')
    } finally {
      setIndexing(false)
    }
  }

  const handleSearch = async () => {
    if (!query.trim()) return
    
    setSearching(true)
    try {
      const response = await axios.post(`${API_URL}/api/search/query`, {
        video_id: videoId,
        query
      })
      console.log('Search response:', response.data)
      console.log('Search results:', response.data.results)
      console.log('Results length:', response.data.results?.length)
      setResults(response.data.results || [])
    } catch (error) {
      console.error('Search failed:', error)
      alert('Search failed. Make sure video is indexed.')
    } finally {
      setSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="panel search-panel">
      <h3>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Semantic Search
      </h3>
      
      <button onClick={handleIndex} disabled={indexing} className="index-btn">
        {indexing ? 'Indexing...' : '🔄 Index for Search'}
      </button>
      
      <div className="search-input-wrapper">
        <div className="search-input-container">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Ask anything: 'Find happy moments' or 'Show me the guitar scene'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
          />
          <button onClick={handleSearch} disabled={searching} className="search-btn">
            {searching ? (
              <div className="spinner-small"></div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {results.length > 0 && (
        <div className="search-results">
          <div className="results-header">
            <span className="results-count">{results.length} results found</span>
          </div>
          <div className="results-list">
            {results.map((result, idx) => (
              <div 
                key={idx} 
                className="search-result"
                onClick={() => onResultClick(result.timestamp)}
              >
                <div className="result-header">
                  <span className="result-time">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {formatTime(result.timestamp)}
                  </span>
                  <span className="result-score">
                    {(result.relevance_score * 100).toFixed(0)}% match
                  </span>
                </div>
                <p className="result-text">{result.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <style>{`
        .search-panel {
          background: #1a1f2e;
          border: none;
          border-radius: 0;
        }
        
        .search-panel h3 {
          color: #9ca3af !important;
          opacity: 1 !important;
        }
        
        .index-btn {
          width: 100%;
          padding: 10px;
          background: #2d3748;
          color: #10b981;
          border: 1px solid #10b981;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 15px;
        }
        
        .index-btn:hover:not(:disabled) {
          background: #10b981;
          color: white;
        }
        
        .index-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .search-input-wrapper {
          margin-bottom: 28px;
        }
        
        .search-input-container {
          position: relative;
          display: flex;
          align-items: center;
          background: #0f1419;
          border: 1px solid #2d3748;
          border-radius: 6px;
          padding: 4px;
          transition: all 0.2s;
        }
        
        .search-input-container:focus-within {
          border-color: #0ea5e9;
        }
        
        .search-icon {
          position: absolute;
          left: 16px;
          color: #6b7280;
          pointer-events: none;
        }
        
        .search-input {
          flex: 1;
          padding: 12px 16px 12px 48px;
          background: transparent;
          border: none;
          color: #e4e7eb;
          font-size: 0.9rem;
          outline: none;
          font-weight: 400;
        }
        
        .search-input::placeholder {
          color: #6b7280;
        }
        
        .search-btn {
          padding: 10px 20px;
          background: #0ea5e9;
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 60px;
          font-weight: 600;
          font-size: 0.85rem;
        }
        
        .search-btn:hover:not(:disabled) {
          background: #0284c7;
        }
        
        .search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .results-header {
          margin-bottom: 18px;
          padding-bottom: 14px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .results-count {
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 700;
        }
        
        .results-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        
        .search-result {
          padding: 14px;
          background: #0f1419;
          border: 1px solid #2d3748;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .search-result:hover {
          background: #2d3748;
          border-color: #0ea5e9;
        }
        
        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .result-time {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #0ea5e9;
          font-weight: 700;
          font-size: 0.95rem;
        }
        
        .result-score {
          background: linear-gradient(135deg, #f0f9ff 0%, #fce7f3 100%);
          padding: 6px 14px;
          border-radius: 24px;
          font-size: 0.85rem;
          color: #0ea5e9;
          font-weight: 700;
          border: 2px solid #e0f2fe;
        }
        
        .result-text {
          color: #9ca3af;
          font-size: 0.85rem;
          line-height: 1.5;
          font-weight: 400;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default SearchBar
