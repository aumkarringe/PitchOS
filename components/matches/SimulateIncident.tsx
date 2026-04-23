"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { usePostHog } from "posthog-js/react"
import { Zap } from "lucide-react"

export default function SimulateIncident() {
  const [loading, setLoading] = useState(false)
  const posthog = usePostHog()

  const matches = useQuery(api.matches.getLiveMatches)
  const upsertMatch = useMutation(api.matches.upsertMatch)
  const addEvent = useMutation(api.events.addEvent)

  const simulate = async () => {
    if (!matches || matches.length === 0) return
    setLoading(true)

    // Pick a random live match
    const match = matches[Math.floor(Math.random() * matches.length)]

    // Random incident type
    const incidents = ["goal", "red_card", "injury"] as const
    const incident = incidents[Math.floor(Math.random() * incidents.length)]

    try {
      if (incident === "goal") {
        // Score goes up for home team
        await upsertMatch({
          externalId: match.externalId,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          homeScore: match.homeScore + 1,
          awayScore: match.awayScore,
          minute: match.minute + 1,
          status: match.status,
          league: match.league,
          homeLogo: match.homeLogo,
          awayLogo: match.awayLogo,
        })

        await addEvent({
          matchId: match.externalId,
          type: "Goal",
          minute: match.minute + 1,
          playerName: "Simulated Player",
          team: "home",
          detail: "Normal Goal",
        })
      }

      if (incident === "red_card") {
        await addEvent({
          matchId: match.externalId,
          type: "Card",
          minute: match.minute + 1,
          playerName: "Simulated Player",
          team: "away",
          detail: "Red Card",
        })
      }

      if (incident === "injury") {
        await addEvent({
          matchId: match.externalId,
          type: "subst",
          minute: match.minute + 1,
          playerName: "Simulated Player",
          team: "home",
          detail: "Substitution — Injury",
        })
      }

      // Track simulation in PostHog
      posthog.capture("incident_simulated", {
        incident_type: incident,
        match_id: match.externalId,
      })
    } catch (error) {
      console.error("Simulation error:", error)
    }

    setLoading(false)
  }

  return (
    <Button
      onClick={simulate}
      disabled={loading}
      variant="outline"
      className="border-amber-500/35 text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 hover:text-amber-100 gap-2 w-full sm:w-auto rounded-full px-4"
    >
      <Zap size={14} className={loading ? "animate-pulse" : ""} />
      {loading ? "Simulating..." : "Simulate Incident"}
    </Button>
  )
}