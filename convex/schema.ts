import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  matches: defineTable({
    externalId: v.string(),
    homeTeam: v.string(),
    awayTeam: v.string(),
    homeScore: v.number(),
    awayScore: v.number(),
    minute: v.number(),
    status: v.string(),
    league: v.string(),
    homeLogo: v.string(),
    awayLogo: v.string(),
    updatedAt: v.number(),
  }),

  events: defineTable({
    matchId: v.string(),
    type: v.string(),
    minute: v.number(),
    playerName: v.string(),
    team: v.string(),
    detail: v.string(),
    timestamp: v.number(),
  }),

  stats: defineTable({
    matchId: v.string(),
    homePossession: v.number(),
    awayPossession: v.number(),
    homeShots: v.number(),
    awayShots: v.number(),
    homeShotsOnTarget: v.number(),
    awayShotsOnTarget: v.number(),
    homePasses: v.number(),
    awayPasses: v.number(),
    updatedAt: v.number(),
  }),

  players: defineTable({
    matchId: v.string(),
    name: v.string(),
    number: v.number(),
    position: v.string(),
    rating: v.optional(v.string()),
    status: v.string(),
    minutesPlayed: v.number(),
    team: v.string(),
    teamName: v.string(),
  }),
})