import { NextRequest } from 'next/server'
import { adminAuth } from './firebase-admin'

export async function verifyAuthToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Unauthorized', status: 401, userId: null }
  }

  const token = authHeader.split('Bearer ')[1]

  try {
    const decodedToken = await adminAuth.verifyIdToken(token)
    return { userId: decodedToken.uid, error: null, status: 200 }
  } catch (error) {
    console.error('Token verification error:', error)
    return { error: 'Invalid token', status: 403, userId: null }
  }
}
