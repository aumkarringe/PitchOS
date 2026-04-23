"use client"

import { useMatchSync } from "@/lib/useMatchSync"
import MatchGrid from "@/components/matches/MatchGrid"
import SimulateIncident from "@/components/matches/SimulateIncident"
import { Radio } from "lucide-react"

export default function HomePage() {
  useMatchSync()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio size={16} className="text-green-500" />
            <h1 className="text-lg font-semibold">Live Matches</h1>
          </div>
          <p className="text-sm text-zinc-500">
            Real-time scores — updates automatically
          </p>
        </div>

        {/* Simulate button */}
        <SimulateIncident />
      </div>

      {/* Match Grid */}
      <MatchGrid />
    </div>
  )
}