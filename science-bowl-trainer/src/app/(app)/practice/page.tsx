"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { DIFFICULTIES, PRACTICE_MODES, SUBJECTS } from "@/lib/constants"
import { type PracticeConfigInput, practiceConfigSchema } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function PracticePage() {
  const router = useRouter()
  const form = useForm<PracticeConfigInput>({
    resolver: zodResolver(practiceConfigSchema),
    defaultValues: {
      subjects: ["BIOLOGY", "CHEMISTRY", "PHYSICS"],
      difficulty: "ALL",
      questionCount: 15,
      mode: "TIMED",
      timePerQuestion: 25,
    },
  })

  const watchMode = useWatch({ control: form.control, name: "mode" })
  const watchSubjects = useWatch({ control: form.control, name: "subjects" })

  const onSubmit = (values: PracticeConfigInput) => {
    const params = new URLSearchParams({
      subjects: values.subjects.join(","),
      difficulty: values.difficulty,
      questionCount: String(values.questionCount),
      mode: values.mode,
      timePerQuestion: String(values.timePerQuestion),
    })
    router.push(`/practice/session?${params.toString()}`)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Practice configuration</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Customize the next training block by subject, difficulty, pacing, and timing.</p>
      </section>
      <Card className="border-blue-100 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Build your session</CardTitle>
          <CardDescription>Mix multiple subjects, tune the difficulty curve, and decide how much time you want on each question.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control} name="subjects" render={() => (
                <FormItem>
                  <FormLabel>Subjects</FormLabel>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {SUBJECTS.map((subject) => (
                      <label key={subject.value} className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 text-sm dark:border-slate-700">
                        <Checkbox
                          checked={watchSubjects.includes(subject.value)}
                          onCheckedChange={(checked) => {
                            const current = form.getValues("subjects")
                            form.setValue(
                              "subjects",
                              checked ? [...current, subject.value] : current.filter((value) => value !== subject.value),
                              { shouldValidate: true }
                            )
                          }}
                        />
                        {subject.label}
                      </label>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid gap-6 md:grid-cols-2">
                <FormField control={form.control} name="difficulty" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ALL">All levels</SelectItem>
                        {DIFFICULTIES.map((difficulty) => (
                          <SelectItem key={difficulty.value} value={difficulty.value}>{difficulty.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="questionCount" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question count</FormLabel>
                    <FormControl>
                      <Input type="number" min={5} max={100} value={field.value} onChange={(event) => field.onChange(Number(event.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField control={form.control} name="mode" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode</FormLabel>
                    <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{field.value === "TIMED" ? "Timed practice" : "Untimed practice"}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{field.value === "TIMED" ? PRACTICE_MODES[0].label : PRACTICE_MODES[1].label}</p>
                      </div>
                      <Switch checked={field.value === "TIMED"} onCheckedChange={(checked) => field.onChange(checked ? "TIMED" : "UNTIMED")} />
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="timePerQuestion" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time per question</FormLabel>
                    <FormControl>
                      <Input type="number" min={5} max={120} disabled={watchMode !== "TIMED"} value={field.value} onChange={(event) => field.onChange(Number(event.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="flex justify-end">
                <Button type="submit" size="lg">Start Practice</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
