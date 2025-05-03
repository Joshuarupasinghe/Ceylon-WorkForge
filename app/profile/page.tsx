"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import ProfileForm from "@/components/profile/profile-form"
import JobSeekerForm from "@/components/profile/job-seeker-form"
import EmployerForm from "@/components/profile/employer-form"
import { useToast } from "@/components/ui/use-toast"

import { db } from "@/lib/firebase"
import {
  doc, getDoc, setDoc, updateDoc,
} from "firebase/firestore"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading: userLoading } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [specificProfile, setSpecificProfile] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("general")
  const { toast } = useToast()

  useEffect(() => {
    // 1) Redirect if not logged in
    if (!userLoading && !user) {
      router.push("/login")
      return
    }

    // 2) Fetch or create profiles in Firestore
    const fetchProfiles = async () => {
      if (!user) return
      setIsLoading(true)

      try {
        // —— General profile ——
        const profileRef = doc(db, "profiles", user.id)
        const profileSnap = await getDoc(profileRef)
        let userProfile = null

        if (!profileSnap.exists()) {
          // Create
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
          await setDoc(profileRef, userProfile)
        } else {
          userProfile = profileSnap.data()
        }

        setProfile(userProfile)

        // —— Specific profile ——
        const coll = user.userType === "seeker" ? "seekerProfiles" : "employerProfiles"
        const specificRef = doc(db, coll, user.id)
        const specificSnap = await getDoc(specificRef)
        let userSpecific = null

        if (!specificSnap.exists()) {
          userSpecific =
            user.userType === "seeker"
              ? {
                  id: user.id,
                  title: "",
                  experience: "",
                  education: "",
                  skills: [] as string[],
                  availability: "",
                  salary_expectation: "",
                }
              : {
                  id: user.id,
                  company_name: user.name ? `${user.name}'s Company` : "Company Name",
                  company_size: "",
                  industry: "",
                  company_description: "",
                  company_website: "",
                  company_logo_url: "",
                }

          await setDoc(specificRef, userSpecific)
        } else {
          userSpecific = specificSnap.data()
        }

        setSpecificProfile(userSpecific)
      } catch (error) {
        console.error("Error loading Firestore profiles:", error)
        toast({
          title: "Error",
          description: "Could not load your profile. Try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfiles()
  }, [user, userLoading, router, toast])

  // 3) Update general profile
  const handleProfileUpdate = async (updatedData: any) => {
    if (!user || !profile) return
    try {
      const profileRef = doc(db, "profiles", user.id)
      await updateDoc(profileRef, updatedData)
      setProfile({ ...profile, ...updatedData })

      toast({
        title: "Profile Updated",
        description: "Your general information was saved.",
      })
    } catch (error) {
      console.error("Error updating general profile:", error)
      toast({
        title: "Update Failed",
        description: "Could not save changes. Try again.",
        variant: "destructive",
      })
    }
  }

  // 4) Update seeker/employer details
  const handleSpecificProfileUpdate = async (updatedData: any) => {
    if (!user || !specificProfile) return
    try {
      const coll = user.userType === "seeker" ? "seekerProfiles" : "employerProfiles"
      const specificRef = doc(db, coll, user.id)
      await updateDoc(specificRef, updatedData)
      setSpecificProfile({ ...specificProfile, ...updatedData })

      toast({
        title: "Details Updated",
        description: "Your professional/company details were saved.",
      })
    } catch (error) {
      console.error("Error updating specific profile:", error)
      toast({
        title: "Update Failed",
        description: "Could not save changes. Try again.",
        variant: "destructive",
      })
    }
  }

  // 5) Loading state
  if (userLoading || (isLoading && !profile)) {
    return (
      <div className="container flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  // 6) Render Tabs + Forms
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primaryDark mb-2">Your Profile</h1>
        <p className="text-muted-foreground mb-8">
          Manage your personal information and preferences
        </p>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-8">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="specific">
              {user.userType === "seeker"
                ? "Professional Details"
                : "Company Details"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>
                  Update your basic profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm
                  profile={profile}
                  onUpdate={handleProfileUpdate}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specific">
            <Card>
              <CardHeader>
                <CardTitle>
                  {user.userType === "seeker"
                    ? "Professional Details"
                    : "Company Details"}
                </CardTitle>
                <CardDescription>
                  {user.userType === "seeker"
                    ? "Showcase your skills and experience to potential employers"
                    : "Provide information about your company"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.userType === "seeker" ? (
                  <JobSeekerForm
                    profile={specificProfile}
                    onUpdate={handleSpecificProfileUpdate}
                  />
                ) : (
                  <EmployerForm
                    profile={specificProfile}
                    onUpdate={handleSpecificProfileUpdate}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
