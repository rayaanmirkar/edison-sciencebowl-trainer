import Papa from "papaparse"
import type { Difficulty, Question, QuestionType, Subject } from "./types"

type CSVRow = Record<string, string | undefined>

function getField(row: CSVRow, ...keys: string[]): string {
  for (const key of keys) {
    const value = row[key] ?? row[key.toLowerCase()] ?? row[key.toUpperCase()]
    if (value && value.trim().length > 0) return value.trim()
  }
  return ""
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
      const question = getField(row, "Question")
      const answer = getField(row, "Answer")
      return question.length > 0 && answer.length > 0
    })
    .map((row) => {
      const rawSubject = getField(row, "Subject", "Category") || "General Science"
      const rawDifficulty = getField(row, "Difficulty") || "Medium"
      const rawType = getField(row, "Type") || "Toss-Up"
      const rawYear = getField(row, "Year")
      const source = getField(row, "Source")

      return {
        question: getField(row, "Question"),
        answer: getField(row, "Answer"),
        subject: normalizeSubject(rawSubject),
        difficulty: normalizeDifficulty(rawDifficulty),
        type: normalizeType(rawType),
        year: rawYear ? Number.parseInt(rawYear, 10) : undefined,
        source: source || undefined,
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
