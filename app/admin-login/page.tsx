"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Lock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function AdminLoginPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loginSuccess, setLoginSuccess] = useState(false)

  // Check if user is already logged in as admin
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user && user.role === "admin") {
          console.log("User already logged in as admin")
          setLoginSuccess(true)
        }
      }
    } catch (error) {
      console.error("Error checking stored user:", error)
    }
  }, [])

  // Super simple login handler
  function handleLogin(e) {
    e.preventDefault()

    console.log("Login attempt:", { email, password })

    // Set loading state
    setIsLoading(true)

    // Hardcoded check with exact string comparison
    if (email === "admin@ceylonworkforce.lk" && password === "admin123") {
      console.log("Credentials match!")

      // Create admin user
      const adminUser = {
        id: "admin-1",
        name: "Administrator",
        email: "admin@ceylonworkforce.lk",
        role: "admin",
        isPaid: true,
      }

      // Store in localStorage
      localStorage.setItem("user", JSON.stringify(adminUser))

      // Show success message
      toast({
        title: "Success!",
        description: "Logged in as admin",
      })

      // Set login success state
      setLoginSuccess(true)
      setIsLoading(false)
    } else {
      console.log("Credentials don't match!")
      console.log(`Email check: "${email}" === "admin@ceylonworkforce.lk" is ${email === "admin@ceylonworkforce.lk"}`)
      console.log(`Password check: "${password}" === "admin123" is ${password === "admin123"}`)

      setError("Invalid admin credentials")
      setIsLoading(false)
    }
  }

  // Direct navigation to admin dashboard
  function goToAdminDashboard() {
    window.location.href = "/admin"
  }

  // Auto-fill the form for demo purposes
  function fillDemoCredentials() {
    setEmail("admin@ceylonworkforce.lk")
    setPassword("admin123")
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-primaryDark p-3 rounded-full">
              <Lock className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center text-primaryDark">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>

        {loginSuccess ? (
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <h3 className="text-green-800 font-medium text-center">Login Successful!</h3>
              <p className="text-green-700 text-center text-sm mt-1">You are now logged in as an administrator.</p>
            </div>

            <Button
              onClick={goToAdminDashboard}
              className="w-full bg-accent hover:bg-accent/90 text-white flex items-center justify-center"
            >
              Go to Admin Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ceylonworkforce.lk"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>

              {error && <p className="text-sm text-destructive text-center">{error}</p>}

              <div className="text-xs text-muted-foreground">
                <p>For demo purposes:</p>
                <p>Email: admin@ceylonworkforce.lk</p>
                <p>Password: admin123</p>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-xs text-blue-500"
                  onClick={fillDemoCredentials}
                  disabled={isLoading}
                >
                  (Click to auto-fill)
                </Button>
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
                  "Log in to Admin"
                )}
              </Button>

              <div className="text-center text-sm">
                <Link href="/" className="text-accent hover:underline">
                  Return to Home
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
