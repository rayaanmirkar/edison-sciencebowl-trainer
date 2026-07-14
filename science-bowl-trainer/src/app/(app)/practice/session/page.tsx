import { Suspense } from "react"
import PracticeSessionClient from "@/components/practice/practice-session-client"

export default function PracticeSessionPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-500 dark:text-slate-400">Loading practice session...</div>}>
      <PracticeSessionClient />
    </Suspense>
  )
}
