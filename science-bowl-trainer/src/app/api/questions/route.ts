import { NextRequest, NextResponse } from "next/server"
import { listQuestions, createQuestion } from "@/lib/data/questions"
import { questionSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const result = listQuestions({
    search: searchParams.get("search") ?? undefined,
    subject: (searchParams.get("subject") as never) ?? undefined,
    difficulty: (searchParams.get("difficulty") as never) ?? undefined,
    type: (searchParams.get("type") as never) ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : undefined,
  })
  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const json = await request.json()
  const parsed = questionSchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const question = createQuestion(parsed.data)
  return NextResponse.json(question, { status: 201 })
}
