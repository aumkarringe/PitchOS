import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Get all events for a match - auto updates when new events come in
export const getMatchEvents = query({
  args: { matchId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_matchId", (q) => q.eq("matchId", args.matchId))
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
    const existing = await ctx.db
      .query("events")
      .withIndex("by_match_event_signature", (q) =>
        q
          .eq("matchId", args.matchId)
          .eq("type", args.type)
          .eq("minute", args.minute)
          .eq("playerName", args.playerName)
          .eq("team", args.team)
          .eq("detail", args.detail)
      )
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, { timestamp: Date.now() })
      return
    }

    await ctx.db.insert("events", {
      ...args,
      timestamp: Date.now(),
    })
  },
})

// Remove historical duplicate rows for a match while preserving one canonical row.
export const dedupeMatchEvents = mutation({
  args: { matchId: v.string() },
  handler: async (ctx, args) => {
    const events = await ctx.db
      .query("events")
      .withIndex("by_matchId", (q) => q.eq("matchId", args.matchId))
      .collect()

    const seen = new Set<string>()
    for (const event of events) {
      const key = [
        event.matchId,
        event.type,
        String(event.minute),
        event.playerName,
        event.team,
        event.detail,
      ].join("||")

      if (seen.has(key)) {
        await ctx.db.delete(event._id)
      } else {
        seen.add(key)
      }
    }
  },
})