"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, MessageSquare, Search, Download, Filter } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

// Types
interface JobSeeker {
  id: string
  name: string
  email: string
  skills: string[]
  experience: string
  education: string
  status: string
  applications: number
  joinedAt: string
}

interface JobSeekersTabProps {
  jobSeekers: JobSeeker[]
  onApproveJobSeeker: (id: string) => void
  onRejectJobSeeker: (id: string) => void
}

export function JobSeekersTab({ jobSeekers, onApproveJobSeeker, onRejectJobSeeker }: JobSeekersTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()

  const filteredJobSeekers = jobSeekers.filter((seeker) => {
    const name = seeker.name?.toLowerCase() || ""
    const email = seeker.email?.toLowerCase() || ""
    const skills = Array.isArray(seeker.skills) ? seeker.skills : []

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      skills.some((skill) => skill?.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || seeker.status === statusFilter

    return matchesSearch && matchesStatus
  })


  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Job Seekers Management</CardTitle>
            <CardDescription>View and manage all job seekers on the platform</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or skills..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Education</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobSeekers.map((seeker) => (
              <TableRow key={seeker.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{seeker.name}</div>
                    <div className="text-sm text-muted-foreground">{seeker.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {seeker.skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {seeker.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{seeker.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{seeker.experience}</TableCell>
                <TableCell>{seeker.education}</TableCell>
                <TableCell>
                  <Badge
                    variant={seeker.status === "active" ? "default" : "secondary"}
                    className={seeker.status === "active" ? "bg-green-500 hover:bg-green-500/80" : ""}
                  >
                    {seeker.status === "active" ? "Active" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>{seeker.applications}</TableCell>
                <TableCell>{seeker.joinedAt}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {seeker.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => onApproveJobSeeker(seeker.id)}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="sr-only">Approve</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => onRejectJobSeeker(seeker.id)}
                        >
                          <XCircle className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Reject</span>
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => router.push(`/chat/support-${seeker.id}`)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="sr-only">Message</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
