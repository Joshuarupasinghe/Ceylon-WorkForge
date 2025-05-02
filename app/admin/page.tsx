"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Lock,
  User as UserIcon,
  Users as JobSeekersIcon,
  Briefcase as JobsIcon,
  Star as FeaturedIcon,
  FileText as ReportsIcon,
  AlertCircle,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { UsersTab } from "@/components/admin/users-tab";
import { JobSeekersTab } from "@/components/admin/job-seekers-tab";
import { JobsTab } from "@/components/admin/jobs-tab";
import { FeaturedListingsTab } from "@/components/admin/featured-listings-tab";
import { ReportsTab } from "@/components/admin/reports-tab";

import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isPaid?: boolean;
}

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [jobSeekers, setJobSeekers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingReports: 0,
    activeFeatured: 0,
  });

  // 1️⃣ Load current admin from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) {
      setCurrentAdmin(JSON.parse(raw));
    } else if (process.env.NODE_ENV === "development") {
      const admin = {
        id: "admin-1",
        name: "Administrator",
        email: "admin@ceylonworkforce.lk",
        role: "admin",
        isPaid: true,
      };
      setCurrentAdmin(admin);
      localStorage.setItem("user", JSON.stringify(admin));
    }
    setIsLoading(false);
  }, []);

  // 2️⃣ Once admin is known, fetch all collections
  useEffect(() => {
    if (currentAdmin?.role === "admin") {
      fetchAll();
    }
  }, [currentAdmin]);

  async function fetchAll() {
    setIsLoading(true);
    try {
      // Users
      const usersSnap = await getDocs(collection(db, "users"));
      const usersList = usersSnap.docs.map((d) => ({ id: d.id, ...(d.data()) }));
      setUsers(usersList);

      // Job Seekers
      const jsSnap = await getDocs(collection(db, "jobSeekers"));
      const jsList = jsSnap.docs.map((d) => ({ id: d.id, ...(d.data()) }));
      setJobSeekers(jsList);

      // Jobs
      const jobsSnap = await getDocs(collection(db, "jobs"));
      const jobsList = jobsSnap.docs.map((d) => ({ id: d.id, ...(d.data()) }));
      setJobs(jobsList);

      // Featured Listings
      const fSnap = await getDocs(collection(db, "featuredListings"));
      const fList = fSnap.docs.map((d) => ({ id: d.id, ...(d.data()) }));
      setFeaturedListings(fList);

      // Derive available jobs for featuring
      const featuredJobIds = new Set(fList.map((f) => f.jobId));
      setAvailableJobs(jobsList.filter((j) => !featuredJobIds.has(j.id)));

      // Reports
      const rSnap = await getDocs(collection(db, "reports"));
      const rList = rSnap.docs.map((d) => ({ id: d.id, ...(d.data()) }));
      setReports(rList);

      // Compute stats
      setStats({
        totalUsers: usersList.length,
        activeUsers: usersList.filter((u) => u.status === "active").length,
        totalJobs: jobsList.length,
        activeJobs: jobsList.filter((j) => j.status === "active").length,
        totalApplications: jobsList.reduce((sum, j) => sum + (j.applications || 0), 0),
        pendingReports: rList.filter((r) => r.status === "pending").length,
        activeFeatured: fList.filter((f) => f.status === "active").length,
      });
    } catch (e) {
      console.error("Error fetching admin data:", e);
    } finally {
      setIsLoading(false);
    }
  }

  // Handlers
  const handleApproveUser = async (id: string) => {
    await updateDoc(doc(db, "users", id), { status: "active" });
    fetchAll();
  };
  const handleRejectUser = async (id: string) => {
    await deleteDoc(doc(db, "users", id));
    fetchAll();
  };

  const handleApproveJobSeeker = async (id: string) => {
    await updateDoc(doc(db, "jobSeekers", id), { status: "active" });
    fetchAll();
  };
  const handleRejectJobSeeker = async (id: string) => {
    await deleteDoc(doc(db, "jobSeekers", id));
    fetchAll();
  };

  const handleApproveJob = async (id: string) => {
    await updateDoc(doc(db, "jobs", id), { status: "active" });
    fetchAll();
  };
  const handleRejectJob = async (id: string) => {
    await deleteDoc(doc(db, "jobs", id));
    fetchAll();
  };

  const handleAddFeatured = async (jobId: string, duration: number) => {
    const today = new Date();
    const until = new Date(today);
    until.setDate(today.getDate() + duration);

    await addDoc(collection(db, "featuredListings"), {
      jobId,
      featuredFrom: serverTimestamp(),
      featuredUntil: until,
      status: "active",
    });
    fetchAll();
  };
  const handleRemoveFeatured = async (id: string) => {
    await deleteDoc(doc(db, "featuredListings", id));
    fetchAll();
  };
  const handleExtendFeatured = async (id: string, days: number) => {
    const ref = doc(db, "featuredListings", id);
    const now = new Date();
    await updateDoc(ref, {
      featuredUntil: serverTimestamp(), // or compute new date client-side and set it
    });
    fetchAll();
  };

  const handleResolveReport = async (id: string) => {
    await updateDoc(doc(db, "reports", id), { status: "resolved" });
    fetchAll();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/admin-login";
  };

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!currentAdmin || currentAdmin.role !== "admin") {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[70vh]">
        <Lock className="h-16 w-16 text-primaryDark mb-4" />
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p className="text-muted-foreground mb-6">
          You need to log in as an administrator to access this page.
        </p>
        <Button asChild className="bg-accent hover:bg-accent/90 text-white">
          <Link href="/admin-login">Go to Admin Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primaryDark">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage users, jobs, and platform activity
          </p>
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
            <UserIcon className="h-4 w-4" /> Users
          </TabsTrigger>
          <TabsTrigger value="job-seekers" className="flex items-center gap-1">
            <JobSeekersIcon className="h-4 w-4" /> Job Seekers
          </TabsTrigger>
          <TabsTrigger value="jobs" className="flex items-center gap-1">
            <JobsIcon className="h-4 w-4" /> Jobs
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex items-center gap-1">
            <FeaturedIcon className="h-4 w-4" /> Featured Listings
            {stats.activeFeatured > 0 && (
              <span className="ml-1 bg-accent text-white rounded px-1 text-xs">
                {stats.activeFeatured}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4" /> Reports
            {stats.pendingReports > 0 && (
              <span className="ml-1 bg-red-600 text-white rounded px-1 text-xs">
                {stats.pendingReports}
              </span>
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
  );
}
