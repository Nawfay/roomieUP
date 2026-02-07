import { useState } from 'react'
import { auth } from '@/lib/firebase'

interface SwipeResponse {
  success: boolean
  matched: boolean
  matchId?: string
}

export function useSwipe() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const swipe = async (targetUserId: string, action: 'accept' | 'reject'): Promise<SwipeResponse | null> => {
    try {
      setLoading(true)
      setError(null)

      const user = auth.currentUser
      if (!user) {
        throw new Error('User not authenticated')
      }

      const token = await user.getIdToken()
      const response = await fetch('/api/swipe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUserId, action }),
      })

      if (!response.ok) {
        throw new Error('Failed to process swipe')
      }

      const data: SwipeResponse = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }

  const accept = (targetUserId: string) => swipe(targetUserId, 'accept')
  const reject = (targetUserId: string) => swipe(targetUserId, 'reject')

  return { accept, reject, loading, error }
}
