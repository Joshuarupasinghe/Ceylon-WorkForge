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

// Firestore imports
import { db } from "@/lib/firebase"
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore"

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const { user, isLoading: userLoading } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [otherUserProfile, setOtherUserProfile] = useState<{ name?: string; email?: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const otherUserId = params.userId as string

  // Determine chat document ID by sorting both user IDs
  const chatId = user && [user.id, otherUserId].sort().join("_")
  const chatDocRef = user ? doc(db, "chats", chatId!) : null
  const messagesColRef = chatDocRef ? collection(chatDocRef, "messages") : null

  // Fetch other user's name & email for header
  useEffect(() => {
    if (!otherUserId) return
    const fetchProfile = async () => {
      try {
        const userSnap = await getDoc(doc(db, "users", otherUserId))
        if (userSnap.exists()) setOtherUserProfile(userSnap.data() as any)
      } catch (err) {
        console.error("Failed to fetch user profile", err)
      }
    }
    fetchProfile()
  }, [otherUserId])

  useEffect(() => {
    if (!user) return

    const setupChat = async () => {
      // Create chat doc if it doesn't exist
      const snap = await getDoc(chatDocRef!)  
      if (!snap.exists()) {
        await setDoc(chatDocRef!, {
          participants: [user.id, otherUserId],
          createdAt: serverTimestamp(),
        })
      }

      // Subscribe to messages
      const q = query(messagesColRef!, orderBy("timestamp", "asc"))
      return onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
        setIsLoading(false)
      })
    }

    const unsubscribe = setupChat()
    return () => {
      if (typeof unsubscribe === "function") unsubscribe()
    }
  }, [user, otherUserId])

  const handleSend = async () => {
    if (!messageText.trim() || !messagesColRef) return
    await addDoc(messagesColRef, {
      senderId: user!.id,
      text: messageText.trim(),
      timestamp: serverTimestamp(),
    })
    setMessageText("")
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatDate = (date: any) => {
    if (!date) return ""
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const getBackLink = () => {
    if (user?.role === "admin") return "/chat"
    else if (user?.userType === "seeker") return "/job-seekers"
    else return "/job-posters"
  }

  // Redirect if not logged in or still loading
  useEffect(() => {
    if (!userLoading && !user) router.push("/login")
  }, [user, userLoading, router])

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
          <div>
            <h1 className="text-2xl font-bold text-primaryDark">
              {user?.role === "admin" ? "Client Support" : "Messages"}
            </h1>
          </div>
        </div>

        <Card className="h-[calc(100vh-12rem)]">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-accent text-white">
                  {otherUserProfile?.name?.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{otherUserProfile?.name || otherUserId}</CardTitle>
                <CardDescription>
                  {otherUserProfile?.email || ""}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-[calc(100%-8rem)]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user!.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.senderId === user!.id ? "bg-accent text-white" : "bg-muted"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.senderId === user!.id ? "text-white/70" : "text-muted-foreground"}`}>
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
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
              />
              <Button
                className="bg-accent hover:bg-accent/90 text-white"
                size="icon"
                onClick={handleSend}
                disabled={!messageText.trim()}
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
