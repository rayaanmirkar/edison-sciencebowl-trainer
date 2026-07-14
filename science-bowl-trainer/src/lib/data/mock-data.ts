import { calculateAccuracy } from "@/lib/utils"
import type {
  AnalyticsData,
  Announcement,
  Attempt,
  DashboardStats,
  Match,
  Practice,
  PracticeSession,
  Question,
  Role,
  Statistic,
  Team,
  User,
} from "@/lib/types"

const now = new Date()

function daysAgo(days: number, hour = 18) {
  const date = new Date(now)
  date.setDate(date.getDate() - days)
  date.setHours(hour, 0, 0, 0)
  return date
}

function hoursAgo(hours: number) {
  const date = new Date(now)
  date.setHours(date.getHours() - hours)
  return date
}

const roleAvatarMap: Record<Role, string> = {
  STUDENT: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
  CAPTAIN: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
  COACH: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80",
  ADMIN: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80",
}

export const mockUsers: User[] = [
  {
    id: "user-alex-chen",
    email: "alex.chen@edisonacademy.org",
    name: "Alex Chen",
    role: "STUDENT",
    avatar: roleAvatarMap.STUDENT,
    teamId: "team-edison-varsity",
    createdAt: daysAgo(220),
  },
  {
    id: "user-maya-patel",
    email: "maya.patel@edisonacademy.org",
    name: "Maya Patel",
    role: "CAPTAIN",
    avatar: roleAvatarMap.CAPTAIN,
    teamId: "team-edison-varsity",
    createdAt: daysAgo(310),
  },
  {
    id: "user-jordan-lee",
    email: "jordan.lee@edisonacademy.org",
    name: "Jordan Lee",
    role: "STUDENT",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
    teamId: "team-edison-varsity",
    createdAt: daysAgo(180),
  },
  {
    id: "user-priya-raman",
    email: "priya.raman@edisonacademy.org",
    name: "Priya Raman",
    role: "COACH",
    avatar: roleAvatarMap.COACH,
    teamId: "team-edison-varsity",
    createdAt: daysAgo(540),
  },
  {
    id: "user-sofia-martinez",
    email: "sofia.martinez@edisonacademy.org",
    name: "Sofia Martinez",
    role: "ADMIN",
    avatar: roleAvatarMap.ADMIN,
    teamId: "team-edison-varsity",
    createdAt: daysAgo(720),
  },
]

