import { NextRequest, NextResponse } from "next/server"
import { deleteQuestion, getQuestionById, updateQuestion } from "@/lib/data/questions"
import { questionSchema } from "@/lib/validations"

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const question = getQuestionById(id)

  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 })
  }

  return NextResponse.json(question)
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const json = await request.json()
  const parsed = questionSchema.safeParse(json)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const question = updateQuestion(id, parsed.data)
  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 })
  }

  return NextResponse.json(question)
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  const deleted = deleteQuestion(id)

  if (!deleted) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
