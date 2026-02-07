import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth-middleware'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  const { userId, error, status } = await verifyAuthToken(request)
  
  if (error || !userId) {
    return NextResponse.json({ error }, { status })
  }

  try {
    console.log('=== MATCHES DEBUG ===')
    console.log('Current user ID:', userId)
    
    // Get all matched documents - we'll filter by checking the document ID
    const matchesSnapshot = await adminDb
      .collection('matches')
      .where('status', '==', 'matched')
      .get()

    console.log('Total matched documents:', matchesSnapshot.size)
    
    // Filter matches where current user is in the match ID
    const userMatches = matchesSnapshot.docs.filter(doc => {
      const matchId = doc.id
      // Match ID format is "userId1_userId2" (sorted)
      return matchId.includes(userId)
    })
    
    console.log('Matches for current user:', userMatches.length)

    const matches = await Promise.all(
      userMatches.map(async (doc) => {
        const matchData = doc.data()
        const matchId = doc.id
        
        console.log('Processing match:', matchId)
        
        // Extract the other user ID from the match ID
        // Match ID format: "userId1_userId2" (sorted alphabetically)
        const userIds = matchId.split('_')
        const otherUserId = userIds.find(id => id !== userId)
        
        console.log('Other user ID from match ID:', otherUserId)
        
        if (!otherUserId) {
          console.warn(`Could not extract other user ID from match: ${matchId}`)
          return null
        }
        
        // Get other user's profile
        const otherUserDoc = await adminDb.collection('users').doc(otherUserId).get()
        
        console.log('Other user exists:', otherUserDoc.exists)
        
        if (!otherUserDoc.exists) {
          console.warn(`User ${otherUserId} not found in users collection`)
          return null
        }
        
        const otherUserData = otherUserDoc.data()
        console.log('Other user full data:', JSON.stringify(otherUserData, null, 2))

        return {
          matchId: doc.id,
          user: {
            id: otherUserId,
            ...otherUserData,
            email: undefined, // Remove sensitive data
          },
          matchedAt: matchData.matchedAt,
        }
      })
    )

    // Filter out null values from failed matches
    const validMatches = matches.filter(match => match !== null)
    
    console.log('Valid matches count:', validMatches.length)
    console.log('=== END DEBUG ===')

    return NextResponse.json({ matches: validMatches })
  } catch (error) {
    console.error('Matches fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}
