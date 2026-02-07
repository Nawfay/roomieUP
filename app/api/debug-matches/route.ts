import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth-middleware'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  const { userId, error, status } = await verifyAuthToken(request)
  
  if (error || !userId) {
    return NextResponse.json({ error }, { status })
  }

  try {
    // Get ALL matches (no filters) to see what's in the database
    const allMatchesSnapshot = await adminDb.collection('matches').get()
    
    const allMatches = allMatchesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Get matches with array-contains filter
    const userMatchesSnapshot = await adminDb
      .collection('matches')
      .where('users', 'array-contains', userId)
      .get()

    const userMatches = userMatchesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Get matched status ones
    const matchedSnapshot = await adminDb
      .collection('matches')
      .where('users', 'array-contains', userId)
      .where('status', '==', 'matched')
      .get()

    const matched = matchedSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({
      currentUserId: userId,
      allMatches,
      userMatches,
      matched,
      counts: {
        all: allMatches.length,
        userMatches: userMatches.length,
        matched: matched.length
      }
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: 'Failed to debug matches' },
      { status: 500 }
    )
  }
}
