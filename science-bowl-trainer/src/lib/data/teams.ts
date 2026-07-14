import { mockAnnouncements, mockPractices, mockTeam, mockUsers } from "@/lib/data/mock-data"
import type { Announcement, Practice, Role, Team, User } from "@/lib/types"

const teamState: Team = {
  ...mockTeam,
  members: [...mockTeam.members],
}

const announcementState = [...mockAnnouncements]
const practiceState = [...mockPractices]

export function getTeam() {
  return { ...teamState, members: [...teamState.members] }
}

export function getTeamMembers() {
  return [...teamState.members]
}

export function addTeamMember(member: { name: string; email: string; role: Role }) {
  const user: User = {
    id: `user-${Date.now()}`,
    name: member.name,
    email: member.email,
    role: member.role,
    teamId: teamState.id,
    createdAt: new Date(),
  }
  teamState.members.push(user)
  mockUsers.push(user)
  return user
}

export function getAnnouncements() {
  return [...announcementState].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export function addAnnouncement(input: { title: string; content: string }) {
  const announcement: Announcement = {
    id: `announcement-${Date.now()}`,
    teamId: teamState.id,
    title: input.title,
    content: input.content,
    authorId: mockUsers[3].id,
    author: mockUsers[3],
    createdAt: new Date(),
  }
  announcementState.unshift(announcement)
  return announcement
}

export function getPractices() {
  return [...practiceState].sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
}

export function addPractice(input: { scheduledAt: string; duration: number; notes?: string }) {
  const practice: Practice = {
    id: `practice-${Date.now()}`,
    teamId: teamState.id,
    scheduledAt: new Date(input.scheduledAt),
    duration: input.duration,
    notes: input.notes,
    attendees: teamState.members.map((member) => member.name),
    createdAt: new Date(),
  }
  practiceState.push(practice)
  return practice
}
