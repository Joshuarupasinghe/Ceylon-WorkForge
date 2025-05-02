"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Send, Info, MessageSquare, User, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock admin data
const ADMIN = {
  id: "admin-1",
  name: "Support Team",
  avatar: "ST",
  status: "online",
}

// Mock support conversations data
const MOCK_SUPPORT_CONVERSATIONS = [
  {
    id: "support-1",
    name: "John Doe",
    avatar: "JD",
    email: "john@example.com",
    isSupport: true,
    lastMessage: "I'm having trouble with my payment.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    unread: 2,
  },
  {
    id: "support-2",
    name: "Sarah Williams",
    avatar: "SW",
    email: "sarah@example.com",
    isSupport: true,
    lastMessage: "How do I update my profile?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    unread: 0,
  },
  {
    id: "support-3",
    name: "Michael Chen",
    avatar: "MC",
    email: "michael@example.com",
    isSupport: true,
    lastMessage: "I need to change my account type.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unread: 1,
  },
]

// Mock regular conversations data
const MOCK_REGULAR_CONVERSATIONS = [
  {
    id: "admin-help",
    name: "Admin Support",
    avatar: "AS",
    isAdmin: true,
    isSupport: false,
    lastMessage: "How can we help you today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unread: 0,
  },
  {
    id: "1",
    name: "Amal Perera",
    avatar: "AP",
    isAdmin: false,
    isSupport: false,
    lastMessage: "Thanks for your response. I'll check the job details.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    unread: 2,
  },
  {
    id: "2",
    name: "Priya Jayawardena",
    avatar: "PJ",
    isAdmin: false,
    isSupport: false,
    lastMessage: "I'm interested in the UX/UI Designer position.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unread: 0,
  },
  {
    id: "3",
    name: "TechCorp Lanka",
    avatar: "TC",
    isAdmin: false,
    isSupport: false,
    lastMessage: "We'll schedule the interview for Wednesday at 10 AM.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    unread: 0,
  },
]

