"use client"

import { useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { getCurrentUser } from "@/lib/data/users"
import { type ProfileInput, profileSchema } from "@/lib/validations"
import { toast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export default function ProfilePage() {
  const user = getCurrentUser()
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      avatar: user.avatar ?? "",
    },
  })
  const avatar = useWatch({ control: form.control, name: "avatar" })
  const name = useWatch({ control: form.control, name: "name" })

  const onSubmit = (values: ProfileInput) => {
    window.localStorage.setItem("science-bowl-profile", JSON.stringify(values))
    toast({ title: "Profile saved", description: "Your display information has been updated for this device.", variant: "success" })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Profile</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">Manage the account details shown throughout the Edison Trainer workspace.</p>
      </section>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="border-blue-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Identity</CardTitle>
            <CardDescription>Your roster-visible profile card.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar || undefined} alt={user.name} />
              <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-semibold text-slate-950 dark:text-white">{name || user.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge>{user.role}</Badge>
              <Badge variant="secondary">Edison Varsity</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-100 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Account settings</CardTitle>
            <CardDescription>Update your name, avatar, and display information.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input value={user.email} readOnly />
                </FormItem>
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Input value={user.role} readOnly />
                </FormItem>
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <Input value="Edison Varsity" readOnly />
                </FormItem>
                <FormField control={form.control} name="avatar" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl><Input placeholder="https://images.unsplash.com/..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  Account settings are stored locally in demo mode. Connect Supabase credentials to persist them across devices.
                </div>
                <Button type="submit">Save profile</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
