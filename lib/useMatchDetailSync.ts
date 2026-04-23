"use client"

import { useEffect } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export function useMatchDetailSync(matchId: string) {
  const upsertPlayer = useMutation(api.players.upsertPlayer)
  const addEvent = useMutation(api.events.addEvent)
  const dedupeMatchEvents = useMutation(api.events.dedupeMatchEvents)
  const upsertStats = useMutation(api.stats.upsertStats)

  const asNumber = (value: unknown, fallback = 0): number => {
    if (typeof value === "number" && Number.isFinite(value)) return value
    if (typeof value === "string") {
      const cleaned = value.replace("%", "").trim()
      const parsed = Number(cleaned)
      if (Number.isFinite(parsed)) return parsed
    }
    return fallback
  }

  const asString = (value: unknown, fallback: string): string => {
    if (typeof value === "string" && value.trim().length > 0) return value
    return fallback
  }

  const sync = async () => {
    try {
      const res = await fetch(`/api/match/${matchId}`)
      const data = await res.json()

      // Clean any historical duplicates before applying fresh event updates.
      await dedupeMatchEvents({ matchId })

      // Sync players from lineups
      for (const team of data.lineups || []) {
        const side = team.team.id === data.lineups[0]?.team.id ? "home" : "away"

        for (const player of team.startXI || []) {
          await upsertPlayer({
            matchId,
            name: asString(player.player.name, "Unknown"),
            number: asNumber(player.player.number),
            position: asString(player.player.pos, "N/A"),
            status: "playing",
            minutesPlayed: 90,
            team: side,
            teamName: asString(team.team.name, "Unknown Team"),
          })
        }

        for (const player of team.substitutes || []) {
          await upsertPlayer({
            matchId,
            name: asString(player.player.name, "Unknown"),
            number: asNumber(player.player.number),
            position: asString(player.player.pos, "N/A"),
            status: "benched",
            minutesPlayed: 0,
            team: side,
            teamName: asString(team.team.name, "Unknown Team"),
          })
        }
      }

      // Sync events
      for (const event of data.events || []) {
        const detail = asString(event.detail, "Event")
        await addEvent({
          matchId,
          type: asString(event.type, "Event"),
          minute: asNumber(event.time?.elapsed),
          playerName: asString(event.player?.name, "Unknown"),
          team: event.team?.id === data.lineups[0]?.team.id ? "home" : "away",
          detail,
        })
      }

      // Sync stats
      if (data.stats.length >= 2) {
        const home = data.stats[0].statistics
        const away = data.stats[1].statistics

        const getStat = (arr: any[], type: string) =>
          asNumber(arr.find((s: any) => s.type === type)?.value)

        await upsertStats({
          matchId,
          homePossession: getStat(home, "Ball Possession") || 50,
          awayPossession: getStat(away, "Ball Possession") || 50,
          homeShots: getStat(home, "Total Shots"),
          awayShots: getStat(away, "Total Shots"),
          homeShotsOnTarget: getStat(home, "Shots on Goal"),
          awayShotsOnTarget: getStat(away, "Shots on Goal"),
          homePasses: getStat(home, "Total passes"),
          awayPasses: getStat(away, "Total passes"),
        })
      }
    } catch (error) {
      console.error("Match detail sync error:", error)
    }
  }

  useEffect(() => {
    sync()
    const interval = setInterval(sync, 30000)
    return () => clearInterval(interval)
  }, [matchId])
}