"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, Radio, BarChart2, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Live Matches", icon: Radio, href: "/" },
  { label: "Stats", icon: BarChart2, href: "/stats" },
  { label: "Activity", icon: Activity, href: "/activity" },
  { label: "Settings", icon: Settings, href: "/settings" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col py-6 px-3 shrink-0">
      {/* Logo */}
      <div className="px-3 mb-8">
        <span className="text-lg font-bold tracking-tight">
          ⚽ PitchOS
        </span>
        <p className="text-xs text-zinc-500 mt-0.5">Live Command Center</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === item.href
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            )}
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom status */}
      <div className="mt-auto px-3">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Live Data Active
        </div>
      </div>
    </aside>
  )
}