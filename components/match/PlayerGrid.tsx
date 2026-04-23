"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type Player = {
  _id: string
  name: string
  number: number
  position: string
  rating?: string
  status: string
  minutesPlayed: number
  team: string
  teamName: string
}

type Props = {
  players: Player[]
  homeTeam: string
  awayTeam: string
}

function PlayerTile({ player }: { player: Player }) {
  const isActive = player.status === "playing"
  const isSubbed = player.status === "subbed"
  const isInjured = player.status === "injured"

  const rating = parseFloat(player.rating || "0")
  const ratingColor =
    rating >= 8
      ? "text-green-400"
      : rating >= 7
      ? "text-blue-400"
      : rating >= 6
      ? "text-yellow-400"
      : "text-zinc-400"

  return (
    <div
      className={cn(
        "relative p-3 rounded-lg border transition-all duration-300",
        isActive && "bg-zinc-800/80 border-zinc-700",
        isSubbed && "bg-zinc-900/50 border-zinc-800 opacity-60",
        isInjured && "bg-red-950/30 border-red-900/50",
        !isActive && !isSubbed && !isInjured && "bg-zinc-900 border-zinc-800"
      )}
    >
      {/* Status dot */}
      <div className="absolute top-2 right-2">
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full block",
            isActive && "bg-green-500 animate-pulse",
            isSubbed && "bg-zinc-500",
            isInjured && "bg-red-500",
            !isActive && !isSubbed && !isInjured && "bg-zinc-600"
          )}
        />
      </div>

      {/* Number + Name */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-zinc-500 font-mono w-5">
          {player.number}
        </span>
        <span className="text-xs font-medium text-zinc-100 truncate">
          {player.name.split(" ").slice(-1)[0]}
        </span>
      </div>

      {/* Position */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-zinc-500">{player.position}</span>
        {player.rating && (
          <span className={cn("text-xs font-bold", ratingColor)}>
            {player.rating}
          </span>
        )}
      </div>

      {/* Subbed indicator */}
      {isSubbed && (
        <div className="mt-1">
          <span className="text-xs text-zinc-600">↓ Subbed</span>
        </div>
      )}
    </div>
  )
}

export default function PlayerGrid({ players, homeTeam, awayTeam }: Props) {
  const homePlayers = players.filter((p) => p.team === "home")
  const awayPlayers = players.filter((p) => p.team === "away")

  if (players.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-zinc-600 text-sm">
        Lineup not available yet
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Home Team */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold text-zinc-100">{homeTeam}</h3>
          <Badge
            variant="outline"
            className="text-xs border-zinc-700 text-zinc-400"
          >
            {homePlayers.filter((p) => p.status === "playing").length} active
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {homePlayers.map((player) => (
            <PlayerTile key={player._id} player={player} />
          ))}
        </div>
      </div>

      {/* Away Team */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold text-zinc-100">{awayTeam}</h3>
          <Badge
            variant="outline"
            className="text-xs border-zinc-700 text-zinc-400"
          >
            {awayPlayers.filter((p) => p.status === "playing").length} active
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {awayPlayers.map((player) => (
            <PlayerTile key={player._id} player={player} />
          ))}
        </div>
      </div>
    </div>
  )
}