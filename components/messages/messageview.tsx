"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, MoreVertical, ImageIcon } from "lucide-react"
import { useMessages } from "@/hooks/use-messages"
import { auth } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

function RainbowArcs() {
  return (
    <div className="fixed top-0 right-0 -z-10 overflow-hidden pointer-events-none">
      <svg width="320" height="600" viewBox="0 0 320 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 320 0 Q 200 150 200 300 Q 200 450 320 600" fill="#F09A7E" opacity="0.8" />
        <path d="M 320 0 Q 220 150 220 300 Q 220 450 320 600" fill="#F0A01E" opacity="0.8" />
        <path d="M 320 0 Q 240 150 240 300 Q 240 450 320 600" fill="#F4D58D" opacity="0.8" />
        <path d="M 320 0 Q 260 150 260 300 Q 260 450 320 600" fill="#E4BFC8" opacity="0.8" />
      </svg>
    </div>
  )
}

interface MessagesViewProps {
  matchId: string
}

export function MessagesView({ matchId }: MessagesViewProps) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [otherUser, setOtherUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, loading, sendMessage } = useMessages(matchId)
  const currentUserId = auth.currentUser?.uid

  // Get other user's info
  useEffect(() => {
    const fetchOtherUser = async () => {
      if (!currentUserId) return
      
      const userIds = matchId.split('_')
      const otherUserId = userIds.find(id => id !== currentUserId)
      
      if (otherUserId) {
        const userDoc = await getDoc(doc(db, 'users', otherUserId))
        if (userDoc.exists()) {
          setOtherUser({ id: otherUserId, ...userDoc.data() })
        }
      }
    }
    
    fetchOtherUser()
  }, [matchId, currentUserId])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (message.trim()) {
      const success = await sendMessage(message)
      if (success) {
        setMessage("")
      }
    }
  }

  const formatTime = (timestamp: any) => {
    if (!timestamp) return ''
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <main className="relative flex min-h-svh flex-col bg-[#FFF0D1]">
      <RainbowArcs />

      {/* Header */}
      <header className="relative z-10 bg-[#FFF8E1] border-b-2 border-[#F0A01E]">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-8 w-8 items-center justify-center text-[#E8453C] hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-2">
            {otherUser ? (
              <>
                <div className="h-8 w-8 rounded-full border-2 border-[#E8453C] overflow-hidden">
                  <img
                    src={otherUser.profileImage || otherUser.photoURL || "/placeholder.svg"}
                    alt={otherUser.displayName || otherUser.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="font-serif text-base font-semibold text-foreground">
                  {otherUser.displayName || otherUser.name}
                </span>
              </>
            ) : (
              <span className="font-serif text-base font-semibold text-foreground">Loading...</span>
            )}
          </div>

          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center text-[#E8453C] hover:opacity-70 transition-opacity"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        {/* House Recommendation Banner */}
        <div className="mx-4 mb-4 rounded-2xl bg-gradient-to-r from-[#E8453C] to-[#F0851E] p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <img 
                src="https://i.imgur.com/Wa8d9fR.png" 
                alt="House" 
                className="w-16 h-16 object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-sm font-bold text-white mb-1">
                Based on both of your traits, here is a house recommended for you:
              </h3>
              <p className="text-xs text-white/90 leading-relaxed">
                We match houses based on your combined preferences and budget.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages area */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#E8453C] border-t-transparent" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-sm text-foreground/40 font-medium">No messages yet</p>
            <p className="text-xs text-foreground/30 mt-1">Say hi to start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => {
              const isOwn = msg.senderId === currentUserId
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-[#E8453C] text-white'
                        : 'bg-[#FFF8E1] border border-[#F0A01E] text-foreground'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${isOwn ? 'text-white/70' : 'text-foreground/50'}`}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="relative z-10 bg-[#FFF8E1] border-t-2 border-[#F0A01E] px-4 pt-3 pb-4">
        {/* Message input */}
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Type a message ..."
            className="flex-1 h-10 rounded-full border border-foreground/20 bg-white/50 px-4 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-[#E8453C] transition-colors"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="text-sm font-semibold text-foreground/50 hover:text-[#E8453C] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            SEND
          </button>
        </div>

        {/* Icon toolbar */}
        <div className="flex items-center justify-around mb-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C8B9E] text-white hover:opacity-80 transition-opacity"
          >
            <ImageIcon className="h-5 w-5" />
          </button>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C8B9E] text-white hover:opacity-80 transition-opacity"
          >
            <span className="text-xs font-bold">GIF</span>
          </button>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C8B9E] text-white hover:opacity-80 transition-opacity"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z"/>
            </svg>
          </button>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C8B9E] text-white hover:opacity-80 transition-opacity"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </button>
        </div>

        {/* Retro stripes */}
        <div className="flex items-end justify-center gap-[2px]">
          <div className="h-1 w-8 rounded-full bg-[#E8453C]" />
          <div className="h-1 w-8 rounded-full bg-[#F0851E]" />
          <div className="h-1 w-8 rounded-full bg-[#F0A01E]" />
          <div className="h-1 w-6 rounded-full bg-[#F2C9D0]" />
          <div className="h-1 w-6 rounded-full bg-[#C4BFC6]" />
        </div>
      </div>
    </main>
  )
}
