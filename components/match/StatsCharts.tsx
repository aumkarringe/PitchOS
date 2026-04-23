"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

type Props = {
  matchId: string
  homeTeam: string
  awayTeam: string
}

function StatBar({
  label,
  homeVal,
  awayVal,
}: {
  label: string
  homeVal: number
  awayVal: number
}) {
  const total = homeVal + awayVal || 1
  const homePct = (homeVal / total) * 100

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-zinc-400">
        <span className="font-medium text-zinc-100">{homeVal}</span>
        <span className="text-zinc-500">{label}</span>
        <span className="font-medium text-zinc-100">{awayVal}</span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden bg-zinc-800">
        <div
          className="bg-blue-500 transition-all duration-700"
          style={{ width: `${homePct}%` }}
        />
        <div
          className="bg-orange-500 flex-1 transition-all duration-700"
        />
      </div>
    </div>
  )
}

export default function StatsCharts({ matchId, homeTeam, awayTeam }: Props) {
  const stats = useQuery(api.stats.getMatchStats, { matchId })

  if (!stats) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 bg-zinc-900 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  const shotData = [
    {
      name: "Shots",
      home: stats.homeShots,
      away: stats.awayShots,
    },
    {
      name: "On Target",
      home: stats.homeShotsOnTarget,
      away: stats.awayShotsOnTarget,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Possession */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-zinc-400 mb-2">
          <span className="text-blue-400 font-medium">{homeTeam}</span>
          <span className="text-zinc-500">Possession</span>
          <span className="text-orange-400 font-medium">{awayTeam}</span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden bg-zinc-800">
          <div
            className="bg-blue-500 transition-all duration-700"
            style={{ width: `${stats.homePossession}%` }}
          />
          <div className="bg-orange-500 flex-1 transition-all duration-700" />
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-blue-400">{stats.homePossession}%</span>
          <span className="text-orange-400">{stats.awayPossession}%</span>
        </div>
      </div>

      {/* Stat bars */}
      <div className="space-y-3">
        <StatBar
          label="Shots"
          homeVal={stats.homeShots}
          awayVal={stats.awayShots}
        />
        <StatBar
          label="On Target"
          homeVal={stats.homeShotsOnTarget}
          awayVal={stats.awayShotsOnTarget}
        />
        <StatBar
          label="Passes"
          homeVal={stats.homePasses}
          awayVal={stats.awayPasses}
        />
      </div>

      {/* Bar Chart */}
      <div className="h-36 w-full min-w-0">
        <ResponsiveContainer width="100%" height={144} minWidth={0}>
          <BarChart data={shotData} barGap={4}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#71717a" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                borderRadius: "6px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="home" name={homeTeam} radius={[3, 3, 0, 0]}>
              {shotData.map((_, i) => (
                <Cell key={i} fill="#3b82f6" />
              ))}
            </Bar>
            <Bar dataKey="away" name={awayTeam} radius={[3, 3, 0, 0]}>
              {shotData.map((_, i) => (
                <Cell key={i} fill="#f97316" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}