export const DEFAULT_FILTERS = {
  batterId: '',
  year: '',
  pitcherIds: [],
  pitcherLabels: [],
  pitcherHands: '',
  pitcherRole: 'All',
  pitchTypes: [],
  zones: [],
  counts: [],
}

const getResultType = (p) => {
  if (p.type === 'B') return 'ball'
  if (p.description === 'called_strike') return 'called_strike'
  if (p.description?.includes('swinging_strike')) return 'swinging_strike'
  if (p.description === 'foul') return 'foul'
  if (p.type === 'X') {
    return (p.events && p.events.includes('out')) ? 'in_play_out' : 'in_play_hit'
  }
  return 'other'
}

export function filterPitches(pitches, filters) {
  if (!pitches || pitches.length === 0) return []

  return pitches.filter(p => {
    const bId = String(p.batter || p.batter_id || p.batterId || '')
    const pId = String(p.pitcher || p.pitcher_id || p.pitcherId || '')

    if (filters.batterId && filters.batterId !== '') {
      if (bId !== String(filters.batterId)) return false
    }

    const year = p.game_date ? p.game_date.split('-')[0] : null
    if (filters.year && filters.year !== '') {
      if (year !== filters.year) return false
    }

    if (filters.pitcherIds?.length > 0) {
      if (!filters.pitcherIds.includes(pId)) return false
    }

    if (filters.pitcherHands && filters.pitcherHands !== '') {
      if (p.p_throws !== filters.pitcherHands) return false
    }

    if (filters.pitcherRole && filters.pitcherRole !== 'All') {
      if (p.role !== filters.pitcherRole) return false
    }

    if (filters.pitchTypes?.length && !filters.pitchTypes.includes(p.pitch_type)) return false
    if (filters.zones?.length && !filters.zones.includes(p.zone)) return false

    if (filters.counts?.length) {
      const currentCount = `${p.balls}-${p.strikes}`
      if (!filters.counts.includes(currentCount)) return false
    }

    return true
  })
}

export function aggregateByResult(pitches) {
  if (!pitches || pitches.length === 0) return []
  const ORDER = ['ball', 'called_strike', 'swinging_strike', 'foul', 'in_play_out', 'in_play_hit']
  const counts = {}

  pitches.forEach(p => {
    const res = getResultType(p)
    counts[res] = (counts[res] || 0) + 1
  })

  return ORDER
    .filter(r => counts[r] > 0)
    .map(r => ({
      result: r,
      count: counts[r],
      pct: +((counts[r] / pitches.length) * 100).toFixed(1)
    }))
}

export function aggregateByPitchType(pitches) {
  if (!pitches || pitches.length === 0) return []
  const byType = {}

  pitches.forEach(p => {
    const type = p.pitch_type || 'Unknown'
    if (!byType[type]) {
      byType[type] = { total: 0, ball: 0, called_strike: 0, swinging_strike: 0, foul: 0, in_play_out: 0, in_play_hit: 0 }
    }
    byType[type].total++
    const rType = getResultType(p)
    if (byType[type][rType] !== undefined) byType[type][rType]++
  })

  return Object.entries(byType)
    .map(([type, d]) => {
      const swingAttempts = d.swinging_strike + d.foul + d.in_play_out + d.in_play_hit
      return {
        pitchType: type,
        count: d.total,
        pct: +((d.total / pitches.length) * 100).toFixed(1),
        ballPct: +((d.ball / d.total) * 100).toFixed(1),
        cswPct: +(((d.called_strike + d.swinging_strike) / d.total) * 100).toFixed(1),
        whiffPct: swingAttempts > 0 ? +((d.swinging_strike / swingAttempts) * 100).toFixed(1) : 0,
        inPlayPct: +(((d.in_play_out + d.in_play_hit) / d.total) * 100).toFixed(1),
        hitPct: +((d.in_play_hit / d.total) * 100).toFixed(1),
      }
    })
    .sort((a, b) => b.count - a.count)
}

export function aggregateByZone(pitches) {
  const byZone = {}
  for (let z = 1; z <= 9; z++) {
    byZone[z] = { total: 0, ball: 0, called_strike: 0, swinging_strike: 0, foul: 0, in_play_out: 0, in_play_hit: 0 }
  }
  for (const z of [11, 12, 13, 14]) {
    byZone[z] = { total: 0, ball: 0, called_strike: 0, swinging_strike: 0, foul: 0, in_play_out: 0, in_play_hit: 0 }
  }

  if (pitches && pitches.length > 0) {
    pitches.forEach(p => {
      const res = getResultType(p)
      const z = parseInt(p.zone)
      if ((z >= 1 && z <= 9) || z === 11 || z === 12 || z === 13 || z === 14) {
        byZone[z].total++
        if (byZone[z][res] !== undefined) byZone[z][res]++
      }
    })
  }

  return Object.fromEntries(
    Object.entries(byZone).map(([zone, d]) => {
      const swingAttempts = d.swinging_strike + d.foul + d.in_play_out + d.in_play_hit
      return [+zone, {
        ...d,
        whiffRate: swingAttempts > 0 ? d.swinging_strike / swingAttempts : 0,
        outRate: d.total > 0 ? d.in_play_out / d.total : 0,
        foulRate: d.total > 0 ? d.foul / d.total : 0,
      }]
    })
  )
}

export function getSummaryStats(pitches) {
  if (!pitches || pitches.length === 0) return null
  const stats = { n: pitches.length, cs: 0, ss: 0, ball: 0, swings: 0, inPlay: 0, hits: 0 }

  pitches.forEach(p => {
    const res = getResultType(p)
    if (res === 'called_strike') stats.cs++
    if (res === 'swinging_strike') stats.ss++
    if (res === 'ball') stats.ball++
    if (['swinging_strike', 'foul', 'in_play_out', 'in_play_hit'].includes(res)) stats.swings++
    if (['in_play_out', 'in_play_hit'].includes(res)) stats.inPlay++
    if (res === 'in_play_hit') stats.hits++
  })

  return {
    total: stats.n,
    strikeRate: +(((stats.n - stats.ball) / stats.n) * 100).toFixed(1),
    swingRate: +((stats.swings / stats.n) * 100).toFixed(1),
    whiffRate: stats.swings > 0 ? +((stats.ss / stats.swings) * 100).toFixed(1) : 0,
    cswRate: +(((stats.cs + stats.ss) / stats.n) * 100).toFixed(1),
    babip: stats.inPlay > 0 ? +((stats.hits / stats.inPlay) * 100).toFixed(1) : 0,
  }
}
