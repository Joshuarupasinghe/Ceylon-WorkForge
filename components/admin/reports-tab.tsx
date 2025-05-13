"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { CheckCircle, MessageSquare } from "lucide-react"

interface Report {
  id: string
  type: string
  reportedId: string
  reportedName: string
  title: string
  description?: string
  reason?: string
  status: string
  reportedAt: string
  response?: string
}

interface ReportsTabProps {
  reports: Report[]
  onResolveReport: (reportId: string) => void
  onRespondToReport?: (reportId: string, response: string, status: string) => void
}

export function ReportsTab({ reports, onResolveReport, onRespondToReport }: ReportsTabProps) {
  const [openReportId, setOpenReportId] = useState<string | null>(null)
  const [responseText, setResponseText] = useState("")
  const [responseStatus, setResponseStatus] = useState("resolved")

  const handleSubmitResponse = () => {
    if (openReportId && onRespondToReport) {
      onRespondToReport(openReportId, responseText, responseStatus)
      setOpenReportId(null)
      setResponseText("")
    }
  }

  const selectedReport = reports.find((r) => r.id === openReportId)

  return (
    <>
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
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <Badge variant="outline">{report.type}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{report.title}</TableCell>
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
                      <Dialog open={openReportId === report.id} onOpenChange={(open) => setOpenReportId(open ? report.id : null)}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Report Details</DialogTitle>
                          </DialogHeader>

                          {selectedReport && (
                            <div className="text-sm space-y-3">
                              <p><strong>Type:</strong> {selectedReport.type}</p>
                              <p><strong>Reported User:</strong> {selectedReport.reportedName}</p>
                              <p><strong>Title:</strong> {selectedReport.title}</p>
                              {selectedReport.description && (
                                <p><strong>Description:</strong> {selectedReport.description}</p>
                              )}

                              <div className="space-y-1">
                                <label className="text-xs font-semibold">Update Status</label>
                                <Select value={responseStatus} onValueChange={setResponseStatus}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-xs font-semibold">Admin Response</label>
                                <Textarea
                                  rows={3}
                                  value={responseText}
                                  onChange={(e) => setResponseText(e.target.value)}
                                  placeholder="Enter your response here..."
                                />
                              </div>
                            </div>
                          )}

                          <DialogFooter className="mt-4">
                            <Button onClick={handleSubmitResponse} disabled={!responseText}>
                              Submit Response
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
