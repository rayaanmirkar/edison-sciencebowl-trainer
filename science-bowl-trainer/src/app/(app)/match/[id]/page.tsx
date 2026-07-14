import { Suspense } from "react"
import ActiveMatchClient from "@/components/match/active-match-client"

export default function ActiveMatchPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-500 dark:text-slate-400">Loading match room...</div>}>
      <ActiveMatchClient />
    </Suspense>
  )
}
