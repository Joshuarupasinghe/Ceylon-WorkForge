"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

import { db } from "@/lib/firebase"
import { collection, addDoc, Timestamp } from "firebase/firestore"

interface CreateFeaturedListingDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateFeaturedListingDrawer({
  isOpen,
  onOpenChange,
}: CreateFeaturedListingDrawerProps) {
  const [listingType, setListingType] = useState<"job" | "talent">("job")
  const [jobTitle, setJobTitle] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("Full-time")
  const [experience, setExperience] = useState("6 months")
  const [description, setDescription] = useState("")
  const [skillsInput, setSkillsInput] = useState("")
  const [selectedDuration, setSelectedDuration] = useState("7")
  const [hasEdits, setHasEdits] = useState(false)

  const handleCreateFeatured = async () => {
    const skills = skillsInput
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "")

    const now = Timestamp.now()
    const expires = Timestamp.fromDate(new Date(now.toDate().getTime() + Number(selectedDuration) * 86400000))

    const jobDetails: Record<string, any> = {
      title: jobTitle,
      company,
      location,
      description,
      skills,
      featured: true,
      createdAt: now,
      expiresAt: expires,
      type: listingType,
      views: 0,
      clicks: 0,
    }

    if (listingType === "job") {
      jobDetails.jobType = jobType
    } else {
      jobDetails.experience = experience
    }
//Post Featured Listing to DB
    try {
      await addDoc(collection(db, "featuredListings"), jobDetails)
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error("Error adding featured listing:", error)
    }
  }

  const resetForm = () => {
    setListingType("job")
    setJobTitle("")
    setCompany("")
    setLocation("")
    setJobType("Full-time")
    setExperience("6 months")
    setDescription("")
    setSkillsInput("")
    setSelectedDuration("7")
    setHasEdits(false)
  }

  const isFormValid = jobTitle && company && location && description && skillsInput

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent side="right" className="h-full overflow-hidden flex flex-col">
        <DrawerHeader className="text-left bg-background">
          <DrawerTitle>Create Featured Listing</DrawerTitle>
          <DrawerDescription>Create a new listing and feature it on the platform.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 flex-1 overflow-y-auto">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="listingType">Listing Type</Label>
              <Select
                value={listingType}
                onValueChange={(value) => {
                  setListingType(value as "job" | "talent")
                  setHasEdits(true)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job">Job</SelectItem>
                  <SelectItem value="talent">Talent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jobTitle">{listingType === "job" ? "Job Title" : "Talent Title"}</Label>
              <Input
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => {
                  setJobTitle(e.target.value)
                  setHasEdits(true)
                }}
                placeholder={listingType === "job" ? "e.g. Senior Software Engineer" : "e.g. UI/UX Designer"}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value)
                  setHasEdits(true)
                }}
                placeholder="e.g. TechCorp Lanka"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value)
                  setHasEdits(true)
                }}
                placeholder="e.g. Colombo, Sri Lanka"
              />
            </div>

            {listingType === "job" ? (
              <div className="grid gap-2">
                <Label htmlFor="jobType">Job Type</Label>
                <Select
                  value={jobType}
                  onValueChange={(value) => {
                    setJobType(value)
                    setHasEdits(true)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="experience">Experience</Label>
                <Select
                  value={experience}
                  onValueChange={(value) => {
                    setExperience(value)
                    setHasEdits(true)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6 months">6 months</SelectItem>
                    <SelectItem value="1 year">1 year</SelectItem>
                    <SelectItem value="2 years">2 years</SelectItem>
                    <SelectItem value="5 years">5 years</SelectItem>
                    <SelectItem value="10+ years">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="description">{listingType === "job" ? "Job Description" : "Talent Bio"}</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  setHasEdits(true)
                }}
                placeholder={listingType === "job" ? "Describe the job role, responsibilities, and requirements..." : "Describe this talent's expertise, background, and strengths..."}
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={skillsInput}
                onChange={(e) => {
                  setSkillsInput(e.target.value)
                  setHasEdits(true)
                }}
                placeholder="e.g. React, Node.js, TypeScript, MongoDB"
              />
            </div>

            {skillsInput && (
              <div className="flex flex-wrap gap-2 mt-1">
                {skillsInput.split(",").map(
                  (skill, index) =>
                    skill.trim() && (
                      <Badge key={index} variant="outline" className="bg-primary/10">
                        {skill.trim()}
                      </Badge>
                    ),
                )}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="duration">Featured Duration (days)</Label>
              <Select
                value={selectedDuration}
                onValueChange={(value) => {
                  setSelectedDuration(value)
                  setHasEdits(true)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DrawerFooter className="border-t bg-background">
          <Button onClick={handleCreateFeatured} disabled={!isFormValid}>
            Create Featured Listing
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