// Mock messages for admin help
const MOCK_ADMIN_MESSAGES = [
  {
    id: "1",
    sender: "admin",
    text: "Hello! Welcome to Ceylon Work Force support. How can we help you today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
]

// Mock messages for support conversations
const MOCK_SUPPORT_MESSAGES = {
  "support-1": [
    {
      id: "1",
      sender: "user",
      text: "Hello, I'm having trouble with my payment. It says the transaction failed but the money was deducted from my account.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "2",
      sender: "admin",
      text: "I'm sorry to hear that. Could you please provide your transaction ID and the date of the transaction?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
    },
    {
      id: "3",
      sender: "user",
      text: "The transaction ID is TXN123456 and it happened yesterday around 3 PM.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ],
  "support-2": [
    {
      id: "1",
      sender: "user",
      text: "Hi, I need help updating my profile. I can't seem to change my profile picture.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "2",
      sender: "admin",
      text: "Hello Sarah, I'd be happy to help. Are you getting any error messages when you try to upload a new picture?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.5).toISOString(),
    },
    {
      id: "3",
      sender: "user",
      text: "Yes, it says 'File format not supported'.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
  ],
  "support-3": [
    {
      id: "1",
      sender: "user",
      text: "Hello, I need to change my account from job seeker to job poster. Is that possible?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    },
    {
      id: "2",
      sender: "admin",
      text: "Hi Michael, yes that's possible. You can change your account type in the role selection page. Would you like me to guide you through the process?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24.5).toISOString(),
    },
  ],
}

export default function ChatPage() {
  const router = useRouter()
  const { user, isLoading: userLoading } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("support")
  const [message, setMessage] = useState("")
  const [conversations, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [activeConversation, setActiveConversation] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Redirect if not logged in
    if (!userLoading && !user) {
      router.push("/login")
      return
    }

    // Simulate loading data
    const timer = setTimeout(() => {
      // Set up conversations based on user role
      if (user?.role === "admin") {
        // Admin sees support conversations
        setConversations(MOCK_SUPPORT_CONVERSATIONS)
        if (MOCK_SUPPORT_CONVERSATIONS.length > 0) {
          setActiveConversation(MOCK_SUPPORT_CONVERSATIONS[0])
          setMessages(MOCK_SUPPORT_MESSAGES[MOCK_SUPPORT_CONVERSATIONS[0].id] || [])
        }
        setActiveTab("client-support")
      } else {
        // Regular users see both support and regular conversations
        setConversations(MOCK_REGULAR_CONVERSATIONS)
        setActiveConversation(MOCK_REGULAR_CONVERSATIONS[0])
        setMessages(MOCK_ADMIN_MESSAGES)
      }

      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [user, userLoading, router])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: Date.now().toString(),
      sender: user?.role === "admin" ? "admin" : "user",
      text: message,
      timestamp: new Date().toISOString(),
    }

    // Add message to the current conversation
    setMessages((prev) => [...prev, newMessage])
    setMessage("")

    // Simulate response after a delay if user is not admin
    if (user?.role !== "admin" && activeTab === "support") {
      setTimeout(() => {
        const adminResponse = {
          id: (Date.now() + 1).toString(),
          sender: "admin",
          text: "Thank you for your message. Our team will review your inquiry and get back to you shortly. Is there anything else we can help you with?",
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, adminResponse])
      }, 2000)
    }
  }

  const handleConversationSelect = (conversation: any) => {
    setActiveConversation(conversation)

    // Load messages for this conversation
    if (user?.role === "admin" && conversation.isSupport) {
      // Admin viewing support conversation
      setMessages(MOCK_SUPPORT_MESSAGES[conversation.id] || [])
    } else if (conversation.isAdmin) {
      // User viewing admin support
      setActiveTab("support")
      setMessages(MOCK_ADMIN_MESSAGES)
    } else {
      // User viewing regular conversation
      setActiveTab("messages")
      // For demo, we'll just clear the messages
      setMessages([])
    }

    // Mark conversation as read
    setConversations(conversations.map((conv) => (conv.id === conversation.id ? { ...conv, unread: 0 } : conv)))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatConversationDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primaryDark mb-2">Messages</h1>
        {user?.role === "admin" ? (
          <p className="text-muted-foreground mb-6">Manage client support inquiries</p>
        ) : (
          <p className="text-muted-foreground mb-6">Chat with support or your connections</p>
        )}

        {user?.role === "admin" ? (
          // Admin view - only client support tab
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="h-[calc(75vh-8rem)]">
                <CardHeader className="p-4 border-b">
                  <CardTitle className="text-lg">Client Support Inquiries</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[calc(75vh-16rem)] overflow-y-auto">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer border-b ${
                          activeConversation?.id === conversation.id ? "bg-muted" : ""
                        }`}
                        onClick={() => handleConversationSelect(conversation)}
                      >
                        <Avatar>
                          <AvatarFallback className="bg-accent">{conversation.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium truncate">{conversation.name}</h3>
                            <span className="text-xs text-muted-foreground">
                              {formatConversationDate(conversation.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{conversation.email}</p>
                          <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        </div>
                        {conversation.unread > 0 && (
                          <Badge className="bg-accent text-white">{conversation.unread}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card className="h-[calc(75vh-8rem)]">
                <CardHeader className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    {activeConversation ? (
                      <>
                        <Avatar>
                          <AvatarFallback className="bg-accent">{activeConversation.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{activeConversation.name}</CardTitle>
                          <CardDescription>{activeConversation.email}</CardDescription>
                        </div>
                      </>
                    ) : (
                      <CardTitle className="text-lg">Select a conversation</CardTitle>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-0 flex flex-col h-[calc(75vh-20rem)]">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {activeConversation ? (
                      messages.length > 0 ? (
                        messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                msg.sender === "admin" ? "bg-accent text-white" : "bg-muted"
                              }`}
                            >
                              <p>{msg.text}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  msg.sender === "admin" ? "text-white/70" : "text-muted-foreground"
                                }`}
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
                      )
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>Select a conversation to view messages</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>

                <CardFooter className="border-t p-3">
                  <div className="flex w-full gap-2">
                    <Textarea
                      placeholder={
                        activeConversation ? "Type your message..." : "Select a conversation to start messaging"
                      }
                      className="min-h-10 flex-1 resize-none"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={!activeConversation}
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
                      disabled={!activeConversation || !message.trim()}
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          // Regular user view - both tabs
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="support" className="flex items-center gap-1">
                <Info className="h-4 w-4" />
                Admin Support
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Messages
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card className="h-[calc(75vh-8rem)]">
                  <CardHeader className="p-4 border-b">
                    <CardTitle className="text-lg">Conversations</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[calc(75vh-16rem)] overflow-y-auto">
                      {conversations
                        .filter((conv) => (activeTab === "support" ? conv.isAdmin : !conv.isAdmin))
                        .map((conversation) => (
                          <div
                            key={conversation.id}
                            className={`flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer border-b ${
                              activeConversation?.id === conversation.id ? "bg-muted" : ""
                            }`}
                            onClick={() => handleConversationSelect(conversation)}
                          >
                            <Avatar>
                              <AvatarFallback className={conversation.isAdmin ? "bg-primaryDark" : "bg-accent"}>
                                {conversation.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium truncate">{conversation.name}</h3>
                                <span className="text-xs text-muted-foreground">
                                  {formatConversationDate(conversation.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                            </div>
                            {conversation.unread > 0 && (
                              <Badge className="bg-accent text-white">{conversation.unread}</Badge>
                            )}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="md:col-span-2">
                <Card className="h-[calc(75vh-8rem)]">
                  <CardHeader className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className={activeConversation?.isAdmin ? "bg-primaryDark" : "bg-accent"}>
                          {activeConversation?.avatar || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{activeConversation?.name || "Select a conversation"}</CardTitle>
                        <CardDescription>
                          {activeConversation?.isAdmin ? (
                            <div className="flex items-center gap-1">
                              <span className="h-2 w-2 rounded-full bg-green-500"></span>
                              <span>Online</span>
                            </div>
                          ) : activeConversation ? (
                            <div className="flex items-center gap-1">
                              {user?.userType === "seeker" ? (
                                <>
                                  <Briefcase className="h-3 w-3" />
                                  <span>Employer</span>
                                </>
                              ) : (
                                <>
                                  <User className="h-3 w-3" />
                                  <span>Job Seeker</span>
                                </>
                              )}
                            </div>
                          ) : null}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 flex flex-col h-[calc(75vh-20rem)]">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.length > 0 ? (
                        messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                msg.sender === "user" ? "bg-accent text-white" : "bg-muted"
                              }`}
                            >
                              <p>{msg.text}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  msg.sender === "user" ? "text-white/70" : "text-muted-foreground"
                                }`}
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
          </Tabs>
        )}
      </div>
    </div>
  )
}
