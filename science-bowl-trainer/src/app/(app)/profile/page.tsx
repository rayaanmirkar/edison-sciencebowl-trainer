"use client"

import { getCurrentUser } from "@/lib/data/users"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const user = getCurrentUser()

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Profile</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Your account information.</p>
      </section>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 flex-shrink-0">
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-3 flex-1">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Name</p>
                <p className="text-lg font-semibold text-slate-950 dark:text-white">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                <p className="text-slate-900 dark:text-slate-100">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <Badge>{user.role}</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Info Message */}
        <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4 text-sm text-slate-600 dark:text-slate-400">
          <p><strong>Note:</strong> Profile updates are synced to Supabase once you connect your credentials in the environment variables.</p>
        </div>
      </div>
    </div>
  )
}
