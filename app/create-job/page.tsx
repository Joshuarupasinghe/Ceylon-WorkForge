"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/firebase"
import { collection, addDoc, Timestamp } from "firebase/firestore"

export default function CreateJobPage() {
  const router = useRouter()
  const { user } = useUser()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [skills, setSkills] = useState<string[]>([])
  const [currentSkill, setCurrentSkill] = useState("")

  const [formData, setFormData] = useState({
    title: "",
    company: user?.name || "",
    location: "",
    type: "",
    salary: "",
    description: "",
    requirements: "",
  })

  if (!user || (user.role === "user" && user.userType !== "poster")) {
    router.push("/login")
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()])
      setCurrentSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.location || !formData.type || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await addDoc(collection(db, "jobs"), {
        ...formData,
        skills,
        userId: user.id,
        createdAt: Timestamp.now(),
      })

      toast({
        title: "Job Posted Successfully!",
        description: "Your job has been published and is now visible to job seekers.",
      })

      router.push("/job-posters")
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem posting your job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-primaryDark mb-2">Post a New Job</h1>
        <p className="text-muted-foreground mb-8">Create a job listing to find the perfect candidate</p>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>Fill in the information about the position you're hiring for</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title <span className="text-destructive">*</span></Label>
                <Input id="title" name="title" placeholder="e.g. Senior Software Engineer" value={formData.title} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name <span className="text-destructive">*</span></Label>
                <Input id="company" name="company" placeholder="e.g. Your Company Ltd." value={formData.company} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location <span className="text-destructive">*</span></Label>
                  <Input id="location" name="location" placeholder="e.g. Colombo, Sri Lanka" value={formData.location} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Job Type <span className="text-destructive">*</span></Label>
                  <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                    <SelectTrigger><SelectValue placeholder="Select job type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input id="salary" name="salary" placeholder="e.g. $3,000 - $4,500 per month" value={formData.salary} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description <span className="text-destructive">*</span></Label>
                <Textarea id="description" name="description" placeholder="Describe the role..." value={formData.description} onChange={handleChange} rows={5} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea id="requirements" name="requirements" placeholder="List qualifications..." value={formData.requirements} onChange={handleChange} rows={3} />
              </div>

              <div className="space-y-2">
                <Label>Skills Required</Label>
                <div className="flex gap-2">
                  <Input placeholder="e.g. React" value={currentSkill} onChange={(e) => setCurrentSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill() } }} />
                  <Button type="button" variant="outline" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((skill) => (
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
            </CardContent>

            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white" disabled={isSubmitting}>
                {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting Job...</>) : ("Post Job")}
              </Button>
              <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
