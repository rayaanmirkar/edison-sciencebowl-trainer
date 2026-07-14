"use client"

import Link from "next/link"
import { useMemo, useRef, useState } from "react"
import { Download, FileUp, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { DIFFICULTIES, QUESTION_TYPES, SUBJECTS } from "@/lib/constants"
import { exportQuestionsToCSV } from "@/lib/csv-parser"
import type { Difficulty, Question, QuestionType, Subject } from "@/lib/types"
import { getDifficultyColor, getSubjectColor } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const pageSize = 10

export default function QuestionsManager({ initialQuestions }: { initialQuestions: Question[] }) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [questions, setQuestions] = useState(initialQuestions)
  const [search, setSearch] = useState("")
  const [subject, setSubject] = useState<Subject | "ALL">("ALL")
  const [difficulty, setDifficulty] = useState<Difficulty | "ALL">("ALL")
  const [type, setType] = useState<QuestionType | "ALL">("ALL")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch = search
        ? question.question.toLowerCase().includes(search.toLowerCase()) || question.answer.toLowerCase().includes(search.toLowerCase())
        : true
      const matchesSubject = subject === "ALL" ? true : question.subject === subject
      const matchesDifficulty = difficulty === "ALL" ? true : question.difficulty === difficulty
      const matchesType = type === "ALL" ? true : question.type === type
      return matchesSearch && matchesSubject && matchesDifficulty && matchesType
    })
  }, [difficulty, questions, search, subject, type])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const refreshQuestions = async () => {
    const response = await fetch("/api/questions")
    const data = await response.json() as { items: Question[] }
    setQuestions(data.items)
  }

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/questions/${id}`, { method: "DELETE" })
    if (response.ok) {
      toast({ title: "Question deleted", description: "The question bank was updated.", variant: "success" })
      await refreshQuestions()
    }
  }

  const handleExport = () => {
    const csv = exportQuestionsToCSV(filtered)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "science-bowl-questions.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (file: File) => {
    const text = await file.text()
    const response = await fetch("/api/questions/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csvText: text }),
    })
    if (response.ok) {
      toast({ title: "Questions imported", description: "New questions were added to the bank.", variant: "success" })
      await refreshQuestions()
      setPage(1)
    }
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Question bank</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Search, filter, import, and maintain a full Science Bowl question library.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => inputRef.current?.click()}>
            <FileUp className="h-4 w-4" />
            Import CSV
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button asChild>
            <Link href="/questions/new">
              <Plus className="h-4 w-4" />
              Add Question
            </Link>
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) {
                void handleImport(file)
              }
            }}
          />
        </div>
      </section>
      <Card className="border-blue-100 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Narrow the bank by keyword, subject, difficulty, and question type.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative xl:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" placeholder="Search questions or answers" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} />
          </div>
          <Select value={subject} onValueChange={(value) => { setSubject(value as Subject | "ALL"); setPage(1) }}>
            <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All subjects</SelectItem>
              {SUBJECTS.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={difficulty} onValueChange={(value) => { setDifficulty(value as Difficulty | "ALL"); setPage(1) }}>
            <SelectTrigger><SelectValue placeholder="Difficulty" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All difficulties</SelectItem>
              {DIFFICULTIES.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={(value) => { setType(value as QuestionType | "ALL"); setPage(1) }}>
            <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All types</SelectItem>
              {QUESTION_TYPES.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card className="border-blue-100 dark:border-slate-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="max-w-xl">
                    <div className="space-y-1">
                      <p className="truncate font-medium text-slate-900 dark:text-white">{question.question}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">Answer: {question.answer}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge className={getSubjectColor(question.subject)}>{question.subject.replace("_", " ")}</Badge></TableCell>
                  <TableCell><Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge></TableCell>
                  <TableCell>{question.type.replace("_", "-")}</TableCell>
                  <TableCell>{question.year ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button asChild size="icon" variant="outline"><Link href={`/questions/${question.id}/edit`}><Pencil className="h-4 w-4" /></Link></Button>
                      <Button size="icon" variant="destructive" onClick={() => void handleDelete(question.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">Showing {filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} questions</p>
        <div className="flex gap-2">
          <Button variant="outline" disabled={currentPage === 1} onClick={() => setPage((value) => value - 1)}>Previous</Button>
          <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setPage((value) => value + 1)}>Next</Button>
        </div>
      </div>
    </div>
  )
}
