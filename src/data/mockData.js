function weightedRandom(options) {
  const entries = Object.entries(options)
  const total = entries.reduce((s, [, w]) => s + w, 0)
  let r = Math.random() * total
  for (const [key, w] of entries) {
    r -= w
    if (r <= 0) return key
  }
  return entries[entries.length - 1][0]
}

function pickZone() {
  const weights = [0.07, 0.12, 0.07, 0.13, 0.20, 0.13, 0.07, 0.14, 0.07]
  let r = Math.random()
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]
    if (r <= 0) return i + 1
  }
  return 9
}

const RESULT_DIST = {
  FF: { ball: 0.31, called_strike: 0.15, swinging_strike: 0.11, foul: 0.19, in_play_out: 0.18, in_play_hit: 0.06 },
  SI: { ball: 0.29, called_strike: 0.14, swinging_strike: 0.08, foul: 0.17, in_play_out: 0.24, in_play_hit: 0.08 },
  SL: { ball: 0.34, called_strike: 0.17, swinging_strike: 0.19, foul: 0.15, in_play_out: 0.12, in_play_hit: 0.03 },
  CH: { ball: 0.32, called_strike: 0.15, swinging_strike: 0.17, foul: 0.14, in_play_out: 0.16, in_play_hit: 0.06 },
  CU: { ball: 0.37, called_strike: 0.21, swinging_strike: 0.14, foul: 0.12, in_play_out: 0.12, in_play_hit: 0.04 },
  FC: { ball: 0.30, called_strike: 0.15, swinging_strike: 0.15, foul: 0.21, in_play_out: 0.14, in_play_hit: 0.05 },
}

const PITCH_TYPE_DIST_BY_LABEL = {
  power:   { FF: 0.50, SI: 0.05, SL: 0.20, CH: 0.10, CU: 0.08, FC: 0.07 },
  finesse: { FF: 0.20, SI: 0.05, SL: 0.25, CH: 0.20, CU: 0.22, FC: 0.08 },
  sinker:  { FF: 0.15, SI: 0.45, SL: 0.15, CH: 0.12, CU: 0.05, FC: 0.08 },
}

const COUNT_DIST = {
  '0-0': 0.25, '0-1': 0.09, '0-2': 0.05,
  '1-0': 0.12, '1-1': 0.10, '1-2': 0.09,
  '2-0': 0.05, '2-1': 0.08, '2-2': 0.09,
  '3-0': 0.01, '3-1': 0.04, '3-2': 0.08,
}

export const PITCHERS = [
  { id: 'p01', name: 'Gerrit Cole',      team: 'NYY', hand: 'R', role: 'SP', label: 'power' },
  { id: 'p02', name: 'Sandy Alcantara',  team: 'MIA', hand: 'R', role: 'SP', label: 'sinker' },
  { id: 'p03', name: 'Freddy Peralta',   team: 'MIL', hand: 'R', role: 'SP', label: 'power' },
  { id: 'p04', name: 'Clayton Kershaw',  team: 'LAD', hand: 'L', role: 'SP', label: 'finesse' },
  { id: 'p05', name: 'Josh Hader',       team: 'HOU', hand: 'L', role: 'RP', label: 'power' },
  { id: 'p06', name: 'Edwin Diaz',       team: 'NYM', hand: 'R', role: 'RP', label: 'power' },
  { id: 'p07', name: 'Shane Bieber',     team: 'CLE', hand: 'R', role: 'SP', label: 'finesse' },
  { id: 'p08', name: 'Framber Valdez',   team: 'HOU', hand: 'L', role: 'SP', label: 'sinker' },
  { id: 'p09', name: 'Devin Williams',   team: 'MIL', hand: 'R', role: 'RP', label: 'finesse' },
  { id: 'p10', name: 'Emmanuel Clase',   team: 'CLE', hand: 'R', role: 'RP', label: 'sinker' },
]

export const PITCHER_LABEL_OPTIONS = [
  { value: 'power',   label: 'Power' },
  { value: 'finesse', label: 'Finesse' },
  { value: 'sinker',  label: 'Sinker' },
]

function generatePitches(batterId, count) {
  const pitches = []
  const seasons = [2022, 2023, 2024]

  for (let i = 0; i < count; i++) {
    const season = seasons[Math.floor(Math.random() * 3)]
    const month = 4 + Math.floor(Math.random() * 6)
    const day = 1 + Math.floor(Math.random() * 28)
    const pitcher = PITCHERS[Math.floor(Math.random() * PITCHERS.length)]
    const pitchType = weightedRandom(PITCH_TYPE_DIST_BY_LABEL[pitcher.label])
    const zone = pickZone()
    const countKey = weightedRandom(COUNT_DIST)
    const [balls, strikes] = countKey.split('-').map(Number)
    const result = weightedRandom(RESULT_DIST[pitchType])

    pitches.push({
      id: `${batterId}-${i}`,
      batterId,
      pitcherId: pitcher.id,
      pitcherName: pitcher.name,
      pitcherHand: pitcher.hand,
      pitcherRole: pitcher.role,
      pitcherLabel: pitcher.label,
      pitchType,
      zone,
      balls,
      strikes,
      result,
      season,
      date: `${season}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    })
  }
  return pitches
}

export const BATTERS = [
  { id: 'b1', name: 'Aaron Mitchell', team: 'NYY', bats: 'R' },
  { id: 'b2', name: 'Carlos Vega',    team: 'LAD', bats: 'L' },
  { id: 'b3', name: 'David Park',     team: 'HOU', bats: 'S' },
]

export const ALL_PITCHES = [
  ...generatePitches('b1', 1050),
  ...generatePitches('b2', 870),
  ...generatePitches('b3', 920),
]

export const PITCH_TYPE_LABELS = {
  FF: 'Four-Seam FB',
  SI: 'Sinker',
  SL: 'Slider',
  CH: 'Changeup',
  CU: 'Curveball',
  FC: 'Cutter',
}

export const SEASONS = [2022, 2023, 2024]
export const ALL_PITCH_TYPES = ['FF', 'SI', 'SL', 'CH', 'CU', 'FC']
