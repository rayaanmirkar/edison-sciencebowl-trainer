"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { createClient } from "@/lib/supabase/client"
import { type LoginInput, loginSchema } from "@/lib/validations"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const isDemoMode = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder")

export default function LoginPage() {
  const router = useRouter()
  const [rememberMe, setRememberMe] = useState(true)
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "alex.chen@edisonacademy.org",
      password: "sciencebowl",
    },
  })

  const onSubmit = async (values: LoginInput) => {
    try {
      if (!isDemoMode) {
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        })
        if (error) {
          throw error
        }
      }

      if (rememberMe) {
        window.localStorage.setItem("science-bowl-login", values.email)
      }

      toast({
        title: "Welcome back",
        description: "You are signed in and ready to practice.",
        variant: "success",
      })
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Unable to sign in right now.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-50 px-4 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <Card className="w-full max-w-md border-blue-100 shadow-xl shadow-blue-100/40 dark:border-slate-800 dark:shadow-none">
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl">Sign in to Edison Trainer</CardTitle>
          <CardDescription>Review recent practice, launch new drills, and manage your team workspace.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@school.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Checkbox checked={rememberMe} onCheckedChange={(checked) => setRememberMe(Boolean(checked))} />
                  Remember me
                </label>
                <Link href="/auth/register" className="text-blue-600 hover:underline dark:text-blue-300">
                  Forgot password
                </Link>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            New to the team workspace?{" "}
            <Link href="/auth/register" className="font-medium text-blue-600 hover:underline dark:text-blue-300">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
