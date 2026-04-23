"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "convex/react"
import { usePostHog } from "posthog-js/react"
import { api } from "@/convex/_generated/api"
import { useMatchDetailSync } from "@/lib/useMatchDetailSync"
import PlayerGrid from "@/components/match/PlayerGrid"
import EventFeed from "@/components/match/EventFeed"
import StatsCharts from "@/components/match/StatsCharts"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MatchPage() {
  const params = useParams()
  const router = useRouter()
  const matchId = params.id as string
  const posthog = usePostHog()

  // Start syncing detail data
  useMatchDetailSync(matchId)

  // Real-time match data from Convex
  const match = useQuery(api.matches.getMatch, { externalId: matchId })
  const players = useQuery(api.players.getMatchPlayers, { matchId })

  // Track match view once match data loads
  useEffect(() => {
    if (match) {
      posthog.capture("match_viewed", {
        match_id: matchId,
        home_team: match.homeTeam,
        away_team: match.awayTeam,
        league: match.league,
        is_live: match.status === "1H" || match.status === "2H",
      })
    }
  }, [match?.externalId])

  if (!match) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  const isLive =
    match.status === "1H" || match.status === "2H" || match.status === "HT"

  return (
    <div className="space-y-5 sm:space-y-6 max-w-6xl mx-auto">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/")}
        className="text-zinc-300 hover:text-white -ml-2 w-fit"
      >
        <ArrowLeft size={16} className="mr-1" />
        All Matches
      </Button>

      {/* Match Header */}
      <div className="panel-glass border rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
          <span className="text-xs sm:text-sm text-zinc-300 uppercase tracking-wide truncate">{match.league}</span>
          {isLive ? (
            <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 flex items-center gap-1.5 text-xs sm:text-sm font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE {match.minute}'
            </Badge>
          ) : (
            <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-xs sm:text-sm">
              {match.status === "FT" ? "Full Time" : match.status}
            </Badge>
          )}
        </div>

        {/* Score */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2">
          {/* Home */}
          <div className="flex flex-col items-center gap-2 flex-1">
            {match.homeLogo && (
              <img
                src={match.homeLogo}
                alt={match.homeTeam}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-[0_0_12px_rgba(16,185,129,0.25)]"
              />
            )}
            <span className="text-sm font-medium text-zinc-100 text-center max-w-[12rem] truncate">
              {match.homeTeam}
            </span>
          </div>

          {/* Score */}
          <div className="flex items-center gap-3 sm:gap-4 px-2 sm:px-8 order-first sm:order-none">
            <span className="text-4xl sm:text-5xl font-bold tabular-nums text-zinc-50">
              {match.homeScore}
            </span>
            <span className="text-xl sm:text-2xl text-zinc-500">:</span>
            <span className="text-4xl sm:text-5xl font-bold tabular-nums text-zinc-50">
              {match.awayScore}
            </span>
          </div>

          {/* Away */}
          <div className="flex flex-col items-center gap-2 flex-1">
            {match.awayLogo && (
              <img
                src={match.awayLogo}
                alt={match.awayTeam}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-[0_0_12px_rgba(56,189,248,0.25)]"
              />
            )}
            <span className="text-sm font-medium text-zinc-100 text-center max-w-[12rem] truncate">
              {match.awayTeam}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 min-w-0">
        {/* Player Grid - takes 2 cols */}
        <div className="col-span-2 min-w-0 panel-glass border rounded-2xl p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-zinc-100 mb-4">
            Players
          </h2>
          <PlayerGrid
            players={players || []}
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
          />
        </div>

        {/* Right column */}
        <div className="space-y-6 min-w-0">
          {/* Events Feed */}
          <div className="panel-glass border rounded-2xl p-4 sm:p-5 min-w-0">
            <h2 className="text-sm font-semibold text-zinc-100 mb-4">
              Live Events
            </h2>
            <EventFeed
              matchId={matchId}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
            />
          </div>

          {/* Stats */}
          <div className="panel-glass border rounded-2xl p-4 sm:p-5 min-w-0">
            <h2 className="text-sm font-semibold text-zinc-100 mb-4">
              Match Stats
            </h2>
            <StatsCharts
              matchId={matchId}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
            />
          </div>
        </div>
      </div>
    </div>
  )
}