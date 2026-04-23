"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import MatchCard from "./MatchCard"
import { motion } from "framer-motion"

export default function MatchGrid() {
  const matches = useQuery(api.matches.getLiveMatches)

  if (matches === undefined) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-36 bg-zinc-900 border border-zinc-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
        <span className="text-4xl mb-3">⚽</span>
        <p className="text-sm">No matches found</p>
        <p className="text-xs mt-1">Check back when live matches are available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {matches.map((match, i) => (
        <motion.div
          key={match._id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.04 }}
        >
          <MatchCard
            id={match.externalId}
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
            homeScore={match.homeScore}
            awayScore={match.awayScore}
            minute={match.minute}
            status={match.status}
            league={match.league}
            homeLogo={match.homeLogo}
            awayLogo={match.awayLogo}
          />
        </motion.div>
      ))}
    </div>
  )
}