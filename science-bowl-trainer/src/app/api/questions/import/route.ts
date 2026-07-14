import { NextRequest, NextResponse } from "next/server"
import { parseCSVQuestions } from "@/lib/csv-parser"
import { importQuestions } from "@/lib/data/questions"

export async function POST(request: NextRequest) {
  const json = await request.json()
  const csvText = typeof json.csvText === "string" ? json.csvText : ""
  const imported = importQuestions(parseCSVQuestions(csvText))
  return NextResponse.json({ count: imported.length, items: imported }, { status: 201 })
}
