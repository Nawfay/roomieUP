import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth-middleware'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  // Verify user authentication
  const { userId, error, status } = await verifyAuthToken(request)
  
  if (error || !userId) {
    return NextResponse.json({ error }, { status })
  }

  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '20')

    // Get user's feed document to see who they've already been shown
    const feedDoc = await adminDb.collection('feeds').doc(userId).get()
    const feedData = feedDoc.data()
    const shownUserIds = feedData?.shownUsers || []

    // Get all users except current user and already shown users
    const usersSnapshot = await adminDb.collection('users').get()
    
    const unseenUsers = usersSnapshot.docs
      .filter(doc => 
        doc.id !== userId && // Not current user
        !shownUserIds.includes(doc.id) // Not already shown
      )
      .slice(0, limit)
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Remove sensitive fields
        email: undefined,
      }))

    return NextResponse.json({
      feed: unseenUsers,
      hasMore: unseenUsers.length === limit,
    })
  } catch (error) {
    console.error('Feed generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate feed' },
      { status: 500 }
    )
  }
}
