"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, User, Briefcase, AlertCircle, Lock, Users, Star } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

// Import components
import { UsersTab } from "@/components/admin/users-tab"
import { JobsTab } from "@/components/admin/jobs-tab"
import { ReportsTab } from "@/components/admin/reports-tab"
import { JobSeekersTab } from "@/components/admin/job-seekers-tab"
import { FeaturedListingsTab } from "@/components/admin/featured-listings-tab"
import { DashboardStats } from "@/components/admin/dashboard-stats"

// Import mock data
import {
  MOCK_USERS,
  MOCK_JOBS,
  MOCK_REPORTS,
  MOCK_JOB_SEEKERS,
  MOCK_FEATURED_LISTINGS,
  AVAILABLE_JOBS_FOR_FEATURING,
} from "@/data/admin-mock-data"

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState(MOCK_USERS)
  const [jobs, setJobs] = useState(MOCK_JOBS)
  const [reports, setReports] = useState(MOCK_REPORTS)
  const [jobSeekers, setJobSeekers] = useState(MOCK_JOB_SEEKERS)
  const [featuredListings, setFeaturedListings] = useState(MOCK_FEATURED_LISTINGS)
  const [availableJobs, setAvailableJobs] = useState(AVAILABLE_JOBS_FOR_FEATURING)
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingReports: 0,
    activeFeatured: 0,
  })

  useEffect(() => {
    console.log("Admin page mounted")

    // Get user from localStorage
    try {
      const storedUser = localStorage.getItem("user")
      console.log("Stored user:", storedUser)

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        console.log("Parsed user:", parsedUser)
        setUser(parsedUser)

        // Calculate stats
        const activeUsers = MOCK_USERS.filter((user) => user.status === "active").length
        const activeJobs = MOCK_JOBS.filter((job) => job.status === "active").length
        const totalApplications = MOCK_JOBS.reduce((sum, job) => sum + job.applications, 0)
        const pendingReports = MOCK_REPORTS.filter((report) => report.status === "pending").length
        const activeFeatured = MOCK_FEATURED_LISTINGS.filter((listing) => listing.status === "active").length

        setStats({
          totalUsers: MOCK_USERS.length,
          activeUsers,
          totalJobs: MOCK_JOBS.length,
          activeJobs,
          totalApplications,
          pendingReports,
          activeFeatured,
        })
      } else {
        console.log("No user found in localStorage")

        // FOR LOCAL DEVELOPMENT ONLY - Auto-login as admin
        if (process.env.NODE_ENV === "development") {
          console.log("Development environment detected, auto-logging in as admin")
          const adminUser = {
            id: "admin-1",
            name: "Administrator",
            email: "admin@ceylonworkforce.lk",
            role: "admin",
            isPaid: true,
          }
          setUser(adminUser)
          localStorage.setItem("user", JSON.stringify(adminUser))
        }
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error)
    }

    setIsLoading(false)
  }, [])

  const handleApproveUser = (userId) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: "active" } : user)))
  }

  const handleRejectUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const handleApproveJob = (jobId) => {
    setJobs(jobs.map((job) => (job.id === jobId ? { ...job, status: "active" } : job)))
  }

  const handleRejectJob = (jobId) => {
    setJobs(jobs.filter((job) => job.id !== jobId))
  }

  const handleResolveReport = (reportId) => {
    setReports(reports.map((report) => (report.id === reportId ? { ...report, status: "resolved" } : report)))
  }

  const handleApproveJobSeeker = (id) => {
    setJobSeekers(jobSeekers.map((seeker) => (seeker.id === id ? { ...seeker, status: "active" } : seeker)))
  }

  const handleRejectJobSeeker = (id) => {
    setJobSeekers(jobSeekers.filter((seeker) => seeker.id !== id))
  }

  const handleAddFeatured = (jobId, duration) => {
    // Check if this is a new job ID (created directly) or an existing job
    const existingJob = [...jobs, ...availableJobs].find((job) => job.id === jobId)

    if (existingJob) {
      // Handle existing job (original logic)
      const today = new Date()
      const endDate = new Date()
      endDate.setDate(today.getDate() + duration)

      const newListing = {
        id: `featured-${Date.now()}`,
        jobId,
        title: existingJob.title,
        company: existingJob.company,
        location: existingJob.location,
        jobType: existingJob.jobType || "Full-time",
        description: existingJob.description || "No description provided",
        skills: existingJob.skills || [],
        featuredFrom: today,
        featuredUntil: endDate,
        status: "active" as const,
        views: 0,
        clicks: 0,
      }

      setFeaturedListings([...featuredListings, newListing])

      // Remove the job from available jobs
      setAvailableJobs(availableJobs.filter((job) => job.id !== jobId))
    } else {
      // This is a new job created directly as a featured listing
      // The jobId is actually the job details object in this case
      const jobDetails = jobId

      // Generate a unique ID for the new job
      const newJobId = `job-${Date.now()}`

      // Create a new job
      const newJob = {
        id: newJobId,
        title: jobDetails.title,
        company: jobDetails.company,
        location: jobDetails.location,
        status: "active",
        applications: 0,
        postedAt: format(new Date(), "yyyy-MM-dd"),
      }

      // Add the new job to the jobs list
      setJobs([...jobs, newJob])

      // Create a new featured listing
      const today = new Date()
      const endDate = new Date()
      endDate.setDate(today.getDate() + duration)

      const newListing = {
        id: `featured-${Date.now()}`,
        jobId: newJobId,
        title: jobDetails.title,
        company: jobDetails.company,
        location: jobDetails.location,
        jobType: jobDetails.jobType,
        description: jobDetails.description,
        skills: jobDetails.skills,
        featuredFrom: today,
        featuredUntil: endDate,
        status: "active" as const,
        views: 0,
        clicks: 0,
      }

      setFeaturedListings([...featuredListings, newListing])
    }

    // Update stats
    setStats({
      ...stats,
      activeFeatured: stats.activeFeatured + 1,
    })
  }

  const handleRemoveFeatured = (id) => {
    // Get the listing before removing it
    const listing = featuredListings.find((listing) => listing.id === id)
    if (!listing) return

    // Remove the listing
    setFeaturedListings(featuredListings.filter((listing) => listing.id !== id))

    // Add the job back to available jobs if it's not already there
    const jobExists = availableJobs.some((job) => job.id === listing.jobId)
    if (!jobExists) {
      const job = jobs.find((job) => job.id === listing.jobId)
      if (job) {
        setAvailableJobs([
          ...availableJobs,
          {
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            jobType: listing.jobType,
            description: listing.description,
            skills: listing.skills,
          },
        ])
      }
    }

    // Update stats
    if (listing.status === "active") {
      setStats({
        ...stats,
        activeFeatured: stats.activeFeatured - 1,
      })
    }
  }

  const handleExtendFeatured = (id, days) => {
    setFeaturedListings(
      featuredListings.map((listing) => {
        if (listing.id === id) {
          const newEndDate = new Date(listing.featuredUntil)
          newEndDate.setDate(newEndDate.getDate() + days)
          return {
            ...listing,
            featuredUntil: newEndDate,
          }
        }
        return listing
      }),
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/admin-login"
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[70vh]">
        <Lock className="h-16 w-16 text-primaryDark mb-4" />
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p className="text-muted-foreground mb-6">You need to log in as an administrator to access this page.</p>
        <Button asChild className="bg-accent hover:bg-accent/90 text-white">
          <Link href="/admin-login">Go to Admin Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primaryDark">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, jobs, and platform activity</p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          Logout from Admin
        </Button>
      </div>

      <DashboardStats
        totalUsers={stats.totalUsers}
        activeUsers={stats.activeUsers}
        totalJobs={stats.totalJobs}
        activeJobs={stats.activeJobs}
        totalApplications={stats.totalApplications}
      />

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="job-seekers" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Job Seekers
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            Jobs
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            Featured Listings
            {stats.activeFeatured > 0 && (
              <Badge variant="default" className="ml-1 bg-accent hover:bg-accent/80">
                {stats.activeFeatured}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" />
            Reports
            {stats.pendingReports > 0 && (
              <Badge variant="destructive" className="ml-1">
                {stats.pendingReports}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTab users={users} onApproveUser={handleApproveUser} onRejectUser={handleRejectUser} />
        </TabsContent>

        <TabsContent value="job-seekers">
          <JobSeekersTab
            jobSeekers={jobSeekers}
            onApproveJobSeeker={handleApproveJobSeeker}
            onRejectJobSeeker={handleRejectJobSeeker}
          />
        </TabsContent>

        <TabsContent value="jobs">
          <JobsTab jobs={jobs} onApproveJob={handleApproveJob} onRejectJob={handleRejectJob} />
        </TabsContent>

        <TabsContent value="featured">
          <FeaturedListingsTab
            featuredListings={featuredListings}
            availableJobs={availableJobs}
            onAddFeatured={handleAddFeatured}
            onRemoveFeatured={handleRemoveFeatured}
            onExtendFeatured={handleExtendFeatured}
          />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsTab reports={reports} onResolveReport={handleResolveReport} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
