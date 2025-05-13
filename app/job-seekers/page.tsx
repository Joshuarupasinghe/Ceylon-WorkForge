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
import { Loader2, Search, MapPin, Briefcase, Clock, Building, Filter, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

function timeAgo(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  const intervals: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ]

  let duration = seconds
  let i = 0

  while (duration >= intervals[i][0] && i < intervals.length - 1) {
    duration /= intervals[i][0]
    i++
  }

  const rounded = Math.floor(duration)
  const unit = intervals[i][1]

  return `${rounded} ${unit}${rounded !== 1 ? "s" : ""} ago`
}

export default function JobSeekersPage() {
  const router = useRouter()
  const { user, isLoading: userLoading } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [jobs, setJobs] = useState<any[]>([])
  const [filteredJobs, setFilteredJobs] = useState<any[]>([])
  const [selectedJob, setSelectedJob] = useState<any | null>(null)
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    jobType: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const snapshot = await getDocs(collection(db, "jobs"))
        const jobList = snapshot.docs.map((doc) => {
          const data = doc.data()
          const createdAt = data.createdAt?.toDate?.() ?? new Date()

          return {
            id: doc.id,
            ...data,
            createdAt,
            postedAt: timeAgo(createdAt),
            applied: false,
          }
        })
        setJobs(jobList)
        setFilteredJobs(jobList)
      } catch (error) {
        toast({
          title: "Error fetching jobs",
          description: "Check your Firebase connection or data structure.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login")
    }
  }, [user, userLoading, router])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    let filtered = [...jobs]

    const searchTerm = filters.search.toLowerCase()

    if (searchTerm) {
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        (Array.isArray(job.skills) && job.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm)))
      )
    }

    if (filters.location && filters.location !== "all") {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.jobType && filters.jobType !== "all") {
      filtered = filtered.filter((job) =>
        job.type.toLowerCase() === filters.jobType.toLowerCase()
      )
    }

    setFilteredJobs(filtered)
    setShowFilters(false)
  }

  const resetFilters = () => {
    setFilters({ search: "", location: "", jobType: "" })
    setFilteredJobs(jobs)
    setShowFilters(false)
  }

  const handleApplyJob = (jobId: string) => {
    setJobs((prevJobs) => prevJobs.map((job) => (job.id === jobId ? { ...job, applied: true } : job)))
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob({ ...selectedJob, applied: true })
    }
    toast({
      title: "Application Submitted!",
      description: "Your job application has been successfully submitted.",
    })
  }

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
          <h1 className="text-3xl font-bold text-primaryDark">Find Jobs</h1>
          <p className="text-muted-foreground">Discover opportunities that match your skills and interests</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs, skills, companies..."
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
                <SheetTitle>Filter Jobs</SheetTitle>
                <SheetDescription>Narrow down your job search with specific criteria</SheetDescription>
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
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select value={filters.jobType} onValueChange={(value) => handleFilterChange("jobType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <div className="space-y-2">
                    {["Entry Level", "Mid Level", "Senior Level"].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox id={level.replace(" ", "-")} />
                        <Label htmlFor={level.replace(" ", "-")}>{level}</Label>
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
              {jobs.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-lg font-medium mb-2">No jobs found</p>
                  <p className="text-muted-foreground">
                    Try adjusting your search filters or check back later for new opportunities.
                  </p>
                </div>
              ) : (
                jobs.map((job) => (
                  <Card
                    key={job.id}
                    className={`hover:shadow-md transition-shadow cursor-pointer ${selectedJob?.id === job.id ? "border-accent" : ""
                      }`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-primaryDark mb-1">{job.title}</h3>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-muted-foreground mb-3">
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-1" />
                              {job.company}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {job.postedAt}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                            {job.skills.length > 3 && <Badge variant="outline">+{job.skills.length - 3}</Badge>}
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
                          <Badge variant="outline" className="whitespace-nowrap">
                            {job.type}
                          </Badge>
                          <div className="text-sm font-medium text-accent whitespace-nowrap">{job.salary}</div>
                          {job.applied && (
                            <Badge className="bg-green-500 text-white whitespace-nowrap">
                              <CheckCircle className="h-3 w-3 mr-1" /> Applied
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            {selectedJob ? (
              <div className="sticky top-24">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedJob.title}</CardTitle>
                    <CardDescription>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {selectedJob.company}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {selectedJob.location}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-1" />
                          {selectedJob.type}
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Salary Range</h4>
                      <p>{selectedJob.salary}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm">{selectedJob.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Requirements</h4>
                      <p className="text-sm">{selectedJob.requirements}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    {selectedJob.applied ? (
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white" disabled>
                        <CheckCircle className="h-4 w-4 mr-2" /> Application Submitted
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-accent hover:bg-accent/90 text-white"
                        onClick={() => handleApplyJob(selectedJob.id)}
                      >
                        Apply Now
                      </Button>
                    )}
                    <Button variant="outline" className="w-full" asChild>
                     <Link href={`/chat/${selectedJob.userId}`}>Message Employer</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Select a job to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Mobile job details sheet */}
      {selectedJob && (
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
            <SheetHeader>
              <SheetTitle>{selectedJob.title}</SheetTitle>
              <SheetDescription>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    {selectedJob.company}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedJob.location}
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {selectedJob.type}
                  </div>
                </div>
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-4 py-4">
              <div>
                <h4 className="font-medium mb-2">Salary Range</h4>
                <p>{selectedJob.salary}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm">{selectedJob.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Requirements</h4>
                <p className="text-sm">{selectedJob.requirements}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                {selectedJob.applied ? (
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" /> Application Submitted
                  </Button>
                ) : (
                  <Button
                    className="w-full bg-accent hover:bg-accent/90 text-white"
                    onClick={() => handleApplyJob(selectedJob.id)}
                  >
                    Apply Now
                  </Button>
                )}
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/chat/${selectedJob.userId}`}>Message Employer</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