const questionSeed: Array<Omit<Question, "id" | "createdAt">> = [
  { question: "Which organelle is primarily responsible for ATP production during cellular respiration?", answer: "Mitochondrion", subject: "BIOLOGY", difficulty: "EASY", type: "TOSS_UP", year: 2021, source: "Edison Invitational", tags: ["cell biology", "respiration"], questionSetId: "set-core" },
  { question: "In humans, what blood protein transports oxygen from the lungs to body tissues?", answer: "Hemoglobin", subject: "BIOLOGY", difficulty: "EASY", type: "TOSS_UP", year: 2020, source: "Regional Scrimmage", tags: ["physiology", "blood"], questionSetId: "set-core" },
  { question: "What process do plants use to convert light energy into chemical energy stored in glucose?", answer: "Photosynthesis", subject: "BIOLOGY", difficulty: "EASY", type: "BONUS", year: 2022, source: "State Practice Set", tags: ["plants", "energy"], questionSetId: "set-core" },
  { question: "What polymerase synthesizes mRNA from a DNA template in eukaryotic cells?", answer: "RNA polymerase II", subject: "BIOLOGY", difficulty: "MEDIUM", type: "TOSS_UP", year: 2019, source: "National Qualifier", tags: ["genetics", "transcription"], questionSetId: "set-core" },
  { question: "Which part of the neuron carries electrical impulses away from the cell body?", answer: "Axon", subject: "BIOLOGY", difficulty: "EASY", type: "TOSS_UP", year: 2023, source: "Edison Varsity Bank", tags: ["neuroscience"], questionSetId: "set-core" },
  { question: "What is the name of the enzyme that unwinds the DNA double helix during replication?", answer: "Helicase", subject: "BIOLOGY", difficulty: "MEDIUM", type: "BONUS", year: 2018, source: "Camp Packet", tags: ["molecular biology"], questionSetId: "set-core" },
  { question: "Which ecological relationship describes bees collecting nectar while pollinating flowers?", answer: "Mutualism", subject: "BIOLOGY", difficulty: "MEDIUM", type: "TOSS_UP", year: 2021, source: "Midwest Invitational", tags: ["ecology"], questionSetId: "set-core" },
  { question: "What is the three-dimensional shape of the methane molecule?", answer: "Tetrahedral", subject: "CHEMISTRY", difficulty: "EASY", type: "TOSS_UP", year: 2022, source: "Chem Foundations", tags: ["bonding", "geometry"], questionSetId: "set-core" },
  { question: "What pH value corresponds to a neutral aqueous solution at 25 degrees Celsius?", answer: "7", subject: "CHEMISTRY", difficulty: "EASY", type: "BONUS", year: 2020, source: "Intro Chemistry Set", tags: ["acids and bases"], questionSetId: "set-core" },
  { question: "What is the oxidation state of sulfur in sulfate, SO4 2-?", answer: "+6", subject: "CHEMISTRY", difficulty: "MEDIUM", type: "TOSS_UP", year: 2019, source: "National Prep", tags: ["redox"], questionSetId: "set-core" },
  { question: "Avogadro's number gives the number of particles in what quantity of substance?", answer: "One mole", subject: "CHEMISTRY", difficulty: "EASY", type: "TOSS_UP", year: 2023, source: "Practice League", tags: ["moles"], questionSetId: "set-core" },
  { question: "Which gas law states that pressure is inversely proportional to volume at constant temperature?", answer: "Boyle's law", subject: "CHEMISTRY", difficulty: "MEDIUM", type: "BONUS", year: 2018, source: "Team Workbook", tags: ["gases"], questionSetId: "set-core" },
  { question: "What intermolecular force is primarily responsible for the high boiling point of water?", answer: "Hydrogen bonding", subject: "CHEMISTRY", difficulty: "MEDIUM", type: "TOSS_UP", year: 2021, source: "Varsity Challenge", tags: ["intermolecular forces"], questionSetId: "set-core" },
  { question: "What is the common name for sodium chloride?", answer: "Table salt", subject: "CHEMISTRY", difficulty: "EASY", type: "TOSS_UP", year: 2017, source: "Foundation Round", tags: ["ionic compounds"], questionSetId: "set-core" },
  { question: "What is the SI unit of force?", answer: "Newton", subject: "PHYSICS", difficulty: "EASY", type: "TOSS_UP", year: 2022, source: "Motion Packet", tags: ["mechanics"], questionSetId: "set-core" },
  { question: "According to Newton's second law, force equals mass multiplied by what quantity?", answer: "Acceleration", subject: "PHYSICS", difficulty: "EASY", type: "BONUS", year: 2020, source: "Kinematics Review", tags: ["laws of motion"], questionSetId: "set-core" },
  { question: "What phenomenon causes a stretched spring to return toward equilibrium with a restoring force proportional to displacement?", answer: "Hooke's law", subject: "PHYSICS", difficulty: "MEDIUM", type: "TOSS_UP", year: 2019, source: "Mechanics Match", tags: ["springs"], questionSetId: "set-core" },
  { question: "Which fundamental particle carries a negative electric charge in an atom?", answer: "Electron", subject: "PHYSICS", difficulty: "EASY", type: "TOSS_UP", year: 2023, source: "Freshman Circuit Set", tags: ["atomic physics"], questionSetId: "set-core" },
  { question: "What is the name of the electromagnetic radiation with wavelengths longer than visible red light but shorter than microwaves?", answer: "Infrared", subject: "PHYSICS", difficulty: "MEDIUM", type: "BONUS", year: 2018, source: "Wave Review", tags: ["electromagnetic spectrum"], questionSetId: "set-core" },
  { question: "What quantity remains constant in a closed system according to the first law of thermodynamics?", answer: "Energy", subject: "PHYSICS", difficulty: "MEDIUM", type: "TOSS_UP", year: 2021, source: "Thermo Drill", tags: ["thermodynamics"], questionSetId: "set-core" },
  { question: "Which optical phenomenon explains why white light separates into colors when passing through a prism?", answer: "Dispersion", subject: "PHYSICS", difficulty: "MEDIUM", type: "TOSS_UP", year: 2017, source: "Optics Workshop", tags: ["light"], questionSetId: "set-core" },
  { question: "What is the largest planet in the solar system?", answer: "Jupiter", subject: "EARTH_SCIENCE", difficulty: "EASY", type: "TOSS_UP", year: 2022, source: "Space Basics", tags: ["astronomy"], questionSetId: "set-core" },
  { question: "What type of rock forms when magma cools and solidifies?", answer: "Igneous rock", subject: "EARTH_SCIENCE", difficulty: "EASY", type: "BONUS", year: 2020, source: "Geology Starter", tags: ["rocks"], questionSetId: "set-core" },
  { question: "What is the boundary called where one tectonic plate slides past another?", answer: "Transform boundary", subject: "EARTH_SCIENCE", difficulty: "MEDIUM", type: "TOSS_UP", year: 2019, source: "Plate Tectonics Set", tags: ["geology"], questionSetId: "set-core" },
  { question: "Which atmospheric layer contains most weather phenomena and clouds?", answer: "Troposphere", subject: "EARTH_SCIENCE", difficulty: "EASY", type: "TOSS_UP", year: 2023, source: "Climate Review", tags: ["atmosphere"], questionSetId: "set-core" },
  { question: "What mineral scale ranks hardness from talc to diamond?", answer: "Mohs scale", subject: "EARTH_SCIENCE", difficulty: "MEDIUM", type: "BONUS", year: 2021, source: "Mineralogy Drill", tags: ["minerals"], questionSetId: "set-core" },
  { question: "What process drives the global water cycle by changing liquid water into water vapor?", answer: "Evaporation", subject: "EARTH_SCIENCE", difficulty: "EASY", type: "TOSS_UP", year: 2018, source: "Earth Systems", tags: ["hydrology"], questionSetId: "set-core" },
  { question: "What is the imaginary line around Earth equidistant from the poles?", answer: "Equator", subject: "EARTH_SCIENCE", difficulty: "EASY", type: "TOSS_UP", year: 2017, source: "Geography Basics", tags: ["earth geometry"], questionSetId: "set-core" },
  { question: "What is the derivative of x squared with respect to x?", answer: "2x", subject: "MATH", difficulty: "MEDIUM", type: "TOSS_UP", year: 2022, source: "Calculus Core", tags: ["calculus"], questionSetId: "set-core" },
  { question: "What is the value of pi rounded to two decimal places?", answer: "3.14", subject: "MATH", difficulty: "EASY", type: "BONUS", year: 2020, source: "Warmup Packet", tags: ["constants"], questionSetId: "set-core" },
  { question: "What theorem states that a squared plus b squared equals c squared in a right triangle?", answer: "Pythagorean theorem", subject: "MATH", difficulty: "EASY", type: "TOSS_UP", year: 2019, source: "Geometry Review", tags: ["geometry"], questionSetId: "set-core" },
  { question: "What is the sum of the interior angles of a triangle in Euclidean geometry?", answer: "180 degrees", subject: "MATH", difficulty: "EASY", type: "TOSS_UP", year: 2023, source: "Geometry Sprint", tags: ["angles"], questionSetId: "set-core" },
  { question: "What is the slope of a horizontal line on the coordinate plane?", answer: "0", subject: "MATH", difficulty: "EASY", type: "BONUS", year: 2021, source: "Algebra Skills", tags: ["graphs"], questionSetId: "set-core" },
  { question: "If f(x) = 3x + 2, what is f(4)?", answer: "14", subject: "MATH", difficulty: "EASY", type: "TOSS_UP", year: 2018, source: "Linear Functions", tags: ["algebra"], questionSetId: "set-core" },
  { question: "What is the area formula for a circle in terms of radius r?", answer: "pi r squared", subject: "MATH", difficulty: "MEDIUM", type: "TOSS_UP", year: 2017, source: "Geometry Mastery", tags: ["circles"], questionSetId: "set-core" },
  { question: "What device converts sunlight directly into electricity using the photovoltaic effect?", answer: "Solar cell", subject: "ENERGY", difficulty: "EASY", type: "TOSS_UP", year: 2022, source: "Energy Essentials", tags: ["solar"], questionSetId: "set-core" },
  { question: "What type of power plant uses fission of uranium atoms to generate heat for electricity production?", answer: "Nuclear power plant", subject: "ENERGY", difficulty: "EASY", type: "BONUS", year: 2020, source: "Power Systems", tags: ["nuclear"], questionSetId: "set-core" },
  { question: "What fuel is produced when natural gas is reformed with steam and carbon monoxide is shifted with water?", answer: "Hydrogen", subject: "ENERGY", difficulty: "HARD", type: "TOSS_UP", year: 2019, source: "Advanced Energy", tags: ["fuel production"], questionSetId: "set-core" },
  { question: "What does LED stand for in efficient lighting technology?", answer: "Light-emitting diode", subject: "ENERGY", difficulty: "MEDIUM", type: "TOSS_UP", year: 2023, source: "Efficiency Round", tags: ["lighting"], questionSetId: "set-core" },
  { question: "Which renewable energy source harnesses moving air to spin turbines?", answer: "Wind energy", subject: "ENERGY", difficulty: "EASY", type: "BONUS", year: 2021, source: "Renewables Review", tags: ["wind"], questionSetId: "set-core" },
  { question: "What unit is commonly used on electric bills to measure energy consumption in homes?", answer: "Kilowatt-hour", subject: "ENERGY", difficulty: "MEDIUM", type: "TOSS_UP", year: 2018, source: "Residential Energy", tags: ["electricity"], questionSetId: "set-core" },
  { question: "What process stores excess grid electricity by pumping water uphill for later turbine generation?", answer: "Pumped-storage hydroelectricity", subject: "ENERGY", difficulty: "HARD", type: "TOSS_UP", year: 2017, source: "Grid Storage", tags: ["storage"], questionSetId: "set-core" },
  { question: "What is the common term for the change of state from solid directly to gas?", answer: "Sublimation", subject: "GENERAL_SCIENCE", difficulty: "EASY", type: "TOSS_UP", year: 2022, source: "General Review", tags: ["states of matter"], questionSetId: "set-core" },
  { question: "What simple machine consists of a rigid bar that pivots around a fulcrum?", answer: "Lever", subject: "GENERAL_SCIENCE", difficulty: "EASY", type: "BONUS", year: 2020, source: "Mechanics Basics", tags: ["simple machines"], questionSetId: "set-core" },
  { question: "What scale measures the strength of tornadoes using estimated wind damage?", answer: "Enhanced Fujita scale", subject: "GENERAL_SCIENCE", difficulty: "MEDIUM", type: "TOSS_UP", year: 2019, source: "Weather Review", tags: ["meteorology"], questionSetId: "set-core" },
  { question: "What particle in the nucleus has no electric charge?", answer: "Neutron", subject: "GENERAL_SCIENCE", difficulty: "EASY", type: "TOSS_UP", year: 2023, source: "Foundation Bank", tags: ["atomic structure"], questionSetId: "set-core" },
  { question: "What branch of science studies fossils and ancient life?", answer: "Paleontology", subject: "GENERAL_SCIENCE", difficulty: "MEDIUM", type: "BONUS", year: 2021, source: "Interdisciplinary Set", tags: ["fossils"], questionSetId: "set-core" },
  { question: "What is the center of an atom called?", answer: "Nucleus", subject: "GENERAL_SCIENCE", difficulty: "EASY", type: "TOSS_UP", year: 2018, source: "Middle Round", tags: ["atoms"], questionSetId: "set-core" },
  { question: "What is the SI base unit for temperature?", answer: "Kelvin", subject: "GENERAL_SCIENCE", difficulty: "MEDIUM", type: "TOSS_UP", year: 2017, source: "Measurement Drill", tags: ["units"], questionSetId: "set-core" },
  { question: "Which vitamin is produced in human skin when it is exposed to sunlight?", answer: "Vitamin D", subject: "BIOLOGY", difficulty: "MEDIUM", type: "TOSS_UP", year: 2024, source: "Summer Camp", tags: ["human biology"], questionSetId: "set-biology-advanced" },
  { question: "What is the pH indicator commonly found in red cabbage extracts?", answer: "Anthocyanin", subject: "CHEMISTRY", difficulty: "HARD", type: "BONUS", year: 2024, source: "Lab Challenge", tags: ["indicators"], questionSetId: "set-chem-advanced" },
  { question: "What phenomenon causes apparent bending of a straw in water?", answer: "Refraction", subject: "PHYSICS", difficulty: "EASY", type: "TOSS_UP", year: 2024, source: "Optics Warmup", tags: ["light"], questionSetId: "set-physics-speed" },
  { question: "What celestial event occurs when the Moon passes directly between Earth and the Sun?", answer: "Solar eclipse", subject: "EARTH_SCIENCE", difficulty: "EASY", type: "BONUS", year: 2024, source: "Astronomy Night", tags: ["moon"], questionSetId: "set-earth-space" },
  { question: "What is the probability of flipping exactly two heads in two fair coin tosses?", answer: "1", subject: "MATH", difficulty: "EASY", type: "TOSS_UP", year: 2024, source: "Quick Math", tags: ["probability"], questionSetId: "set-math-speed" },
  { question: "What network of wires and equipment carries electricity from generators to consumers?", answer: "Electrical grid", subject: "ENERGY", difficulty: "MEDIUM", type: "BONUS", year: 2024, source: "Grid Operations", tags: ["power systems"], questionSetId: "set-energy-grid" },
  { question: "What instrument measures atmospheric pressure?", answer: "Barometer", subject: "GENERAL_SCIENCE", difficulty: "EASY", type: "TOSS_UP", year: 2024, source: "Weather Station", tags: ["weather"], questionSetId: "set-general-mix" },
  { question: "Which blood vessels carry blood away from the heart?", answer: "Arteries", subject: "BIOLOGY", difficulty: "EASY", type: "BONUS", year: 2024, source: "Anatomy Review", tags: ["circulatory system"], questionSetId: "set-biology-advanced" },
  { question: "What law states that matter cannot be created or destroyed in a chemical reaction?", answer: "Law of conservation of mass", subject: "CHEMISTRY", difficulty: "EASY", type: "TOSS_UP", year: 2024, source: "Chemical Principles", tags: ["mass"], questionSetId: "set-chem-advanced" },
  { question: "What quantity is equal to momentum divided by velocity for a nonrelativistic object?", answer: "Mass", subject: "PHYSICS", difficulty: "MEDIUM", type: "BONUS", year: 2024, source: "Momentum Review", tags: ["mechanics"], questionSetId: "set-physics-speed" },
  { question: "What process breaks down rocks at Earth's surface without moving the material?", answer: "Weathering", subject: "EARTH_SCIENCE", difficulty: "MEDIUM", type: "TOSS_UP", year: 2024, source: "Surface Processes", tags: ["geology"], questionSetId: "set-earth-space" },
  { question: "What is the next prime number after 11?", answer: "13", subject: "MATH", difficulty: "EASY", type: "BONUS", year: 2024, source: "Number Theory Warmup", tags: ["primes"], questionSetId: "set-math-speed" },
  { question: "What renewable fuel is commonly produced from corn in the United States?", answer: "Ethanol", subject: "ENERGY", difficulty: "MEDIUM", type: "TOSS_UP", year: 2024, source: "Biofuels Packet", tags: ["biofuels"], questionSetId: "set-energy-grid" },
  { question: "What is the process by which liquid water becomes solid ice?", answer: "Freezing", subject: "GENERAL_SCIENCE", difficulty: "EASY", type: "BONUS", year: 2024, source: "Matter Changes", tags: ["phase changes"], questionSetId: "set-general-mix" },
  { question: "Which biomolecule stores hereditary information in most organisms?", answer: "DNA", subject: "BIOLOGY", difficulty: "EASY", type: "TOSS_UP", year: 2024, source: "Genetics Basics", tags: ["genetics"], questionSetId: "set-biology-advanced" },
  { question: "What is the chemical symbol for potassium?", answer: "K", subject: "CHEMISTRY", difficulty: "EASY", type: "BONUS", year: 2024, source: "Periodic Table Relay", tags: ["elements"], questionSetId: "set-chem-advanced" },
  { question: "What is the rate of change of velocity called?", answer: "Acceleration", subject: "PHYSICS", difficulty: "EASY", type: "TOSS_UP", year: 2024, source: "Physics Foundations", tags: ["motion"], questionSetId: "set-physics-speed" },
  { question: "What star is at the center of the solar system?", answer: "The Sun", subject: "EARTH_SCIENCE", difficulty: "EASY", type: "BONUS", year: 2024, source: "Solar System Basics", tags: ["astronomy"], questionSetId: "set-earth-space" },
  { question: "What is 9 multiplied by 8?", answer: "72", subject: "MATH", difficulty: "EASY", type: "TOSS_UP", year: 2024, source: "Fast Facts", tags: ["arithmetic"], questionSetId: "set-math-speed" },
  { question: "What device stores electrical energy in an electric field?", answer: "Capacitor", subject: "ENERGY", difficulty: "HARD", type: "BONUS", year: 2024, source: "Electronics Round", tags: ["circuits"], questionSetId: "set-energy-grid" },
  { question: "What instrument is used to view very small cells and microorganisms?", answer: "Microscope", subject: "GENERAL_SCIENCE", difficulty: "EASY", type: "TOSS_UP", year: 2024, source: "Lab Skills", tags: ["tools"], questionSetId: "set-general-mix" },
]

