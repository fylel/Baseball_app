import { useState } from 'react'
import { Typography } from 'antd'

const { Text } = Typography

const ZONE_GRID = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
const CELL = 88
const CORNER = 55

const CORNER_ZONES = [
  { zone: 11, x: 2, y: 2 },
  { zone: 12, x: CORNER + CELL * 3 + 4, y: 2 },
  { zone: 13, x: 2, y: CORNER + CELL * 3 + 4 },
  { zone: 14, x: CORNER + CELL * 3 + 4, y: CORNER + CELL * 3 + 4 },
]

const METRICS = [
  { key: 'out', label: 'Out%', color: '88,166,255' },
  { key: 'foul', label: 'Foul%', color: '227,179,65' },
  { key: 'whiff', label: 'Whiff%', color: '255,107,107' },
]

export default function ZoneHeatmap({ zoneData, totalPitches, setName, setColor }) {
  const [metric, setMetric] = useState('out')
  const metricConfig = METRICS.find(m => m.key === metric)

  const getValue = (zone) => {
    const d = zoneData?.[zone]
    if (!d) return 0
    if (metric === 'out') return d.outRate
    if (metric === 'foul') return d.foulRate
    if (metric === 'whiff') return d.whiffRate
    return 0
  }

  const getDisplayText = (zone) => {
    const d = zoneData?.[zone]
    if (!d || d.total === 0) return { main: '—', sub: '' }
    if (metric === 'out') return { main: `${(d.outRate * 100).toFixed(0)}%`, sub: `n=${d.total}` }
    if (metric === 'foul') return { main: `${(d.foulRate * 100).toFixed(0)}%`, sub: `n=${d.total}` }
    if (metric === 'whiff') return { main: `${(d.whiffRate * 100).toFixed(0)}%`, sub: `n=${d.total}` }
    return { main: '—', sub: '' }
  }

  const getCellBg = (zone) => {
    const v = Math.max(0, Math.min(1, getValue(zone)))
    return `rgba(${metricConfig.color}, ${v * 0.85 + 0.05})`
  }

  const getCellTextColor = (zone) => getValue(zone) > 0.55 ? '#0d1117' : '#e6edf3'

  const totalSize = CORNER * 2 + CELL * 3 + 4

  return (
    <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {setName && setColor && (
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: setColor }} />
          )}
          <Text style={{
            color: '#e6edf3', fontSize: 13, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            fontFamily: "'Barlow Condensed', sans-serif",
          }}>
            Strike Zone {setName ? `· ${setName}` : ''}
          </Text>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {METRICS.map(m => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              style={{
                padding: '3px 10px', borderRadius: 4,
                border: `1px solid ${metric === m.key ? `rgba(${m.color},1)` : '#30363d'}`,
                background: metric === m.key ? `rgba(${m.color},0.2)` : 'transparent',
                color: metric === m.key ? `rgb(${m.color})` : '#484f58',
                cursor: 'pointer', fontSize: 11,
                fontWeight: metric === m.key ? 700 : 400,
                letterSpacing: '0.05em',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width={totalSize} height={totalSize} style={{ borderRadius: 4, overflow: 'hidden' }}>
          <rect width={totalSize} height={totalSize} fill="#0d1117" />

          {/* Main 3x3 grid */}
          {ZONE_GRID.map((row, ri) =>
            row.map((zone, ci) => {
              const { main, sub } = getDisplayText(zone)
              const x = CORNER + ci * CELL + 2
              const y = CORNER + ri * CELL + 2
              const textCol = getCellTextColor(zone)
              return (
                <g key={zone}>
                  <rect x={x} y={y} width={CELL - 2} height={CELL - 2} fill={getCellBg(zone)} rx={2} />
                  <text x={x + CELL / 2} y={y + 18} textAnchor="middle"
                    fontSize={10} fill={textCol} opacity={0.4}
                    fontFamily="JetBrains Mono, monospace" fontWeight="700">
                    {zone}
                  </text>
                  <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle"
                    dominantBaseline="middle" fontSize={22} fontWeight="800"
                    fill={textCol} fontFamily="JetBrains Mono, monospace">
                    {main}
                  </text>
                  <text x={x + CELL / 2} y={y + CELL - 12} textAnchor="middle"
                    fontSize={10} fill={textCol} opacity={0.6}
                    fontFamily="JetBrains Mono, monospace">
                    {sub}
                  </text>
                </g>
              )
            })
          )}

          {/* Corner zones 11, 12, 13, 14 */}
          {CORNER_ZONES.map(({ zone, x, y }) => {
            const { main, sub } = getDisplayText(zone)
            const textCol = getCellTextColor(zone)
            const cx = x + CORNER / 2
            return (
              <g key={zone}>
                <rect x={x} y={y} width={CORNER - 2} height={CORNER - 2} fill={getCellBg(zone)} rx={2} />
                <text x={cx} y={y + 11} textAnchor="middle"
                  fontSize={9} fill={textCol} opacity={0.4}
                  fontFamily="JetBrains Mono, monospace" fontWeight="700">
                  {zone}
                </text>
                <text x={cx} y={y + CORNER / 2 + 2} textAnchor="middle"
                  dominantBaseline="middle" fontSize={14} fontWeight="800"
                  fill={textCol} fontFamily="JetBrains Mono, monospace">
                  {main}
                </text>
                <text x={cx} y={y + CORNER - 9} textAnchor="middle"
                  fontSize={8} fill={textCol} opacity={0.6}
                  fontFamily="JetBrains Mono, monospace">
                  {sub}
                </text>
              </g>
            )
          })}

          {/* Grid lines (main 3x3 only) */}
          <line x1={CORNER + CELL + 2} y1={CORNER + 2} x2={CORNER + CELL + 2} y2={CORNER + CELL * 3 + 2} stroke="#21262d" strokeWidth={1} />
          <line x1={CORNER + CELL * 2 + 2} y1={CORNER + 2} x2={CORNER + CELL * 2 + 2} y2={CORNER + CELL * 3 + 2} stroke="#21262d" strokeWidth={1} />
          <line x1={CORNER + 2} y1={CORNER + CELL + 2} x2={CORNER + CELL * 3 + 2} y2={CORNER + CELL + 2} stroke="#21262d" strokeWidth={1} />
          <line x1={CORNER + 2} y1={CORNER + CELL * 2 + 2} x2={CORNER + CELL * 3 + 2} y2={CORNER + CELL * 2 + 2} stroke="#21262d" strokeWidth={1} />
          <rect x={CORNER + 1} y={CORNER + 1} width={CELL * 3 + 2} height={CELL * 3 + 2} fill="none" stroke="#30363d" strokeWidth={2} rx={3} />
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 10 }}>
        <Text style={{ fontSize: 10, color: '#484f58' }}>Low</Text>
        <div style={{
          width: 80, height: 6, borderRadius: 3,
          background: `linear-gradient(to right, rgba(${metricConfig.color},0.05), rgba(${metricConfig.color},0.9))`,
        }} />
        <Text style={{ fontSize: 10, color: '#484f58' }}>High</Text>
      </div>
    </div>
  )
}
