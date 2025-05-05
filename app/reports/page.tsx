"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Loader2, CheckCircle2, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore"

export default function ReportsPage() {
  const router = useRouter()
  const { user, isLoading: userLoading } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("new-report")
  const { toast } = useToast()

  // Form state
  const [reportType, setReportType] = useState("")
  const [reportTitle, setReportTitle] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [previousReports, setPreviousReports] = useState([])

  useEffect(() => {
    if (!userLoading && (!user || user.role === "admin")) {
      router.push("/login")
      return
    }

    const loadReports = async () => {
      setIsLoading(true)
      try {
        const q = query(collection(db, "reports"), where("userId", "==", user.id))
        const snapshot = await getDocs(q)
        const list = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title,
            type: data.type,
            status: data.status,
            date: data.createdAt?.toDate().toISOString().split("T")[0] || "N/A",
            response: data.response || null,
          }
        })
        setPreviousReports(list)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load reports.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) loadReports()
  }, [user, userLoading, router, toast])

  const handleSubmitReport = async (e) => {
    e.preventDefault()

    if (!reportType || !reportTitle || !reportDescription) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const docRef = await addDoc(collection(db, "reports"), {
        userId: user.id,
        userName: user.name,
        title: reportTitle,
        type: reportType,
        description: reportDescription,
        status: "pending",
        createdAt: Timestamp.now(),
        response: null,
      })

      const newReport = {
        id: docRef.id,
        title: reportTitle,
        type: reportType,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        response: null,
      }

      setPreviousReports([newReport, ...previousReports])

      setReportType("")
      setReportTitle("")
      setReportDescription("")

      toast({
        title: "Report submitted",
        description: "Your report has been submitted successfully.",
      })

      setActiveTab("previous-reports")
    } catch (error) {
      console.error("Error submitting report:", error)
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (userLoading || (isLoading && !user)) {
    return (
      <div className="container flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-primaryDark mb-2">Report a Problem</h1>
        <p className="text-muted-foreground mb-8">
          Submit issues, bugs, or concerns to our administrative team
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="new-report">New Report</TabsTrigger>
            <TabsTrigger value="previous-reports">Previous Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="new-report">
            <Card>
              <CardHeader>
                <CardTitle>Submit a New Report</CardTitle>
                <CardDescription>
                  Please provide details about the issue you're experiencing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReport} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType} required>
                      <SelectTrigger id="report-type">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technical Issue">Technical Issue</SelectItem>
                        <SelectItem value="Billing Issue">Billing Issue</SelectItem>
                        <SelectItem value="Content Report">Content Report</SelectItem>
                        <SelectItem value="User Behavior">User Behavior</SelectItem>
                        <SelectItem value="Feature Request">Feature Request</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-title">Report Title</Label>
                    <Input
                      id="report-title"
                      placeholder="Brief summary of the issue"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-description">Description</Label>
                    <Textarea
                      id="report-description"
                      placeholder="Please provide as much detail as possible about the issue"
                      rows={6}
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Report"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="previous-reports">
            <Card>
              <CardHeader>
                <CardTitle>Previous Reports</CardTitle>
                <CardDescription>
                  View status and responses to your previous reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                {previousReports.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    You haven't submitted any reports yet.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {previousReports.map((report) => (
                      <div key={report.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{report.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs bg-muted px-2 py-1 rounded-md">
                                {report.type}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {report.id} • {report.date}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {report.status === "pending" && (
                              <span className="flex items-center text-xs text-amber-500">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </span>
                            )}
                            {report.status === "in-progress" && (
                              <span className="flex items-center text-xs text-blue-500">
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                In Progress
                              </span>
                            )}
                            {report.status === "resolved" && (
                              <span className="flex items-center text-xs text-green-500">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Resolved
                              </span>
                            )}
                          </div>
                        </div>

                        {report.response && (
                          <div className="mt-4 bg-muted/30 p-3 rounded-md">
                            <p className="text-xs font-medium mb-1">Admin Response:</p>
                            <p className="text-sm">{report.response}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
