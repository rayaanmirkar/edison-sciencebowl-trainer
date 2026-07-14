"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import Header from "@/components/layout/header"
import MobileNav from "@/components/layout/mobile-nav"
import Sidebar from "@/components/layout/sidebar"

export default function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:pl-0">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">{children}</main>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}
