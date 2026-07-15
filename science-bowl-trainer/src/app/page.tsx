import Link from "next/link"
import { Zap, Target, LineChart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
      <main className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {/* Hero Section */}
        <section className="mb-32 grid gap-16 lg:grid-cols-2 lg:gap-24 lg:items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400 tracking-wide uppercase">
                The training platform
              </p>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-slate-950 dark:text-white">
                Designed for Science Bowl teams that win
              </h1>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
              Practice smarter. Run matches like a pro. Track progress across your entire roster. Everything Science Bowl teams actually need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                asChild 
                className="h-11 px-8 bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 font-medium rounded-lg"
              >
                <Link href="/auth/register">Start Training</Link>
              </Button>
              <Button 
                asChild 
                variant="outline"
                className="h-11 px-8 border-slate-300 dark:border-slate-700 rounded-lg font-medium"
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Stats Block */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-3xl font-bold text-slate-950 dark:text-white">2,500+</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Questions curated</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-3xl font-bold text-slate-950 dark:text-white">7</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Core subjects</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-3xl font-bold text-slate-950 dark:text-white">Real-time</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Match scoring</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-3xl font-bold text-slate-950 dark:text-white">Built-in</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Analytics</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mb-32">
          <div className="mb-16">
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400 tracking-wide uppercase mb-4">
              Core capabilities
            </p>
            <h2 className="text-4xl font-bold text-slate-950 dark:text-white">
              Everything you need to prepare
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Feature 1 */}
            <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">Timed Practice</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Realistic drills across any subject. Track accuracy, speed, and progress. Get instant feedback on every answer.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">Match Simulator</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Run full matches with live scoring, buzzer controls, and bonus tracking. Practice like it's tournament day.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                  <LineChart className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">Team Analytics</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                See subject strengths, improvement trends, and team performance. Make data-driven coaching decisions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 dark:text-white">Question Management</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Upload custom questions, organize by subject and difficulty. Build your own question sets or use curated collections.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-32">
          <div className="mb-16">
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400 tracking-wide uppercase mb-4">
              The workflow
            </p>
            <h2 className="text-4xl font-bold text-slate-950 dark:text-white">
              A training loop that works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-bold">
                1
              </div>
              <h3 className="font-bold text-lg text-slate-950 dark:text-white mb-2">
                Choose Your Focus
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Pick subjects, difficulty level, and format. Solo drills or full team matches.
              </p>
            </div>

            <div className="group">
              <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-bold">
                2
              </div>
              <h3 className="font-bold text-lg text-slate-950 dark:text-white mb-2">
                Train & Compete
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Work through questions with immediate feedback. Run timed matches against your team.
              </p>
            </div>

            <div className="group">
              <div className="mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-bold">
                3
              </div>
              <h3 className="font-bold text-lg text-slate-950 dark:text-white mb-2">
                Review & Improve
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Check dashboards, identify weak areas, and adjust your prep strategy accordingly.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-8 bg-slate-950 dark:bg-slate-900 rounded-2xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to train like champions?
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Start practicing today. Build your team's edge. Track every improvement.
          </p>
          <Button 
            asChild
            className="h-11 px-8 bg-white text-slate-950 hover:bg-slate-100 font-medium rounded-lg"
          >
            <Link href="/auth/register">Create Your Account</Link>
          </Button>
        </section>
      </main>
    </div>
  )
}
