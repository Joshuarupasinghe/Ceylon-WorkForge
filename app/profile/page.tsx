"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import ProfileForm from "@/components/profile/profile-form"
import JobSeekerForm from "@/components/profile/job-seeker-form"
import EmployerForm from "@/components/profile/employer-form"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading: userLoading } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [specificProfile, setSpecificProfile] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("general")
  const { toast } = useToast()

  useEffect(() => {
    // Redirect if not logged in
    if (!userLoading && !user) {
      router.push("/login")
      return
    }

    const fetchProfile = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        // Get profile from localStorage or create a new one
        const storedProfiles = JSON.parse(localStorage.getItem("profiles") || "[]")
        let userProfile = storedProfiles.find((p: any) => p.id === user.id)

        if (!userProfile) {
          // Create a new profile
          userProfile = {
            id: user.id,
            name: user.name || "",
            email: user.email || "",
            bio: "Tell us about yourself...",
            location: "",
            phone: "",
            website: "",
            avatar_url: "",
            user_type: user.userType || "seeker",
          }

          // Save to localStorage
          storedProfiles.push(userProfile)
          localStorage.setItem("profiles", JSON.stringify(storedProfiles))
        }

        setProfile(userProfile)

        // Get specific profile based on user type
        const storedSpecificProfiles = JSON.parse(
          localStorage.getItem(user.userType === "seeker" ? "seekerProfiles" : "employerProfiles") || "[]",
        )
        let userSpecificProfile = storedSpecificProfiles.find((p: any) => p.id === user.id)

        if (!userSpecificProfile) {
          // Create a new specific profile
          if (user.userType === "seeker") {
            userSpecificProfile = {
              id: user.id,
              title: "",
              experience: "",
              education: "",
              skills: [],
              availability: "",
              salary_expectation: "",
            }
          } else {
            userSpecificProfile = {
              id: user.id,
              company_name: user.name ? `${user.name}'s Company` : "Company Name",
              company_size: "",
              industry: "",
              company_description: "",
              company_website: "",
              company_logo_url: "",
            }
          }

          // Save to localStorage
          storedSpecificProfiles.push(userSpecificProfile)
          localStorage.setItem(
            user.userType === "seeker" ? "seekerProfiles" : "employerProfiles",
            JSON.stringify(storedSpecificProfiles),
          )
        }

        setSpecificProfile(userSpecificProfile)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user, userLoading, router, toast])

  const handleProfileUpdate = async (updatedData: any) => {
    if (!user || !profile) return

    try {
      // Update profile in localStorage
      const storedProfiles = JSON.parse(localStorage.getItem("profiles") || "[]")
      const updatedProfiles = storedProfiles.map((p: any) => (p.id === user.id ? { ...p, ...updatedData } : p))
      localStorage.setItem("profiles", JSON.stringify(updatedProfiles))

      // Update local state
      setProfile({ ...profile, ...updatedData })

      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSpecificProfileUpdate = async (updatedData: any) => {
    if (!user || !profile) return

    try {
      // Get the correct storage key based on user type
      const storageKey = user.userType === "seeker" ? "seekerProfiles" : "employerProfiles"

      // Update specific profile in localStorage
      const storedProfiles = JSON.parse(localStorage.getItem(storageKey) || "[]")

      if (!specificProfile) {
        // Create new specific profile if it doesn't exist
        const newSpecificProfile = {
          id: user.id,
          ...updatedData,
        }
        storedProfiles.push(newSpecificProfile)
        setSpecificProfile(newSpecificProfile)
      } else {
        // Update existing specific profile
        const updatedProfiles = storedProfiles.map((p: any) => (p.id === user.id ? { ...p, ...updatedData } : p))
        localStorage.setItem(storageKey, JSON.stringify(updatedProfiles))
        setSpecificProfile({ ...specificProfile, ...updatedData })
      }

      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating specific profile:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (userLoading || (isLoading && !profile)) {
    return (
      <div className="container flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primaryDark mb-2">Your Profile</h1>
        <p className="text-muted-foreground mb-8">Manage your personal information and preferences</p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="specific">
              {user?.userType === "seeker" ? "Professional Details" : "Company Details"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Update your basic profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm profile={profile} onUpdate={handleProfileUpdate} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specific">
            <Card>
              <CardHeader>
                <CardTitle>{user?.userType === "seeker" ? "Professional Details" : "Company Details"}</CardTitle>
                <CardDescription>
                  {user?.userType === "seeker"
                    ? "Showcase your skills and experience to potential employers"
                    : "Provide information about your company"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user?.userType === "seeker" ? (
                  <JobSeekerForm profile={specificProfile} onUpdate={handleSpecificProfileUpdate} />
                ) : (
                  <EmployerForm profile={specificProfile} onUpdate={handleSpecificProfileUpdate} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
