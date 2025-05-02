"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/context/user-context"

interface EmployerFormProps {
  profile: any
  onUpdate: (data: any) => Promise<void>
}

export default function EmployerForm({ profile, onUpdate }: EmployerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const { toast } = useToast()
  const { user } = useUser()

  const [formData, setFormData] = useState({
    company_name: profile?.company_name || "",
    company_size: profile?.company_size || "",
    industry: profile?.industry || "",
    company_description: profile?.company_description || "",
    company_website: profile?.company_website || "",
    company_logo_url: profile?.company_logo_url || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Upload logo if a new one is selected
      if (logoFile) {
        // For demo purposes, use a placeholder
        formData.company_logo_url = `/placeholder.svg?height=200&width=200&query=company%20logo`

        // Wait a bit to simulate upload
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      await onUpdate(formData)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update Failed",
        description: "Failed to update company profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_size">Company Size</Label>
          <Select
            value={formData.company_size}
            onValueChange={(value) => handleSelectChange("company_size", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger id="company_size">
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 employees</SelectItem>
              <SelectItem value="11-50">11-50 employees</SelectItem>
              <SelectItem value="51-200">51-200 employees</SelectItem>
              <SelectItem value="201-500">201-500 employees</SelectItem>
              <SelectItem value="501+">501+ employees</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            name="industry"
            placeholder="e.g. Information Technology"
            value={formData.industry}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_website">Company Website</Label>
          <Input
            id="company_website"
            name="company_website"
            placeholder="e.g. https://yourcompany.com"
            value={formData.company_website}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company_description">Company Description</Label>
        <Textarea
          id="company_description"
          name="company_description"
          placeholder="Tell us about your company..."
          rows={4}
          value={formData.company_description}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company_logo">Company Logo</Label>
        <div className="flex items-center gap-4">
          {formData.company_logo_url && (
            <div className="h-16 w-16 rounded-md overflow-hidden border">
              <img
                src={formData.company_logo_url || "/placeholder.svg"}
                alt="Company logo"
                className="h-full w-full object-contain"
              />
            </div>
          )}
          <Input id="company_logo" type="file" accept="image/*" onChange={handleLogoChange} disabled={isSubmitting} />
        </div>
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
