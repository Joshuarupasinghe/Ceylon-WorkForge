"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Loader2, Search, MapPin, Briefcase, Filter, Star, Plus } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"

// Mock job seekers data
const MOCK_SEEKERS = [
  {
    id: "1",
    name: "Amal Perera",
    title: "Senior Software Engineer",
    location: "Colombo",
    experience: "7 years",
    availability: "Immediate",
    bio: "Experienced software engineer with a strong background in web development and cloud technologies. Passionate about building scalable and maintainable applications.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
    education: "BSc in Computer Science, University of Colombo",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Priya Jayawardena",
    title: "UX/UI Designer",
    location: "Colombo",
    experience: "5 years",
    availability: "2 weeks",
    bio: "Creative designer with a focus on user-centered design principles. Experienced in creating intuitive and engaging user interfaces for web and mobile applications.",
    skills: ["Figma", "UI Design", "UX Research", "Prototyping", "Adobe Creative Suite"],
    education: "BA in Design, University of Moratuwa",
    rating: 4.5,
  },
  {
    id: "3",
    name: "Malik Fernando",
    title: "Full Stack Developer",
    location: "Kandy",
    experience: "4 years",
    availability: "1 month",
    bio: "Versatile developer comfortable with both frontend and backend technologies. Experienced in building complete web applications from concept to deployment.",
    skills: ["JavaScript", "React", "Python", "Django", "PostgreSQL"],
    education: "BSc in Software Engineering, University of Peradeniya",
    rating: 4.2,
  },
  {
    id: "4",
    name: "Tharushi Silva",
    title: "Data Analyst",
    location: "Colombo",
    experience: "3 years",
    availability: "Immediate",
    bio: "Analytical professional with experience in extracting insights from complex datasets. Skilled in data visualization and statistical analysis.",
    skills: ["SQL", "Python", "Data Visualization", "Statistics", "Excel"],
    education: "MSc in Data Science, University of Colombo",
    rating: 4.6,
  },
  {
    id: "5",
    name: "Dinesh Kumar",
    title: "Mobile App Developer",
    location: "Galle",
    experience: "6 years",
    availability: "2 weeks",
    bio: "Experienced mobile developer with a focus on native Android and iOS applications. Passionate about creating smooth and intuitive mobile experiences.",
    skills: ["Swift", "Kotlin", "React Native", "Firebase", "App Store Optimization"],
    education: "BSc in Information Technology, University of Ruhuna",
    rating: 4.7,
  },
  {
    id: "6",
    name: "Nirmala Bandara",
    title: "Project Manager",
    location: "Colombo",
    experience: "8 years",
    availability: "1 month",
    bio: "Seasoned project manager with experience in leading cross-functional teams. Skilled in agile methodologies and stakeholder management.",
    skills: ["Agile", "Scrum", "JIRA", "Risk Management", "Stakeholder Communication"],
    education: "MBA, University of Colombo",
    rating: 4.9,
  },
]

