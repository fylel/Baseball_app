import { useState, useMemo } from 'react'
import { Layout, Select, ConfigProvider, theme, Typography, Space } from 'antd'
import FilterPanel from './components/FilterPanel'
import SetTabs from './components/SetTabs'
import SummaryStats from './components/SummaryStats'
import ZoneHeatmap from './components/ZoneHeatmap'
import ResultChart from './components/ResultChart'
import PitchTypeTable from './components/PitchTypeTable'
import { BATTERS, ALL_PITCHES } from './data/mockData'
import {
  DEFAULT_FILTERS,
  filterPitches,
  aggregateByResult,
  aggregateByPitchType,
  aggregateByZone,
  getSummaryStats,
} from './utils/filterUtils'
import './App.css'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const SET_COLORS = ['#f0883e', '#58a6ff', '#3fb950', '#bc8cff']
const INITIAL_FILTERS = { ...DEFAULT_FILTERS, batterId: 'b1' }

export default function App() {
  const [sets, setSets] = useState([
    { id: 1, name: 'Set A', color: SET_COLORS[0], filters: INITIAL_FILTERS },
  ])
  const [activeSetId, setActiveSetId] = useState(1)

  const activeSet = sets.find(s => s.id === activeSetId)
  const activeBatterId = activeSet?.filters.batterId || 'b1'

  const updateActiveFilters = (updater) => {
    setSets(prev => prev.map(s =>
      s.id === activeSetId
        ? { ...s, filters: typeof updater === 'function' ? updater(s.filters) : updater }
        : s
    ))
  }

  const changeBatter = (val) => {
    setSets(prev => prev.map(s => ({ ...s, filters: { ...s.filters, batterId: val } })))
  }

  const addSet = () => {
    if (sets.length >= 4) return
    const newId = Date.now()
    const color = SET_COLORS[sets.length]
    const name = `Set ${String.fromCharCode(65 + sets.length)}`
    setSets(prev => [...prev, { id: newId, name, color, filters: { ...INITIAL_FILTERS, batterId: activeBatterId } }])
    setActiveSetId(newId)
  }

  const removeSet = (id) => {
    setSets(prev => {
      const next = prev.filter(s => s.id !== id)
      if (activeSetId === id) setActiveSetId(next[0]?.id)
      return next
    })
  }

  const setsData = useMemo(() => {
    return sets.map(set => {
      const pitches = filterPitches(ALL_PITCHES, set.filters)
      return {
        ...set,
        pitches,
        summaryStats: getSummaryStats(pitches),
        resultData: aggregateByResult(pitches),
        pitchTypeData: aggregateByPitchType(pitches),
        zoneData: aggregateByZone(pitches),
      }
    })
  }, [sets])

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
          colorTextTertiary: '#484f58',
          fontFamily: "'Barlow Condensed', system-ui, sans-serif",
          borderRadius: 6,
          fontSize: 14,
        },
        components: {
          Table: { headerBg: '#1c2128', rowHoverBg: '#1c2128', borderColor: '#30363d' },
          Select: { optionSelectedBg: '#1c2128' },
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#0d1117' }}>
        <Header style={{
          display: 'flex', alignItems: 'center', gap: 32,
          padding: '0 24px', background: '#0d1117',
          borderBottom: '1px solid #21262d',
          height: 56, position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo.jpg" alt="logo" style={{ width: 48, height: 27, borderRadius: 4, objectFit: 'cover' }} />
            <Text style={{
              color: '#e6edf3', fontSize: 16, fontWeight: 700,
              letterSpacing: '0.15em', fontFamily: "'Barlow Condensed', sans-serif",
            }}>
              PitchLab
            </Text>
          </div>

          <Space size={8} align="center">
            <Text style={{ color: '#484f58', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Batter
            </Text>
            <Select
              value={activeBatterId}
              onChange={changeBatter}
              style={{ width: 230 }}
              options={BATTERS.map(b => ({ value: b.id, label: `${b.name} · ${b.team}` }))}
              variant="borderless"
            />
          </Space>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#3fb950' }} />
            <Text style={{ color: '#484f58', fontSize: 11 }}>Mock Data</Text>
          </div>
        </Header>

        <Layout style={{ background: '#0d1117' }}>
          <Sider
            width={270}
            style={{
              background: '#0d1117',
              borderRight: '1px solid #21262d',
              height: 'calc(100vh - 56px)',
              overflow: 'auto',
              position: 'sticky',
              top: 56,
            }}
          >
            <SetTabs
              sets={sets}
              activeSetId={activeSetId}
              onSelect={setActiveSetId}
              onAdd={addSet}
              onRemove={removeSet}
            />
            {activeSet && (
              <FilterPanel
                filters={activeSet.filters}
                onChange={updateActiveFilters}
                onReset={() => updateActiveFilters({ ...INITIAL_FILTERS, batterId: activeBatterId })}
              />
            )}
          </Sider>

          <Content style={{
            padding: '20px', background: '#0d1117',
            minHeight: 'calc(100vh - 56px)', overflow: 'auto',
          }}>
            <SummaryStats setsData={setsData} />

            <div style={{ display: 'grid', gridTemplateColumns: '310px 1fr', gap: 16, marginBottom: 16 }}>
              <ZoneHeatmap
                zoneData={activeSetData?.zoneData}
                totalPitches={activeSetData?.pitches.length || 0}
                setColor={activeSet?.color}
                setName={activeSet?.name}
              />
              <ResultChart setsData={setsData} />
            </div>

            <PitchTypeTable data={activeSetData?.pitchTypeData || []} />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
