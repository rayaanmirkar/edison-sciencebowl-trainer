"use client"

import { useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ROLES } from "@/lib/constants"
import { getAnalyticsData } from "@/lib/data/analytics"
import { getCurrentUserStatistics } from "@/lib/data/users"
import { addAnnouncement, addPractice, addTeamMember, getAnnouncements, getPractices, getTeamMembers, getTeam } from "@/lib/data/teams"
import { announcementSchema, practiceScheduleSchema } from "@/lib/validations"
import { formatDate } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

const memberSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  role: z.enum(["STUDENT", "CAPTAIN", "COACH", "ADMIN"]),
})

export default function TeamPage() {
  const [team, setTeam] = useState(getTeam())
  const [members, setMembers] = useState(getTeamMembers())
  const [announcements, setAnnouncements] = useState(getAnnouncements())
  const [practices, setPractices] = useState(getPractices())
  const stats = getCurrentUserStatistics()
  const analytics = getAnalyticsData()

  const memberForm = useForm<z.infer<typeof memberSchema>>({
    resolver: zodResolver(memberSchema),
    defaultValues: { name: "", email: "", role: "STUDENT" },
  })
  const practiceForm = useForm({
    resolver: zodResolver(practiceScheduleSchema),
    defaultValues: { scheduledAt: "", duration: 90, notes: "" },
  })
  const announcementForm = useForm({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: "", content: "" },
  })

  const memberRows = useMemo(() => {
    return members.map((member, index) => ({
      ...member,
      statLine: analytics.subjectStats[index % analytics.subjectStats.length],
    }))
  }, [analytics.subjectStats, members])

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Team management</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Coordinate roster updates, practice schedules, and communication for the Edison Varsity squad.</p>
      </section>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-blue-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle>{team.name}</CardTitle>
            <CardDescription>{team.school}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{team.description}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/20">
                <p className="text-sm text-slate-500 dark:text-slate-400">Roster size</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{members.length}</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/20">
                <p className="text-sm text-slate-500 dark:text-slate-400">Top subject</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{analytics.bestSubject?.replace("_", " ")}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Practice focus this week</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Energy rebound speed and bonus conversion on medium chemistry packets.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-100 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Member roster</CardTitle>
              <CardDescription>Track the active lineup and each member&apos;s current performance snapshot.</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild><Button>Add member</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add team member</DialogTitle>
                  <DialogDescription>Invite another student or coach to the roster.</DialogDescription>
                </DialogHeader>
                <Form {...memberForm}>
                  <form className="space-y-4" onSubmit={memberForm.handleSubmit((values) => {
                    const member = addTeamMember(values)
                    setMembers(getTeamMembers())
                    setTeam(getTeam())
                    memberForm.reset({ name: "", email: "", role: "STUDENT" })
                    toast({ title: "Member added", description: `${member.name} joined the roster.`, variant: "success" })
                  })}>
                    <FormField control={memberForm.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={memberForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={memberForm.control} name="role" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {ROLES.map((role) => <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full">Add to roster</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Stats</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberRows.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium text-slate-900 dark:text-white">{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.statLine.subject.replace("_", " ")} · {member.statLine.accuracy}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-blue-100 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Practice schedule</CardTitle>
              <CardDescription>Upcoming team sessions and training notes.</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild><Button variant="outline">Add practice</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule practice</DialogTitle>
                  <DialogDescription>Create the next team session with timing and focus notes.</DialogDescription>
                </DialogHeader>
                <Form {...practiceForm}>
                  <form className="space-y-4" onSubmit={practiceForm.handleSubmit((values) => {
                    addPractice(values)
                    setPractices(getPractices())
                    practiceForm.reset({ scheduledAt: "", duration: 90, notes: "" })
                    toast({ title: "Practice scheduled", description: "The calendar has been updated.", variant: "success" })
                  })}>
                    <FormField control={practiceForm.control} name="scheduledAt" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date and time</FormLabel>
                        <FormControl><Input type="datetime-local" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={practiceForm.control} name="duration" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl><Input type="number" value={field.value} onChange={(event) => field.onChange(Number(event.target.value))} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={practiceForm.control} name="notes" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl><Textarea {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full">Save practice</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {practices.map((practice) => (
              <div key={practice.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="font-medium text-slate-900 dark:text-white">{formatDate(practice.scheduledAt)}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{practice.duration} minutes · {practice.attendees.length} attendees</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{practice.notes}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-blue-100 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Share tactical updates, deadlines, and travel reminders.</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild><Button variant="outline">Add announcement</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Post announcement</DialogTitle>
                  <DialogDescription>Send a new update to the team feed.</DialogDescription>
                </DialogHeader>
                <Form {...announcementForm}>
                  <form className="space-y-4" onSubmit={announcementForm.handleSubmit((values) => {
                    addAnnouncement(values)
                    setAnnouncements(getAnnouncements())
                    announcementForm.reset({ title: "", content: "" })
                    toast({ title: "Announcement posted", description: "The team feed is live with your update.", variant: "success" })
                  })}>
                    <FormField control={announcementForm.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={announcementForm.control} name="content" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl><Textarea className="min-h-32" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full">Publish announcement</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <p className="font-medium text-slate-900 dark:text-white">{announcement.title}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{announcement.content}</p>
                <p className="mt-3 text-xs text-slate-400">Posted by {announcement.author?.name}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card className="border-blue-100 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Current study snapshot</CardTitle>
          <CardDescription>The latest personal subject totals can help guide the next team packet review.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.slice(0, 4).map((stat) => (
            <div key={stat.id} className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/20">
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.subject.replace("_", " ")}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{stat.correct}/{stat.total}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Current streak {stat.streak}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
