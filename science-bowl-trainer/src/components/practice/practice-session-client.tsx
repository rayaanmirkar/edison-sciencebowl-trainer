"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, Clock3, XCircle } from "lucide-react"
import { getPracticeQuestions } from "@/lib/data/questions"
import { getCurrentUser } from "@/lib/data/users"
import type { Attempt, Difficulty, PracticeConfig, Question, Subject } from "@/lib/types"
import { calculateAccuracy, formatTime, getDifficultyColor, getSubjectColor } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AttemptRecord {
  question: Question
  selectedAnswer: string | null
  correct: boolean
  timeSpent: number
}

function getConfigFromParams(params: URLSearchParams): PracticeConfig {
  const rawSubjects = params.get("subjects")?.split(",").filter(Boolean) as Subject[] | undefined
  return {
    subjects: rawSubjects && rawSubjects.length > 0 ? rawSubjects : ["BIOLOGY", "CHEMISTRY", "PHYSICS"],
    difficulty: (params.get("difficulty") as Difficulty | "ALL") ?? "ALL",
    questionCount: Number(params.get("questionCount") ?? 10),
    mode: params.get("mode") === "UNTIMED" ? "UNTIMED" : "TIMED",
    timePerQuestion: Number(params.get("timePerQuestion") ?? 25),
  }
}

function buildChoices(question: Question, questions: Question[]) {
  const distractors = questions
    .filter((candidate) => candidate.id !== question.id && candidate.answer !== question.answer)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((candidate) => candidate.answer)

  return [...distractors, question.answer].sort(() => Math.random() - 0.5)
}

