"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Filter, Plus, X, Clock, MessageSquare, ExternalLink, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Label } from "@/components/ui/label"
import { format, differenceInDays } from "date-fns"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateFeaturedListingDrawer } from "./create-featured-listing-drawer"

interface FeaturedListing {
  id: string
  jobId: string
  title: string
  company: string
  location: string
  jobType: string
  description: string
  skills: string[]
  featuredFrom: Date
  featuredUntil: Date
  status: "active" | "expired" | "scheduled"
  views?: number
  clicks?: number
  dailyStats?: {
    date: string
    views: number
    clicks: number
  }[]
}

interface FeaturedListingsTabProps {
  featuredListings: FeaturedListing[]
  availableJobs: {
    id: string
    title: string
    company: string
    location: string
    jobType: string
    description: string
    skills: string[]
  }[]
  onAddFeatured: (jobId: string, duration: number) => void
  onRemoveFeatured: (id: string) => void
  onExtendFeatured: (id: string, days: number) => void
}

export function FeaturedListingsTab({
  featuredListings,
  availableJobs,
  onAddFeatured,
  onRemoveFeatured,
  onExtendFeatured,
}: FeaturedListingsTabProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("featuredFrom")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedListingId, setSelectedListingId] = useState("")
  const [extensionDays, setExtensionDays] = useState("7")
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false)
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false)
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<FeaturedListing | null>(null)

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  const now = new Date()
  const filteredListings = featuredListings
    .map((listing) => {
      const isScheduled = new Date(listing.featuredFrom) > now
      const isExpired = new Date(listing.featuredUntil) < now
  
      let status: "active" | "expired" | "scheduled" = "active"
      if (isScheduled) status = "scheduled"
      else if (isExpired) status = "expired"
  
      return {
        ...listing,
        status,
      }
    })
    .filter((listing) => {
      const matchesSearch =
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  
      const matchesStatus = statusFilter === "all" || listing.status === statusFilter
  
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === "featuredFrom") {
        return sortDirection === "asc"
          ? a.featuredFrom.getTime() - b.featuredFrom.getTime()
          : b.featuredFrom.getTime() - a.featuredFrom.getTime()
      } else if (sortBy === "featuredUntil") {
        return sortDirection === "asc"
          ? a.featuredUntil.getTime() - b.featuredUntil.getTime()
          : b.featuredUntil.getTime() - a.featuredUntil.getTime()
      } else if (sortBy === "views") {
        return sortDirection === "asc"
          ? (a.views ?? 0) - (b.views ?? 0)
          : (b.views ?? 0) - (a.views ?? 0)
      } else if (sortBy === "clicks") {
        return sortDirection === "asc"
          ? (a.clicks ?? 0) - (b.clicks ?? 0)
          : (b.clicks ?? 0) - (a.clicks ?? 0)
      }
      return 0
    })
  
  const handleCreateFeatured = (jobId: string, duration: number) => {
    onAddFeatured(jobId, duration)
  }

  const handleExtendFeatured = () => {
    onExtendFeatured(selectedListingId, Number.parseInt(extensionDays))
    setIsExtendDialogOpen(false)
    setSelectedListingId("")
    setExtensionDays("7")
  }

  const handleViewListing = (listing: FeaturedListing) => {
    setSelectedListing(listing)
    setIsViewDrawerOpen(true)
  }

  const getListingWithStats = (listing: FeaturedListing): FeaturedListing => {
    if (listing.dailyStats) return listing

    const days = differenceInDays(new Date(), listing.featuredFrom) + 1
    const dailyStats = Array.from({ length: days }).map((_, index) => {
      const date = new Date(listing.featuredFrom)
      date.setDate(date.getDate() + index)
      return {
        date: format(date, "MMM d"),
        views: Math.floor(Math.random() * 50) + 10,
        clicks: Math.floor(Math.random() * 20) + 1,
      }
    })

    return {
      ...listing,
      dailyStats,
    }
  }

  const calculateCTR = (views: number, clicks: number) => {
    if (views === 0) return 0
    return (clicks / views) * 100
  }

  const getDaysRemaining = (endDate: Date) => {
    const today = new Date()
    const days = differenceInDays(endDate, today)
    return days > 0 ? days : 0
  }


  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Featured Listings</CardTitle>
            <CardDescription>Manage featured job listings on the platform</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="gap-2" onClick={() => setIsCreateDrawerOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Featured Listing
            </Button>
            <CreateFeaturedListingDrawer
              isOpen={isCreateDrawerOpen}
              onOpenChange={setIsCreateDrawerOpen}
              onCreateFeatured={handleCreateFeatured}
            />
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, company, location, or skills..."
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
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="border rounded-lg p-4 hover:bg-muted/20 transition-colors cursor-pointer"
              onClick={() => handleViewListing(listing)}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {listing.company} • {listing.location} • {listing.jobType}
                      </p>
                    </div>
                    <Badge
                      variant={
                        listing.status === "active"
                          ? "default"
                          : listing.status === "scheduled"
                            ? "outline"
                            : "secondary"
                      }
                      className={
                        listing.status === "active"
                          ? "bg-green-500 hover:bg-green-500/80"
                          : listing.status === "scheduled"
                            ? "bg-blue-500 hover:bg-blue-500/80 text-white"
                            : ""
                      }
                    >
                      {listing.status === "active"
                        ? "Active"
                        : listing.status === "scheduled"
                          ? "Scheduled"
                          : "Expired"}
                    </Badge>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm">{listing.description}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {listing.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-primary/10">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Featured from:</span>{" "}
                      {format(listing.featuredFrom, "MMM d, yyyy")}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Until:</span>{" "}
                      {format(listing.featuredUntil, "MMM d, yyyy")}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Views:</span> {(listing.views ?? 0).toLocaleString()}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Clicks:</span> {(listing.clicks ?? 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredListings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No featured listings found</p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Featured Listing Details Drawer */}
      <Drawer open={isViewDrawerOpen} onOpenChange={setIsViewDrawerOpen}>
        <DrawerContent className="max-h-[90vh] overflow-auto">
          <DrawerHeader className="text-left">
            <DrawerTitle>Featured Listing Details</DrawerTitle>
            <DrawerDescription>View and manage this featured job listing</DrawerDescription>
          </DrawerHeader>

          {selectedListing && (
            <div className="px-4 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{selectedListing.title}</h2>
                  <p className="text-muted-foreground">
                    {selectedListing.company} • {selectedListing.location} • {selectedListing.jobType}
                  </p>
                </div>
                <Badge
                  variant={
                    selectedListing.status === "active"
                      ? "default"
                      : selectedListing.status === "scheduled"
                        ? "outline"
                        : "secondary"
                  }
                  className={
                    selectedListing.status === "active"
                      ? "bg-green-500 hover:bg-green-500/80"
                      : selectedListing.status === "scheduled"
                        ? "bg-blue-500 hover:bg-blue-500/80 text-white"
                        : ""
                  }
                >
                  {selectedListing.status === "active"
                    ? "Active"
                    : selectedListing.status === "scheduled"
                      ? "Scheduled"
                      : "Expired"}
                </Badge>
              </div>

              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="details">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Description</h3>
                      <p className="text-sm">{selectedListing.description}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedListing.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="bg-primary/10">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium mb-2">Featured Period</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">From</p>
                          <p className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {format(selectedListing.featuredFrom, "MMM d, yyyy")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Until</p>
                          <p className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {format(selectedListing.featuredUntil, "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>

                      {selectedListing.status === "active" && (
                        <div className="mt-4">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{getDaysRemaining(selectedListing.featuredUntil)} days remaining</span>
                            <span>{format(selectedListing.featuredUntil, "MMM d, yyyy")}</span>
                          </div>
                          <Progress
                            value={
                              (getDaysRemaining(selectedListing.featuredUntil) /
                                differenceInDays(selectedListing.featuredUntil, selectedListing.featuredFrom)) *
                              100
                            }
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="performance">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Total Views</p>
                        <p className="text-2xl font-semibold">
                          {(selectedListing.views ?? 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Total Clicks</p>
                        <p className="text-2xl font-semibold">
                          {(selectedListing.clicks ?? 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">CTR</p>
                        <p className="text-2xl font-semibold">
                          {calculateCTR(selectedListing.views ?? 0, selectedListing.clicks ?? 0).toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Daily Performance</h3>
                      <div className="border rounded-lg p-4 bg-muted/20">
                        <div className="space-y-2">
                          {getListingWithStats(selectedListing).dailyStats?.map((day) => (
                            <div key={day.date} className="flex items-center justify-between text-sm">
                              <span className="w-16">{day.date}</span>
                              <div className="flex-1 flex items-center gap-2">
                                <span className="w-12 text-right">{day.views}</span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary"
                                    style={{ width: `${(day.views / 50) * 100}%` }}
                                  />
                                </div>
                              </div>
                              <div className="flex-1 flex items-center gap-2">
                                <span className="w-12 text-right">{day.clicks}</span>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-accent"
                                    style={{ width: `${(day.clicks / 20) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span>Views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <span>Clicks</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DrawerFooter className="pt-2">
            <div className="flex flex-col gap-2">
              {selectedListing && selectedListing.status === "active" && (
                <Dialog open={isExtendDialogOpen} onOpenChange={setIsExtendDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setSelectedListingId(selectedListing.id)}
                    >
                      <Clock className="h-4 w-4" />
                      Extend Featured Period
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Extend Featured Period</DialogTitle>
                      <DialogDescription>
                        Extend the featured period for {selectedListing.title}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="extension">Additional Days</Label>
                        <Select value={extensionDays} onValueChange={setExtensionDays}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select days" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="14">14 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsExtendDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleExtendFeatured}>Extend</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {selectedListing && (
                <>
                  <Button asChild variant="outline" className="gap-2">
                    <Link href={`/chat/job-${selectedListing.jobId}`}>
                      <MessageSquare className="h-4 w-4" />
                      Message Job Poster
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="gap-2">
                    <Link href={`/jobs/${selectedListing.jobId}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                      View Job Listing
                    </Link>
                  </Button>

                  <Button
                    variant="destructive"
                    className="gap-2"
                    onClick={() => {
                      onRemoveFeatured(selectedListing.id)
                      setIsViewDrawerOpen(false)
                    }}
                  >
                    <X className="h-4 w-4" />
                    Remove Featured Listing
                  </Button>
                </>
              )}

              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

    </Card>
  )
}
