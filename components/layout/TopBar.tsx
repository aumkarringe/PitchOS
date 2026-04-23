"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import CommandBar from "@/components/shared/CommandBar"

export default function TopBar() {
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })
      )
      setDate(
        new Date().toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      )
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <header className="h-14 border-b border-zinc-700/40 bg-zinc-950/35 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 shrink-0 gap-2">
        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-300 rounded-full border border-zinc-700/70 bg-zinc-900/70 px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="truncate">{date}</span>
        </div>

        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-zinc-300 border-zinc-700/80 bg-zinc-900/70 hover:bg-zinc-800 text-sm h-9 px-3 flex-1 sm:flex-none rounded-full"
        >
          <Search size={13} />
          <span className="truncate text-left">Ask about match momentum...</span>
          <kbd className="ml-auto hidden sm:inline-flex text-[10px] bg-zinc-700/90 border border-zinc-600 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </Button>

        <div className="text-xs sm:text-sm text-cyan-200 tabular-nums min-w-12 text-right font-medium">
          {time}
        </div>
      </header>

      <CommandBar open={open} onOpenChange={setOpen} />
    </>
  )
}