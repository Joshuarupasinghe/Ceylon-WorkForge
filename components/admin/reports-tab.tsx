"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

// Types
interface Report {
  id: string
  type: string
  reportedId: string
  reportedName: string
  reason: string
  status: string
  reportedAt: string
}

interface ReportsTabProps {
  reports: Report[]
  onResolveReport: (reportId: string) => void
}

export function ReportsTab({ reports, onResolveReport }: ReportsTabProps) {
  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports Management</CardTitle>
        <CardDescription>Review and handle reported content and users</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Reported Item</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reported On</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <Badge variant="outline">{report.type === "user" ? "User" : "Job"}</Badge>
                </TableCell>
                <TableCell className="font-medium">{report.reportedName}</TableCell>
                <TableCell>{report.reason}</TableCell>
                <TableCell>
                  <Badge
                    variant={report.status === "resolved" ? "default" : "secondary"}
                    className={
                      report.status === "resolved"
                        ? "bg-green-500 hover:bg-green-500/80"
                        : "bg-amber-500 hover:bg-amber-500/80"
                    }
                  >
                    {report.status === "resolved" ? "Resolved" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>{report.reportedAt}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {report.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onResolveReport(report.id)}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="sr-only">Resolve</span>
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => router.push(`/chat/support-report-${report.id}`)}
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
