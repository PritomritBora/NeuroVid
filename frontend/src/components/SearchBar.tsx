import React, { useState } from 'react'
import axios from 'axios'

interface Props {
  videoId: string
}

const SearchBar: React.FC<Props> = ({ videoId }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/search/query', {
        video_id: videoId,
        query
      })
      setResults(response.data.results)
    } catch (error) {
      console.error('Search failed:', error)
    }
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <input
        type="text"
        placeholder="Search video: 'Show me all scenes where a guitar is played'"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '70%', padding: '10px' }}
      />
      <button onClick={handleSearch} style={{ padding: '10px 20px', marginLeft: '10px' }}>
        Search
      </button>
      
      {results.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>Search Results:</h4>
          {results.map((result, idx) => (
            <div key={idx} style={{ padding: '10px', border: '1px solid #eee', marginBottom: '10px' }}>
              <p>Timestamp: {result.timestamp}s</p>
              <p>{result.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
