import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    // Simple test to verify admin SDK is working
    const testDoc = await adminDb.collection('_test').doc('connection').get()
    
    return NextResponse.json({ 
      success: true,
      message: 'Firebase Admin SDK is configured correctly!',
      connected: true
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Firebase Admin SDK configuration failed'
      },
      { status: 500 }
    )
  }
}
