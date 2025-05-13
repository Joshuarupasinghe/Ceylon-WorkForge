"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  Loader2,
  Lock,
  User,
  Users,
  Briefcase,
  Star,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { UsersTab } from "@/components/admin/users-tab"
import { JobSeekersTab } from "@/components/admin/job-seekers-tab"
import { JobsTab } from "@/components/admin/jobs-tab"
import { FeaturedListingsTab } from "@/components/admin/featured-listings-tab"
import { ReportsTab } from "@/components/admin/reports-tab"

import { db } from "@/lib/firebase"
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc, getDoc } from "firebase/firestore"

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  isPaid?: boolean
}


export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null)
  const [checkedAuth, setCheckedAuth] = useState(false)

  const [users, setUsers] = useState<any[]>([])
  const [jobSeekers, setJobSeekers] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [featuredListings, setFeaturedListings] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
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
    const stored = localStorage.getItem("user")
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.role === "admin") {
        setCurrentAdmin(parsed)
        fetchAll()
      }
    }
    setCheckedAuth(true)
  }, [])

  async function fetchAll() {
    setIsLoading(true)
    try {
      const usersSnap = await getDocs(collection(db, "users"))
      const usersList = usersSnap.docs.map((d) => {
        const data = d.data()
        return {
          id: d.id,
          ...data,
          joinedAt: data.createdAt ? format(new Date(data.createdAt), "PPP") : "N/A",
        }
      })
      setUsers(usersList)

      const seekersSnap = await getDocs(collection(db, "seekerProfiles"))
      const seekersList = seekersSnap.docs.map((d) => {
        const data = d.data()
        const user = usersList.find((u) => u.id === d.id)
        return {
          id: d.id,
          name: user?.name || "Unnamed",
          email: user?.email || "No email",
          createdAt: user?.createdAt || "-",
          skills: data.skills || [],
          experience: data.experience || "",
          education: data.education || "",
          availability: data.availability || "",
          salary_expectation: data.salary_expectation || "",
          status: data.status || "pending",
          applications: data.applications || 0,
          joinedAt: user?.createdAt || "-",
        }
      })
      setJobSeekers(seekersList)

      const jobsSnap = await getDocs(collection(db, "jobs"))
      const jobsList = jobsSnap.docs.map((d) => ({ id: d.id, ...(d.data()) }))
      setJobs(jobsList)

      //Get Featured Listing from DB
      const featuredSnap = await getDocs(collection(db, "featuredListings"))
      const featuredList = featuredSnap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          featuredFrom: data.createdAt?.toDate?.() || new Date(),
          featuredUntil: data.expiresAt?.toDate?.() || new Date(),
        };
      });


      setFeaturedListings(featuredList)
      //Get Reports from firebase
      const reportsSnap = await getDocs(collection(db, "reports"));

      const reportsList = await Promise.all(
        reportsSnap.docs.map(async (d) => {
          const data = d.data();

          // Fetch the user's name based on userId
          let reportedName = "Unknown User";
          if (data.userId) {
            const userDoc = await getDoc(doc(db, "users", data.userId));
            if (userDoc.exists()) {
              reportedName = userDoc.data().name || "Unknown User";
            }
          }

          return {
            id: d.id,
            type: data.type || "unknown",
            reportedId: data.userId || "",
            reportedName, // Set the name fetched from the users collection
            title: data.title || "N/A",
            description: data.description || "No reason provided",
            status: data.status || "pending",
            reportedAt: data.createdAt?.toDate()?.toLocaleDateString() || "N/A",
          };
        })
      );

      setReports(reportsList);

      const activeUsers = usersList.filter((u) => u.status === "active").length
      const activeJobs = jobsList.filter((j) => j.status === "active").length
      const totalApplications = jobsList.reduce((sum, job) => sum + (job.applications || 0), 0)
      const pendingReports = reportsList.filter((r) => r.status === "pending").length
      const activeFeatured = featuredList.filter((f) => f.status === "active").length

      setStats({
        totalUsers: usersList.length,
        activeUsers,
        totalJobs: jobsList.length,
        activeJobs,
        totalApplications,
        pendingReports,
        activeFeatured,
      })
    } catch (e) {
      console.error("Error loading data:", e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveUser = async (id: string) => {
    await updateDoc(doc(db, "users", id), { status: "active" })
    fetchAll()
  }

  const handleRejectUser = async (id: string) => {
    await updateDoc(doc(db, "users", id), { status: "rejected" })
    fetchAll()
  }

  const handleResolveReport = async (id: string) => {
    await updateDoc(doc(db, "reports", id), { status: "resolved" })
    fetchAll()
  }

  const handleRespondToReport = async (id: string, response: string, status: string) => {
    await updateDoc(doc(db, "reports", id), {
      response,
      status,
    })
    fetchAll()
  }


  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/admin-login"
  }

  if (!checkedAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
      </div>
    )
  }

  if (!currentAdmin || currentAdmin.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Lock className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Admin Access Required</h2>
        <Button onClick={handleLogout}>Go to Login</Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
      </div>
    )
  }


  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="bg-gradient-to-tr from-teal-500 to-teal-700 text-white shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white text-lg">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tracking-tight">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-tr from-cyan-500 to-teal-600 text-white shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white text-lg">Total Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tracking-tight">{jobSeekers.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-white text-lg">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold tracking-tight">{jobs.length}</p>
          </CardContent>
        </Card>
      </div>

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
              <Badge variant="default" className="ml-1 bg-teal-500 text-white">
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
            onApproveJobSeeker={async (id) => {
              await updateDoc(doc(db, "seekerProfiles", id), { status: "active" });
              fetchAll();
            }}
            onRejectJobSeeker={async (id) => {
              await updateDoc(doc(db, "seekerProfiles", id), { status: "rejected" });
              fetchAll();
            }}
          />
        </TabsContent>

        <TabsContent value="jobs">
          <JobsTab jobs={jobs} />
        </TabsContent>

        <TabsContent value="featured">
          <FeaturedListingsTab
            featuredListings={featuredListings}
            availableJobs={jobs}
            onAddFeatured={async (jobDetails, duration) => {
              const now = new Date()
              const until = new Date(now)
              until.setDate(now.getDate() + duration)

              await addDoc(collection(db, "featuredListings"), {
                ...jobDetails,
                featuredFrom: now.toISOString(),
                featuredUntil: until.toISOString(),
                views: 0,
                clicks: 0,
                status: "active",
              })

              fetchAll()
            }}
            onRemoveFeatured={async (id) => {
              await deleteDoc(doc(db, "featuredListings", id))
              fetchAll()
            }}
            onExtendFeatured={async (id, days) => {
              const listing = featuredListings.find((f) => f.id === id)
              if (!listing) return

              const currentUntil = new Date(listing.featuredUntil)
              currentUntil.setDate(currentUntil.getDate() + days)

              await updateDoc(doc(db, "featuredListings", id), {
                featuredUntil: currentUntil.toISOString(),
              })

              fetchAll()
            }}
          />

        </TabsContent>

        <TabsContent value="reports">
          <ReportsTab
            reports={reports}
            onResolveReport={handleResolveReport}
            onRespondToReport={handleRespondToReport}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
