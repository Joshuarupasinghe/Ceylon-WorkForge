"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, X, Plus } from "lucide-react"

interface JobSeekerFormProps {
  profile: any
  onUpdate: (data: any) => Promise<void>
}

export default function JobSeekerForm({ profile, onUpdate }: JobSeekerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentSkill, setCurrentSkill] = useState("")
  const [formData, setFormData] = useState({
    title: profile?.title || "",
    experience: profile?.experience || "",
    education: profile?.education || "",
    skills: profile?.skills || [],
    availability: profile?.availability || "",
    salary_expectation: profile?.salary_expectation || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onUpdate(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, currentSkill.trim()],
      }))
      setCurrentSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill: string) => skill !== skillToRemove),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Professional Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. Senior Software Engineer"
            value={formData.title}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience</Label>
          <Input
            id="experience"
            name="experience"
            placeholder="e.g. 5 years"
            value={formData.experience}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="availability">Availability</Label>
          <Select
            value={formData.availability}
            onValueChange={(value) => handleSelectChange("availability", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="availability">
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Immediate">Immediate</SelectItem>
              <SelectItem value="2 weeks">2 weeks</SelectItem>
              <SelectItem value="1 month">1 month</SelectItem>
              <SelectItem value="More than 1 month">More than 1 month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="salary_expectation">Salary Expectation</Label>
          <Input
            id="salary_expectation"
            name="salary_expectation"
            placeholder="e.g. $3,000 - $4,500 per month"
            value={formData.salary_expectation}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="education">Education</Label>
        <Textarea
          id="education"
          name="education"
          placeholder="e.g. BSc in Computer Science, University of Colombo"
          rows={3}
          value={formData.education}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label>Skills</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add a skill"
            value={currentSkill}
            onChange={(e) => setCurrentSkill(e.target.value)}
            disabled={isSubmitting}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addSkill()
              }
            }}
          />
          <Button type="button" variant="outline" onClick={addSkill} disabled={isSubmitting}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {formData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.skills.map((skill: string) => (
              <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="ml-1 hover:bg-muted rounded-full">
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {skill}</span>
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" className="bg-accent hover:bg-accent/90 text-white" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  )
}
