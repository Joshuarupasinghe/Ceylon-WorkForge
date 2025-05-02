"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface Job {
  id: string
  title: string
  company: string
  location: string
  jobType: string
  description: string
  skills: string[]
}

interface FeaturedListingsDrawerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAddFeatured: (jobDetails: Omit<Job, "id">, duration: number) => void
}

export function FeaturedListingsDrawer({ isOpen, onOpenChange, onAddFeatured }: FeaturedListingsDrawerProps) {
  const [jobTitle, setJobTitle] = useState("")
  const [company, setCompany] = useState("")
  const [location, setLocation] = useState("")
  const [jobType, setJobType] = useState("Full-time")
  const [description, setDescription] = useState("")
  const [skillsInput, setSkillsInput] = useState("")
  const [selectedDuration, setSelectedDuration] = useState("7")

  const handleAddFeatured = () => {
    // Parse skills from comma-separated string to array
    const skills = skillsInput
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "")

    // Create job details object
    const jobDetails = {
      title: jobTitle,
      company,
      location,
      jobType,
      description,
      skills,
    }

    onAddFeatured(jobDetails, Number.parseInt(selectedDuration))
    onOpenChange(false)

    // Reset form
    setJobTitle("")
    setCompany("")
    setLocation("")
    setJobType("Full-time")
    setDescription("")
    setSkillsInput("")
    setSelectedDuration("7")
  }

  const isFormValid = jobTitle && company && location && jobType && description && skillsInput

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Create Featured Listing</DrawerTitle>
          <DrawerDescription>Create a new job listing and feature it on the platform.</DrawerDescription>
        </DrawerHeader>
        <div className="px-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. TechCorp Lanka"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Colombo, Sri Lanka"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jobType">Job Type</Label>
              <Select value={jobType} onValueChange={setJobType}>
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

            <div className="grid gap-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the job role, responsibilities, and requirements..."
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
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
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
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
        <DrawerFooter className="pt-2">
          <Button onClick={handleAddFeatured} disabled={!isFormValid}>
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
