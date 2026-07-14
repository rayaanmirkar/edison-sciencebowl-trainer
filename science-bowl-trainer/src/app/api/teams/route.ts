import { NextRequest, NextResponse } from "next/server"
import { addTeamMember, getTeam } from "@/lib/data/teams"
import { z } from "zod"

const teamMemberSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(["STUDENT", "CAPTAIN", "COACH", "ADMIN"]),
})

const teamUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  school: z.string().min(2).optional(),
  description: z.string().optional(),
})

export async function GET() {
  return NextResponse.json(getTeam())
}

export async function POST(request: NextRequest) {
  const json = await request.json()
  const parsed = teamMemberSchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const member = addTeamMember(parsed.data)
  return NextResponse.json(member, { status: 201 })
}

export async function PUT(request: NextRequest) {
  const json = await request.json()
  const parsed = teamUpdateSchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const team = getTeam()
  const updated = { ...team, ...parsed.data }
  return NextResponse.json(updated)
}
