import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const getMatchPlayers = query({
  args: { matchId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("matchId"), args.matchId))
      .collect()
  },
})

export const upsertPlayer = mutation({
  args: {
    matchId: v.string(),
    name: v.string(),
    number: v.number(),
    position: v.string(),
    rating: v.optional(v.string()),
    status: v.string(),
    minutesPlayed: v.number(),
    team: v.string(),
    teamName: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("players")
      .filter((q) =>
        q.and(
          q.eq(q.field("matchId"), args.matchId),
          q.eq(q.field("name"), args.name),
          q.eq(q.field("team"), args.team)
        )
      )
      .first()

    if (existing) {
      await ctx.db.patch(existing._id, args)
    } else {
      await ctx.db.insert("players", args)
    }
  },
})

export const clearMatchPlayers = mutation({
  args: { matchId: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("players")
      .filter((q) => q.eq(q.field("matchId"), args.matchId))
      .collect()
    await Promise.all(all.map((p) => ctx.db.delete(p._id)))
  },
})