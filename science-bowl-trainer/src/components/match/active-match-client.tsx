"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Clock3, Keyboard, PlayCircle } from "lucide-react"
import { BONUS_POINTS, BUZZ_WINDOW_SECONDS, TOSS_UP_POINTS, WRONG_ANSWER_PENALTY } from "@/lib/constants"
import { getAllQuestions } from "@/lib/data/questions"
import type { MatchLogEntry, MatchState } from "@/lib/types"
import { formatTime, getDifficultyColor, getSubjectColor } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

function getMatchQuestions(subject: string) {
  const allQuestions = getAllQuestions()
  const filtered = subject !== "ALL" ? allQuestions.filter((question) => question.subject === subject) : allQuestions
  return filtered.slice(0, 20)
}

export default function ActiveMatchClient() {
  const params = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const team1 = searchParams.get("team1") ?? "Team 1"
  const team2 = searchParams.get("team2") ?? "Team 2"
  const subject = searchParams.get("subject") ?? "ALL"
  const questions = useMemo(() => getMatchQuestions(subject), [subject])
  const [state, setState] = useState<MatchState>({
    team1: { name: team1, score: 0 },
    team2: { name: team2, score: 0 },
    currentQuestion: questions[0] ?? null,
    questionIndex: 0,
    questions,
    buzzedTeam: null,
    buzzWindow: true,
    timeElapsed: 0,
    log: [],
  })

  useEffect(() => {
    const timer = window.setInterval(() => {
      setState((current) => ({ ...current, timeElapsed: current.timeElapsed + 1 }))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "j") {
        setState((current) => ({ ...current, buzzedTeam: 1, buzzWindow: false }))
      }
      if (event.key.toLowerCase() === "k") {
        setState((current) => ({ ...current, buzzedTeam: 2, buzzWindow: false }))
      }
    }

    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const currentQuestion = state.currentQuestion

  const addLog = (entry: MatchLogEntry) => {
    setState((current) => ({ ...current, log: [entry, ...current.log] }))
  }

  const applyResult = (correct: boolean) => {
    if (!currentQuestion || !state.buzzedTeam) {
      return
    }

    const points = currentQuestion.type === "BONUS" ? (correct ? BONUS_POINTS : 0) : correct ? TOSS_UP_POINTS : WRONG_ANSWER_PENALTY
    const logType = currentQuestion.type === "BONUS" ? (correct ? "BONUS_CORRECT" : "BONUS_WRONG") : correct ? "TOSS_UP_CORRECT" : "TOSS_UP_WRONG"

    setState((current) => ({
      ...current,
      team1: current.buzzedTeam === 1 ? { ...current.team1, score: current.team1.score + points } : current.team1,
      team2: current.buzzedTeam === 2 ? { ...current.team2, score: current.team2.score + points } : current.team2,
      buzzedTeam: null,
      buzzWindow: true,
    }))

    addLog({ type: logType, team: state.buzzedTeam, points, question: currentQuestion.question, timestamp: new Date() })
  }

  const nextQuestion = () => {
    setState((current) => {
      const nextIndex = current.questionIndex + 1
      const nextQuestion = current.questions[nextIndex] ?? null
      return {
        ...current,
        currentQuestion: nextQuestion,
        questionIndex: nextIndex,
        buzzedTeam: null,
        buzzWindow: true,
        log: nextQuestion ? [{ type: "NEXT_QUESTION", points: 0, question: nextQuestion.question, timestamp: new Date() }, ...current.log] : current.log,
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Match room {params.id}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Moderator view for live scoring, buzz control, and question flow.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-200">
          <Clock3 className="h-4 w-4" />
          {formatTime(state.timeElapsed)}
        </div>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-blue-100 dark:border-slate-800"><CardContent className="p-6"><p className="text-sm text-slate-500 dark:text-slate-400">{state.team1.name}</p><p className="mt-2 text-4xl font-semibold text-slate-950 dark:text-white">{state.team1.score}</p></CardContent></Card>
        <Card className="border-blue-100 dark:border-slate-800"><CardContent className="p-6"><p className="text-sm text-slate-500 dark:text-slate-400">{state.team2.name}</p><p className="mt-2 text-4xl font-semibold text-slate-950 dark:text-white">{state.team2.score}</p></CardContent></Card>
        <Card className="border-blue-100 dark:border-slate-800"><CardContent className="p-6"><p className="text-sm text-slate-500 dark:text-slate-400">Buzz window</p><p className="mt-2 text-4xl font-semibold text-slate-950 dark:text-white">{BUZZ_WINDOW_SECONDS}s</p></CardContent></Card>
        <Card className="border-blue-100 dark:border-slate-800"><CardContent className="p-6"><p className="text-sm text-slate-500 dark:text-slate-400">Question</p><p className="mt-2 text-4xl font-semibold text-slate-950 dark:text-white">{state.questionIndex + 1}/{state.questions.length}</p></CardContent></Card>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="border-blue-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle>{currentQuestion ? currentQuestion.question : "Match complete"}</CardTitle>
            <CardDescription>{currentQuestion ? "Moderator prompt and answer key for the current question." : "All selected questions have been used."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion ? (
              <>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getSubjectColor(currentQuestion.subject)}>{currentQuestion.subject.replace("_", " ")}</Badge>
                  <Badge className={getDifficultyColor(currentQuestion.difficulty)}>{currentQuestion.difficulty}</Badge>
                  <Badge variant="secondary">{currentQuestion.type.replace("_", "-")}</Badge>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Answer key</p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{currentQuestion.answer}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Button variant={state.buzzedTeam === 1 ? "default" : "outline"} onClick={() => setState((current) => ({ ...current, buzzedTeam: 1, buzzWindow: false }))}><Keyboard className="h-4 w-4" />Buzz {state.team1.name} (J)</Button>
                  <Button variant={state.buzzedTeam === 2 ? "default" : "outline"} onClick={() => setState((current) => ({ ...current, buzzedTeam: 2, buzzWindow: false }))}><Keyboard className="h-4 w-4" />Buzz {state.team2.name} (K)</Button>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <Button variant="success" onClick={() => applyResult(true)} disabled={!state.buzzedTeam}>Correct</Button>
                  <Button variant="destructive" onClick={() => applyResult(false)} disabled={!state.buzzedTeam}>Wrong</Button>
                  <Button variant="outline" onClick={nextQuestion}><PlayCircle className="h-4 w-4" />Next question</Button>
                </div>
              </>
            ) : (
              <div className="rounded-2xl bg-emerald-50 p-6 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200">
                Final score: {state.team1.name} {state.team1.score}, {state.team2.name} {state.team2.score}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="border-blue-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Match log</CardTitle>
            <CardDescription>Recent buzzes, scoring events, and question transitions.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[420px] pr-4">
              <div className="space-y-3">
                {state.log.length === 0 ? (
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">No events yet. Start by opening the buzz window and selecting a team.</p>
                ) : (
                  state.log.map((entry, index) => (
                    <div key={`${entry.timestamp.toISOString()}-${index}`} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{entry.type.replaceAll("_", " ")}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{entry.team ? `Team ${entry.team}` : "Moderator"} · {entry.points > 0 ? `+${entry.points}` : entry.points}</p>
                      <p className="mt-2 text-xs text-slate-400">{entry.question}</p>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
