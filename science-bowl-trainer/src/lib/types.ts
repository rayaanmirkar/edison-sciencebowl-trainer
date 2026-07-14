export type Subject = "BIOLOGY" | "CHEMISTRY" | "PHYSICS" | "EARTH_SCIENCE" | "MATH" | "ENERGY" | "GENERAL_SCIENCE"
export type Difficulty = "EASY" | "MEDIUM" | "HARD"
export type QuestionType = "TOSS_UP" | "BONUS"
export type Role = "STUDENT" | "CAPTAIN" | "COACH" | "ADMIN"
export type PracticeMode = "TIMED" | "UNTIMED"

export interface User {
  id: string
  email: string
  name: string
  role: Role
  avatar?: string
  teamId?: string
  createdAt: Date
}

export interface Team {
  id: string
  name: string
  school: string
  description?: string
  members: User[]
  createdAt: Date
}

export interface Question {
  id: string
  question: string
  answer: string
  subject: Subject
  difficulty: Difficulty
  type: QuestionType
  year?: number
  source?: string
  tags: string[]
  questionSetId?: string
  createdAt: Date
}

export interface QuestionSet {
  id: string
  name: string
  description?: string
  questions: Question[]
  createdAt: Date
}

export interface Practice {
  id: string
  teamId: string
  scheduledAt: Date
  duration: number
  notes?: string
  attendees: string[]
  createdAt: Date
}

export interface Match {
  id: string
  teamId: string
  opponent: string
  date: Date
  location?: string
  score?: { home: number; away: number }
  createdAt: Date
}

export interface Attempt {
  id: string
  userId: string
  questionId: string
  question?: Question
  correct: boolean
  timeSpent: number
  practiceSessionId?: string
  createdAt: Date
}

export interface PracticeSession {
  id: string
  userId: string
  mode: PracticeMode
  subject?: Subject
  difficulty?: Difficulty
  questionCount: number
  correctCount: number
  duration: number
  attempts: Attempt[]
  createdAt: Date
}

export interface Statistic {
  id: string
  userId: string
  subject: Subject
  correct: number
  total: number
  streak: number
  updatedAt: Date
}

export interface Announcement {
  id: string
  teamId: string
  title: string
  content: string
  authorId: string
  author?: User
  createdAt: Date
}

export interface PracticeConfig {
  subjects: Subject[]
  difficulty: Difficulty | "ALL"
  questionCount: number
  mode: PracticeMode
  timePerQuestion: number
}

export interface MatchTeam {
  name: string
  score: number
}

export interface MatchState {
  team1: MatchTeam
  team2: MatchTeam
  currentQuestion: Question | null
  questionIndex: number
  questions: Question[]
  buzzedTeam: 1 | 2 | null
  buzzWindow: boolean
  timeElapsed: number
  log: MatchLogEntry[]
}

export interface MatchLogEntry {
  type: "TOSS_UP_CORRECT" | "TOSS_UP_WRONG" | "BONUS_CORRECT" | "BONUS_WRONG" | "NEXT_QUESTION"
  team?: 1 | 2
  points: number
  question: string
  timestamp: Date
}

export interface DashboardStats {
  totalQuestions: number
  accuracy: number
  streak: number
  studyTime: number
}

export interface SubjectStat {
  subject: Subject
  correct: number
  total: number
  accuracy: number
}

export interface AnalyticsData {
  subjectStats: SubjectStat[]
  dailyProgress: { date: string; correct: number; total: number }[]
  difficultyBreakdown: { difficulty: Difficulty; correct: number; total: number }[]
  bestSubject: Subject | null
  worstSubject: Subject | null
  totalStudyTime: number
  recentSessions: PracticeSession[]
}
