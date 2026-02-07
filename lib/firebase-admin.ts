import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

let adminApp: App

function getAdminApp() {
  if (getApps().length === 0) {
    // Check for service account credentials
    if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT environment variable is not set. ' +
        'Please add your Firebase Admin SDK credentials to .env.local'
      )
    }

    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      adminApp = initializeApp({
        credential: cert(serviceAccount),
      })
    } catch (error) {
      throw new Error(
        'Failed to parse FIREBASE_SERVICE_ACCOUNT. ' +
        'Make sure it contains valid JSON from your Firebase service account.'
      )
    }
  } else {
    adminApp = getApps()[0]
  }
  return adminApp
}

export const adminAuth = getAuth(getAdminApp())
export const adminDb = getFirestore(getAdminApp())
