import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Frontend subscribes to this — auto updates when data changes
export const getLiveMatches = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("matches")
      .order("desc")
      .collect()
  },
})

// Get single match
export const getMatch = query({
  args: { externalId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("matches")
      .filter((q) => q.eq(q.field("externalId"), args.externalId))
      .first()
  },
})

// Called every 30 seconds to sync fresh data
export const upsertMatch = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("matches")
      .filter((q) => q.eq(q.field("externalId"), args.externalId))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      })
    } else {
      await ctx.db.insert("matches", {
        ...args,
        updatedAt: Date.now(),
      })
    }
  },
})

// Clear all matches (used for demo reset)
export const clearMatches = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("matches").collect()
    await Promise.all(all.map((m) => ctx.db.delete(m._id)))
  },
})