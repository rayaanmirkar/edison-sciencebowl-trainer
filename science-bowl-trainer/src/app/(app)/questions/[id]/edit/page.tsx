"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import type { Question } from "@/lib/types"
import type { QuestionInput } from "@/lib/validations"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import QuestionForm from "@/components/questions/question-form"

export default function EditQuestionPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [question, setQuestion] = useState<Question | null>(null)

  useEffect(() => {
    const loadQuestion = async () => {
      const response = await fetch(`/api/questions/${params.id}`)
      if (response.ok) {
        const data = await response.json() as Question
        setQuestion(data)
      }
    }

    void loadQuestion()
  }, [params.id])

  const handleSubmit = async (values: QuestionInput) => {
    const response = await fetch(`/api/questions/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    if (response.ok) {
      toast({ title: "Question updated", description: "Your edits have been saved.", variant: "success" })
      router.push("/questions")
    }
  }

  if (!question) {
    return <div className="text-sm text-slate-500 dark:text-slate-400">Loading question...</div>
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Edit question</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Update wording, metadata, and tags without leaving the question management workflow.</p>
      </section>
      <Card className="border-blue-100 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Question details</CardTitle>
          <CardDescription>Make the changes below, then save them back to the question bank.</CardDescription>
        </CardHeader>
        <CardContent>
          <QuestionForm submitLabel="Save changes" defaultValues={question} onSubmit={handleSubmit} onCancel={() => router.push("/questions")} />
        </CardContent>
      </Card>
    </div>
  )
}
