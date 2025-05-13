"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, ArrowLeft } from "lucide-react"

// Firestore imports
import { db } from "@/lib/firebase"
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"

interface ChatSummary {
  chatId: string
  otherUserId: string
  name?: string
  email?: string
  avatar?: string
  lastMessage?: string
  lastTimestamp?: Date
  unreadCount?: number
}

interface Message {
  id: string
  senderId: string
  text: string
  timestamp: any
}

export default function ChatPage() {
  const router = useRouter()
  const { user, isLoading: userLoading } = useUser()
  const [loadingList, setLoadingList] = useState(true)
  const [chatSummaries, setChatSummaries] = useState<ChatSummary[]>([])

  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [activeOtherUser, setActiveOtherUser] = useState<{ name?: string; email?: string; avatar?: string } | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingChat, setLoadingChat] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const endRef = useRef<HTMLDivElement>(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !userLoading) router.push("/login")
  }, [user, userLoading, router])

  // Fetch chat list
  useEffect(() => {
    if (!user) return
    const q = query(collection(db, "chats"), where("participants", "array-contains", user.id))
    const unsub = onSnapshot(q, async (snap) => {
      const list: ChatSummary[] = []
      for (const cs of snap.docs) {
        const data = cs.data()
        const participants: string[] = data.participants || []
        const otherId = participants.find((id) => id !== user.id)
        if (!otherId) continue
        const pd = await getDoc(doc(db, "users", otherId))
        const prof = pd.exists() ? pd.data() : {}
        const msgs = await getDocs(collection(db, "chats", cs.id, "messages"))
        let lastTs: Date | undefined
        let lastTxt: string | undefined
        msgs.forEach((m) => {
          const md = m.data()
          const ts = md.timestamp?.toDate()
          if (!lastTs || (ts && ts > lastTs)) {
            lastTs = ts
            lastTxt = md.text
          }
        })
        const unread = (data.unreadCounts?.[user.id] as number) || 0
        list.push({
          chatId: cs.id,
          otherUserId: otherId,
          name: prof.name,
          email: prof.email,
          avatar: prof.name?.charAt(0).toUpperCase(),
          lastMessage: lastTxt,
          lastTimestamp: lastTs,
          unreadCount: unread,
        })
      }
      list.sort((a, b) => (b.lastTimestamp?.getTime() || 0) - (a.lastTimestamp?.getTime() || 0))
      setChatSummaries(list)
      setLoadingList(false)
    })
    return () => unsub()
  }, [user])

  // Load active chat messages
  useEffect(() => {
    if (!user || !activeChatId) return
    setLoadingChat(true)
    const chatRef = doc(db, "chats", activeChatId)
    updateDoc(chatRef, { [`unreadCounts.${user.id}`]: 0 }).catch(console.error)
    const sel = chatSummaries.find(c => c.chatId === activeChatId)
    if (sel) setActiveOtherUser({ name: sel.name, email: sel.email, avatar: sel.avatar })
    const mq = query(collection(chatRef, "messages"), orderBy("timestamp", "asc"))
    const unsub = onSnapshot(mq, snap => {
      const arr: Message[] = []
      snap.docs.forEach(d => arr.push({ id: d.id, ...(d.data() as any) }))
      setMessages(arr)
      setLoadingChat(false)
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, console.error)
    return () => unsub()
  }, [activeChatId, user, chatSummaries])

  const send = async () => {
    if (!newMessage.trim() || !activeChatId || !user) return
    const txt = newMessage.trim()
    setNewMessage("")
    const msgs = collection(db, "chats", activeChatId, "messages")
    await addDoc(msgs, { senderId: user.id, text: txt, timestamp: serverTimestamp() })
    const chatRef = doc(db, "chats", activeChatId)
    updateDoc(chatRef, { [`unreadCounts.${activeOtherUser?.email}`]: (chatSummaries.find(c => c.chatId === activeChatId)?.unreadCount || 0) + 1 }).catch(console.error)
  }

  if (userLoading || loadingList) return (
    <div className="container flex items-center justify-center min-h-[70vh]">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  )

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/chat">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-primaryDark">Messages</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Conversations list */}
        <Card className="h-[70vh]">
          <CardHeader className="p-4 border-b"><CardTitle>Conversations</CardTitle></CardHeader>
          <CardContent className="p-0 overflow-y-auto">
            {chatSummaries.map(c => (
              <div key={c.chatId} className={`flex items-center gap-3 p-4 hover:bg-muted cursor-pointer border-b ${activeChatId === c.chatId ? 'bg-muted' : ''}`} onClick={() => setActiveChatId(c.chatId)}>
                <Avatar><AvatarFallback className="bg-accent text-white">{c.avatar || '?'}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{c.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{c.lastMessage || 'Start conversation'}</p>
                </div>
                {c.unreadCount! > 0 && <Badge>{c.unreadCount}</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Chat detail */}
        <Card className="md:col-span-2 flex flex-col h-[70vh]">
          <CardHeader className="p-4 border-b">
            {activeOtherUser ? (
              <div className="flex items-center gap-3">
                <Avatar><AvatarFallback className="bg-accent text-white">{activeOtherUser.avatar}</AvatarFallback></Avatar>
                <div>
                  <CardTitle>{activeOtherUser.name}</CardTitle>
                  <CardDescription>{activeOtherUser.email}</CardDescription>
                </div>
              </div>
            ) : (
              <CardTitle>Select a conversation</CardTitle>
            )}
          </CardHeader>

          {activeChatId ? (
            <>
              <CardContent className="p-0 flex-1 overflow-y-auto space-y-4 px-4 py-2">
                {loadingChat ? <Loader2 className="animate-spin text-accent mx-auto" /> : (
                  messages.map(m => (
                    <div key={m.id} className={`flex ${m.senderId === user!.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${m.senderId === user!.id ? 'bg-accent text-white' : 'bg-muted'}`}>
                        <p>{m.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(m.timestamp?.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={endRef} />
              </CardContent>
              <CardFooter className="border-t p-3">
                <div className="flex gap-2 w-full">
                  <Textarea
                    autoFocus
                    placeholder="Type your message..."
                    className="w-full resize-none"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                  />
                  <Button onClick={send} disabled={!newMessage.trim()} className="flex-shrink-0">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </CardFooter>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
              <p>Please select a conversation to get started.</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}