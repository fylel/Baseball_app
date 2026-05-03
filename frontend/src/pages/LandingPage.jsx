import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Features', path: '/features' },
  { label: 'Historical Data', path: '/historical-data' },
  { label: 'Pitch Prediction', path: '/prediction' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const titleRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  const handleNav = (path) => {
    setLeaving(true)
    setTimeout(() => navigate(path), 600)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      overflow: 'hidden',
      fontFamily: "'Barlow Condensed', sans-serif",
      transform: leaving ? 'translateY(-100%)' : 'translateY(0)',
      transition: leaving ? 'transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
    }}>
      {/* Background image with dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/hero-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        filter: 'brightness(0.45)',
      }} />

      {/* Gradient overlay — darken left for text readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to right, rgba(13,17,23,0.85) 0%, rgba(13,17,23,0.3) 60%, rgba(13,17,23,0.1) 100%)',
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '28px 48px',
        zIndex: 10,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-16px)',
        transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/logo.jpg" alt="logo" style={{ width: 48, height: 27, borderRadius: 4 }} />
          <span style={{
            color: '#e6edf3',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.15em',
          }}>PitchLab</span>
        </div>

        <div style={{ display: 'flex', gap: 40 }}>
          {NAV_LINKS.map(link => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              style={{
                background: 'none',
                border: 'none',
                color: '#e6edf3',
                fontSize: 14,
                letterSpacing: '0.08em',
                cursor: 'pointer',
                padding: 0,
                opacity: 0.85,
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => e.target.style.opacity = 1}
              onMouseLeave={e => e.target.style.opacity = 0.85}
            >
              {link.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Left content */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: 48,
        transform: visible ? 'translateY(-55%)' : 'translateY(-40%)',
        zIndex: 2,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(42px, 6vw, 80px)',
          color: '#ffffff',
          lineHeight: 1.05,
          letterSpacing: '0.04em',
        }}>
          PREDICT THE PLAY.<br />WIN SMARTER.
        </div>

        <div style={{
          marginTop: 20,
          color: '#8b949e',
          fontSize: 'clamp(12px, 1.2vw, 15px)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          Analyze every pitch with MLB Statcast data.
        </div>
      </div>

      {/* Big background text */}
      <div
        ref={titleRef}
        style={{
          position: 'absolute',
          bottom: -24,
          left: 0,
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(80px, 17vw, 220px)',
          color: 'rgba(240, 136, 62, 0.18)',
          letterSpacing: '-0.01em',
          lineHeight: 1,
          userSelect: 'none',
          whiteSpace: 'nowrap',
          zIndex: 1,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 1s ease 0.4s, transform 1s ease 0.4s',
          animation: visible ? 'drift 20s ease-in-out infinite' : 'none',
        }}
      >
        N.J.D
      </div>

      <style>{`
        @keyframes drift {
          0%   { transform: translateX(0px); }
          50%  { transform: translateX(-18px); }
          100% { transform: translateX(0px); }
        }
      `}</style>
    </div>
  )
}
