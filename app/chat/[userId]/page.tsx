"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Send, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock chat data
const MOCK_CHATS = {
  "1": {
    id: "1",
    name: "Amal Perera",
    role: "seeker",
    title: "Senior Software Engineer",
    messages: [
      {
        id: "1",
        sender: "other",
        text: "Hello! I saw your job posting for a Senior Software Engineer position and I'm very interested. Could you tell me more about the team I'd be working with?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: "2",
        sender: "user",
        text: "Hi Amal, thanks for reaching out! The team consists of 5 engineers working on our core product. We use React, Node.js, and AWS. Would you be available for an initial interview next week?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
      },
      {
        id: "3",
        sender: "other",
        text: "That sounds great! I have extensive experience with those technologies. I would be available for an interview on Tuesday or Thursday next week. What time works best for you?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
      },
    ],
  },
  "2": {
    id: "2",
    name: "Priya Jayawardena",
    role: "seeker",
    title: "UX/UI Designer",
    messages: [
      {
        id: "1",
        sender: "user",
        text: "Hi Priya, I reviewed your portfolio and I'm impressed with your design work. We're looking for a UX/UI designer for our new mobile app. Would you be interested?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
      {
        id: "2",
        sender: "other",
        text: "Hello! Thank you for reaching out. I would definitely be interested in learning more about the opportunity. Could you share more details about the project and timeline?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
      },
      {
        id: "3",
        sender: "user",
        text: "Of course! We're developing a fitness tracking app with a focus on community features. The timeline is approximately 3 months for the initial design phase. We'd need wireframes, user flows, and high-fidelity mockups. Does that align with your experience?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(),
      },
    ],
  },
  "3": {
    id: "3",
    name: "TechCorp Lanka",
    role: "poster",
    title: "Senior Software Engineer Position",
    messages: [
      {
        id: "1",
        sender: "other",
        text: "Hello! Thank you for your application to the Senior Software Engineer position at TechCorp Lanka. We've reviewed your profile and would like to schedule an initial interview. Are you available next week?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
      },
      {
        id: "2",
        sender: "user",
        text: "Hi! I'm very excited about this opportunity. I would be available for an interview on Monday or Wednesday next week. Could you please let me know what to expect during the interview?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 35).toISOString(),
      },
      {
        id: "3",
        sender: "other",
        text: "Great! Let's schedule for Wednesday at 10:00 AM. The interview will be about 45 minutes and will cover your technical experience, particularly with React and Node.js, as well as some behavioral questions. Could you also prepare to discuss a challenging project you've worked on recently?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 34).toISOString(),
      },
    ],
  },
  // Support conversations for admin view
  "support-1": {
    id: "support-1",
    name: "John Doe",
    role: "user",
    title: "Payment Issue",
    email: "john@example.com",
    isSupport: true,
    messages: [
      {
        id: "1",
        sender: "other",
        text: "Hello, I'm having trouble with my payment. It says the transaction failed but the money was deducted from my account.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "2",
        sender: "user",
        text: "I'm sorry to hear that. Could you please provide your transaction ID and the date of the transaction?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
      },
      {
        id: "3",
        sender: "other",
        text: "The transaction ID is TXN123456 and it happened yesterday around 3 PM.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
    ],
  },
  "support-2": {
    id: "support-2",
    name: "Sarah Williams",
    role: "user",
    title: "Profile Update Help",
    email: "sarah@example.com",
    isSupport: true,
    messages: [
      {
        id: "1",
        sender: "other",
        text: "Hi, I need help updating my profile. I can't seem to change my profile picture.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
      {
        id: "2",
        sender: "user",
        text: "Hello Sarah, I'd be happy to help. Are you getting any error messages when you try to upload a new picture?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.5).toISOString(),
      },
      {
        id: "3",
        sender: "other",
        text: "Yes, it says 'File format not supported'.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      },
    ],
  },
  // Support conversations for job seekers
  "support-js1": {
    id: "support-js1",
    name: "Amal Perera",
    role: "user",
    title: "Profile Verification",
    email: "amal@example.com",
    isSupport: true,
    messages: [
      {
        id: "1",
        sender: "other",
        text: "Hello, I submitted my profile for verification three days ago but haven't heard back. Could you please check the status?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      },
      {
        id: "2",
        sender: "user",
        text: "Hi Amal, I apologize for the delay. I've checked your profile and it's currently under review. We'll expedite the process and get back to you within 24 hours.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7.5).toISOString(),
      },
    ],
  },

  // Support conversations for jobs
  "support-job-j1": {
    id: "support-job-j1",
    name: "TechCorp Lanka",
    role: "user",
    title: "Job Posting Issue",
    email: "hr@techcorp.lk",
    isSupport: true,
    messages: [
      {
        id: "1",
        sender: "other",
        text: "We're trying to post a new job but keep getting an error about exceeding our limit. We should have 5 job postings available with our subscription.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      },
      {
        id: "2",
        sender: "user",
        text: "I'll look into this right away. Could you please try posting again in about 10 minutes? I'll reset your job posting counter.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 11.5).toISOString(),
      },
    ],
  },

  // Support conversations for reports
  "support-report-r1": {
    id: "support-report-r1",
    name: "Report Follow-up",
    role: "user",
    title: "Inappropriate Job Posting",
    email: "reports@ceylonworkforce.com",
    isSupport: true,
    messages: [
      {
        id: "1",
        sender: "other",
        text: "Following up on report #R-2023-45 about an inappropriate job posting. Has this been reviewed yet?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: "2",
        sender: "user",
        text: "Yes, we've reviewed the report and have taken down the job posting. Thank you for bringing this to our attention.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23.5).toISOString(),
      },
    ],
  },
}

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isLoading: userLoading } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [chat, setChat] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const userId = params.userId as string

  useEffect(() => {
    // Redirect if not logged in
    if (!userLoading && !user) {
      router.push("/login")
    }
  }, [user, userLoading, router])

  useEffect(() => {
    // Simulate loading chat data
    const timer = setTimeout(() => {
      // Get chat from mock data or create a new one
      const existingChat = MOCK_CHATS[userId]

      if (existingChat) {
        setChat(existingChat)
      } else {
        // Create a new chat for demo purposes
        const newChat = {
          id: userId,
          name: "New Contact",
          role: user?.role === "seeker" ? "poster" : "seeker",
          title: "New Conversation",
          messages: [],
        }
        setChat(newChat)
      }

      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [userId, user])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat?.messages])

  const handleSendMessage = () => {
    if (!message.trim() || !chat) return

    const newMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: message,
      timestamp: new Date().toISOString(),
    }

    // Update chat with new message
    setChat({
      ...chat,
      messages: [...(chat.messages || []), newMessage],
    })

    setMessage("")

    // Simulate response after a delay
    setTimeout(() => {
      const responseMessage = {
        id: (Date.now() + 1).toString(),
        sender: "other",
        text: "Thank you for your message. I'll get back to you soon!",
        timestamp: new Date().toISOString(),
      }

      setChat((prevChat: any) => ({
        ...prevChat,
        messages: [...(prevChat.messages || []), responseMessage],
      }))
    }, 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getBackLink = () => {
    if (user?.role === "admin") {
      return "/chat"
    } else if (user?.userType === "seeker") {
      return "/job-seekers"
    } else {
      return "/job-posters"
    }
  }

  if (userLoading || isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href={getBackLink()}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-primaryDark">
            {user?.role === "admin" ? "Client Support" : "Messages"}
          </h1>
        </div>

        <Card className="h-[calc(100vh-12rem)]">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-accent text-white">{chat?.name?.charAt(0) || "?"}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{chat?.name}</CardTitle>
                <CardDescription>
                  {chat?.isSupport && user?.role === "admin" ? chat?.email : chat?.title}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-[calc(100%-8rem)]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chat?.messages?.length > 0 ? (
                chat.messages.map((msg: any) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.sender === "user" ? "bg-accent text-white" : "bg-muted"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${msg.sender === "user" ? "text-white/70" : "text-muted-foreground"}`}
                      >
                        {formatDate(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <CardFooter className="border-t p-3">
            <div className="flex w-full gap-2">
              <Textarea
                placeholder="Type your message..."
                className="min-h-10 flex-1 resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button
                className="bg-accent hover:bg-accent/90 text-white"
                size="icon"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
