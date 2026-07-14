import Link from "next/link"
import { ArrowRight, BarChart3, BrainCircuit, Swords, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    title: "Practice mode",
    description: "Build subject mastery with timed drills, adaptive question pools, and instant answer review.",
    icon: BrainCircuit,
  },
  {
    title: "Team match simulator",
    description: "Run moderator-friendly matches with live scoring, buzzer shortcuts, and bonus tracking.",
    icon: Swords,
  },
  {
    title: "Performance analytics",
    description: "See subject strengths, study streaks, and difficulty trends in one clear dashboard.",
    icon: BarChart3,
  },
]

const steps = [
  "Choose the subjects and pace that match your next tournament goal.",
  "Train through realistic Science Bowl questions with immediate feedback.",
  "Review dashboards and team activity to focus the next session.",
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-slate-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-white">
      <main className="mx-auto flex max-w-7xl flex-col gap-20 px-6 py-10 lg:px-8 lg:py-16">
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300">
              <Trophy className="h-4 w-4" />
              Built for serious Science Bowl preparation
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                Master Science Bowl with Edison Trainer
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Practice faster, coach smarter, and run polished team matches with a complete web app designed for Science Bowl competitors.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-xl px-6">
                <Link href="/auth/register">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-xl px-6">
                <Link href="#how-it-works">Learn More</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-blue-100 bg-white/90 dark:border-slate-800 dark:bg-slate-900/80">
                <CardContent className="p-5">
                  <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300">60+</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Curated mock questions</p>
                </CardContent>
              </Card>
              <Card className="border-blue-100 bg-white/90 dark:border-slate-800 dark:bg-slate-900/80">
                <CardContent className="p-5">
                  <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300">7</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Core Science Bowl subjects</p>
                </CardContent>
              </Card>
              <Card className="border-blue-100 bg-white/90 dark:border-slate-800 dark:bg-slate-900/80">
                <CardContent className="p-5">
                  <p className="text-2xl font-semibold text-blue-700 dark:text-blue-300">1 app</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Practice, team ops, and analytics</p>
                </CardContent>
              </Card>
            </div>
          </div>
          <Card className="overflow-hidden border-blue-100 bg-white/90 shadow-xl shadow-blue-100/50 dark:border-slate-800 dark:bg-slate-900">
            <CardContent className="space-y-6 p-8">
              <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
                <p className="text-sm font-medium text-blue-100">Daily training snapshot</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-3xl font-semibold">81%</p>
                    <p className="text-sm text-blue-100">Timed practice accuracy</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold">142</p>
                    <p className="text-sm text-blue-100">Questions reviewed this week</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Mixed-subject sprint</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">20 questions, timed, medium+</p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                    Ready
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Northview scrimmage prep</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Energy and chemistry bonus review</p>
                  </div>
                  <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-medium text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200">
                    Live
                  </span>
                </div>
                <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                  <p className="font-medium text-slate-900 dark:text-white">Why teams choose Edison Trainer</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Unified question management, team coordination, and analytics built for coaches, captains, and students.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="border-blue-100 bg-white/90 dark:border-slate-800 dark:bg-slate-900">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="pt-4 text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </section>

        <section id="how-it-works" className="grid gap-8 rounded-3xl border border-blue-100 bg-white/90 p-8 dark:border-slate-800 dark:bg-slate-900 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">How it works</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">A full training loop for every practice block</h2>
            <p className="text-slate-600 dark:text-slate-300">
              From solo drills to moderator view matches, Edison Trainer gives every role on your roster the tools to prepare with intention.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={step} className="border-slate-200 dark:border-slate-800">
                <CardContent className="space-y-4 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{step}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
