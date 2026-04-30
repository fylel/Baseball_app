import { useState, useMemo, useEffect } from 'react'
import { Layout, Select, ConfigProvider, theme, Typography, Space, Spin } from 'antd'
import FilterPanel from './components/FilterPanel'
import SetTabs from './components/SetTabs'
import SummaryStats from './components/SummaryStats'
import ZoneHeatmap from './components/ZoneHeatmap'
import ResultChart from './components/ResultChart'
import PitchTypeTable from './components/PitchTypeTable'
import {
  DEFAULT_FILTERS,
  aggregateByResult,
  aggregateByPitchType,
  aggregateByZone,
  getSummaryStats,
} from './utils/filterUtils'
import './App.css'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const SET_COLORS = ['#f0883e', '#58a6ff', '#3fb950', '#bc8cff']
const INITIAL_FILTERS = { ...DEFAULT_FILTERS }

export default function App() {
  const [batters, setBatters] = useState([])
  const [pitchers, setPitchers] = useState([])
  const [pitchesMap, setPitchesMap] = useState({})
  const [loadingMap, setLoadingMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [sets, setSets] = useState([
    { id: 1, name: 'Set A', color: SET_COLORS[0], filters: INITIAL_FILTERS },
  ])
  const [activeSetId, setActiveSetId] = useState(1)

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        setLoading(true)
        const [resBatters, resPitchers] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/batters'),
          fetch('http://127.0.0.1:8000/api/pitchers')
        ])
        const bData = await resBatters.json()
        const pData = await resPitchers.json()
        setBatters(Array.isArray(bData) ? bData : [])
        setPitchers(Array.isArray(pData) ? pData : [])
      } catch (error) {
        console.error('Failed to load metadata:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMetaData()
  }, [])

  const setFilterKeys = sets.map(s => {
    const f = s.filters
    return [
      s.id,
      f.batterId,
      (f.pitcherIds || []).join(','),
      f.year || '',
      f.pitcherRole,
      f.pitcherHands || '',
      (f.pitchTypes || []).join(','),
      (f.zones || []).join(','),
      (f.counts || []).join(','),
    ].join(':')
  }).join('|')

  useEffect(() => {
    sets.forEach(async (set) => {
      const {
        batterId,
        pitcherIds,
        year,
        pitcherRole,
        pitchTypes = [],
        zones = [],
        counts = [],
      } = set.filters

      const pId = pitcherIds?.[0] || ''
      const bId = batterId || ''

      if (!pId && !bId) {
        setPitchesMap(prev => ({ ...prev, [set.id]: [] }))
        return
      }

      setLoadingMap(prev => ({ ...prev, [set.id]: true }))
      try {
        const queryYear = year || 'ALL'
        const ptParam = pitchTypes.join(',')
        const zParam = zones.join(',')
        let bParam = '', sParam = ''
        if (counts.length > 0) {
          const [b, s] = String(counts[0]).split('-')
          if (b !== undefined) bParam = b
          if (s !== undefined) sParam = s
        }
        const url = `http://127.0.0.1:8000/api/pitches?year=${queryYear}&pitcherId=${pId}&batterId=${bId}&pitcherRole=${pitcherRole}&pitchType=${ptParam}&zone=${zParam}&balls=${bParam}&strikes=${sParam}`
        const response = await fetch(url)
        const data = await response.json()
        setPitchesMap(prev => ({ ...prev, [set.id]: Array.isArray(data) ? data : [] }))
      } catch (e) {
        console.error(`Failed to fetch data for ${set.name}:`, e)
        setPitchesMap(prev => ({ ...prev, [set.id]: [] }))
      } finally {
        setLoadingMap(prev => ({ ...prev, [set.id]: false }))
      }
    })
  }, [setFilterKeys]) // eslint-disable-line react-hooks/exhaustive-deps

  const activeSet = sets.find(s => s.id === activeSetId)
  const activeFilters = activeSet?.filters || INITIAL_FILTERS
  const activePitches = pitchesMap[activeSetId] || []
  const dataLoading = Object.values(loadingMap).some(Boolean)

  const availableBatters = useMemo(() => {
    const pId = activeFilters.pitcherIds?.[0]
    if (!pId || activePitches.length === 0) return batters
    const facedBatterIds = new Set(
      activePitches
        .filter(p => String(p.pitcherId || p.pitcher) === String(pId))
        .map(p => String(p.batterId || p.batter))
    )
    return batters.filter(b => facedBatterIds.has(String(b.id)))
  }, [batters, activePitches, activeFilters.pitcherIds])

  const availablePitchers = useMemo(() => {
    const bId = activeFilters.batterId
    if (!bId || activePitches.length === 0) return pitchers
    const facedPitcherIds = new Set(
      activePitches
        .filter(p => String(p.batterId || p.batter) === String(bId))
        .map(p => String(p.pitcherId || p.pitcher))
    )
    return pitchers.filter(p => facedPitcherIds.has(String(p.id)))
  }, [pitchers, activePitches, activeFilters.batterId])

  const updateActiveFilters = (updater) => {
    setSets(prev => prev.map(s =>
      s.id === activeSetId
        ? { ...s, filters: typeof updater === 'function' ? updater(s.filters) : { ...s.filters, ...updater } }
        : s
    ))
  }

  const changeBatter = (val) => {
    updateActiveFilters({ batterId: val ? String(val) : '' })
  }

  const addSet = () => {
    if (sets.length >= 4) return
    const newId = Date.now()
    setSets(prev => [...prev, {
      id: newId,
      name: `Set ${String.fromCharCode(65 + prev.length)}`,
      color: SET_COLORS[prev.length],
      filters: { ...INITIAL_FILTERS, batterId: activeFilters.batterId },
    }])
    setActiveSetId(newId)
  }

  const removeSet = (id) => {
    setSets(prev => {
      const next = prev.filter(s => s.id !== id)
      if (activeSetId === id) setActiveSetId(next[0]?.id)
      return next
    })
    setPitchesMap(prev => { const { [id]: _, ...rest } = prev; return rest })
    setLoadingMap(prev => { const { [id]: _, ...rest } = prev; return rest })
  }

  const setsData = useMemo(() => {
    return sets.map(set => {
      const pitches = pitchesMap[set.id] || []
      return {
        ...set,
        pitches,
        summaryStats: getSummaryStats(pitches),
        resultData: aggregateByResult(pitches),
        pitchTypeData: aggregateByPitchType(pitches),
        zoneData: aggregateByZone(pitches),
      }
    })
  }, [sets, pitchesMap])

  const activeSetData = setsData.find(s => s.id === activeSetId)

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
          Table: { headerBg: '#1c2128', rowHoverBg: '#1c2128' },
          Select: { optionSelectedBg: '#1c2128' },
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#0d1117' }}>
        <Header style={{
          display: 'flex', alignItems: 'center', gap: 32,
          padding: '0 24px', background: '#0d1117',
          borderBottom: '1px solid #21262d', height: 56, position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.jpg" alt="logo" style={{ width: 48, height: 27, borderRadius: 4 }} />
            <Text style={{ color: '#e6edf3', fontSize: 16, fontWeight: 700, letterSpacing: '0.15em' }}>PitchLab</Text>
          </div>

          <Space size={8} align="center">
            <Text style={{ color: '#484f58', fontSize: 11, textTransform: 'uppercase' }}>Batter</Text>
            <Select
              allowClear
              showSearch
              value={activeFilters.batterId || undefined}
              onChange={changeBatter}
              placeholder="Select a player or leave blank"
              style={{ width: 260 }}
              options={availableBatters.map(b => ({ value: String(b.id), label: b.name }))}
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              variant="borderless"
            />
          </Space>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            {dataLoading && <Spin size="small" style={{ marginRight: 8 }} />}
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: loading ? '#f0883e' : '#3fb950' }} />
            <Text style={{ color: '#484f58', fontSize: 11 }}>{loading ? 'API CONNECTING...' : 'LIVE BACKEND'}</Text>
          </div>
        </Header>

        <Layout style={{ background: '#0d1117' }}>
          <Sider width={270} style={{ background: '#0d1117', borderRight: '1px solid #21262d', height: 'calc(100vh - 56px)', overflow: 'auto', position: 'sticky', top: 56 }}>
            <SetTabs sets={sets} activeSetId={activeSetId} onSelect={setActiveSetId} onAdd={addSet} onRemove={removeSet} />
            {activeSet && (
              <FilterPanel
                filters={activeFilters}
                pitchers={availablePitchers}
                onChange={updateActiveFilters}
                onReset={() => updateActiveFilters(INITIAL_FILTERS)}
              />
            )}
          </Sider>

          <Content style={{ padding: '20px', background: '#0d1117', minHeight: 'calc(100vh - 56px)', overflow: 'auto' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 100, gap: 16 }}>
                <Spin size="large" />
                <Text style={{ color: '#8b949e' }}>Fetching Statcast Data...</Text>
              </div>
            ) : (
              <>
                <SummaryStats setsData={setsData} />
                <div style={{ display: 'grid', gridTemplateColumns: '310px 1fr', gap: 16, marginBottom: 16 }}>
                  <ZoneHeatmap zoneData={activeSetData?.zoneData} totalPitches={activeSetData?.pitches.length || 0} setColor={activeSet?.color} setName={activeSet?.name} />
                  <ResultChart setsData={setsData} />
                </div>
                <PitchTypeTable data={activeSetData?.pitchTypeData || []} />
              </>
            )}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
