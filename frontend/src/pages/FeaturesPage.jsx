import PageNavbar from '../components/PageNavbar'

export default function FeaturesPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', flexDirection: 'column' }}>
      <PageNavbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: '#f0883e', letterSpacing: '0.1em' }}>FEATURES</span>
        <span style={{ color: '#484f58', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>Coming soon</span>
      </div>
    </div>
  )
}
