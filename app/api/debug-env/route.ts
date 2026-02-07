import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT,
    serviceAccountLength: process.env.FIREBASE_SERVICE_ACCOUNT?.length || 0,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    // Don't log the actual credentials for security
  })
}
