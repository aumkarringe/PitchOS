import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    // Fetch lineups
    const [lineupsRes, eventsRes, statsRes] = await Promise.all([
      fetch(`https://v3.football.api-sports.io/fixtures/lineups?fixture=${id}`, {
        headers: { "x-apisports-key": process.env.FOOTBALL_API_KEY! },
        cache: "no-store",
      }),
      fetch(`https://v3.football.api-sports.io/fixtures/events?fixture=${id}`, {
        headers: { "x-apisports-key": process.env.FOOTBALL_API_KEY! },
        cache: "no-store",
      }),
      fetch(`https://v3.football.api-sports.io/fixtures/statistics?fixture=${id}`, {
        headers: { "x-apisports-key": process.env.FOOTBALL_API_KEY! },
        cache: "no-store",
      }),
    ])

    const [lineupsData, eventsData, statsData] = await Promise.all([
      lineupsRes.json(),
      eventsRes.json(),
      statsRes.json(),
    ])

    return NextResponse.json({
      lineups: lineupsData.response || [],
      events: eventsData.response || [],
      stats: statsData.response || [],
    })
  } catch (error) {
    console.error("Match detail error:", error)
    return NextResponse.json(
      { lineups: [], events: [], stats: [] },
      { status: 500 }
    )
  }
}