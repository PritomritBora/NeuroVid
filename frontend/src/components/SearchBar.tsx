import React, { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config'

interface Props {
  videoId: string
  onResultClick: (time: number) => void
  onSearchResults?: (results: any[]) => void
}

const SearchBar: React.FC<Props> = ({ videoId, onResultClick, onSearchResults }) => {
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [indexed, setIndexed] = useState(true) // Assume indexed by default
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleManualIndex = async () => {
    try {
      console.log('Manual indexing video:', videoId)
      await axios.post(`${API_URL}/api/search/index`, { video_id: videoId })
      setIndexed(true)
      showToast('Video indexed successfully!', 'success')
    } catch (error) {
      console.error('Manual indexing failed:', error)
      showToast('Indexing failed. Make sure Qdrant is running.', 'error')
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
      const searchResults = response.data.results || []
      console.log('Found', searchResults.length, 'results - highlighting timeline')
      
      // Notify parent about search results for timeline highlighting
      if (onSearchResults) {
        onSearchResults(searchResults)
      }
      
      // Show success toast with result count
      if (searchResults.length > 0) {
        showToast(`Found ${searchResults.length} matching moment${searchResults.length > 1 ? 's' : ''} - check timeline!`, 'success')
      } else {
        showToast('No results found. Try a different search.', 'error')
      }
    } catch (error: any) {
      console.error('Search failed:', error)
      if (error.response?.status === 404 || error.response?.data?.detail?.includes('not indexed')) {
        showToast('Video not indexed yet. Click "Re-index" below.', 'error')
      } else {
        showToast('Search failed. Check console for details.', 'error')
      }
    } finally {
      setSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="panel search-panel">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' ? '✓' : '✕'}
          </div>
          <span>{toast.message}</span>
        </div>
      )}
      
      <h3>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Smart Search
      </h3>
      
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
        {!indexed && (
          <button onClick={handleManualIndex} className="reindex-btn">
            🔄 Re-index for Search
          </button>
        )}
      </div>
      
      <style>{`
        .search-panel {
          background: #1a1f2e;
          border: none;
          border-radius: 0;
          position: relative;
        }
        
        .toast {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          padding: 12px 20px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          z-index: 1000;
          animation: slideDown 0.3s ease-out;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          min-width: 280px;
        }
        
        .toast-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: 1px solid #34d399;
        }
        
        .toast-error {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: 1px solid #f87171;
        }
        
        .toast-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1rem;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        .search-panel h3 {
          color: #9ca3af !important;
          opacity: 1 !important;
        }
        
        .search-input-wrapper {
          margin-bottom: 20px;
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
          width: 100%;
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
          padding: 14px 16px 14px 48px;
          background: transparent;
          border: none;
          color: #e4e7eb;
          font-size: 0.9rem;
          outline: none;
          font-weight: 400;
          width: 100%;
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
        
        .reindex-btn {
          width: 100%;
          padding: 8px;
          background: transparent;
          color: #64748b;
          border: 1px solid #374151;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 8px;
        }
        
        .reindex-btn:hover {
          background: #374151;
          color: #10b981;
          border-color: #10b981;
        }
      `}</style>
    </div>
  )
}

export default SearchBar
