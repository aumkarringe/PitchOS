import { NextResponse } from "next/server"
import Groq from "groq-sdk"

export async function POST(request: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      )
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })

    const { question, matchContext } = await request.json()

    if (!question) {
      return NextResponse.json({ error: "No question provided" }, { status: 400 })
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are PitchOS — an intelligent football match analyst assistant.
You have access to live match data provided by the user.
Answer questions in 2-3 sentences max. Be direct and specific.
Use actual team names and numbers from the data.
If you don't have enough data to answer, say so honestly.`,
        },
        {
          role: "user",
          content: `LIVE MATCH DATA:
${JSON.stringify(matchContext, null, 2)}

QUESTION: ${question}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    })

    const answer = completion.choices[0]?.message?.content || "No answer available."

    return NextResponse.json({ answer })
  } catch (error) {
    console.error("Groq error:", error)
    const message =
      error instanceof Error ? error.message : "Unknown Groq request failure"
    return NextResponse.json(
      { error: `Failed to get answer: ${message}` },
      { status: 500 }
    )
  }
}