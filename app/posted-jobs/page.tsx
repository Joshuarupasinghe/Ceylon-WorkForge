"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Briefcase,
  Calendar,
  Edit,
  Eye,
  Filter,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
  Users,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

// Mock data for posted jobs
const postedJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Ceylon Tech Solutions",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    salary: "$3,000 - $5,000",
    posted: "2 weeks ago",
    applicants: 24,
    status: "active",
    description: "We are looking for an experienced Frontend Developer proficient in React, Next.js, and TypeScript...",
    requirements: [
      "5+ years of experience with modern JavaScript frameworks",
      "Strong knowledge of React and Next.js",
      "Experience with TypeScript and state management libraries",
      "Understanding of responsive design and cross-browser compatibility",
    ],
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "Ceylon Tech Solutions",
    location: "Remote",
    type: "Contract",
    salary: "$2,500 - $4,000",
    posted: "1 month ago",
    applicants: 18,
    status: "active",
    description:
      "We're seeking a talented UX/UI Designer to create beautiful, intuitive interfaces for our products...",
    requirements: [
      "3+ years of experience in UX/UI design",
      "Proficiency with design tools like Figma or Adobe XD",
      "Portfolio demonstrating strong visual design skills",
      "Experience with user research and usability testing",
    ],
  },
  {
    id: 3,
    title: "Backend Developer",
    company: "Ceylon Tech Solutions",
    location: "Kandy, Sri Lanka",
    type: "Full-time",
    salary: "$2,800 - $4,500",
    posted: "3 weeks ago",
    applicants: 12,
    status: "closed",
    description: "Looking for a skilled Backend Developer to build robust server-side applications...",
    requirements: [
      "4+ years of experience in backend development",
      "Proficiency with Node.js, Express, and MongoDB",
      "Experience with RESTful API design",
      "Knowledge of authentication and authorization mechanisms",
    ],
  },
]

export default function PostedJobs() {
  const { user } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")

  // Redirect if not logged in or not an employer
  if (!user) {
    router.push("/login")
    return null
  }

  if (user.role !== "user" || user.userType !== "poster") {
    router.push("/")
    return null
  }

  const filteredJobs = postedJobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = activeTab === "all" || job.status === activeTab
    return matchesSearch && matchesStatus
  })

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primaryDark mb-2">Posted Jobs</h1>
        <p className="text-muted-foreground">Manage your job listings and view applicant details</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search jobs..."
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
          <Button className="gap-2 bg-accent hover:bg-accent/90 text-white" onClick={() => router.push("/create-job")}>
            <Plus className="h-4 w-4" />
            Post New Job
          </Button>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
          <TabsTrigger value="all">All Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {renderJobList(filteredJobs, router)}
        </TabsContent>
        <TabsContent value="closed" className="space-y-4">
          {renderJobList(filteredJobs, router)}
        </TabsContent>
        <TabsContent value="all" className="space-y-4">
          {renderJobList(filteredJobs, router)}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function renderJobList(jobs, router) {
  if (jobs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground mb-4">No jobs found matching your criteria</p>
          <Button onClick={() => router.push("/create-job")}>Post a New Job</Button>
        </CardContent>
      </Card>
    )
  }

  return jobs.map((job) => (
    <Card key={job.id} className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-primaryDark">{job.title}</CardTitle>
            <CardDescription className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                {job.type}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Posted {job.posted}
              </span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={job.status === "active" ? "default" : "secondary"}>
              {job.status === "active" ? "Active" : "Closed"}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Job
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Job
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-accent/10 text-accent">
            ${job.salary}
          </Badge>
          {job.requirements.slice(0, 2).map((req, index) => (
            <Badge key={index} variant="outline">
              {req.split(" ").slice(0, 3).join(" ")}...
            </Badge>
          ))}
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between py-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            <span className="font-medium">{job.applicants}</span> applicants
          </span>
        </div>
        <Button variant="outline" size="sm">
          View Applicants
        </Button>
      </CardFooter>
    </Card>
  ))
}