export default function PracticeSessionClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const config = useMemo(() => getConfigFromParams(searchParams), [searchParams])
  const questions = useMemo(
    () => getPracticeQuestions(config.subjects, config.questionCount, config.difficulty),
    [config.difficulty, config.questionCount, config.subjects]
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(config.timePerQuestion)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [attempts, setAttempts] = useState<AttemptRecord[]>([])
  const [startedAt] = useState(() => Date.now())
  const [summaryDuration, setSummaryDuration] = useState<number | null>(null)

  const currentQuestion = questions[currentIndex]
  const choices = useMemo(() => (currentQuestion ? buildChoices(currentQuestion, questions) : []), [currentQuestion, questions])
  const completed = !currentQuestion
  const progress = questions.length === 0 ? 0 : (currentIndex / questions.length) * 100

  useEffect(() => {
    if (config.mode !== "TIMED" || revealed || completed) {
      return
    }

    const timer = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer)
          setRevealed(true)
          return 0
        }
        return value - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [completed, config.mode, revealed])

  if (!questions.length) {
    return (
      <Card className="mx-auto max-w-2xl border-blue-100 dark:border-slate-800">
        <CardHeader>
          <CardTitle>No questions matched that configuration</CardTitle>
          <CardDescription>Adjust subjects or difficulty and launch another session.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/practice">Return to practice setup</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  const submitAnswer = () => {
    if (!currentQuestion || !selectedAnswer) {
      return
    }
    setRevealed(true)
  }

  const goToNextQuestion = () => {
    if (!currentQuestion) {
      return
    }

    const record: AttemptRecord = {
      question: currentQuestion,
      selectedAnswer,
      correct: selectedAnswer === currentQuestion.answer,
      timeSpent: config.mode === "TIMED" ? config.timePerQuestion - timeLeft : 0,
    }

    const nextAttempts = [...attempts, record]
    setAttempts(nextAttempts)
    setSelectedAnswer(null)
    setRevealed(false)
    setTimeLeft(config.timePerQuestion)

    if (currentIndex + 1 >= questions.length) {
      const correctCount = nextAttempts.filter((attempt) => attempt.correct).length
      const duration = Math.round((Date.now() - startedAt) / 1000)
      const user = getCurrentUser()
      setSummaryDuration(duration)

      void fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          mode: config.mode,
          subject: config.subjects.length === 1 ? config.subjects[0] : undefined,
          difficulty: config.difficulty === "ALL" ? undefined : config.difficulty,
          questionCount: questions.length,
          correctCount,
          duration,
        }),
      })

      nextAttempts.forEach((attempt) => {
        const attemptPayload: Omit<Attempt, "id" | "createdAt"> = {
          userId: user.id,
          questionId: attempt.question.id,
          question: attempt.question,
          correct: attempt.correct,
          timeSpent: attempt.timeSpent,
          practiceSessionId: undefined,
        }
        void fetch("/api/attempts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(attemptPayload),
        })
      })
    }

    setCurrentIndex((value) => value + 1)
  }

  if (completed) {
    const accuracy = calculateAccuracy(attempts.filter((attempt) => attempt.correct).length, attempts.length)
    const duration = summaryDuration ?? 0
    const breakdown = config.subjects.map((subject) => {
      const subjectAttempts = attempts.filter((attempt) => attempt.question.subject === subject)
      return {
        subject,
        correct: subjectAttempts.filter((attempt) => attempt.correct).length,
        total: subjectAttempts.length,
      }
    })

    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Card className="border-blue-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Session summary</CardTitle>
            <CardDescription>Review your performance before jumping into the next drill.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-blue-50 p-5 dark:bg-blue-950/30">
              <p className="text-sm text-slate-500 dark:text-slate-400">Score</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{attempts.filter((attempt) => attempt.correct).length}/{attempts.length}</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-5 dark:bg-blue-950/30">
              <p className="text-sm text-slate-500 dark:text-slate-400">Accuracy</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{accuracy}%</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-5 dark:bg-blue-950/30">
              <p className="text-sm text-slate-500 dark:text-slate-400">Time taken</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white">{formatTime(duration)}</p>
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-blue-100 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Subject breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {breakdown.map((row) => (
                <div key={row.subject} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                  <Badge className={getSubjectColor(row.subject)}>{row.subject.replace("_", " ")}</Badge>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{row.correct}/{row.total} correct</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-blue-100 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Review missed questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {attempts.filter((attempt) => !attempt.correct).length === 0 ? (
                <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200">
                  Outstanding work. You answered every question correctly in this session.
                </p>
              ) : (
                attempts
                  .filter((attempt) => !attempt.correct)
                  .map((attempt) => (
                    <div key={attempt.question.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <p className="font-medium text-slate-900 dark:text-white">{attempt.question.question}</p>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Your answer: {attempt.selectedAnswer ?? "No answer"}</p>
                      <p className="mt-1 text-sm font-medium text-blue-700 dark:text-blue-300">Correct answer: {attempt.question.answer}</p>
                    </div>
                  ))
              )}
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => router.push("/practice")}>Start another session</Button>
                <Button variant="outline" asChild><Link href="/dashboard">Back to dashboard</Link></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const isCorrect = selectedAnswer === currentQuestion.answer

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Question {currentIndex + 1} of {questions.length}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge className={getSubjectColor(currentQuestion.subject)}>{currentQuestion.subject.replace("_", " ")}</Badge>
            <Badge className={getDifficultyColor(currentQuestion.difficulty)}>{currentQuestion.difficulty}</Badge>
            <Badge variant="secondary">{currentQuestion.type.replace("_", "-")}</Badge>
          </div>
        </div>
        {config.mode === "TIMED" ? (
          <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-200">
            <Clock3 className="h-4 w-4" />
            {formatTime(timeLeft)}
          </div>
        ) : null}
      </div>
      <Progress value={progress} />
      <Card className="border-blue-100 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl leading-9">{currentQuestion.question}</CardTitle>
          <CardDescription>Select the best answer choice, then reveal the result.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {choices.map((choice, index) => {
              const labels = ["A", "B", "C", "D"]
              const active = selectedAnswer === choice
              const highlight = revealed
                ? choice === currentQuestion.answer
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                  : active
                    ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                    : "border-slate-200"
                : active
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                  : "border-slate-200"
              return (
                <button key={choice} type="button" onClick={() => !revealed && setSelectedAnswer(choice)} className={`rounded-2xl border p-4 text-left transition-colors dark:border-slate-700 ${highlight}`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{labels[index]}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-900 dark:text-white">{choice}</p>
                </button>
              )
            })}
          </div>
          {revealed ? (
            <div className={`rounded-2xl p-4 ${isCorrect ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200" : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-200"}`}>
              <div className="flex items-start gap-3">
                {isCorrect ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <XCircle className="mt-0.5 h-5 w-5" />}
                <div>
                  <p className="font-medium">{isCorrect ? "Correct answer" : "Not quite"}</p>
                  <p className="mt-1 text-sm">The correct answer is {currentQuestion.answer}.</p>
                </div>
              </div>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {!revealed ? <Button onClick={submitAnswer} disabled={!selectedAnswer}>Submit answer</Button> : <Button onClick={goToNextQuestion}>{currentIndex + 1 === questions.length ? "Finish session" : "Next question"}</Button>}
            <Button variant="outline" asChild><Link href="/practice">End session</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
