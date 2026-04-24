export const DEFAULT_FILTERS = {
  batterId: 'b1',
  seasons: [],
  pitcherIds: [],
  pitcherLabels: [],
  pitcherHands: [],
  pitcherRoles: [],
  pitchTypes: [],
  zones: [],
  counts: [],
}

export function filterPitches(pitches, filters) {
  return pitches.filter(p => {
    if (filters.batterId && p.batterId !== filters.batterId) return false
    if (filters.seasons?.length && !filters.seasons.includes(p.season)) return false
    if (filters.pitcherIds?.length && !filters.pitcherIds.includes(p.pitcherId)) return false
    if (filters.pitcherLabels?.length && !filters.pitcherLabels.includes(p.pitcherLabel)) return false
    if (filters.pitcherHands?.length && !filters.pitcherHands.includes(p.pitcherHand)) return false
    if (filters.pitcherRoles?.length && !filters.pitcherRoles.includes(p.pitcherRole)) return false
    if (filters.pitchTypes?.length && !filters.pitchTypes.includes(p.pitchType)) return false
    if (filters.zones?.length && !filters.zones.includes(p.zone)) return false
    if (filters.counts?.length) {
      if (!filters.counts.includes(`${p.balls}-${p.strikes}`)) return false
    }
    return true
  })
}

export function aggregateByResult(pitches) {
  const ORDER = ['ball', 'called_strike', 'swinging_strike', 'foul', 'in_play_out', 'in_play_hit']
  const counts = {}
  pitches.forEach(p => { counts[p.result] = (counts[p.result] || 0) + 1 })
  return ORDER
    .filter(r => counts[r] > 0)
    .map(r => ({ result: r, count: counts[r], pct: +((counts[r] / pitches.length) * 100).toFixed(1) }))
}

export function aggregateByPitchType(pitches) {
  const byType = {}
  pitches.forEach(p => {
    if (!byType[p.pitchType]) {
      byType[p.pitchType] = { total: 0, ball: 0, called_strike: 0, swinging_strike: 0, foul: 0, in_play_out: 0, in_play_hit: 0 }
    }
    byType[p.pitchType].total++
    byType[p.pitchType][p.result] = (byType[p.pitchType][p.result] || 0) + 1
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
  pitches.forEach(p => {
    if (p.zone >= 1 && p.zone <= 9) {
      byZone[p.zone].total++
      byZone[p.zone][p.result] = (byZone[p.zone][p.result] || 0) + 1
    }
  })

  const maxTotal = Math.max(...Object.values(byZone).map(z => z.total), 1)
  return Object.fromEntries(
    Object.entries(byZone).map(([zone, d]) => {
      const swingAttempts = d.swinging_strike + d.foul + d.in_play_out + d.in_play_hit
      return [+zone, {
        ...d,
        whiffRate: swingAttempts > 0 ? d.swinging_strike / swingAttempts : 0,
        outRate: d.total > 0 ? d.in_play_out / d.total : 0,
        hitRate: d.total > 0 ? d.in_play_hit / d.total : 0,
      }]
    })
  )
}

export function getSummaryStats(pitches) {
  if (!pitches.length) return null
  const n = pitches.length
  const called_strike = pitches.filter(p => p.result === 'called_strike').length
  const swinging_strike = pitches.filter(p => p.result === 'swinging_strike').length
  const ball = pitches.filter(p => p.result === 'ball').length
  const swingAttempts = pitches.filter(p => ['swinging_strike', 'foul', 'in_play_out', 'in_play_hit'].includes(p.result)).length
  const inPlay = pitches.filter(p => ['in_play_out', 'in_play_hit'].includes(p.result)).length
  const hits = pitches.filter(p => p.result === 'in_play_hit').length

  return {
    total: n,
    strikeRate: +(((n - ball) / n) * 100).toFixed(1),
    swingRate: +((swingAttempts / n) * 100).toFixed(1),
    whiffRate: swingAttempts > 0 ? +((swinging_strike / swingAttempts) * 100).toFixed(1) : 0,
    cswRate: +(((called_strike + swinging_strike) / n) * 100).toFixed(1),
    babip: inPlay > 0 ? +((hits / inPlay) * 100).toFixed(1) : 0,
  }
}
