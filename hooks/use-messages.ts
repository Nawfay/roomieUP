import { useState, useEffect } from 'react'
import { auth, db } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore'

interface Message {
  id: string
  senderId: string
  text: string
  type: string
  createdAt: any
  read: boolean
}

export function useMessages(matchId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!matchId) return

    // Real-time listener for messages
    const messagesRef = collection(db, 'messages', matchId, 'chats')
    const q = query(messagesRef, orderBy('createdAt', 'asc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[]
        
        setMessages(msgs)
        setLoading(false)
      },
      (err) => {
        console.error('Messages listener error:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [matchId])

  const sendMessage = async (text: string) => {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Add message to subcollection
      const messagesRef = collection(db, 'messages', matchId, 'chats')
      await addDoc(messagesRef, {
        senderId: user.uid,
        text: text.trim(),
        type: 'text',
        createdAt: serverTimestamp(),
        read: false,
      })

      // Update last message in parent document
      const messageDocRef = doc(db, 'messages', matchId)
      await updateDoc(messageDocRef, {
        lastMessage: text.trim(),
        lastMessageAt: serverTimestamp(),
        lastMessageSender: user.uid,
      })

      return true
    } catch (err) {
      console.error('Send message error:', err)
      return false
    }
  }

  return { messages, loading, error, sendMessage }
}
