import { mockDashboardStats, mockStatistics, mockUsers } from "@/lib/data/mock-data"

export function getUsers() {
  return [...mockUsers]
}

export function getCurrentUser() {
  return mockUsers[0]
}

export function getUserById(id: string) {
  return mockUsers.find((user) => user.id === id) ?? null
}

export function getCurrentUserStatistics() {
  return [...mockStatistics]
}

export function getCurrentDashboardStats() {
  return mockDashboardStats
}
