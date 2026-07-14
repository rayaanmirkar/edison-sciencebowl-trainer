import type { Question, Subject, Difficulty, QuestionType } from "@/lib/types"
import { mockQuestions } from "@/lib/data/mock-data"

export interface QuestionFilters {
  search?: string
  subject?: Subject | "ALL"
  difficulty?: Difficulty | "ALL"
  type?: QuestionType | "ALL"
  page?: number
  pageSize?: number
}

const questionStore = [...mockQuestions]

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

export function listQuestions(filters: QuestionFilters = {}) {
  const filtered = questionStore.filter((question) => {
    const matchesSearch = filters.search
      ? normalizeText(question.question).includes(normalizeText(filters.search)) ||
        normalizeText(question.answer).includes(normalizeText(filters.search))
      : true
    const matchesSubject = filters.subject && filters.subject !== "ALL" ? question.subject === filters.subject : true
    const matchesDifficulty =
      filters.difficulty && filters.difficulty !== "ALL" ? question.difficulty === filters.difficulty : true
    const matchesType = filters.type && filters.type !== "ALL" ? question.type === filters.type : true
    return matchesSearch && matchesSubject && matchesDifficulty && matchesType
  })

  const page = filters.page ?? 1
  const pageSize = filters.pageSize ?? (filtered.length || 1)
  const start = (page - 1) * pageSize

  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
  }
}

export function getAllQuestions() {
  return [...questionStore]
}

export function getQuestionById(id: string) {
  return questionStore.find((question) => question.id === id) ?? null
}

export function createQuestion(input: Omit<Question, "id" | "createdAt">) {
  const question: Question = {
    id: `question-${Date.now()}`,
    createdAt: new Date(),
    ...input,
  }
  questionStore.unshift(question)
  return question
}

export function updateQuestion(id: string, input: Partial<Omit<Question, "id" | "createdAt">>) {
  const index = questionStore.findIndex((question) => question.id === id)
  if (index === -1) {
    return null
  }

  questionStore[index] = {
    ...questionStore[index],
    ...input,
  }

  return questionStore[index]
}

export function deleteQuestion(id: string) {
  const index = questionStore.findIndex((question) => question.id === id)
  if (index === -1) {
    return false
  }
  questionStore.splice(index, 1)
  return true
}

export function importQuestions(questions: Omit<Question, "id" | "createdAt">[]) {
  const created = questions.map((question, index) => ({
    id: `question-import-${Date.now()}-${index}`,
    createdAt: new Date(),
    ...question,
  }))
  questionStore.unshift(...created)
  return created
}

export function getPracticeQuestions(subjects: Subject[], count: number, difficulty?: Difficulty | "ALL") {
  const subjectPool = questionStore.filter((question) => subjects.includes(question.subject))
  const difficultyPool =
    difficulty && difficulty !== "ALL"
      ? subjectPool.filter((question) => question.difficulty === difficulty)
      : subjectPool
  const source = difficultyPool.length >= count ? difficultyPool : subjectPool
  const shuffled = [...source].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
