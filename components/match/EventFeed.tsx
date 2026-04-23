"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type Props = {
  matchId: string
  homeTeam: string
  awayTeam: string
}

function eventIcon(type: string) {
  switch (type) {
    case "Goal": return "⚽"
    case "Card":  return "🟨"
    case "subst": return "🔄"
    case "Var":   return "📺"
    default:      return "•"
  }
}

function eventColor(type: string) {
  switch (type) {
    case "Goal":  return "border-l-emerald-400 bg-emerald-500/8"
    case "Card":  return "border-l-amber-400 bg-amber-500/8"
    case "subst": return "border-l-sky-400 bg-sky-500/8"
    default:      return "border-l-zinc-600 bg-zinc-900/70"
  }
}

export default function EventFeed({ matchId, homeTeam, awayTeam }: Props) {
  // Real-time subscription — new events appear instantly
  const events = useQuery(api.events.getMatchEvents, { matchId })

  if (!events) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-12 bg-zinc-900 rounded-md animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-zinc-600 text-sm">
        No events yet — waiting for kick off
      </div>
    )
  }

  // Sort by most recent first
  const sorted = [...events].sort((a, b) => b.minute - a.minute)

  return (
    <ScrollArea className="h-72">
      <div className="space-y-2 pr-4">
        {sorted.map((event) => (
          <div
            key={event._id}
            className={cn(
                "flex items-start gap-3 p-3 rounded-lg border-l-2 border border-transparent hover:border-zinc-700/70 transition-colors",
              eventColor(event.type)
            )}
          >
            {/* Minute */}
            <span className="text-xs text-zinc-500 font-mono w-8 shrink-0 pt-0.5">
              {event.minute}'
            </span>

            {/* Icon */}
            <span className="text-sm shrink-0">{eventIcon(event.type)}</span>

            {/* Detail */}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-zinc-100 truncate">
                {event.playerName}
              </span>
              <span className="text-xs text-zinc-500">
                {event.detail} •{" "}
                {event.team === "home" ? homeTeam : awayTeam}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}