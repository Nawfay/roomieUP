"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth"
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export function SignupForm() {
  const [studentEmail, setStudentEmail] = useState("")
  const [studentNumber, setStudentNumber] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, check their profile status
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          if (userData.profileComplete) {
            router.push("/discover")
          } else {
            router.push("/onboard")
          }
        }
      }
    })

    return () => unsubscribe()
  }, [router])

  const createUserDocument = async (userId: string, email: string, studentEmailInput: string, studentNum: string, displayName: string) => {
    try {
      await setDoc(doc(db, "users", userId), {
        email: email,
        studentEmail: studentEmailInput,
        fullName: displayName,
        studentNumber: studentNum,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        profileComplete: false,
      })
    } catch (err) {
      console.error("Error creating user document:", err)
      throw err
    }
  }

  const handleGoogleSignup = async () => {
    if (!studentEmail || !studentNumber) {
      setError("Please enter your student email and number first")
      return
    }

    setLoading(true)
    setError("")

    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        login_hint: studentEmail
      })
      
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      
      // Create user document in Firestore
      await createUserDocument(
        user.uid,
        user.email || "",
        studentEmail,
        studentNumber,
        user.displayName || ""
      )
      
      console.log("User signed up:", user)
      // New users always go to onboarding
      router.push("/onboard")
    } catch (err: any) {
      setError(err.message || "Failed to sign up with Google")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border/30 bg-transparent p-8">
      <div className="mb-8 text-center">
        <h2 className="font-serif text-4xl font-bold text-foreground">Sign Up</h2>
        <p className="mt-2 text-sm text-foreground/70">
          {"Already have an account? "}
          <Link href="/" className="font-semibold text-primary hover:underline">
            Log In
          </Link>
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="studentEmail" className="text-sm font-medium text-foreground">
            Student Email
          </label>
          <input
            id="studentEmail"
            type="email"
            placeholder="your.email@student.edu"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            className="h-11 rounded-lg border border-white/30 bg-white/60 px-4 text-foreground placeholder:text-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="studentNumber" className="text-sm font-medium text-foreground">
            Student Number
          </label>
          <input
            id="studentNumber"
            type="text"
            placeholder="e.g., 123456789"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            className="h-11 rounded-lg border border-white/30 bg-white/60 px-4 text-foreground placeholder:text-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={loading}
          />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={!studentEmail || !studentNumber || loading}
          className="w-full h-12 rounded-full bg-white/70 text-foreground font-semibold text-base shadow-md hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
          aria-label="Sign up with Google"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {loading ? "Signing up..." : "Sign up with Google"}
        </button>
      </div>
    </div>
  )
}
