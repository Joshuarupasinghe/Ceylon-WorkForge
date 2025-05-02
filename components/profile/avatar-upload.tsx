"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/context/user-context"

interface AvatarUploadProps {
  currentAvatarUrl: string
  onAvatarUpdate: (url: string) => void
  userId: string
}

export default function AvatarUpload({ currentAvatarUrl, onAvatarUpdate, userId }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const { user } = useUser()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return

    const file = e.target.files[0]
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // For demo purposes, we'll use a placeholder image
      // In a real app, you would upload the image to a storage service
      const demoUrl = `/placeholder.svg?height=200&width=200&query=profile%20avatar`

      // Wait a bit to simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onAvatarUpdate(demoUrl)

      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated successfully (Demo Mode).",
      })
    } catch (error) {
      console.error("Error uploading avatar:", error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={currentAvatarUrl || "/placeholder.svg"} alt="Profile picture" />
        <AvatarFallback className="bg-accent text-white text-xl">
          <User className="h-12 w-12" />
        </AvatarFallback>
      </Avatar>

      <div className="flex items-center gap-2">
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <Label
          htmlFor="avatar-upload"
          className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent/10 h-10 px-4 py-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Change Avatar
            </>
          )}
        </Label>
      </div>
    </div>
  )
}
