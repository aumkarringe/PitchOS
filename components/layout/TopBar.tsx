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
      <header className="h-14 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
        <div className="text-sm text-zinc-400">{date}</div>

        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-zinc-400 border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700 text-sm h-8 px-3"
        >
          <Search size={13} />
          Ask anything...
          <kbd className="ml-2 text-xs bg-zinc-700 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </Button>

        <div className="text-sm text-zinc-400">{time}</div>
      </header>

      <CommandBar open={open} onOpenChange={setOpen} />
    </>
  )
}