export default function JobPostersPage() {
  const router = useRouter()
  const { user, isLoading: userLoading } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [seekers, setSeekers] = useState(MOCK_SEEKERS)
  const [selectedSeeker, setSelectedSeeker] = useState<(typeof MOCK_SEEKERS)[0] | null>(null)
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    skills: [] as string[],
  })
  const [showFilters, setShowFilters] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Redirect if not logged in
    if (!userLoading && !user) {
      router.push("/login")
    }
  }, [user, userLoading, router])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSkillToggle = (skill: string) => {
    setFilters((prev) => {
      const skills = [...prev.skills]
      const index = skills.indexOf(skill)

      if (index === -1) {
        skills.push(skill)
      } else {
        skills.splice(index, 1)
      }

      return { ...prev, skills }
    })
  }

  const handlePostJob = () => {
    router.push("/create-job")
  }

  const applyFilters = () => {
    let filteredSeekers = [...MOCK_SEEKERS]

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredSeekers = filteredSeekers.filter(
        (seeker) =>
          seeker.name.toLowerCase().includes(searchTerm) ||
          seeker.title.toLowerCase().includes(searchTerm) ||
          seeker.bio.toLowerCase().includes(searchTerm) ||
          seeker.skills.some((skill) => skill.toLowerCase().includes(searchTerm)),
      )
    }

    if (filters.location) {
      filteredSeekers = filteredSeekers.filter((seeker) =>
        seeker.location.toLowerCase().includes(filters.location.toLowerCase()),
      )
    }

    if (filters.skills.length > 0) {
      filteredSeekers = filteredSeekers.filter((seeker) =>
        filters.skills.some((skill) => seeker.skills.includes(skill)),
      )
    }

    setSeekers(filteredSeekers)
    setShowFilters(false)
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      location: "",
      skills: [],
    })
    setSeekers(MOCK_SEEKERS)
    setShowFilters(false)
  }

  // Get all unique skills from seekers
  const allSkills = Array.from(new Set(MOCK_SEEKERS.flatMap((seeker) => seeker.skills))).sort()

  if (userLoading || (isLoading && !user)) {
    return (
      <div className="container flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primaryDark">Find Talent</h1>
          <p className="text-muted-foreground">Discover skilled professionals for your projects</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Button className="bg-accent hover:bg-accent/90 text-white flex items-center gap-2" onClick={handlePostJob}>
            <Plus className="h-4 w-4" />
            Post Job
          </Button>
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, skills, title..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>

          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Talent</SheetTitle>
                <SheetDescription>Find the perfect candidate for your needs</SheetDescription>
              </SheetHeader>

              <div className="space-y-6 py-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={filters.location} onValueChange={(value) => handleFilterChange("location", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Colombo">Colombo</SelectItem>
                      <SelectItem value="Kandy">Kandy</SelectItem>
                      <SelectItem value="Galle">Galle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {allSkills.map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={skill.replace(/\s+/g, "-").toLowerCase()}
                          checked={filters.skills.includes(skill)}
                          onCheckedChange={() => handleSkillToggle(skill)}
                        />
                        <Label htmlFor={skill.replace(/\s+/g, "-").toLowerCase()}>{skill}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Availability</Label>
                  <div className="space-y-2">
                    {["Immediate", "Within 2 weeks", "1 month or more"].map((availability) => (
                      <div key={availability} className="flex items-center space-x-2">
                        <Checkbox id={availability.replace(/\s+/g, "-").toLowerCase()} />
                        <Label htmlFor={availability.replace(/\s+/g, "-").toLowerCase()}>{availability}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <Button onClick={applyFilters} className="bg-accent hover:bg-accent/90 text-white">
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {seekers.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-lg font-medium mb-2">No candidates found</p>
                  <p className="text-muted-foreground">
                    Try adjusting your search filters or check back later for new talent.
                  </p>
                </div>
              ) : (
                seekers.map((seeker) => (
                  <Card
                    key={seeker.id}
                    className={`hover:shadow-md transition-shadow cursor-pointer ${
                      selectedSeeker?.id === seeker.id ? "border-accent" : ""
                    }`}
                    onClick={() => setSelectedSeeker(seeker)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <Avatar className="h-12 w-12 border">
                            <AvatarFallback className="bg-accent text-white">
                              {seeker.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <h3 className="text-xl font-semibold text-primaryDark mb-1">{seeker.name}</h3>
                            <p className="font-medium text-secondaryDark mb-1">{seeker.title}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-muted-foreground mb-3">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {seeker.location}
                              </div>
                              <div className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-1" />
                                {seeker.experience}
                              </div>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                                {seeker.rating}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{seeker.bio}</p>
                            <div className="flex flex-wrap gap-2">
                              {seeker.skills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                              {seeker.skills.length > 3 && <Badge variant="outline">+{seeker.skills.length - 3}</Badge>}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
                          <Badge variant="outline" className="whitespace-nowrap">
                            {seeker.availability}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            {selectedSeeker ? (
              <div className="sticky top-24">
                <Card>
                  <CardHeader className="text-center">
                    <Avatar className="h-20 w-20 mx-auto border">
                      <AvatarFallback className="bg-accent text-white text-xl">
                        {selectedSeeker.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="mt-2">{selectedSeeker.name}</CardTitle>
                    <CardDescription className="text-base font-medium">{selectedSeeker.title}</CardDescription>
                    <div className="flex items-center justify-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{selectedSeeker.rating}</span>
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
                      <Link href={`/chat/${selectedSeeker.id}`}>Message Candidate</Link>
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

      {/* Mobile seeker details sheet */}
      {selectedSeeker && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="fixed bottom-4 right-4 z-10 bg-accent hover:bg-accent/90 text-white rounded-full shadow-lg lg:hidden"
              size="lg"
            >
              View Details
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md overflow-auto">
            <SheetHeader className="text-center">
              <Avatar className="h-20 w-20 mx-auto border">
                <AvatarFallback className="bg-accent text-white text-xl">
                  {selectedSeeker.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <SheetTitle className="mt-2">{selectedSeeker.name}</SheetTitle>
              <SheetDescription className="text-base font-medium">{selectedSeeker.title}</SheetDescription>
              <div className="flex items-center justify-center gap-1 text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span>{selectedSeeker.rating}</span>
              </div>
            </SheetHeader>

            <div className="space-y-4 py-4">
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

              <div className="flex flex-col gap-2 pt-4">
                <Button className="w-full bg-accent hover:bg-accent/90 text-white">Invite to Interview</Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/chat/${selectedSeeker.id}`}>Message Candidate</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Floating action button for mobile */}
      <Button
        className="fixed bottom-20 right-4 z-10 bg-accent hover:bg-accent/90 text-white rounded-full shadow-lg md:hidden"
        size="lg"
        onClick={handlePostJob}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
