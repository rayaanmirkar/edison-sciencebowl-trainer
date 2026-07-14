import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "CAPTAIN", "COACH", "ADMIN"]),
})

export const questionSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters"),
  answer: z.string().min(1, "Answer is required"),
  subject: z.enum(["BIOLOGY", "CHEMISTRY", "PHYSICS", "EARTH_SCIENCE", "MATH", "ENERGY", "GENERAL_SCIENCE"]),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  type: z.enum(["TOSS_UP", "BONUS"]),
  year: z.number().int().min(1990).max(2030).optional(),
  source: z.string().optional(),
  tags: z.array(z.string()),
})

export const practiceConfigSchema = z.object({
  subjects: z.array(z.enum(["BIOLOGY", "CHEMISTRY", "PHYSICS", "EARTH_SCIENCE", "MATH", "ENERGY", "GENERAL_SCIENCE"])).min(1, "Select at least one subject"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD", "ALL"]),
  questionCount: z.number().int().min(5).max(100),
  mode: z.enum(["TIMED", "UNTIMED"]),
  timePerQuestion: z.number().int().min(5).max(120),
})

export const teamSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters"),
  school: z.string().min(2, "School name is required"),
  description: z.string().optional(),
})

export const practiceScheduleSchema = z.object({
  scheduledAt: z.string(),
  duration: z.number().int().min(30).max(300),
  notes: z.string().optional(),
})

export const announcementSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
})

export const matchSchema = z.object({
  opponent: z.string().min(2, "Opponent name is required"),
  date: z.string(),
  location: z.string().optional(),
})

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  avatar: z.string().url().optional().or(z.literal("")),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type QuestionInput = z.infer<typeof questionSchema>
export type PracticeConfigInput = z.infer<typeof practiceConfigSchema>
export type TeamInput = z.infer<typeof teamSchema>
export type PracticeScheduleInput = z.infer<typeof practiceScheduleSchema>
export type AnnouncementInput = z.infer<typeof announcementSchema>
export type MatchInput = z.infer<typeof matchSchema>
export type ProfileInput = z.infer<typeof profileSchema>
