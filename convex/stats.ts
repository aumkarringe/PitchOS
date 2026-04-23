import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getMatchStats = query({
  args: { matchId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stats")
      .filter((q) => q.eq(q.field("matchId"), args.matchId))
      .first()
  },
})

export const upsertStats = mutation({
  args: {
    matchId: v.string(),
    homePossession: v.number(),
    awayPossession: v.number(),
    homeShots: v.number(),
    awayShots: v.number(),
    homeShotsOnTarget: v.number(),
    awayShotsOnTarget: v.number(),
    homePasses: v.number(),
    awayPasses: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stats")
      .filter((q) => q.eq(q.field("matchId"), args.matchId))
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        updatedAt: Date.now(),
      })
    } else {
      await ctx.db.insert("stats", {
        ...args,
        updatedAt: Date.now(),
      })
    }
  },
})