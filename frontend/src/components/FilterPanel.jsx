import { Divider, Button, Typography, Select } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'

const { Text } = Typography

const ALL_PITCH_TYPES = ['FF', 'SI', 'SL', 'CH', 'CU', 'FC', 'ST', 'FS']

const PITCH_TYPE_LABELS = {
  FF: 'Four-Seam FB',
  SI: 'Sinker',
  SL: 'Slider',
  CH: 'Changeup',
  CU: 'Curveball',
  FC: 'Cutter',
  ST: 'Sweeper',
  FS: 'Splitter',
}

const PITCH_TYPE_COLORS = {
  FF: '#f0883e', SI: '#e3b341', SL: '#58a6ff',
  CH: '#3fb950', CU: '#bc8cff', FC: '#ff6b6b',
  ST: '#d2a8ff', FS: '#2da44e',
}

const YEAR_OPTIONS = [
  '2025', '2024', '2023', '2022', '2021',
  '2020', '2019', '2018', '2017', '2016', '2015'
]

const S_CELL = 34
const S_SIZE = S_CELL * 5
const S_START = S_CELL
const S_END = S_START + S_CELL * 3
const S_MID = S_SIZE / 2

const S_CORNERS = [
  { zone: 11, path: [[0,0],[S_MID,0],[S_MID,S_START],[S_START,S_START],[S_START,S_MID],[0,S_MID]], lx: 4, ly: 13 },
  { zone: 12, path: [[S_MID,0],[S_SIZE,0],[S_SIZE,S_MID],[S_END,S_MID],[S_END,S_START],[S_MID,S_START]], lx: S_SIZE-22, ly: 13 },
  { zone: 13, path: [[0,S_MID],[S_START,S_MID],[S_START,S_END],[S_MID,S_END],[S_MID,S_SIZE],[0,S_SIZE]], lx: 4, ly: S_SIZE-5 },
  { zone: 14, path: [[S_END,S_MID],[S_SIZE,S_MID],[S_SIZE,S_SIZE],[S_MID,S_SIZE],[S_MID,S_END],[S_END,S_END]], lx: S_SIZE-22, ly: S_SIZE-5 },
]
const S_GRID = [[1,2,3],[4,5,6],[7,8,9]]

const COUNT_ROWS = [
  [{ b: 0, s: 0 }, { b: 0, s: 1 }, { b: 0, s: 2 }],
  [{ b: 1, s: 0 }, { b: 1, s: 1 }, { b: 1, s: 2 }],
  [{ b: 2, s: 0 }, { b: 2, s: 1 }, { b: 2, s: 2 }],
  [{ b: 3, s: 0 }, { b: 3, s: 1 }, { b: 3, s: 2 }],
]

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
        padding: '4px 12px', borderRadius: 4,
        border: `1px solid ${selected ? c : '#30363d'}`,
        background: selected ? `${c}25` : 'transparent',
        color: selected ? c : '#8b949e',
        cursor: 'pointer', fontSize: 12, fontWeight: selected ? 700 : 400,
        letterSpacing: '0.05em', userSelect: 'none', transition: 'all 0.15s',
      }}
    >
      {label}
    </div>
  )
}

function TogglePills({ options, value, onChange, color }) {
  const toggle = (v) => {
    if (value.includes(v)) onChange(value.filter(x => x !== v))
    else onChange([...value, v])
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {options.map(opt => (
        <Pill
          key={opt.value}
          label={opt.label}
          selected={value.includes(opt.value)}
          onClick={() => toggle(opt.value)}
          color={color}
        />
      ))}
    </div>
  )
}

function SingleTogglePills({ options, value, onChange, color }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {options.map(opt => (
        <Pill
          key={opt.value}
          label={opt.label}
          selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          color={color}
        />
      ))}
    </div>
  )
}

