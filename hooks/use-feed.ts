import { useState, useEffect } from 'react'
import { auth } from '@/lib/firebase'

interface FeedItem {
  id: string
  [key: string]: any
}

interface FeedResponse {
  feed: FeedItem[]
  hasMore: boolean
}

export function useFeed(limit = 20) {
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)

  const fetchFeed = async () => {
    try {
      setLoading(true)
      setError(null)

      const user = auth.currentUser
      if (!user) {
        throw new Error('User not authenticated')
      }

      const token = await user.getIdToken()
      const url = new URL('/api/feed', window.location.origin)
      url.searchParams.set('limit', limit.toString())

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch feed')
      }

      const data: FeedResponse = await response.json()
      
      setFeed(data.feed)
      setHasMore(data.hasMore)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  const refresh = () => {
    fetchFeed()
  }

  return { feed, loading, error, hasMore, refresh }
}