export const mockQuestions: Question[] = questionSeed.map((question, index) => ({
  id: `question-${index + 1}`,
  createdAt: daysAgo(140 - index),
  ...question,
}))

export const mockTeam: Team = {
  id: "team-edison-varsity",
  name: "Edison Varsity",
  school: "Thomas Edison Academy",
  description: "A nationally competitive Science Bowl team focused on fast recall, disciplined bonus conversion, and steady improvement through analytics.",
  members: mockUsers.filter((user) => user.teamId === "team-edison-varsity"),
  createdAt: daysAgo(730),
}

const attemptSeed = [
  { questionId: "question-1", correct: true, timeSpent: 14 },
  { questionId: "question-3", correct: true, timeSpent: 19 },
  { questionId: "question-9", correct: false, timeSpent: 27 },
  { questionId: "question-15", correct: true, timeSpent: 18 },
  { questionId: "question-18", correct: true, timeSpent: 21 },
  { questionId: "question-23", correct: true, timeSpent: 16 },
  { questionId: "question-29", correct: false, timeSpent: 24 },
  { questionId: "question-35", correct: true, timeSpent: 17 },
  { questionId: "question-41", correct: true, timeSpent: 15 },
  { questionId: "question-47", correct: false, timeSpent: 30 },
  { questionId: "question-52", correct: true, timeSpent: 20 },
  { questionId: "question-58", correct: true, timeSpent: 12 },
]

