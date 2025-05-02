"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Briefcase, Building, Calendar, Eye, Filter, MapPin, Search } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

// Mock data for applied jobs
const appliedJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "TechCorp Lanka",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    salary: "$2,500 - $3,500",
    applied: "2 days ago",
    status: "reviewing",
    progress: 40,
    description: "We are looking for a Frontend Developer proficient in React and JavaScript...",
    matchPercentage: 85,
  },
  {
    id: 2,
    title: "UX Designer",
    company: "Creative Solutions",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Remote",
    type: "Contract",
    salary: "$30 - $45 per hour",
    applied: "1 week ago",
    status: "interview",
    progress: 60,
    description: "Seeking a talented UX Designer to create intuitive and engaging user experiences...",
    matchPercentage: 92,
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "Global Tech",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Kandy, Sri Lanka",
    type: "Full-time",
    salary: "$3,000 - $4,500",
    applied: "2 weeks ago",
    status: "rejected",
    progress: 100,
    description: "Looking for a Full Stack Developer with experience in MERN stack...",
    matchPercentage: 78,
  },
  {
    id: 4,
    title: "Product Manager",
    company: "Innovate Lanka",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    salary: "$4,000 - $5,500",
    applied: "3 days ago",
    status: "applied",
    progress: 20,
    description: "Seeking an experienced Product Manager to lead our product development initiatives...",
    matchPercentage: 88,
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "Cloud Solutions",
    logo: "/placeholder.svg?height=40&width=40",
    location: "Remote",
    type: "Full-time",
    salary: "$3,500 - $5,000",
    applied: "5 days ago",
    status: "offer",
    progress: 90,
    description: "Looking for a DevOps Engineer to help us build and maintain our cloud infrastructure...",
    matchPercentage: 95,
  },
]

const statusLabels = {
  applied: { label: "Applied", color: "default" },
  reviewing: { label: "Under Review", color: "default" },
  interview: { label: "Interview", color: "default" },
  offer: { label: "Offer Received", color: "success" },
  rejected: { label: "Not Selected", color: "destructive" },
}

export default function AppliedJobs() {
  const { user } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Redirect if not logged in or not a job seeker
  if (!user) {
    router.push("/login")
    return null
  }

  if (user.role !== "user" || user.userType !== "seeker") {
    router.push("/")
    return null
  }

  const filteredJobs = appliedJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = activeTab === "all" || job.status === activeTab
    return matchesSearch && matchesStatus
  })

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primaryDark mb-2">Applied Jobs</h1>
        <p className="text-muted-foreground">Track your job applications and their current status</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by job title or company..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="gap-2 bg-accent hover:bg-accent/90 text-white" onClick={() => router.push("/job-seekers")}>
            Find More Jobs
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Applications</TabsTrigger>
          <TabsTrigger value="applied">Applied</TabsTrigger>
          <TabsTrigger value="offer">Offers</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {renderJobList(filteredJobs)}
        </TabsContent>
        <TabsContent value="applied" className="space-y-4">
          {renderJobList(filteredJobs)}
        </TabsContent>
        <TabsContent value="offer" className="space-y-4">
          {renderJobList(filteredJobs)}
        </TabsContent>
        <TabsContent value="rejected" className="space-y-4">
          {renderJobList(filteredJobs)}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function renderJobList(jobs) {
  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground mb-4">No applications found matching your criteria</p>
          <Button asChild>
            <a href="/job-seekers">Browse Available Jobs</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return jobs.map((job) => (
    <Card key={job.id} className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
              <img
                src={job.logo || "/placeholder.svg"}
                alt={`${job.company} logo`}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-primaryDark">{job.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Building className="h-3 w-3" />
                {job.company}
              </CardDescription>
            </div>
          </div>
          <Badge variant={job.status === "offer" ? "success" : job.status === "rejected" ? "destructive" : "default"}>
            {statusLabels[job.status]?.label || job.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            {job.type}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Applied {job.applied}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>

        <div className="mb-2 flex justify-between items-center">
          <span className="text-sm font-medium">Application Progress</span>
          <span className="text-sm text-muted-foreground">{job.progress}%</span>
        </div>
        <Progress value={job.progress} className="h-2" />
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between py-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-accent/10 text-accent">
            {job.salary}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {job.matchPercentage}% Match
          </Badge>
        </div>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  ))
}
