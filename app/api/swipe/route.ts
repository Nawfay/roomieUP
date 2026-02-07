import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthToken } from '@/lib/auth-middleware'
import { adminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(request: NextRequest) {
  const { userId, error, status } = await verifyAuthToken(request)
  
  if (error || !userId) {
    return NextResponse.json({ error }, { status })
  }

  try {
    const body = await request.json()
    const { targetUserId, action } = body // action: 'accept' or 'reject'

    if (!targetUserId || !action) {
      return NextResponse.json(
        { error: 'Missing targetUserId or action' },
        { status: 400 }
      )
    }

    // Update feed to mark user as shown
    await adminDb.collection('feeds').doc(userId).set({
      shownUsers: FieldValue.arrayUnion(targetUserId),
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true })

    if (action === 'reject') {
      return NextResponse.json({ success: true, matched: false })
    }

    // If accepting, create a match entry
    if (action === 'accept') {
      const matchId = [userId, targetUserId].sort().join('_')
      
      // Check if target user already accepted current user
      const matchDoc = await adminDb.collection('matches').doc(matchId).get()
      const matchData = matchDoc.data()

      // Check if the other user already accepted (their ID is in the users array)
      if (matchData && matchData.users && matchData.users.includes(targetUserId)) {
        // Mutual match! Add current user and update status
        await adminDb.collection('matches').doc(matchId).update({
          users: FieldValue.arrayUnion(userId),
          status: 'matched',
          matchedAt: FieldValue.serverTimestamp(),
        })

        // Create message thread
        await adminDb.collection('messages').doc(matchId).set({
          participants: [userId, targetUserId],
          createdAt: FieldValue.serverTimestamp(),
          lastMessage: null,
          lastMessageAt: null,
        })

        return NextResponse.json({ 
          success: true, 
          matched: true,
          matchId 
        })
      } else {
        // First accept - create or update match entry
        await adminDb.collection('matches').doc(matchId).set({
          users: FieldValue.arrayUnion(userId),
          status: 'pending',
          createdAt: FieldValue.serverTimestamp(),
        }, { merge: true })

        return NextResponse.json({ 
          success: true, 
          matched: false 
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Swipe error:', error)
    return NextResponse.json(
      { error: 'Failed to process swipe' },
      { status: 500 }
    )
  }
}
