"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Filter, Plus } from "lucide-react"
import { format } from "date-fns"
import { FeaturedListingsDrawer } from "./featured-listings-drawer"
import { FeaturedListingDetailsDrawer } from "./featured-listing-details-drawer"

// Types
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

export function FeaturedListingsTabRefactored({
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
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false)
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

  const filteredListings = featuredListings
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
        return sortDirection === "asc" ? a.views - b.views : b.views - a.views
      } else if (sortBy === "clicks") {
        return sortDirection === "asc" ? a.clicks - b.clicks : b.clicks - a.clicks
      }
      return 0
    })

  const handleViewListing = (listing: FeaturedListing) => {
    setSelectedListing(listing)
    setIsViewDrawerOpen(true)
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
            <Button size="sm" className="gap-2" onClick={() => setIsAddDrawerOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Featured Listing
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
                      <span className="text-muted-foreground">Views:</span> {listing.views.toLocaleString()}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Clicks:</span> {listing.clicks.toLocaleString()}
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

      {/* Add Featured Listing Drawer */}
      <FeaturedListingsDrawer
        isOpen={isAddDrawerOpen}
        onOpenChange={setIsAddDrawerOpen}
        availableJobs={availableJobs}
        onAddFeatured={onAddFeatured}
      />

      {/* Featured Listing Details Drawer */}
      <FeaturedListingDetailsDrawer
        isOpen={isViewDrawerOpen}
        onOpenChange={setIsViewDrawerOpen}
        listing={selectedListing}
        onExtendFeatured={onExtendFeatured}
        onRemoveFeatured={onRemoveFeatured}
      />
    </Card>
  )
}
