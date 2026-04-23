export type MatchStatus = "live" | "finished" | "scheduled"

export type Match = {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  minute: number
  status: MatchStatus
  league: string
  homeLogo: string
  awayLogo: string
}

export type Player = {
  id: string
  name: string
  number: number
  position: string
  rating: number
  status: "playing" | "subbed" | "injured" | "benched"
  minutesPlayed: number
  team: "home" | "away"
}

export type MatchEvent = {
  id: string
  type: "goal" | "yellow_card" | "red_card" | "substitution" | "var"
  minute: number
  playerName: string
  team: "home" | "away"
  detail: string
  timestamp: number
}

export type MatchStats = {
  homePossession: number
  awayPossession: number
  homeShots: number
  awayShots: number
  homeShotsOnTarget: number
  awayShotsOnTarget: number
  homePasses: number
  awayPasses: number
  matchId: string
  updatedAt: number
}