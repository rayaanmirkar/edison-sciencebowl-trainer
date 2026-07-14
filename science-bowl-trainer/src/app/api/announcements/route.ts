import { NextRequest, NextResponse } from "next/server"
import { addAnnouncement, getAnnouncements } from "@/lib/data/teams"
import { announcementSchema } from "@/lib/validations"

export async function GET() {
  return NextResponse.json({ items: getAnnouncements() })
}

export async function POST(request: NextRequest) {
  const json = await request.json()
  const parsed = announcementSchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const announcement = addAnnouncement(parsed.data)
  return NextResponse.json(announcement, { status: 201 })
}
