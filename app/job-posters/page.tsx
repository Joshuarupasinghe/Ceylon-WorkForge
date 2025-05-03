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
          try {
            const userRef = doc(db, "users", id)
            const userSnap = await getDoc(userRef)
            if (userSnap.exists()) {
              userInfo = userSnap.data()
            }
          } catch (err) {
            console.warn("Error loading user info:", err)
          }

          data.push({
            ...seeker,
            id,
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
                className={`cursor-pointer hover:shadow-md ${
                  selectedSeeker?.id === seeker.id ? "border-accent" : ""
                }`}
              >
                <CardContent className="p-6 flex gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {(seeker.userInfo?.name ?? seeker.id).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{seeker.userInfo?.name ?? seeker.id}</h3>
                    <p className="text-muted-foreground">{seeker.title}</p>
                    <p className="text-muted-foreground">{seeker.experience}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {seeker.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed view */}
          <div className="hidden lg:block">
            {selectedSeeker ? (
              <Card className="sticky top-24">
                <CardHeader className="text-center">
                  <Avatar className="mx-auto h-20 w-20">
                    <AvatarFallback>
                      {(selectedSeeker.userInfo?.name ?? selectedSeeker.id).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="mt-2">{selectedSeeker.userInfo?.name ?? selectedSeeker.id}</CardTitle>
                  <CardDescription>{selectedSeeker.title}</CardDescription>
                  <div className="text-sm mt-1 text-muted-foreground">
                    {selectedSeeker.userInfo?.email || "No email"}
                  </div>
                  <div className="text-yellow-500 flex items-center justify-center mt-2">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{selectedSeeker.rating?.toFixed(1)}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">About</h4>
                    <p className="text-sm">{selectedSeeker.bio || "No bio"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Education</h4>
                    <p className="text-sm">{selectedSeeker.education}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeeker.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Availability</h4>
                    <Badge variant="outline">{selectedSeeker.availability}</Badge>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button className="w-full bg-accent text-white">Invite to Interview</Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/chat/${selectedSeeker.id}`}>Message Candidate</Link>
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Select a seeker to view details
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
