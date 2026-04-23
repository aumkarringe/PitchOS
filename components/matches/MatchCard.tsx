"use client"

import { useRouter } from "next/navigation"
import { usePostHog } from "posthog-js/react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Props = {
  id: string
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  minute: number
  status: string
  league: string
  homeLogo: string
  awayLogo: string
}

export default function MatchCard({
  id,
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  minute,
  status,
  league,
  homeLogo,
  awayLogo,
}: Props) {
  const router = useRouter()
  const posthog = usePostHog()
  const isLive = status === "1H" || status === "2H" || status === "HT"

  const handleClick = () => {
    // Track which matches users are most interested in
    posthog.capture("match_clicked", {
      match_id: id,
      home_team: homeTeam,
      away_team: awayTeam,
      league,
      is_live: isLive,
      minute,
    })
    router.push(`/match/${id}`)
  }

  return (
    <Card
      onClick={handleClick}
      className={cn(
        "relative panel-glass border p-4 cursor-pointer hover-lift",
        "hover:border-zinc-500/70 hover:bg-zinc-800/80 transition-all duration-200",
        isLive && "border-l-2 border-l-emerald-400"
      )}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />

      {/* League + Status */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase tracking-wide text-zinc-400 truncate">{league}</span>
        {isLive ? (
          <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-xs flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {minute}'
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="text-zinc-300 border-zinc-600/70 text-xs"
          >
            {status === "FT"
              ? "Full Time"
              : status === "NS"
              ? "Upcoming"
              : status}
          </Badge>
        )}
      </div>

      {/* Teams + Score */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            {homeLogo && (
              <img
                src={homeLogo}
                alt={homeTeam}
                className="w-5 h-5 object-contain"
              />
            )}
            <span className="text-sm font-medium text-zinc-100 truncate">
              {homeTeam}
            </span>
          </div>
          <span
            className={cn(
              "text-lg font-bold tabular-nums",
                homeScore > awayScore ? "text-zinc-50" : "text-zinc-400"
            )}
          >
            {homeScore}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            {awayLogo && (
              <img
                src={awayLogo}
                alt={awayTeam}
                className="w-5 h-5 object-contain"
              />
            )}
            <span className="text-sm font-medium text-zinc-100 truncate">
              {awayTeam}
            </span>
          </div>
          <span
            className={cn(
              "text-lg font-bold tabular-nums",
                awayScore > homeScore ? "text-zinc-50" : "text-zinc-400"
            )}
          >
            {awayScore}
          </span>
        </div>
      </div>
    </Card>
  )
}