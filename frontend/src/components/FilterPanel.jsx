import { Switch, Divider, Button, Typography, Select } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { SEASONS, ALL_PITCH_TYPES, PITCH_TYPE_LABELS, PITCHERS, PITCHER_LABEL_OPTIONS } from '../data/mockData'

const { Text } = Typography

const ZONE_GRID = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
const COUNT_ROWS = [
  [{ b: 0, s: 0 }, { b: 0, s: 1 }, { b: 0, s: 2 }],
  [{ b: 1, s: 0 }, { b: 1, s: 1 }, { b: 1, s: 2 }],
  [{ b: 2, s: 0 }, { b: 2, s: 1 }, { b: 2, s: 2 }],
  [{ b: 3, s: 0 }, { b: 3, s: 1 }, { b: 3, s: 2 }],
]

const PITCH_TYPE_COLORS = {
  FF: '#f0883e', SI: '#e3b341', SL: '#58a6ff',
  CH: '#3fb950', CU: '#bc8cff', FC: '#ff6b6b',
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
  return (
    <div style={{ display: 'inline-block', border: '2px solid #30363d', borderRadius: 4, overflow: 'hidden' }}>
      {ZONE_GRID.map((row, ri) => (
        <div key={ri} style={{ display: 'flex' }}>
          {row.map(zone => {
            const sel = selectedZones.includes(zone)
            return (
              <div
                key={zone}
                onClick={() => toggle(zone)}
                style={{
                  width: 40, height: 40, border: '1px solid #21262d',
                  background: sel ? 'rgba(240,136,62,0.2)' : '#161b22',
                  color: sel ? '#f0883e' : '#484f58',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: 14, fontWeight: 700,
                  userSelect: 'none', transition: 'all 0.12s',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {zone}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default function FilterPanel({ filters, onChange, onReset }) {
  const set = (key) => (val) => onChange(f => ({ ...f, [key]: val }))

  const pitcherOptions = PITCHERS.map(p => ({
    value: p.id,
    label: `${p.name} (${p.team} · ${p.hand} · ${p.role})`,
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
      <TogglePills
        options={SEASONS.map(s => ({ value: s, label: String(s) }))}
        value={filters.seasons}
        onChange={set('seasons')}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, marginBottom: 4 }}>
        <Switch size="small" checked={filters.recentWeight} onChange={set('recentWeight')} />
        <Text style={{ fontSize: 12, color: '#8b949e' }}>Recent weight</Text>
      </div>

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Pitcher</SectionLabel>
      <Select
        mode="multiple"
        allowClear
        showSearch
        placeholder="Search by name..."
        value={filters.pitcherIds}
        onChange={set('pitcherIds')}
        options={pitcherOptions}
        style={{ width: '100%', marginBottom: 8 }}
        maxTagCount={2}
        filterOption={(input, option) =>
          option.label.toLowerCase().includes(input.toLowerCase())
        }
      />
      <div style={{ marginBottom: 4 }}>
        <Text style={{ fontSize: 10, color: '#484f58', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          or filter by label
        </Text>
      </div>
      <TogglePills
        options={PITCHER_LABEL_OPTIONS}
        value={filters.pitcherLabels}
        onChange={set('pitcherLabels')}
        color='#bc8cff'
      />

      <Divider style={{ borderColor: '#21262d', margin: '12px 0' }} />

      <SectionLabel>Pitcher Hand</SectionLabel>
      <TogglePills
        options={[{ value: 'R', label: 'RHP' }, { value: 'L', label: 'LHP' }]}
        value={filters.pitcherHands}
        onChange={set('pitcherHands')}
      />
      <div style={{ marginTop: 10 }}>
        <SectionLabel>Pitcher Role</SectionLabel>
        <TogglePills
          options={[{ value: 'SP', label: 'Starter' }, { value: 'RP', label: 'Reliever' }]}
          value={filters.pitcherRoles}
          onChange={set('pitcherRoles')}
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
