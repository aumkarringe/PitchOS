"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

type Props = {
  matchId: string
  homeTeam: string
  awayTeam: string
}

function eventIcon(type: string) {
  switch (type) {
    case "Goal":  return "⚽"
    case "Card":  return "🟨"
    case "subst": return "🔄"
    case "Var":   return "📺"
    default:      return "•"
  }
}

function eventColor(type: string) {
  switch (type) {
    case "Goal":  return "border-l-green-500 bg-green-500/5"
    case "Card":  return "border-l-yellow-500 bg-yellow-500/5"
    case "subst": return "border-l-blue-500 bg-blue-500/5"
    default:      return "border-l-zinc-700 bg-zinc-900"
  }
}

export default function EventFeed({ matchId, homeTeam, awayTeam }: Props) {
  const events = useQuery(api.events.getMatchEvents, { matchId })

  if (!events) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-zinc-900 rounded-md animate-pulse" />
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

  const sorted = [...events].sort((a, b) => b.minute - a.minute)

  return (
    <ScrollArea className="h-72">
      <div className="space-y-2 pr-4">
        <AnimatePresence initial={false}>
          {sorted.map((event) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "flex items-start gap-3 p-3 rounded-md border-l-2",
                eventColor(event.type)
              )}
            >
              <span className="text-xs text-zinc-500 font-mono w-8 shrink-0 pt-0.5">
                {event.minute}'
              </span>
              <span className="text-sm shrink-0">{eventIcon(event.type)}</span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-zinc-100 truncate">
                  {event.playerName}
                </span>
                <span className="text-xs text-zinc-500">
                  {event.detail} •{" "}
                  {event.team === "home" ? homeTeam : awayTeam}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  )
}