function CountGrid({ selectedCounts, onChange }) {
  const toggle = (key) => {
    if (selectedCounts.includes(key)) onChange(selectedCounts.filter(c => c !== key))
    else onChange([...selectedCounts, key])
  }
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
      {COUNT_ROWS.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
          <div style={{
            width: 22, fontSize: 10, color: '#484f58',
            textAlign: 'right', marginRight: 4,
            fontFamily: 'JetBrains Mono, monospace',
          }}>{ri}B</div>
          {row.map(({ b, s }) => {
            const key = `${b}-${s}`
            const sel = selectedCounts.includes(key)
            return (
              <div
                key={key}
                onClick={() => toggle(key)}
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

function ZoneSelector({ selectedZones, onChange }) {
  const toggle = (zone) => {
    if (selectedZones.includes(zone)) onChange(selectedZones.filter(z => z !== zone))
    else onChange([...selectedZones, zone])
  }
  const pathD = (pts) => `${pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')} Z`
  const SEL = '#f0883e'
  const UNSEL = '#484f58'

  return (
    <svg width={S_SIZE} height={S_SIZE} viewBox={`0 0 ${S_SIZE} ${S_SIZE}`} style={{ display: 'block', borderRadius: 4 }}>
      <rect width={S_SIZE} height={S_SIZE} fill="#0d1117" />

      {S_CORNERS.map(({ zone, path, lx, ly }) => {
        const sel = selectedZones.includes(zone)
        return (
          <g key={zone} onClick={() => toggle(zone)} style={{ cursor: 'pointer' }}>
            <path d={pathD(path)} fill={sel ? 'rgba(240,136,62,0.2)' : '#161b22'} />
            <text x={lx} y={ly} fontSize={10} fontWeight={700}
              fill={sel ? SEL : UNSEL} fontFamily="JetBrains Mono, monospace">
              {zone}
            </text>
          </g>
        )
      })}

      <line x1={S_MID} y1={0} x2={S_MID} y2={S_START} stroke="#30363d" strokeWidth={1} />
      <line x1={S_MID} y1={S_END} x2={S_MID} y2={S_SIZE} stroke="#30363d" strokeWidth={1} />
      <line x1={0} y1={S_MID} x2={S_START} y2={S_MID} stroke="#30363d" strokeWidth={1} />
      <line x1={S_END} y1={S_MID} x2={S_SIZE} y2={S_MID} stroke="#30363d" strokeWidth={1} />

      {S_GRID.flatMap((row, ri) =>
        row.map((zone, ci) => {
          const sel = selectedZones.includes(zone)
          const x = S_START + ci * S_CELL
          const y = S_START + ri * S_CELL
          return (
            <g key={zone} onClick={() => toggle(zone)} style={{ cursor: 'pointer' }}>
              <rect x={x} y={y} width={S_CELL} height={S_CELL}
                fill={sel ? 'rgba(240,136,62,0.2)' : '#161b22'} />
              <text x={x + S_CELL / 2} y={y + S_CELL / 2} textAnchor="middle"
                dominantBaseline="middle" fontSize={13} fontWeight={700}
                fill={sel ? SEL : UNSEL} fontFamily="JetBrains Mono, monospace">
                {zone}
              </text>
            </g>
          )
        })
      )}

      <rect x={S_START} y={S_START} width={S_CELL * 3} height={S_CELL * 3}
        fill="none" stroke="#30363d" strokeWidth={1.5} />
      <line x1={S_START+S_CELL} y1={S_START} x2={S_START+S_CELL} y2={S_END} stroke="#21262d" strokeWidth={1} />
      <line x1={S_START+S_CELL*2} y1={S_START} x2={S_START+S_CELL*2} y2={S_END} stroke="#21262d" strokeWidth={1} />
      <line x1={S_START} y1={S_START+S_CELL} x2={S_END} y2={S_START+S_CELL} stroke="#21262d" strokeWidth={1} />
      <line x1={S_START} y1={S_START+S_CELL*2} x2={S_END} y2={S_START+S_CELL*2} stroke="#21262d" strokeWidth={1} />
      <rect x={0} y={0} width={S_SIZE} height={S_SIZE} fill="none" stroke="#30363d" strokeWidth={1.5} />
    </svg>
  )
}

export default function FilterPanel({ filters, pitchers = [], onChange, onReset }) {
  const set = (key) => (val) => onChange(f => ({ ...f, [key]: val }))

  const uniquePitchers = Array.from(new Map(pitchers.map(p => [String(p.id), p])).values())

  const pitcherOptions = uniquePitchers.map(p => ({
    value: String(p.id),
    label: p.name,
  }))

  return (
    <div style={{ padding: '16px 14px', color: '#e6edf3' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text style={{ color: '#484f58', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Filters
        </Text>
        <Button
          size="small" type="text" icon={<ReloadOutlined />} onClick={onReset}
          style={{ color: '#484f58', fontSize: 11 }}
        >
          Reset
        </Button>
      </div>

      <SectionLabel>Season</SectionLabel>
      <SingleTogglePills
        options={[
          { value: '', label: 'ALL' },
          ...YEAR_OPTIONS.map(year => ({ value: year, label: year }))
        ]}
        value={filters.year}
        onChange={set('year')}
      />

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Pitcher</SectionLabel>
      <Select
        mode="multiple"
        allowClear
        showSearch
        placeholder="Search by name..."
        value={filters.pitcherIds}
        onChange={(val) => onChange(f => ({ ...f, pitcherIds: val, ...(val.length > 0 ? { pitcherHands: '', pitcherLabels: [] } : {}) }))}
        options={pitcherOptions}
        style={{ width: '100%', marginBottom: 8 }}
        maxTagCount={2}
        filterOption={(input, option) =>
          (option?.label || '').toLowerCase().includes(input.toLowerCase())
        }
      />
      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Pitcher Hand</SectionLabel>
      <div style={{ opacity: filters.pitcherIds?.length > 0 ? 0.3 : 1, pointerEvents: filters.pitcherIds?.length > 0 ? 'none' : 'auto' }}>
        <SingleTogglePills
          options={[
            { value: '', label: 'ALL' },
            { value: 'R', label: 'RHP' },
            { value: 'L', label: 'LHP' }
          ]}
          value={filters.pitcherHands}
          onChange={set('pitcherHands')}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <SectionLabel>Pitcher Role</SectionLabel>
        <SingleTogglePills
          options={[
            { value: 'All', label: 'ALL' },
            { value: 'SP', label: 'Starter' },
            { value: 'RP', label: 'Reliever' }
          ]}
          value={filters.pitcherRole}
          onChange={set('pitcherRole')}
        />
      </div>

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Count</SectionLabel>
      <CountGrid selectedCounts={filters.counts} onChange={set('counts')} />

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Pitch Type</SectionLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {ALL_PITCH_TYPES.map(pt => {
          const sel = filters.pitchTypes.includes(pt)
          return (
            <div
              key={pt}
              onClick={() => {
                if (sel) set('pitchTypes')(filters.pitchTypes.filter(t => t !== pt))
                else set('pitchTypes')([...filters.pitchTypes, pt])
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 8px', borderRadius: 4,
                border: `1px solid ${sel ? PITCH_TYPE_COLORS[pt] : 'transparent'}`,
                background: sel ? `${PITCH_TYPE_COLORS[pt]}18` : 'transparent',
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: PITCH_TYPE_COLORS[pt] || '#484f58', flexShrink: 0 }} />
              <Text style={{ fontSize: 12, color: sel ? '#e6edf3' : '#8b949e', fontWeight: sel ? 600 : 400 }}>
                <span style={{ fontWeight: 700, marginRight: 4 }}>{pt}</span>
                {PITCH_TYPE_LABELS[pt]}
              </Text>
            </div>
          )
        })}
      </div>

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Zone</SectionLabel>
      <ZoneSelector selectedZones={filters.zones} onChange={set('zones')} />
      <Text style={{ display: 'block', fontSize: 10, color: '#484f58', marginTop: 4 }}>
        Click to select zones
      </Text>
    </div>
  )
}
