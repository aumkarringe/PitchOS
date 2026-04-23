"use client"

import { useEffect } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export function useMatchDetailSync(matchId: string) {
  const upsertPlayer = useMutation(api.players.upsertPlayer)
  const addEvent = useMutation(api.events.addEvent)
  const upsertStats = useMutation(api.stats.upsertStats)

  const sync = async () => {
    try {
      const res = await fetch(`/api/match/${matchId}`)
      const data = await res.json()

      // Sync players from lineups
      for (const team of data.lineups) {
        const side = team.team.id === data.lineups[0]?.team.id ? "home" : "away"

        for (const player of team.startXI || []) {
          await upsertPlayer({
            matchId,
            name: player.player.name,
            number: player.player.number,
            position: player.player.pos || "N/A",
            status: "playing",
            minutesPlayed: 90,
            team: side,
            teamName: team.team.name,
          })
        }

        for (const player of team.substitutes || []) {
          await upsertPlayer({
            matchId,
            name: player.player.name,
            number: player.player.number,
            position: player.player.pos || "N/A",
            status: "benched",
            minutesPlayed: 0,
            team: side,
            teamName: team.team.name,
          })
        }
      }

      // Sync events
      for (const event of data.events || []) {
        await addEvent({
          matchId,
          type: event.type,
          minute: event.time.elapsed,
          playerName: event.player.name || "Unknown",
          team: event.team.id === data.lineups[0]?.team.id ? "home" : "away",
          detail: event.detail,
        })
      }

      // Sync stats
      if (data.stats.length >= 2) {
        const home = data.stats[0].statistics
        const away = data.stats[1].statistics

        const getStat = (arr: any[], type: string) =>
          arr.find((s: any) => s.type === type)?.value || 0

        await upsertStats({
          matchId,
          homePossession: parseInt(getStat(home, "Ball Possession")) || 50,
          awayPossession: parseInt(getStat(away, "Ball Possession")) || 50,
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