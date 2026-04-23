import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ConvexClientProvider } from "./ConvexClientProvider"
import { PostHogProvider } from "@/components/shared/PostHogProvider"
import Sidebar from "@/components/layout/Sidebar"
import TopBar from "@/components/layout/TopBar"

const inter = Inter({ subsets: ["latin"], preload: false })

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
        className={`${inter.className} bg-zinc-950 text-zinc-100 min-h-screen`}
      >
        <PostHogProvider>
          <ConvexClientProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-auto p-6">{children}</main>
              </div>
            </div>
          </ConvexClientProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}