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
        "bg-zinc-900 border-zinc-800 p-4 cursor-pointer",
        "hover:border-zinc-600 hover:bg-zinc-800/80 transition-all duration-200",
        isLive && "border-l-2 border-l-green-500"
      )}
    >
      {/* League + Status */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-zinc-500 truncate">{league}</span>
        {isLive ? (
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {minute}'
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="text-zinc-500 border-zinc-700 text-xs"
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
          <div className="flex items-center gap-2">
            {homeLogo && (
              <img
                src={homeLogo}
                alt={homeTeam}
                className="w-5 h-5 object-contain"
              />
            )}
            <span className="text-sm font-medium text-zinc-100 truncate max-w-[140px]">
              {homeTeam}
            </span>
          </div>
          <span
            className={cn(
              "text-lg font-bold tabular-nums",
              homeScore > awayScore ? "text-white" : "text-zinc-400"
            )}
          >
            {homeScore}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {awayLogo && (
              <img
                src={awayLogo}
                alt={awayTeam}
                className="w-5 h-5 object-contain"
              />
            )}
            <span className="text-sm font-medium text-zinc-100 truncate max-w-[140px]">
              {awayTeam}
            </span>
          </div>
          <span
            className={cn(
              "text-lg font-bold tabular-nums",
              awayScore > homeScore ? "text-white" : "text-zinc-400"
            )}
          >
            {awayScore}
          </span>
        </div>
      </div>
    </Card>
  )
}