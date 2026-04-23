"use client"

import { useState, useEffect, useRef } from "react"
import { useQuery } from "convex/react"
import { usePostHog } from "posthog-js/react"
import { api } from "@/convex/_generated/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Message = {
  role: "user" | "assistant"
  text: string
}

const SUGGESTED_QUESTIONS = [
  "Which match has the most goals?",
  "Which team is dominating possession?",
  "Are there any red cards tonight?",
  "What's the most exciting match right now?",
]

export default function CommandBar({ open, onOpenChange }: Props) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const posthog = usePostHog()

  const matches = useQuery(api.matches.getLiveMatches)

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setInput("")
    }
  }, [open])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // CMD+K keyboard shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, onOpenChange])

  const ask = async (question: string) => {
    if (!question.trim() || loading) return

    const userMessage = question.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text: userMessage }])
    setLoading(true)

    posthog.capture("natural_language_query", {
      question: userMessage,
      match_count: matches?.length || 0,
    })

    try {
      const matchContext = {
        totalLiveMatches: matches?.length || 0,
        matches: matches?.map((m) => ({
          homeTeam: m.homeTeam,
          awayTeam: m.awayTeam,
          homeScore: m.homeScore,
          awayScore: m.awayScore,
          minute: m.minute,
          status: m.status,
          league: m.league,
        })) || [],
      }

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage, matchContext }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "Failed to get answer")
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer || "Sorry, I couldn't get an answer.",
        },
      ])
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong"
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `${message}. Please try again.`,
        },
      ])
    }

    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      ask(input)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 p-0 max-w-xl overflow-hidden">
        <DialogTitle className="sr-only">Match assistant command bar</DialogTitle>
        <DialogDescription className="sr-only">
          Ask questions about live matches and get concise insights.
        </DialogDescription>
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          <Search size={16} className="text-zinc-500 shrink-0" />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about live matches..."
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
          />
          {loading && (
            <Loader2 size={14} className="text-zinc-500 animate-spin shrink-0" />
          )}
        </div>

        {/* Messages */}
        {messages.length > 0 && (
          <div className="max-h-80 overflow-y-auto px-4 py-3 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles size={12} className="text-green-400" />
                  </div>
                )}
                <div
                  className={cn(
                    "text-sm rounded-xl px-3 py-2 max-w-[85%]",
                    msg.role === "user"
                      ? "bg-zinc-700 text-zinc-100 rounded-tr-sm"
                      : "bg-zinc-800 text-zinc-200 rounded-tl-sm"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading bubble */}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                  <Sparkles size={12} className="text-green-400" />
                </div>
                <div className="bg-zinc-800 rounded-xl rounded-tl-sm px-3 py-2">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Suggested questions */}
        {messages.length === 0 && (
          <div className="px-4 py-3">
            <p className="text-xs text-zinc-600 mb-2">Suggested questions</p>
            <div className="space-y-1">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => ask(q)}
                  className="w-full text-left text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 px-3 py-2 rounded-md transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-2 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-zinc-600">
            {matches?.length || 0} live matches in context
          </span>
          <div className="flex items-center gap-2 text-xs text-zinc-600">
            <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">↵</kbd>
            <span>to send</span>
            <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">esc</kbd>
            <span>to close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}