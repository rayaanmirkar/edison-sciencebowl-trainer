import { mockAnalytics, mockDashboardStats, mockMatches, mockPracticeSessions, mockStatistics } from "@/lib/data/mock-data"
import { calculateAccuracy } from "@/lib/utils"

export function getAnalyticsData() {
  return mockAnalytics
}

export function getDashboardStats() {
  return mockDashboardStats
}

export function getRecentSessions() {
  return [...mockPracticeSessions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function getSubjectAccuracy() {
  return mockStatistics.map((stat) => ({
    subject: stat.subject,
    accuracy: calculateAccuracy(stat.correct, stat.total),
    correct: stat.correct,
    total: stat.total,
  }))
}

export function getMatchHistory() {
  return [...mockMatches].sort((a, b) => b.date.getTime() - a.date.getTime())
}
