import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Fetch live matches from API-Football
    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        headers: {
          "x-apisports-key": process.env.FOOTBALL_API_KEY!,
        },
        // Don't cache — we always want fresh data
        cache: "no-store",
      }
    )

    const data = await response.json()

    // If no live matches, fetch today's matches instead
    if (!data.response || data.response.length === 0) {
      const today = new Date().toISOString().split("T")[0]
      const todayResponse = await fetch(
        `https://v3.football.api-sports.io/fixtures?date=${today}`,
        {
          headers: {
            "x-apisports-key": process.env.FOOTBALL_API_KEY!,
          },
          cache: "no-store",
        }
      )
      const todayData = await todayResponse.json()
      return NextResponse.json({ matches: todayData.response || [] })
    }

    return NextResponse.json({ matches: data.response || [] })
  } catch (error) {
    console.error("Football API error:", error)
    return NextResponse.json({ matches: [] }, { status: 500 })
  }
}