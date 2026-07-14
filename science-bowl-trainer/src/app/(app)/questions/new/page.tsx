"use client"

import { useRouter } from "next/navigation"
import type { QuestionInput } from "@/lib/validations"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import QuestionForm from "@/components/questions/question-form"

export default function NewQuestionPage() {
  const router = useRouter()

  const handleSubmit = async (values: QuestionInput) => {
    const response = await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })

    if (response.ok) {
      toast({ title: "Question created", description: "The question bank has been updated.", variant: "success" })
      router.push("/questions")
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Add new question</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Create a polished Science Bowl prompt with source metadata and tags.</p>
      </section>
      <Card className="border-blue-100 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Question details</CardTitle>
          <CardDescription>Keep question wording clean and concise so it is ready for practice and match mode.</CardDescription>
        </CardHeader>
        <CardContent>
          <QuestionForm submitLabel="Save question" onSubmit={handleSubmit} onCancel={() => router.push("/questions")} />
        </CardContent>
      </Card>
    </div>
  )
}