export const mockAttempts: Attempt[] = attemptSeed.map((attempt, index) => ({
  id: `attempt-${index + 1}`,
  userId: mockUsers[0].id,
  questionId: attempt.questionId,
  question: mockQuestions.find((question) => question.id === attempt.questionId),
  correct: attempt.correct,
  timeSpent: attempt.timeSpent,
  practiceSessionId: index < 4 ? "session-1" : index < 8 ? "session-2" : "session-3",
  createdAt: hoursAgo(48 - index * 3),
}))

export const mockPracticeSessions: PracticeSession[] = [
  {
    id: "session-1",
    userId: mockUsers[0].id,
    mode: "TIMED",
    subject: "BIOLOGY",
    difficulty: "MEDIUM",
    questionCount: 8,
    correctCount: 6,
    duration: 870,
    attempts: mockAttempts.filter((attempt) => attempt.practiceSessionId === "session-1"),
    createdAt: daysAgo(3, 20),
  },
  {
    id: "session-2",
    userId: mockUsers[0].id,
    mode: "UNTIMED",
    subject: "PHYSICS",
    difficulty: "MEDIUM",
    questionCount: 10,
    correctCount: 7,
    duration: 1120,
    attempts: mockAttempts.filter((attempt) => attempt.practiceSessionId === "session-2"),
    createdAt: daysAgo(2, 18),
  },
  {
    id: "session-3",
    userId: mockUsers[0].id,
    mode: "TIMED",
    subject: "MATH",
    difficulty: "EASY",
    questionCount: 12,
    correctCount: 9,
    duration: 760,
    attempts: mockAttempts.filter((attempt) => attempt.practiceSessionId === "session-3"),
    createdAt: daysAgo(1, 19),
  },
]

