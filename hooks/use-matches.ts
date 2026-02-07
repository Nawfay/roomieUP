import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'

interface Match {
  matchId: string
  user: {
    id: string
    [key: string]: any
  }
  matchedAt: any
}

interface MatchesResponse {
  matches: Match[]
}

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMatches = async () => {
    try {
      setLoading(true)
      setError(null)

      const user = auth.currentUser
      if (!user) {
        throw new Error('User not authenticated')
      }

      const token = await user.getIdToken()
      const response = await fetch('/api/matches', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch matches')
      }

      const data: MatchesResponse = await response.json()
      setMatches(data.matches)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [])

  const refresh = () => {
    fetchMatches()
  }

  return { matches, loading, error, refresh }
}
