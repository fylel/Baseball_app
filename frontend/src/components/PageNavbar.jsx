import { useNavigate, useLocation } from 'react-router-dom'

const LINKS = [
  { label: 'Features', path: '/features' },
  { label: 'Historical Data', path: '/historical-data' },
  { label: 'Pitch Prediction', path: '/prediction' },
]

export default function PageNavbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', height: 56, borderBottom: '1px solid #21262d',
      background: '#0d1117', position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        <img src="/logo.jpg" alt="logo" style={{ width: 48, height: 27, borderRadius: 4 }} />
        <span style={{
          color: '#e6edf3', fontSize: 16, fontWeight: 700,
          letterSpacing: '0.15em', fontFamily: "'Barlow Condensed', sans-serif",
        }}>PitchLab</span>
      </div>

      <div style={{ display: 'flex', gap: 40 }}>
        {LINKS.map(link => {
          const isActive = pathname === link.path
          return (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 2px 0',
                color: isActive ? '#f0883e' : '#8b949e',
                fontSize: 14, letterSpacing: '0.08em',
                fontFamily: "'Barlow Condensed', sans-serif",
                borderBottom: isActive ? '2px solid #f0883e' : '2px solid transparent',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#e6edf3' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#8b949e' }}
            >
              {link.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
