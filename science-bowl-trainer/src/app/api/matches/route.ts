import { NextRequest, NextResponse } from "next/server"
import { mockMatches, mockTeam } from "@/lib/data/mock-data"
import { matchSchema } from "@/lib/validations"

export async function GET() {
  return NextResponse.json({ items: mockMatches })
}

export async function POST(request: NextRequest) {
  const json = await request.json()
  const parsed = matchSchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const match = {
    id: `match-${Date.now()}`,
    teamId: mockTeam.id,
    opponent: parsed.data.opponent,
    date: new Date(parsed.data.date),
    location: parsed.data.location,
    score: { home: 0, away: 0 },
    createdAt: new Date(),
  }
  mockMatches.unshift(match)
  return NextResponse.json(match, { status: 201 })
}
