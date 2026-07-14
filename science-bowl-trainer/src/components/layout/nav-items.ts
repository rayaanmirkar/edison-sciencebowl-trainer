import {
  BarChart3,
  BrainCircuit,
  FileQuestion,
  Home,
  Swords,
  UserCircle2,
  Users,
} from "lucide-react"

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/practice", label: "Practice", icon: BrainCircuit },
  { href: "/match", label: "Match", icon: Swords },
  { href: "/questions", label: "Questions", icon: FileQuestion },
  { href: "/team", label: "Team", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: UserCircle2 },
] as const
