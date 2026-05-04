import { useState } from 'react'
import { Layout, Select, ConfigProvider, theme, Typography, Divider, Button, InputNumber } from 'antd'
import PageNavbar from '../components/PageNavbar'

const { Sider, Content } = Layout
const { Text } = Typography

const PITCH_TYPE_COLORS = {
  FF: '#f0883e', SI: '#e3b341', SL: '#58a6ff',
  CH: '#3fb950', CU: '#bc8cff', FC: '#ff6b6b',
  ST: '#d2a8ff', FS: '#2da44e',
}

const PITCH_TYPE_LABELS = {
  FF: 'Four-Seam FB', SI: 'Sinker',   SL: 'Slider',
  CH: 'Changeup',    CU: 'Curveball', FC: 'Cutter',
  ST: 'Sweeper',     FS: 'Splitter',
}

function SectionLabel({ children }) {
  return (
    <Text style={{
      display: 'block', fontSize: 10, fontWeight: 700, color: '#484f58',
      textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8,
      fontFamily: "'Barlow Condensed', sans-serif",
    }}>
      {children}
    </Text>
  )
}

function Pill({ label, selected, onClick, color }) {
  const c = color || '#f0883e'
  return (
    <div
      onClick={onClick}
      style={{
        padding: '4px 10px', borderRadius: 4,
        border: `1px solid ${selected ? c : '#30363d'}`,
        background: selected ? `${c}25` : 'transparent',
        color: selected ? c : '#8b949e',
        cursor: 'pointer', fontSize: 12, fontWeight: selected ? 700 : 400,
        letterSpacing: '0.05em', userSelect: 'none', transition: 'all 0.15s',
        fontFamily: "'Barlow Condensed', sans-serif",
      }}
    >
      {label}
    </div>
  )
}

