import type { Metadata } from "next"
import { JetBrains_Mono, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ConvexClientProvider } from "./ConvexClientProvider"
import { PostHogProvider } from "@/components/shared/PostHogProvider"
import Sidebar from "@/components/layout/Sidebar"
import TopBar from "@/components/layout/TopBar"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  preload: false,
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  preload: false,
})

export const metadata: Metadata = {
  title: "PitchOS — Live Match Command Center",
  description: "Real-time football monitoring dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} bg-zinc-950 text-zinc-100 min-h-screen`}
      >
        <PostHogProvider>
          <ConvexClientProvider>
            <div className="flex h-dvh overflow-hidden">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden min-w-0">
                <TopBar />
                <main className="flex-1 overflow-auto px-4 py-4 pb-24 sm:px-6 sm:py-6 sm:pb-6">
                  {children}
                </main>
              </div>
            </div>
          </ConvexClientProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}