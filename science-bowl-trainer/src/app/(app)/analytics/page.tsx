"use client"

import { CalendarDays, Clock3, TrendingDown, TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { getAnalyticsData } from "@/lib/data/analytics"
import { formatTime } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
  const analytics = getAnalyticsData()

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-blue-100 dark:border-slate-800">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Best subject</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{analytics.bestSubject?.replace("_", " ")}</p>
            </div>
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </CardContent>
        </Card>
        <Card className="border-blue-100 dark:border-slate-800">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Most challenging</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{analytics.worstSubject?.replace("_", " ")}</p>
            </div>
            <TrendingDown className="h-6 w-6 text-blue-600" />
          </CardContent>
        </Card>
        <Card className="border-blue-100 dark:border-slate-800">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Study time</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{formatTime(analytics.totalStudyTime)}</p>
            </div>
            <Clock3 className="h-6 w-6 text-blue-600" />
          </CardContent>
        </Card>
        <Card className="border-blue-100 dark:border-slate-800">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active streak</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">7 days</p>
            </div>
            <CalendarDays className="h-6 w-6 text-blue-600" />
          </CardContent>
        </Card>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-blue-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Accuracy over time</CardTitle>
            <CardDescription>Daily correct totals compared with total questions attempted.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.dailyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="correct" stroke="#2563eb" strokeWidth={3} />
                <Line type="monotone" dataKey="total" stroke="#06b6d4" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-blue-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Difficulty breakdown</CardTitle>
            <CardDescription>How performance changes as question complexity rises.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.difficultyBreakdown.map((row) => (
              <div key={row.difficulty} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900 dark:text-white">{row.difficulty}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{row.correct}/{row.total}</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.round((row.correct / row.total) * 100)}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="border-blue-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Subject breakdown</CardTitle>
            <CardDescription>Compare accuracy and total volume by subject.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.subjectStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="subject" tickFormatter={(value: string) => value.replace("_", " ")} tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="correct" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="total" fill="#93c5fd" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="border-blue-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Study streak calendar</CardTitle>
            <CardDescription>Recent daily practice consistency.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-7 gap-3">
              {analytics.dailyProgress.map((day) => {
                const ratio = day.correct / day.total
                return (
                  <div key={day.date} className="rounded-2xl border border-slate-200 p-4 text-center dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{day.date}</p>
                    <div className={`mx-auto mt-3 h-10 w-10 rounded-full ${ratio > 0.8 ? "bg-blue-600" : ratio > 0.7 ? "bg-blue-400" : "bg-slate-300 dark:bg-slate-700"}`} />
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{day.correct}/{day.total}</p>
                  </div>
                )
              })}
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
              Darker blue days mark stronger accuracy. Use the pattern to plan rest, review, and speed sessions around tournament weeks.
            </div>
          </CardContent>
        </Card>
      </section>
      <Card className="border-blue-100 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Recent sessions</CardTitle>
          <CardDescription>Quick review of the latest training blocks and outcomes.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {analytics.recentSessions.map((session) => (
            <div key={session.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="font-medium text-slate-900 dark:text-white">{session.subject?.replace("_", " ") ?? "Mixed"}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{session.correctCount}/{session.questionCount} correct · {session.mode.toLowerCase()}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Duration {formatTime(session.duration)}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
