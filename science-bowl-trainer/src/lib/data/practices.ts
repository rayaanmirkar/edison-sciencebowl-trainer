import { mockAttempts, mockPracticeSessions } from "@/lib/data/mock-data"
import type { Attempt, PracticeSession } from "@/lib/types"

const attemptState = [...mockAttempts]
const practiceSessionState = [...mockPracticeSessions]

export function getPracticeSessions() {
  return [...practiceSessionState].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function createPracticeSession(input: Omit<PracticeSession, "id" | "createdAt" | "attempts"> & { attempts?: Attempt[] }) {
  const session: PracticeSession = {
    id: `session-${Date.now()}`,
    createdAt: new Date(),
    attempts: input.attempts ?? [],
    userId: input.userId,
    mode: input.mode,
    subject: input.subject,
    difficulty: input.difficulty,
    questionCount: input.questionCount,
    correctCount: input.correctCount,
    duration: input.duration,
  }
  practiceSessionState.unshift(session)
  return session
}

export function recordAttempt(input: Omit<Attempt, "id" | "createdAt">) {
  const attempt: Attempt = {
    id: `attempt-${Date.now()}`,
    createdAt: new Date(),
    ...input,
  }
  attemptState.unshift(attempt)
  const session = input.practiceSessionId
    ? practiceSessionState.find((practiceSession) => practiceSession.id === input.practiceSessionId)
    : null
  if (session) {
    session.attempts.unshift(attempt)
  }
  return attempt
}

export function getAttempts() {
  return [...attemptState]
}
