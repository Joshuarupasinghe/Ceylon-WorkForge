"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, ExternalLink, MessageSquare, X } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import Link from "next/link"
import React from "react"

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
  views: number
  clicks: number
  dailyStats?: {
    date: string
    views: number
    clicks: number
  }[]
}

interface FeaturedListingDetailsDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  listing: FeaturedListing | null
  onExtendFeatured: (id: string, days: number) => void
  onRemoveFeatured: (id: string) => void
}

export function FeaturedListingDetailsDrawer({
  isOpen,
  onOpenChange,
  listing,
  onExtendFeatured,
  onRemoveFeatured,
}: FeaturedListingDetailsDrawerProps) {
  const [isExtendDialogOpen, setIsExtendDialogOpen] = useState(false)
  const [extensionDays, setExtensionDays] = useState("7")
  const [hasEdits, setHasEdits] = useState(false)
  const [editedListing, setEditedListing] = useState<FeaturedListing | null>(null)

  React.useEffect(() => {
    if (listing) {
      setEditedListing({ ...listing })
      setHasEdits(false)
    }
  }, [listing])

  const handleExtendFeatured = () => {
    if (listing) {
      onExtendFeatured(listing.id, Number.parseInt(extensionDays))
      setIsExtendDialogOpen(false)
      setExtensionDays("7")
    }
  }

  const handleSaveChanges = () => {
    if (editedListing && listing) {
      // Here you would typically call an API to update the listing
      // For now, we'll just close the drawer and reset the edit state
      setHasEdits(false)
      onOpenChange(false)
    }
  }

  // Generate mock daily stats if they don't exist
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

  if (!listing) return null

  const listingWithStats = getListingWithStats(listing)

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent side="right" className="h-full overflow-hidden flex flex-col">
        <DrawerHeader className="text-left bg-background">
          <DrawerTitle>Featured Listing Details</DrawerTitle>
          <DrawerDescription>View and manage this featured job listing</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 flex-1 overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-semibold">{listing.title}</h2>
              <p className="text-muted-foreground">
                {listing.company} • {listing.location} • {listing.jobType}
              </p>
            </div>
            <Badge
              variant={
                listing.status === "active" ? "default" : listing.status === "scheduled" ? "outline" : "secondary"
              }
              className={
                listing.status === "active"
                  ? "bg-green-500 hover:bg-green-500/80"
                  : listing.status === "scheduled"
                    ? "bg-blue-500 hover:bg-blue-500/80 text-white"
                    : ""
              }
            >
              {listing.status === "active" ? "Active" : listing.status === "scheduled" ? "Scheduled" : "Expired"}
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
                  <p className="text-sm">{listing.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {listing.skills.map((skill) => (
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
                        {format(listing.featuredFrom, "MMM d, yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Until</p>
                      <p className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {format(listing.featuredUntil, "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  {listing.status === "active" && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{getDaysRemaining(listing.featuredUntil)} days remaining</span>
                        <span>{format(listing.featuredUntil, "MMM d, yyyy")}</span>
                      </div>
                      <Progress
                        value={
                          (getDaysRemaining(listing.featuredUntil) /
                            differenceInDays(listing.featuredUntil, listing.featuredFrom)) *
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
                    <p className="text-2xl font-semibold">{listing.views.toLocaleString()}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Total Clicks</p>
                    <p className="text-2xl font-semibold">{listing.clicks.toLocaleString()}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">CTR</p>
                    <p className="text-2xl font-semibold">{calculateCTR(listing.views, listing.clicks).toFixed(1)}%</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Daily Performance</h3>
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <div className="space-y-2">
                      {listingWithStats.dailyStats?.map((day) => (
                        <div key={day.date} className="flex items-center justify-between text-sm">
                          <span className="w-16">{day.date}</span>
                          <div className="flex-1 flex items-center gap-2">
                            <span className="w-12 text-right">{day.views}</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{
                                  width: `${(day.views / 50) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex-1 flex items-center gap-2">
                            <span className="w-12 text-right">{day.clicks}</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent"
                                style={{
                                  width: `${(day.clicks / 20) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span>Views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-accent"></div>
                        <span>Clicks</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DrawerFooter className="border-t bg-background">
          <div className="flex flex-col gap-2">
            {hasEdits && (
              <Button onClick={handleSaveChanges} className="gap-2">
                Save Changes
              </Button>
            )}

            {listing.status === "active" && (
              <Dialog open={isExtendDialogOpen} onOpenChange={setIsExtendDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Clock className="h-4 w-4" />
                    Extend Featured Period
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Extend Featured Period</DialogTitle>
                    <DialogDescription>Extend the featured period for {listing.title}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="extension">Additional Days</Label>
                      <Select
                        value={extensionDays}
                        onValueChange={(value) => {
                          setExtensionDays(value)
                          setHasEdits(true)
                        }}
                      >
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

            <Button asChild variant="outline" className="gap-2">
              <Link href={`/chat/job-${listing.jobId}`}>
                <MessageSquare className="h-4 w-4" />
                Message Job Poster
              </Link>
            </Button>

            <Button asChild variant="outline" className="gap-2">
              <Link href={`/jobs/${listing.jobId}`} target="_blank">
                <ExternalLink className="h-4 w-4" />
                View Job Listing
              </Link>
            </Button>

            <Button
              variant="destructive"
              className="gap-2"
              onClick={() => {
                onRemoveFeatured(listing.id)
                onOpenChange(false)
              }}
            >
              <X className="h-4 w-4" />
              Remove Featured Listing
            </Button>

            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
