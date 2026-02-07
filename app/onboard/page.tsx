"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { OnboardingQuiz } from "@/components/onboarding/onboarding-quiz"

export default function OnboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showQuiz, setShowQuiz] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signup")
        return
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        const userData = userDoc.data()

        if (userData?.onboardingComplete) {
          router.push("/bio")
        } else if (userData?.profileComplete) {
          router.push("/discover")
        } else {
          setShowQuiz(true)
        }
      } catch (error) {
        console.error("Error checking profile status:", error)
        setShowQuiz(true)
      } finally {
        setIsLoading(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-foreground/70">Loading...</p>
      </div>
    )
  }

  if (!showQuiz) {
    return null
  }

  return <OnboardingQuiz />
}