function CountSelector({ value, onChange }) {
  return (
    <div>
      <div style={{ display: 'flex', marginBottom: 3, paddingLeft: 26 }}>
        {['0S', '1S', '2S'].map(s => (
          <div key={s} style={{
            width: 34, textAlign: 'center', fontSize: 10,
            color: '#484f58', fontFamily: 'JetBrains Mono, monospace',
          }}>{s}</div>
        ))}
      </div>
      {[0, 1, 2, 3].map(b => (
        <div key={b} style={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
          <div style={{
            width: 22, fontSize: 10, color: '#484f58',
            textAlign: 'right', marginRight: 4,
            fontFamily: 'JetBrains Mono, monospace',
          }}>{b}B</div>
          {[0, 1, 2].map(s => {
            const key = `${b}-${s}`
            const sel = value === key
            return (
              <div
                key={key}
                onClick={() => onChange(sel ? '' : key)}
                style={{
                  width: 32, height: 24, marginRight: 2, borderRadius: 3,
                  border: `1px solid ${sel ? '#f0883e' : '#30363d'}`,
                  background: sel ? 'rgba(240,136,62,0.2)' : '#161b22',
                  color: sel ? '#f0883e' : '#484f58',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: 10, fontWeight: sel ? 700 : 400,
                  userSelect: 'none', transition: 'all 0.12s',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {b}-{s}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function BaseDiamond({ bases, onChange }) {
  const toggle = (base) => onChange({ ...bases, [base]: !bases[base] })

  const BaseSquare = ({ base }) => {
    const active = bases[base]
    return (
      <div
        onClick={() => toggle(base)}
        style={{
          width: 18, height: 18,
          transform: 'rotate(45deg)',
          border: `2px solid ${active ? '#f0883e' : '#30363d'}`,
          background: active ? 'rgba(240,136,62,0.35)' : '#161b22',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
      />
    )
  }

  return (
    <div style={{ position: 'relative', width: 100, height: 96 }}>
      {/* 2B top */}
      <div style={{ position: 'absolute', left: 41, top: 4 }}>
        <BaseSquare base="second" />
      </div>
      {/* 3B left */}
      <div style={{ position: 'absolute', left: 5, top: 38 }}>
        <BaseSquare base="third" />
      </div>
      {/* 1B right */}
      <div style={{ position: 'absolute', left: 77, top: 38 }}>
        <BaseSquare base="first" />
      </div>
      {/* Home (display only) */}
      <div style={{
        position: 'absolute', left: 41, top: 72,
        width: 18, height: 18, transform: 'rotate(45deg)',
        border: '2px solid #30363d', background: '#161b22',
      }} />
      {/* Labels */}
      <span style={{ position: 'absolute', left: 39, top: -13, fontSize: 9, color: '#484f58', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.05em' }}>2B</span>
      <span style={{ position: 'absolute', left: -17, top: 42, fontSize: 9, color: '#484f58', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.05em' }}>3B</span>
      <span style={{ position: 'absolute', left: 99, top: 42, fontSize: 9, color: '#484f58', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.05em' }}>1B</span>
    </div>
  )
}

function MiniDiamond({ bases }) {
  const Base = ({ active }) => (
    <div style={{
      width: 10, height: 10, transform: 'rotate(45deg)',
      background: active ? '#f0883e' : '#21262d',
      border: `1px solid ${active ? '#f0883e' : '#30363d'}`,
      transition: 'all 0.15s',
    }} />
  )
  return (
    <div style={{ position: 'relative', width: 36, height: 36 }}>
      <div style={{ position: 'absolute', left: 13, top: 2 }}><Base active={bases.second} /></div>
      <div style={{ position: 'absolute', left: 2,  top: 13 }}><Base active={bases.third} /></div>
      <div style={{ position: 'absolute', left: 24, top: 13 }}><Base active={bases.first} /></div>
      <div style={{ position: 'absolute', left: 13, top: 24 }}>
        <div style={{ width: 10, height: 10, transform: 'rotate(45deg)', background: '#21262d', border: '1px solid #30363d' }} />
      </div>
    </div>
  )
}

function PitchCard({ rank, result, isTop }) {
  const isEmpty = !result
  const color = isEmpty ? '#484f58' : (PITCH_TYPE_COLORS[result.pitchType] || '#484f58')

  return (
    <div style={{
      background: '#161b22',
      border: `1px solid ${isTop ? '#1f6feb' : '#21262d'}`,
      borderRadius: 8,
      padding: '16px',
      position: 'relative',
      opacity: isEmpty ? 0.35 : 1,
      transition: 'opacity 0.4s',
    }}>
      {/* Rank badge */}
      <div style={{
        position: 'absolute', top: 12, right: 12,
        width: 22, height: 22, borderRadius: '50%',
        background: isTop ? '#1f6feb' : '#21262d',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700,
        color: isTop ? '#fff' : '#484f58',
        fontFamily: 'JetBrains Mono, monospace',
      }}>
        {rank}
      </div>

      {/* Pitch type header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
        <span style={{
          fontSize: 22, fontWeight: 700, color,
          fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em', lineHeight: 1,
        }}>
          {isEmpty ? '—' : result.pitchType}
        </span>
        <span style={{ fontSize: 12, color: '#8b949e', fontFamily: "'Barlow Condensed', sans-serif" }}>
          {isEmpty ? '' : PITCH_TYPE_LABELS[result.pitchType]}
        </span>
      </div>

      {/* 4 metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { label: 'Out Rate',  value: isEmpty ? '—' : `${result.outRate}%`,              color: '#e3b341' },
          { label: 'xRuns',     value: isEmpty ? '—' : result.expectedRuns.toFixed(2),    color: '#ff6b6b' },
          { label: 'Win%+',     value: isEmpty ? '—' : `+${result.winProbIncrease}%`,     color: '#3fb950' },
          { label: 'Avg Runs',  value: isEmpty ? '—' : result.avgRuns.toFixed(2),         color: '#58a6ff' },
        ].map(({ label, value, color: c }) => (
          <div key={label} style={{ background: '#0d1117', borderRadius: 6, padding: '8px 10px' }}>
            <div style={{
              fontSize: 9, color: '#484f58', textTransform: 'uppercase',
              letterSpacing: '0.1em', marginBottom: 4,
              fontFamily: "'Barlow Condensed', sans-serif",
            }}>
              {label}
            </div>
            <div style={{
              fontSize: 22, fontWeight: 700,
              color: isEmpty ? '#484f58' : c,
              fontFamily: 'JetBrains Mono, monospace', lineHeight: 1,
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const MOCK_RESULTS = [
  { pitchType: 'FF', outRate: 62,  expectedRuns: 0.82, winProbIncrease: 3.2, avgRuns: 0.61 },
  { pitchType: 'SL', outRate: 54,  expectedRuns: 1.10, winProbIncrease: 2.1, avgRuns: 0.94 },
  { pitchType: 'CH', outRate: 48,  expectedRuns: 1.38, winProbIncrease: 1.5, avgRuns: 1.20 },
  { pitchType: 'CU', outRate: 41,  expectedRuns: 1.72, winProbIncrease: 0.8, avgRuns: 1.53 },
]

export default function PitchPredictionPage() {
  const [pitcherId, setPitcherId]     = useState('')
  const [batterId, setBatterId]       = useState('')
  const [inningHalf, setInningHalf]   = useState('TOP')
  const [inning, setInning]           = useState(1)
  const [scoreUs, setScoreUs]         = useState(0)
  const [scoreThem, setScoreThem]     = useState(0)
  const [count, setCount]             = useState('')
  const [outs, setOuts]               = useState(0)
  const [bases, setBases]             = useState({ first: false, second: false, third: false })
  const [results, setResults]         = useState(null)
  const [loading, setLoading]         = useState(false)

  const handlePredict = () => {
    setLoading(true)
    setTimeout(() => {
      setResults(MOCK_RESULTS)
      setLoading(false)
    }, 700)
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#f0883e',
          colorBgContainer: '#161b22',
          colorBgElevated: '#1c2128',
          colorBgLayout: '#0d1117',
          colorBorder: '#30363d',
          colorBorderSecondary: '#21262d',
          colorText: '#e6edf3',
          colorTextSecondary: '#8b949e',
          fontFamily: "'Barlow Condensed', system-ui, sans-serif",
          borderRadius: 6,
        },
        components: {
          Select: { optionSelectedBg: '#1c2128' },
        },
      }}
    >
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', flexDirection: 'column' }}>
        <PageNavbar />

        {/* Sub-header */}
        <div style={{
          display: 'flex', alignItems: 'center',
          padding: '0 24px', background: '#0d1117',
          borderBottom: '1px solid #21262d', height: 48,
        }}>
          <Text style={{
            color: '#484f58', fontSize: 11, textTransform: 'uppercase',
            letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif",
          }}>
            Pitch Prediction
          </Text>
        </div>

        <Layout style={{ background: '#0d1117', flex: 1 }}>
          {/* Left Sider */}
          <Sider width={270} style={{ background: '#0d1117', borderRight: '1px solid #21262d', overflow: 'auto' }}>
            <div style={{ padding: '16px 14px', color: '#e6edf3' }}>

              <SectionLabel>Pitcher</SectionLabel>
              <Select
                showSearch allowClear placeholder="Search pitcher..."
                value={pitcherId || undefined}
                onChange={v => setPitcherId(v || '')}
                options={[]}
                style={{ width: '100%' }}
                filterOption={(input, opt) => (opt?.label || '').toLowerCase().includes(input.toLowerCase())}
              />

              <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

              <SectionLabel>Batter</SectionLabel>
              <Select
                showSearch allowClear placeholder="Search batter..."
                value={batterId || undefined}
                onChange={v => setBatterId(v || '')}
                options={[]}
                style={{ width: '100%' }}
                filterOption={(input, opt) => (opt?.label || '').toLowerCase().includes(input.toLowerCase())}
              />

              <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

              <SectionLabel>Inning</SectionLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['TOP', 'BOT'].map(half => (
                    <Pill key={half} label={half} selected={inningHalf === half} onClick={() => setInningHalf(half)} />
                  ))}
                </div>
                <InputNumber
                  min={1} max={20} value={inning}
                  onChange={v => setInning(v || 1)}
                  style={{ width: 76 }}
                />
              </div>

              <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

              <SectionLabel>Score</SectionLabel>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 9, color: '#484f58', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}>Us</span>
                  <InputNumber min={0} max={30} value={scoreUs} onChange={v => setScoreUs(v ?? 0)} style={{ width: 65 }} />
                </div>
                <span style={{ color: '#484f58', fontSize: 18, lineHeight: '32px', marginBottom: 2 }}>—</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 9, color: '#484f58', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Barlow Condensed', sans-serif" }}>Them</span>
                  <InputNumber min={0} max={30} value={scoreThem} onChange={v => setScoreThem(v ?? 0)} style={{ width: 65 }} />
                </div>
              </div>

              <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

              <SectionLabel>Count</SectionLabel>
              <CountSelector value={count} onChange={setCount} />

              <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

              <SectionLabel>Outs</SectionLabel>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(n => (
                  <Pill key={n} label={`${n} Out${n !== 1 ? 's' : ''}`} selected={outs === n} onClick={() => setOuts(n)} />
                ))}
              </div>

              <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

              <SectionLabel>Runners on Base</SectionLabel>
              <div style={{ paddingLeft: 20, marginTop: 14, marginBottom: 4 }}>
                <BaseDiamond bases={bases} onChange={setBases} />
              </div>

              <Divider style={{ borderColor: '#21262d', margin: '16px 0 12px' }} />

              <Button
                type="primary"
                onClick={handlePredict}
                loading={loading}
                block
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 16, letterSpacing: '0.12em', height: 42,
                }}
              >
                Predict
              </Button>

            </div>
          </Sider>

          {/* Right Content */}
          <Content style={{ padding: '20px', background: '#0d1117', overflow: 'auto' }}>

            {/* Game State Summary Bar */}
            <div style={{
              background: '#161b22', border: '1px solid #21262d', borderRadius: 8,
              padding: '12px 20px', marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap',
            }}>
              {[
                {
                  label: 'Inning',
                  content: (
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#e6edf3', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
                      {inningHalf} <span style={{ color: '#f0883e' }}>{inning}</span>
                    </span>
                  ),
                },
                {
                  label: 'Score',
                  content: (
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#e6edf3', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
                      {scoreUs} <span style={{ color: '#484f58', fontSize: 14 }}>—</span> {scoreThem}
                    </span>
                  ),
                },
                {
                  label: 'Count',
                  content: (
                    <span style={{ fontSize: 18, fontWeight: 700, color: count ? '#f0883e' : '#484f58', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1 }}>
                      {count || '—'}
                    </span>
                  ),
                },
                {
                  label: 'Outs',
                  content: (
                    <div style={{ display: 'flex', gap: 5, alignItems: 'center', height: 18 }}>
                      {[0, 1, 2].map(n => (
                        <div key={n} style={{
                          width: 11, height: 11, borderRadius: '50%',
                          background: n < outs ? '#e3b341' : 'transparent',
                          border: `1.5px solid ${n < outs ? '#e3b341' : '#30363d'}`,
                          transition: 'all 0.15s',
                        }} />
                      ))}
                    </div>
                  ),
                },
                {
                  label: 'Runners',
                  content: <MiniDiamond bases={bases} />,
                },
              ].map(({ label, content }, i, arr) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ paddingRight: 20 }}>
                    <div style={{
                      fontSize: 9, color: '#484f58', textTransform: 'uppercase',
                      letterSpacing: '0.1em', marginBottom: 6,
                      fontFamily: "'Barlow Condensed', sans-serif",
                    }}>
                      {label}
                    </div>
                    {content}
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ width: 1, height: 36, background: '#21262d', marginRight: 20, flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>

            {/* Cards label */}
            <div style={{ marginBottom: 14 }}>
              <Text style={{
                fontSize: 10, color: '#484f58', textTransform: 'uppercase',
                letterSpacing: '0.12em', fontFamily: "'Barlow Condensed', sans-serif",
              }}>
                Top 4 Recommended Pitches
              </Text>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[0, 1, 2, 3].map(i => (
                <PitchCard key={i} rank={i + 1} result={results?.[i] ?? null} isTop={i === 0} />
              ))}
            </div>
          </Content>
        </Layout>
      </div>
    </ConfigProvider>
  )
}
