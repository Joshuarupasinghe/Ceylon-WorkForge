"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Loader2, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function RoleSelectionPage() {
  const router = useRouter()
  const { user, isLoading: userLoading, updateUserType } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"seeker" | "poster" | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Redirect if not logged in
    if (!userLoading && !user) {
      router.push("/login")
      return
    }

    // Redirect if admin
    if (user && user.role === "admin") {
      router.push("/admin")
      return
    }

    // We no longer automatically redirect unpaid users to payment
    // They will see the payment prompt in the UI instead
  }, [user, userLoading, router])

  const handleRoleSelect = async (role: "seeker" | "poster") => {
    setSelectedRole(role)
    setIsLoading(true)

    try {
      // Update user type in context (which updates localStorage)
      await updateUserType(role)

      toast({
        title: "Role updated",
        description: `You are now using Ceylon Work Force as a ${role === "seeker" ? "Job Seeker" : "Employer"}.`,
      })

      // Redirect based on selected role
      if (role === "seeker") {
        router.push("/job-seekers")
      } else {
        router.push("/job-posters")
      }
    } catch (error) {
      console.error("Role selection error:", error)
      toast({
        title: "Error",
        description: "Failed to update your role. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Show loading state while checking user status
  if (userLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  // If no user is logged in or user hasn't paid, show loading (will be redirected by useEffect)
  if (!user) {
    return (
      <div className="container flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  // If user hasn't paid, show payment prompt
  if (user && !user.isPaid) {
    return (
      <div className="container max-w-md mx-auto py-12">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-primaryDark">Subscription Required</CardTitle>
            <CardDescription className="text-center">
              Please complete your payment to access all features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="text-center p-4 bg-muted rounded-md">
              <p className="mb-4">
                To use Ceylon Work Force, you need to subscribe to our service. The subscription fee is $10/month.
              </p>
              <Button onClick={() => router.push("/payment")} className="bg-accent hover:bg-accent/90 text-white">
                Go to Payment
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground text-center w-full">
              You will be redirected to our secure payment page.
            </p>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primaryDark">Choose Your Role</CardTitle>
          <CardDescription className="text-center">Select how you want to use Ceylon Work Force today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={selectedRole === "seeker" ? "default" : "outline"}
              className={`h-32 flex flex-col items-center justify-center gap-2 ${
                selectedRole === "seeker" ? "bg-accent hover:bg-accent/90 text-white" : ""
              }`}
              onClick={() => handleRoleSelect("seeker")}
              disabled={isLoading}
            >
              <User className="h-8 w-8" />
              <span className="text-lg font-medium">Find Jobs</span>
            </Button>

            <Button
              variant={selectedRole === "poster" ? "default" : "outline"}
              className={`h-32 flex flex-col items-center justify-center gap-2 ${
                selectedRole === "poster" ? "bg-accent hover:bg-accent/90 text-white" : ""
              }`}
              onClick={() => handleRoleSelect("poster")}
              disabled={isLoading}
            >
              <Briefcase className="h-8 w-8" />
              <span className="text-lg font-medium">Post Jobs</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground text-center w-full">
            You can change your role at any time by returning to this page.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
