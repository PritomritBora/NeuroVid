import React, { useState } from 'react'
import axios from 'axios'

interface Props {
  onUploadSuccess: (videoId: string) => void
}

const VideoUpload: React.FC<Props> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('http://localhost:8000/api/videos/upload', formData)
      onUploadSuccess(response.data.video_id)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ border: '2px dashed #ccc', padding: '40px', textAlign: 'center' }}>
      <h2>Upload Video</h2>
      <input type="file" accept="video/*" onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
    </div>
  )
}

export default VideoUpload