export const mockStatistics: Statistic[] = [
  { id: "stat-bio", userId: mockUsers[0].id, subject: "BIOLOGY", correct: 34, total: 42, streak: 5, updatedAt: hoursAgo(4) },
  { id: "stat-chem", userId: mockUsers[0].id, subject: "CHEMISTRY", correct: 27, total: 36, streak: 4, updatedAt: hoursAgo(6) },
  { id: "stat-phys", userId: mockUsers[0].id, subject: "PHYSICS", correct: 31, total: 40, streak: 3, updatedAt: hoursAgo(8) },
  { id: "stat-earth", userId: mockUsers[0].id, subject: "EARTH_SCIENCE", correct: 23, total: 31, streak: 2, updatedAt: hoursAgo(10) },
  { id: "stat-math", userId: mockUsers[0].id, subject: "MATH", correct: 38, total: 45, streak: 7, updatedAt: hoursAgo(12) },
  { id: "stat-energy", userId: mockUsers[0].id, subject: "ENERGY", correct: 19, total: 28, streak: 2, updatedAt: hoursAgo(14) },
  { id: "stat-general", userId: mockUsers[0].id, subject: "GENERAL_SCIENCE", correct: 29, total: 37, streak: 4, updatedAt: hoursAgo(16) },
]

export const mockAnnouncements: Announcement[] = [
  {
    id: "announcement-1",
    teamId: mockTeam.id,
    title: "Regional packet review on Thursday",
    content: "Bring your annotated bonus conversions. We will focus on chemistry and energy toss-ups before the scrimmage with Northview.",
    authorId: mockUsers[3].id,
    author: mockUsers[3],
    createdAt: hoursAgo(6),
  },
  {
    id: "announcement-2",
    teamId: mockTeam.id,
    title: "Travel forms due Friday",
    content: "Upload signed travel waivers before 5 PM so the roster can be finalized for the state invitational bus manifest.",
    authorId: mockUsers[4].id,
    author: mockUsers[4],
    createdAt: daysAgo(1, 12),
  },
  {
    id: "announcement-3",
    teamId: mockTeam.id,
    title: "Captain's challenge leaderboard updated",
    content: "Alex now leads the week in timed accuracy, and Maya posted the fastest perfect bonus cycle in yesterday's mixed-subject set.",
    authorId: mockUsers[1].id,
    author: mockUsers[1],
    createdAt: daysAgo(2, 17),
  },
]

