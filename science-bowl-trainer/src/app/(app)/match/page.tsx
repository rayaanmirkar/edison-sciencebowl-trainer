"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { SUBJECTS } from "@/lib/constants"
import { mockQuestionSets } from "@/lib/data/mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const matchSetupSchema = z.object({
  team1: z.string().min(2, "Team 1 name is required"),
  team2: z.string().min(2, "Team 2 name is required"),
  questionSet: z.string().min(1, "Choose a question set"),
  subject: z.string().min(1, "Choose a subject filter"),
})

type MatchSetupInput = z.infer<typeof matchSetupSchema>

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
}

export default function MatchPage() {
  const router = useRouter()
  const form = useForm<MatchSetupInput>({
    resolver: zodResolver(matchSetupSchema),
    defaultValues: {
      team1: "Edison Varsity",
      team2: "Northview STEM",
      questionSet: mockQuestionSets[0].id,
      subject: "ALL",
    },
  })

  const onSubmit = (values: MatchSetupInput) => {
    const id = `${slugify(values.team1)}-vs-${slugify(values.team2)}`
    const params = new URLSearchParams(values)
    router.push(`/match/${id}?${params.toString()}`)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Match mode setup</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Configure a moderator view with team names, question source, and subject focus.</p>
      </section>
      <Card className="border-blue-100 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Start a live match</CardTitle>
          <CardDescription>Use keyboard shortcuts J and K for buzzes once the room is running.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 sm:grid-cols-2">
              <FormField control={form.control} name="team1" render={({ field }) => (
                <FormItem>
                  <FormLabel>Team 1</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="team2" render={({ field }) => (
                <FormItem>
                  <FormLabel>Team 2</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="questionSet" render={({ field }) => (
                <FormItem>
                  <FormLabel>Question set</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a question set" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockQuestionSets.map((questionSet) => (
                        <SelectItem key={questionSet.id} value={questionSet.id}>{questionSet.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="subject" render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject filter</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ALL">All subjects</SelectItem>
                      {SUBJECTS.map((subject) => (
                        <SelectItem key={subject.value} value={subject.value}>{subject.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="sm:col-span-2 flex justify-end">
                <Button type="submit" size="lg">Start match</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
