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
    <>
      <aside className="hidden md:flex w-60 panel-glass border-r flex-col py-6 px-3 shrink-0">
        {/* Logo */}
        <div className="px-3 mb-8">
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
            PitchOS
          </span>
          <p className="text-[11px] text-zinc-400 mt-1 tracking-wide uppercase">Live Command Center</p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border border-transparent",
                pathname === item.href
                  ? "bg-zinc-800/90 text-white glow-border"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/55 hover:border-zinc-700"
              )}
            >
              <item.icon size={16} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom status */}
        <div className="mt-auto px-3">
          <div className="flex items-center gap-2 text-xs text-zinc-300 border border-emerald-500/20 bg-emerald-500/10 rounded-lg px-3 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live Data Active
          </div>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-700/70 bg-zinc-950/90 backdrop-blur-xl px-2 py-2 safe-area-pb">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[11px] transition-all border",
                  active
                    ? "bg-zinc-800 text-white border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                    : "text-zinc-400 border-transparent hover:text-zinc-200"
                )}
              >
                <item.icon size={15} />
                <span className="leading-none truncate">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}