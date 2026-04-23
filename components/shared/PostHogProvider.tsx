"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect } from "react"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      // Only track in production
      loaded: (posthog) => {
        if (process.env.NODE_ENV === "development") posthog.opt_out_capturing()
      },
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}