"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Lock, Loader2 } from "lucide-react";
import { UsersTab } from "@/components/admin/users-tab";
import { JobSeekersTab } from "@/components/admin/job-seekers-tab";
import { JobsTab } from "@/components/admin/jobs-tab";
import { FeaturedListingsTab } from "@/components/admin/featured-listings-tab";
import { ReportsTab } from "@/components/admin/reports-tab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
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
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setCurrentAdmin(JSON.parse(stored));
    fetchAll();
  }, []);

  async function fetchAll() {
    setIsLoading(true);
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      const usersList = usersSnap.docs.map((d) => ({ id: d.id, ...(d.data()) }));
      setUsers(usersList);

      const seekersSnap = await getDocs(collection(db, "seekerProfiles"));
      const seekersList = seekersSnap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title || "",
          skills: data.skills || [],
          experience: data.experience || "",
          education: data.education || "",
          availability: data.availability || "",
          salary_expectation: data.salary_expectation || "",
        };
      });
      setJobSeekers(seekersList);

      const jobsSnap = await getDocs(collection(db, "jobs"));
      const jobsList = jobsSnap.docs.map((d) => ({ id: d.id, ...(d.data()) }));
      setJobs(jobsList);

      const featuredSnap = await getDocs(collection(db, "featuredListings"));
      const featuredList = featuredSnap.docs.map((d) => ({ id: d.id, ...(d.data()) }));
      setFeaturedListings(featuredList);

      const reportsSnap = await getDocs(collection(db, "reports"));
      const reportsList = reportsSnap.docs.map((d) => ({ id: d.id, ...(d.data()) }));
      setReports(reportsList);
    } catch (e) {
      console.error("Error loading data:", e);
    } finally {
      setIsLoading(false);
    }
  }

  const handleApproveUser = async (id: string) => {
    await updateDoc(doc(db, "users", id), { status: "approved" });
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
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentAdmin || currentAdmin.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <Lock className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Admin Access Required</h2>
        <Button onClick={handleLogout}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* ✅ Dashboard summary cards (LIVE COUNTS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
  <Card className="bg-gradient-to-tr from-teal-500 to-teal-700 text-white shadow-lg rounded-2xl">
    <CardHeader>
      <CardTitle className="text-white text-lg">Total Users</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-4xl font-bold tracking-tight">{users.length}</p>
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


      {/* ✅ Data Tabs */}
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="jobSeekers">Job Seekers</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UsersTab users={users} onApprove={handleApproveUser} />
        </TabsContent>

        <TabsContent value="jobSeekers">
          <JobSeekersTab jobSeekers={jobSeekers} />
        </TabsContent>

        <TabsContent value="jobs">
          <JobsTab jobs={jobs} />
        </TabsContent>

        <TabsContent value="featured">
          <FeaturedListingsTab featuredListings={featuredListings} />
        </TabsContent>

        <TabsContent value="reports">
          <ReportsTab reports={reports} onResolveReport={handleResolveReport} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
