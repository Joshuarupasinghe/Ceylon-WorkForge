"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import {
  Button
} from "@/components/ui/button"
import {
  Input
} from "@/components/ui/input"
import {
  Badge
} from "@/components/ui/badge"
import {
  Label
} from "@/components/ui/label"
import {
  Checkbox
} from "@/components/ui/checkbox"
import {
  Avatar, AvatarFallback
} from "@/components/ui/avatar"
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger
} from "@/components/ui/sheet"
import { Loader2, Search, MapPin, Briefcase, Filter, Star, Plus } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"
import { useToast } from "@/components/ui/use-toast"

type SeekerProfile = {
  id: string
  title: string
  location?: string
  experience: string
  availability: string
  bio?: string
  skills: string[]
  education: string
  rating?: number
  userInfo?: {
    name?: string
    email?: string
  }
}

export default function JobPostersPage() {
  const router = useRouter()
  const { user, isLoading: userLoading } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [seekers, setSeekers] = useState<SeekerProfile[]>([])
  const [selectedSeeker, setSelectedSeeker] = useState<SeekerProfile | null>(null)
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    skills: [] as string[],
  })
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login")
    }
  }, [user, userLoading, router])

  useEffect(() => {
    const fetchSeekers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "seekerProfiles"))
        const data: SeekerProfile[] = []

        for (const docSnap of querySnapshot.docs) {
          const seeker = docSnap.data() as SeekerProfile
          const id = docSnap.id

          let userInfo = {}
          let profileData = {}

          // Get user basic info from users collection
          try {
            const userRef = doc(db, "users", id)
            const userSnap = await getDoc(userRef)
            if (userSnap.exists()) {
              userInfo = userSnap.data()
            }
          } catch (err) {
            console.warn("Error loading user info:", err)
          }

          // Get profile data (bio and location)
          try {
            const profileRef = doc(db, "profiles", id)
            const profileSnap = await getDoc(profileRef)
            if (profileSnap.exists()) {
              profileData = profileSnap.data()
            }
          } catch (err) {
            console.warn("Error loading profile data:", err)
          }

          data.push({
            ...seeker,
            id,
            bio: (profileData as any)?.bio || seeker.bio,
            location: (profileData as any)?.location || seeker.location,
            rating: Math.random() * 2 + 3, // Simulated rating
            userInfo,
          })
        }

        setSeekers(data)
      } catch (error) {
        console.error("Error fetching seekers:", error)
        toast({
          title: "Error",
          description: "Could not load seeker data.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchSeekers()
  }, [toast])


  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSkillToggle = (skill: string) => {
    setFilters((prev) => {
      const skills = [...prev.skills]
      const index = skills.indexOf(skill)
      index === -1 ? skills.push(skill) : skills.splice(index, 1)
      return { ...prev, skills }
    })
  }

  const applyFilters = () => {
    let filtered = [...seekers]

    if (filters.search) {
      const s = filters.search.toLowerCase()
      filtered = filtered.filter(seeker =>
        seeker.userInfo?.name?.toLowerCase().includes(s) ||
        seeker.title?.toLowerCase().includes(s) ||
        seeker.bio?.toLowerCase().includes(s) ||
        seeker.skills.some(skill => skill.toLowerCase().includes(s))
      )
    }

    if (filters.location) {
      filtered = filtered.filter(seeker =>
        seeker.location?.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.skills.length > 0) {
      filtered = filtered.filter(seeker =>
        filters.skills.some(skill => seeker.skills.includes(skill))
      )
    }

    setSeekers(filtered)
    setShowFilters(false)
  }

  const resetFilters = () => {
    setFilters({ search: "", location: "", skills: [] })
  }

  const allSkills = Array.from(new Set(seekers.flatMap(s => s.skills || [])))

  if (userLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primaryDark">Find Talent</h1>
          <p className="text-muted-foreground">Discover professionals for your projects</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button className="bg-accent text-white" onClick={() => router.push("/create-job")}>
            <Plus className="mr-2 h-4 w-4" /> Post Job
          </Button>
          <Input
            placeholder="Search by name, title, or skills..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
          <Button variant="outline" onClick={() => setShowFilters(true)}>
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        </div>
      </div>

      {seekers.length === 0 ? (
        <div className="p-6 bg-white shadow rounded text-center">
          <p className="text-muted-foreground">No seekers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {seekers.map((seeker) => (
              <Card
                key={seeker.id}
                onClick={() => setSelectedSeeker(seeker)}
                className={`cursor-pointer hover:shadow-md border border-muted rounded-xl transition-shadow relative ${selectedSeeker?.id === seeker.id ? "border-accent" : ""
                  }`}
              >
                <CardContent className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="bg-accent text-white text-lg">
                        {(seeker.userInfo?.name ?? seeker.id)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="text-xl font-semibold text-primaryDark mb-1">
                        {seeker.userInfo?.name ?? seeker.id}
                      </h3>
                      <p className="font-medium text-secondaryDark mb-1">{seeker.title}</p>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-muted-foreground text-sm mb-3">
                        {seeker.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {seeker.location}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {seeker.experience}
                        </div>
                        {seeker.rating && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-500" />
                            {seeker.rating.toFixed(1)}
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {seeker.bio || "No bio"}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {seeker.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                        {seeker.skills.length > 3 && (
                          <Badge variant="outline">+{seeker.skills.length - 3}</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="absolute right-4 top-4">
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      {seeker.availability}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>


          {/* Desktop Right-Side Detail View */}
          <div className="hidden lg:block">
            {selectedSeeker ? (
              <div className="sticky top-24">
                <Card>
                  <CardHeader className="text-center">
                    <Avatar className="h-20 w-20 mx-auto border">
                      <AvatarFallback className="bg-accent text-white text-xl">
                        {(selectedSeeker.userInfo?.name ?? selectedSeeker.id)
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-2">{selectedSeeker.userInfo?.name}</CardTitle>
                    <CardDescription className="text-base font-medium">{selectedSeeker.title}</CardDescription>
                    <div className="flex items-center justify-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{selectedSeeker.rating?.toFixed(1)}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{selectedSeeker.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{selectedSeeker.experience}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">About</h4>
                      <p className="text-sm">{selectedSeeker.bio}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Education</h4>
                      <p className="text-sm">{selectedSeeker.education}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSeeker.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Availability</h4>
                      <Badge variant="outline">{selectedSeeker.availability}</Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-white">Invite to Interview</Button>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={`/chat/${selectedSeeker.id}`}>Message Candidate</a>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Select a candidate to view details</p>
                </CardContent>
              </Card>
            )}
          </div>


        </div>
      )}
    </div>
  )
}
