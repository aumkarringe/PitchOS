"use client"

import { useMatchSync } from "@/lib/useMatchSync"
import MatchGrid from "@/components/matches/MatchGrid"
import SimulateIncident from "@/components/matches/SimulateIncident"
import { Radio } from "lucide-react"

export default function HomePage() {
  useMatchSync()

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="panel-glass rounded-2xl p-4 sm:p-5 border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio size={16} className="text-emerald-400" />
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                Live Matches
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300">
              Real-time command view with continuous feed updates.
            </p>
          </div>

          {/* Simulate button */}
          <SimulateIncident />
        </div>
      </div>

      {/* Match Grid */}
      <MatchGrid />
    </div>
  )
}