export const mockPractices: Practice[] = [
  {
    id: "practice-1",
    teamId: mockTeam.id,
    scheduledAt: daysAgo(-1, 16),
    duration: 90,
    notes: "Full toss-up ladder followed by bonus conversion review.",
    attendees: [mockUsers[0].name, mockUsers[1].name, mockUsers[2].name, mockUsers[3].name],
    createdAt: daysAgo(2, 11),
  },
  {
    id: "practice-2",
    teamId: mockTeam.id,
    scheduledAt: daysAgo(-3, 17),
    duration: 75,
    notes: "Physics lightning round and rebound timing drills.",
    attendees: [mockUsers[0].name, mockUsers[1].name, mockUsers[2].name],
    createdAt: daysAgo(1, 10),
  },
  {
    id: "practice-3",
    teamId: mockTeam.id,
    scheduledAt: daysAgo(-5, 10),
    duration: 120,
    notes: "Saturday invitational simulation with moderator rotation.",
    attendees: [mockUsers[0].name, mockUsers[1].name, mockUsers[2].name, mockUsers[3].name, mockUsers[4].name],
    createdAt: daysAgo(4, 9),
  },
]

export const mockMatches: Match[] = [
  {
    id: "match-1",
    teamId: mockTeam.id,
    opponent: "Northview STEM",
    date: daysAgo(8, 15),
    location: "Northview High School",
    score: { home: 64, away: 52 },
    createdAt: daysAgo(8, 18),
  },
  {
    id: "match-2",
    teamId: mockTeam.id,
    opponent: "Jefferson Prep",
    date: daysAgo(15, 14),
    location: "Edison Academy",
    score: { home: 58, away: 60 },
    createdAt: daysAgo(15, 18),
  },
  {
    id: "match-3",
    teamId: mockTeam.id,
    opponent: "Riverton Science",
    date: daysAgo(22, 16),
    location: "Regional Invitational",
    score: { home: 72, away: 48 },
    createdAt: daysAgo(22, 19),
  },
]

