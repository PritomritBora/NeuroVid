import React from 'react'

interface Props {
  onGetStarted: () => void
}

const LandingPage: React.FC<Props> = ({ onGetStarted }) => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <nav className="navbar">
          <div className="nav-content">
            <div className="logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2" />
                <path d="M9 8L15 12L9 16V8Z" fill="currentColor" />
              </svg>
              <span>NeuroVid</span>
            </div>
            <button className="cta-btn" onClick={onGetStarted}>
              Get Started Free
            </button>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Powered by AI
          </div>
          <h1 className="hero-title">
            Transform Videos into
            <span className="gradient-text"> Intelligent Insights</span>
          </h1>
          <p className="hero-subtitle">
            Advanced AI-powered video analysis with automatic transcription, object detection,
            semantic search, and emotion analysis. All in one powerful platform.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={onGetStarted}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Start Analyzing
            </button>
            <button className="secondary-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M10 8L16 12L10 16V8Z" fill="currentColor" />
              </svg>
              Watch Demo
            </button>
          </div>
          <div className="hero-stats">
            {/* <div className="stat">
              <div className="stat-value">99+</div>
              <div className="stat-label">Languages</div>
            </div>
            <div className="stat">
              <div className="stat-value">80+</div>
              <div className="stat-label">Object Classes</div>
            </div>
            <div className="stat">
              <div className="stat-value">Real-time</div>
              <div className="stat-label">Processing</div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2>Powerful Features</h2>
          <p>Everything you need to understand your videos</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Speech-to-Text</h3>
            <p>Automatic transcription with Whisper AI. Word-level timestamps and 99 language support.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="white" />
                <path d="M21 15L16 10L5 21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Object Detection</h3>
            <p>Identify people, objects, and actions using YOLOv5. 80+ object classes detected automatically.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2" />
                <path d="M21 21L16.65 16.65" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h3>Semantic Search</h3>
            <p>Natural language queries across video content. Find moments with AI-powered understanding.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <circle cx="9" cy="9" r="1" fill="white" />
                <circle cx="15" cy="9" r="1" fill="white" />
              </svg>
            </div>
            <h3>Emotion Analysis</h3>
            <p>Detect emotional tone throughout your video. Track sentiment and engagement patterns.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Scene Detection</h3>
            <p>Automatic scene segmentation with keyframe extraction. Navigate videos effortlessly.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3>Self-Hosted</h3>
            <p>Complete control over your data. Deploy on your infrastructure with Docker support.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Transform your videos into actionable insights with AI</p>
          <button className="cta-large-btn" onClick={onGetStarted}>
            Start Analyzing Videos
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </section>

      <style>{`
        .landing-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
        }

        /* Navbar */
        .navbar {
          padding: 20px 0;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.5rem;
          font-weight: 800;
          color: #1a202c;
        }

        .logo svg {
          color: #0ea5e9;
        }

        .cta-btn {
          padding: 12px 28px;
          background: linear-gradient(135deg, #0ea5e9 0%, #ec4899 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
        }

        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(14, 165, 233, 0.4);
        }

        /* Hero Section */
        .hero {
          padding: 80px 40px 120px;
          text-align: center;
        }

        .hero-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          background: linear-gradient(135deg, #f0f9ff 0%, #fce7f3 100%);
          border: 2px solid #e0f2fe;
          border-radius: 24px;
          color: #0ea5e9;
          font-weight: 700;
          font-size: 0.9rem;
          margin-bottom: 30px;
          animation: fadeInDown 0.8s ease;
        }

        .badge-dot {
          width: 8px;
          height: 8px;
          background: #0ea5e9;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 900;
          color: #1a202c;
          line-height: 1.1;
          margin-bottom: 24px;
          letter-spacing: -0.03em;
          animation: fadeInUp 0.8s ease 0.2s both;
        }

        .gradient-text {
          background: linear-gradient(135deg, #0ea5e9 0%, #ec4899 50%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-subtitle {
          font-size: 1.3rem;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 40px;
          font-weight: 500;
          animation: fadeInUp 0.8s ease 0.4s both;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 60px;
          animation: fadeInUp 0.8s ease 0.6s both;
        }

        .primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 36px;
          background: linear-gradient(135deg, #0ea5e9 0%, #ec4899 100%);
          color: white;
          border: none;
          border-radius: 14px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3);
        }

        .primary-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(14, 165, 233, 0.4);
        }

        .secondary-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 36px;
          background: white;
          color: #1a202c;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }

        .secondary-btn:hover {
          border-color: #0ea5e9;
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .hero-stats {
          display: flex;
          gap: 60px;
          justify-content: center;
          animation: fadeInUp 0.8s ease 0.8s both;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          color: #1a202c;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 0.95rem;
          color: #64748b;
          font-weight: 600;
        }

        /* Features Section */
        .features {
          padding: 100px 40px;
          background: white;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          font-size: 3rem;
          font-weight: 800;
          color: #1a202c;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .section-header p {
          font-size: 1.2rem;
          color: #64748b;
          font-weight: 500;
        }

        .features-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
        }

        .feature-card {
          padding: 36px;
          background: #ffffff;
          border: 2px solid #e2e8f0;
          border-radius: 20px;
          transition: all 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
          border-color: #0ea5e9;
        }

        .feature-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .feature-card h3 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 12px;
        }

        .feature-card p {
          color: #64748b;
          line-height: 1.6;
          font-size: 1rem;
        }

        /* CTA Section */
        .cta-section {
          padding: 100px 40px;
          background: linear-gradient(135deg, #0ea5e9 0%, #ec4899 100%);
          text-align: center;
        }

        .cta-content h2 {
          font-size: 3rem;
          font-weight: 800;
          color: white;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .cta-content p {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 40px;
          font-weight: 500;
        }

        .cta-large-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 20px 48px;
          background: white;
          color: #0ea5e9;
          border: none;
          border-radius: 16px;
          font-size: 1.2rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
        }

        .cta-large-btn:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-actions {
            flex-direction: column;
          }
          
          .hero-stats {
            flex-direction: column;
            gap: 30px;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default LandingPage
