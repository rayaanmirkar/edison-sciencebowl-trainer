export const SUBJECTS = [
  { value: "BIOLOGY", label: "Biology" },
  { value: "CHEMISTRY", label: "Chemistry" },
  { value: "PHYSICS", label: "Physics" },
  { value: "EARTH_SCIENCE", label: "Earth Science" },
  { value: "MATH", label: "Math" },
  { value: "ENERGY", label: "Energy" },
  { value: "GENERAL_SCIENCE", label: "General Science" },
] as const

export const DIFFICULTIES = [
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
] as const

export const QUESTION_TYPES = [
  { value: "TOSS_UP", label: "Toss-Up" },
  { value: "BONUS", label: "Bonus" },
] as const

export const ROLES = [
  { value: "STUDENT", label: "Student" },
  { value: "CAPTAIN", label: "Captain" },
  { value: "COACH", label: "Coach" },
  { value: "ADMIN", label: "Admin" },
] as const

export const PRACTICE_MODES = [
  { value: "TIMED", label: "Timed" },
  { value: "UNTIMED", label: "Untimed" },
] as const

export const TOSS_UP_POINTS = 4
export const BONUS_POINTS = 10
export const WRONG_ANSWER_PENALTY = -4
export const BUZZ_WINDOW_SECONDS = 5
