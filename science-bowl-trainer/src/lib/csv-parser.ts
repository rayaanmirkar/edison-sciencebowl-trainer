import Papa from "papaparse"
import type { Difficulty, Question, QuestionType, Subject } from "./types"

interface CSVRow {
  Question?: string
  question?: string
  Answer?: string
  answer?: string
  Subject?: string
  subject?: string
  Category?: string
  category?: string
  Difficulty?: string
  difficulty?: string
  Type?: string
  type?: string
  Year?: string
  year?: string
  Source?: string
  source?: string
  [key: string]: string | undefined
}

function normalizeSubject(raw: string): Subject {
  const map: Record<string, Subject> = {
    biology: "BIOLOGY",
    bio: "BIOLOGY",
    chemistry: "CHEMISTRY",
    chem: "CHEMISTRY",
    physics: "PHYSICS",
    phys: "PHYSICS",
    "earth science": "EARTH_SCIENCE",
    "earth and space": "EARTH_SCIENCE",
    math: "MATH",
    mathematics: "MATH",
    energy: "ENERGY",
    "general science": "GENERAL_SCIENCE",
    general: "GENERAL_SCIENCE",
  }
  return map[raw.toLowerCase().trim()] ?? "GENERAL_SCIENCE"
}

function normalizeDifficulty(raw: string): Difficulty {
  const map: Record<string, Difficulty> = {
    easy: "EASY",
    medium: "MEDIUM",
    hard: "HARD",
    difficult: "HARD",
  }
  return map[raw.toLowerCase().trim()] ?? "MEDIUM"
}

function normalizeType(raw: string): QuestionType {
  if (raw.toLowerCase().includes("bonus")) return "BONUS"
  return "TOSS_UP"
}

export function parseCSVQuestions(csvText: string): Omit<Question, "id" | "createdAt">[] {
  const result = Papa.parse<CSVRow>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  })

  return result.data
    .filter((row) => {
      const question = row.Question ?? row.question
      const answer = row.Answer ?? row.answer
      return Boolean(question && answer && question.length > 0 && answer.length > 0)
    })
    .map((row) => {
      const rawSubject = row.Subject ?? row.subject ?? row.Category ?? row.category ?? "General Science"
      const rawDifficulty = row.Difficulty ?? row.difficulty ?? "Medium"
      const rawType = row.Type ?? row.type ?? "Toss-Up"
      const rawYear = row.Year ?? row.year

      return {
        question: (row.Question ?? row.question ?? "").trim(),
        answer: (row.Answer ?? row.answer ?? "").trim(),
        subject: normalizeSubject(rawSubject),
        difficulty: normalizeDifficulty(rawDifficulty),
        type: normalizeType(rawType),
        year: rawYear ? Number.parseInt(rawYear, 10) : undefined,
        source: (row.Source ?? row.source ?? "").trim() || undefined,
        tags: [],
        questionSetId: undefined,
      }
    })
}

export function exportQuestionsToCSV(questions: Question[]): string {
  const rows = questions.map((question) => ({
    Question: question.question,
    Answer: question.answer,
    Subject: question.subject,
    Difficulty: question.difficulty,
    Type: question.type,
    Year: question.year ?? "",
    Source: question.source ?? "",
    Tags: question.tags.join(", "),
  }))

  return Papa.unparse(rows)
}
