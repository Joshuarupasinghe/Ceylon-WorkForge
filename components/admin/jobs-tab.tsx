"use client"

import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, XCircle, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

// Types
interface Job {
  id: string
  title: string
  company: string
  location: string
  status: string
  createdAt: string
}

interface JobsTabProps {
  jobs: Job[]
  onApproveJob: (jobId: string) => void
  onRejectJob: (jobId: string) => void
}

export function JobsTab({ jobs, onApproveJob, onRejectJob }: JobsTabProps) {
  const router = useRouter()

  // Function to format date
  const formatDate = (dateValue: any) => {
    try {
      // Handle Firestore Timestamp objects (with seconds and nanoseconds)
      if (dateValue && typeof dateValue === 'object' && 'seconds' in dateValue) {
        // Convert Firestore timestamp to JavaScript Date
        const date = new Date(dateValue.seconds * 1000)
        return format(date, "PPP") // "PPP" format gives "April 29, 2023"
      }
      
      // Handle string dates
      if (typeof dateValue === 'string') {
        // Check if the date is already a formatted string
        if (dateValue.includes('/')) {
          return dateValue
        }
        
        const date = new Date(dateValue)
        return format(date, "PPP")
      }
      
      // Handle Date objects
      if (dateValue instanceof Date) {
        return format(dateValue, "PPP")
      }
      
      return dateValue || "N/A" // Return original value or N/A if formatting fails
    } catch (error) {
      console.error("Error formatting date:", error)
      return "N/A"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Management</CardTitle>
        <CardDescription>View and manage all job postings on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.location}</TableCell>
                <TableCell>
                  <Badge
                    variant={job.status === "active" ? "default" : "secondary"}
                    className={job.status === "active" ? "bg-green-500 hover:bg-green-500/80" : ""}
                  >
                    {job.status === "active" ? "Active" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(job.createdAt)}</TableCell> {/* Now using the formatDate function */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {job.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => onApproveJob(job.id)}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="sr-only">Approve</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => onRejectJob(job.id)}
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
                      onClick={() => router.push(`/chat/support-job-${job.id}`)}
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