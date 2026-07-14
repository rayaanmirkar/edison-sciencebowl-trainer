"use client"

import { useMemo } from "react"
import { Activity, Clock3, Flame, Target } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getDashboardStats, getRecentSessions, getSubjectAccuracy } from "@/lib/data/analytics"
import { getAnnouncements, getPractices } from "@/lib/data/teams"
import { getCurrentUser } from "@/lib/data/users"
import { formatDate, formatRelativeTime, formatTime } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const statCards = [
  { key: "totalQuestions", label: "Questions practiced", icon: Activity, suffix: "" },
  { key: "accuracy", label: "Accuracy", icon: Target, suffix: "%" },
  { key: "streak", label: "Best streak", icon: Flame, suffix: "" },
  { key: "studyTime", label: "Study time", icon: Clock3, suffix: " min" },
] as const

export default function DashboardPage() {
  const user = getCurrentUser()
  const stats = getDashboardStats()
  const subjectAccuracy = useMemo(() => getSubjectAccuracy(), [])
  const sessions = useMemo(() => getRecentSessions().slice(0, 4), [])
  const announcements = useMemo(() => getAnnouncements().slice(0, 3), [])
  const upcomingPractices = useMemo(() => getPractices().filter((practice) => practice.scheduledAt > new Date()).slice(0, 3), [])

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-8 text-white shadow-xl shadow-blue-500/20">
        <p className="text-sm font-medium text-blue-100">Welcome back</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{user.name}, let&apos;s sharpen your next Science Bowl run.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
          Your timed sessions are trending up, and the team has three high-priority updates waiting below.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon
          const value = stats[card.key]
          return (
            <Card key={card.label} className="border-blue-100 dark:border-slate-800">
              <CardContent className="flex items-start justify-between p-6">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{card.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
                    {value}
                    {card.suffix ?? ""}
                  </p>
                </div>
                <div className="rounded-2xl bg-blue-100 p-3 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="border-blue-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Subject accuracy</CardTitle>
            <CardDescription>Track how each Science Bowl subject is trending across recent practice.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAccuracy}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="subject" tickFormatter={(value: string) => value.replace("_", " ")} tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value: number) => `${value}%`} />
                <Tooltip />
                <Bar dataKey="accuracy" radius={[8, 8, 0, 0]} fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-blue-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest practice sessions and completion stats.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{session.subject?.replace("_", " ") ?? "Mixed subject"}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {session.mode.toLowerCase()} mode · {session.correctCount}/{session.questionCount} correct
                    </p>
                  </div>
                  <Badge variant="secondary">{formatTime(session.duration)}</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-400">{formatRelativeTime(session.createdAt)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="border-blue-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Coach and captain updates for the active roster.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900 dark:text-white">{announcement.title}</p>
                  <Badge variant="outline">{announcement.author?.name}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{announcement.content}</p>
                <p className="mt-3 text-xs text-slate-400">{formatRelativeTime(announcement.createdAt)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-blue-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Upcoming practices</CardTitle>
            <CardDescription>Team sessions scheduled for the next few days.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingPractices.map((practice) => (
              <div key={practice.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{formatDate(practice.scheduledAt)}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{practice.duration} minute session</p>
                  </div>
                  <Badge variant="secondary">{practice.attendees.length} attending</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{practice.notes}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
