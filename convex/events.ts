import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Get all events for a match - auto updates when new events come in
export const getMatchEvents = query({
  args: { matchId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("matchId"), args.matchId))
      .collect()
  },
})

// Add new event (goal, card, sub)
export const addEvent = mutation({
  args: {
    matchId: v.string(),
    type: v.string(),
    minute: v.number(),
    playerName: v.string(),
    team: v.string(),
    detail: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("events", {
      ...args,
      timestamp: Date.now(),
    })
  },
})