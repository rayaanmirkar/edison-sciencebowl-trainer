import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    BIOLOGY: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-200",
    CHEMISTRY: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
    PHYSICS: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
    EARTH_SCIENCE: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
    MATH: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
    ENERGY: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200",
    GENERAL_SCIENCE: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  }
  return colors[subject] ?? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    EASY: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    MEDIUM: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
    HARD: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
  }
  return colors[difficulty] ?? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
}