export const mockQuestionSets = [
  { id: "set-core", name: "Core Rotation", description: "Balanced daily practice set built from all varsity subjects." },
  { id: "set-biology-advanced", name: "Biology Advanced", description: "Focused biology progression covering anatomy, genetics, and ecology." },
  { id: "set-chem-advanced", name: "Chemistry Advanced", description: "Challenge set emphasizing stoichiometry, bonding, and lab analysis." },
  { id: "set-physics-speed", name: "Physics Speed Round", description: "Fast mechanics and waves packet for buzzer timing." },
  { id: "set-earth-space", name: "Earth and Space Focus", description: "Geology, climate, and astronomy blend for upcoming invitationals." },
  { id: "set-math-speed", name: "Math Quickfire", description: "Short-form algebra, geometry, and number theory reps." },
  { id: "set-energy-grid", name: "Energy Systems", description: "Electricity, renewables, and grid operations coverage." },
  { id: "set-general-mix", name: "General Science Mix", description: "Cross-disciplinary fundamentals for novice and rebound practice." },
]

export const mockDashboardStats: DashboardStats = {
  totalQuestions: mockStatistics.reduce((sum, stat) => sum + stat.total, 0),
  accuracy: calculateAccuracy(
    mockStatistics.reduce((sum, stat) => sum + stat.correct, 0),
    mockStatistics.reduce((sum, stat) => sum + stat.total, 0)
  ),
  streak: Math.max(...mockStatistics.map((stat) => stat.streak)),
  studyTime: Math.round(mockPracticeSessions.reduce((sum, session) => sum + session.duration, 0) / 60),
}

export const mockAnalytics: AnalyticsData = {
  subjectStats: mockStatistics.map((stat) => ({
    subject: stat.subject,
    correct: stat.correct,
    total: stat.total,
    accuracy: calculateAccuracy(stat.correct, stat.total),
  })),
  dailyProgress: [
    { date: "Mon", correct: 18, total: 24 },
    { date: "Tue", correct: 21, total: 27 },
    { date: "Wed", correct: 17, total: 23 },
    { date: "Thu", correct: 24, total: 29 },
    { date: "Fri", correct: 19, total: 25 },
    { date: "Sat", correct: 28, total: 34 },
    { date: "Sun", correct: 22, total: 28 },
  ],
  difficultyBreakdown: [
    { difficulty: "EASY", correct: 74, total: 88 },
    { difficulty: "MEDIUM", correct: 89, total: 116 },
    { difficulty: "HARD", correct: 38, total: 55 },
  ],
  bestSubject: "MATH",
  worstSubject: "ENERGY",
  totalStudyTime: mockPracticeSessions.reduce((sum, session) => sum + session.duration, 0),
  recentSessions: mockPracticeSessions,
}
