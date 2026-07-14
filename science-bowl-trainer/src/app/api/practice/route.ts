import { NextRequest, NextResponse } from "next/server"
import { createPracticeSession, getPracticeSessions } from "@/lib/data/practices"
import { z } from "zod"

const practiceSessionSchema = z.object({
  userId: z.string().min(1),
  mode: z.enum(["TIMED", "UNTIMED"]),
  subject: z.enum(["BIOLOGY", "CHEMISTRY", "PHYSICS", "EARTH_SCIENCE", "MATH", "ENERGY", "GENERAL_SCIENCE"]).optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  questionCount: z.number().int().min(1),
  correctCount: z.number().int().min(0),
  duration: z.number().int().min(0),
})

export async function GET() {
  return NextResponse.json({ items: getPracticeSessions() })
}

export async function POST(request: NextRequest) {
  const json = await request.json()
  const parsed = practiceSessionSchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const session = createPracticeSession(parsed.data)
  return NextResponse.json(session, { status: 201 })
}
