"use client"

import { useEffect } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"

export function useMatchSync() {
  const upsertMatch = useMutation(api.matches.upsertMatch)

  const syncMatches = async () => {
    try {
      const res = await fetch("/api/matches")
      const data = await res.json()

      if (!data.matches) return

      // Push each match into Convex
      for (const fixture of data.matches) {
        const f = fixture.fixture
        const teams = fixture.teams
        const goals = fixture.goals
        const league = fixture.league

        await upsertMatch({
          externalId: String(f.id),
          homeTeam: teams.home.name,
          awayTeam: teams.away.name,
          homeScore: goals.home ?? 0,
          awayScore: goals.away ?? 0,
          minute: f.status.elapsed ?? 0,
          status: f.status.short,
          league: `${league.name} — ${league.country}`,
          homeLogo: teams.home.logo,
          awayLogo: teams.away.logo,
        })
      }
    } catch (error) {
      console.error("Sync error:", error)
    }
  }

  useEffect(() => {
    // Sync immediately on mount
    syncMatches()

    // Then sync every 30 seconds
    const interval = setInterval(syncMatches, 30000)

    return () => clearInterval(interval)
  }, [])
}