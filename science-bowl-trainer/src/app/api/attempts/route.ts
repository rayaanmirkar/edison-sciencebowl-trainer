import { NextRequest, NextResponse } from "next/server"
import { recordAttempt } from "@/lib/data/practices"
import { z } from "zod"

const attemptSchema = z.object({
  userId: z.string().min(1),
  questionId: z.string().min(1),
  question: z.any().optional(),
  correct: z.boolean(),
  timeSpent: z.number().int().min(0),
  practiceSessionId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const json = await request.json()
  const parsed = attemptSchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const attempt = recordAttempt(parsed.data)
  return NextResponse.json(attempt, { status: 201 })
}
