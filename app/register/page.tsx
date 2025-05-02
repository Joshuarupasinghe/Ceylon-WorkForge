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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function RegisterPage() {
  const router = useRouter()
  const { user, setUser } = useUser()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.isPaid) {
        router.push("/role-selection")
      } else {
        router.push("/payment")
      }
    }
  }, [user, router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
  
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )
  
      await updateProfile(userCredential.user, { displayName: formData.name })
  
      const newUser = {
        id: userCredential.user.uid,
        name: formData.name,
        email: formData.email,
        role: "user",
        userType: "seeker",
        isPaid: false,
        avatarUrl: null,
      }
  
      setUser(newUser)
      sessionStorage.setItem("justRegistered", "true")
  
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please complete the payment process.",
      })
  
      router.push("/payment")
    } catch (error: any) {
      console.error("Firebase registration error:", error)
      setErrors({ form: error.message || "Registration failed" })
    } finally {
      setIsLoading(false)
    }
  }
  // For demo purposes, create a demo user without actual registration
  const handleDemoRegistration = () => {
    setIsLoading(true)

    try {
      // Create a mock user
      const mockUser = {
        id: `demo-${Date.now()}`,
        name: formData.name || "Demo User",
        email: formData.email || "demo@example.com",
        role: "user" as const,
        userType: "seeker" as const,
        isPaid: false,
      }

      // Store the mock user via context
      setUser(mockUser)

      // Set a flag in sessionStorage to indicate this is a new registration
      sessionStorage.setItem("justRegistered", "true")

      toast({
        title: "Demo Registration successful",
        description: "Your demo account has been created. Please complete the payment process.",
      })

      // After registration, redirect to payment page
      setTimeout(() => {
        router.push("/payment")
      }, 100)
    } catch (error: any) {
      console.error("Demo registration error:", error)
      setErrors({ form: error.message || "Demo registration failed. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primaryDark">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your details to create your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

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
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            {errors.form && <p className="text-sm text-destructive text-center">{errors.form}</p>}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleDemoRegistration}
              disabled={isLoading}
            >
              Use Demo Mode
            </Button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
