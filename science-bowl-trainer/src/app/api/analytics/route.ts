import { NextResponse } from "next/server"
import { getAnalyticsData, getDashboardStats, getMatchHistory, getSubjectAccuracy } from "@/lib/data/analytics"

export async function GET() {
  return NextResponse.json({
    dashboard: getDashboardStats(),
    analytics: getAnalyticsData(),
    subjectAccuracy: getSubjectAccuracy(),
    matches: getMatchHistory(),
  })
}
