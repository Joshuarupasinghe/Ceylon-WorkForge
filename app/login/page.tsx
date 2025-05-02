"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { user, login, setUser } = useUser()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        // Always redirect to role selection after login
        router.push("/role-selection")
      }
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password")
      return
    }

    setIsLoading(true)

    try {
      // Try to login with provided credentials
      await login(formData.email, formData.password)

      toast({
        title: "Login successful",
        description: "Welcome back to Ceylon Work Force!",
      })

      // Explicitly redirect to role selection
      router.push("/role-selection")
    } catch (error: any) {
      console.error("Login error:", error)
      setError(error.message || "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  // For demo purposes only - this creates a demo user
  const handleDemoLogin = async () => {
    if (!formData.email) {
      setError("Please enter your email address")
      return
    }

    setIsLoading(true)

    try {
      // For demo purposes, we'll create a mock user
      const mockUser = {
        id: `demo-${Date.now()}`,
        name: formData.email.split("@")[0],
        email: formData.email,
        role: "user" as const,
        userType: "seeker" as const,
        isPaid: false,
      }

      // Store the demo user via the context
      setUser(mockUser)

      toast({
        title: "Demo login successful",
        description: "Welcome to Ceylon Work Force! (Demo Mode)",
      })

      // Explicitly redirect to role selection
      router.push("/role-selection")
    } catch (error: any) {
      console.error("Demo login error:", error)
      setError(error.message || "Failed to log in with demo mode")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primaryDark">Log in</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-sm text-destructive text-center">
                <p>{error}</p>
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                  >
                    Continue in demo mode
                  </Button>
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              <p>For demo purposes:</p>
              <p>Email: john@example.com</p>
              <p>Password: password123</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </Button>

            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-accent hover:underline">
                Create account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
